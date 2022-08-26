import React, { Component } from "react";
import PropTypes from "prop-types";

class NavBtns extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showNav: false,
		};
	}

	toggleShowNav() {
		this.setState(
			(state) => ({ showNav: !state.showNav }),
			() => console.log(this.state.showNav)
		);
	}

	render() {
		const { categories, checkSelected, switchSelected } = this.props;
		const { showNav } = this.state;
		return (
			<div className="nav-btns">
				<button className="btn burger" onClick={() => this.toggleShowNav()}>
					<img src={process.env.PUBLIC_URL + "/images/svg-burger.svg"} />
				</button>
				<div className={`overlay ${showNav && "show"}`}>
					<ul className={`navigation reset ${showNav || "nav-hidden"}`}>
						<div className="close-nav">
							<button className="btn" onClick={() => this.toggleShowNav()}>
								<img src={process.env.PUBLIC_URL + "/images/svg-close.svg"} />
							</button>
						</div>
						{categories?.map((category) => {
							return (
								<li className="list-item" key={category}>
									<button
										className={`btn fs-3 ${checkSelected(category)}`}
										onClick={() => switchSelected(category)}
									>
										{category.toUpperCase()}
									</button>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		);
	}
}

NavBtns.propTypes = {
	categories: PropTypes.array,
	mobile: PropTypes.bool,
	checkSelected: PropTypes.func,
	switchSelected: PropTypes.func,
};

export default NavBtns;
