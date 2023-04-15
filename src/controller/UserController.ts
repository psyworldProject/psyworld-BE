import { Request, Response } from 'express';
import { User } from '../entity/User';
import { generateAccessToken, generatePassword, generateRefreshToken, registerToken } from '../util/Auth';
import { verify } from 'jsonwebtoken';

export class UserController {
	static register = async (req: Request, res: Response) => {
		const { username, email, password } = req.body;
		const user = new User();
		user.username = username;
		user.email = email;
		user.password = await generatePassword(password);

		// 회원가입 시 자동 로그인 구현 -> 액세스 토큰 및 리프레시 토큰 발급
		const accessToken = generateAccessToken(user.id, user.username, user.email);
		const refreshToken = generateRefreshToken(user.id, user.username, user.email);
		registerToken(refreshToken, accessToken);
		// 토큰 복호화해서 담겨있는 유저 정보 및 토큰 만료 정보도 함께 넘겨줌
		const decoded = verify(accessToken, process.env.SECRET_ATOKEN);

		res.cookie('refreshToken', refreshToken, { path: '/', httpOnly: true, maxAge: 60 * 60 * 24 * 30 * 1000 });
		res.send({ content: decoded, accessToken });
	};
}
