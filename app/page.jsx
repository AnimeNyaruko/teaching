"use client";
import clsx from "clsx";
import { useEffect } from "react";
import { useState } from "react";

export default function Page() {
	const [HWnumber, setHWnumber] = useState(0);

	useEffect(() => {
		const fetchHWnumber = async () => {
			const response = await fetch("/api/homeworks");
			const data = await response.json();
			setHWnumber(data.length);
		};

		fetchHWnumber();
	}, []);

	return (
		<div className="flex h-screen w-screen items-center justify-center gap-x-3 bg-[#01002A] [&>*]:transition-colors">
			<button
				type="button"
				className="group/xembtvn relative flex h-auto w-1/4 cursor-pointer flex-col items-center justify-center gap-y-3 rounded-full border-[2px] border-solid border-white p-8 text-[1.25rem] font-bold text-white hover:bg-white hover:[&>p]:text-black!"
			>
				<p>Xem BTVN</p>
				<p className="hidden group-hover/xembtvn:block!">{`Số bài: ${HWnumber}`}</p>
			</button>
			<button
				type="button"
				className="relative flex h-auto w-1/4 cursor-pointer items-center justify-center rounded-full border-[2px] border-solid border-white p-8 text-[1.25rem] font-bold text-white hover:bg-white hover:text-black!"
			>
				Nộp BTVN
			</button>
		</div>
	);
}
