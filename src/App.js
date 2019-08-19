import React from "react";
import "./App.css";
import Markdown from "markdown-to-jsx";
import Mentions from "./Mentions";
import HoverInput from "./HoverInput";

var getCaretCoordinates = require("textarea-caret");

// convention strings used in hotkeys
const _IMAGE = "image";
const _YOUTUBE = "youtube";
const _LINE = "line";
const _LINK = "link";

const marked = require("marked");

// literal youtube embed

const youtubeEmbed = `<iframe width="600" height="529" src="https://www.youtube.com/embed/youtubeID" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

class App extends React.Component {
	state = {
		value: "",
		selectedString: "",
		inputType: "",
		caretPosition: null,
		caretPositionEnd: null,
		top: 0,
		left: 0,
		searchTerm: "",
		commandSearchTerm: "",
		searching: false,
		onCommand: false,
		loading: false,
		showInput: false
	};

	handleCaret = async e => {
		// update caret position onClick
		const caretPosition = e.target.selectionStart;
		await this.setState({ caretPosition });
	};

	handleChange = e => {
		const value = e.target.value;
		const caretPositionEnd = e.target.selectionEnd; // caret position by word count
		this.setState({ value, caretPositionEnd });

		// getting last character of the value
		let lastChar = value[caretPositionEnd - 1];

		// toggle searching is lastchar matches @
		if (lastChar === "@") {
			this.setState({ searching: true, showInput: false });
		}

		if (lastChar === "/") {
			this.setState({ onCommand: true });
		}

		let { searching, onCommand } = this.state;

		if (onCommand) {
			if (lastChar === " ") {
				// if space is hit
				this.setState({ onCommand: false, commandSearchTerm: "" });
				let commandSearchTerm = value.substring(
					value.lastIndexOf("/") + 1,
					caretPositionEnd
				);
				this.setState({ commandSearchTerm });
			}
		}

		if (searching) {
			if (lastChar === " ") {
				// if space is hit when searching mentions
				this.setState({ searching: false, searchTerm: "" });
			}
			let searchTerm = value.substring(
				value.lastIndexOf("@") + 1,
				caretPositionEnd
			);
			this.setState({ searchTerm });
		}

		// getting the pixel coordinates of textarea caret (important piece of the tooltip)
		var coordinates = getCaretCoordinates(e.target, caretPositionEnd);
		let top = coordinates.top + 60;

		// styles fetch position from state I set here
		this.setState({ top, left: coordinates.left });
	};

	handleImage = async e => {
		// const { name, type, value } = e.target;
		// const val = type === 'number' ? parseFloat(value) : value;
		// this.setState({ [name]: val });
		this.setState({ loading: true });
		try {
			const files = e.target.files;
			const data = new FormData();
			data.append("file", files[0]);
			data.append("upload_preset", "sickfits");

			const res = await fetch(
				"https://api.cloudinary.com/v1_1/wesbostutorial/image/upload",
				{
					method: "POST",
					body: data
				}
			);
			const file = await res.json();

			this.insertMarkDownAtCursor(file.secure_url, _IMAGE);
		} catch (e) {
			console.log("error  uploading : ", e);
			this.setState({ loading: false });
		}
	};

	insertMarkDownAtCursor = (embed, type) => {
		// function inserts embeds at caretposition

		// TODO try to use subString and replace
		const caretPosition = this.state.caretPosition;

		const post = this.state.value;
		const array = post.split("");

		let markdown = "";
		if (type === _IMAGE) {
			markdown = `\n\n ![](${embed}) \n\n`;
		} else if (type === _YOUTUBE) {
			markdown = `\n\n${embed}\n\n`;
		} else if (type === _LINE) {
			markdown = `\n\n${embed}\n\n`;
		}

		array.splice(caretPosition, 0, markdown);
		const finalString = array.join("");

		this.setState({ value: finalString, loading: false });
	};

	onKeyDown = e => {
		// hotkey listener

		if (e.key === "Escape") {
			this.setState({ searching: false, showInput: false });
		}
		if (!e.ctrlKey) return null; // only listen to ctrl + <key>

		let textArea = this.refs.textArea;
		let cursorStart = textArea.selectionStart;
		let cursorEnd = textArea.selectionEnd;

		let value = this.state.value;
		let selectedString = value.substring(cursorStart, cursorEnd).trim();

		console.log(selectedString);

		this.setState({ selectedString });

		const replaceTextAreaValue = markedString => {
			const newValue = value.replace(selectedString, markedString);
			this.setState({ value: newValue });
		};

		switch (e.key) {
			case "b": {
				e.preventDefault();

				let newValue =
					value.substring(0, cursorStart) +
					"**" +
					value.substring(cursorStart, cursorEnd) +
					"**";
				this.setState({ value: newValue });

				break;
			}
			case "i": {
				e.preventDefault();

				let newValue = `${value.substring(
					0,
					cursorStart
				)} *${value.substring(cursorStart, cursorEnd)}*`;
				this.setState({ value: newValue });
				break;
			}
			case "1": {
				e.preventDefault();

				let newValue = `${value.substring(
					0,
					cursorStart
				)} # ${value.substring(cursorStart, cursorEnd)} `;

				this.setState({ value: newValue });
				break;
			}
			case "2": {
				e.preventDefault();
				let newValue = `${value.substring(
					0,
					cursorStart
				)} ## ${value.substring(cursorStart, cursorEnd)} `;

				this.setState({ value: newValue });
				break;
			}
			case "`": {
				e.preventDefault();

				let newValue = `${value.substring(
					0,
					cursorStart
				)} \n\n \`\`\`\n ${value.substring(
					cursorStart,
					cursorEnd
				)} \n\n \`\`\`  `;

				this.setState({ value: newValue });

				break;
			}
			case "s": {
				e.preventDefault();

				let newValue = `${value.substring(
					0,
					cursorStart
				)} ~~${value.substring(cursorStart, cursorEnd)}~~ `;
				this.setState({ value: newValue });

				break;
			}
			case "q": {
				e.preventDefault();
				let markedString = `>${selectedString}`;
				replaceTextAreaValue(markedString);
				break;
			}
			case "Enter": {
				e.preventDefault();
				// let markedString = `___ \n`;
				// this.insertMarkDownAtCursor(markedString, _LINE);
				let newValue = `${value.substring(
					0,
					cursorStart
				)} ${value.substring(cursorStart, cursorEnd)}\n___ `;
				this.setState({ value: newValue });

				break;
			}
			case "l": {
				e.preventDefault();
				if (selectedString.length > 0) {
					this.setState({
						showInput: true,
						searching: false,
						inputType: _LINK
					});
				}

				break;
			}
			case "y": {
				e.preventDefault();
				this.setState({
					showInput: true,
					searching: false,
					inputType: _YOUTUBE
				});

				break;
			}
			default:
				return;
		}
	};

	insertFromInput = inputValue => {
		let value = this.state.value;
		let selectedString = this.state.selectedString;
		if (this.state.inputType === _LINK) {
			let link = inputValue;
			if (link) {
				let markedString = `<a href="${link}" target="_blank"> ${selectedString} </a>`;
				const newValue = value.replace(selectedString, markedString);
				this.setState({
					value: newValue,
					inputValue: "",
					showInput: false
				});
			}
		} else if (this.state.inputType === _YOUTUBE) {
			let youtubeUrl = inputValue;

			// extracating video id from link
			let youtubeID = youtubeUrl.replace(
				"https://www.youtube.com/watch?v=",
				""
			);

			// inserting youtube id in iframe defined at the top(youtubeEmbed)
			let embadedYoutube = youtubeEmbed.replace("youtubeID", youtubeID);

			// adding new lines
			let markedString = `\n\n${embadedYoutube}\n\n`;

			// state cleanup
			this.setState({
				inputValue: "",
				showInput: false
			});

			// function name is pretty descriptive
			this.insertMarkDownAtCursor(markedString, _YOUTUBE);
		}
	};

	insertMentions = markedString => {
		// deletes @.. and inserts mention link(marked string)
		const value = this.state.value;
		console.log("value: ", value);
		const caretPositionEnd = this.state.caretPositionEnd;

		let newValue =
			value.substring(0, value.lastIndexOf("@")) +
			markedString +
			value.substring(caretPositionEnd);

		this.setState({ value: newValue });
		let textArea = this.refs.textArea;
		textArea.focus();
	};

	onMentionClick = (name, profile) => {
		// event listener for list of names click
		let markedString = ` <span id="mention"> @${name} <span>`;
		this.setState({ searching: false });
		this.insertMentions(markedString);
	};

	handleDivChange = e => {
		let value = e.target.value;
		console.log(e.target);
		this.setState({ value });
	};

	render() {
		console.log(this.state);
		return (
			<div className="app-container" style={{ margin: 50 }}>
				<div className="textarea-wrapper">
					<div // TODO refactor to own component
						style={{
							display: this.state.searching ? "block" : "none",
							width: 30,
							height: 30,
							zIndex: 100,
							position: "relative",
							top: this.state.top,
							left: this.state.left
						}}
					>
						<Mentions
							searchTerm={this.state.searchTerm}
							onClick={this.onMentionClick}
						/>
					</div>
					<HoverInput
						top={this.state.top}
						left={this.state.left}
						display={this.state.showInput}
						closeInput={() => {
							this.setState({ showInput: false });
						}}
						submitInputValue={this.insertFromInput}
					/>

					<textarea
						ref="textArea"
						disabled={this.state.loading}
						className="textarea"
						onChange={this.handleChange}
						value={this.state.value}
						onClick={this.handleCaret}
						onKeyDown={this.onKeyDown}
					/>
				</div>
				<input type="file" onChange={this.handleImage} />

				<div
					dangerouslySetInnerHTML={{
						__html: marked(this.state.value)
					}}
				></div>
			</div>
		);
	}
}

export default App;
