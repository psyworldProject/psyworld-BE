import { verify } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
dotenv.config();

export interface TokenPayload {
	// token decode 하면 무엇이 들어가 있는지 작성
	email: string;
	username: string;
	id: number;
}

export interface JwtRequest extends Request {
	// payload 를 포함한 request 타입을 생성
	decoded?: TokenPayload;
}

export class AuthMiddleware {
	static verifyToken = (req: JwtRequest, res: Response, next: NextFunction) => {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];

		if (!token) {
			return res.status(403).send('A token is required for authentication');
		}
		try {
			const decoded = verify(token, process.env.SECRET_ATOKEN) as TokenPayload; // 타입 표명 (보통은 사용하지 않는 것이 좋지만, verify 함수 자체를 수정할 수 없고, 개발자가 타입을 더 정확히 알고 있으므로 사용)
			req.decoded = decoded;
		} catch (err) {
			return res.status(401).send('Invalid Token');
		}
		return next(); // 다음 로직으로 넘어가라는 뜻
	};
}
