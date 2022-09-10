import { PropTypes } from "prop-types";
import React, { Component } from "react";
import { CartContext } from "../context/CartContext";
import FilterContext from "../context/FilterContext";
import Attribute from "./Attribute";
import CartGallery from "./CartGallery";
import QuantityControl from "./QuantityControl";

class CartItem extends Component {
	constructor(props) {
		super(props);
		this.changeSelectedAttr = this.changeSelectedAttr.bind(this);
		this.checkSelectedAttr = this.checkSelectedAttr.bind(this);
	}

	static contextType = CartContext;

	changeSelectedAttr(attributeId, itemId) {
		const cartProductCopy = { ...this.props.cartProduct };
		const newSelectedAttrs = { ...cartProductCopy.selectedAttributes };
		newSelectedAttrs[attributeId] = itemId;
		cartProductCopy.selectedAttributes = newSelectedAttrs;
		this.context.editCart(cartProductCopy);
	}

	checkSelectedAttr(attributeId, itemId) {
		const { selectedAttributes } = this.props.cartProduct;
		if (selectedAttributes[attributeId] === itemId) {
			return "selected";
		}
		return "";
	}

	changeQuantity(diff) {
		const cartProductCopy = { ...this.props.cartProduct };
		cartProductCopy.quantity += diff;
		this.context.editCart(cartProductCopy);
	}

	renderCartProductImg(cartProduct) {
		const { small } = this.props;
		const classNames = {
			imgWrapper: `cart-item-img-wrapper ${small ? "small" : ""}`,
		};
		return (
			<div className={classNames.imgWrapper}>
				<img
					className="product-img"
					src={cartProduct.gallery[0]}
					alt={cartProduct.id}
				/>
			</div>
		);
	}

	render() {
		const { selectedPhoto, changeSelectedPhoto, cartProduct, small } =
			this.props;

		const classNames = {
			cartItem: `cart-item ${small ? "small" : ""}`,
			brand: `reset ${small ? "fw-thin fs-4" : "fw-sbold fs-8"}`,
			name: `reset ${small ? "fw-thin fs-4" : "fw-regular fs-8"}`,
			price: `reset ${small ? "fw-medium" : "fw-bold fs-6"}`,
			right: `cart-item-right ${small ? "small" : ""}`,
			left: `cart-item-left ${small ? "small" : ""}`,
		};

		return (
			<div className={classNames.cartItem}>
				<div className={classNames.left}>
					<div className="cart-item-title">
						<h3 className={classNames.brand}>{cartProduct.brand}</h3>
						<h4 className={classNames.name}>{cartProduct.name}</h4>
					</div>
					<FilterContext.Consumer>
						{(context) => (
							<p className={classNames.price}>
								{context.currency?.symbol}
								{
									cartProduct.prices.find(
										(price) => price.currency.label === context.currency.label
									).amount
								}
							</p>
						)}
					</FilterContext.Consumer>
					<div className="cart-item-attributes">
						{cartProduct.attributes.map((attr) => {
							return (
								<Attribute
									attr={attr}
									changeAttr={this.changeSelectedAttr}
									checkAttr={this.checkSelectedAttr}
									small={small}
									key={attr.id}
								/>
							);
						})}
					</div>
				</div>
				<div className={classNames.right}>
					<QuantityControl
						quantity={cartProduct.quantity}
						increase={() => this.changeQuantity(1)}
						decrease={() => this.changeQuantity(-1)}
						small={small}
					/>
					{small || cartProduct.gallery.length === 1 ? (
						this.renderCartProductImg(cartProduct)
					) : (
						<CartGallery
							images={cartProduct.gallery}
							productName={cartProduct.name}
							uuid={cartProduct.uuid}
							selectedPhoto={selectedPhoto}
							changeSelectedPhoto={changeSelectedPhoto}
						/>
					)}
				</div>
			</div>
		);
	}
}

CartItem.propTypes = {
	cartProduct: PropTypes.object,
	changeSelectedPhoto: PropTypes.func,
	selectedPhoto: PropTypes.number,
	small: PropTypes.bool,
};

export default CartItem;
