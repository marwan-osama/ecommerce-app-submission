import React, { Component } from "react";
import { GET_CATEGORY_PRODUCTS } from "../graphql/Queries";
import Client from "../graphql/Client";
import ProductCard from "./ProductCard";
import { PropTypes } from "prop-types";

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

	componentDidMount() {
		if (this.props.filterContext.category) {
			getCategoryProducts(this.props.filterContext.category).then(
				(response) => {
					this.setState({ products: response.data.category.products });
				}
			);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			prevProps.filterContext.category !== this.props.filterContext.category
		) {
			getCategoryProducts(this.props.filterContext.category).then(
				(response) => {
					this.setState({ products: response.data.category.products });
				}
			);
		}
	}

	render() {
		return (
			<div className="products">
				<div className="container">
					<h2 className="category-title fs-12">
						{this.props.filterContext.category}
					</h2>
					<div className="products-wrapper">
						{this.state.products?.map((product) => {
							return <ProductCard product={product} key={product.id} />;
						})}
					</div>
				</div>
			</div>
		);
	}
}

ProductListing.propTypes = {
	filterContext: PropTypes.object,
};

export default ProductListing;
