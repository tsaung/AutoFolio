import imageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/env";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return imageUrlBuilder({ projectId, dataset }).image(source);
}
