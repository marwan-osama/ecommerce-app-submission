import React, { Component, createRef } from "react";
import { PropTypes } from "prop-types";

class DropDown extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showList: false,
		};
		this.handleClickOutside = this.handleClickOutside.bind(this);
		this.dropDownRef = createRef();
	}

	toggleShowList() {
		this.setState((state) => {
			return { showList: !state.showList };
		});
	}

	changeSelected(newSelected) {
		this.setState({ showList: false });
		this.props.onSelect(newSelected);
	}

	handleClickOutside(e) {
		const { current } = this.dropDownRef;
		if (!current.contains(e.target)) {
			this.setState({ showList: false });
		}
	}

	componentDidMount() {
		document.addEventListener("mousedown", this.handleClickOutside);
	}

	componentWillUnmount() {
		document.removeEventListener("mousedown", this.handleClickOutside);
	}

	render() {
		const { showList } = this.state;
		const { selected, list } = this.props;
		return (
			<div ref={this.dropDownRef} className="dropdown">
				<button
					className="dropdown-button reset btn fs-4 fw-medium"
					onClick={() => this.toggleShowList()}
				>
					<span>{selected ? selected.symbol : "--"}</span>
					<span>
						<img
							src={process.env.PUBLIC_URL + "/images/svg-arrow.svg"}
							alt="arrow"
							className={`${showList && "rotate-180"}`}
						/>
					</span>
				</button>
				<ul
					className={`dropdown-list reset bg-neutral-5 ${showList || "hidden"}`}
				>
					{list &&
						list.map((listItem) => {
							return (
								<li
									className={`list-item ${
										selected.label === listItem.label && "bg-neutral-3"
									}`}
									key={listItem.label}
									onClick={() => this.changeSelected(listItem)}
								>
									<button className="btn fs-4 fw-medium">{`${listItem.symbol} ${listItem.label}`}</button>
								</li>
							);
						})}
				</ul>
			</div>
		);
	}
}

DropDown.propTypes = {
	list: PropTypes.array,
	onSelect: PropTypes.func,
};

export default DropDown;
