import React, { Component } from "react";
import PropTypes from "prop-types";

class Attribute extends Component {
	constructor(props) {
		super(props);
		this.renderSwatchOption = this.renderSwatchOption.bind(this);
		this.renderTextOption = this.renderTextOption.bind(this);
	}

	renderSwatchOption(item) {
		const { attr, changeAttr, checkAttr, small } = this.props;
		const classNames = {
			swatchButton: `btn attr-swatch ${small ? "small" : ""}`,
		};
		return (
			<button
				className={classNames.swatchButton + ` ${checkAttr(attr.id, item.id)}`}
				onClick={() => changeAttr(attr.id, item.id)}
				style={{ backgroundColor: item.value }}
				key={item.id}
			></button>
		);
	}

	renderTextOption(item) {
		const { attr, changeAttr, checkAttr, small } = this.props;
		const classNames = {
			textButton: `btn attr-text ${small ? "small fs-2" : "fs-4"}`,
		};
		return (
			<button
				className={classNames.textButton + ` ${checkAttr(attr.id, item.id)}`}
				onClick={() => changeAttr(attr.id, item.id)}
				key={item.id}
			>
				{item.value}
			</button>
		);
	}

	render() {
		const { props, renderSwatchOption, renderTextOption } = this;
		const { attr, small } = props;
		const classNames = {
			attrTitle: `reset attr-title ${small ? "small fw-regular fs-3" : ""}`,
		};

		return (
			<div className="product-attr">
				<h4 className={classNames.attrTitle}>{attr.name}:</h4>
				<div className={`attr-items ${small ? "small" : ""}`}>
					{attr.items.map((item) =>
						attr.type === "swatch"
							? renderSwatchOption(item)
							: renderTextOption(item)
					)}
				</div>
			</div>
		);
	}
}

Attribute.propTypes = {
	attr: PropTypes.object,
	changeAttr: PropTypes.func,
	checkAttr: PropTypes.func,
};

export default Attribute;
