import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ROUTES } from "../routes/routes";
import { useLogin } from "../queries/useAuth";
import { IoCloseCircleSharp } from "react-icons/io5";
import { isValidEmail } from "../utils/isValidEmail";
import Button from "../components/ui/Button";

const Login = () => {
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	const [clientError, setClientError] = useState("");
	const [caps, setCaps] = useState(false);
	const [pwFocused, setPwFocused] = useState(false);

	const { mutate, error, isError } = useLogin();

	useEffect(() => {
		if (!isError || !error) return;
		const status = (error as any)?.statusCode;
		if (status === 401) {
			setClientError("이메일 또는 비밀번호가 올바르지 않습니다.");
		}
	}, [isError, error]);

	const login = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const email = (formData.get("email") as string)?.trim();
		const password = formData.get("password") as string;

		const active = document.activeElement as HTMLElement;
		if (active && active.tagName === "INPUT") active.blur();

		if (!email) {
			setClientError("이메일을 입력해 주세요.");
			return;
		}

		if (email && !password) {
			setClientError("비밀번호를 입력해 주세요.");
			return;
		}

		if (!isValidEmail(email)) {
			setClientError("이메일 형식이 올바르지 않습니다.");
			return;
		}

		mutate({ email, password });
	};

	// ✅ 입력값 삭제
	const deleteValue = (name: "email" | "password") => {
		if (name === "email" && emailRef.current) emailRef.current.value = "";
		if (name === "password" && passwordRef.current) passwordRef.current.value = "";
		setClientError("");
	};

	const handlePwKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		setCaps(e.getModifierState("CapsLock"));
	};

	const handleFocus = () => setClientError("");

	const handlePwFocus = () => {
		setPwFocused(true);
		setClientError("");
	};
	const handlePwBlur = () => setPwFocused(false);

	const uiError = pwFocused && caps ? "CapsLock이 켜져 있어요." : clientError;

	return (
		<div className='main mt-20 text-center'>
			<h2 className='mb-12 text-3xl font-outfit font-bold'>LOGIN</h2>
			<form onSubmit={login} noValidate>
				<div className='flex flex-col items-center mb-6'>
					<div className='form-login'>
						<input
							type='email'
							name='email'
							id='email'
							className='peer'
							placeholder=' '
							ref={emailRef}
							onFocus={handleFocus}></input>
						<label htmlFor='email'>Email</label>
						<button type='button' onClick={() => deleteValue("email")}>
							<IoCloseCircleSharp size={24} color='#888' />
						</button>
					</div>
					<div className='form-login'>
						<input
							type='password'
							name='password'
							id='password'
							className='peer'
							placeholder=' '
							onKeyDown={handlePwKeyDown}
							ref={passwordRef}
							onBlur={handlePwBlur}
							onFocus={handlePwFocus}></input>
						<label htmlFor='password'>password</label>
						<button type='button' onClick={() => deleteValue("password")}>
							<IoCloseCircleSharp size={24} color='#888' />
						</button>
					</div>
					{uiError && (
						<p
							id='login-error'
							role='alert'
							aria-live='polite'
							className='w-[334px] mt-1 pl-4 text-left text-xs text-red-600'>
							{uiError}
						</p>
					)}
				</div>
				<Button type='submit' size='xl' color='black' className='w-84' text='로그인' />
			</form>
			<Link
				to={ROUTES.register}
				className='block mt-8 text-[#666] underline underline-offset-4 decoration-current'>
				회원가입
			</Link>
		</div>
	);
};

export default Login;
