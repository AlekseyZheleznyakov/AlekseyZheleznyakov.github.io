function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
    let buf = gl.getShaderInfoLog(shader);
    console.log(buf);
  }
  return shader;
}

function initGL() {
  const canvas = document.getElementById("myCan");
  const gl = canvas.getContext("webgl2");

  gl.clearColor(0.6, 0.1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const vs = `#version 300 es
      in highp vec4 in_pos;
      
      void main() {
          gl_Position = in_pos;
      }
  `;

  const fs = `#version 300 es
      out highp vec4 o_color;

      uniform highp float time;

      highp vec2 CmplSet( highp float a, highp float b )
      {
        highp vec2 res;

        res.x = a;
        res.y = b;

        return res;
      }

      highp vec2 CmplAddCmpl( highp vec2 a, highp vec2 b )
      {
        highp vec2 res;

        res.x = a.x + b.x;
        res.y = a.y + b.y;

        return res;
      }

      highp vec2 CmplMulCmpl( highp vec2 a, highp vec2 b )
      {
        highp vec2 res;

        res.x = a.x * b.x - a.y * b.y;
        res.y = a.x * b.y + b.x * a.y;

        return res;
      }


      highp float CmplNorm2( highp vec2 a )
      {
        highp float res;

        res = a.x * a.x + a.y * a.y;

        return res;
      }

      highp float Mandelbrot( highp vec2 Z )
      {
        highp float n = 0.0;
        highp vec2 Z0 = Z;

        while (n < 255.0 && CmplNorm2(Z) < 4.0)
        {
          Z = CmplAddCmpl(CmplMulCmpl(Z, Z), Z0);
          n = n + 1.0;
        }

        return n;
      }

      highp float Julia( highp vec2 Z )
      {
        highp float n = 0.0;
        highp vec2 C = CmplSet(0.35 + 0.08 * sin(time + 3.0), 0.39 + 0.08 * sin(1.1 * time));

        while (n < 255.0 && CmplNorm2(Z) < 4.0)
        {
          Z = CmplAddCmpl(CmplMulCmpl(Z, Z), C);
          n = n + 1.0;
        }
        return n;
      }

      void main() {
        highp float n = 0.0, x0 = -2.0, x1 = 2.0, y0 = -2.0, y1 = 2.0;
        highp float a, b;
        highp vec2 Z;

        a = x0 + gl_FragCoord.x * (x1 - x0) / 700.0;
        b = y0 + gl_FragCoord.y * (y1 - y0) / 700.0;
        Z = CmplSet(a, b);
        n = Julia(Z);
        
        //  Z = CmplSet(x0 + gl_FragCoord.x * (x1 - x0) / 700.0, y0 + gl_FragCoord.y * (y1 - y0) / 700.0);
        //  n = Mandelbrot(Z);

        o_color = vec4(n / 255.0, n / 8.0 / 255.0, n * 8.0 / 255.0, 1);
      }
  `;

  const vertexSh = loadShader(gl, gl.VERTEX_SHADER, vs);
  const fragmentSh = loadShader(gl, gl.FRAGMENT_SHADER, fs);

  const start = Date.now();
  const program = gl.createProgram();
  gl.attachShader(program, vertexSh);
  gl.attachShader(program, fragmentSh);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      alert("!!!!");
  }
  const pos = [-1, 1, 0, 1,   
               -1, -1, 0, 1,
               1, 1, 0, 1,
               1, -1, 0, 1];
                     

  const render = () => {
    const posLoc = gl.getAttribLocation(program, "in_pos");
    const posBuf = gl.createBuffer();

    const timeFromStart = Date.now() - start;
    const loc = gl.getUniformLocation(program, "time");
    gl.uniform1f(loc, timeFromStart / 1000.0);

    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
    gl.vertexAttribPointer(posLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posLoc);
    gl.useProgram(program);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    window.requestAnimationFrame(render);
  }

  render();
  
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

window.addEventListener("load", () => {
  initGL();
  }
);