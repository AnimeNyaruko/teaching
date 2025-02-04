/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { deleteSession } from "@/libs/authencation";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
	const route = useRouter();
	const [state, action, isPending] = useActionState(deleteSession, false);

	useEffect(() => {
		if (state) {
			route.refresh();
		}
	}, [state, isPending]);

	return (
		<div>
			<form action={action}>
				<button
					className="cursor-pointer rounded-full bg-gray-400 px-7 py-3 font-bold text-white!"
					type="submit"
				>
					Đăng xuất
				</button>
			</form>
		</div>
	);
}
