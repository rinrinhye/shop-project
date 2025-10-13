import {useEffect, useState} from "react";
import {Link} from "react-router";
import type {RegisterInput} from "../types/common";
import {ROUTES} from "../routes/routes";
import {useEmailAvailable, useRegister} from "../queries/useAuth";

const Register = () => {
	const [value, setValue] = useState<RegisterInput>({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		role: "customer",
		avatar: "https://cdn-icons-png.flaticon.com/512/1077/1077114.png",
	});
	const {name, email, password, confirmPassword, avatar} = value;
	const [passwordDirty, setPasswordDirty] = useState(false);
	const [errorMessages, setErrorMessages] = useState({name: "", email: "", password: "", confirmPassword: ""});

	const {mutate, isError, error} = useRegister();
	const {
		mutate: checkEmailAvailable,
		isError: isEmailAvailableError,
		error: emailAvailableError,
	} = useEmailAvailable();

	useEffect(() => {
		/* 
		
		상황	showMismatch 여부
    password, confirm 둘 다 안 건드림	    ❌ 숨김
    confirm만 건드림 (password 비어있음)	 ❌ 숨김
    password 입력 후 confirm 건드림	      ✅ 비교 시작
    password 수정하면	confirm 초기화,      ❌ 숨김

		setErrorMessages((prev) => ({...prev, confirmPassword: "비밀번호가 변경되어 확인이 초기화되었어요."}));
	setErrorMessages((prev) => ({...prev, confirmPassword: "비밀번호가 일치하지 않습니다."}));
			setErrorMessages((prev) => ({...prev, confirmPassword: ""}));

		*/
	}, [password, confirmPassword, passwordDirty]);

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const name = e.target.name;
		const value = e.target.value;

		setValue((prev) => {
			return {...prev, [name]: value};
		});
	};

	const register = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const payload = {name, email, password, avatar};
		mutate(payload);
	};

	const handleCheckEmail = (email: RegisterInput["email"]) => {
		checkEmailAvailable(email);
	};

	return (
		<div className='main mt-20 text-center'>
			<h2 className='mb-12 text-3xl font-[Outfit] font-bold'>JOIN</h2>
			<form action='' onSubmit={register} method='POST' noValidate>
				<div className='flex flex-col items-center gap-5 mb-12'>
					<div className='form-join'>
						<label htmlFor='name'>name</label>
						<input
							type='name'
							value={name}
							onChange={handleInput}
							name='name'
							id='name'
							placeholder=' '
							className='peer'></input>
					</div>
					<div className=''>
						<div className='form-join'>
							<label htmlFor='email'>email</label>
							<input
								type='email'
								value={email}
								onChange={handleInput}
								name='email'
								id='email'
								placeholder=' '
								className='peer'></input>
						</div>
						<button
							type='button'
							onClick={() => handleCheckEmail(email)}
							className='block button button-sm text-sm ml-auto mr-0 mt-2'>
							check email
						</button>
					</div>
					<div className='form-join'>
						<label htmlFor='password'>password</label>
						<input
							type='password'
							value={password}
							onChange={handleInput}
							name='password'
							id='password'
							placeholder=' '
							className='peer'></input>
					</div>
					<div className='form-join'>
						<label htmlFor='confirmPassword'>confirm password</label>
						<input
							type='password'
							value={confirmPassword}
							onChange={handleInput}
							name='confirmPassword'
							id='confirmPassword'
							placeholder=' '
							className='peer'></input>
						{errorMessages.confirmPassword !== "" && <p>{errorMessages.confirmPassword}</p>}
					</div>
				</div>
				<button type='submit' className='button button-xl button-black w-84 font-bold'>
					회원가입
				</button>
			</form>
			<Link to={ROUTES.login} className='block mt-8 text-[#666] underline underline-offset-4 decoration-current'>
				로그인
			</Link>
		</div>
	);
};

export default Register;
