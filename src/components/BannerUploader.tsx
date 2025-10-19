"use client";
import { Upload, Trash2 } from "lucide-react";
import { ChangeEvent } from "react";

interface BannerUploaderProps {
  bannerImage: File | null;
  onBannerImageChange: (file: File | null) => void;
}

export default function BannerUploader({
  bannerImage,
  onBannerImageChange,
}: BannerUploaderProps) {
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onBannerImageChange(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="banner-upload"
        />
        <label htmlFor="banner-upload" className="cursor-pointer">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-base font-medium text-gray-700 mb-2">
            {bannerImage
              ? `📎 ${bannerImage.name} (${Math.round(bannerImage.size / 1024)}KB)`
              : "Upload Banner Image"}
          </p>
          <p className="text-sm text-gray-500 mb-3">
            Drag & drop an image, or click to select
          </p>
          <div className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Choose File
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Recommended: 600x300px, Max 10MB
          </p>
        </label>
      </div>

      {bannerImage && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-semibold text-gray-700">Preview</h4>
            <button
              onClick={() => onBannerImageChange(null)}
              className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1 text-sm"
            >
              <Trash2 size={14} />
              Remove
            </button>
          </div>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <img
              src={URL.createObjectURL(bannerImage)}
              alt="Banner preview"
              className="w-full h-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
