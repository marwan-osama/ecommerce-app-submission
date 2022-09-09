import { createContext } from "react";
import React, { Component } from "react";
import { GET_CART_PRODUCT } from "../graphql/Queries";
import Client from "../graphql/Client";
import generateUUID from "../utils";

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

	generateCartId(productId, selectedAttributes = {}) {
		return `${productId},${Object.keys(selectedAttributes).join(
			"-"
		)},${Object.values(selectedAttributes).join("-")}`;
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

	removeFromCart(cartId) {
		const newCart = this.state.cart.filter((p) => p.cartId !== cartId);
		this.setState({ cart: newCart });
	}

	editCart(newCartProduct) {
		const cartCopy = [...this.state.cart];
		const { cartId, id, selectedAttributes, quantity } = newCartProduct;
		const newCartId = this.generateCartId(id, selectedAttributes);
		const indexInCart = cartCopy.findIndex((p) => p.cartId === newCartId);
		const oldIndexInCart = cartCopy.findIndex((p) => p.cartId === cartId);
		if (!quantity) {
			this.removeFromCart(cartId);
			return;
		} else if (indexInCart !== -1 && cartId !== newCartId) {
			const product = {
				...cartCopy[indexInCart],
			};
			product.quantity += quantity;
			cartCopy[indexInCart] = product;
			this.setState({ cart: cartCopy }, () => this.removeFromCart(cartId));
			return;
		}
		const product = {
			...cartCopy[oldIndexInCart],
			quantity,
			selectedAttributes,
			cartId: newCartId,
		};
		cartCopy[oldIndexInCart] = product;
		this.setState({ cart: cartCopy });
	}

	async addToCart(id, selectedAttributes = {}) {
		const productIndex = this.state.cart.findIndex((p) => p.id === id);
		if (productIndex === -1) {
			getCartProduct(id).then((product) => {
				const defaultAttrs = this.defaultSelectedAttributes(product.attributes);
				product.selectedAttributes = { ...defaultAttrs, ...selectedAttributes };
				product.uuid = generateUUID();
				product.quantity = 1;
				product.cartId = this.generateCartId(id, product.selectedAttributes);
				this.setState((state) => ({ cart: [...state.cart, product] }));
			});
		} else {
			const productCopy = { ...this.state.cart[productIndex] };
			const defaultAttrs = this.defaultSelectedAttributes(
				productCopy.attributes
			);
			productCopy.quantity = 1;
			productCopy.uuid = generateUUID();
			productCopy.selectedAttributes = {
				...defaultAttrs,
				...selectedAttributes,
			};
			productCopy.cartId = this.generateCartId(
				productCopy.id,
				productCopy.selectedAttributes
			);
			const indexInCart = this.state.cart.findIndex(
				(p) => p.cartId === productCopy.cartId
			);
			if (indexInCart !== -1) {
				const cartCopy = [...this.state.cart];
				const product = { ...this.state.cart[indexInCart] };
				product.quantity += 1;
				cartCopy[indexInCart] = product;
				this.setState({ cart: cartCopy });
				return;
			}
			this.setState((state) => ({
				cart: [...state.cart, productCopy],
			}));
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const { cart } = this.state;
		if (JSON.stringify(prevState.cart) !== JSON.stringify(cart)) {
			localStorage.setItem(
				"marwan-osama-ecommerce-app-cart",
				JSON.stringify(cart)
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
