import React from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type StatItem = {
  _key: string;
  label: string;
  value: string;
  suffix?: string;
};

export type StatsBlockData = {
  _type: "statsBlock";
  _key: string;
  name: string;
  items: StatItem[];
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function StatsBlock({ data }: { data: StatsBlockData }) {
  if (!data.items || data.items.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-6 py-16">
      <div className="rounded-2xl bg-card p-8 md:p-12 shadow-sm border">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 text-center">
          {data.items.map((stat) => (
            <div key={stat._key} className="flex flex-col items-center justify-center space-y-2">
              <div className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground flex items-baseline justify-center">
                <span>{stat.value}</span>
                {stat.suffix && <span className="text-primary text-2xl md:text-3xl ml-1">{stat.suffix}</span>}
              </div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
