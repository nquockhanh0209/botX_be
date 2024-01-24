import RedisComponent from "src/components/redis.component";

import {
  Global,
  LogLevel,
  Module,
} from "@nestjs/common";

import { LoggerService } from "./custom.logger";

@Global()
@Module({
    providers: [LoggerService, RedisComponent],
    exports: [LoggerService, RedisComponent],
})
export class LoggerModule {
    static LogLevel(level?: string): LogLevel[] {
        var result: string[] = new Array()
        switch (level) {
            case "verbose":
                result.push("verbose")
            case "debug":
                result.push("debug")
            case "warn":
                result.push("warn")
            case "error":
                result.push("error")
            case "log":
                result.push("log")
                break
            default:
                result.push("log")
                break
        }
        return result as LogLevel[]
    }
}
