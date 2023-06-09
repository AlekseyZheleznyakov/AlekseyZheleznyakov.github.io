import { prim } from "./prim.js";
import { vec3, mat4, camera } from "./mth.js";

let gl;
export { gl };

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Shader not compiled!")
    }

    return shader;
}

export function initGL() {
    const canvas = document.getElementById("glCanvas");
    gl = canvas.getContext("webgl2");

    // gl.clearColor(0.514, 0.302, 0.094, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Code below you may delete for test

    const vs = `#version 300 es
        precision highp float;
        layout(location = 0) in vec4 in_pos;
        layout(location = 1) in vec4 in_color;
        uniform mat4 matrWVP;
        out vec4 v_color;

        void main() {
            gl_Position = matrWVP * in_pos;
            v_color = in_color;
        }
    `;

    const fs = `#version 300 es
        precision highp float;
        out vec4 f_color;
        in vec4 v_color;

        void main() {
            f_color = v_color;
        }
    `;

    const vertexSh = loadShader(gl, gl.VERTEX_SHADER, vs);
    const fragmentSh = loadShader(gl, gl.FRAGMENT_SHADER, fs);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexSh);
    gl.attachShader(shaderProgram, fragmentSh);
    gl.linkProgram(shaderProgram);

    const vBuf = gl.createBuffer();

    let dataBuf =   [
         0.0, 0.0, 0.0, 1.0, 1.0, 0.5, 1.0,
         1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
         1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0,
         0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0,
         0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0,
         1.0, 0.0, 1.0,  0.0, 0.0, 1.0, 1.0,
         0.0, 1.0, 1.0,  0.0, 1.0, 0.0, 1.0,
         1.0, 1.0, 1.0,  0.0, 1.0, 1.0, 1.0,
        ];

    let ind = [
        0, 1, 2,
        0, 3, 2,

        0, 3, 6, 
        0, 4, 6, 
                           
        6, 3, 2,
        6, 7, 2,
        
        4, 5, 0, 
        0, 1, 5,

        5, 7, 2, 
        5, 1, 2,        

        4, 6, 7, 
        4, 5, 7,
    ];

    let datapyramid =   [
        // offset by +1.1y
        0.0, 1.1, 0.0, 1.0, 1.0, 0.5, 1.0,
        0.5, 1.1, 1.0, 1.0, 0.0, 1.0, 1.0,
        1.0, 1.1, 0.0, 0.0, 0.0, 1.0, 1.0,
        0.5, 2.1, 0.5, 0.0, 1.0, 1.0, 1.0,
       ];

   let indpyramid = [
       0, 1, 2,
       0, 1, 3,
       1, 2, 3,
       0, 2, 3, 
   ];

   let dataoktahedron =   [
        // offset by -1.5x
        // Top
        -1.0, 1.5, 0.5, 1.0, 1.0, 0.5, 1.0,

        // Middle
        -1.5, 0.5, 0.0, 1.0, 0.0, 1.0, 1.0,
        -0.5, 0.5, 0.0, 0.0, 0.0, 1.0, 1.0,
        -1.5, 0.5, 1.0, 0.0, 1.0, 1.0, 1.0,
        -0.5, 0.5, 1.0, 0.0, 1.0, 1.0, 1.0,

        // Bottom
        -1.0, -0.5, 0.5, 1.0, 1.0, 0.5, 1.0,
   ];

    let indoktahedron = [
        // Top
        0, 1, 2,
        0, 1, 3,
        0, 2, 4,
        0, 3, 4,

        // Bottom
        5, 1, 2,
        5, 1, 3,
        5, 2, 4,
        5, 3, 4,
    ];

    let cam = new camera();
    cam.resize(500, 500);
    cam.camSet(new vec3(20, 20, 30), new vec3(0, 0, 0), new vec3(0, 1, 0));
    let pr1 = new prim(gl.TRIANGLES, datapyramid, 4, indpyramid, 12, shaderProgram);
    let pr2 = new prim(gl.TRIANGLES, dataBuf, 8, ind, 36, shaderProgram);
    let pr3 = new prim(gl.TRIANGLES, dataoktahedron, 6, indoktahedron, 24, shaderProgram);
    let m = new mat4();
    let rotcube = 0;

    const render = () => {
        // gl.clearColor(0.514, 0.302, 0.094, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        pr1.draw((m.scale(new vec3(7, 7, 7)).mul(m.rotateY(rotcube))), cam);
        pr2.draw((m.scale(new vec3(7, 7, 7)).mul(m.rotateY(rotcube))), cam);
        pr3.draw((m.scale(new vec3(7, 7, 7)).mul(m.rotateY(rotcube))), cam);
        rotcube++;

        gl.bindBuffer(gl.ARRAY_BUFFER, vBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dataBuf), gl.STATIC_DRAW);

        gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 7 * 4, 0);      // position
        gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 7 * 4, 4 * 3);  // color

        gl.enableVertexAttribArray(0);
        gl.enableVertexAttribArray(1);

        gl.useProgram(shaderProgram);

        // gl.drawArrays(gl.TRIANGLE_STRIP, 0, dataBuf.length / 7);
        
        window.requestAnimationFrame(render);
    }

    render();
}
