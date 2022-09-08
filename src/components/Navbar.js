import React, { Component } from "react";
import { FilterContext } from "../context/FilterContext";
import DropDown from "./DropDown";
import CartOverlay from "./CartOverlay";
import { PropTypes } from "prop-types";
import WithRouter from "./HOCs/WithRouter";

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
		const { navigate } = this.props;
		return (
			<nav>
				<div className="container">
					<ul className="navigation reset">
						{this.context.categories?.map((category) => {
							return (
								<li className="list-item" key={category}>
									<button
										className={`btn fs-3 ${this.checkSelected(category)}`}
										onClick={() => this.switchSelected(category)}
									>
										{category.toUpperCase()}
									</button>
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
