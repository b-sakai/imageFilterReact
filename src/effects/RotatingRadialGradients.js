//@flow
import React, { useState } from "react";
import { Shaders, Node, GLSL } from "gl-react";
import { Surface } from "gl-react-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import timeLoop from "./timeLoop";

const shaders = Shaders.create({
  gradients: { frag: GLSL`
precision highp float;
varying vec2 uv;
uniform vec4 colors[3];
uniform vec2 particles[3];
uniform sampler2D t;
uniform float threshold, velocity, time;

void main () {
  vec4 baseImage = texture2D(t, uv);
  vec4 sum = vec4(0.0);
  for (int i=0; i<3; i++) {
    vec4 c = colors[i];
    vec2 p = particles[i];
    float d = c.a * smoothstep(0.6, 0.2, distance(p, uv));
    sum += d * vec4(c.a * c.rgb, c.a);
  }
  if (sum.a > 1.0) {
    sum.rgb /= sum.a;
    sum.a = 1.0;
  }
  float b = dot(baseImage.rgb, vec3(1.0)) / 3.0;
  vec4 effectColor = vec4(sum.a * sum.rgb, 1.0);
  gl_FragColor = mix(baseImage, effectColor, step(b, threshold));
}
`}
});

const Gradients = ({ time, threshold, velocity, t }) =>
  <Node
    shader={shaders.gradients}
    uniforms={{
      colors: [
        [ Math.cos(0.002 * time), Math.sin(0.002 * time), 0.2, 1 ],
        [ Math.sin(0.002 * time), -Math.cos(0.002 * time), 0.1, 1 ],
        [ 0.3, Math.sin(3 + 0.002 * time), Math.cos(1 + 0.003 * time), 1 ]
      ],
      particles: [
        [ 0.3, 0.3 ],
        [ 0.7, 0.5 ],
        [ 0.4, 0.9 ]
      ],
      threshold,
      velocity,
      time,
      t
    }}
  />;

const GradientsLoop = timeLoop(Gradients);

export default () => {
  const [threshold, setThreshold] = useState(0.5);
  const [velocity, setVelocity] = useState(0.5);
  const [image, setImage] = useState("https://i.imgur.com/uTP9Xfr.jpg"); // Default image

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
      <Surface width={300} height={300}>
        <GradientsLoop threshold={threshold} velocity={velocity} t={image} />
      </Surface>
      <div style={{ width: "80%", marginTop: "20px" }}>
        <h3>Threshold</h3>
        <Slider
          value={threshold}
          step={0.01}
          min={0}
          max={1}
          onChange={setThreshold}
          style={{ marginBottom: "20px" }}
        />
        <h3>Velocity</h3>
        <Slider
          value={velocity}
          step={0.01}
          min={0}
          max={1}
          onChange={setVelocity}
          style={{ marginBottom: "20px" }}
        />
        <h3>Upload Image</h3>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
    </div>
  );
};