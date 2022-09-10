import { Component } from "react";
import ProductListing from "./ProductListing";
import { Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import { CartProvider } from "../context/CartContext";
import Cart from "./Cart";
import ProductDetails from "./ProductDetails";
import { FilterProvider } from "../context/FilterContext";
import WithRouter from "./HOCs/WithRouter";
import NotFound from "./NotFound";

class App extends Component {
	render() {
		return (
			<FilterProvider>
				<CartProvider>
					<header>
						<WithRouter WrappedComponent={Navbar} />
					</header>
					<main>
						<Routes>
							<Route
								exact
								path="/:category"
								element={<WithRouter WrappedComponent={ProductListing} />}
							/>
							<Route
								exact
								path="/"
								element={<WithRouter WrappedComponent={ProductListing} />}
							/>
							<Route exact path="/cart" element={<Cart />} />
							<Route
								exact
								path="/product/:id"
								element={<WithRouter WrappedComponent={ProductDetails} />}
							/>
							<Route path="*" element={<NotFound />} />
						</Routes>
					</main>
				</CartProvider>
			</FilterProvider>
		);
	}
}

export default App;
