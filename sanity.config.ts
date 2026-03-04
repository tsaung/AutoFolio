"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemas";
import { botSettingsPlugin } from "@/sanity/plugins/bot-settings";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  apiVersion,
  plugins: [structureTool(), botSettingsPlugin()],
  schema: {
    types: schemaTypes,
  },
});
