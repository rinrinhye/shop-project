import { createContext, useContext, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Button from "../components/ui/Button";

type ModalContextType = {
	confirm: (text: string) => Promise<boolean>;
};

const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
	const [isOpen, setOpen] = useState(false);
	const [text, setText] = useState("");
	const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);
	const rootRef = useRef<HTMLElement | null>(null);

	const createRoot = () => {
		if (rootRef.current && document.body.contains(rootRef.current)) return;

		const existing = document.getElementById("modal-root") as HTMLDivElement | null;
		if (existing) {
			rootRef.current = existing;
			return;
		}
		const root = document.createElement("div");
		root.id = "modal-root";
		document.body.appendChild(root);
		root.classList.add("relative", "z-10");
		rootRef.current = root;
	};

	const removeRoot = () => {
		const el = rootRef.current;
		if (el && document.body.contains(el)) {
			el.remove();
		}
		rootRef.current = null;
	};

	const cleanup = () => {
		setOpen(false);
		setText("");
		setResolver(null);
		removeRoot();
	};

	const confirm = (text: string) => {
		createRoot();
		setOpen(true);
		setText(text);
		return new Promise<boolean>((resolve) => setResolver(() => resolve));
	};

	const handleConfirm = () => {
		resolver?.(true);
		cleanup();
	};

	const handleCancel = () => {
		resolver?.(false);
		cleanup();
	};

	return (
		<ModalContext.Provider value={{ confirm }}>
			{children}
			{isOpen &&
				rootRef.current &&
				createPortal(
					<div className='bg-black/40 fixed inset-0 flex items-center justify-center' onClick={handleCancel}>
						<div className='bg-white rounded-2xl p-6' onClick={(e) => e.stopPropagation()}>
							<p className='mb-4'>{text}</p>
							<div className='flex gap-2'>
								<Button text='취소' size='md' onClick={handleCancel} className='grow' />
								<Button text='확인' size='md' onClick={handleConfirm} className='grow' color='black' />
							</div>
						</div>
					</div>,
					rootRef.current
				)}
		</ModalContext.Provider>
	);
};

export const useModal = () => {
	const ctx = useContext(ModalContext);
	if (!ctx) throw new Error("useModal must be used within <ModalProvider>");
	return ctx;
};
