import { Link } from "react-router";
import type { ApiError, RegisterInput } from "../types/common";
import { ROUTES } from "../routes/routes";
import { useAllUserEmail, useLogin, useRegister } from "../queries/useAuth";
import { useForm } from "react-hook-form";

const Register = () => {
	const { mutateAsync } = useRegister();

	const { data: allUserEmailSet } = useAllUserEmail();

	const { mutateAsync: login } = useLogin();

	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors },
		setError,
	} = useForm({
		mode: "onSubmit",
		reValidateMode: "onChange",
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
			role: "customer",
			avatar: "https://cdn-icons-png.flaticon.com/512/1077/1077114.png",
		},
	});

	const onSubmit = async (data: RegisterInput) => {
		const { name, email, password, avatar } = data;
		const payload = { name, email, password, avatar };

		try {
			// mutateAsync 로 회원가입 시도 해줌!!!!
			const data = await mutateAsync(payload);

			if (allUserEmailSet!.has(data.email)) {
				// react form hook 의 setError 사용 -> ui 표시
				setError("email", { type: "server", message: "중복된 이메일 입니다." });
			} else {
				// 중복된 이메일이 아니라면 로그인 시도!!!
				login({ email, password });
			}
		} catch (error) {
			const err = error as ApiError;

			console.log(err);
		}
	};

	return (
		<div className='main mt-20 text-center'>
			<h2 className='mb-12 text-3xl font-[Outfit] font-bold'>JOIN</h2>
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<div className='flex flex-col items-center gap-5 mb-12'>
					<div className='form-join'>
						<label htmlFor='name'>name</label>
						<input
							id='name'
							placeholder=' '
							className='peer'
							{...register("name", { required: "이름을 입력해 주세요." })}></input>
						{errors.name && <p>{errors.name.message}</p>}
					</div>
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
									value: /^[^\s@]+@[^\s@]+(\.[^\s@]{2,})+$/,
									message: "올바른 이메일 형식이 아닙니다.",
								},
							})}></input>
						{errors.email && <p>{errors.email.message}</p>}
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
							{...register("confirmPassword", {
								required: "비밀번호 확인란을 입력해 주세요.",
								validate: (v) => v === getValues("password") || "비밀번호가 일치하지 않습니다",
							})}></input>
						{errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
					</div>
				</div>
				<button type='submit' className='button button-xl button-black w-84 font-bold disabled:opacity-40'>
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
