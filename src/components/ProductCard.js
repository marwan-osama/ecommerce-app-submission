import React, { Component } from "react";
import { Link } from "react-router-dom";
import FilterContext from "../context/FilterContext";
import { CartContext } from "../context/CartContext";
import { PropTypes } from "prop-types";

class ProductCard extends Component {
	render() {
		const { product } = this.props;
		return (
			<article className={`product-card ${product.inStock || "no-stock"}`}>
				<div className="top-section">
					<Link to={"/product/" + product.id}>
						<div className="img-wrapper">
							<img
								className="product-img"
								src={product.gallery[0]}
								alt={product.name}
							/>
							{product.inStock || (
								<p className="reset no-stock-text fs-8 clr-neutral-2">
									OUT OF STOCK
								</p>
							)}
						</div>
					</Link>
					<CartContext.Consumer>
						{(cartContext) => (
							<button
								className="bg-primary cart-button btn"
								onClick={() => cartContext.addToCart(product.id)}
							>
								<img src="images/svg-cart-light.svg" alt="cart" />
							</button>
						)}
					</CartContext.Consumer>
				</div>
				<div className="text-wrapper">
					<h3 className="reset product-name fw-thin fs-5">{`${product.brand} ${product.name}`}</h3>
					<FilterContext.Consumer>
						{(filterContext) => (
							<p className="reset product-price fw-medium fs-5">
								{filterContext.currency.symbol}{" "}
								{
									product.prices.find((price) => {
										return (
											price.currency.label === filterContext.currency.label
										);
									}).amount
								}
							</p>
						)}
					</FilterContext.Consumer>
				</div>
			</article>
		);
	}
}

ProductCard.propTypes = {
	product: PropTypes.object,
};

export default ProductCard;
