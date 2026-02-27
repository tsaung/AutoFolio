/**
 * Cloudinary image URL helper.
 *
 * Transforms Cloudinary URLs to include automatic resizing & format params.
 * Expects `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` env var to be set.
 *
 * @example
 *   // Input: "https://res.cloudinary.com/demo/image/upload/sample.jpg"
 *   // Output with resize: "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800,h_600,c_fill/sample.jpg"
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

/**
 * Check if a URL is a Cloudinary URL that we can transform.
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes("res.cloudinary.com");
}

interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  /** Crop mode: 'fill' (default), 'fit', 'limit', 'thumb', 'scale' */
  crop?: "fill" | "fit" | "limit" | "thumb" | "scale";
  /** Quality: 'auto' (default), or a number 1-100 */
  quality?: "auto" | number;
  /** Format: 'auto' (default) serves WebP/AVIF based on browser support */
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
  /** Gravity for crop: 'auto' (default), 'face', 'center' etc. */
  gravity?: "auto" | "face" | "center";
}

/**
 * Add Cloudinary transformations to a URL.
 *
 * If the URL is already a Cloudinary URL, inserts transformations after `/upload/`.
 * If not a Cloudinary URL, returns it unchanged.
 */
export function cloudinaryUrl(
  url: string,
  options: CloudinaryTransformOptions = {},
): string {
  if (!isCloudinaryUrl(url)) {
    return url;
  }

  const {
    width,
    height,
    crop = "fill",
    quality = "auto",
    format = "auto",
    gravity = "auto",
  } = options;

  const transforms: string[] = [`f_${format}`, `q_${quality}`];

  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) {
    transforms.push(`c_${crop}`);
    if (crop === "fill" || crop === "thumb") {
      transforms.push(`g_${gravity}`);
    }
  }

  const transformString = transforms.join(",");

  // Insert transformations after /upload/
  // Cloudinary URL format: .../image/upload/[existing_transforms/]public_id.ext
  return url.replace(/\/upload\/(.*)/, `/upload/${transformString}/$1`);
}

/**
 * Get the Cloudinary cloud name for use in next.config.ts remotePatterns.
 */
export function getCloudName(): string | undefined {
  return CLOUD_NAME;
}
