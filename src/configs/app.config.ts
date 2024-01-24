export default (): Record<string, unknown> => ({
  PORT: parseInt(process.env.PORT, 10) || 3000,
  apiPrefix: process.env.API_PREFIX,
  language: "vi",
  redisUri: process.env.REDIS_URI,
  logLevel: process.env.LOG_LEVEL,
  TOKEN_EXPIRED: parseInt(process.env.JWT_EXPIRES_IN || "2d"),
  rabbitmqUri: process.env.RABBITMQ_URI,
  exchangeRateMoney: process.env.EXCHANGE_RATE_MONEY || 24000,
  rateAffiliate: process.env.RATE_AFFILIATE || 0.1,
  rateUserGetRef: process.env.RATE_USER_GET_REF || 0.02,
  exchangeRateWithdrawn: process.env.EXCHANGE_WITHDRAWN_MONEY || 24000,
  limitService: process.env.LIMIT || 100,
  privateKey: (() => {
    try {
      const fs = require("fs");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const data: string = fs.readFileSync(
        process.env.JWT_PRIVATE_KEY || "data/private.pem",
        "utf8",
      );

      return clean(data);
    } catch (err) {
      console.error(err);
    }
  })(),
  publicKey: (() => {
    const fs = require("fs");

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const data = fs.readFileSync(
        process.env.JWT_PUBLIC_KEY || "data/public.pem",
        "utf8",
      );

      return clean(data);
    } catch (err) {
      console.error(err);
    }
  })(),
});

export function clean(key: string): string {
  if (!key || typeof key !== "string") return key;

  const lines = key.split(/\r?\n/);
  if (lines.length !== 1) return key;

  const wrappedKey = [
    "-----BEGIN PRIVATE KEY-----",
    ...key.match(/.{1,64}/g),
    "-----END PRIVATE KEY-----",
    "",
  ].join("\n");

  return wrappedKey;
}
