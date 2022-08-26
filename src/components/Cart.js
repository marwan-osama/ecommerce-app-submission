import React, { Component } from "react";
import { CartContext } from "../context/CartContext";
import FilterContext from "../context/FilterContext";
import CartItem from "./CartItem";

class Cart extends Component {
	constructor() {
		super();
		this.state = {
			selectedPhotos: {},
			small: document.documentElement.clientWidth < 660,
		};
	}
	static contextType = CartContext;

	changeSelectedPhoto(uuid, index) {
		const selectedPhotos = { ...this.state.selectedPhotos };
		selectedPhotos[uuid] = index;
		this.setState({ selectedPhotos });
	}

	componentDidMount() {
		window.addEventListener("resize", this.handleResize.bind(this));
		const selectedPhotos = {};
		this.context.cart.forEach((cartProduct) => {
			selectedPhotos[cartProduct.uuid] = 0;
		});
		this.setState({ selectedPhotos });
	}
	handleResize() {
		const vw = document.documentElement.clientWidth;
		if (vw < 660) {
			this.setState({ small: true });
			return;
		}
		this.setState({ small: false });
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.handleResize.bind(this));
	}

	render() {
		return (
			<div className="cart container">
				<h2 className="cart-title fs-12">CART</h2>
				<div className="cart-items">
					{this.context.cart.map((product) => {
						return (
							<CartItem
								cartProduct={product}
								key={product.cartId}
								selectedPhoto={this.state.selectedPhotos[product.uuid]}
								changeSelectedPhoto={this.changeSelectedPhoto.bind(this)}
								small={this.state.small}
							/>
						);
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
												{context.currency?.symbol}
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
												{context.currency?.symbol}
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
