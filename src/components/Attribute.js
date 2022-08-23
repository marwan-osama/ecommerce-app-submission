import React, { Component } from "react";
import PropTypes from "prop-types";

class Attribute extends Component {
	render() {
		const { attr, changeAttr, checkAttr, small } = this.props;

		const classNames = {
			textButton: `btn attr-text ${small ? "small fs-2" : "fs-4"}`,
			swatchButton: `btn attr-swatch ${small ? "small" : ""}`,
			attrTitle: `reset attr-title ${small ? "small fw-regular fs-3" : ""}`,
		};

		return (
			<div className="product-attr">
				<h4 className={classNames.attrTitle}>{attr.name}:</h4>
				<div className={`attr-items ${small ? "small" : ""}`}>
					{attr.items.map((item) => {
						if (attr.type === "swatch") {
							return (
								<button
									className={
										classNames.swatchButton + ` ${checkAttr(attr.id, item.id)}`
									}
									onClick={() => changeAttr(attr.id, item.id)}
									style={{ backgroundColor: item.value }}
									key={item.id}
								></button>
							);
						} else {
							return (
								<button
									className={
										classNames.textButton + ` ${checkAttr(attr.id, item.id)}`
									}
									onClick={() => changeAttr(attr.id, item.id)}
									key={item.id}
								>
									{item.value}
								</button>
							);
						}
					})}
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
