import { Request, Response } from "express";
import { myDataBase } from "../db";
import { User } from "../entity/User";
import {
  generateAccessToken,
  generatePassword,
  generateRefreshToken,
  registerToken,
} from "../util/Auth";
import { verify } from "jsonwebtoken";
import bcript from "bcrypt";

export class UserController {
  static createUser = async (req: Request, res: Response) => {
    const { username } = req.body;

    const user = new User();
    user.username = username;

    const result = await myDataBase.getRepository(User).save(user);
    res.send(result);
  };

  static getUser = async (req: Request, res: Response) => {
    const users = await myDataBase.getRepository(User).find();
    res.send(users);
  };

  static register = async (req: Request, res: Response) => {
    const { email, password, username } = req.body;

    // 이메일 또는 유저네임이 없는 경우 (중복 유저 체크)
    const exisUser = await myDataBase.getRepository(User).findOne({
      where: [{ email }, { username }],
    });

    // 이미 존재하는 이메일 또는 유저네임인지 확인
    if (exisUser) {
      return res.status(400).json({
        message: "이미 존재하는 이메일 또는 유저네임입니다.",
      });
    }

    // 비밀번호를 암호화
    const user = new User();
    user.email = email;
    user.password = await generatePassword(password);
    user.username = username;

    // 유저를 데이터베이스에 저장
    const newUser = await myDataBase.getRepository(User).save(user);

    // 토큰 생성
    const accessToken = generateAccessToken(
      newUser.id,
      newUser.username,
      newUser.email
    );

    // 리프레시 토큰 생성
    const refreshToken = generateRefreshToken(
      newUser.id,
      newUser.username,
      newUser.email
    );

    // 토큰을 저장
    registerToken(refreshToken, accessToken);

    // 토큰을 쿠키에 저장
    const decoded = verify(accessToken, process.env.SECRET_ATOKEN);

    res.cookie("refreshToken", refreshToken, {
      path: "/",
      httpOnly: true,
      maxAge: 3600 * 24 * 30 * 1000,
    });
    res.send({
      content: decoded,
      accessToken,
    });
  };

  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await myDataBase.getRepository(User).findOne({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        error: "존재하지 않는 이메일입니다.",
      });
    }

    const validPassword = await bcript.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        error: "비밀번호가 일치하지 않습니다.",
      });
    }

    const accessToken = generateAccessToken(user.id, user.username, user.email);

    const refreshToken = generateRefreshToken(
      user.id,
      user.username,
      user.email
    );

    registerToken(refreshToken, accessToken);

    const decoded = verify(accessToken, process.env.SECRET_ATOKEN);
    res.cookie("refreshToken", refreshToken, {
      path: "/",
      httpOnly: true,
      maxAge: 3600 * 24 * 30 * 1000,
    });
    res.send({
      content: decoded,
      accessToken,
    });
  };
}
