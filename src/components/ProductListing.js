import React, { Component } from "react";
import { GET_CATEGORY_PRODUCTS } from "../graphql/Queries";
import Client from "../graphql/Client";
import ProductCard from "./ProductCard";
import { PropTypes } from "prop-types";
import FilterContext from "../context/FilterContext";

const getCategoryProducts = async (category) => {
	try {
		const response = await Client.query({
			query: GET_CATEGORY_PRODUCTS,
			variables: { category },
		});
		return response;
	} catch (err) {
		alert(err);
	}
};

class ProductListing extends Component {
	constructor(props) {
		super(props);
		this.state = {
			products: null,
		};
	}

	static contextType = FilterContext;

	componentDidMount() {
		let { category = "all" } = this.props.params;
		const { verifyCategory } = this.context;
		category = verifyCategory(category);
		getCategoryProducts(category).then((response) => {
			const { products } = response.data.category;
			this.setState({ products });
		});
	}

	componentDidUpdate(prevProps, prevState) {
		let { category = "all" } = this.props.params;
		const { verifyCategory } = this.context;

		category = verifyCategory(category);

		if (verifyCategory(prevProps.params.category) !== category) {
			getCategoryProducts(category).then((response) => {
				const { products } = response.data.category;
				this.setState({ products });
			});
		}
	}

	render() {
		const { products } = this.state;
		let { category } = this.props.params;
		category = this.context.verifyCategory(category);
		return (
			<div className="products">
				<div className="container">
					<h2 className="category-title fs-12">{category}</h2>
					<div className="products-wrapper">
						{products?.map((product) => {
							return <ProductCard product={product} key={product.id} />;
						})}
					</div>
				</div>
			</div>
		);
	}
}

ProductListing.propTypes = {
	params: PropTypes.object,
};

export default ProductListing;
