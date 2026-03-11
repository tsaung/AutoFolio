// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Skill = {
  name: string;
  proficiency: "beginner" | "intermediate" | "advanced" | "expert";
};

export type SkillsBlockData = {
  _type: "skillsBlock";
  _key: string;
  name: string;
  headline?: string;
  subheadline?: string;
  skills: Skill[];
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SkillsBlock({ data }: { data: SkillsBlockData }) {
  if (!data.skills || data.skills.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto max-w-5xl px-6 py-16">
      {(data.headline || data.subheadline) && (
        <div className="mb-12 text-center sm:text-left">
          {data.headline && (
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              {data.headline}
            </h2>
          )}
          {data.subheadline && (
            <p className="mt-4 text-lg text-muted-foreground">
              {data.subheadline}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
        {data.skills.map((skill, index) => {
          const { bg, text } = getProficiencyColors(skill.proficiency);

          return (
            <div
              key={`${skill.name}-${index}`}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition-transform hover:scale-105 ${bg} ${text}`}
            >
              <span className="font-bold">{skill.name}</span>
              <span className="h-1 w-1 rounded-full bg-current opacity-50" />
              <span className="text-xs uppercase tracking-wider opacity-90">
                {skill.proficiency}
              </span>
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

function getProficiencyColors(
  proficiency: Skill["proficiency"],
): { bg: string; text: string } {
  switch (proficiency) {
    case "expert":
      return {
        bg: "bg-primary border-primary",
        text: "text-primary-foreground",
      };
    case "advanced":
      return {
        bg: "bg-primary/80 border-primary/80",
        text: "text-primary-foreground",
      };
    case "intermediate":
      return {
        bg: "bg-secondary border-secondary",
        text: "text-secondary-foreground",
      };
    case "beginner":
    default:
      return {
        bg: "bg-muted border-muted-foreground/20",
        text: "text-muted-foreground",
      };
  }
}
