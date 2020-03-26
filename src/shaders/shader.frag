precision mediump float;

uniform vec4 fragCol;
uniform vec4 fragAlpha;

varying vec4 fColor;

void main() {
  vec4 color = fColor;
  vec4 check = vec4(0, 0, 0, 0);

  if (fragCol != check) color = fragCol;
  else if (fragAlpha.a != check.a) color.a = fragAlpha.a;
  else color = fColor;
  
  gl_FragColor = color;
}