import React from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FeatureItem = {
  _key: string;
  icon?: string;
  title: string;
  description: string;
};

export type FeatureGridBlockData = {
  _type: "featureGridBlock";
  _key: string;
  name: string;
  features: FeatureItem[];
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FeatureGridBlock({ data }: { data: FeatureGridBlockData }) {
  if (!data.features || data.features.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-6 py-20 lg:py-24">
      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {data.features.map((feature, index) => (
          <div 
            key={feature._key || index} 
            className="flex flex-col space-y-4 rounded-xl p-6 transition-all hover:bg-muted/50 border border-transparent hover:border-border"
          >
            {feature.icon && (
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2 text-2xl">
                {/* 
                  If icon is a simple string emoji, render it directly.
                  If it's an SVG string, dangerouslySetInnerHTML could be used (requires careful validation).
                  We'll assume text/emoji for simplicity here.
                */}
                <span className="leading-none">{feature.icon}</span>
              </div>
            )}
            <h3 className="text-xl font-semibold tracking-tight text-foreground">
              {feature.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
