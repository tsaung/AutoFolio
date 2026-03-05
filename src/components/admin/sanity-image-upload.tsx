"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2, ImageIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { uploadImage } from "@/lib/actions/sanity-assets";
import { urlFor } from "@/sanity/lib/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SanityImageUploadProps {
  // Value will hold the Sanity asset metadata or an object like { _type: 'image', asset: { _ref: '...' } }
  value?: any; 
  onChange: (value: any) => void;
  className?: string;
  disabled?: boolean;
}

export function SanityImageUpload({
  value,
  onChange,
  className,
  disabled,
}: SanityImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  // Extract the reference, whether the value is just the asset string/ref, or the whole image object
  const imageRef = value?.asset?._ref || value?._ref || (typeof value === 'string' ? value : null);
  
  // We can only preview if we have an image reference
  const imageUrl = imageRef ? urlFor({ _ref: imageRef }).width(400).url() : null;

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const result = await uploadImage(formData);

        if (result.success) {
          // Construct the Sanity image object
          const imageObject = {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: result.assetId,
            },
          };
          onChange(imageObject);
          toast.success("Image uploaded successfully");
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
      "image/gif": [],
      "image/svg+xml": [],
    },
    maxFiles: 1,
    disabled: disabled || isUploading,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  return (
    <div className={cn("space-y-4 w-full", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg transition-colors cursor-pointer overflow-hidden",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50",
          disabled && "opacity-50 cursor-not-allowed",
          imageUrl && "border-solid border-muted"
        )}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center p-6 text-muted-foreground w-full h-full bg-background/50 z-10 absolute inset-0">
            <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
            <p className="text-sm font-medium">Uploading image...</p>
          </div>
        ) : imageUrl ? (
          <div className="relative w-full h-full group">
            <Image
              src={imageUrl}
              alt="Uploaded image"
              fill
              className="object-contain"
              sizes="(max-width: 400px) 100vw, 400px"
              unoptimized={imageUrl.endsWith('.svg')} // useful if dealing with SVG
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="mb-2"
                onClick={handleRemove}
                disabled={disabled}
              >
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
              <p className="text-xs text-white opacity-80">
                Click or drag another file to replace
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-muted-foreground">
            <UploadCloud
              className={cn("h-10 w-10 mb-4", isDragActive && "text-primary")}
            />
            <p className="mb-2 text-sm font-medium">
              <span className="text-primary font-semibold">Click to upload</span>{" "}
              or drag and drop
            </p>
            <p className="text-xs opacity-70">
              SVG, PNG, JPG or GIF (max. 10MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
