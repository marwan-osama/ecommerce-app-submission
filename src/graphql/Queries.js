import { gql } from "@apollo/client/core";

const GET_CURRENCIES = gql`
	query {
		currencies {
			label
			symbol
		}
	}
`;

const GET_CATEGORY_PRODUCTS = gql`
	query ($category: String!) {
		category(input: { title: $category }) {
			products {
				id
				name
				inStock
				gallery
				prices {
					currency {
						label
						symbol
					}
					amount
				}
				brand
			}
		}
	}
`;
const GET_CATEGORIES_NAMES = gql`
	query {
		categories {
			name
		}
	}
`;
const GET_PRODUCT_DETAILS = gql`
	query ($id: String!) {
		product(id: $id) {
			name
			inStock
			description
			gallery
			prices {
				currency {
					label
					symbol
				}
				amount
			}
			brand
			attributes {
				id
				name
				type
				items {
					displayValue
					id
					value
				}
			}
		}
	}
`;
const GET_CART_PRODUCT = gql`
	query ($id: String!) {
		product(id: $id) {
			id
			name
			gallery
			prices {
				currency {
					label
					symbol
				}
				amount
			}
			brand
			attributes {
				id
				name
				type
				items {
					displayValue
					id
					value
				}
			}
		}
	}
`;

export {
	GET_CATEGORY_PRODUCTS,
	GET_CATEGORIES_NAMES,
	GET_CURRENCIES,
	GET_PRODUCT_DETAILS,
	GET_CART_PRODUCT,
};
