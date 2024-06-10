#version 300 es
precision highp float;
out vec4 o_color;
uniform highp float time;
uniform int ClicksSphere, ClicksBoxes;

uniform Utils
{
    vec4 CamLoc;
    vec4 CamAt;
    vec4 CamRight;
    vec4 CamUp;
    vec4 CamDir;
    vec4 ProjDistFarTimeLocal;
    vec4 TimeGlobalDeltaGlobalDeltaLocal;
    vec4 FrameW;
    vec4 FrameH;
};

float distance_from_sphere( in vec3 p, in vec3 c, float r )
{
    return length(p - c) - r;
}

float distance_from_plane( vec3 p, vec3 n, float h )
{
  return dot(p, normalize(n)) + h;
}

float distance_from_box( vec3 p, vec3 b, float r )
{
  vec3 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}

float map_the_world_sphere( in vec3 p, in vec3 c )
{
    // float displacement = sin(5.0 * p.x) * sin(5.0 * p.y) * sin(5.0 * p.z) * 0.25;
    float sphere_0 = distance_from_sphere(p, c, 1.0);

    return sphere_0;
}

float map_the_world_plane( in vec3 p )
{
    float plane_0 = distance_from_plane(p, vec3(0.0, 1.0, 0.0), 1.0);

    return plane_0;
}

float map_the_world_box( in vec3 p, in vec3 b, in vec3 c )
{
  vec3 q = abs(p - c) - b;

  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

vec3 calculate_normal_sphere(in vec3 p, in vec3 c)
{
    const vec3 small_step = vec3(0.001, 0.0, 0.0);

    float gradient_x = map_the_world_sphere(p + small_step.xyy, c) - map_the_world_sphere(p - small_step.xyy, c);
    float gradient_y = map_the_world_sphere(p + small_step.yxy, c) - map_the_world_sphere(p - small_step.yxy, c);
    float gradient_z = map_the_world_sphere(p + small_step.yyx, c) - map_the_world_sphere(p - small_step.yyx, c);

    vec3 normal = vec3(gradient_x, gradient_y, gradient_z);

    return normalize(normal);
}

vec3 calculate_normal_plane(in vec3 p)
{
    const vec3 small_step = vec3(0.001, 0.0, 0.0);

    float gradient_x = map_the_world_plane(p + small_step.xyy) - map_the_world_plane(p - small_step.xyy);
    float gradient_y = map_the_world_plane(p + small_step.yxy) - map_the_world_plane(p - small_step.yxy);
    float gradient_z = map_the_world_plane(p + small_step.yyx) - map_the_world_plane(p - small_step.yyx);

    vec3 normal = vec3(gradient_x, gradient_y, gradient_z);

    return normalize(normal);
}

vec3 calculate_normal_box(in vec3 p, in vec3 b, in vec3 c)
{
    const vec3 small_step = vec3(0.001, 0.0, 0.0);

    float gradient_x = map_the_world_box(p + small_step.xyy, b, c) - map_the_world_box(p - small_step.xyy, b, c);
    float gradient_y = map_the_world_box(p + small_step.yxy, b, c) - map_the_world_box(p - small_step.yxy, b, c);
    float gradient_z = map_the_world_box(p + small_step.yyx, b, c) - map_the_world_box(p - small_step.yyx, b, c);

    vec3 normal = vec3(gradient_x, gradient_y, gradient_z);

    return normalize(normal);
}

vec3 Shade( vec3 P, vec3 N, vec3 C ) 
{
  vec3 L = normalize(vec3(-1, 1, -3));
  vec3 LC = vec3(1, 1, 1);
  vec3 color = vec3(0);
  vec3 V = normalize(P - vec3(CamLoc.x, 0, -30.0 + CamLoc.y));

  N = faceforward(N, V, N);

  color += max(0.0, dot(N, L)) * C * LC;
  
  vec3 R = reflect(V, N);
  color += pow(max(0.0, dot(R, L)), 10.0) * vec3(0.8) * LC;
  
  return color;
}

vec3 ray_march( in vec3 ro, in vec3 rd )
{
    vec3 min_center, min_pos, color, min_side;
    float min_dist = 100000.0, minlen = 1000000.0;
    
    const int NUMBER_OF_STEPS = 512;
    const float MINIMUM_HIT_DISTANCE = 0.01;
    const float MAXIMUM_TRACE_DISTANCE = 10000.0;

    int type;

    // Sphere
    for (int j = 0; j < ClicksSphere; j++)
    {
      float total_distance_traveled = 0.0;

      vec3 c = vec3(float(j) * 3.0, 0.0, 0.0);

      for (int i = 0; i < NUMBER_OF_STEPS; ++i)
      {
          vec3 current_position = ro + total_distance_traveled * rd;

          float distance_to_closest = map_the_world_sphere(current_position, c);

          float len = length(ro - current_position);
          if (distance_to_closest < MINIMUM_HIT_DISTANCE && (distance_to_closest) < min_dist
              && len < minlen)
          {
             minlen = len;
             min_dist = distance_to_closest, min_center = c, min_pos = current_position;
             type = 0;
             color = vec3(1, 0, 0);
          }

          if (total_distance_traveled > MAXIMUM_TRACE_DISTANCE)
            break;
          total_distance_traveled += distance_to_closest;
      }
    }

    // Boxes
    for (int j = 0; j < ClicksBoxes; j++)
    {
      float total_distance_traveled = 0.0;

      vec3 c = vec3(float(j) * 3.0, 3.0, 0.0);
      vec3 side = vec3(0.6);

      for (int i = 0; i < NUMBER_OF_STEPS; ++i)
      {
          vec3 current_position = ro + total_distance_traveled * rd;
    
          float distance_to_closest = map_the_world_box(current_position, side, c);
          float len = length(ro - current_position);
    
          if (distance_to_closest < MINIMUM_HIT_DISTANCE && (distance_to_closest) < min_dist
            && len < minlen) 
          {
            minlen = len;
            min_dist = distance_to_closest, min_center = c, min_pos = current_position;
            min_side = side;
            type = 1;
            color = vec3(0.1, 0.1, 0.4);
          }
    
          if (total_distance_traveled > MAXIMUM_TRACE_DISTANCE)
          {
              break;
          }
          total_distance_traveled += distance_to_closest;
      }
    }

    if (min_dist < MINIMUM_HIT_DISTANCE) 
    {
      if (type == 0)
      {
        vec3 normal = calculate_normal_sphere(min_pos, min_center);
        vec3 light_position = vec3(2.0, -5.0, 3.0);
        vec3 direction_to_light = normalize(min_pos - light_position);
        float diffuse_intensity = max(0.0, dot(normal, direction_to_light));
        
        return Shade(min_pos, normal, color);
      }
      else
      {
        vec3 normal = calculate_normal_box(min_pos, min_side, min_center);
        vec3 light_position = vec3(2.0, -5.0, 3.0);
        vec3 direction_to_light = normalize(min_pos - light_position);
        float diffuse_intensity = max(0.0, dot(normal, direction_to_light));
        
        return Shade(min_pos, normal, color);
      }
    }

    // Plane
    float total_distance_traveled = 0.0;
    for (int i = 0; i < NUMBER_OF_STEPS; ++i)
    {
      vec3 current_position = ro + total_distance_traveled * rd;

      float distance_to_closest = map_the_world_plane(current_position);

      if (distance_to_closest < MINIMUM_HIT_DISTANCE)
      {
        min_pos = current_position;
        color = vec3(0.4, 0.6, 0.8);
        if (!bool((int(min_pos.x * 0.2) ^ int(min_pos.y * 0.2)  ^ int(min_pos.z * 0.2) ) & 1))
          color *= 0.0;

        min_dist = distance_to_closest;
        vec3 normal = vec3(0, 1, 0);

        return Shade(min_pos, normal, color);
      }
      if (total_distance_traveled > MAXIMUM_TRACE_DISTANCE)
        break;
      total_distance_traveled += distance_to_closest;
    }


    return vec3(0.0, 0.5, 0.2);
}

void main()
{
    float Wp, Hp;

    if (FrameW.w > FrameH.w)
       Hp = 1.0, Wp = FrameW.z / FrameH.z;
    else
       Wp = 1.0, Hp = FrameH.z / FrameW.z;

    vec3 A = CamDir.xyz * ProjDistFarTimeLocal.x;
    vec3 B = CamRight.xyz * ((gl_FragCoord.x + 0.5 - FrameW.z / 2.0) / FrameW.z) * Wp;
    vec3 C = CamUp.xyz * ((gl_FragCoord.y + 0.5 - FrameH.z / 2.0) / FrameH.z) * Hp;
    vec3 X = (A + B + C);

    vec3 ro = CamLoc.xyz + X;
    vec3 rd = normalize(X);

    vec3 shaded_color = ray_march(ro, rd);

    o_color = vec4(shaded_color, 1.0);
}
