//@flow
import React, { Component } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Shaders, Node, GLSL } from "gl-react";
import { Surface } from "gl-react-dom";

const shaders = Shaders.create({
  Saturate: {
    frag: GLSL`
precision highp float;
varying vec2 uv;
uniform sampler2D t;
uniform float contrast, saturation, brightness;
const vec3 L = vec3(0.2125, 0.7154, 0.0721);
void main() {
  vec4 c = texture2D(t, uv);
	vec3 brt = c.rgb * brightness;
	gl_FragColor = vec4(mix(
    vec3(0.5),
    mix(vec3(dot(brt, L)), brt, saturation),
    contrast), c.a);
}`,
  },
});

export const Saturate = ({ contrast, saturation, brightness, children }) => (
  <Node
    shader={shaders.Saturate}
    uniforms={{ contrast, saturation, brightness, t: children }}
  />
);

export default class Example extends Component {
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
        <Surface width={480} height={300}>
          <Saturate {...this.props}>https://i.imgur.com/uTP9Xfr.jpg</Saturate>
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

  static defaultProps = {
    contrast: 1,
    saturation: 1,
    brightness: 1,
  };
}
