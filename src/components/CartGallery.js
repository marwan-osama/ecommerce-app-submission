import React, { Component } from "react";
import PropTypes from "prop-types";

class CartGallery extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: 0,
		};
	}

	changeSelected(diff) {
		this.setState((state) => {
			let newSelected = state.selected + diff;
			const maxSelected = this.props.images.length - 1;

			if (newSelected < 0) {
				newSelected = maxSelected;
			} else if (newSelected > maxSelected) {
				newSelected = 0;
			}

			return { selected: newSelected };
		});
	}

	render() {
		const { selected } = this.state;
		return (
			<div className="cart-gallery">
				<img
					className="product-img"
					src={this.props.images[selected]}
					alt={this.props.productName}
				/>
				<div className="cart-gallery-btns">
					<button className="btn right" onClick={() => this.changeSelected(-1)}>
						<img
							src={process.env.PUBLIC_URL + "/images/svg-arrow-light.svg"}
						></img>
					</button>
					<button className="btn left" onClick={() => this.changeSelected(1)}>
						<img
							src={process.env.PUBLIC_URL + "/images/svg-arrow-light.svg"}
						></img>
					</button>
				</div>
			</div>
		);
	}
}

CartGallery.propTypes = {
	images: PropTypes.array,
	productName: PropTypes.string,
};

export default CartGallery;
