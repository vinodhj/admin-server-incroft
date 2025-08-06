import { AuthDataSource } from "@src/datasources/auth";
import { AuthServiceAPI } from "./auth-service";
import { UserDataSource } from "@src/datasources/user";
import { UserServiceAPI } from "./user-service";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { KvStorageServiceAPI } from "./kv-storage-service";
import { KvStorageDataSource } from "@src/datasources/kv-storage";
import { Role } from "db/schema/user";
import { CategoryServiceAPI } from "./category-service";
import { CategoryDataSource } from "@src/datasources/category-datasources";
import { EmployeeCodeServiceAPI } from "./employee-code-service";

export type SessionUserType = {
  id: string;
  role: Role;
  email: string;
  name: string;
} | null;

interface APIParams {
  db: DrizzleD1Database;
  env: Env;
  sessionUser: SessionUserType;
}

export interface APIs {
  authAPI: AuthServiceAPI;
  userAPI: UserServiceAPI;
  kvStorageAPI: KvStorageServiceAPI;
  categoryAPI: CategoryServiceAPI;
  employeeCodeAPI: EmployeeCodeServiceAPI;
}

/**
 * Factory function to create API/service instances.
 */
export const createAPIs = ({ db, env, sessionUser }: APIParams): APIs => {
  // Employee Code Service API
  const employeeCodeAPI = new EmployeeCodeServiceAPI(env);

  // KV Storage Service API
  const kvStorageDataSource = new KvStorageDataSource(env.KV_INCROFT_JWT_AUTH, env.ENVIRONMENT);
  const kvStorageAPI = new KvStorageServiceAPI(kvStorageDataSource);

  // Auth Service API
  const authDataSource = new AuthDataSource({ db, kvStorageDataSource, sessionUser });
  const authAPI = new AuthServiceAPI({ authDataSource, jwtSecret: env.JWT_SECRET, sessionUser, employeeCodeAPI });

  // User Service API
  const userDataSource = new UserDataSource({ db, sessionUser });
  const userAPI = new UserServiceAPI({ userDataSource, sessionUser });

  // Category Service API
  const categoryDataSource = new CategoryDataSource({ db, sessionUser });
  const categoryAPI = new CategoryServiceAPI({ categoryDataSource, sessionUser });

  return { authAPI, userAPI, kvStorageAPI, categoryAPI, employeeCodeAPI };
};
