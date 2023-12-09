export const vRemap = /* glsl*/ `
float vRemap(float value, float min, float max, float newMin, float newMax) {
  return newMin + (newMax - newMin) * (value - min) / (max - min);
}
`;
export const pNormalA = /* glsl*/ `
vec2 dHdxy_fwd(vec2 uv, sampler2D map, float scale) {
  float scaledBumpScale = scale / 10.0;
  vec2 dSTdx = dFdx( uv );
  vec2 dSTdy = dFdy( uv );
  float Hll = scaledBumpScale * texture2D( map, uv ).x;
  float dBx = scaledBumpScale * texture2D( map, uv + dSTdx ).x - Hll;
  float dBy = scaledBumpScale * texture2D( map, uv + dSTdy ).x - Hll;
  return vec2( dBx, dBy );
}
vec3 pNormalA( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy ) {
  vec3 vSigmaX = dFdx( surf_pos );
  vec3 vSigmaY = dFdy( surf_pos );
  vec3 vN = surf_norm;		// normalized
  vec3 R1 = cross( vSigmaY, vN );
  vec3 R2 = cross( vN, vSigmaX );
  float fDet = dot( vSigmaX, R1 );
  vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
  return normalize( abs( fDet ) * surf_norm - vGrad );
}
`;
export const aRc = /* glsl*/`
float aRc( float x, float factor ) {
  return ( 1.0 - factor / (x + factor) ) * (factor + 1.0);
}
`;

/* https://www.shadertoy.com/view/XsX3zB */
export const noise = /* glsl*/`
vec3 random3(vec3 c) {
	float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
	vec3 r;
	r.z = fract(512.0*j);
	j *= .125;
	r.x = fract(512.0*j);
	j *= .125;
	r.y = fract(512.0*j);
	return r-0.5;
}
/* skew constants for 3d simplex functions */
const float SIMPLEX_NOISE_F3 =  0.3333333;
const float SIMPLEX_NOISE_G3 =  0.1666667;
/* 3d simplex noise */
float simplex3d(vec3 p) {
	 /* 1. find current tetrahedron T and it's four vertices */
	 /* s, s+i1, s+i2, s+1.0 - absolute skewed (integer) coordinates of T vertices */
	 /* x, x1, x2, x3 - unskewed coordinates of p relative to each of T vertices*/
	 /* calculate s and x */
	 vec3 s = floor(p + dot(p, vec3(SIMPLEX_NOISE_F3)));
	 vec3 x = p - s + dot(s, vec3(SIMPLEX_NOISE_G3));
	 
	 /* calculate i1 and i2 */
	 vec3 e = step(vec3(0.0), x - x.yzx);
	 vec3 i1 = e*(1.0 - e.zxy);
	 vec3 i2 = 1.0 - e.zxy*(1.0 - e);
	 	
	 /* x1, x2, x3 */
	 vec3 x1 = x - i1 + SIMPLEX_NOISE_G3;
	 vec3 x2 = x - i2 + 2.0*SIMPLEX_NOISE_G3;
	 vec3 x3 = x - 1.0 + 3.0*SIMPLEX_NOISE_G3;
	 
	 /* 2. find four surflets and store them in d */
	 vec4 w, d;
	 
	 /* calculate surflet weights */
	 w.x = dot(x, x);
	 w.y = dot(x1, x1);
	 w.z = dot(x2, x2);
	 w.w = dot(x3, x3);
	 
	 /* w fades from 0.6 at the center of the surflet to 0.0 at the margin */
	 w = max(0.6 - w, 0.0);
	 
	 /* calculate surflet components */
	 d.x = dot(random3(s), x);
	 d.y = dot(random3(s + i1), x1);
	 d.z = dot(random3(s + i2), x2);
	 d.w = dot(random3(s + 1.0), x3);
	 
	 /* multiply d by w^4 */
	 w *= w;
	 w *= w;
	 d *= w;
	 
	 /* 3. return the sum of the four surflets */
	 return dot(d, vec4(52.0));
}

/* const matrices for 3d rotation */
const mat3 rot1 = mat3(-0.37, 0.36, 0.85,-0.14,-0.93, 0.34,0.92, 0.01,0.4);
const mat3 rot2 = mat3(-0.55,-0.39, 0.74, 0.33,-0.91,-0.24,0.77, 0.12,0.63);
const mat3 rot3 = mat3(-0.71, 0.52,-0.47,-0.08,-0.72,-0.68,-0.7,-0.45,0.56);

/* directional artifacts can be reduced by rotating each octave */
float simplex3d_fractal(vec3 m) {
    return   0.5333333*simplex3d(m*rot1)
			+0.2666667*simplex3d(2.0*m*rot2)
			+0.1333333*simplex3d(4.0*m*rot3)
			+0.0666667*simplex3d(8.0*m);
}
`;

export const vertexShader = /*glsl*/ `
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 wPos;
void main() {
  vUv = uv;
  vNormal = normal;
  wPos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShader = /*glsl*/ `
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 wPos;
uniform vec3 control;
const float pi = 3.141592653;
uniform sampler2D day;
uniform sampler2D night;
uniform sampler2D cloud;
uniform float uTime;
${vRemap}
${pNormalA}
${aRc}
${noise}
float autoClamp(float value) {
  return clamp(value, 0.0, 1.0);
}

void main() {

  vec3 vControl = normalize(control);
  vec3 normal = normalize(vNormal);
  vec3 vDirection = normalize(cameraPosition - wPos);
  float dTC = length(cameraPosition - wPos);
  vec3 result = vec3(0.0);
  vec3 Color = texture2D(day, vUv).rgb;
  float rawLF = dot(normal, vControl);
  float lambertFactor = autoClamp(rawLF);
  float rawSLF = vRemap(rawLF, -0.1, 0.1, 0.0, 1.0);
  float sLF = autoClamp(rawSLF);
  result = Color * sLF;
  vec3 nColor = texture2D(night, vUv).rgb;
  float nightLightsFactor = autoClamp(vRemap(rawSLF, 0.0, 0.15, 0.0, 1.0));
  nColor = nColor * (1.0 - nightLightsFactor);
  result += nColor;
  float rotation = uTime * 0.005;
  vec3 wPosOffset = wPos * mat3( cos(rotation), 0, sin(rotation), 0, 1, 0, -sin(rotation), 0, cos(rotation) );
  float noiseFactor = vRemap(simplex3d_fractal(wPosOffset * 100.0), -1.0, 1.0, 0.0, 1.0);
  float distanceFactor = autoClamp(
    - dTC + 1.0
  );
  noiseFactor = noiseFactor * 0.5 * distanceFactor;
  float cFactor = length(texture2D(cloud, vUv).rgb);
  float cNF = clamp(vRemap(cFactor, 0.0, 0.5, 0.5, 1.0) * noiseFactor, 0.0, 1.0);
  cFactor = clamp(cFactor - cNF, 0.0, 1.0);
  vec3 cloudc = vec3(0.9);
  float cNScale = 0.01;
  vec3 cloudNormal = pNormalA( wPos, normal, dHdxy_fwd(vUv, cloud, cNScale) );
  float cNFactor = dot(cloudNormal, vControl);
  float cSF = clamp(
    vRemap(cNFactor, 0.0, 0.3, 0.3, 1.0),
    0.3, 1.0
  );
  cSF = aRc(cSF, 0.5);
  cloudc *= cSF;
  float sunsetF = clamp(vRemap(rawSLF, -0.1, 0.85, -1.0, 1.0), -1.0, 1.0);
  sunsetF = cos(sunsetF * pi) * 0.5 + 0.5;
  vec3 sunsetColor = vec3(0.525, 0.273, 0.249);
  float sunsetcFactor = pow(cFactor, 1.5) * sunsetF;
  cloudc *= clamp(sLF, 0.1, 1.0);
  cloudc = mix(cloudc, sunsetColor, sunsetcFactor);

  result = mix(result, cloudc, cFactor);
  float fresnelBias = 0.1;
  float fresnelScale = 0.5;
  float fresnelFactor = fresnelBias + fresnelScale * pow(1.0 - dot(normal, normalize(vDirection)), 3.0);
  vec3 athmosphereColor = vec3(0.51,0.714,1.);
  vec3 athmosphereSunsetColor = vec3(1.0, 0.373, 0.349);
  float fresnelsunsetF = dot(-vControl, vDirection);
  fresnelsunsetF = vRemap(fresnelsunsetF, 0.97, 1.0, 0.0, 1.0);
  fresnelsunsetF = autoClamp(fresnelsunsetF);
  athmosphereColor = mix(athmosphereColor, athmosphereSunsetColor, fresnelsunsetF);
  result = mix(result, athmosphereColor, fresnelFactor * sLF);
  result = clamp(result * 0.9, 0.0, 0.7);
  gl_FragColor = vec4(vec3(result), 1.0);
}

`;

