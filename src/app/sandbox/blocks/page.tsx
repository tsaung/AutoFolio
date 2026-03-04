import { ProjectGridBlockData, ProjectGridBlock } from "@/components/v2/blocks/project-grid-block";
import { ExperienceTimelineBlockData, ExperienceTimelineBlock } from "@/components/v2/blocks/experience-timeline-block";
import { SkillsBlockData, SkillsBlock } from "@/components/v2/blocks/skills-block";

export default function TestBlocks() {
  const projectData: ProjectGridBlockData = {
    _type: "projectGridBlock",
    _key: "p1",
    projects: [
      {
        _id: "1",
        title: "BotFolio V2",
        slug: { current: "botfolio-v2" },
        description: "Next-gen portfolio with integrated AI capabilities and Headless CMS.",
        tags: ["Next.js", "Sanity", "Tailwind"],
        liveUrl: "https://example.com",
        repoUrl: "https://github.com/example/botfolio"
      },
      {
        _id: "2",
        title: "E-commerce App",
        slug: { current: "ecommerce-app" },
        description: "A full-stack e-commerce application using React and Node.js.",
        tags: ["React", "Node.js", "Stripe"],
        liveUrl: "https://shop.example.com",
      }
    ]
  };

  const experienceData: ExperienceTimelineBlockData = {
    _type: "experienceTimelineBlock",
    _key: "e1",
    experiences: [
      {
        _id: "1",
        title: "Senior Software Engineer",
        company: "Tech Corp",
        location: "San Francisco, CA",
        startDate: "2020-01-01",
        description: [
          {
            _type: 'block',
            _key: 'b1',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 's1', text: 'Lead developer for the core product team.', marks: [] }]
          }
        ]
      },
      {
        _id: "2",
        title: "Software Engineer",
        company: "Startup Inc",
        location: "Remote",
        startDate: "2018-06-01",
        endDate: "2019-12-31",
      }
    ]
  };

  const skillsData: SkillsBlockData = {
    _type: "skillsBlock",
    _key: "s1",
    skills: [
      { name: "React", proficiency: "expert" },
      { name: "TypeScript", proficiency: "advanced" },
      { name: "Node.js", proficiency: "intermediate" },
      { name: "Python", proficiency: "beginner" },
    ]
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      <h1 className="text-3xl font-bold p-8 text-center border-b">UI Blocks Sandbox</h1>

      <div className="py-8">
        <h2 className="text-2xl font-bold px-8 mb-4">Project Grid Block</h2>
        <ProjectGridBlock data={projectData} />
      </div>

      <div className="py-8 bg-muted/30">
        <h2 className="text-2xl font-bold px-8 mb-4">Experience Timeline Block</h2>
        <ExperienceTimelineBlock data={experienceData} />
      </div>

      <div className="py-8">
        <h2 className="text-2xl font-bold px-8 mb-4">Skills Block</h2>
        <SkillsBlock data={skillsData} />
      </div>
    </div>
  );
}
