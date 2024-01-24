/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
 */
export class Base62 {
  private readonly base: bigint = BigInt(62);
  private readonly charset: string[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(
    "",
  );

  encode(input: bigint): string {
    if (input === BigInt(0)) {
      return "0";
    }

    let num: bigint = input;
    let str: string[] = [];

    while (num > BigInt(0)) {
      str = [this.charset[Number(num % this.base)], ...str];
      num = num / this.base;
    }

    return str.join("");
  }

  decode(str: string): string {
    return str
      .split("")
      .reverse()
      .reduce(
        (prev: bigint, char: string, i: number) =>
          prev + BigInt(this.charset.indexOf(char)) * this.base ** BigInt(i),
        BigInt(0),
      )
      .toString();
  }
}

export const base62: Base62 = new Base62();
