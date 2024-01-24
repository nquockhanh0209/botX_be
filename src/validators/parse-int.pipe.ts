import { isString } from "class-validator"
import { ErrorCodes } from "../constants/error-code.const"
import { MessageComponent } from "../components/message.component"

import { ParseIntPipe, ArgumentMetadata, BadRequestException, ParseIntPipeOptions } from "@nestjs/common"

export class ParseIntPipe1 extends ParseIntPipe {
    constructor(options?: ParseIntPipeOptions) {
        super(options)
    }

    async transform(value: string, metadata: ArgumentMetadata): Promise<number> {
        try {
            return await super.transform(value, metadata)
        }
        catch (error) {
            const messageComponent = new MessageComponent()
            if (error instanceof BadRequestException) {
                const response = error.getResponse()
                throw new BadRequestException({
                    message: messageComponent.lang("VALIDATION_INPUT_TYPE_ERROR"),
                    cause: isString(response) ? response : response,
                    errorCode: ErrorCodes.VALIDATION_INPUT_TYPE_ERROR
                })
            }
            throw error
        }
    }
}
