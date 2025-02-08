/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { base64ToTextFile as b64tTF } from "@/utils/tools";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faX } from "@fortawesome/free-solid-svg-icons/faX";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useRef, useEffect, useState } from "react";

function Task(props: {
	id: number;
	hwname: string;
	pname: string;
	type: string;
	file?: string;
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
		id,
		hwname,
		pname,
		type,
		file = "",
		deadline,
		taskStatus,
		taskStatusMessage,
		description,
	} = props;

	const droparea = useRef<HTMLDivElement>(null);
	const dropview = useRef<HTMLParagraphElement>(null);
	const inputfile = useRef<HTMLInputElement>(null);
	const confirm = useRef<HTMLParagraphElement>(null);
	const fileValue = useRef<any>(null);

	const [currentStatusView, setStatusView] = useState<any>();
	const [isReady, setReady] = useState(false);
	const [isChecking, setCheckState] = useState(false);
	const [isUpload, setUpload] = useState(false);
	const [isRendered, setRender] = useState(false);

	const dropArea = droparea.current;
	const dropView = dropview.current;
	const inputFile = inputfile.current;
	const confirmButton = confirm.current;

	//Check file extension
	const CheckFileExtension = () => {
		fileValue.current = inputFile?.files?.[0];
		const value = fileValue.current.name.endsWith(".cpp");
		if (!value) {
			setStatusView(statusView("error"));
		}
		return value;
	};

	//Function to change the drop view to active
	const active = () => {
		dropView?.classList.remove("hidden");
		dropView?.classList.add("flex");
	};
	//Function to change the drop view to inactive
	const inactive = () => {
		dropView?.classList.remove("flex");
		dropView?.classList.add("hidden");
	};
	//Function to prevent default event
	const prevent = (e: any) => {
		e.preventDefault();
	};

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

	const checkFile = async () => {
		if (!dropArea || !dropView || !inputFile) return;
		if (taskStatus === "success" || file) return;

		fileValue.current = inputFile.files?.[0];

		if (!file) {
			//Set status to loading
			setStatusView(statusView("loading"));
			setUpload(true);
			//Disable the input file
			inputFile.disabled = true;
			//remove event listener to the input file
			["dragenter", "dragover", "dragleave", "drop"].forEach(
				(eventName: string) => {
					dropArea?.removeEventListener(eventName, prevent);
					dropView?.removeEventListener(eventName, prevent);
				},
			);
			["dragover", "dragenter"].forEach((eventName: string) => {
				dropArea?.removeEventListener(eventName, active);
				dropView?.removeEventListener(eventName, active);
			});
			["dragleave", "drop"].forEach((eventName: string) => {
				dropView?.removeEventListener(eventName, inactive);
			});

			//Handle file drop event
			const uploadDataJSON = {
				HomeworkName: hwname.toLowerCase(),
				PersonName: pname.toLowerCase(),
				type: type.toLowerCase(),
				file: fileValue.current,
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
					setReady(true);
				} else setStatusView(statusView("error"));
			});
		} else {
			setCheckState(false);
		}
	};

	useEffect(() => {
		if (!isRendered) {
			setRender(true);
			return;
		}
		if (taskStatus === "success" || file) return;

		confirmButton!.addEventListener("click", (e: any) => {
			e.preventDefault();
			setCheckState(false);
			checkFile();
		});

		//Add event listener to the input file
		["dragenter", "dragover", "dragleave", "drop"].forEach(
			(eventName: string) => {
				dropArea?.addEventListener(eventName, prevent);
				dropView?.addEventListener(eventName, prevent);
			},
		);

		//Add event listener to the drop area
		["dragover", "dragenter"].forEach((eventName: string) => {
			dropArea?.addEventListener(eventName, active);
			dropView?.addEventListener(eventName, active);
		});

		//Add event listener to the drop area
		["dragleave"].forEach((eventName: string) => {
			dropView?.addEventListener(eventName, inactive);
		});

		dropView?.addEventListener("drop", (e) => {
			e.preventDefault();
			inactive();
			const dataTransfer = e.dataTransfer?.files;
			if (dataTransfer) {
				inputFile!.files = dataTransfer;
				if (!CheckFileExtension()) return;
				else setStatusView(<></>);
				setCheckState(true);
			}
		});
		inputFile?.addEventListener("change", (e) => {
			e.preventDefault();
			if (!CheckFileExtension()) return;
			else setStatusView(<></>);
			setCheckState(true);
		});
	}, [isRendered]);

	return (
		<div
			ref={droparea}
			className={clsx(
				"relative flex min-h-[10rem] w-full flex-col items-start rounded-2xl border-5 border-solid p-5 text-pretty [&_p]:text-white",
				{
					"border-green-700!": taskStatus === "success",
					"border-red-700!": taskStatus === "failed",
					"border-yellow-700!": taskStatus === "pending",
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
			<div
				className={clsx("flex w-full justify-end gap-x-4 font-bold", {
					"hidden!": !isChecking || isReady,
				})}
			>
				<p
					ref={confirm}
					className="cursor-pointer rounded-lg bg-green-600 px-4 py-3 text-white"
				>
					Xác nhận
				</p>
				<p
					onClick={() => {
						setCheckState(false);
					}}
					className="cursor-pointer rounded-lg bg-red-600 px-4 py-3 text-white"
				>
					Đổi ý
				</p>
			</div>
			<div className="w-full">
				<input
					id={`inputfile${id}`}
					ref={inputfile}
					type="file"
					accept=".cpp"
					hidden
				/>
			</div>
			<div className="flex w-full items-center justify-end gap-x-3">
				<div>{currentStatusView}</div>
				<label
					htmlFor={`inputfile${id}`}
					className={clsx("flex", {
						"hidden!":
							isUpload ||
							isChecking ||
							isReady ||
							taskStatus === "success" ||
							file,
					})}
				>
					<p className="text-md cursor-pointer rounded-xl bg-green-600 p-2 font-bold">
						NỘP BÀI
					</p>
				</label>
			</div>
			<div
				className={clsx("flex w-full justify-end", {
					"hidden!": !file,
				})}
			>
				<p
					onClick={() => {
						b64tTF(file, "main.cpp");
					}}
					className="cursor-pointer rounded-lg bg-cyan-500! px-3 py-2 font-bold"
				>
					main.cpp
				</p>
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
							id={e.id}
							hwname={e.hwname}
							pname="khang"
							type={e.type}
							file={e.file}
							deadline={e.deadlines}
							taskStatus={e.status}
							taskStatusMessage={e.statusmessage}
							description={e.description}
							key={e.id}
						/>
					));
					const successTasks = data.data.success.map((e: any) => (
						<Task
							id={e.id}
							hwname={e.hwname}
							pname="khang"
							type={e.type}
							file={e.file}
							deadline={e.deadlines}
							taskStatus={e.status}
							taskStatusMessage={e.statusmessage}
							description={e.description}
							key={e.id}
						/>
					));
					const failedTasks = data.data.failed.map((e: any) => (
						<Task
							id={e.id}
							hwname={e.hwname}
							pname="khang"
							type={e.type}
							file={e.file}
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
							id={e.id}
							hwname={e.hwname}
							pname="ngân"
							type={e.type}
							file={e.file}
							deadline={e.deadlines}
							taskStatus={e.status}
							taskStatusMessage={e.statusmessage}
							description={e.description}
							key={e.id}
						/>
					));
					const successTasks = data.data.success.map((e: any) => (
						<Task
							id={e.id}
							hwname={e.hwname}
							pname="ngân"
							type={e.type}
							file={e.file}
							deadline={e.deadlines}
							taskStatus={e.status}
							taskStatusMessage={e.statusmessage}
							description={e.description}
							key={e.id}
						/>
					));
					const failedTasks = data.data.failed.map((e: any) => (
						<Task
							id={e.id}
							hwname={e.hwname}
							pname="ngân"
							type={e.type}
							file={e.file}
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
			<div className="grid h-[90%] w-full grid-cols-2 grid-rows-1">
				<div className="custom-scrollbar-left flex grow flex-col items-center overflow-y-auto border-l-2 border-solid border-white p-10">
					<header className="mb-7 text-7xl font-bold text-white">KHANG</header>
					<div className="flex w-full flex-col items-center gap-y-5 first:mt-3! last:mb-3!">
						{KTask}
					</div>
				</div>
				<div className="custom-scrollbar-right flex grow flex-col items-center overflow-y-auto border-l-2 border-solid border-white p-10">
					<header className="mb-7 text-7xl font-bold text-white">NGÂN</header>
					<div className="flex w-full flex-col items-center gap-y-5 first:mt-3! last:mb-3!">
						{NTask}
					</div>
				</div>
			</div>
		</div>
	);
}
