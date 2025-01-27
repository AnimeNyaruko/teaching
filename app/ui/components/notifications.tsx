'use client';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef } from 'react';

//!Need to wrap in 2 containers and top container must have class 'notiContainer', or else error may occur

export default function Notifications(props: {
	message: string;
	type: 'message' | 'fail' | 'success';
}) {
	const { message, type } = props;
	const self = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = self.current!.parentElement;
		const onchange = () => {
			console.log(container!.scrollHeight);
			if (container!.scrollHeight <= 590) {
				container!.style.scrollbarColor = 'transparent transparent';
			} else {
				container!.style.scrollbarColor = '#838383 transparent';
			}
		};

		container!.addEventListener('change', onchange);
		return () => {
			container!.removeEventListener('change', onchange);
		};
	}, []);

	return (
		<div ref={self} className="transition-opacity md:max-w-[300px] md:max-h-[200px] relative">
			<div
				className={clsx(
					`notifications relative m-5 p-5 rounded-2xl text-white transition-[scrollbar-color] overflow-x-hidden overflow-y-auto md:max-w-[300px] md:max-h-[200px] [scrollbar-color:transparent_transparent] hover:[scrollbar-color:#404040_transparent]`,
					{
						'bg-green-500': type === 'success',
						'bg-red-500': type === 'fail',
						'bg-gray-500': type === 'message',
					}
				)}>
				<button
					onClick={() => {
						const container = self.current!.parentElement!;
						if (container.scrollHeight <= container.offsetHeight + 200) {
							container.style.scrollbarColor = 'transparent transparent';
						} else if (container.scrollHeight > container.offsetHeight) {
							container.style.scrollbarColor = '#838383 transparent';
						}

						self.current!.style.opacity = '0';
						setTimeout(() => {
							self.current!.style.display = 'none';
						}, 150);
					}}
					className="text-white hover:text-gray-700 relative clear-end flex items-start right-0"
					type="button">
					<FontAwesomeIcon icon={faX} />
				</button>
				<p className="font-bold">{message}</p>
			</div>
		</div>
	);
}
