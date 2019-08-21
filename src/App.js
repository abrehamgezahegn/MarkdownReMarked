import React from "react";
import "./App.css";
import Markdown from "markdown-to-jsx";
import Mentions from "./Mentions";
import HoverInput from "./HoverInput";
import CommandsList from "./CommandsList";
import ContentEditable from "react-contenteditable";

var getCaretCoordinates = require("textarea-caret");

// convention strings used in hotkeys
const _IMAGE = "image";
const _VIDEOEMBED = "youtube";
const _LINE = "line";
const _LINK = "link";

const marked = require("marked");

// literal youtube embed
const youtubeEmbed = `<iframe width="600" height="529" src="https://www.youtube.com/embed/youtubeID" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
const loomEmbed = `<div style={{ position: "relative", paddingBottom: "55.3125%", height: 0 }}> <iframe width="600" height="550" src="https://www.loom.com/embed/loomID" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style={{ position: "absolute", top: 0, left: 0, width: "50%", height: "50%" }} ></iframe> </div>`;

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
		showCommands: false,
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
			this.setState({
				searching: true,
				showInput: false,
				showCommands: false
			});
		}

		if (lastChar === "/") {
			this.setState({
				showCommands: true,
				searching: false,
				showInput: false
			});
		}

		let { searching, showCommands } = this.state;

		if (showCommands) {
			if (lastChar === " ") {
				// if space is hit
				this.setState({ showCommands: false, commandSearchTerm: "" });
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
		const caretPositionEnd  = this.state.caretPositionEnd
		const value = this.state.value;

		const post = this.state.value;
		const array = post.split("");

		let markdown = "";
		if (type === _IMAGE) {
			markdown = `\n ![](${embed}) \n\n`;
		} else if (type === _VIDEOEMBED) {
			markdown = `\n${embed}\n\n`;
		} else if (type === _LINE) {
			markdown = `\n${embed}\n\n`;
		}
		array.splice(caretPosition, 0, markdown);
		const finalString = array.join("");

		let newValue = `${value.substring(
					0,
					caretPosition
				)} ${markdown} ${value.substring(caretPositionEnd)}`;
					

		this.setState({ value: newValue, loading: false , inputType: "" });
	};

	onKeyDown = e => {
		// hotkey listener

		let textArea = this.refs.textArea;
		let cursorStart = textArea.selectionStart;
		let cursorEnd = textArea.selectionEnd;

		let value = this.state.value;
		let selectedString = value.substring(cursorStart, cursorEnd).trim();

		if (e.key === "Escape") {
			this.setState({ searching: false, showInput: false });
		}

		if (!e.ctrlKey) return null; // only listen to ctrl + <key>

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
					selectedString +
					"** " +
					value.substring(cursorEnd);
				this.setState({ value: newValue });

				break;
			}
			case "i": {
				e.preventDefault();

				let newValue = `${value.substring(
					0,
					cursorStart
				)} *${selectedString}* ${value.substring(cursorEnd)}`;
				this.setState({ value: newValue });
				break;
			}
			case "1": {
				e.preventDefault();

				let newValue = `${value.substring(
					0,
					cursorStart
				)} # ${value.substring(
					cursorStart,
					cursorEnd
				)} ${value.substring(cursorEnd)}`;

				this.setState({ value: newValue });
				break;
			}
			case "2": {
				e.preventDefault();
				let newValue = `${value.substring(
					0,
					cursorStart
				)} ## ${value.substring(
					cursorStart,
					cursorEnd
				)} ${value.substring(cursorEnd)}`;

				this.setState({ value: newValue });
				break;
			}
			case "`": {
				e.preventDefault();

				let newValue = `${value.substring(
					0,
					cursorStart
				)} \n\n \`\`\`\n ${selectedString} \n\n \`\`\` \n ${value.substring(
					cursorEnd
				)}`;

				this.setState({ value: newValue });

				break;
			}
			case "s": {
				e.preventDefault();

				let newValue = `${value.substring(
					0,
					cursorStart
				)} ~~${selectedString}~~ ${value.substring(cursorEnd)}`;
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
				let newValue = `${value.substring(
					0,
					cursorStart
				)} ${value.substring(
					cursorStart,
					cursorEnd
				)}\n\n\n___ \n\n\n ${value.substring(cursorEnd)}`;
				this.setState({ value: newValue }); 

				break;
			}
			case "k": {
				e.preventDefault();
				this.setState({
					searching: false,
					showCommands: false,
					showInput: true,
					inputType: _IMAGE
				});
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
			case "e": {
				e.preventDefault();
				this.setState({
					showInput: true,
					searching: false,
					inputType: ""
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
		const cursorStart = this.state.caretPosition;
		const cursorEnd = this.state.caretPositionEnd;

		if (this.state.inputType === _IMAGE) {
			this.insertMarkDownAtCursor(inputValue, _IMAGE);
			this.setState({ showInput: false });
		}

		if (this.state.inputType === _LINK) {
			let link = inputValue;
			if (link) {
				let markedString = `<a href="${link}" target="_blank"> ${selectedString} </a>`;

				const newValue= `${value.substring(
					0,
					cursorStart
				)} ${markedString} ${value.substring(cursorEnd)}`

				//const newValue = value.replace(selectedString, markedString);
				this.setState({
					value: newValue,
					inputValue: "",
					showInput: false
				});
				let textArea = this.refs.textArea;
				textArea.focus();
			}
			return;
		}
		if (inputValue.includes("www.loom.com")) {
			let loomID = inputValue.replace("https://www.loom.com/share/", "");
			let iDfiedLoom = loomEmbed.replace("loomID", loomID);

			let markedString = `\n\n${iDfiedLoom}\n\n`;

			// state cleanup
			this.setState({
				inputValue: "",
				showInput: false
			});
			let textArea = this.refs.textArea;
			textArea.focus();
			// function name is pretty descriptive
			this.insertMarkDownAtCursor(markedString, _VIDEOEMBED);
		}
		if (inputValue.includes("https://www.youtube.com/watch")) {
			let youtubeUrl = inputValue;

			// extracating video id from link
			let youtubeID = youtubeUrl.replace(
				"https://www.youtube.com/watch?v=",
				""
			).replace(/&index.+/ , "").replace(/&list/ , "?list")
			console.log("IDDDD:" ,youtubeID)

			// inserting youtube id in iframe defined at the top(youtubeEmbed)
			let embadedYoutube = youtubeEmbed.replace("youtubeID", youtubeID);

			// adding new lines
			let markedString = `\n\n${embadedYoutube}\n\n`;

			// state cleanup
			this.setState({
				inputValue: "",
				showInput: false
			});

			let textArea = this.refs.textArea;
			textArea.focus();

			// function name is pretty descriptive
			this.insertMarkDownAtCursor(markedString, _VIDEOEMBED);
		}
	};

	insertMentions = markedString => {
		// deletes @.. and inserts mention link(marked string)
		const value = this.state.value;
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
		let markedString = ` <span id="mention"> @${name} </span> `;
		this.setState({ searching: false });
		this.insertMentions(markedString);
	};

	render() {
		return (
			<div className="app-container" style={{ margin: 50 }}>
				<div className="textarea-wrapper">
					<CommandsList
						top={this.state.top}
						left={this.state.left}
						display={this.state.showCommands}
					/>
					<Mentions
						searchTerm={this.state.searchTerm}
						onClick={this.onMentionClick}
						top={this.state.top}
						left={this.state.left}
						searching={this.state.searching}
					/>
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
