precision mediump float;

// our texture
uniform sampler2D u_image;
uniform sampler2D u_bullet;
uniform vec2 u_target_pos;

// // the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;

void main() {

  vec2 balanced = v_texCoord - u_target_pos;

  vec2 normalized = normalize(balanced);
  float distance = length(balanced);
  // The strength of the gravitational field at this point:
  float scaled = distance * 400.0;
  float strength = 1.0 / ( scaled * scaled );
  vec3 rayDirection = vec3(0,0,1);
  vec3 surfaceNormal = normalize( vec3(normalized, 1.0/strength) ); // normalized
  vec3 newBeam = refract(rayDirection, surfaceNormal, 2.6);
  vec2 newPos = v_texCoord + vec2( newBeam.x, newBeam.y)*100.0;
  vec4 out_color = texture2D(u_image, newPos);
  out_color *= length(newBeam);

  vec4 orig_color = texture2D(u_image, v_texCoord);


  if (distance < 0.5)
  {
    vec4 bullet_strength = texture2D(u_bullet, v_texCoord - u_target_pos + vec2(0.5, 0.5));

    vec3 effect_color = bullet_strength.r * out_color.rgb;
    gl_FragColor = vec4(orig_color.rgb * (1.0-bullet_strength.a) + effect_color * bullet_strength.a, 1.0);
  }
  else
  {
    gl_FragColor = orig_color;
  }


  // gl_FragColor = vec4(bullet_strength * out_color.rgb + orig_color.rgb * (1.0-bullet_strength), 1.0);
  // gl_FragColor = vec4(orig_color.rgb * bullet_strength, 1.0);

  // if (length(v_texCoord - u_target_pos) < 0.06)
  // {
  //   gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  //   // gl_FragColor = texture2D(u_image, v_texCoord);
  // }
  // else
  // {
  //   gl_FragColor = vec4(out_color.rgb, 1.0);
  // }
}