"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Helper to convert Sanity PortableText block array to a plain string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const portableTextToString = (blocks: any[]): string => {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((block) => {
      if (block._type !== "block" || !block.children) return "";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return block.children.map((child: any) => child.text).join("");
    })
    .join("\n\n");
};

// Helper to convert plain string to a simple Sanity PortableText block array
const stringToPortableText = (text: string) => {
  const paragraphs = text.split("\n\n").filter(Boolean);

  if (paragraphs.length === 0) {
      return [{
          _type: "block",
          _key: Math.random().toString(36).substring(2, 9),
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: Math.random().toString(36).substring(2, 9),
              text: "",
              marks: [],
            },
          ],
        }];
  }

  return paragraphs.map((para) => ({
    _type: "block",
    _key: Math.random().toString(36).substring(2, 9),
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: Math.random().toString(36).substring(2, 9),
        text: para,
        marks: [],
      },
    ],
  }));
};

export function RichTextBlockForm({
  block,
  onChange,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  block: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (key: string, data: any) => void;
}) {
  const [localText, setLocalText] = useState("");

  useEffect(() => {
    setLocalText(portableTextToString(block.content || []));
  }, [block.content]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setLocalText(newText);
    onChange(block._key, {
      ...block,
      content: stringToPortableText(newText),
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor={`content-${block._key}`}>Rich Text Content</Label>
        <Textarea
          id={`content-${block._key}`}
          value={localText}
          onChange={handleChange}
          placeholder="Enter text (paragraphs separated by double blank lines)..."
          className="min-h-[200px]"
        />
        <div className="text-[10px] text-muted-foreground mt-1">
          Currently supports basic plain text mapped to paragraphs. Full WYSIWYG
          editor coming soon.
        </div>
      </div>
    </div>
  );
}
