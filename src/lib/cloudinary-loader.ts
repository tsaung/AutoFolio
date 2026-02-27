"use client";

import { ImageLoaderProps } from "next/image";
import { cloudinaryUrl, isCloudinaryUrl } from "@/lib/cloudinary";

export const cloudinaryLoader = ({ src, width, quality }: ImageLoaderProps) => {
  if (!isCloudinaryUrl(src)) {
    return src;
  }
  return cloudinaryUrl(src, { width, quality: quality || "auto" });
};
