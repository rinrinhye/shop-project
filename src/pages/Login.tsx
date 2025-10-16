import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ROUTES } from "../routes/routes";
import { useLogin } from "../queries/useAuth";
import { IoCloseCircleSharp } from "react-icons/io5";
import { isValidEmail } from "../utils/isValidEmail";

const Login = () => {
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	const [errorText, setErrorText] = useState<string>("");
	const [caps, setCaps] = useState(false);
	const errorRef = useRef<string>("");

	const { mutate, error, isError } = useLogin();

	useEffect(() => {
		if (!caps) {
			errorRef.current = errorText;
		}
	}, [errorText]);

	useEffect(() => {
		if (!isError || !error) return;
		const status = (error as any)?.statusCode;
		if (status === 401) {
			setErrorText("이메일 또는 비밀번호가 올바르지 않습니다.");
		}
	}, [isError, error]);

	const login = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const email = (formData.get("email") as string)?.trim();
		const password = (formData.get("password") as string)?.trim();

		const active = document.activeElement as HTMLElement;
		if (active && active.tagName === "INPUT") active.blur();

		if (!email) {
			setErrorText("이메일을 입력해 주세요.");
			return;
		}

		if (email && !password) {
			setErrorText("비밀번호를 입력해 주세요.");
			return;
		}

		if (!isValidEmail(email)) {
			setErrorText("이메일 형식이 올바르지 않습니다.");
			return;
		}

		mutate({ email, password });
	};

	const deleteValue = (name: string) => {
		if (name === "email") {
			emailRef.current!.value = "";
		}

		if (name === "password") {
			passwordRef.current!.value = "";
		}

		setErrorText("");
	};

	const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const isCaps = e.getModifierState("CapsLock");

		if (isCaps && !caps) {
			errorRef.current = errorText;
		}

		setCaps(isCaps);
		setErrorText(isCaps ? "CapsLock이 켜져 있어요." : errorRef.current || "");
	};

	const handleBlur = () => {
		if (caps) {
			setErrorText(errorRef.current || "");
		}
	};

	const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
		const isPassword = e.currentTarget.name === "password";
		const capsErrorText = "CapsLock이 켜져 있어요.";
		if (caps && isPassword) {
			setErrorText(capsErrorText);
		}

		if (!caps) setErrorText("");
	};

	return (
		<div className='main mt-20 text-center'>
			<h2 className='mb-12 text-3xl font-[Outfit] font-bold'>LOGIN</h2>
			<form action='' onSubmit={login} method='POST' noValidate>
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
							onKeyDown={handleKey}
							onKeyUp={handleKey}
							ref={passwordRef}
							onBlur={handleBlur}
							onFocus={handleFocus}></input>
						<label htmlFor='password'>password</label>
						<button type='button' onClick={() => deleteValue("password")}>
							<IoCloseCircleSharp size={24} color='#888' />
						</button>
					</div>
					{errorText && <p className='w-[334px] mt-1 pl-4 text-left text-xs text-red-600'>{errorText}</p>}
				</div>
				<button type='submit' className='button button-xl button-black w-84 font-bold'>
					로그인
				</button>
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
