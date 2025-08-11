import { AuthDataSource } from "@src/datasources/auth";
import { ChangePasswordInput, LoginInput, LoginResponse, LogoutResponse, SignUpInput, SignUpResponse } from "generated";
import { validateEmailAndPassword } from "@src/services/helper/authValidators";
import { generateToken, TokenPayload } from "@src/services/helper/jwtUtils";
import { changePasswordValidators } from "@src/services/helper/changePasswordValidators";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import { SessionUserType } from ".";
import { EmployeeCodeServiceAPI } from "./employee-code-service";
import { userCache } from "@src/cache/in-memory-cache";
import { BaseService } from "./base-service";

export class AuthServiceAPI extends BaseService {
  private readonly authDataSource: AuthDataSource;
  private readonly jwtSecret: string;
  private readonly employeeCodeAPI: EmployeeCodeServiceAPI;

  constructor({
    authDataSource,
    jwtSecret,
    sessionUser,
    employeeCodeAPI,
  }: {
    authDataSource: AuthDataSource;
    jwtSecret: string;
    sessionUser?: SessionUserType;
    employeeCodeAPI: EmployeeCodeServiceAPI;
  }) {
    super(sessionUser ?? null);
    this.authDataSource = authDataSource;
    this.jwtSecret = jwtSecret;
    this.employeeCodeAPI = employeeCodeAPI;
  }

  async signUp(input: SignUpInput): Promise<SignUpResponse> {
    validateEmailAndPassword(input.email, input.password);

    // Get total employee count for sequential numbering
    const totalCount = await this.authDataSource.getTotalEmployeeCount();

    // Generate employee code
    const employeeCode = this.employeeCodeAPI.generateForSignup(totalCount, "", "");

    //  Add employee code to input
    const signUpData = {
      ...input,
      emp_code: employeeCode,
    };

    const result = await this.authDataSource.signUp(signUpData);
    if (result) {
      userCache.clear();
    }
    return result;
  }

  async login(input: LoginInput): Promise<LoginResponse> {
    validateEmailAndPassword(input.email, input.password);

    const result = await this.authDataSource.login(input);

    const tokenPayload: TokenPayload = {
      id: result.user.id,
      email: result.user.email,
      name: result.user.first_name + " " + result.user.last_name,
      role: result.user.role,
      tokenVersion: result.token_version,
    };

    const token = generateToken(tokenPayload, this.jwtSecret, "3d");
    return {
      token,
      ...result,
      user: {
        ...result.user,
      },
    };
  }

  async changePassword(input: ChangePasswordInput): Promise<boolean> {
    // 🔐 Authorization check
    this.requirePermission("auth", "change_password_self");

    changePasswordValidators(input.current_password, input.new_password, input.confirm_password);

    const result = await this.authDataSource.changePassword(input);
    return result ?? false;
  }

  async logout(accessToken: string): Promise<LogoutResponse> {
    let payload: TokenPayload;
    try {
      payload = jwt.verify(accessToken, this.jwtSecret) as TokenPayload;
    } catch (error) {
      console.error("Invalid token:", error);
      throw new GraphQLError("Invalid token", {
        extensions: {
          code: "INVALID_TOKEN",
          error,
        },
      });
    }

    return { success: true };
  }
}
