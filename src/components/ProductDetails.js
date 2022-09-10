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
			const { product } = response.data;
			const selectedPhoto = product.gallery[0];
			const updatedState = {
				product,
				selectedPhoto,
				selectedAttributes: {},
			};
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

	renderSmallImg(imgSrc, product) {
		const { selectedPhoto } = this.state;
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
	}

	renderInstockBtn() {
		const { id } = this.props.params;
		const { selectedAttributes } = this.state;

		return (
			<CartContext.Consumer>
				{(context) => (
					<button
						className="btn big-btn primary-btn fw-sbold"
						onClick={() => context.addToCart(id, selectedAttributes)}
					>
						ADD TO CART
					</button>
				)}
			</CartContext.Consumer>
		);
	}

	renderOutOfStockBtn() {
		return (
			<button className="btn big-btn fw-sbold" disabled>
				OUT OF STOCK
			</button>
		);
	}

	render() {
		const { product, selectedPhoto } = this.state;
		const { currency } = this.context;

		return (
			<div className="container product-details">
				<div className="gallery">
					<div className="small-images">
						{product?.gallery.map((img) => this.renderSmallImg(img, product))}
					</div>
					<div className="main-image-wrapper">
						<img src={selectedPhoto} alt={product?.name} />
					</div>
				</div>
				;
				<div className="product-info">
					<div className="product-title">
						<h2 className="reset product-brand fw-sbold fs-11">
							{product?.brand}
						</h2>
						<h3 className="reset product-name fw-regular fs-11">
							{product?.name}
						</h3>
					</div>

					<div className="product-attributes">
						{product?.attributes.map((attribute) => (
							<Attribute
								changeAttr={this.changeSelectedAttr.bind(this)}
								checkAttr={this.checkSelectedAttr.bind(this)}
								attr={attribute}
								key={attribute.id}
							/>
						))}
					</div>

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

					{product?.inStock
						? this.renderInstockBtn()
						: this.renderOutOfStockBtn()}
					{product?.description && (
						<ShowMore innerHtml={product?.description} maxHeight={200} />
					)}
				</div>
			</div>
		);
	}
}

ProductDetails.propTypes = {
	params: PropTypes.object,
};

export default ProductDetails;
