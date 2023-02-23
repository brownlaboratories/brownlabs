import React, { Component } from "react";
import { Select, MenuItem, Typography } from "@mui/material";
import { TextField } from "@mui/material";

const apiKey = process.env.REACT_APP_OPENAI_KEY

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenLength: 7,
      prompt: "",
      resultFromGPT: "",
    };
  }

  

  handleTokenLength = (event) => {
    this.setState({ tokenLength: event.target.value })
  };

  handlePrompt = (event) => {
    this.setState({ prompt: event.target.value})
  }

  runPrompt = (event) => {
    event.preventDefault();

    console.log("runPrompt");
    if (this.state.prompt != ""){
      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "OpenAI-Organization": "org-QpQSGTCE6Y3abHVNFVUokF49",
        },
        body: JSON.stringify({
          model: "text-davinci-003",
          prompt: this.state.prompt,
          temperature: 0,
          max_tokens: this.state.tokenLength,
        }),
      };
      fetch("https://api.openai.com/v1/completions", options)
        .then((response) => response.json())
        .then((responseText) => {
          this.setState(
            { resultFromGPT: responseText.choices[0].text },
            function () {
              console.log("Response:");
              console.log(this.state.resultFromGPT);
            }
          );
        });
    }
};


  render() {
    return (
      <div>
        <h1>Landing Page </h1>
        <Select
          value={this.state.tokenLength}
          label="Response Token Length"
          onChange={this.handleTokenLength.bind(this)}
        >
          <MenuItem value={7}> Seven </MenuItem>
          <MenuItem value={10}> Ten </MenuItem>
          <MenuItem value={15}> Fifteen </MenuItem>
        </Select> 
        <form onSubmit={this.runPrompt}>
          <TextField 
            multiline
            onChange={this.handlePrompt}
            value={this.state.prompt}
            placeholder="Prompt GPT"
          />
          <input type="submit" value="Submit" />
        </form>

        <Typography>
          {this.state.resultFromGPT}
        </Typography>
      </div>
    );
  }
}

export default Landing;
