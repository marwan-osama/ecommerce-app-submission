import React, { Component } from "react";
import { FilterContext } from "../context/FilterContext";
import DropDown from "./DropDown";
import CartOverlay from "./CartOverlay";
import { PropTypes } from "prop-types";
import WithRouter from "./HOCs/WithRouter";
import { Link } from "react-router-dom";

class Navbar extends Component {
	static contextType = FilterContext;

	checkCategory(category) {
		const { pathname } = this.props.location;
		const { verifyCategory } = this.context;
		if (
			(pathname === "/" && category === "all") ||
			verifyCategory(pathname.replace("/", "")) === category
		) {
			return "selected";
		}
		return "";
	}

	render() {
		const { navigate } = this.props;
		const { currencies, switchCurrency, currency, categories } = this.context;
		return (
			<nav>
				<div className="container">
					<ul className="navigation reset">
						{categories?.map((category) => {
							return (
								<li className="list-item" key={category}>
									<Link
										className={`link fs-3 ${this.checkCategory(category)}`}
										to={category !== "all" ? `/${category}` : ""}
									>
										{category.toUpperCase()}
									</Link>
								</li>
							);
						})}
					</ul>
					<button onClick={() => navigate(-1)} className="btn logo">
						<img
							src={process.env.PUBLIC_URL + "/images/svg-logo.svg"}
							alt="logo"
						/>
					</button>
					<div className="actions">
						<DropDown
							list={currencies}
							onSelect={switchCurrency}
							selected={currency}
						/>
						<WithRouter WrappedComponent={CartOverlay} />
					</div>
				</div>
			</nav>
		);
	}
}

Navbar.propTypes = {
	location: PropTypes.object,
	navigate: PropTypes.func,
};

export default Navbar;
