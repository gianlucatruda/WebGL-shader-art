# WebGL-shader-art

I wanted to be able to make WebGL/GLSL shader art projects in a quick and modular way like [shadertoy.com](https://www.shadertoy.com/), but be able to run locally and deploy how I choose.

With some ChatGPT help, I made this vanilla web app. It's just a super simple page with a dynamically-resizing canvas which gets set up to run WebGL. Whatever you put in `fragmentShader.glsl` and `vertexShader.glsl` get's used to draw the contents of the canvas, with high-DPI support and live resizing.

<img width="1000" alt="examples" src="https://github.com/user-attachments/assets/692203de-0140-4b0e-9413-5ac42a9a6dec">

I mimicked the Shadertoy API, so any straightforward shaders (with no assets) from there can be copy-pasted to and from this project in the `fragmentShader.glsl` file:

```glsl

precision mediump float;
uniform vec2 iResolution; // viewport resolution (in pixels)
uniform float iTime; // shader playback time (in seconds)
uniform vec2 iMouse; // mouse pixel coords. xy: current (if MLB down), zw: click

// Shadertoy default code
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord / iResolution.xy;
    // Time varying pixel color
    vec3 col = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0, 2, 4));
    // Output to screen
    fragColor = vec4(col, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
```

You can easily serve this project with just about any simple server. I like using `npx live-server` to have live reloading when I modify any files.


