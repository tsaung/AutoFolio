import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  FileText,
  MessageSquare,
  Briefcase,
  Code2,
  FolderKanban,
  ArrowRight,
  Plus,
} from "lucide-react";
import { createClient } from "@/lib/db/server";
import Link from "next/link";
import { QuickAddSkillDialog } from "@/components/admin/dashboard/quick-add-skill-dialog";
import { buttonVariants } from "@/components/ui/button";
import { client } from "@/sanity/lib/client";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch Sanity Counts
  const [projectsCount, experiencesCount, skillsCount] = await Promise.all([
    client
      .withConfig({ useCdn: false })
      .fetch<number>(`count(*[_type == "project"])`, {}, { cache: "no-store" }),
    client
      .withConfig({ useCdn: false })
      .fetch<number>(
        `count(*[_type == "experience"])`,
        {},
        { cache: "no-store" },
      ),
    client
      .withConfig({ useCdn: false })
      .fetch<number>(`count(*[_type == "skill"])`, {}, { cache: "no-store" }),
  ]);

  const counts: Record<string, number> = {
    projects: projectsCount,
    experiences: experiencesCount,
    skills: skillsCount,
  };

  // Fetch Supabase Counts for RAG
  const { count: knowledgeDocumentsCount } = await supabase
    .from("knowledge_documents")
    .select("*", { count: "exact", head: true });

  counts.knowledge_documents = knowledgeDocumentsCount || 0;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FolderKanban className="h-8 w-8 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.projects}</div>
            <p className="text-xs text-muted-foreground mb-4">
              Showcased projects
            </p>
            <div className="flex items-center justify-between">
              <Link
                href="/admin/projects"
                className="text-xs text-primary flex items-center hover:underline"
              >
                Manage Projects <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
              <Link
                href="/admin/projects/new"
                className={
                  buttonVariants({ variant: "outline", size: "sm" }) +
                  " h-7 text-xs"
                }
              >
                <Plus className="mr-1 h-3 w-3" /> Add
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Experiences */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experiences</CardTitle>
            <Briefcase className="h-8 w-8 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.experiences}</div>
            <p className="text-xs text-muted-foreground mb-4">
              Work history items
            </p>
            <div className="flex items-center justify-between">
              <Link
                href="/admin/experiences"
                className="text-xs text-primary flex items-center hover:underline"
              >
                Manage Experiences <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
              <Link
                href="/admin/experiences/new"
                className={
                  buttonVariants({ variant: "outline", size: "sm" }) +
                  " h-7 text-xs"
                }
              >
                <Plus className="mr-1 h-3 w-3" /> Add
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills</CardTitle>
            <Code2 className="h-8 w-8 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.skills}</div>
            <p className="text-xs text-muted-foreground mb-4">
              Technical skills
            </p>
            <div className="flex items-center justify-between">
              <Link
                href="/admin/skills"
                className="text-xs text-primary flex items-center hover:underline"
              >
                Manage <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
              <QuickAddSkillDialog />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Chats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
            <MessageSquare className="h-8 w-8 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No chats yet.</p>
          </CardContent>
        </Card>

        {/* Total Knowledge Fragments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Knowledge Fragments
            </CardTitle>
            <FileText className="h-8 w-8 text-violet-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {counts.knowledge_documents}
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Indexed documents
            </p>
            <div className="flex items-center justify-between">
              <Link
                href="/admin/knowledge"
                className="text-xs text-primary flex items-center hover:underline"
              >
                Manage <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
              <Link
                href="/admin/knowledge/new"
                className={
                  buttonVariants({ variant: "outline", size: "sm" }) +
                  " h-7 text-xs"
                }
              >
                <Plus className="mr-1 h-3 w-3" /> Add
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Recent chat activity on your portfolio.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
              No data available
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
            <CardDescription>
              Latest changes to your knowledge base.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[100px] items-center justify-center text-sm text-muted-foreground">
              No recent activity.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
