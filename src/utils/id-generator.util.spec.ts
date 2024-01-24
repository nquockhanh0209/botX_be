import {
  decodeId,
  generateId,
} from "./id-generator.util";

test("generateId_ValidInput_ReturnId", () => {
    const type = 1;
    const time = 1621800866366;
    const shard = 48;
    const sequenceId = 231;

    const generatedId = generateId(type, time, shard, sequenceId);
    const decodedId = decodeId(generatedId);

    expect(decodedId[0]).toStrictEqual(type);
    expect(decodedId[1]).toStrictEqual(time);
    expect(decodedId[2]).toBeLessThan(shard);
    expect(decodedId[3]).toStrictEqual(sequenceId);
});

test("generateId_InvalidTypeIdInput_ThrowError", () => {
    const type = 32;
    const time = 1614556800000;
    const shard = 43;
    const sequenceId = 354;

    expect(generateId(type, time, shard, sequenceId)).toBe(null)
});

test("generateId_InvalidTimeIdInput_ThrowError", () => {
    const type = 1;
    const time = 1609459100000;
    const shard = 43;
    const sequenceId = 354;

    expect(generateId(type, time, shard, sequenceId)).toBe(null)
});

test("generateId_InvalidShardIdInput_ThrowError", () => {
    const type = 1;
    const time = 1614556800000;
    const shard = 43423;
    const sequenceId = 354;

    expect(generateId(type, time, shard, sequenceId)).toBe(null)
});

test("generateId_InvalidSequenceIdIdInput_ThrowError", () => {
    const type = 1;
    const time = 1614556800000;
    const shard = 43;
    const sequenceId = 3545;

    expect(generateId(type, time, shard, sequenceId)).toBe(null)
});

test("decodeId_ValidInput_ReturnArray", () => {
    expect(decodeId("dnYUBEand")).toStrictEqual([0, 1621800866366, 48, 231]);
});
