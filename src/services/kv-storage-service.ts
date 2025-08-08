import { KvStorageDataSource } from "@src/datasources/kv-storage";
import { AdminKvAsset, AdminKvAssetInput } from "generated";
import { GraphQLError } from "graphql";
import { BaseService } from "./base-service";
import { SessionUserType } from ".";

export class KvStorageServiceAPI extends BaseService {
  private readonly kvDataSource: KvStorageDataSource;

  constructor({ kvDataSource, sessionUser }: { kvDataSource: KvStorageDataSource; sessionUser: SessionUserType }) {
    super(sessionUser);
    this.kvDataSource = kvDataSource;
  }

  async adminKvAsset(input: AdminKvAssetInput): Promise<AdminKvAsset> {
    // This is used to fetch faq and global search, so we need basic read permission
    this.requirePermission("kv", "read");

    try {
      return await this.kvDataSource.adminKvAsset(input);
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
