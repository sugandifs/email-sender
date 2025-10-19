"use client";
import { useState } from "react";
import TopNav from "./TopNav";
import EmailPreview from "./EmailPreview";
import ContentEditor from "./ContentEditor";
import ColorCustomizer from "./ColorCustomizer";
import CalloutEditor from "./CalloutEditor";
import BannerUploader from "./BannerUploader";
import SendTab from "./SendTab";
import { Template, Colors, Callout, SendConfig } from "@/types";

export default function EmailCampaignBuilder() {
  const [activeTab, setActiveTab] = useState<string>("content");
  const [bannerImage, setBannerImage] = useState<File | null>(null);

  const [template, setTemplate] = useState<Template>({
    title: "This is the email subject",
    mainHeading: "This is the main heading of the email",
    introText: "This is the first paragraph of the content",
    eventDetails: "This is the second paragraph of the content",
    bulletPoints: [
      "First bullet point if needed",
      "Keep adding bullet points with the 'add point' button",
      "And use the trash button to delete bullet points if not needed",
    ],
    closingText: "This is the closing paragraph. Leave blank if unneeded.",
    signature: "With lots of love and plenty more caffeine,",
    team: "The HackPrinceton Team",
    contactEmail: "team@hackprinceton.com",
    instagram: "@hackprinceton",
  });

  const [colors, setColors] = useState<Colors>({
    primary: "#1e4027",
    secondary: "#366662",
    background: "#efdfbd",
    text: "#333333",
    accent: "#f4ead6",
  });

  const [callout, setCallout] = useState<Callout>({
    enabled: true,
    heading: "This is the callout heading, used to emphasize information/links",
    content:
      "This is the text portion of the callout. If you don't want to use the callout, you can disable it on the top right.",
    buttonText: "This is the button",
    buttonLink: "https://hackprinceton.com/",
    backgroundColor: "#efdfbd",
    borderColor: "#1e4027",
    textColor: "#1e4027",
    buttonColor: "#1e4027",
    buttonTextColor: "#ffffff",
  });

  const [sendConfig, setSendConfig] = useState<SendConfig>({
    year: 2025,
    cycle: "fall",
    status: "all",
    customEmails: "",
    csvFile: null,
    testEmail: "",
    recipientSource: "database",
    subject: template.title,
  });

  const renderActiveTab = () => {
    switch (activeTab) {
      case "content":
        return (
          <ContentEditor
            template={template}
            onTemplateChange={setTemplate}
            sendConfig={sendConfig}
            onSendConfigChange={setSendConfig}
          />
        );
      case "callout":
        return <CalloutEditor callout={callout} onCalloutChange={setCallout} />;
      case "colors":
        return <ColorCustomizer colors={colors} onColorsChange={setColors} />;
      case "banner":
        return (
          <BannerUploader
            bannerImage={bannerImage}
            onBannerImageChange={setBannerImage}
          />
        );
      case "send":
        return (
          <SendTab
            sendConfig={sendConfig}
            onSendConfigChange={setSendConfig}
            template={template}
            colors={colors}
            callout={callout}
            bannerImage={bannerImage}
          />
        );
      default:
        return (
          <ContentEditor
            template={template}
            onTemplateChange={setTemplate}
            sendConfig={sendConfig}
            onSendConfigChange={setSendConfig}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="h-screen flex flex-col">
        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Side - Email Preview */}
          <div className="w-1/2 border-r bg-white p-6 overflow-auto">
            <EmailPreview
              template={template}
              colors={colors}
              callout={callout}
              bannerImage={bannerImage}
            />
          </div>

          {/* Right Side - Edit Email */}
          <div className="w-1/2 bg-gray-50 p-6 overflow-auto">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Edit Email
            </h3>

            {/* Top Navigation Tabs */}
            <TopNav activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Active Tab Content */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {renderActiveTab()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
