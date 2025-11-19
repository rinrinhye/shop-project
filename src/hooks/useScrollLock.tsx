import { useEffect } from "react";

let lockCount = 0;
let originalOverflow = "";
let originalPaddingRight = "";

export const useScrollLock = (locked: boolean) => {
	useEffect(() => {
		if (!locked) return;

		lockCount += 1;
		if (lockCount === 1) {
			const body = document.body;

			originalOverflow = body.style.overflow;
			originalPaddingRight = body.style.paddingRight;

			const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

			if (scrollBarWidth > 0 && window.innerWidth >= 768) {
				body.style.paddingRight = `${scrollBarWidth}px`;
			}

			body.style.overflow = "hidden";
		}

		return () => {
			if (!locked) return;

			lockCount -= 1;
			if (lockCount === 0) {
				const body = document.body;
				body.style.overflow = originalOverflow;
				body.style.paddingRight = originalPaddingRight;
			}
		};
	}, [locked]);
};
