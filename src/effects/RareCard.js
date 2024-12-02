//@flow
import React, { useState, useEffect } from "react";
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
uniform float time, velocity, threshold, mixRatio;
uniform vec3 baseColor;
uniform vec2 resolution;

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec2 normUV = uv * resolution.xy / max(resolution.x, resolution.y); // 解像度基準で正規化
  float v = velocity * time;

  // 構造色の計算
  vec3 structColor = vec3(
    sin(normUV.x * 10.0 + 0.2 * v),  // 赤
    sin(normUV.y * 10.0 + 0.3 * v),  // 緑
    sin((normUV.x + normUV.y + 0.8 * v) * 10.0)  // 青
  );

  // 元画像の色を読み込み
  vec4 texel = texture2D(t, uv);

  // rainbow
  vec2 shiftedUV = vec2(-uv.x, uv.y) + vec2(0.1 * v, 0.1 * v); // UVを時間と速度に応じてシフト
  float hue = mod(shiftedUV.x + shiftedUV.y, 1.0); // 斜め方向に虹色を生成
  vec3 rainbowColor = hsv2rgb(vec3(hue, 1.0, 1.0)); // HSVをRGBに変換

  float highlight = sin(3.2 * (shiftedUV.x + shiftedUV.y) + 1.4 * v) * 0.5 + 0.5;
  highlight = smoothstep(0.98, 1.0, highlight); // ハイライトを明確に


  vec3 mixedColor = mix(rainbowColor, baseColor, mixRatio);

  // 最終的な色の計算
  vec3 result = texel.rgb + 0.3 * mixedColor;
  vec4 ret = vec4(result, texel.a);

  float b = dot(texel.rgb, vec3(1.0)) / 3.0;

  // cursor spring effect
  float sinsin = sin(0.5 * v) / pow(sin(0.5 * v) * sin(0.5 * v) + 0.3, 0.5);
  vec2 style = vec2(0.5 + 0.5 * sinsin, 0.5 - 0.5 * sinsin);
  float dist = pow(1.0 - distance(style, uv), 8.0);
  vec4 springEffect = vec4(smoothstep(2.0, 0.2, distance(style, uv)) * vec3(
    1.0 * dist + pow(1.0 - min(distance(style.x - style.y, uv.x - uv.y), 1.0), 16.0),
    0.5 * dist + pow(1.0 - min(distance(style.x - style.y, uv.x - uv.y), 1.0), 32.0),
    0.2 * dist + pow(1.0 - min(distance(style.x - style.y, uv.x - uv.y), 1.0), 32.0)), 1.0);
  vec2 style2 = vec2(0.5 + 0.5 * sin(0.5 * v + 0.2), 0.5 - 0.5 * sin(0.5 * v + 0.2));
  float dist2 = pow(1.0 - distance(style2, uv), 10.0);
  vec4 springEffect2 = vec4(smoothstep(2.0, 0.2, distance(style2, uv)) * vec3(
    1.0 * dist + pow(1.0 - min(distance(style2.x - style2.y, uv.x - uv.y), 1.0), 16.0),
    0.5 * dist + pow(1.0 - min(distance(style2.x - style2.y, uv.x - uv.y), 1.0), 32.0),
    0.2 * dist + pow(1.0 - min(distance(style2.x - style2.y, uv.x - uv.y), 1.0), 32.0)), 1.0);    

  // 色の出力
  gl_FragColor = mix(texel, ret + 0.8 * (springEffect + 0.3 * springEffect2), step(b, threshold));
}`,
  },
});

const RareCardWithTimeLoop = timeLoop(({ time, tick, resolution, ...props }) => (
  <Node
    shader={shaders.RareCard}
    uniforms={{
      time: time * 0.005,
      resolution,
      ...props,
    }}
  />
));

const RareCardFilter = () => {
  const [velocity, setVelocity] = useState(0.5);
  const [threshold, setThreshold] = useState(0.5);
  const [mixRatio, setMixRatio] = useState(0.5);
  const [baseColor, setBaseColor] = useState([1.0, 1.0, 1.0]); // 初期値は白
  const [hexColor, setHexColor] = useState("#ffffff"); // 16進数での初期値
  const [image, setImage] = useState("https://i.imgur.com/uTP9Xfr.jpg");
  const [imageSize, setImageSize] = useState([480, 300]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setImageSize([img.width, img.height]);
        };
        img.src = e.target.result;
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (event) => {
    const color = event.target.value;
    setHexColor(color);

    // 16進数カラーをRGBに変換
    const r = parseInt(color.slice(1, 3), 16) / 255.0;
    const g = parseInt(color.slice(3, 5), 16) / 255.0;
    const b = parseInt(color.slice(5, 7), 16) / 255.0;

    setBaseColor([r, g, b]);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        width: "80%",
      }}
    >
      <Surface width={imageSize[0]} height={imageSize[1]}>
        <RareCardWithTimeLoop
          velocity={velocity}
          threshold={threshold}
          t={image}
          resolution={imageSize}
          baseColor={baseColor}
          mixRatio={mixRatio}
        />
      </Surface>
      <div
        style={{
          width: "80%",
          marginTop: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3>Velocity</h3>
        <Slider
          style={{ width: "80%", margin: "10px" }}
          value={velocity}
          step={0.01}
          min={0}
          max={1}
          onChange={setVelocity}
        />
        <h3>Threshold</h3>
        <Slider
          style={{ width: "80%", margin: "10px" }}
          value={threshold}
          step={0.01}
          min={0}
          max={1}
          onChange={setThreshold}
        />
        <h3>Mix Ratio</h3>
        <Slider
          style={{ width: "80%", margin: "10px" }}
          value={mixRatio}
          step={0.01}
          min={0}
          max={1}
          onChange={setMixRatio}
        />
        <h3>Base Color</h3>
        <input
          type="color"
          value={hexColor}
          onChange={handleColorChange}
          style={{ margin: "10px" }}
        />
        <input
          type="text"
          value={hexColor}
          onChange={(e) => handleColorChange(e)}
          style={{ margin: "10px", width: "80%" }}
          placeholder="#RRGGBB"
        />
        <h3>Upload Image</h3>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
    </div>
  );
};

export default RareCardFilter;