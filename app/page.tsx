/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useState } from "react";

import Notifications from "./ui/components/notifications";

export default function Page() {
	const [HWnumber, setHWnumber] = useState<any>("---");

	useEffect(() => {
		const fetchHWnumber = async () => {
			const response = await fetch("/api/homeworks");
			const data = await response.json();
			setHWnumber(data.body);
		};
		fetchHWnumber();
		const interval = setInterval(fetchHWnumber, 1000 * 15);
		return () => clearInterval(interval);
	}, []);

	return (
		<>
			<div className="notiContainer">
				<div>
					<Notifications message="Hi" type="message" />
				</div>
			</div>
			<div className="flex h-screen w-screen items-center justify-center gap-x-3 [&>*]:transition-colors">
				<Link
					href="/homeworks"
					type="button"
					className="group/xembtvn relative flex h-auto w-1/2 cursor-pointer flex-col items-center justify-center gap-y-3 rounded-full border-[2px] border-solid border-white p-8 text-[1.25rem] font-bold text-white hover:bg-white hover:[&>p]:text-black!"
				>
					<p>Xem BTVN</p>
					<p className="hidden group-hover/xembtvn:block!">{`Số bài: ${HWnumber}`}</p>
				</Link>
			</div>
		</>
	);
}
