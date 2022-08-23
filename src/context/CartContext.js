import { createContext } from "react";
import React, { Component } from "react";
import { GET_CART_PRODUCT } from "../graphql/Queries";
import Client from "../graphql/Client";

const CartContext = createContext();

const getCartProduct = async (id) => {
	try {
		const response = await Client.query({
			query: GET_CART_PRODUCT,
			variables: { id },
		});
		const product = response.data.product;
		return product;
	} catch (err) {
		console.log(err);
	}
};

class CartProvider extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cart:
				JSON.parse(localStorage.getItem("marwan-osama-ecommerce-app-cart")) ||
				[],
		};
	}

	generateCartId(productId, selectedAttributes) {
		if (selectedAttributes) {
			return `${productId},${Object.keys(selectedAttributes).join(
				"-"
			)},${Object.values(selectedAttributes).join("-")}`;
		}
		return `${productId},default`;
	}

	defaultSelectedAttributes(attributes) {
		const selectedAttributes = {};
		attributes.forEach((attr) => {
			selectedAttributes[attr.id] = attr.items[0].id;
		});
		return selectedAttributes;
	}

	cartIdToProductId(cartId) {
		return cartId.split(",")[0];
	}

	cartQuantitySum() {
		return this.state.cart.reduce((total, product) => {
			return total + product.quantity;
		}, 0);
	}

	cartPriceSum(currency) {
		const total = this.state.cart.reduce((total, product) => {
			const price = product.prices.find(
				(price) => price.currency.label === currency.label
			).amount;
			return total + price * product.quantity;
		}, 0);
		return Math.round(total * 100) / 100;
	}

	removeFromCart(cartId, cb) {
		const cartCopy = structuredClone(this.state.cart);
		const indexInCart = cartCopy.findIndex(
			(product) => product.cartId === cartId
		);
		cartCopy.splice(indexInCart, 1);
		this.setState({ cart: cartCopy }, () => cb(indexInCart));
	}

	editCart(newCartProduct) {
		const { cartId, id, selectedAttributes } = newCartProduct;
		const newCartId = this.generateCartId(id, selectedAttributes);
		newCartProduct.cartId = newCartId;

		this.removeFromCart(cartId, (oldIndexInCart) => {
			const cartCopy = structuredClone(this.state.cart);
			const indexInCart = cartCopy.findIndex((p) => p.cartId === newCartId);
			if (!newCartProduct.quantity) {
				return;
			} else if (indexInCart !== -1) {
				cartCopy[indexInCart].quantity += newCartProduct.quantity;
			} else {
				cartCopy.splice(oldIndexInCart, 0, newCartProduct);
			}
			this.setState({ cart: cartCopy });
		});
	}

	async addToCart(id, selectedAttributes) {
		const productIndex = this.state.cart.findIndex((p) => p.id === id);
		if (productIndex === -1) {
			getCartProduct(id).then((product) => {
				if (selectedAttributes) {
					product.selectedAttributes = selectedAttributes;
				} else {
					product.selectedAttributes = this.defaultSelectedAttributes(
						product.attributes
					);
				}
				product.quantity = 1;
				product.cartId = this.generateCartId(id, product.selectedAttributes);
				this.setState((state) => ({ cart: [...state.cart, product] }));
			});
		} else {
			const productCopy = { ...this.state.cart[productIndex] };
			productCopy.quantity = 1;
			if (selectedAttributes) {
				const cartId = this.generateCartId(productCopy.id, selectedAttributes);
				const indexInCart = this.state.cart.findIndex(
					(p) => p.cartId === cartId
				);
				if (indexInCart !== -1) {
					const cartCopy = structuredClone(this.state.cart);
					cartCopy[indexInCart].quantity += 1;
					this.setState({ cart: cartCopy });
					return;
				} else {
					productCopy.cartId = cartId;
					productCopy.selectedAttributes = selectedAttributes;
				}
			} else {
				productCopy.selectedAttributes = this.defaultSelectedAttributes(
					productCopy.attributes
				);
				productCopy.cartId = this.generateCartId(
					id,
					productCopy.selectedAttributes
				);
				const indexInCart = this.state.cart.findIndex(
					(p) => p.cartId === productCopy.cartId
				);
				if (indexInCart !== -1) {
					const cartCopy = structuredClone(this.state.cart);
					cartCopy[indexInCart].quantity += 1;
					this.setState({ cart: cartCopy });
					return;
				}
			}
			this.setState((state) => ({
				cart: [...state.cart, productCopy],
			}));
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (JSON.stringify(prevState.cart) !== JSON.stringify(this.state.cart)) {
			localStorage.setItem(
				"marwan-osama-ecommerce-app-cart",
				JSON.stringify(this.state.cart)
			);
		}
	}

	render() {
		return (
			<CartContext.Provider
				value={{
					cart: this.state.cart,
					addToCart: this.addToCart.bind(this),
					removeFromCart: this.removeFromCart.bind(this),
					editCart: this.editCart.bind(this),
					cartQuantitySum: this.cartQuantitySum.bind(this),
					cartPriceSum: this.cartPriceSum.bind(this),
				}}
			>
				{this.props.children}
			</CartContext.Provider>
		);
	}
}

export { CartProvider, CartContext };
