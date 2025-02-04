import { cookies } from "next/headers";

const username = process.env.ADMIN_USERNAME;
const password = process.env.ADMIN_PASSWORD;

export async function signIn(form: FormData) {
	const FormUsername = form.get("username") as string;
	const FormPassword = form.get("password") as string;

	if (FormUsername === username && FormPassword === password) {
		const expireTime = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		const session = Math.random().toString(36).substring(2);
		const cookie = await cookies();

		cookie.set("session", session, {
			httpOnly: true,
			secure: true,
			expires: expireTime,
			sameSite: "lax",
			path: "/",
		});
		return true;
	}
	return false;
}

export async function signOut() {
	const cookie = await cookies();
	try {
		cookie.delete("session");
		return true;
	} catch {
		return false;
	}
}
