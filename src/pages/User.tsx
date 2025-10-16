import { useEffect, useRef, useState } from "react";
import { useCurrentUser, useUserUpdate } from "../queries/useAuth";

type Role = "customer" | "admin";

const User = () => {
	const { data: user, isLoading } = useCurrentUser();
	const [isEditing, setEditing] = useState(false);

	const [radioValue, setRadioValue] = useState<Role>(user?.role);
	const isCustomer = radioValue === "customer" ? true : false;
	const formRef = useRef<HTMLFormElement>(null);

	const { mutate } = useUserUpdate();

	useEffect(() => {
		if (isEditing) setRadioValue(user.role);
	}, []);

	if (isLoading) return null;

	const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
		setRadioValue(e.currentTarget.value as Role);
	};

	const handleEdit = () => {
		setEditing((prev) => !prev);
	};

	const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(formRef.current!);
		console.log(formData.get("name"));
		console.log(formData.get("userRole"));
	};

	console.log(user);

	return (
		<div className='main'>
			<div className='flex flex-col items-center'>
				<div className='w-20 h-20 overflow-hidden rounded-full'>
					<button type='button'>
						<img src={user.avatar} alt='' />
					</button>
				</div>
				<div className='mt-2'>
					<button type='button' className='px-2 text-[#666666] underline underline-offset-2 text-sm'>
						delete
					</button>
				</div>
				<form action='' ref={formRef} onSubmit={handleSave}>
					<div className='mt-8 font-[Outfit] border-y border-[#999] py-4'>
						<div className='px-2 py-2'>
							<span className='inline-block min-w-22'>user role</span>
							<div className='inline-flex gap-2'>
								<div className='form-radio'>
									<input
										type='radio'
										name='userRole'
										id='roleCustomer'
										value='customer'
										checked={isCustomer}
										disabled={!isEditing}
										onChange={handleRadio}
									/>
									<label htmlFor='roleCustomer'>customer</label>
								</div>
								<div className='form-radio'>
									<input
										type='radio'
										name='userRole'
										id='roleAdmin'
										value='admin'
										checked={!isCustomer}
										disabled={!isEditing}
										onChange={handleRadio}
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
								name='name'
								placeholder=' '
								defaultValue={user.name}
								readOnly={!isEditing}
								className='border px-1'
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
					<button
						type='button'
						className='button py-1 mt-4 px-10'
						onClick={!isEditing ? handleEdit : handleSave}>
						{isEditing ? "save" : "edit"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default User;
