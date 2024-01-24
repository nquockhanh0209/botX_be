import { BaseDto } from "src/base/base.dto";
import { Property } from "src/utils/general.util";

class Obj {

}

export class MessageData extends BaseDto<Obj>
{
    @Property()
    message: string

    @Property()
    title: string

    @Property()
    subtile: string

    @Property()
    deepLink: string
}