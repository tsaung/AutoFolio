import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
});

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags,
}: {
  query: string;
  params?: any;
  tags?: string[];
}) {
  return client.fetch<QueryResponse>(query, params, {
    next: {
      tags,
    },
  });
}
