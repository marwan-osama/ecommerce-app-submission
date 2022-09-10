import { PropTypes } from "prop-types";
import React, { Component, createRef } from "react";

class ShowMore extends Component {
	constructor(props) {
		super(props);
		this.state = {
			validForShowMore: false,
			showMore: false,
		};
		this.showMoreContentRef = createRef();
	}

	componentDidMount() {
		this.setState({
			validForShowMore:
				this.showMoreContentRef.current.clientHeight > this.props.maxHeight,
		});
	}

	renderShowMoreCover() {
		return (
			<>
				<div className="hide-content"></div>
				<button
					className="btn fw-bold fs-4"
					onClick={() => this.setState({ showMore: true })}
				>
					<div>Show more</div>
					<img
						src={process.env.PUBLIC_URL + "/images/svg-arrow-green.svg"}
						alt="arrow"
					/>
				</button>
			</>
		);
	}

	render() {
		const { innerHtml, maxHeight } = this.props;
		const { validForShowMore, showMore } = this.state;
		const wrapperStyle =
			!showMore && validForShowMore ? { maxHeight: maxHeight } : {};
		return (
			<div className="showmore-wrapper">
				<div className="showmore-content-wrapper" style={wrapperStyle}>
					<div
						dangerouslySetInnerHTML={{ __html: innerHtml }}
						className="showmore-content"
						ref={this.showMoreContentRef}
					></div>
				</div>
				{!showMore && validForShowMore && this.renderShowMoreCover()}
			</div>
		);
	}
}

ShowMore.propTypes = {
	maxHeight: PropTypes.number,
	innerHtml: PropTypes.string,
};

export default ShowMore;
