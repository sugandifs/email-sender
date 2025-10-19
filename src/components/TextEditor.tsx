"use client";
import { useRef, useEffect, ChangeEvent } from "react";
import { Bold, Italic, Underline, Link } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter text...",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const formatText = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value ?? undefined);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
      <div className="flex gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <button
          type="button"
          onClick={() => formatText("bold")}
          className="p-2 hover:bg-white hover:shadow-sm rounded transition-all duration-200"
          title="Bold"
        >
          <Bold size={16} className="text-gray-600" />
        </button>
        <button
          type="button"
          onClick={() => formatText("italic")}
          className="p-2 hover:bg-white hover:shadow-sm rounded transition-all duration-200"
          title="Italic"
        >
          <Italic size={16} className="text-gray-600" />
        </button>
        <button
          type="button"
          onClick={() => formatText("underline")}
          className="p-2 hover:bg-white hover:shadow-sm rounded transition-all duration-200"
          title="Underline"
        >
          <Underline size={16} className="text-gray-600" />
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt("Enter URL:");
            if (url) formatText("createLink", url);
          }}
          className="p-2 hover:bg-white hover:shadow-sm rounded transition-all duration-200"
          title="Add Link"
        >
          <Link size={16} className="text-gray-600" />
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-3 min-h-[80px] focus:outline-none relative bg-white"
        suppressContentEditableWarning
      >
        {!value && (
          <span className="absolute text-gray-400 pointer-events-none">
            {placeholder}
          </span>
        )}
      </div>
    </div>
  );
}
