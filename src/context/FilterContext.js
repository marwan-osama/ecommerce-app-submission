import { createContext } from "react";
import React, { Component } from "react";
import Client from "../graphql/Client";
import { GET_CATEGORIES_NAMES, GET_CURRENCIES } from "../graphql/Queries";
const FilterContext = createContext();

class FilterProvider extends Component {
	constructor(props) {
		super(props);
		this.state = {
			category: null,
			categories: null,
			currency: JSON.parse(
				localStorage.getItem("marwan-osama-ecommerce-app-currency")
			),
			currencies: null,
		};
		this.switchCurrency = this.switchCurrency.bind(this);
		this.switchCategory = this.switchCategory.bind(this);
	}

	async setDefaults() {
		try {
			const currenciesRes = await Client.query({ query: GET_CURRENCIES });
			const categoriesRes = await Client.query({ query: GET_CATEGORIES_NAMES });
			const currencies = currenciesRes.data.currencies;
			const categories = categoriesRes.data.categories.map(
				(category) => category.name
			);
			this.setState((state) => ({
				currencies,
				categories,
				currency: state.currency || currencies[0],
				category: categories[0],
			}));
		} catch (err) {
			alert(err);
		}
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
	switchCategory(newCategory) {
		this.setState(() => {
			return { category: newCategory };
		});
	}

	render() {
		const { currency, currencies, category, categories } = this.state;
		const { switchCategory, switchCurrency } = this;
		return (
			<FilterContext.Provider
				value={{
					currency,
					currencies,
					switchCurrency,
					category,
					categories,
					switchCategory,
				}}
			>
				{this.props.children}
			</FilterContext.Provider>
		);
	}
}

export default FilterContext;

export { FilterProvider, FilterContext };
