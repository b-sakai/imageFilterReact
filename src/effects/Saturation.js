//@flow
import React, { useState } from "react";
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

const Saturate = ({ contrast, saturation, brightness, children }) => (
  <Node
    shader={shaders.Saturate}
    uniforms={{ contrast, saturation, brightness, t: children }}
  />
);

const Saturation = () => {
  const [contrast, setContrast] = useState(0.5);
  const [saturation, setSaturation] = useState(0.5);
  const [brightness, setBrightness] = useState(0.5);
  const [image, setImage] = useState("https://i.imgur.com/uTP9Xfr.jpg"); // Default image URL

  const handleContrastSliderChange = (value) => {
    setContrast(value);
  };
  const handleSaturationSliderChange = (value) => {
    setSaturation(value);
  };
  const handleBrightnessSliderChange = (value) => {
    setBrightness(value);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100vh", width: "80%" }}>
      <Surface width={480} height={300}>
        <Saturate contrast={contrast} saturation={saturation} brightness={brightness}>
          {image}
        </Saturate>
      </Surface>
      <div style={{ width: "80%", marginTop: "10px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h3>Contrast</h3>
        <Slider
          style={{ width: "80%", margin: "10px" }}
          value={contrast}
          step={0.01}
          min={0}
          max={1}
          onChange={handleContrastSliderChange}
        />
        <h3>Saturation</h3>
        <Slider
          style={{ width: "80%", margin: "10px" }}
          value={saturation}
          step={0.01}
          min={0}
          max={1}
          onChange={handleSaturationSliderChange}
        />
        <h3>Brightness</h3>
        <Slider
          style={{ width: "80%", margin: "10px" }}
          value={brightness}
          step={0.01}
          min={0}
          max={1}
          onChange={handleBrightnessSliderChange}
        />
        <h3>Upload Image</h3>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
    </div>
  );
};

export default Saturation;
