import { createContext } from "react";
import React, { Component } from "react";
import Client from "../graphql/Client";
import { GET_CATEGORIES_NAMES, GET_CURRENCIES } from "../graphql/Queries";
const FilterContext = createContext();

class FilterProvider extends Component {
	constructor(props) {
		super(props);
		this.state = {
			categories: null,
			currency: JSON.parse(
				localStorage.getItem("marwan-osama-ecommerce-app-currency")
			),
			currencies: null,
		};
		this.switchCurrency = this.switchCurrency.bind(this);
		this.verifyCategory = this.verifyCategory.bind(this);
	}

	async setDefaults() {
		try {
			const currenciesRes = await Client.query({ query: GET_CURRENCIES });
			const categoriesRes = await Client.query({ query: GET_CATEGORIES_NAMES });
			const currencies = currenciesRes.data.currencies;
			const categories = categoriesRes.data.categories.map((c) => c.name);
			this.setState((state) => ({
				currencies,
				categories,
				currency: state.currency || currencies[0],
			}));
		} catch (err) {
			alert(err);
		}
	}

	verifyCategory(category = "all") {
		const { categories } = this.state;
		if (!categories) {
			return { status: "loading", value: category };
		}

		return {
			status: "loaded",
			value: categories.includes(category) ? category : false,
		};
	}

	componentDidMount() {
		this.setDefaults();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.currency?.label !== this.state.currency?.label) {
			localStorage.setItem(
				"marwan-osama-ecommerce-app-currency",
				JSON.stringify(this.state.currency)
			);
		}
	}

	switchCurrency(newCurrency) {
		this.setState(() => {
			return { currency: newCurrency };
		});
	}

	render() {
		const { currency, currencies, categories } = this.state;
		const { switchCurrency, verifyCategory } = this;
		return (
			<FilterContext.Provider
				value={{
					currency,
					currencies,
					switchCurrency,
					verifyCategory,
					categories,
				}}
			>
				{this.props.children}
			</FilterContext.Provider>
		);
	}
}

export default FilterContext;

export { FilterProvider, FilterContext };
