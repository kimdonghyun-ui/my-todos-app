import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
	console.log("✅ 로그인 상태 확인 요청");

	const cookieStore = await cookies(); // ✅ 'await' 추가
	const token = cookieStore.get("accessToken");

	if (!token) {
		return NextResponse.json({
			message: "로그인 필요",
			token: null,
		});
	}

	return NextResponse.json({
		message: "로그인 상태 유지",
		token: token.value,
	});
}
