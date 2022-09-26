/* eslint-disable camelcase */
import {Uniform1i, Uniform1f} from '../uniform_binding';
import type Context from '../../gl/context';
import type {UniformValues, UniformLocations} from '../../render/uniform_binding';

export type SkyUniformsType = {
    u_texture: Uniform1i;
    gradientProportion: Uniform1f;
    gradientTopPadding: Uniform1f;
    curvature: Uniform1f;
    skyHorizon:Uniform1f;
};

const skyUniforms = (context: Context, locations: UniformLocations): SkyUniformsType => ({
    u_texture: new Uniform1i(context, locations.u_texture),
    gradientProportion: new Uniform1f(context, locations.gradientProportion),
    gradientTopPadding: new Uniform1f(context, locations.gradientTopPadding),
    curvature: new Uniform1f(context, locations.curvature),
    skyHorizon: new Uniform1f(context, locations.skyHorizon)
});

const skyUniformValues = (gradientProportion: number, gradientTopPadding: number, curvature: number, skyHorizon: number): UniformValues<SkyUniformsType> => ({
    u_texture: 0,
    gradientProportion,
    gradientTopPadding,
    curvature,
    skyHorizon
});

export {skyUniforms, skyUniformValues};
