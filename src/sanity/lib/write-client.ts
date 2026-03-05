import "server-only";

import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Critical: writes always go to the global API, not the CDN
  token: process.env.SANITY_API_TOKEN,
});
