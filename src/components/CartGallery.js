import React, { Component } from "react";
import PropTypes from "prop-types";

class CartGallery extends Component {
	constructor(props) {
		super(props);
	}

	changeSelected(diff) {
		let newSelected = this.props.selectedPhoto + diff;
		const maxSelected = this.props.images.length - 1;

		if (newSelected < 0) {
			newSelected = maxSelected;
		} else if (newSelected > maxSelected) {
			newSelected = 0;
		}

		this.props.changeSelectedPhoto(this.props.uuid, newSelected);
	}

	render() {
		const { selectedPhoto, images, uuid } = this.props;
		return (
			<div className="cart-gallery">
				<img className="product-img" src={images[selectedPhoto]} alt={uuid} />
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
	cartId: PropTypes.string,
	changeSelectedPhoto: PropTypes.func,
	selectedPhoto: PropTypes.number,
};

export default CartGallery;
