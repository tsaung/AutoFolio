import { NextResponse } from "next/server";

export interface OpenRouterModel {
  id: string;
  name: string;
  context_length: number;
  pricing: {
    prompt: string;
    completion: string;
  };
}

interface OpenRouterApiModel {
  id: string;
  name: string;
  context_length: number;
  architecture: {
    input_modalities: string[];
    output_modalities: string[];
  };
  pricing: {
    prompt: string;
    completion: string;
  };
}

// Cache models for 60 seconds
export const revalidate = 60;

export async function GET() {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenRouter API key not configured" },
      { status: 500 },
    );
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API responded with ${response.status}`);
    }

    const json = await response.json();

    // Filter to text-input/text-output chat models only and map to simplified shape
    const models: OpenRouterModel[] = (json.data as OpenRouterApiModel[])
      .filter(
        (m) =>
          m.architecture?.input_modalities?.includes("text") &&
          m.architecture?.output_modalities?.includes("text"),
      )
      .map((m) => ({
        id: m.id,
        name: m.name,
        context_length: m.context_length,
        pricing: {
          prompt: m.pricing?.prompt ?? "0",
          completion: m.pricing?.completion ?? "0",
        },
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ data: models });
  } catch (error) {
    console.error("Failed to fetch models from OpenRouter:", error);
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 502 },
    );
  }
}
