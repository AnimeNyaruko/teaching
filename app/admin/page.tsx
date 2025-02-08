/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { deleteSession } from "@/libs/authencation";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function Task() {}

export default function Page() {
	const route = useRouter();
	const [state, action, isPending] = useActionState(deleteSession, false);

	const [KTask, setKTask] = useState<any>("---");
	const [NTask, setNTask] = useState<any>("---");

	useEffect(() => {
		if (state) {
			route.refresh();
		}
		const fetchHWnumber = async () => {
			const response = await fetch("/api/homeworks/counts", {
				cache: "default",
			});
			const data = await response.json();
			setKTask(data.body.Khang);
			setNTask(data.body.Ngân);
		};
		fetchHWnumber();
	}, [state, isPending]);

	return (
		<div>
			<form
				className="flex h-screen w-screen flex-col items-center gap-y-10 pb-10"
				action={action}
			>
				<div className="flex h-20 w-full justify-between rounded-b-md bg-blue-900 px-5 py-3">
					<button
						className="cursor-pointer rounded-full bg-green-400 px-7 py-3 font-bold text-white!"
						type="button"
					>
						Add task
					</button>
					<div className="flex items-center gap-x-3 font-bold">
						<p>K: {KTask}</p>
						<div className="h-full border border-solid border-black" />
						<p>N: {NTask}</p>
					</div>
					<button
						className="cursor-pointer rounded-full bg-gray-400 px-7 py-3 font-bold text-white!"
						type="submit"
					>
						Sign out
					</button>
				</div>
				<div className="grid w-full grow grid-cols-2 grid-rows-1 overflow-y-auto">
					<div className="custom-scrollbar-left flex grow flex-col items-center overflow-y-auto border-l-2 border-solid border-white p-10">
						<header className="mb-7 text-7xl font-bold text-white">
							KHANG
						</header>
						<div className="flex w-full flex-col items-center gap-y-5 first:mt-3! last:mb-3!">
							<Task />
						</div>
					</div>
					<div className="custom-scrollbar-right flex grow flex-col items-center overflow-y-auto border-l-2 border-solid border-white p-10">
						<header className="mb-7 text-7xl font-bold text-white">NGÂN</header>
					</div>
				</div>
			</form>
		</div>
	);
}
