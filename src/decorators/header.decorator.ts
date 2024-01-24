import { applyDecorators } from "@nestjs/common";
import { ApiHeader } from "@nestjs/swagger";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function Headers() {
    return applyDecorators(
        ApiHeader({
            name: "x-user-id",
            description: "X User Id",
        }),
        ApiHeader({
            name: "x-role",
            description: "Role User",
            schema: {
                default: "user"
            }
        }),
    );
}