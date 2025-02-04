/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useActionState, useEffect, useState, startTransition } from "react";
import { createSession } from "@/libs/authencation";
import clsx from "clsx";
import { useRouter } from "next/navigation";

export default function Page() {
	const route = useRouter();

	const [state, action, isPending] = useActionState(createSession, true);
	const [formState, setFormState] = useState<any>(<p>Submit</p>);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault(); // Prevent the default form submission
		const formData = new FormData(event.currentTarget);
		startTransition(() => {
			action(formData);
		});
	};

	useEffect(() => {
		if (isPending) {
			setFormState(<p>Đợi...</p>);
		} else if (state) {
			route.refresh();
		} else setFormState(<p>Submit</p>);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state, isPending]);

	return (
		<form onSubmit={handleSubmit}>
			<div className="flex h-screen w-screen items-center justify-center">
				<div className="flex h-fit w-1/4 flex-col items-center gap-y-12 rounded-3xl bg-[rgba(255,255,255,.15)] px-3 py-12 shadow-[5px_5px_20px_5px_rgba(255,255,255,.25)]">
					<p className="text-5xl font-bold">LOGIN</p>
					<input
						className="w-3/4 rounded-lg bg-[inherit] px-3 py-2 text-white outline-2 outline-gray-500 placeholder:font-medium placeholder:text-[rgba(255,255,255,.5)] focus:outline-white"
						type="text"
						name="username"
						id="username"
						placeholder="Tên đăng nhập"
					/>
					<input
						className="w-3/4 rounded-lg bg-[inherit] px-3 py-2 text-white outline-2 outline-gray-500 placeholder:font-medium placeholder:text-[rgba(255,255,255,.5)] focus:outline-white"
						type="password"
						name="password"
						id="password"
						placeholder="Mật khẩu"
					/>
					<button
						className={clsx(
							"rounded-3xl px-7 py-4 text-xl font-bold text-white",
							{
								"bg-gray-400!": isPending,
								"bg-green-400": state,
								"bg-red-400": !state,
							},
						)}
						type="submit"
						disabled={isPending}
					>
						{formState}
					</button>
				</div>
			</div>
		</form>
	);
}
