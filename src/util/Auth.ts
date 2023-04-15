import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { tokenList } from '../app';
dotenv.config();

// 비밀번호 암호화를 위한 함수
export const generatePassword = async (pw: string) => {
	const salt = await bcrypt.genSalt(10); // 암호화에 사용할 임의의 문자열 (salt) 생성
	const password = await bcrypt.hash(pw, salt); // 해당 salt 를 활용해서 비밀번호 암호화
	return password;
};

// 엑세스 토큰 생성을 위한 함수
export const generateAccessToken = (id: number, username: string, email: string) => {
	return jwt.sign({ id: id, username: username, email: email }, process.env.SECRET_ATOKEN, {
		expiresIn: '1h',
	}); // jwt.sign(유저 payload, 시크릿 키, 옵션) 형태로 명시 (만료 시간 1시간으로 설정)
};

// 리프레시 토큰 생성을 위한 함수
export const generateRefreshToken = (id: number, username: string, email: string) => {
	return jwt.sign({ id: id, username: username, email: email }, process.env.SECRET_RTOKEN, {
		expiresIn: '30d',
	}); // 만료시간 30일로 설정
};

// 우리가 어떤 리프레시 토큰을 발급했는 저장하기 위한 함수
export const registerToken = (refreshToken: string, accessToken: string) => {
	tokenList[refreshToken] = {
		status: 'loggedin',
		accessToken: accessToken,
		refreshToken: refreshToken,
	};
}; // 토큰과 해당 토큰의 상태를 저장

// 발급한 리프레시 토큰 삭제를 위한 함수
export const removeToken = (refreshToken: string) => {
	delete tokenList[refreshToken];
};
