uniform sampler2D u_texture;

uniform float curvature;
uniform float skyHorizon;

varying vec2 v_texture_pos;

void main() {
  float y = v_texture_pos.y;

  //if y is above the horizon it should curve from the bottom, else from the top
  //so the actual texture pos should be 1-y or y
  float isYAboveSkyHorizon = max(sign(y - skyHorizon), 0.0);
  float ySign = sign(skyHorizon - y);

  float curvedY = length(vec2(v_texture_pos.x * curvature, isYAboveSkyHorizon + ySign * y));
  //clip to horizon if inbeetween "upper and lower" horizon
  curvedY = min(curvedY, isYAboveSkyHorizon + ySign * skyHorizon);
  gl_FragColor = vec4(texture2D(u_texture, vec2(isYAboveSkyHorizon + ySign * curvedY, 0)).rgb, 1);

}