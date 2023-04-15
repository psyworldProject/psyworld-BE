import bycript from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { tokenList } from "../app";

dotenv.config();

export const generatePassword = async (password: string) => {
  const salt = await bycript.genSalt(10); // 10자리의 salt를 생성
  const hash = await bycript.hash(password, salt); // salt를 이용하여 password를 hash
  return hash;
};

export const generateAccessToken = (
  id: number,
  username: string,
  email: string
) => {
  return jwt.sign({ id, username, email }, process.env.SECRET_ATOKEN, {
    expiresIn: "1h", // 1시간
  });
};

export const generateRefreshToken = (
  id: number,
  username: string,
  email: string
) => {
  return jwt.sign({ id, username, email }, process.env.SECRET_RTOKEN, {
    expiresIn: "30d", // 1시간
  });
};

export const registerToken = (accessToken: string, refreshToken: string) => {
  tokenList[refreshToken] = {
    accessToken,
    refreshToken,
  };
};

export const removeToken = (refreshToken: string) => {
  delete tokenList[refreshToken];
};
