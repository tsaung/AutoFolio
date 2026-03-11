import React from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type EmbedBlockData = {
  _type: "embedBlock";
  _key: string;
  name: string;
  embedType: "youtube" | "vimeo" | "custom";
  url?: string;
  code?: string;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EmbedBlock({ data }: { data: EmbedBlockData }) {
  if (!data.embedType) {
    return null;
  }

  // Handle YouTube or Vimeo embed parsing
  if (data.embedType === "youtube" || data.embedType === "vimeo") {
    if (!data.url) return null;

    let src = data.url;

    // Convert standard YouTube watch/shorts URLs to embed URLs
    if (data.embedType === "youtube") {
      const videoIdMatch = data.url.match(/(?:v=|youtu\.be\/|shorts\/)([^&]+)/);
      if (videoIdMatch && videoIdMatch[1]) {
        src = `https://www.youtube.com/embed/${videoIdMatch[1]}`;
      }
    } 
    // Convert standard Vimeo URLs to player URLs
    else if (data.embedType === "vimeo") {
      const vimeoMatch = data.url.match(/vimeo\.com\/(\d+)/);
      if (vimeoMatch && vimeoMatch[1]) {
        src = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
      }
    }

    return (
      <section className="container mx-auto px-6 py-16">
        <div className="relative mx-auto max-w-5xl rounded-2xl overflow-hidden shadow-lg border bg-muted group">
          <div className="aspect-video w-full">
            <iframe
              src={src}
              title={data.name || "Video player"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>
        </div>
      </section>
    );
  }

  // Handle Custom HTML Code
  if (data.embedType === "custom" && data.code) {
    return (
      <section className="container mx-auto px-6 py-16">
        <div className="mx-auto max-w-5xl rounded-2xl overflow-hidden shadow-sm border bg-card p-4 sm:p-6 lg:p-8">
           <div 
             className="w-full overflow-x-auto custom-embed-container"
             dangerouslySetInnerHTML={{ __html: data.code }}
           />
        </div>
      </section>
    );
  }

  return null;
}
