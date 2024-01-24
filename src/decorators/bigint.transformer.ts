import { ValueTransformer } from "typeorm";

export const bigintValue: ValueTransformer = {
    to: (entityValue: number) => entityValue,
    from: (databaseValue: string): number => parseInt(databaseValue, 10)
}