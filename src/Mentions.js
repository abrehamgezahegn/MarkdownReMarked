import React from "react";
import "./App.css";

const peeps = [
	{
		name: "Yonatan Dejene",
		title: "Project manager",
		email: "email@gmai.com",
		profile: "me@slack.com"
	},
	{
		name: "Simon Sisay",
		title: "FrontEnd engineer",
		email: "email@gmai.com",
		profile: "me@slack.com"
	},
	{
		name: "Abreaham Gezahegn",
		title: "FrontEnd engineer",
		email: "email@gmai.com",
		profile: "me@slack.com"
	},
	{
		name: "Mike",
		title: "FrontEnd engineer",
		email: "email@gmai.com",
		profile: "me@slack.com"
	},
	{
		name: "Abel",
		title: "FrontEnd engineer",
		email: "email@gmai.com",
		profile: "me@slack.com"
	},
	{
		name: "Nati",
		title: "FrontEnd engineer",
		email: "email@gmail.com",
		profile: "me@slack.com"
	},
	{
		name: "Eyosias",
		title: "FrontEnd engineer",
		email: "email@gmai.com",
		profile: "me@slack.com"
	}
];

class Mentions extends React.Component {
	defaultProps = {
		searchTerm: "",
		onClick: () => {}
	};

	state = {
		cursor: 0
	};

	onKeyDown = e => {
		console.log(e.keyCode);
	};

	render() {
		let filtered = peeps.filter(item =>
			item.name
				.toLowerCase()
				.includes(this.props.searchTerm.toLowerCase())
		);
		if (this.props.searchTerm === "") {
			filtered = peeps;
		}

		return (
			<div className="mentionsContainer">
				{filtered.map((item, i) => (
					<div
						className={`nameTag ${
							this.state.cursor === i ? "activeListItem" : ""
						}`}
						onClick={() => {
							this.props.onClick(item.name, item.profile);
						}}
						tabIndex={0}
					>
						<h4
							style={{
								width: "100%",
								height: "100%",
								borderBottom: "solid 1px rgba(0,0,0,0.1)",
								cursor: "pointer"
							}}
						>
							{" "}
							{item.name}{" "}
						</h4>
					</div>
				))}
			</div>
		);
	}
}

export default Mentions;
