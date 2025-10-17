import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { RegisterInput } from "../types/common";
import { ROUTES } from "../routes/routes";
import { useEmailAvailable, useRegister } from "../queries/useAuth";
import { useForm } from "react-hook-form";

const Register = () => {
	// const [value, setValue] = useState<RegisterInput>({
	// 	name: "",
	// 	email: "",
	// 	password: "",
	// 	confirmPassword: "",
	// 	role: "customer",
	// 	avatar: "https://cdn-icons-png.flaticon.com/512/1077/1077114.png",
	// });
	// const { name, email, password, confirmPassword, avatar } = value;

	const { mutate } = useRegister();
	const { mutate: checkEmailAvailable, data: isEmailAvailable, isError: isEmailError } = useEmailAvailable();

	const {
		register,
		getValues,
		handleSubmit,
		setError,
		watch,
		clearErrors,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
			role: "customer",
			avatar: "https://cdn-icons-png.flaticon.com/512/1077/1077114.png",
		},
	});

	const onSubmit = (data: RegisterInput) => {
		console.log(data);
		// const payload = { name, email, password, avatar };
		// mutate(payload);
	};

	const checkEmail = () => {
		if (errors.email) {
			console.log(errors);
		}

		const email = getValues("email");
		checkEmailAvailable(email);
	};

	useEffect(() => {
		// 400 : 이메일 형식 지켜라
		// 201 : isAvailable false truue

		if (isEmailError) {
			setError("email", { type: "custom", message: "중복된 이메일 입니다." });
		} else clearErrors("email");
	}, [isEmailError]);

	console.log(errors);

	console.log(useForm());

	return (
		<div className='main mt-20 text-center'>
			<h2 className='mb-12 text-3xl font-[Outfit] font-bold'>JOIN</h2>
			<form action='' onSubmit={handleSubmit(onSubmit)} method='POST' noValidate>
				<div className='flex flex-col items-center gap-5 mb-12'>
					<div className='form-join'>
						<label htmlFor='name'>name</label>
						<input
							type='name'
							id='name'
							placeholder=' '
							className='peer'
							{...register("name", { required: "이름을 입력해 주세요." })}></input>
						{errors.name && <p>{errors.name.message}</p>}
					</div>
					<div className=''>
						<div className='form-join'>
							<label htmlFor='email'>email</label>
							<input
								type='email'
								id='email'
								placeholder=' '
								className='peer'
								{...register("email", {
									required: "이메일을 입력해 주세요.",
									pattern: {
										value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
										message: "올바른 이메일 형식이 아닙니다.",
									},
								})}></input>
							{errors.email && <p>{errors.email.message}</p>}
						</div>
						<button
							type='button'
							className='block button button-sm text-sm ml-auto mr-0 mt-2'
							onClick={checkEmail}>
							check email
						</button>
					</div>
					<div className='form-join'>
						<label htmlFor='password'>password</label>
						<input
							type='password'
							id='password'
							placeholder=' '
							className='peer'
							{...register("password", {
								required: "비밀번호를 입력해 주세요.",
								minLength: { value: 6, message: "6자 이상 입력해 주세요." },
							})}></input>
						{errors.password && <p>{errors.password.message}</p>}
					</div>
					<div className='form-join'>
						<label htmlFor='confirmPassword'>confirm password</label>
						<input
							type='password'
							id='confirmPassword'
							placeholder=' '
							className='peer'
							{...register("confirmPassword", { required: "비밀번호 확인란을 입력해 주세요." })}></input>
						{errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
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
