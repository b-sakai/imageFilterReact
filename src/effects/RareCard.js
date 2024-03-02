//@flow
import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Shaders, Node, GLSL } from "gl-react";
import { Surface } from "gl-react-dom";
import timeLoop from "./timeLoop";

const shaders = Shaders.create({
  RareCard: {
    frag: GLSL`
precision highp float;
varying vec2 uv;
uniform sampler2D t;
uniform float time, velocity, threshold;
const vec3 L = vec3(0.2125, 0.7154, 0.0721);
void main() {
  float v = velocity * time;

  // 構造色の計算
  vec3 structColor = vec3(
    sin(uv.x * 10.0 + 0.2 * v),  // 赤
    sin(uv.y * 10.0 + 0.3 * v),  // 緑
    sin((uv.x + uv.y + 0.8 * v) * 10.0)  // 青
  );

  // 元画像の色を読み込み
  vec4 texel = texture2D(t, uv);

  // 構造色を加算
  vec3 result = texel.rgb + 0.3 * structColor;
  vec4 ret = vec4(result, texel.a);

  float b = dot(texel.rgb, vec3(1.0)) / 3.0;

  // 色の出力
  gl_FragColor = mix(texel, ret, step(b, threshold));
}`,
  },
});

// timeLoopを使用してRareCardを拡張
const RareCardWithTimeLoop = timeLoop(({ time, tick, ...props }) => (
  <Node shader={shaders.RareCard} uniforms={{ time: time*0.005, ...props }} />
));

const RareCardFilter = () => {
  const [velocity, setVelocity] = useState(0.5);
  const [threshold, setThreshold] = useState(0.5);
  const [image, setImage] = useState("https://i.imgur.com/uTP9Xfr.jpg"); // Default image URL

  const handleVelocitySliderChange = (value) => {
    setVelocity(value);
  };
  const handleThresholdSliderChange = (value) => {
    setThreshold(value);
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
        <RareCardWithTimeLoop velocity={velocity} threshold={threshold} t={image} />
      </Surface>
      <div style={{ width: "80%", marginTop: "10px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h3>Velocity</h3>
        <Slider
          style={{ width: "80%", margin: "10px" }}
          value={velocity}
          step={0.01}
          min={0}
          max={1}
          onChange={handleVelocitySliderChange}
        />
        <h3>Threshold</h3>
        <Slider
          style={{ width: "80%", margin: "10px" }}
          value={threshold}
          step={0.01}
          min={0}
          max={1}
          onChange={handleThresholdSliderChange}
        />
        <h3>Upload Image</h3>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
    </div>
  );
};

export default RareCardFilter;
