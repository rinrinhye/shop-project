import {useState} from "react";
import {Link} from "react-router";
import type {RegisterInput} from "../types/common";
import {ROUTES} from "../routes/routes";
import {useRegister} from "../queries/useAuth";

const Register = () => {
	const [value, setValue] = useState<RegisterInput>({
		name: "",
		email: "",
		password: "",
		role: "customer",
		avatar: "https://cdn-icons-png.flaticon.com/512/1077/1077114.png",
	});

	const {name, email, password} = value;

	const {mutate, isError, error} = useRegister();

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const name = e.target.name;
		const value = e.target.value;

		setValue((prev) => {
			return {...prev, [name]: value};
		});
	};

	const register = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		mutate(value);
	};

	return (
		<div>
			<form action='' onSubmit={register} method='POST'>
				<p>회원가입</p>
				<div className='flex flex-col gap-4'>
					<div className='border-1'>
						<label htmlFor='name'>name</label>
						<input type='name' value={name} onChange={handleInput} name='name' id='name'></input>
					</div>
					<div className='border-1'>
						<label htmlFor='email'>email</label>
						<input type='email' value={email} onChange={handleInput} name='email' id='email'></input>
					</div>
					<div className='border-1'>
						<label htmlFor='password'>password</label>
						<input
							type='password'
							value={password}
							onChange={handleInput}
							name='password'
							id='password'></input>
					</div>
				</div>
				<button type='submit'>회원가입</button>
			</form>
			<Link to={ROUTES.login}>로그인</Link>
		</div>
	);
};

export default Register;
