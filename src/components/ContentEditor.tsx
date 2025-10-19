"use client";
import { Plus, Trash2 } from "lucide-react";
import RichTextEditor from "./TextEditor";
import { Template, SendConfig } from "@/types";

interface ContentEditorProps {
  template: Template;
  onTemplateChange: (template: Template) => void;
  sendConfig: SendConfig;
  onSendConfigChange: (config: SendConfig) => void;
}

export default function ContentEditor({
  template,
  onTemplateChange,
  sendConfig,
  onSendConfigChange,
}: ContentEditorProps) {
  const updateTemplate = <K extends keyof Template>(
    field: K,
    value: Template[K],
  ) => {
    onTemplateChange({ ...template, [field]: value });
  };

  const handleTitleChange = (value: string) => {
    updateTemplate("title", value);
    onSendConfigChange({ ...sendConfig, subject: value });
  };

  const addBulletPoint = () => {
    updateTemplate("bulletPoints", [...template.bulletPoints, ""]);
  };

  const updateBulletPoint = (index: number, value: string) => {
    const newBulletPoints = template.bulletPoints.map((point, i) =>
      i === index ? value : point,
    );
    updateTemplate("bulletPoints", newBulletPoints);
  };

  const removeBulletPoint = (index: number) => {
    const newBulletPoints = template.bulletPoints.filter((_, i) => i !== index);
    updateTemplate("bulletPoints", newBulletPoints);
  };

  return (
    <div className="space-y-6">
      {/* Email Subject Line Section - Updated */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-3">
          <label className="text-base font-bold text-blue-900">
            Email Subject Line
          </label>
        </div>
        <input
          type="text"
          value={template.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
          placeholder="Enter your email subject line..."
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Main Heading
        </label>
        <RichTextEditor
          value={template.mainHeading}
          onChange={(value) => updateTemplate("mainHeading", value)}
          placeholder="Enter your main heading..."
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Introduction Text
        </label>
        <RichTextEditor
          value={template.introText}
          onChange={(value) => updateTemplate("introText", value)}
          placeholder="Write your introduction..."
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Event Details
        </label>
        <RichTextEditor
          value={template.eventDetails}
          onChange={(value) => updateTemplate("eventDetails", value)}
          placeholder="Describe your event..."
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-semibold text-gray-700">
            Key Points
          </label>
          <button
            type="button"
            onClick={addBulletPoint}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Plus size={16} />
            Add Point
          </button>
        </div>
        <div className="space-y-3">
          {template.bulletPoints.map((point, index) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-1">
                <RichTextEditor
                  value={point}
                  onChange={(value) => updateBulletPoint(index, value)}
                  placeholder={`Key point ${index + 1}...`}
                />
              </div>
              <button
                type="button"
                onClick={() => removeBulletPoint(index)}
                className="mt-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Closing Text
        </label>
        <RichTextEditor
          value={template.closingText}
          onChange={(value) => updateTemplate("closingText", value)}
          placeholder="Write your closing message..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          {
            field: "signature" as const,
            label: "Signature",
            placeholder: "With lots of love...",
          },
          {
            field: "team" as const,
            label: "Team Name",
            placeholder: "The HackPrinceton Team",
          },
          {
            field: "contactEmail" as const,
            label: "Contact Email",
            placeholder: "team@hackprinceton.com",
          },
          {
            field: "instagram" as const,
            label: "Instagram Handle",
            placeholder: "@hackprinceton",
          },
        ].map(({ field, label, placeholder }) => (
          <div key={field}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {label}
            </label>
            <input
              type={field === "contactEmail" ? "email" : "text"}
              value={template[field]}
              onChange={(e) => updateTemplate(field, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={placeholder}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
