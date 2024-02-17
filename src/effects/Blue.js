//@flow
import React, { Component } from "react";
import { Shaders, Node, GLSL } from "gl-react";
import { Surface } from "gl-react-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const shaders = Shaders.create({
  helloBlue: {
    frag: GLSL`#version 300 es
precision highp float;

in vec2 uv;
out vec4 color;

uniform float blue;

void main() {
  color = vec4(uv.x, uv.y, blue, 1.0);
}`,
  },
});

class HelloBlue extends Component {
  render() {
    const { blue } = this.props;
    return <Node shader={shaders.helloBlue} uniforms={{ blue }} />;
  }
}

export {HelloBlue}

class Example extends Component {
  constructor(props) {
    super(props);
    this.state = { blue: 0.5 };
  }

  handleSliderChange = (value) => {
    this.setState({ blue: value });
  };

  render() {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100vh", width: "80%" }}>
        <Surface width={300} height={300}>
          <HelloBlue blue={this.state.blue} />
        </Surface>
        <div style={{ width: "80%", marginTop: "10px", display: "flex", flexDirection: "row", alignItems: "center" }}>
          <h3>Blue Intensity</h3>
          <Slider
            style={{ width: "80%", margin: "10px" }}
            value={this.state.blue}
            step={0.01}
            min={0}
            max={1}
            onChange={this.handleSliderChange}
          />
        </div>
      </div>
    );
  }
}

export default Example;
