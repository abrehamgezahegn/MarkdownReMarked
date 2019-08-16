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

const Mentions = ({ searchTerm = "", onClick }) => {
	let filtered = peeps.filter(item =>
		item.name.toLowerCase().includes(searchTerm.toLowerCase())
	);
	if (searchTerm === "") {
		filtered = peeps;
	}
	return (
		<div className="mentionsContainer">
			{filtered.map(item => (
				<div
					className="nameTag"
					onClick={() => {
						onClick(item.name, item.profile);
					}}
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
};

export default Mentions;
