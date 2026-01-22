export const vertex = `
varying vec2 vUv;
void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragment = `
varying vec2 vUv;
uniform sampler2D uTexture;

void main(){
    vec4 texture = texture2D(uTexture, vUv);
    gl_FragColor = texture;
}
`;
