import { ROUTES } from "../routes/routes";

const NotFound = () => {
	return (
		<div className='min-h-[70vh] flex flex-col items-center justify-center text-center px-4'>
			<h1 className='text-6xl font-bold text-gray-800 mb-4'>404</h1>
			<p className='text-lg text-gray-600 mb-6'>페이지를 찾을 수 없어요 😢</p>

			<a
				href={ROUTES.home}
				className='px-6 py-2 rounded-full bg-primary text-white font-medium shadow-md hover:bg-primary/80 transition'>
				홈으로 돌아가기
			</a>
		</div>
	);
};

export default NotFound;
