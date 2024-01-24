import { Injectable } from "@nestjs/common";

import langs from "../i18n/index";

@Injectable()
export class MessageComponent {
    static langs: Map<string, Map<string, string>>
    languageDefault = "en"

    static init(): void {
        MessageComponent.langs = langs
    }

    lang(message: string, language: string = null): string {
        const lang = language ? language : this.languageDefault

        if (MessageComponent.langs && MessageComponent.langs.has(lang)) {
            return MessageComponent.langs.get(lang).get(message) ?? message
        }

        return message
    }
}
