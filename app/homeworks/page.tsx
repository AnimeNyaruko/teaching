/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faX } from "@fortawesome/free-solid-svg-icons/faX";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useRef, useEffect, useState } from "react";

function Task(props: {
	hwname: string;
	pname: string;
	type: string;
	deadline: string;
	taskStatus: string;
	taskStatusMessage: string;
	description: string;
}) {
	/**
	 * Task component represents a homework task submission interface.
	 *
	 * @param props - The properties for the Task component.
	 * @param props.hwname - The name of the homework.
	 * @param props.pname - The name of the person submitting the homework.
	 * @param props.type - The type of the task.
	 * @param props.deadline - The deadline for the task submission.
	 * @param props.taskStatus - The current status of the task.
	 * @param props.taskStatusMessage - The message associated with the task status.
	 * @param props.description - The description of the task.
	 *
	 * @returns A JSX element representing the task submission interface.
	 *
	 * The component allows users to drag and drop a .cpp file or select it via a file input.
	 * It provides visual feedback on the status of the file upload (loading, success, error).
	 *
	 * The component uses the following hooks:
	 * - `useRef` to reference the drop area, drop view, and file input elements.
	 * - `useState` to manage the current status view.
	 * - `useEffect` to add and remove event listeners for drag-and-drop functionality.
	 *
	 * The component also includes a function to handle file upload and status updates.
	 */
	const {
		hwname,
		pname,
		type,
		deadline,
		taskStatus,
		taskStatusMessage,
		description,
	} = props;

	const droparea = useRef<HTMLDivElement>(null);
	const dropview = useRef<HTMLParagraphElement>(null);
	const inputfile = useRef<HTMLInputElement>(null);
	const [currentStatusView, setStatusView] = useState<any>();

	const statusView = (status: "loading" | "success" | "error") => {
		switch (status) {
			case "loading":
				return (
					<p className="font-bold text-white">Đang xử lí file... Đợi tí nè.</p>
				);
			case "success":
				return (
					<div className="flex aspect-square h-fit items-center rounded-full bg-green-600 p-2 font-bold text-white">
						<FontAwesomeIcon fixedWidth className="" icon={faCheck} />
					</div>
				);
			case "error":
				return (
					<div className="flex aspect-square h-fit items-center rounded-full bg-red-600 p-2 font-bold text-white">
						<FontAwesomeIcon fixedWidth className="" icon={faX} />
					</div>
				);
		}
	};

	useEffect(() => {
		const dropArea = droparea.current;
		const dropView = dropview.current;
		const inputFile = inputfile.current;
		if (!dropArea || !dropView || !inputFile) return;

		//Function to change the drop view to active
		const active = () => {
			dropView.classList.remove("hidden");
			dropView.classList.add("flex");
		};
		//Function to change the drop view to inactive
		const inactive = () => {
			dropView.classList.remove("flex");
			dropView.classList.add("hidden");
		};
		//Function to prevent default event
		const prevent = (e: any) => {
			e.preventDefault();
		};

		const checkFile = async () => {
			const file = inputFile.files?.[0];
			if (file && file.name.endsWith(".cpp")) {
				//Set status to loading
				setStatusView(statusView("loading"));
				//Disable the input file
				inputFile.disabled = true;
				//Remove input file event from the drop area
				["dragenter", "dragover", "dragleave", "drop"].forEach(
					(eventName: string) => {
						dropArea?.removeEventListener(eventName, prevent);
						dropView?.removeEventListener(eventName, prevent);
					},
				);
				["dragenter", "dragover"].forEach((eventName: string) => {
					dropArea?.removeEventListener(eventName, active);
					dropView?.removeEventListener(eventName, active);
				});
				["dragleave", "drop"].forEach((eventName: string) => {
					dropView?.removeEventListener(eventName, inactive);
				});
				//TODO: transform json upload data to form data

				//Handle file drop event
				const uploadDataJSON = {
					HomeworkName: hwname.toLowerCase(),
					PersonName: pname.toLowerCase(),
					type: type.toLowerCase(),
					file: file,
				};

				const uploadFormData = new FormData();
				for (const key of Object.keys(uploadDataJSON) as Array<
					keyof typeof uploadDataJSON
				>) {
					uploadFormData.append(key, uploadDataJSON[key]);
				}

				fetch("api/upload", {
					method: "POST",
					body: uploadFormData,
				}).then(async (res) => {
					const data = await res.json();
					if (data.status === 200) {
						//Set status view to success
						setStatusView(statusView("success"));
					} else setStatusView(statusView("error"));
				});
			} else {
				setStatusView(statusView("error"));
			}
		};

		//Add event listener to the input file
		["dragenter", "dragover", "dragleave", "drop"].forEach(
			(eventName: string) => {
				dropArea.addEventListener(eventName, prevent);
				dropView.addEventListener(eventName, prevent);
			},
		);

		//Add event listener to the drop area
		["dragover", "dragenter"].forEach((eventName: string) => {
			dropArea.addEventListener(eventName, active);
			dropView.addEventListener(eventName, active);
		});

		//Add event listener to the drop area
		["dragleave", "drop"].forEach((eventName: string) => {
			dropView.addEventListener(eventName, inactive);
		});
		//TODO: When an file enter the drop area, transfer the current drop area to drop view to maintain the drop view.

		dropView.addEventListener("drop", (e) => {
			e.preventDefault();
			const dataTransfer = e.dataTransfer?.files;
			if (dataTransfer) {
				inputFile.files = dataTransfer;
				checkFile();
			}
		});
	}, []);

	return (
		<div
			ref={droparea}
			className={clsx(
				"relative flex min-h-[10rem] w-full flex-col items-start rounded-2xl border-5 border-solid p-5 text-pretty",
				{
					"border-green-400!": taskStatus === "success",
					"border-red-400!": taskStatus === "failed",
					"border-yellow-400!": taskStatus === "pending",
				},
			)}
		>
			<p
				ref={dropview}
				className="absolute top-1/2 left-1/2 hidden h-full w-full -translate-1/2 items-center justify-center rounded-2xl border-solid text-2xl font-bold backdrop-blur-xs"
			>
				THẢ FILE Ở ĐÂY
			</p>
			<p>
				<span className="font-bold">Loại bài tập: </span>
				{type}
			</p>
			<p>
				<span className="font-bold">Thời hạn: </span>
				{deadline}
			</p>
			<p
				className={clsx({
					"text-green-400! *:text-green-400!": taskStatus === "success",
					"text-red-400! *:text-red-400!": taskStatus === "failed",
					"text-yellow-400! *:text-yellow-400!": taskStatus === "pending",
				})}
			>
				<span className="font-bold">Trạng thái: </span>
				{taskStatusMessage}
			</p>
			<p>{description}</p>
			<input id="inputfile" ref={inputfile} type="file" accept=".cpp" hidden />
			<div className="flex w-full items-center justify-end gap-x-3">
				{currentStatusView}
				<label htmlFor="inputfile" className="flex">
					<p className="text-md cursor-pointer rounded-xl bg-green-400 p-2 font-bold">
						NỘP BÀI
					</p>
				</label>
			</div>
		</div>
	);
}

export default function HomeworkPage() {
	const [KTask, setKTask] = useState<any>();
	const [NTask, setNTask] = useState<any>();

	useEffect(() => {
		const getHomeworkData = () => {
			fetch("api/homeworks/khang")
				.then((res) => res.json())
				.then((data) => {
					const pendingTasks = data.data.pending.map((e: any) => (
						<Task
							hwname={e.hwname}
							pname="khang"
							type={e.type}
							deadline={e.deadlines}
							taskStatus={e.status}
							taskStatusMessage={e.statusmessage}
							description={e.description}
							key={e.id}
						/>
					));
					const successTasks = data.data.success.map((e: any) => (
						<Task
							hwname={e.hwname}
							pname="khang"
							type={e.type}
							deadline={e.deadlines}
							taskStatus={e.status}
							taskStatusMessage={e.statusmessage}
							description={e.description}
							key={e.id}
						/>
					));
					const failedTasks = data.data.failed.map((e: any) => (
						<Task
							hwname={e.hwname}
							pname="khang"
							type={e.type}
							deadline={e.deadlines}
							taskStatus={e.status}
							taskStatusMessage={e.statusmessage}
							description={e.description}
							key={e.id}
						/>
					));
					setKTask([pendingTasks, successTasks, failedTasks]);
				});
			fetch("api/homeworks/ngân")
				.then((res) => res.json())
				.then((data) => {
					const pendingTasks = data.data.pending.map((e: any) => (
						<Task
							hwname={e.hwname}
							pname="ngân"
							type={e.type}
							deadline={e.deadlines}
							taskStatus={e.status}
							taskStatusMessage={e.statusmessage}
							description={e.description}
							key={e.id}
						/>
					));
					const successTasks = data.data.success.map((e: any) => (
						<Task
							hwname={e.hwname}
							pname="ngân"
							type={e.type}
							deadline={e.deadlines}
							taskStatus={e.status}
							taskStatusMessage={e.statusmessage}
							description={e.description}
							key={e.id}
						/>
					));
					const failedTasks = data.data.failed.map((e: any) => (
						<Task
							hwname={e.hwname}
							pname="ngân"
							type={e.type}
							deadline={e.deadlines}
							taskStatus={e.status}
							taskStatusMessage={e.statusmessage}
							description={e.description}
							key={e.id}
						/>
					));
					setNTask([pendingTasks, successTasks, failedTasks]);
				});
		};

		const interval = setInterval(getHomeworkData, 1000 * 60 * 60);
		getHomeworkData();
		return () => {
			clearInterval(interval);
		};
	}, []);

	return (
		<div className="flex h-screen w-screen items-center justify-center">
			<div className="grid h-[90%] w-full border-collapse grid-cols-2 grid-rows-1">
				<div className="flex grow flex-col items-center overflow-y-auto border-r-2 border-solid border-white p-10">
					<header className="mb-7 text-7xl font-bold text-white">KHANG</header>
					<div className="flex w-full flex-col items-center gap-y-5 first:mt-3! last:mb-3!">
						{KTask}
					</div>
				</div>
				<div className="flex grow flex-col items-center overflow-y-auto border-l-2 border-solid border-white p-10">
					<header className="mb-7 text-7xl font-bold text-white">NGÂN</header>
					<div className="flex w-full flex-col items-center gap-y-5 first:mt-3! last:mb-3!">
						{NTask}
					</div>
				</div>
			</div>
		</div>
	);
}
