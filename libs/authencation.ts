"use server";
import { signIn, signOut } from "@/auth";

export async function createSession(
	prevState: boolean | undefined,
	form: FormData,
) {
	return await signIn(form);
}

export async function deleteSession() {
	return await signOut();
}
