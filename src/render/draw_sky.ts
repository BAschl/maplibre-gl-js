import StencilMode from '../gl/stencil_mode';
import DepthMode from '../gl/depth_mode';
import CullFaceMode from '../gl/cull_face_mode';
import {skyUniformValues} from './program/sky_program';
import type Painter from './painter';
import Sky from './sky';
import Texture from './texture';
import Transform from '../geo/transform';

export default drawSky;

function drawSky(painter: Painter, sky: Sky) {
    if (!sky || !painter) return;
    const context = painter.context;
    const gl = context.gl;

    const gradientTexture = sky.gradientTexture;
    if (gradientTexture) {
        sky.gradientTexture.update(sky.gradientImage);
    } else {
        sky.gradientTexture = new Texture(context, sky.gradientImage, gl.RGBA);
    }

    const skyUniforms = calculateSkyUniforms(painter.transform, sky);

    const depthMode = new DepthMode(gl.LEQUAL, DepthMode.ReadWrite, [0, 1]);
    const stencilMode = StencilMode.disabled;
    const colorMode = painter.colorModeForRenderPass();
    const program = painter.useProgram('sky');

    context.activeTexture.set(gl.TEXTURE0);
    sky.gradientTexture.bind(gl.LINEAR, gl.CLAMP_TO_EDGE);

    program.draw(context, gl.TRIANGLES, depthMode, stencilMode, colorMode,
        CullFaceMode.disabled, skyUniforms, undefined, 'sky', sky.vertexBuffer,
        sky.indexBuffer, sky.segments);
}

function calculateSkyUniforms(transform: Transform, sky: Sky) {
    //get the center of the current view (pitch) in clip space and transform from clip space to texture space
    const pitchClipSpace = Math.cos(transform.pitch / 180 * Math.PI);
    const pitchTextureSpace = 1 - (pitchClipSpace + 1) / 2;

    const zoomRatio =  1 / (1 + ((transform.zoom - transform.minZoom) / (transform.maxZoom - transform.minZoom)));
    const verticalHalfFOV = sky.verticalFOV / 2 * Math.pow(zoomRatio, sky.zoomFOVInfluence);
    const curvature = sky.curvature * (transform.width / transform.height) * Math.pow(zoomRatio, sky.zoomCurvatureInfluence);

    const gradientTopPadding = pitchTextureSpace - verticalHalfFOV;
    //how much of the gradient is currently visible depending on fov and zoom
    const gradientProportion = verticalHalfFOV * 2;

    const uniformValues = skyUniformValues(gradientProportion, gradientTopPadding, curvature, sky.skyHorizon);
    return uniformValues;
}
