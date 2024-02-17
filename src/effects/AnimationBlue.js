//@flow
import React, { Component } from "react";
import { Surface } from "gl-react-dom";

// Reuse that previous HelloBlue component to animate it...
import timeLoop from "./timeLoop";
import { HelloBlue } from "./Blue";

export default timeLoop(class Example extends Component {
  render() {
    const { time } = this.props;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100vh", width: "80%" }}>
        <Surface width={300} height={300}>
          <HelloBlue blue={0.5 + 0.5 * Math.cos(time / 500)} />
        </Surface>
      </div>
    );
  }
});
