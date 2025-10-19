"use client";
import { generateEmailHTML } from "@/utils/emailTemplate";
import { Template, Colors, Callout } from "@/types";

interface EmailPreviewProps {
  template: Template;
  colors: Colors;
  callout: Callout;
  bannerImage: File | null;
}

export default function EmailPreview({
  template,
  colors,
  callout,
  bannerImage,
}: EmailPreviewProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 h-full overflow-auto">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Email Preview
      </h3>
      <div
        className="bg-white rounded-lg p-4 shadow-sm"
        dangerouslySetInnerHTML={{
          __html: generateEmailHTML(template, colors, callout, bannerImage),
        }}
      />
    </div>
  );
}
