import React, { useEffect, useRef, useState } from "react";
import { useCurrentUser, useUserUpdate } from "../queries/useAuth";
import { useForm } from "react-hook-form";

type Role = "customer" | "admin";
type FormValues = { name: string; role: Role };

const User = () => {
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const { data: user, isLoading } = useCurrentUser();

	const [isEditing, setEditing] = useState(false);

	const { register, reset, handleSubmit } = useForm<FormValues>();

	const { mutate } = useUserUpdate();

	useEffect(() => {
		if (!user) return;
		// user 초기화
		reset({
			name: user.name,
			role: user.role,
		});
	}, [user]);

	const handleEdit = () => {
		setEditing((prev) => !prev);
	};

	const handleCancel = () => {
		setEditing((prev) => !prev);
		reset({
			name: user.name,
			role: user.role,
		});
	};

	const onSubmit = (data: FormValues) => {
		const payload = { id: user.id, newInfo: data };
		mutate(payload);

		setEditing((prev) => !prev);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log(e.target.files);
	};

	if (isLoading) return null;

	return (
		<div className='main'>
			<div className='flex flex-col items-center'>
				<div className='w-20 h-20 overflow-hidden rounded-full'>
					<button
						type='button'
						className='w-full h-full'
						onClick={() => {
							fileInputRef?.current?.click();
						}}>
						<input
							type='file'
							accept='image/*'
							onChange={handleFileChange}
							ref={fileInputRef}
							className='hidden'
						/>
						<img src={user.avatar} alt='' />
					</button>
				</div>
				<div className='mt-2'>
					<button type='button' className='px-2 text-[#666666] underline underline-offset-2 text-sm'>
						delete
					</button>
				</div>
				<form action='' onSubmit={handleSubmit(onSubmit)}>
					<div className='mt-8 font-[Outfit] border-y border-[#999] py-4'>
						<div className='px-2 py-2'>
							<span className='inline-block min-w-22'>user role</span>
							<div className='inline-flex gap-2'>
								<div className='form-radio'>
									<input
										type='radio'
										id='roleCustomer'
										value='customer'
										disabled={!isEditing}
										{...register("role")}
									/>
									<label htmlFor='roleCustomer'>customer</label>
								</div>
								<div className='form-radio'>
									<input
										type='radio'
										id='roleAdmin'
										value='admin'
										disabled={!isEditing}
										{...register("role")}
									/>
									<label htmlFor='roleAdmin'>admin</label>
								</div>
							</div>
						</div>
						<div className='px-2 py-2'>
							<label htmlFor='' className='inline-block min-w-22'>
								name
							</label>
							<input
								type='text'
								placeholder=' '
								defaultValue={user.name}
								readOnly={!isEditing}
								className='border px-1'
								{...register("name")}
							/>
						</div>
						<div className='px-2 py-2'>
							<span className='inline-block min-w-22'>Email</span>
							<span>{user.email}</span>
						</div>
						<div className='px-2 py-2'>
							<span className='inline-block min-w-22'>Join Date</span>
							<span>{new Date(user.creationAt).toLocaleDateString()}</span>
						</div>
					</div>
					{!isEditing && (
						<button type='button' className='button block py-1 mt-4 mx-auto px-10' onClick={handleEdit}>
							edit
						</button>
					)}
					{isEditing && (
						<div className='flex mt-4 justify-center gap-3'>
							<button type='button' className='button block py-1 px-6.5' onClick={handleCancel}>
								cancel
							</button>
							<button type='submit' className='button button-black block py-1 px-8'>
								save
							</button>
						</div>
					)}
				</form>
			</div>
		</div>
	);
};

export default User;
