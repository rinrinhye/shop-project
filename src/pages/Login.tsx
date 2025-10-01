import {useState} from "react";

const Login = () => {
	const [{email, password}, setValue] = useState<{email: string; password: string}>({
		email: "",
		password: "",
	});

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const name = e.target.name;
		const value = e.target.value;

		setValue((prev) => {
			return {...prev, [name]: value};
		});
	};

	return (
		<div>
			<p>로그인</p>
			<div className='flex flex-col gap-4'>
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
		</div>
	);
};

export default Login;
