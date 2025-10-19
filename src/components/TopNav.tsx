"use client";

interface TopNavProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

interface Tab {
  id: string;
  label: string;
}

export default function TopNav({ activeTab, onTabChange }: TopNavProps) {
  const tabs: Tab[] = [
    { id: "content", label: "Content" },
    { id: "callout", label: "Callout" },
    { id: "colors", label: "Colors" },
    { id: "banner", label: "Banner Image" },
    { id: "send", label: "Send" },
  ];

  return (
    <div className="flex gap-2 mb-6">
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            activeTab === id
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
