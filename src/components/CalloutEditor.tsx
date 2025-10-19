"use client";
import RichTextEditor from "./TextEditor";
import { Callout } from "@/types";
import { ChangeEvent } from "react";

interface CalloutEditorProps {
  callout: Callout;
  onCalloutChange: (callout: Callout) => void;
}

export default function CalloutEditor({
  callout,
  onCalloutChange,
}: CalloutEditorProps) {
  const updateCallout = <K extends keyof Callout>(
    field: K,
    value: Callout[K],
  ) => {
    onCalloutChange({ ...callout, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Callout Section</h3>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={callout.enabled}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              updateCallout("enabled", e.target.checked)
            }
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Enable Callout
          </span>
        </label>
      </div>

      {callout.enabled && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Callout Heading
            </label>
            <input
              type="text"
              value={callout.heading}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateCallout("heading", e.target.value)
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="🕐 🚨 PRIORITY APPLICATIONS CLOSE SOON!"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Callout Content
            </label>
            <RichTextEditor
              value={callout.content}
              onChange={(value: string) => updateCallout("content", value)}
              placeholder="Enter your callout message..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Button Text
              </label>
              <input
                type="text"
                value={callout.buttonText}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  updateCallout("buttonText", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Apply here!"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Button Link
              </label>
              <input
                type="url"
                value={callout.buttonLink}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  updateCallout("buttonLink", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://your-link.com"
              />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Callout Styling
            </h4>
            <div className="grid grid-cols-5 gap-3">
              {(
                [
                  ["backgroundColor", "Background"],
                  ["borderColor", "Border"],
                  ["textColor", "Text"],
                  ["buttonColor", "Button"],
                  ["buttonTextColor", "Button Text"],
                ] as const
              ).map(([field, label]) => (
                <div key={field}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {label}
                  </label>
                  <input
                    type="color"
                    value={callout[field]}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateCallout(field, e.target.value)
                    }
                    className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
