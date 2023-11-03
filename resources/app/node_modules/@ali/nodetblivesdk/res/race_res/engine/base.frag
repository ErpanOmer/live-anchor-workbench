#ifdef GL_ES
precision highp float;
#endif
varying vec2 vTextureCo;
uniform sampler2D uTexture;

void main() {
    gl_FragColor = texture2D( uTexture, vTextureCo);
}
