precision mediump float;

// Bloom filter
// http://myheroics.wordpress.com/2008/09/04/glsl-bloom-shader/
//
// Spooner: Added uniforms for setting bloom intensity.

uniform sampler2D in_Texture; // Original in_Texture.
varying vec2 var_TexCoord; // Pixel to process on this pass

uniform float in_GlareSize; // 0.004 is good
uniform float in_Power; // 0.25 is good

void main()
{
    vec4 sum = vec4(0);

    for(int i = -6; i < 6; i++)
    {
        for (int j = -5; j < 5; j++)
        {
            vec4 t = texture2D(in_Texture, var_TexCoord + vec2(j, i) * in_GlareSize);
            sum += t * in_Power * t.a;
        }
    }

    vec4 base_color = texture2D(in_Texture, var_TexCoord);
    vec4 bloomed;

    if (base_color.a == 0.0) {
    if (base_color.r < 0.3)
    {
        bloomed = sum * sum * 0.012 + base_color;
    }
    else if(base_color.r < 0.5)
    {
        bloomed = sum * sum * 0.009 + base_color;
    }
    else
    {
        bloomed = sum * sum * 0.0075 + base_color;
    }
    gl_FragColor = bloomed;
    // gl_FragColor = vec4(bloomed.rgb, base_color.a);
    }
    else
    {
    gl_FragColor = base_color;

    }
}