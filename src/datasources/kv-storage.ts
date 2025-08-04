import { AdminKvAsset, AdminKvAssetInput } from "generated";
import { GraphQLError } from "graphql";

export class KvStorageDataSource {
  private readonly kvAssets: KVNamespace;
  private readonly ENVIRONMENT: string;

  constructor(kvAssets: KVNamespace, ENVIRONMENT: string) {
    this.kvAssets = kvAssets;
    this.ENVIRONMENT = ENVIRONMENT;
  }

  async adminKvAsset(input: AdminKvAssetInput): Promise<AdminKvAsset> {
    try {
      // fetch the admin kv asset from kv store
      const result = await this.kvAssets.get(input.kv_key.toString());
      return {
        kv_key: input.kv_key,
        kv_value: result ? JSON.parse(result) : null,
      };
    } catch (error) {
      console.error("Unexpected error:", error);
      throw new GraphQLError("Failed to get admin kv asset", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          error,
        },
      });
    }
  }
}
