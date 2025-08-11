import { nanoid } from "nanoid";

export interface UploadOptions {
  folder?: string;
  filename?: string;
  contentType?: string;
  makePublic?: boolean;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

// Upload service for your Worker
export class R2StorageService {
  private readonly bucket: R2Bucket;
  private readonly publicDomain: string;
  constructor(bucket: R2Bucket, publicDomain: string) {
    this.bucket = bucket;
    this.publicDomain = publicDomain;

    if (!this.publicDomain) {
      throw new Error("R2_CUSTOM_DOMAIN is not set");
    }
  }

  /**
   * Upload a file to R2 bucket - Generic method
   */
  async uploadFile(file: File | ArrayBuffer | Uint8Array | string, options: UploadOptions = {}): Promise<UploadResult> {
    try {
      const { folder = "", filename, contentType, makePublic = true } = options;

      // Generate unique filename if not provided
      const fileExtension = filename ? this.getFileExtension(filename) : "";
      const uniqueFilename = filename || `${nanoid()}${fileExtension}`;

      // Construct the full key with folder
      const key = folder ? `${folder.replace(/^\/+|\/+$/g, "")}/${uniqueFilename}` : uniqueFilename;

      // Prepare upload options
      const uploadOptions: R2PutOptions = {
        ...(contentType && { httpMetadata: { contentType } }),
        ...(makePublic && {
          customMetadata: {
            "public-access": "true",
          },
        }),
      };

      // Upload to R2
      const result = await this.bucket.put(key, file, uploadOptions);

      if (!result) {
        return {
          success: false,
          error: "Failed to upload file to R2",
        };
      }

      // Generate public URL
      const publicUrl = `${this.publicDomain}/${key}`;

      return {
        success: true,
        url: publicUrl,
        key: key,
      };
    } catch (error) {
      console.error("R2 upload error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown upload error",
      };
    }
  }

  /**
   * Upload employee photo with optimized settings
   */
  async uploadEmployeePhoto(
    file: File | ArrayBuffer | Uint8Array,
    employeeId: string,
    options: Partial<UploadOptions> = {},
  ): Promise<UploadResult> {
    return this.uploadFile(file, {
      folder: "employees/photos",
      filename: `${employeeId}_${nanoid()}.jpg`,
      contentType: "image/jpeg",
      makePublic: true,
      ...options,
    });
  }

  /**
   * TODO: Upload document with organized folder structure
   */
  // async uploadDocument(
  //   file: File | ArrayBuffer | Uint8Array,
  //   category: string,
  //   options: Partial<UploadOptions> = {},
  // ): Promise<UploadResult> {
  //   return this.uploadFile(file, {
  //     folder: `documents/${category}`,
  //     makePublic: false, // Documents usually private
  //     ...options,
  //   });
  // }

  /**
   * Delete a file from R2
   */
  async deleteFile(key: string): Promise<boolean> {
    try {
      await this.bucket.delete(key);
      return true;
    } catch (error) {
      console.error("R2 delete error:", error);
      return false;
    }
  }

  /**
   * Get file info from R2
   */
  async getFileInfo(key: string): Promise<R2Object | null> {
    try {
      return await this.bucket.head(key);
    } catch (error) {
      console.error("R2 head error:", error);
      return null;
    }
  }

  /**
   * Check if file exists
   */
  async fileExists(key: string): Promise<boolean> {
    const info = await this.getFileInfo(key);
    return info !== null;
  }

  private getFileExtension(contentType: string): string {
    const extensions: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
    };
    return extensions[contentType] || "jpg";
  }

  /**
   * Validate file type for images
   */
  static isValidImageType(contentType: string): boolean {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    return validTypes.includes(contentType.toLowerCase());
  }

  /**
   * Validate file size
   */
  static isValidFileSize(size: number, maxSizeMB: number = 5): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return size <= maxSizeBytes;
  }
}
