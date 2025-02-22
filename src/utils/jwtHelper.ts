import jwt, { Secret } from "jsonwebtoken";
import config from "../config";

const generateToken = async (payload: { userId: number }, secret: Secret) => {
  const token = jwt.sign({ userId: payload }, secret, {
    expiresIn: "7d",
  });
  return token;
};

const getUserInfoFromToken = async (token: string) => {
  try {
    const userData = jwt.verify(token, config.jwt.secret as string) as {
      userId: number;
    };
    return userData;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const jwtHelper = {
  generateToken,
  getUserInfoFromToken,
};
