import { camelCase } from "change-case";
import moment from "moment";
import { Env } from "src/enums/app.enum";
import { Request } from "express";
import { extname } from "path";
import { Express } from "express";
import { FileMapper } from "src/interfaces/file-interface";

export function Property(
  className = "fields",
  defaultValue: unknown = undefined,
): PropertyDecorator {
  return (
    target: Record<string, unknown>,
    name: string,
    descriptor: PropertyDescriptor = null,
  ): void => {
    if (defaultValue !== undefined) {
      target[name] = defaultValue;
    }

    Reflect.defineMetadata(className, true, target, name);
  };
}

export function isEnv(env: string): boolean {
  const envSystem = process.env.NODE_ENV || Env.Dev;

  return env === envSystem;
}

export function isDebug(): boolean {
  const envSystem = process.env.NODE_ENV || Env.Dev;

  return Env.Production !== envSystem;
}

export const telephoneCheckAndGet = (str: string): string | null => {
  const phone = str.replace(/[^0-9]/g, "");

  const isPhone = /^($|(084|84|))(0?[3|5|7|8|9])([0-9]{8})\b/g.test(phone);

  if (isPhone) {
    return toStandard(phone);
  }

  return null;
};

const toStandard = (phone: string) => {
  if (phone.length === 10 && phone[0] === "0") {
    return `84${phone}`.replace(/840/g, "84");
  } else {
    let p = phone;
    if (p[0] === "0") {
      p = p.replace(/084/g, "84");
    }

    if (p[2] === "0") {
      p = p.replace(/840/g, "84");
    }

    return p;
  }
};

export const toSnakeCase = (str: string): string =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const trim = (str: string, trim_str: string, camelcase = false) => {
  let reg = new RegExp(`^${trim_str}+|${trim_str}+$`, "gm");

  return camelCase(str.replace(reg, ""));
};

export const currentTimestamp = (second = true) => {
  if (second) {
    return Math.round(Date.now() / 1000);
  }

  return Date.now();
};

export const startTimeOfDay = (second = true) => {
  if (second) {
    return moment().utcOffset(7).startOf("day").unix();
  }

  return moment().utcOffset(7).startOf("day").format("x");
};

export const convertMtoKm = (m: number): number => {
  return Math.round((m * 100) / 1000) / 100;
};

const mapBinary = new Map([
  [1, 0b000000000000000000000000000001], // 1
  [2, 0b000000000000000000000000000010], // 2
  [3, 0b000000000000000000000000000100], // 4
  [4, 0b000000000000000000000000001000], // 8
  [5, 0b000000000000000000000000010000], // 16
  [6, 0b000000000000000000000000100000], // 32
  [7, 0b000000000000000000000001000000], // 64
  [8, 0b000000000000000000000010000000], // 128
  [9, 0b000000000000000000000100000000], // 256
  [10, 0b000000000000000000001000000000], // 512
  [11, 0b000000000000000000010000000000], // 1024
  [12, 0b000000000000000000100000000000], // 2018
  [13, 0b000000000000000001000000000000], // 4096
  [14, 0b000000000000000010000000000000], // 8192
  [15, 0b000000000000000100000000000000], // 16384
  [16, 0b000000000000001000000000000000], // 32768
  [17, 0b000000000000010000000000000000], // 65536
  [18, 0b000000000000100000000000000000], // 131072
  [19, 0b000000000001000000000000000000], // 262144
  [20, 0b000000000010000000000000000000], // 524288
  [21, 0b000000000100000000000000000000], // 1048576
  [22, 0b000000001000000000000000000000], // 2097152
  [23, 0b000000010000000000000000000000], // 4194304
  [25, 0b000001000000000000000000000000], // 16777216
  [26, 0b000010000000000000000000000000], // 33554432
  [27, 0b000100000000000000000000000000], // 67108864
  [28, 0b001000000000000000000000000000], // 134217728
  [29, 0b010000000000000000000000000000], // 268435456
  [30, 0b100000000000000000000000000000], // 536870912
]);

export const convertDaysToBinary = (days: number[]): number => {
  if (!days || days.length === 0) {
    return 0;
  }

  let total = 0;
  days.forEach((day) => {
    total = total | mapBinary.get(day);
    console.log("Debug", total);
  });

  return total;
};

export const bitCount = (n: number) => {
  var bits = 0;
  while (n !== 0) {
    bits += bitCount32(n | 0);
    n /= 0x100000000;
  }

  return bits;
};

export const bitCount32 = (n: number) => {
  n = n - ((n >> 1) & 0x55555555);
  n = (n & 0x33333333) + ((n >> 2) & 0x33333333);

  return (((n + (n >> 4)) & 0xf0f0f0f) * 0x1010101) >> 24;
};

export function uniq<T>(a: T[]) {
  return Array.from(new Set(a));
}

export const editFileName = (
  req: Request,
  file: Express.Multer.File,
  callback,
) => {
  const name = file.originalname.split(".")[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join("");
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback,
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return callback(new Error("Only image files are allowed!"), false);
  }
  callback(null, true);
};

export const fileMapper = ({ file, req }: FileMapper) => {
  const image_url = `${req.protocol}://${req.headers.host}/${file.path}`.replace("/public", "");

  return {
    originalname: file.originalname,
    filename: file.filename,
    image_url,
  };
};
