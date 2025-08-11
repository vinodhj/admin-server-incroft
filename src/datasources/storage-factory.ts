import { R2StorageService } from "./r2-storage-service";

export interface StorageConfig {
  R2_BUCKET: R2Bucket;
  PUBLIC_DOMAIN: string;
}

export class StorageFactory {
  private static r2Instance: R2StorageService | null = null;

  /**
   * Get or create R2 storage service instance
   */
  static getR2Storage(config: StorageConfig): R2StorageService {
    if (!this.r2Instance) {
      this.r2Instance = new R2StorageService(config.R2_BUCKET, config.PUBLIC_DOMAIN);
    }
    return this.r2Instance;
  }

  /**
   * Reset instance (useful for testing)
   */
  static reset(): void {
    this.r2Instance = null;
  }
}
