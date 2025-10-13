import {useCurrentUser} from "../queries/useAuth";

const User = () => {
	const {data: user, isLoading} = useCurrentUser();

	if (isLoading) return null;

	console.log(user);

	return (
		<div className='flex flex-col items-center'>
			<div className='w-20 h-20 overflow-hidden rounded-full'>
				<img src={user.avatar} alt='' />
			</div>
			<div className='mt-2'>
				<button type='button' className='button px-2'>
					change
				</button>
				<button type='button' className='ml-4 button px-2'>
					delete
				</button>
			</div>
			<div className='mt-6 font-[Outfit]'>
				<div>
					<span className='inline-block min-w-22'>user role </span>
					<span>{user.role}</span>
				</div>
				<div>
					<label htmlFor='' className='inline-block min-w-22'>
						name
					</label>
					<input type='text' placeholder=' ' value={user.name} />
				</div>
				<div>
					<span className='inline-block min-w-22'>Email</span>
					<span>{user.email}</span>
				</div>
				<p>
					<span className='inline-block min-w-22'>Join Date</span>
					<span>{user.creationAt}</span>
				</p>
			</div>
		</div>
	);
};

export default User;
