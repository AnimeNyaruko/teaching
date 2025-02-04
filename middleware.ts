import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
	const session = (await cookies()).get("session")?.value;

	const currentUrl = req.nextUrl.pathname;
	const protectedUrls = "/admin";
	const publicUrls = "/login";

	const isLogin = currentUrl.includes(protectedUrls);
	const isPublic = currentUrl.includes(publicUrls);

	if (isLogin && !session) {
		return NextResponse.redirect(new URL("/login", req.nextUrl));
	}

	if (isPublic && session) {
		return NextResponse.redirect(new URL("/admin", req.nextUrl));
	}
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
