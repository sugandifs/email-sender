import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { MongoClient } from "mongodb";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface SendCampaignRequest {
  subject: string;
  htmlContent: string;
  recipientSource: "database" | "custom";
  emails?: string[];
  bannerImage?: string; // base64 encoded
  // Database filters
  year?: number;
  cycle?: string;
  status?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SendCampaignRequest = await request.json();
    let recipients: string[] = [];

    // Get recipients based on source
    if (body.recipientSource === "database") {
      // Fetch from MongoDB
      recipients = await getRecipientsFromDatabase(
        body.year!,
        body.cycle!,
        body.status!,
      );
    } else {
      recipients = body.emails || [];
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: "No recipients found" },
        { status: 400 },
      );
    }

    // Send emails in batches of 100
    const batchSize = 100;
    const batches = Math.ceil(recipients.length / batchSize);

    for (let i = 0; i < batches; i++) {
      const batchRecipients = recipients.slice(
        i * batchSize,
        (i + 1) * batchSize,
      );

      const msg: any = {
        from: {
          email: process.env.FROM_EMAIL!,
          name: process.env.FROM_NAME!,
        },
        subject: body.subject,
        html: body.htmlContent,
        personalizations: batchRecipients.map((email) => ({
          to: [{ email: process.env.FROM_EMAIL! }], // Use FROM_EMAIL instead of hardcoded
          bcc: [{ email }],
        })),
      };

      // Add banner image as attachment if provided
      if (body.bannerImage) {
        msg.attachments = [
          {
            content: body.bannerImage,
            filename: "logo.png",
            type: "image/png",
            disposition: "inline",
            content_id: "logo.png",
          },
        ];
      }

      await sgMail.send(msg);
      console.log(`Batch ${i + 1}/${batches} sent successfully`);
    }

    return NextResponse.json({
      success: true,
      message: `Campaign sent to ${recipients.length} recipients`,
      recipientCount: recipients.length,
    });
  } catch (error: any) {
    console.error("Error sending campaign:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send campaign" },
      { status: 500 },
    );
  }
}

async function getRecipientsFromDatabase(
  year: number,
  cycle: string,
  status: string,
): Promise<string[]> {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(process.env.MONGODB_DB_NAME);

    const collection = db.collection(process.env.MONGODB_COLLECTION_NAME || "");

    const query: any = {
      year: year,
      cycle: cycle,
    };

    if (status) {
      query.status = status;
    }

    console.log("Query:", query);

    const users = await collection.find(query).toArray();

    console.log(`Found ${users.length} users matching criteria`);

    const emails = users
      .map((user: any) => user.email)
      .filter((email: string) => email && email.includes("@"));

    console.log(`Extracted ${emails.length} valid emails`);

    return emails;
  } catch (error) {
    console.error("MongoDB error:", error);
    throw new Error(`Database query failed: ${error}`);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}
