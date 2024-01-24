import { Property } from "src/utils/general.util";

import { BaseDto } from "../base/base.dto";

class Obj { }

export class TokenDto extends BaseDto<Obj> {
    @Property()
    userId: number;

    @Property()
    role: string;

    @Property()
    refId: string;

    @Property()
    lang: string;
}
