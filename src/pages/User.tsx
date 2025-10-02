import {useCurrentUser} from "../queries/useAuth";

const User = () => {
	const {data: {avatar, name} = {}, isLoading} = useCurrentUser();

	if (isLoading) return null;

	return (
		<div>
			<div>
				<img src={avatar} alt='' />
			</div>
			<p>{name}</p>
		</div>
	);
};

export default User;
