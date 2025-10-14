import { useState } from "react";
import { Link } from "react-router";
import type { LoginInput } from "../types/common";
import { ROUTES } from "../routes/routes";
import { useLogin } from "../queries/useAuth";
import { IoCloseCircleSharp } from "react-icons/io5";

const Login = () => {
	const [{ email, password }, setValue] = useState<LoginInput>({
		email: "",
		password: "",
	});

	const { mutate } = useLogin();

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const name = e.target.name;
		const value = e.target.value;

		setValue((prev) => {
			return { ...prev, [name]: value };
		});
	};

	const login = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		mutate({ email, password });
	};

	const deleteValue = (key: keyof LoginInput) => {
		setValue((prev) => ({ ...prev, [key]: "" }));
	};

	return (
		<div className='main mt-20 text-center'>
			<h2 className='mb-12 text-3xl font-[Outfit] font-bold'>LOGIN</h2>
			<form action='' onSubmit={login} method='POST' noValidate>
				<div className='flex flex-col items-center mb-6'>
					<div className='form-login'>
						<input
							type='email'
							value={email}
							onChange={handleInput}
							name='email'
							id='email'
							className='peer'
							placeholder=' '></input>
						<label htmlFor='email'>Email</label>
						<button type='button' onClick={() => deleteValue("email")}>
							<IoCloseCircleSharp size={24} color='#888' />
						</button>
					</div>
					<div className='form-login'>
						<input
							type='password'
							value={password}
							onChange={handleInput}
							name='password'
							id='password'
							className='peer'
							placeholder=' '></input>
						<label htmlFor='password'>password</label>
						<button type='button' onClick={() => deleteValue("password")}>
							<IoCloseCircleSharp size={24} color='#888' />
						</button>
					</div>
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
