import { base62 } from "./bigint-converter.util";

const INIT_DATE = 1609459200000; //01/01/2021 12:00 AM

export function generateId(
    type: number,
    time: number,
    shard: number,
    sequenceId: number,
): string {
    const typePart = type;
    const timePart = time - INIT_DATE;
    const shardPart = Math.floor(Math.random() * shard);
    const sequenceIdPart = sequenceId;

    if (isValidId(type, time, shard, sequenceId)) {
        const bigIntValue =
            (BigInt(typePart) << BigInt(60)) |
            (BigInt(timePart) << BigInt(19)) |
            (BigInt(shardPart) << BigInt(10)) |
            BigInt(sequenceIdPart);

        return base62.encode(bigIntValue);
    }

    return null
}

export function decodeId(input: string): number[] {
    const bigIntValue = BigInt(base62.decode(input));

    const type = Number(bigIntValue >> BigInt(60));
    const time =
        Number((bigIntValue >> BigInt(19)) & BigInt(0x1ffffffffff)) + INIT_DATE;
    const shard = Number((bigIntValue >> BigInt(10)) & BigInt(0x1ff));
    const sequenceId = Number(bigIntValue & BigInt(0x3ff));

    return [type, time, shard, sequenceId];
}

function isValidId(
    type: number,
    time: number,
    shard: number,
    sequenceId: number,
): boolean {
    if (
        type < 16
        && time > INIT_DATE
        && shard < 512
        && sequenceId < 1024
    ) return true
    return false
}

export function isUserCode(id: string): boolean {
    const decodedId = decodeId(id)
    return isValidId(
        decodedId[0],
        decodedId[1],
        decodedId[2],
        decodedId[3],
    )
}
