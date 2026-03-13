"use server";

import { createClient } from "@/lib/db/server";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";
import {
  PROJECTS_QUERY,
  PROJECT_BY_ID_QUERY,
  PUBLIC_PROJECTS_QUERY,
  SKILLS_QUERY,
  SKILL_BY_ID_QUERY,
} from "@/sanity/lib/queries";
import { SanityProject, SanitySkill } from "@/types/sanity-types";
import { revalidatePath } from "next/cache";

// ==========================================
// PROJECTS
// ==========================================

export async function getProjects(): Promise<SanityProject[]> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return [];
  }

  const data = await client
    .withConfig({ useCdn: false })
    .fetch<SanityProject[]>(PROJECTS_QUERY, {}, { cache: "no-store" });

  return data ?? [];
}

export async function getProject(id: string): Promise<SanityProject | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  const data = await client
    .withConfig({ useCdn: false })
    .fetch<SanityProject | null>(PROJECT_BY_ID_QUERY, { id }, { cache: "no-store" });

  return data;
}

export async function createProject(
  input: Omit<SanityProject, "_id" | "_type" | "_createdAt" | "_updatedAt" | "createdBy" | "updatedBy">,
): Promise<SanityProject> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  try {
    const data = await writeClient.create({
      _type: "project",
      ...input,
      createdBy: user.id,
      updatedBy: user.id,
    });

    revalidatePath("/admin/projects", "layout");
    revalidatePath("/admin");
    // TODO: update RAG pipeline to use Sanity webhook or direct call
    return data as unknown as SanityProject;
  } catch (error) {
    console.error("Error creating project in Sanity:", error);
    throw new Error("Failed to create project");
  }
}

export async function updateProject(
  id: string,
  input: Partial<Omit<SanityProject, "_id" | "_type" | "_createdAt" | "_updatedAt" | "createdBy" | "updatedBy">>,
): Promise<SanityProject> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  try {
    const data = await writeClient
      .patch(id)
      .set({
        ...input,
        updatedBy: user.id,
      })
      .commit();

    revalidatePath("/admin/projects", "layout");
    revalidatePath("/admin");
    // TODO: update RAG pipeline to use Sanity webhook or direct call
    return data as unknown as SanityProject;
  } catch (error) {
    console.error("Error updating project in Sanity:", error);
    throw new Error("Failed to update project");
  }
}

export async function deleteProject(id: string): Promise<{ error?: string } | void> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: "Unauthorized" };
  }

  try {
    const publishedId = id.replace(/^drafts\./, "");
    const draftId = `drafts.${publishedId}`;

    await writeClient
      .transaction()
      .delete(publishedId)
      .delete(draftId)
      .commit();

    revalidatePath("/admin/projects", "layout");
    revalidatePath("/admin");
    // TODO: update RAG pipeline to use Sanity webhook or direct call
  } catch (error: any) {
    console.error("Error deleting project from Sanity:", error);
    if (error.message?.includes("reference") || error.details?.type === "reference") {
      return { error: "Cannot delete project because it is referenced elsewhere (e.g., in a Project Grid block). Please remove it from any pages first." };
    }
    return { error: "Failed to delete project. Make sure it is not referenced elsewhere." };
  }
}

export async function reorderProjects(
  items: { id: string; sortOrder: number }[],
): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  try {
    const tx = writeClient.transaction();

    items.forEach((item) => {
      tx.patch(item.id, (p) => p.set({ sortOrder: item.sortOrder, updatedBy: user.id }));
    });

    await tx.commit();
    revalidatePath("/admin/projects", "layout");
    revalidatePath("/admin");
    // TODO: update RAG pipeline
  } catch (error) {
    console.error("Error reordering projects in Sanity:", error);
    throw new Error("Failed to reorder projects");
  }
}

export async function getPublicProjects(): Promise<SanityProject[]> {
  try {
    const data = await client.fetch<SanityProject[]>(PUBLIC_PROJECTS_QUERY);
    return data ?? [];
  } catch (error) {
    console.error("Error fetching public projects from Sanity:", error);
    return [];
  }
}

// ==========================================
// SKILLS
// ==========================================

export async function getSkills(): Promise<SanitySkill[]> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return [];
  }

  const data = await client
    .withConfig({ useCdn: false })
    .fetch<SanitySkill[]>(SKILLS_QUERY, {}, { cache: "no-store" });

  return data ?? [];
}

export async function getSkill(id: string): Promise<SanitySkill | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  const data = await client
    .withConfig({ useCdn: false })
    .fetch<SanitySkill | null>(SKILL_BY_ID_QUERY, { id }, { cache: "no-store" });

  return data;
}

export async function createSkill(
  input: Omit<SanitySkill, "_id" | "_type" | "_createdAt" | "_updatedAt" | "createdBy" | "updatedBy">,
): Promise<SanitySkill> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  try {
    const data = await writeClient.create({
      _type: "skill",
      ...input,
      createdBy: user.id,
      updatedBy: user.id,
    });

    revalidatePath("/admin/skills", "layout");
    revalidatePath("/admin");
    // TODO: RAG pipeline sync
    return data as unknown as SanitySkill;
  } catch (error) {
    console.error("Error creating skill in Sanity:", error);
    throw new Error("Failed to create skill");
  }
}

export async function updateSkill(
  id: string,
  input: Partial<Omit<SanitySkill, "_id" | "_type" | "_createdAt" | "_updatedAt" | "createdBy" | "updatedBy">>,
): Promise<SanitySkill> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  try {
    const data = await writeClient
      .patch(id)
      .set({
        ...input,
        updatedBy: user.id,
      })
      .commit();

    revalidatePath("/admin/skills", "layout");
    revalidatePath("/admin");
    // TODO: RAG pipeline sync
    return data as unknown as SanitySkill;
  } catch (error) {
    console.error("Error updating skill in Sanity:", error);
    throw new Error("Failed to update skill");
  }
}

export async function deleteSkill(id: string): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  try {
    await writeClient.delete(id);
    revalidatePath("/admin/skills", "layout");
    revalidatePath("/admin");
    // TODO: RAG pipeline sync
  } catch (error) {
    console.error("Error deleting skill from Sanity:", error);
    throw new Error("Failed to delete skill");
  }
}

export async function reorderSkills(
  items: { id: string; sortOrder: number }[],
): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  try {
    const tx = writeClient.transaction();

    items.forEach((item) => {
      tx.patch(item.id, (p) => p.set({ sortOrder: item.sortOrder, updatedBy: user.id }));
    });

    await tx.commit();
    revalidatePath("/admin/skills", "layout");
    revalidatePath("/admin");
    // TODO: RAG pipeline sync
  } catch (error) {
    console.error("Error reordering skills in Sanity:", error);
    throw new Error("Failed to reorder skills");
  }
}

export async function getPublicSkills(): Promise<SanitySkill[]> {
  try {
    const data = await client.fetch<SanitySkill[]>(SKILLS_QUERY);
    return data ?? [];
  } catch (error) {
    console.error("Error fetching public skills from Sanity:", error);
    return [];
  }
}

