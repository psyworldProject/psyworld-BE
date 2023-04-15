// 미들웨어 -> 인증과 관련한 로직

import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export interface TokenPayload {
  email: string;
  username: string;
  id: number;
}

export interface JwtRequest extends Request {
  decoded?: TokenPayload;
}

export class AuthMiddleware {
  static verifyToken = (req: JwtRequest, res: Response, next: NextFunction) => {
    // header에 token이 있는지 확인
    const authHeader = req.headers["authorization"]; // Bearer token
    const token = authHeader && authHeader.split(" ")[1];
    // token이 없다면? 403에러

    if (!token) {
      return res.status(403).send("토큰이 없습니다.");
    }

    // 토큰이 우리가 발급한게 아니라면? 401에러
    try {
      const decoded = verify(token, process.env.SECRET_ATOKEN) as TokenPayload;
      req.decoded = decoded;
    } catch (error) {
      return res.status(401).send("토큰이 유효하지 않습니다.");
    }

    return next();
  };
}
