import { createPortal } from "react-dom";
import Button from "../ui/Button";

type AlertProps = {
	open: boolean;
	title?: React.ReactNode;
	children?: React.ReactNode;
	confirmText?: string;
	cancelText?: string;
	hideCancel?: boolean;
	onCancel: () => void;
	onConfirm: () => void;
};

const Alert = ({
	open,
	title,
	children,
	confirmText = "확인",
	cancelText = "취소",
	hideCancel,
	onCancel,
	onConfirm,
}: AlertProps) => {
	if (!open) return null;

	const modal = (
		<div
			role='dialog'
			aria-modal='true'
			className='bg-black/40 fixed inset-0 flex items-center justify-center'
			onClick={onCancel}>
			<div
				className={`bg-white rounded-2xl p-6 min-w-80 text-center ${title ? "pt-6" : "pt-10"}`}
				onClick={(e) => e.stopPropagation()}>
				{title && <h2 className='mb-6 text-lg font-semibold'>{title}</h2>}
				<div className='mb-8 text-lg'>{children}</div>
				<div className='flex gap-2'>
					{!hideCancel && <Button text={cancelText} size='lg' onClick={onCancel} className='grow' />}
					<Button text={confirmText} size='lg' onClick={onConfirm} className='grow' color='black' />
				</div>
			</div>
		</div>
	);

	return createPortal(modal, document.body);
};

export default Alert;
