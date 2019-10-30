import React from "react";
import LinkIcon from "./assets/link-solid.svg";

const commands = [
	{
		name: "Video",
		id: 1,
		details: "Youtube loom (ctrl + e)",
		image: "https://png.pngtree.com/svg/20170701/d34351479c.svg"
	},
	{
		name: "Header 1",
		id: 2,
		details: "Big section heading. (ctrl + 1)",
		image: "https://www.notion.so/images/blocks/header.57a7576a.png"
	},
	{
		name: "Header 2",
		id: 3,
		details: "Medium section heading. (ctrl + 2)",
		image: "https://www.notion.so/images/blocks/subheader.9aab4769.png"
	},
	{
		name: "Bold",
		id: 4,
		details: "Bold text (select text => ctrl + b)",
		image: "https://www.notion.so/images/blocks/text.9fdb530b.png"
	},
	{
		name: "Code",
		id: 5,
		details: "Block of code (ctrl + `)",
		image: `data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgZGF0YS1wcmVmaXg9ImZhZCIgZGF0YS1pY29uPSJjb2RlIiByb2xlPSJpbWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDY0MCA1MTIiIGNsYXNzPSJzdmctaW5saW5lLS1mYSBmYS1jb2RlIGZhLXctMjAgZmEtM3giPjxnIGNsYXNzPSJmYS1ncm91cCI+PHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBkPSJNNDIyLjEyIDE4LjE2YTEyIDEyIDAgMCAxIDguMiAxNC45bC0xMzYuNSA0NzAuMmExMiAxMiAwIDAgMS0xNC44OSA4LjJsLTYxLTE3LjdhMTIgMTIgMCAwIDEtOC4yLTE0LjlsMTM2LjUtNDcwLjJhMTIgMTIgMCAwIDEgMTQuODktOC4yeiIgY2xhc3M9ImZhLXNlY29uZGFyeSIvPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTTYzNi4yMyAyNDcuMjZsLTE0NC4xMS0xMzUuMmExMi4xMSAxMi4xMSAwIDAgMC0xNyAuNUw0MzEuNjIgMTU5YTEyIDEyIDAgMCAwIC44MSAxNy4yTDUyMyAyNTZsLTkwLjU5IDc5LjdhMTEuOTIgMTEuOTIgMCAwIDAtLjgxIDE3LjJsNDMuNSA0Ni40YTEyIDEyIDAgMCAwIDE3IC42bDE0NC4xMS0xMzUuMWExMS45NCAxMS45NCAwIDAgMCAuMDItMTcuNTR6bS00MjcuOC04OC4ybC00My41LTQ2LjRhMTIgMTIgMCAwIDAtMTctLjVsLTE0NC4xMSAxMzVhMTEuOTQgMTEuOTQgMCAwIDAgMCAxNy41bDE0NC4xMSAxMzUuMWExMS45MiAxMS45MiAwIDAgMCAxNy0uNWw0My41LTQ2LjRhMTIgMTIgMCAwIDAtLjgxLTE3LjJMMTE3IDI1Nmw5MC42LTc5LjdhMTEuOTIgMTEuOTIgMCAwIDAgLjgzLTE3LjI0eiIgY2xhc3M9ImZhLXByaW1hcnkiLz48L2c+PC9zdmc+`
	},
	{
		name: "Quote",
		id: 6,
		details: "Nobody is creative just hit that (ctrl + q)",
		image:
			"data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgZGF0YS1wcmVmaXg9ImZhcyIgZGF0YS1pY29uPSJxdW90ZS1sZWZ0IiByb2xlPSJpbWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGNsYXNzPSJzdmctaW5saW5lLS1mYSBmYS1xdW90ZS1sZWZ0IGZhLXctMTYgZmEtM3giPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTTQ2NCAyNTZoLTgwdi02NGMwLTM1LjMgMjguNy02NCA2NC02NGg4YzEzLjMgMCAyNC0xMC43IDI0LTI0VjU2YzAtMTMuMy0xMC43LTI0LTI0LTI0aC04Yy04OC40IDAtMTYwIDcxLjYtMTYwIDE2MHYyNDBjMCAyNi41IDIxLjUgNDggNDggNDhoMTI4YzI2LjUgMCA0OC0yMS41IDQ4LTQ4VjMwNGMwLTI2LjUtMjEuNS00OC00OC00OHptLTI4OCAwSDk2di02NGMwLTM1LjMgMjguNy02NCA2NC02NGg4YzEzLjMgMCAyNC0xMC43IDI0LTI0VjU2YzAtMTMuMy0xMC43LTI0LTI0LTI0aC04QzcxLjYgMzIgMCAxMDMuNiAwIDE5MnYyNDBjMCAyNi41IDIxLjUgNDggNDggNDhoMTI4YzI2LjUgMCA0OC0yMS41IDQ4LTQ4VjMwNGMwLTI2LjUtMjEuNS00OC00OC00OHoiIGNsYXNzPSIiLz48L3N2Zz4="
	},
	{
		name: "Link",
		id: 7,
		details: "ctrl + l",
		image: LinkIcon
	},
	{
		name: "Mention",
		id: 8,
		details: "@...",
		image:
			"data:image/png;base64,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"
	},
	{
		name: "Image Embed",
		id: 9,
		details: "Link Embed (ctrl + k)",
		image:
			"https://images.unsplash.com/photo-1566023497729-78af8c1f0e62?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
	}
];

class CommandsList extends React.Component {
	static defaultProps = {
		top: 0,
		left: 0,
		display: false
	};

	onKeyDown = e => {
		if (e.key === "Escape") {
			this.setState({ value: "" });
			this.props.closeInput();
		}
		if (e.key === "Enter" && this.state.value.length > 0) {
			this.setState({ value: "" });
			this.props.submitInputValue(this.state.value);
		}
	};

	onClick = () => {
		this.setState({ value: "" });
		if (this.state.value.length > 0)
			this.props.submitInputValue(this.state.value);
	};

	render() {
		return (
			<div
				style={{
					zIndex: 10000,
					position: "absolute",
					top: this.props.top,
					left: this.props.left + 300,
					display: this.props.display ? "inline" : "none"
				}}
			>
				<div className="hover-command-contianer">
					<h3 className="header">Available Commands</h3>
					{commands.map(item => (
						<div className="command-item" key={item.id}>
							<img src={item.image} alt={item.name} />
							<div className="item-text">
								<h3>{item.name}</h3>
								<p>{item.details}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}
}

export default CommandsList;