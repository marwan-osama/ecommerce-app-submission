import React, { Component } from "react";
import { CartContext } from "../context/CartContext";
import FilterContext from "../context/FilterContext";
import CartItem from "./CartItem";

class Cart extends Component {
	static contextType = CartContext;
	render() {
		return (
			<div className="cart container">
				<h2 className="cart-title fs-12">CART</h2>
				<div className="cart-items">
					{this.context.cart.map((product) => {
						return <CartItem cartProduct={product} key={product.cartId} />;
					})}
				</div>
				<FilterContext.Consumer>
					{(context) => (
						<div className="cart-summary">
							<table className="text fs-6">
								<tbody>
									<tr>
										<td>Tax 21%:</td>
										<td>
											<strong>
												{context.currency.symbol}
												{Math.round(
													this.context.cartPriceSum(context.currency) *
														0.21 *
														100
												) / 100}
											</strong>
										</td>
									</tr>
									<tr>
										<td>Quantity:</td>
										<td>
											<strong>{this.context.cartQuantitySum()}</strong>
										</td>
									</tr>
									<tr>
										<td>Total:</td>
										<td>
											<strong>
												{context.currency.symbol}
												{this.context.cartPriceSum(context.currency)}
											</strong>
										</td>
									</tr>
								</tbody>
							</table>
							<button className="big-btn primary-btn btn">ORDER</button>
						</div>
					)}
				</FilterContext.Consumer>
			</div>
		);
	}
}

export default Cart;
