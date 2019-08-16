import React from "react";
import "./App.css";
import Markdown from "markdown-to-jsx";
import styled from "styled-components";
import Mentions from "./Mentions";

var getCaretCoordinates = require("textarea-caret");

// convention strings used in hotkeys
const _IMAGE = "image";
const _YOUTUBE = "youtube";
const _LINE = "line";

const marked = require("marked");

// literal youtube embed

const youtubeEmbed = `<iframe width="600" height="529" src="https://www.youtube.com/embed/youtubeID" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

class App extends React.Component {
  state = {
    value: "",
    caretPosition: null,
    caretPositionEnd: null,
    top: 100,
    left: 100,
    searchTerm: "",
    searching: false
  };

  handleCaret = async e => {
    // update caret position onClick
    const caretPosition = e.target.selectionStart;
    await this.setState({ caretPosition });
  };

  handleChange = e => {
    const value = e.target.value;
    const caretPositionEnd = e.target.selectionEnd;
    this.setState({ value, caretPositionEnd });

    let element = e.target;
    let selectionEnd = e.target.selectionEnd;

    // gettinh last character of the value
    let lastChar = value[selectionEnd - 1];

    // toggle searching is lastchar matches @
    if (lastChar === "@") {
      this.setState({ searching: true });
    }

    let searching = this.state.searching;

    if (searching) {
      if (lastChar === " ") {
        // if space is hit when searching mentions
        this.setState({ searching: false, searchTerm: "" });
      }
      let searchTerm = value.substring(
        value.lastIndexOf("@") + 1,
        selectionEnd
      );
      this.setState({ searchTerm });
    }

    // getting the pixel coordinates of textarea caret (important piece of the tooltip)
    var coordinates = getCaretCoordinates(e.target, selectionEnd);
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
    if (!e.ctrlKey) return null; // only listen to ctrl + <key>

    let textArea = this.refs.textArea;
    let cursorStart = textArea.selectionStart;
    let cursorEnd = textArea.selectionEnd;

    let value = this.state.value;
    let selectedString = value.substring(cursorStart, cursorEnd).trim();

    const replaceTextAreaValue = markedString => {
      const newValue = value.replace(selectedString, markedString);
      this.setState({ value: newValue });
    };

    switch (e.key) {
      case "b": {
        e.preventDefault();

        let markedString = ` **${selectedString}** `;
        replaceTextAreaValue(markedString);
        break;
      }
      case "1": {
        e.preventDefault();

        let markedString = `\n# ${selectedString} # `;
        replaceTextAreaValue(markedString);
        break;
      }
      case "2": {
        let markedString = `\n## ${selectedString} ## `;
        replaceTextAreaValue(markedString);
        break;
      }
      case "`": {
        e.preventDefault();
        let markedString = ` \n \`\`\`\n${selectedString} \n\n \`\`\` `;
        replaceTextAreaValue(markedString);
        break;
      }
      case "s": {
        e.preventDefault();
        let markedString = `~~${selectedString}~~ `;
        replaceTextAreaValue(markedString);
        break;
      }
      case "q": {
        e.preventDefault();
        let markedString = `\n>${selectedString}\n\n`;
        replaceTextAreaValue(markedString);
        break;
      }
      case "-": {
        e.preventDefault();
        let markedString = `___ \n`;
        this.insertMarkDownAtCursor(markedString, _LINE);
        break;
      }
      case "l": {
        e.preventDefault();
        let link = prompt("your link url");

        let markedString = `<a href="${link}" target="_blank"> ${selectedString} </a>`;
        replaceTextAreaValue(markedString);
        break;
      }
      case "y": {
        e.preventDefault();
        let youtubeUrl = prompt("youtube url");
        let youtubeID = youtubeUrl.replace(
          "https://www.youtube.com/watch?v=",
          ""
        );
        let embadedYoutube = youtubeEmbed.replace("youtubeID", youtubeID);

        let markedString = `\n\n${embadedYoutube}\n\n`;

        this.insertMarkDownAtCursor(markedString, _YOUTUBE);
        break;
      }
      default:
        return;
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
    let markedString = ` <a href="${profile}" target="_blank"> @${name} </a> `;
    this.setState({ searching: false });
    this.insertMentions(markedString);
  };

  render() {
    return (
      <div className="container" style={{ margin: 50 }}>
        <div className="wrapper">
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
          dangerouslySetInnerHTML={{ __html: marked(this.state.value) }}
        ></div>
      </div>
    );
  }
}

export default App;
