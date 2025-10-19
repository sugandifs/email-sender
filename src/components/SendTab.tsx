"use client";
import { Send, Settings, FileText } from "lucide-react";
import { SendConfig, Template, Colors, Callout } from "@/types";
import { ChangeEvent } from "react";
import { generateEmailHTML } from "@/utils/emailTemplate";

interface SendTabProps {
  sendConfig: SendConfig;
  onSendConfigChange: (config: SendConfig) => void;
  template: Template;
  colors: Colors;
  callout: Callout;
  bannerImage: File | null;
}

export default function SendTab({
  sendConfig,
  onSendConfigChange,
  template,
  colors,
  callout,
  bannerImage,
}: SendTabProps) {
  const updateConfig = <K extends keyof SendConfig>(
    field: K,
    value: SendConfig[K],
  ) => {
    onSendConfigChange({ ...sendConfig, [field]: value });
  };

  const handleCSVUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      updateConfig("csvFile", file);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSend = async () => {
    if (!sendConfig.subject) {
      alert("Please enter a subject line");
      return;
    }

    const htmlContent = generateEmailHTML(
      template,
      colors,
      callout,
      bannerImage,
    );

    let bannerBase64 = "";
    if (bannerImage) {
      bannerBase64 = await fileToBase64(bannerImage);
    }

    const requestBody: any = {
      subject: sendConfig.subject,
      htmlContent,
      recipientSource: sendConfig.recipientSource,
      bannerImage: bannerBase64 || undefined,
    };

    if (sendConfig.recipientSource === "database") {
      requestBody.year = sendConfig.year;
      requestBody.cycle = sendConfig.cycle;
      requestBody.status = sendConfig.status;
    } else {
      const emails = sendConfig.customEmails
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email);

      if (emails.length === 0) {
        alert("Please enter at least one email address");
        return;
      }

      requestBody.emails = emails;
    }

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Success! Campaign sent to ${data.recipientCount} recipients`);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error sending campaign:", error);
      alert("Failed to send campaign. Please try again.");
    }
  };

  const handleTestSend = async () => {
    if (!sendConfig.testEmail) {
      alert("Please enter a test email address");
      return;
    }

    const htmlContent = generateEmailHTML(
      template,
      colors,
      callout,
      bannerImage,
    );

    let bannerBase64 = "";
    if (bannerImage) {
      bannerBase64 = await fileToBase64(bannerImage);
    }

    try {
      const response = await fetch("/api/test-send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: sendConfig.subject,
          htmlContent,
          testEmail: sendConfig.testEmail,
          bannerImage: bannerBase64 || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Test email sent successfully to ${sendConfig.testEmail}!`);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error sending test email:", error);
      alert("Failed to send test email. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Test Email Section */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
        <h3 className="text-base font-semibold text-purple-900 mb-3 flex items-center gap-2">
          Test Email
        </h3>
        <p className="text-sm text-purple-700 mb-4">
          Send a test email to verify your campaign before sending to all
          recipients
        </p>
        <div className="flex gap-3">
          <input
            type="email"
            value={sendConfig.testEmail}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              updateConfig("testEmail", e.target.value)
            }
            className="flex-1 px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Enter test email address"
          />
          <button
            onClick={handleTestSend}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
          >
            <Send size={18} />
            Send Test
          </button>
        </div>
      </div>

      {/* Recipient Selection */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Select Recipients
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
            <input
              type="radio"
              name="recipientSource"
              value="database"
              checked={sendConfig.recipientSource === "database"}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateConfig(
                  "recipientSource",
                  e.target.value as "database" | "custom",
                )
              }
              className="w-5 h-5 text-blue-600"
            />
            <div>
              <div className="font-semibold text-gray-800">From Database</div>
              <div className="text-sm text-gray-600">
                Filter recipients from your database
              </div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
            <input
              type="radio"
              name="recipientSource"
              value="custom"
              checked={sendConfig.recipientSource === "custom"}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateConfig(
                  "recipientSource",
                  e.target.value as "database" | "custom",
                )
              }
              className="w-5 h-5 text-blue-600"
            />
            <div>
              <div className="font-semibold text-gray-800">
                Custom Email List
              </div>
              <div className="text-sm text-gray-600">
                Use a custom list or upload CSV
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Database Filter Section */}
      {sendConfig.recipientSource === "database" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <Settings size={18} />
            Database Filter
          </h3>
          <p className="text-sm text-blue-700 mb-4">
            Select criteria to filter recipients from your database
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-2">
                Year
              </label>
              <select
                value={sendConfig.year}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  updateConfig("year", parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-2">
                Cycle
              </label>
              <select
                value={sendConfig.cycle}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  updateConfig("cycle", e.target.value)
                }
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="spring">Spring</option>
                <option value="fall">Fall</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-2">
                Status
              </label>
              <select
                value={sendConfig.status}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  updateConfig("status", e.target.value)
                }
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="started">Started</option>
                <option value="submitted">Submitted</option>
                <option value="accepted">Accepted</option>
                <option value="confirmed">Confirmed</option>
                <option value="waitlisted">Waitlisted</option>
                <option value="waitlist_accepted">Waitlist Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Custom Email List Section */}
      {sendConfig.recipientSource === "custom" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Custom Email List
            </label>
            <textarea
              value={sendConfig.customEmails}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                updateConfig("customEmails", e.target.value)
              }
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email addresses separated by commas:
user1@example.com, user2@example.com, user3@example.com"
            />
            <p className="text-sm text-gray-500 mt-2">
              {sendConfig.customEmails
                ?.split(",")
                .filter((email) => email.trim()).length || 0}{" "}
              emails entered
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Or Upload CSV File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <FileText className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {sendConfig.csvFile
                    ? `📎 ${sendConfig.csvFile.name}`
                    : "Upload CSV file"}
                </p>
                <p className="text-xs text-gray-500">
                  Click to select a CSV file with email addresses
                </p>
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Important</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>Test your email before sending to all recipients</li>
        </ul>
      </div>

      <button
        onClick={handleSend}
        className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
      >
        <Send size={24} />
        Send Campaign
      </button>
    </div>
  );
}
