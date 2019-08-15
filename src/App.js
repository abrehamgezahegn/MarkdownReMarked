import React from "react";
import "./App.css";
import Markdown from "markdown-to-jsx";

const _IMAGE = "image";
const _YOUTUBE = "youtube";
const _LINE = "line";

const marked = require("marked");

const youtubeEmbed = `<iframe width="600" height="529" src="https://www.youtube.com/embed/youtubeID" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

class App extends React.Component {
  state = {
    value: "",
    caretPosition: null
  };

  handleCaret = async e => {
    const caretPosition = e.target.selectionStart;
    await this.setState({ caretPosition });
    console.log("caret position: ", this.state.caretPosition);
  };

  handleChange = e => {
    const value = e.target.value;
    this.setState({ value });
  };

  handleImage = async e => {
    // const { name, type, value } = e.target;
    // const val = type === 'number' ? parseFloat(value) : value;
    // this.setState({ [name]: val });
    this.setState({ loading: true });
    try {
      console.log("uploading");
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
      console.log(file);

      this.insertMarkDownAtCursor(file.secure_url, _IMAGE);
    } catch (e) {
      console.log("error  uploading : ", e);
    }
  };

  insertMarkDownAtCursor = (embed, type) => {
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
    console.log("final string: ", finalString);

    this.setState({ value: finalString, loading: false });
  };

  onKeyDown = e => {
    if (!e.ctrlKey) return null;

    console.log("key: ", e.key);
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

  render() {
    return (
      <div className="container" style={{ margin: 50 }}>
        <textarea
          ref="textArea"
          disabled={this.state.loading}
          className="textarea"
          onChange={this.handleChange}
          value={this.state.value}
          onClick={this.handleCaret}
          onKeyDown={this.onKeyDown}
        />
        <input type="file" onChange={this.handleImage} />

        <div
          dangerouslySetInnerHTML={{ __html: marked(this.state.value) }}
        ></div>
      </div>
    );
  }
}

export default App;
