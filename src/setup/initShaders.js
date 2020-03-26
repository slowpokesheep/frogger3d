import vert from '../shaders/shader.vert';
import frag from '../shaders/shader.frag';

// Initialize shaders from src file
export default async function initShaders(gl, files) {

  const program = gl.createProgram();
  const shaderFile = []; // Promise waits on read
  const shaders = []; // Promise waits on shader construction

  // (?: ) = non-capturing group
  // Get file extension
  const re = /(?:\.([^.]+))?$/;

  // Read the files
  /*
  files.forEach((f) => {
    shaderFile.push(readScript(f));
  });
  */
  shaderFile.push(vert);
  shaderFile.push(frag);

  // Wait for the files
  const sf = await Promise.all(shaderFile);

  // Initalize shaders according to type
  sf.forEach((shader, i) => {
    if (re.exec(files[i])[1] === 'vert') {
      shaders.push(createShader(gl, shader, gl.VERTEX_SHADER));
    }
    else if (re.exec(files[i])[1] === 'frag') {
      shaders.push(createShader(gl, shader, gl.FRAGMENT_SHADER));
    }
  });

  // Wait for the shaders
  const s = await Promise.all(shaders);

  // Attach shaders to the program
  s.forEach((shader) => {
    gl.attachShader(program, shader);
  });

  gl.linkProgram(program);
  return program;
}

// Create a shader
function createShader(gl, source, type) {
  return new Promise((resolve, reject) => {

    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // Error creating shader
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      reject(gl.getShaderInfoLog(shader));
    }

    resolve(shader);
  });
}

// Read shader file
function readScript(shader) {
  return new Promise((resolve, reject) => {

    const xhr = new XMLHttpRequest();
    xhr.open('GET', shader);

    // Loaded
    xhr.onload = () => {
      if (xhr.status === 200) resolve(xhr.responseText);
      else reject(xhr.statusText);
    };

    // Error
    xhr.onerror = () => {
      console.error(xhr.statusText);
      reject(xhr.statusText);
    };

    xhr.send();
  });
}
