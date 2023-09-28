import jwt, { Secret, SignOptions } from "jsonwebtoken";
import envReader from "./envReader";

export default async function generateJwtToken(
  payload: string | object | Buffer,
  expiresIn: string | number | undefined = "100d"
) {
  const opts: SignOptions = {};
  opts.expiresIn = expiresIn;
  const secret: Secret = envReader("JWT_SECRET_KEY");
  const token = await jwt.sign({ payload }, secret, opts);

  return token;
}
