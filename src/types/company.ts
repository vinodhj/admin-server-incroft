import { gql } from "graphql-tag";

export const companyTypeDefs = gql`
  type Address {
    street: String!
    city: String!
    state: String!
    zipcode: String!
    country: String!
  }

  type SocialMedia {
    facebook: String
    twitter: String
    instagram: String
    linkedin: String
    youtube: String
    whatsapp: String
  }

  type CompanyProfile {
    name: String!
    description: String!
    short_description: String
    tagline: String
    primary_phone: String!
    alternate_phone: String
    public_contact_email: String!
    business_hours: String
    address: Address
    social_media: SocialMedia
  }

  input AddressInput {
    street: String!
    city: String!
    state: String!
    zipcode: String!
    country: String!
  }

  input SocialMediaInput {
    facebook: String
    twitter: String
    instagram: String
    linkedin: String
    youtube: String
    whatsapp: String
  }

  input UpdateCompanyProfileInput {
    name: String!
    description: String!
    short_description: String
    tagline: String
    primary_phone: String!
    alternate_phone: String
    public_contact_email: String!
    business_hours: String
    address: AddressInput
    social_media: SocialMediaInput
  }
  type AdminKvAsset {
    kv_key: String!
    kv_value: JSON
  }

  input AdminKvAssetInput {
    kv_key: String!
  }

  type CompanyProfileResponse {
    success: Boolean!
    company_profile: CompanyProfile
  }

  extend type Query {
    companyProfile: CompanyProfile
    adminKvAsset(input: AdminKvAssetInput!): AdminKvAsset
  }

  extend type Mutation {
    updateCompanyProfile(input: UpdateCompanyProfileInput!): CompanyProfileResponse!
  }
`;
