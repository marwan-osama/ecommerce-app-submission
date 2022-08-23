import { useLocation, useNavigate, useParams } from "react-router";

const WithRouter = ({ WrappedComponent, ...restProps }) => {
	const params = useParams();
	const location = useLocation();
	const navigate = useNavigate();

	return (
		<WrappedComponent
			params={params}
			location={location}
			navigate={navigate}
			{...restProps}
		/>
	);
};

export default WithRouter;
