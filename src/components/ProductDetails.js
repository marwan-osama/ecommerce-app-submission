import React, { Component } from "react";
import Client from "../graphql/Client";
import { GET_PRODUCT_DETAILS } from "../graphql/Queries";
import Attribute from "./Attribute";
import PropTypes from "prop-types";
import FilterContext from "../context/FilterContext";
import { CartContext } from "../context/CartContext";
import ShowMore from "./ShowMore";

const getProductDetails = async (id) => {
	try {
		const response = await Client.query({
			query: GET_PRODUCT_DETAILS,
			variables: { id },
		});
		return response;
	} catch (err) {
		console.log(err);
	}
};

class ProductDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			product: null,
			selectedPhoto: null,
			selectedAttributes: null,
		};
	}

	static contextType = FilterContext;

	changeSelectedPhoto(newPhoto) {
		this.setState({ selectedPhoto: newPhoto });
	}
	changeSelectedAttr(attributeId, itemId) {
		this.setState((state) => {
			const selectedAttributesCopy = { ...state.selectedAttributes };
			selectedAttributesCopy[attributeId] = itemId;
			return { selectedAttributes: selectedAttributesCopy };
		});
	}

	checkSelectedAttr(attributeId, itemId) {
		return this.state.selectedAttributes[attributeId] === itemId
			? "selected"
			: "";
	}

	setProductDetails() {
		getProductDetails(this.props.params.id).then((response) => {
			const product = response.data.product;
			const selectedPhoto = product.gallery[0];
			const updatedState = {
				product,
				selectedPhoto,
				selectedAttributes: {},
			};
			product.attributes.forEach((attribute) => {
				updatedState.selectedAttributes[attribute.id] = attribute.items[0].id;
			});
			this.setState(updatedState);
		});
	}

	componentDidMount() {
		this.setProductDetails();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.params.id !== this.props.params.id) {
			this.setProductDetails();
		}
	}

	render() {
		const { product, selectedPhoto } = this.state;
		const { currency } = this.context;
		const { id } = this.props.params;
		return (
			<>
				<div className="container product-details">
					<div className="gallery">
						<div className="small-images">
							{product?.gallery.map((imgSrc) => {
								return (
									<div
										className={`small-image-wrapper btn ${
											imgSrc === selectedPhoto && "selected"
										}`}
										onClick={() => this.changeSelectedPhoto(imgSrc)}
										key={imgSrc.split("/")[imgSrc.split("/").length - 1]}
									>
										<img src={imgSrc} alt={product?.name} />
									</div>
								);
							})}
						</div>
						<div className="main-image-wrapper">
							<img src={selectedPhoto} alt={product?.name} />
						</div>
					</div>
					<div className="product-info">
						<div className="product-title">
							<h2 className="reset product-brand fw-sbold fs-11">
								{product?.brand}
							</h2>
							<h3 className="reset product-name fw-regular fs-11">
								{product?.name}
							</h3>
						</div>
						{product?.attributes.length ? (
							<div className="product-attributes">
								{product?.attributes.map((attribute) => {
									return (
										<Attribute
											changeAttr={this.changeSelectedAttr.bind(this)}
											checkAttr={this.checkSelectedAttr.bind(this)}
											attr={attribute}
											key={attribute.id}
										/>
									);
								})}
							</div>
						) : (
							""
						)}
						<div className="product-price">
							<h4 className="reset">Price:</h4>
							<p className="reset price fw-bold fs-6">
								{currency?.symbol}
								{
									product?.prices.find(
										(price) => price.currency.label === currency?.label
									)?.amount
								}
							</p>
						</div>
						{product?.inStock ? (
							<CartContext.Consumer>
								{(cartContext) => (
									<button
										className="btn big-btn primary-btn fw-sbold"
										onClick={() =>
											cartContext.addToCart(id, {
												...this.state.selectedAttributes,
											})
										}
									>
										ADD TO CART
									</button>
								)}
							</CartContext.Consumer>
						) : (
							<button className="btn big-btn fw-sbold" disabled>
								OUT OF STOCK
							</button>
						)}
						{product?.description && (
							<ShowMore innerHtml={product?.description} maxHeight={200} />
						)}
					</div>
				</div>
			</>
		);
	}
}

ProductDetails.propTypes = {
	params: PropTypes.object,
};

export default ProductDetails;
