/* eslint-disable @typescript-eslint/quotes */
import {PosArray, TriangleIndexArray} from '../data/array_types.g';
import posAttributes from '../data/pos_attributes';
import Style from '../style/style';
import VertexBuffer from '../gl/vertex_buffer';
import IndexBuffer from '../gl/index_buffer';
import SegmentVector from '../data/segment';
import Context from '../gl/context';
import {SkySpecification} from '../style-spec/types.g';
import {renderColorRamp} from '../util/color_ramp';
import {createPropertyExpression} from '../style-spec/expression';
import styleSpec from '../style-spec/reference/latest';
import {StylePropertySpecification} from '../style-spec/style-spec';
import Texture from './texture';
import {RGBAImage} from '../util/image';

const DEFAULT_CURVATURE = 17;
const DEFAULT_VERTICAL_FOV = 90;
const DEFAULT_ZOOM_CURVATURE_INFLUENCE = 3;
const DEFAULT_ZOOM_FOV_INFLUENCE = 2;
const DEFAULT_SKY_HORIZON = 0.65;
const DEFAULT_SKY_GRADIENT =    "'sky-gradient':" +
                                "['interpolate', " +
                                "['linear'], " +
                                "['sky-height'], " +
                                "0, 'black'," +
                                "0.25, '#77BADF'," +
                                "0.48, '#87CAEF'," +
                                "0.51, '#87CAEF'," +
                                "0.57, '#0D4189'," +
                                "0.7, '#022454'," +
                                "1, '#022454']";

export default class Sky {
    style: Style;

    vertexBuffer: VertexBuffer;
    indexBuffer: IndexBuffer;
    segments: SegmentVector;

    gradientTexture: Texture;
    gradientImage: RGBAImage;

    curvature: number;
    verticalFOV: number;
    zoomCurvatureInfluence: number;
    zoomFOVInfluence: number;
    skyHorizon: number;

    constructor(context :Context, skySpecification : SkySpecification) {
        if (!skySpecification)
            return undefined;

        const skyGradient = (skySpecification['sky-gradient'] != null ? skySpecification['sky-gradient'] : DEFAULT_SKY_GRADIENT) as any as StylePropertySpecification;
        const expression = createPropertyExpression(skyGradient, styleSpec.sky['sky-gradient']);
        if (expression.result === 'error') throw new Error(`Error while parsing Sky-Gradient :${expression.value}`);

        const vertexArray = new PosArray();
        vertexArray.emplaceBack(-1, -1);
        vertexArray.emplaceBack(1, -1);
        vertexArray.emplaceBack(1, 1);
        vertexArray.emplaceBack(-1, 1);

        const indexArray = new TriangleIndexArray();
        indexArray.emplaceBack(0, 1, 2);
        indexArray.emplaceBack(0, 2, 3);

        this.vertexBuffer = context.createVertexBuffer(vertexArray, posAttributes.members);
        this.indexBuffer = context.createIndexBuffer(indexArray);
        this.segments = SegmentVector.simpleSegment(0, 0, vertexArray.length, indexArray.length);

        if (!this.gradientImage) {
            this.gradientImage = renderColorRamp({
                expression: expression.value,
                evaluationKey: 'skyHeight',
                resolution: 256
            });
        }

        this.curvature = (skySpecification.curvature != null ? skySpecification.curvature : DEFAULT_CURVATURE) / 100;
        this.verticalFOV = (skySpecification.verticalFOV != null ? skySpecification.verticalFOV : DEFAULT_VERTICAL_FOV) / 180;
        this.zoomCurvatureInfluence = skySpecification.zoomCurvatureInfluence != null ? skySpecification.zoomCurvatureInfluence : DEFAULT_ZOOM_CURVATURE_INFLUENCE;
        this.zoomFOVInfluence = skySpecification.zoomFOVInfluence != null ? skySpecification.zoomFOVInfluence : DEFAULT_ZOOM_FOV_INFLUENCE;
        this.skyHorizon = skySpecification.skyHorizon != null ? skySpecification.skyHorizon : DEFAULT_SKY_HORIZON;
    }

}
