import { PropTypes } from "prop-types";
import React, { Component } from "react";

class QuantityControl extends Component {
	render() {
		const { quantity, increase, decrease, small } = this.props;
		const classNames = {
			controlBtn: `btn ${small ? "small fs-10" : "fs-18 fw-thin"}`,
			quantity: `quantity ${!small ? "fs-6 fw-medium" : ""}`,
		};
		return (
			<div className="quantity-control">
				<button className={classNames.controlBtn} onClick={increase}>
					+
				</button>
				<div className={classNames.quantity}>{quantity}</div>
				<button className={classNames.controlBtn} onClick={decrease}>
					-
				</button>
			</div>
		);
	}
}

QuantityControl.propTypes = {
	quantity: PropTypes.number,
	increase: PropTypes.func,
	decrease: PropTypes.func,
	small: PropTypes.bool,
};

export default QuantityControl;
