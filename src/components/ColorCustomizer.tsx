"use client";
import { Colors, ColorPreset } from "@/types";
import { ChangeEvent } from "react";

interface ColorCustomizerProps {
  colors: Colors;
  onColorsChange: (colors: Colors) => void;
}

export default function ColorCustomizer({
  colors,
  onColorsChange,
}: ColorCustomizerProps) {
  const colorPresets: ColorPreset[] = [
    {
      name: "Fall 2025",
      colors: {
        primary: "#1e4027",
        secondary: "#366662",
        background: "#efdfbd",
        text: "#333333",
        accent: "#f4ead6",
      },
    },
  ];

  const handleColorChange = (
    field: keyof Colors,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    onColorsChange({ ...colors, [field]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Color Presets
        </label>
        <div className="grid grid-cols-3 gap-3">
          {colorPresets.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => onColorsChange(preset.colors)}
              className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all duration-200 text-left"
            >
              <div className="font-medium text-sm mb-2 text-gray-700">
                {preset.name}
              </div>
              <div className="flex gap-1">
                {Object.values(preset.colors).map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Custom Colors
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {(
            [
              ["primary", "Primary Color"],
              ["secondary", "Secondary Color"],
              ["background", "Background Color"],
              ["text", "Text Color"],
              ["accent", "Accent Color"],
            ] as const
          ).map(([field, label]) => (
            <div key={field}>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                {label}
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={colors[field]}
                  onChange={(e) => handleColorChange(field, e)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={colors[field]}
                  onChange={(e) => handleColorChange(field, e)}
                  className="flex-1 px-2 py-2 border border-gray-300 rounded text-xs font-mono"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
