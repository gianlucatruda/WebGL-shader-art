console.log("Main.js");

async function fetchShader(url) {
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(`Failed to fetch shader: ${res.statusText}`);
	}
	return await res.text();
}

async function init() {
	const canvas = document.getElementById('myCanvas');
	const gl = canvas.getContext('webgl');
	if (!gl) {
		alert('WebGL not supported by this browser.');
		return;
	}

	const vertexShaderSource = await fetchShader('vertexShader.glsl');
	const fragmentShaderSource = await fetchShader('fragmentShader.glsl');

	function createShader(gl, type, source) {
		const shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
			gl.deleteShader(shader);
			return null;
		}
		return shader;
	}

	const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

	const program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error(`Unable to initialize the shader program: ${gl.getProgramInfoLog(program)}`);
		gl.deleteProgram(program);
		return;
	}
	gl.useProgram(program);

	const vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	const vertices = new Float32Array([
		-1.0, -1.0,
		1.0, -1.0,
		-1.0, 1.0,
		1.0, 1.0
	]);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
	gl.enableVertexAttribArray(positionAttributeLocation);
	gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

	const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
	gl.uniform2f(resolutionUniformLocation, gl.drawingBufferWidth, gl.drawingBufferHeight);

	const timeUniformLocation = gl.getUniformLocation(program, 'u_time');

	function render(time) {
		gl.uniform1f(timeUniformLocation, time * 0.001);  // time in seconds

		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);
}

window.onload = init;
