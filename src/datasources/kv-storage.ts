import { AdminKvAsset, AdminKvAssetInput, CompanyProfile, UpdateCompanyProfileInput } from "generated";
import { GraphQLError } from "graphql";

export class KvStorageDataSource {
  private readonly kvAssets: KVNamespace;
  private readonly ENVIRONMENT: string;

  // KV Keys
  private readonly COMPANY_PROFILE_KEY = "company_profile";

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

  async getCompanyProfile(): Promise<CompanyProfile | null> {
    try {
      const result = await this.kvAssets.get(this.COMPANY_PROFILE_KEY);

      if (!result) {
        return null;
      }

      return JSON.parse(result) as CompanyProfile;
    } catch (error) {
      console.error("Error fetching company profile:", error);
      throw new GraphQLError("Failed to get company profile", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          error,
        },
      });
    }
  }

  async updateCompanyProfile(input: UpdateCompanyProfileInput): Promise<CompanyProfile> {
    try {
      const companyProfile: CompanyProfile = {
        name: input.name,
        description: input.description,
        short_description: input.short_description || null,
        tagline: input.tagline || null,
        primary_phone: input.primary_phone,
        alternate_phone: input.alternate_phone || null,
        public_contact_email: input.public_contact_email,
        business_hours: input.business_hours || null,
        ...(input.address && {
          address: {
            street: input.address.street,
            city: input.address.city,
            state: input.address.state,
            zipcode: input.address.zipcode,
            country: input.address.country,
          },
        }),
        ...(input.social_media && {
          social_media: {
            facebook: input.social_media.facebook || null,
            twitter: input.social_media.twitter || null,
            instagram: input.social_media.instagram || null,
            linkedin: input.social_media.linkedin || null,
            youtube: input.social_media.youtube || null,
            whatsapp: input.social_media.whatsapp || null,
          },
        }),
      };

      await this.kvAssets.put(this.COMPANY_PROFILE_KEY, JSON.stringify(companyProfile), {
        // Set metadata for auditing
        metadata: {
          updated_at: new Date().toISOString(),
          environment: this.ENVIRONMENT,
        },
      });

      return companyProfile;
    } catch (error) {
      console.error("Error updating company profile:", error);
      throw new GraphQLError("Failed to update company profile", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          error,
        },
      });
    }
  }
}
