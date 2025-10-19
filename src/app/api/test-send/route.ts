import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface SendTestRequest {
  subject: string;
  htmlContent: string;
  testEmail: string;
  bannerImage?: string; // base64 encoded
}

export async function POST(request: NextRequest) {
  try {
    const body: SendTestRequest = await request.json();

    console.log("Test email request:", {
      subject: body.subject,
      testEmail: body.testEmail,
      hasBannerImage: !!body.bannerImage,
      htmlContentLength: body.htmlContent?.length,
    });

    // Validate inputs
    if (!body.testEmail) {
      return NextResponse.json(
        { error: "Test email is required" },
        { status: 400 },
      );
    }

    if (!body.subject) {
      return NextResponse.json(
        { error: "Subject is required" },
        { status: 400 },
      );
    }

    if (!body.htmlContent) {
      return NextResponse.json(
        { error: "Email content is required" },
        { status: 400 },
      );
    }

    // Check environment variables
    if (!process.env.FROM_EMAIL || !process.env.FROM_NAME) {
      return NextResponse.json(
        {
          error:
            "FROM_EMAIL and FROM_NAME must be set in environment variables",
        },
        { status: 500 },
      );
    }

    const msg: any = {
      to: body.testEmail,
      from: {
        email: process.env.FROM_EMAIL,
        name: process.env.FROM_NAME,
      },
      subject: body.subject,
      html: body.htmlContent,
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

    console.log("Sending email with config:", {
      to: msg.to,
      from: msg.from,
      subject: msg.subject,
      hasAttachments: !!msg.attachments,
    });

    const response = await sgMail.send(msg);

    console.log("SendGrid response:", response);

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${body.testEmail}`,
    });
  } catch (error: any) {
    console.error("Error sending test email:", error);
    console.error("Error response:", error.response?.body);

    // Return detailed error information
    return NextResponse.json(
      {
        error: error.message || "Failed to send test email",
        details:
          error.response?.body?.errors ||
          error.response?.body ||
          "No additional details",
      },
      { status: 500 },
    );
  }
}
