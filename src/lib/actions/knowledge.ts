"use server";

import { createClient } from "@/lib/db/server";
import { Database } from "@/types/database";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { processDocument } from "@/lib/rag/pipeline";

type KnowledgeDocument =
  Database["public"]["Tables"]["knowledge_documents"]["Row"];
type KnowledgeDocumentInsert =
  Database["public"]["Tables"]["knowledge_documents"]["Insert"];

export async function getDocuments(): Promise<KnowledgeDocument[]> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("knowledge_documents")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching documents:", error);
    return [];
  }

  return data ?? [];
}

export async function getDocument(
  id: string,
): Promise<KnowledgeDocument | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("knowledge_documents")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching document:", error);
    return null;
  }

  return data;
}

export async function createDocument(input: {
  title: string;
  content: string;
}): Promise<KnowledgeDocument> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("knowledge_documents")
    .insert({
      user_id: user.id,
      title: input.title,
      content: input.content,
      type: "manual",
    } as KnowledgeDocumentInsert)
    .select()
    .single();

  if (error) {
    console.error("Error creating document:", error);
    throw new Error("Failed to create document");
  }

  revalidatePath("/knowledge");

  // Background: chunk + embed
  after(() => processDocument(data.id, user.id, input.content));

  return data;
}

export async function updateDocument(
  id: string,
  input: { title: string; content: string },
): Promise<KnowledgeDocument> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("knowledge_documents")
    .update({
      title: input.title,
      content: input.content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating document:", error);
    throw new Error("Failed to update document");
  }

  revalidatePath("/knowledge");

  // Background: re-chunk + re-embed
  after(() => processDocument(data.id, user.id, input.content));

  return data;
}

export async function deleteDocument(id: string): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("knowledge_documents")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting document:", error);
    throw new Error("Failed to delete document");
  }

  revalidatePath("/knowledge");
}
