export interface EmpCodeConfig {
  prefix: string;
  includeYear: boolean;
  strategy: "sequential" | "name-based";
}

export class EmployeeCodeGenerator {
  private readonly config: EmpCodeConfig;

  constructor(config: EmpCodeConfig) {
    this.config = config;
  }

  generateEmployeeCode(totalCount: number, firstName?: string, lastName?: string): string {
    const nextSequential = totalCount + 1;

    if (this.config.strategy === "name-based" && firstName && lastName) {
      return this.generateNameBasedCode(nextSequential, firstName, lastName);
    }

    return this.generateSequentialCode(nextSequential);
  }

  private generateSequentialCode(sequentialNumber: number): string {
    const prefix = this.config.prefix;
    const year = this.config.includeYear ? new Date().getFullYear().toString() : "";
    const paddedNumber = sequentialNumber.toString().padStart(3, "0");

    return `${prefix}${year}${paddedNumber}`;
  }

  private generateNameBasedCode(sequentialNumber: number, firstName: string, lastName: string): string {
    const prefix = this.config.prefix;
    const year = this.config.includeYear ? new Date().getFullYear().toString().slice(-2) : "";

    const nameCode = (firstName.slice(0, 2) + lastName.slice(0, 2)).toUpperCase();
    const paddedNumber = sequentialNumber.toString().padStart(3, "0");

    return `${prefix}${year}${nameCode}${paddedNumber}`;
  }
}

export class EmployeeCodeServiceAPI {
  private readonly generator: EmployeeCodeGenerator;

  constructor(env: Env) {
    const config: EmpCodeConfig = {
      prefix: env.EMP_CODE_PREFIX || "INC",
      includeYear: env.EMP_CODE_INCLUDE_YEAR !== "false",
      strategy: (env.EMP_CODE_STRATEGY as "sequential" | "name-based") || "sequential",
    };

    this.generator = new EmployeeCodeGenerator(config);
  }

  generateForSignup(totalEmployeeCount: number, firstName?: string, lastName?: string): string {
    return this.generator.generateEmployeeCode(totalEmployeeCount, firstName, lastName);
  }
}
