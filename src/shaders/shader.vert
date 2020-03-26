// Each point has a position and color
attribute vec4 vPosition;
attribute vec4 vColor;

// Transformation matrices
uniform mat4 modelView;
uniform mat4 view;
uniform mat4 projection;

// Pass the color attribute down to the fragment shader
varying vec4 fColor;

void main() {
  fColor = vColor;
  gl_Position = projection * view * modelView * vPosition;
}