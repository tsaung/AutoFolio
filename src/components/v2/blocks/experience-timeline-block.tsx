import { PortableText } from "next-sanity";
import type { PortableTextBlock } from "sanity";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Experience = {
  _id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string;  // YYYY-MM-DD
  description?: PortableTextBlock[];
};

export type ExperienceTimelineBlockData = {
  _type: "experienceTimelineBlock";
  _key: string;
  experiences: Experience[];
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ExperienceTimelineBlock({
  data,
}: {
  data: ExperienceTimelineBlockData;
}) {
  if (!data.experiences || data.experiences.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto max-w-4xl px-6 py-16">
      <div className="relative border-l-2 border-muted pl-8 sm:pl-12">
        {data.experiences.map((exp, index) => {
          const isLast = index === data.experiences.length - 1;

          return (
            <div
              key={exp._id}
              className={`relative flex flex-col gap-2 ${
                isLast ? "" : "mb-12"
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute -left-[41px] top-1.5 h-4 w-4 rounded-full border-4 border-background bg-primary sm:-left-[57px]" />

              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {exp.title}
                  </h3>
                  <div className="text-lg font-medium text-muted-foreground">
                    {exp.company}
                    {exp.location && (
                      <span className="font-normal opacity-80">
                        {" "}
                        &bull; {exp.location}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-1 flex items-center text-sm font-medium text-muted-foreground sm:mt-0">
                  <span className="rounded-md bg-muted px-2 py-1">
                    {formatDate(exp.startDate)} -{" "}
                    {exp.endDate ? formatDate(exp.endDate) : "Present"}
                  </span>
                </div>
              </div>

              {exp.description && (
                <div className="prose prose-sm mt-4 max-w-none text-muted-foreground dark:prose-invert">
                  <PortableText value={exp.description} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateString: string): string {
  if (!dateString) return "";

  // The sanity date format is usually YYYY-MM-DD
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}
