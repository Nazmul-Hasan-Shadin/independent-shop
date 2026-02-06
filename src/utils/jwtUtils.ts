import jwt, { JwtPayload, Secret ,SignOptions} from "jsonwebtoken";
export const generateToken = (
 payload: string | object,
  secret: string,
expiredIn: jwt.SignOptions["expiresIn"]
) => {
  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn: expiredIn,
  });

  return token;
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};
