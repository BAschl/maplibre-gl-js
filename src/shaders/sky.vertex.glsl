attribute vec2 a_pos;

uniform float gradientTopPadding;
uniform float gradientProportion;

varying vec2 v_texture_pos;
varying float v_depth;

void main() {
    v_texture_pos = a_pos * 0.5;
    v_texture_pos.y = (v_texture_pos.y + 0.5) * gradientProportion + gradientTopPadding;
    gl_Position = vec4(a_pos, 0.99999, 1.0);
    v_depth = gl_Position.z;
}
