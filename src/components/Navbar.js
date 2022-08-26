import React, { Component } from "react";
import { FilterContext } from "../context/FilterContext";
import DropDown from "./DropDown";
import CartOverlay from "./CartOverlay";
import { PropTypes } from "prop-types";
import WithRouter from "./HOCs/WithRouter";
import NavBtns from "./NavBtns";

class Navbar extends Component {
	static contextType = FilterContext;

	checkSelected(category) {
		if (this.props.location.pathname !== "/") {
			return "";
		}
		if (this.context.category === category) {
			return "selected";
		}
	}
	switchSelected(category) {
		if (this.props.location.pathname !== "/") {
			this.props.navigate("/");
		}
		this.context.switchCategory(category);
	}

	render() {
		return (
			<nav>
				<div className="container">
					<NavBtns
						categories={this.context.categories}
						checkSelected={this.checkSelected.bind(this)}
						switchSelected={this.switchSelected.bind(this)}
					/>
					<img
						src={process.env.PUBLIC_URL + "/images/svg-logo.svg"}
						alt="logo"
						className="logo"
					/>
					<div className="actions">
						<DropDown
							list={this.context.currencies}
							onSelect={this.context.switchCurrency}
							selected={this.context.currency}
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
