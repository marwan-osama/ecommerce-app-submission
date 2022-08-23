import { ApolloClient, InMemoryCache } from "@apollo/client";

const defaultOptions = {
	watchQuery: {
		fetchPolicy: "no-cache",
		errorPolicy: "ignore",
	},
	query: {
		fetchPolicy: "no-cache",
		errorPolicy: "all",
	},
};

const Client = new ApolloClient({
	uri: "http://localhost:4000",
	cache: new InMemoryCache(),
	defaultOptions,
});

export default Client;
