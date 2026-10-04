export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "",
};

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  resource_type: string;
  width: number;
  height: number;
} 

export interface CloudinaryDeleteResult {
  result: string;
}

// Client-side upload function
export async function uploadImageToCloudinary(
  file: File,
  folder?: string
): Promise<CloudinaryUploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinaryConfig.uploadPreset);
  if (folder) {
    formData.append("folder", `passeio-legal/${folder}`);
  } else {
    formData.append("folder", "passeio-legal");
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

// Server-side delete function (API route)
export async function deleteImageFromCloudinary(
  publicId: string
): Promise<CloudinaryDeleteResult> {
  try {
    const response = await fetch("/api/cloudinary/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      throw new Error("Delete failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
}

// Generate optimized image URL
export function getOptimizedImageUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
  }
): string {
  const baseUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/fetch`;

  const params = new URLSearchParams();
  if (options?.width) params.append("w", options.width.toString());
  if (options?.height) params.append("h", options.height.toString());
  if (options?.crop) params.append("c", options.crop);
  if (options?.quality) params.append("q", options.quality);

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}/${publicId}` : `${baseUrl}/${publicId}`;
}

// Batch upload function for multiple files
export async function batchUploadImages(
  files: File[],
  folder?: string
): Promise<CloudinaryUploadResult[]> {
  try {
    const uploadPromises = files.map((file) =>
      uploadImageToCloudinary(file, folder)
    );
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Error batch uploading images:", error);
    throw error;
  }
}
