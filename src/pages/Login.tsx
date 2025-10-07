import { useState } from "react";
import { Link } from "react-router";
import type { LoginInput } from "../types/common";
import { ROUTES } from "../routes/routes";
import { useLogin } from "../queries/useAuth";

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

  return (
    <div className='main mt-20 text-center'>
      <h2 className='mb-12 text-3xl font-[Outfit] font-bold'>LOGIN</h2>
      <form action='' onSubmit={login} method='POST'>
        <div className='flex flex-col gap-4 items-center'>
          <div className='relative border rounded-sm border-[#e2e2e2] h-12 w-80'>
            <label
              htmlFor='email'
              className='absolute top-1/2 left-4 -translate-y-1/2 text-[#8e8e8e]'
            >
              Email
            </label>
            <input
              type='email'
              value={email}
              onChange={handleInput}
              name='email'
              id='email'
              className='h-full w-full px-4'
            ></input>
          </div>
          <div className='border-1'>
            <label htmlFor='password'>password</label>
            <input
              type='password'
              value={password}
              onChange={handleInput}
              name='password'
              id='password'
            ></input>
          </div>
        </div>
        <button type='submit' className='button button-md'>
          로그인
        </button>
      </form>
      <Link to={ROUTES.register}>회원가입</Link>
    </div>
  );
};

export default Login;
