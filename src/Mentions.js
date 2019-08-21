import React from "react";
import "./App.css";

const peeps = [
	{
		name: "Yonatan Dejene",
		title: "Project manager",
		email: "email@gmai.com",
		profile: "me@slack.com",
		avatar: "https://www.thesprucepets.com/thmb/810a_HYIb2E8DxkedI6V-3gtkys=/450x0/filters:no_upscale():max_bytes(150000):strip_icc()/kitten-looking-at-camera-521981437-57d840213df78c583374be3b.jpg"
	},
	{
		name: "Simon Sisay",
		title: "FrontEnd engineer",
		email: "email@gmai.com",
		profile: "me@slack.com",
		avatar: "https://www.thesprucepets.com/thmb/810a_HYIb2E8DxkedI6V-3gtkys=/450x0/filters:no_upscale():max_bytes(150000):strip_icc()/kitten-looking-at-camera-521981437-57d840213df78c583374be3b.jpg"
	},
	{
		name: "Abreaham Gezahegn",
		title: "FrontEnd engineer",
		email: "email@gmai.com",
		profile: "me@slack.com",
		avatar: "https://www.thesprucepets.com/thmb/810a_HYIb2E8DxkedI6V-3gtkys=/450x0/filters:no_upscale():max_bytes(150000):strip_icc()/kitten-looking-at-camera-521981437-57d840213df78c583374be3b.jpg"
	},
	{
		name: "Mike",
		title: "FrontEnd engineer",
		email: "email@gmai.com",
		profile: "me@slack.com",
		avatar: "https://www.thesprucepets.com/thmb/810a_HYIb2E8DxkedI6V-3gtkys=/450x0/filters:no_upscale():max_bytes(150000):strip_icc()/kitten-looking-at-camera-521981437-57d840213df78c583374be3b.jpg"
	},
	{
		name: "Abel",
		title: "FrontEnd engineer",
		email: "email@gmai.com",
		profile: "me@slack.com",
		avatar: "https://www.thesprucepets.com/thmb/810a_HYIb2E8DxkedI6V-3gtkys=/450x0/filters:no_upscale():max_bytes(150000):strip_icc()/kitten-looking-at-camera-521981437-57d840213df78c583374be3b.jpg"
	},
	{
		name: "Nati",
		title: "FrontEnd engineer",
		email: "email@gmail.com",
		profile: "me@slack.com",
		avatar: "https://www.thesprucepets.com/thmb/810a_HYIb2E8DxkedI6V-3gtkys=/450x0/filters:no_upscale():max_bytes(150000):strip_icc()/kitten-looking-at-camera-521981437-57d840213df78c583374be3b.jpg"
	},
	{
		name: "Eyosias",
		title: "FrontEnd engineer",
		email: "email@gmai.com",
		profile: "me@slack.com",
		avatar: "https://www.thesprucepets.com/thmb/810a_HYIb2E8DxkedI6V-3gtkys=/450x0/filters:no_upscale():max_bytes(150000):strip_icc()/kitten-looking-at-camera-521981437-57d840213df78c583374be3b.jpg"
	}
];

class Mentions extends React.Component {
	static defaultProps = {
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
			<div // TODO refactor to own component
				style={{
					display: this.props.searching ? "block" : "none",
					width: 30,
					height: 30,
					zIndex: 100,
					position: "absolute",
					top: this.props.top + 20,
					left: this.props.left + 260
				}}
			>
				<div className="mentionsContainer">
					{filtered.map((item, i) => (
						<div
							key={item.id}
							className={`nameTag ${
								this.state.cursor === i ? "activeListItem" : ""
							}`}
							onClick={() => {
								this.props.onClick(item.name, item.profile);
							}}
						>
							<img src={item.avatar} alt={item.name}/>
							<h4>
								{item.name}
							</h4>
						</div>
					))}
				</div>
			</div>
		);
	}
}

export default Mentions;
