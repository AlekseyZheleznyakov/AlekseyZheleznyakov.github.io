// https://github.com/Eugeny/tabby
// https://michaelwalczyk.com/blog-ray-marching.html
// https://iquilezles.org/articles/distfunctions/
import { MyTime } from "./timer.js";
import { MyControl } from "./input.js";
import { Ubo_Utils, UBO } from "./ubo.js";
import { vec3, mat4, r2d } from "./math/mth.js";
import { matrRotateX, matrRotateY } from "./math/mth.js";
import { MyCam, CamSet } from "./camera.js";
let gl;
let Ubo_set1;
let Ubo_set1_data;
let FlagDataObjectUpdate = true;
function AddObject() {
    console.log("Click on button!!!");
}
function initCam() {
    CamSet(new vec3(-5, 0, -3), new vec3(0, 0, 0), new vec3(0, 1, 0));
    Ubo_set1_data.ProjDistFarTimeLocal.x = MyCam.projDist;
}
function CameraRender() {
    let Dist = MyCam.at.sub(MyCam.loc).len();
    let cosT, sinT, cosP, sinP, plen, Azimuth, Elevator;
    let Wp, Hp, sx, sy;
    let dv;
    if (MyControl.keys[16]) { // shift
        if (MyControl.keys[87])
            MyCam.loc.z += 0.2;
        if (MyControl.keys[65])
            MyCam.loc.x -= 0.2;
        if (MyControl.keys[83])
            MyCam.loc.z -= 0.2;
        if (MyControl.keys[68])
            MyCam.loc.x += 0.2;
        // console.log(MyControl.keys[87]);
        cosT = (MyCam.loc.y - MyCam.at.y) / Dist;
        sinT = Math.sqrt(1 - cosT * cosT);
        plen = Dist * sinT;
        cosP = (MyCam.loc.z - MyCam.at.z) / plen;
        sinP = (MyCam.loc.x - MyCam.at.x) / plen;
        Azimuth = r2d(Math.atan2(sinP, cosP));
        Elevator = r2d(Math.atan2(sinT, cosT));
        let lc = 0;
        if (MyControl.lClick)
            lc = 1;
        Azimuth += MyTime.globalDeltaTime * 3 * (-30 * lc * MyControl.mdx / 3.0);
        Elevator += MyTime.globalDeltaTime * 2 * (-30 * lc * MyControl.mdy / 3.0);
        if (Elevator < 0.08)
            Elevator = 0.08;
        else if (Elevator > 178.9)
            Elevator = 178.9;
        let AltC = 0;
        if (MyControl.keys[18])
            AltC = 1;
        Dist +=
            MyTime.globalDeltaTime *
                (1 + AltC * 27) * // alt
                (1.2 * MyControl.mdz);
        if (Dist < 0.1)
            Dist = 0.1;
        if (MyControl.rClick) {
            Wp = Hp = MyCam.projSize;
            if (MyCam.frameW > MyCam.frameH)
                Wp *= MyCam.frameW / MyCam.frameH;
            else
                Hp *= MyCam.frameH / MyCam.frameW;
            sx = (((-MyControl.mdx * Wp * 10) / MyCam.frameW) * Dist) / MyCam.projDist;
            sy = (((MyControl.mdy * Hp * 10) / MyCam.frameH) * Dist) / MyCam.projDist;
            dv = MyCam.right.mul(sx).add(MyCam.up.mul(sy));
            MyCam.at = MyCam.at.add(dv);
            MyCam.loc = MyCam.loc.add(dv);
        }
        MyCam.loc = new vec3(0, Dist, 0).pointTransform(matrRotateX(Elevator).mul(matrRotateY(Azimuth)).mul(new mat4().setTranslate(MyCam.at)));
        CamSet(MyCam.loc, MyCam.at, new vec3(0, 1, 0));
    }
    Ubo_set1_data.CamLoc = MyCam.loc;
    Ubo_set1_data.CamAt = MyCam.at;
    Ubo_set1_data.CamRight = MyCam.right;
    Ubo_set1_data.CamUp = MyCam.up;
    Ubo_set1_data.CamDir = MyCam.dir;
}
function resizeCam(w, h) {
    Ubo_set1_data.FrameW.z = w;
    Ubo_set1_data.FrameH.z = h;
    MyCam.projSet();
}
async function reloadShaders() {
    const vsResponse = await fetch("./march.vertex.glsl" + "?nocache" + new Date().getTime());
    const vsText = await vsResponse.text();
    const fsResponse = await fetch("./march.fragment.glsl" + "?nocache" + new Date().getTime());
    const fsText = await fsResponse.text();
    const shaderProgram = initShaderProgram(vsText, fsText);
    if (!shaderProgram)
        return null;
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "in_pos")
        }
    };
    return programInfo;
}
function loadShader(type, source) {
    const shader = gl.createShader(type);
    if (!shader)
        return null;
    // Send the source to the shader object
    gl.shaderSource(shader, source);
    // Compile the shader program
    gl.compileShader(shader);
    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}
//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(vsSource, fsSource) {
    const vertexShader = loadShader(gl.VERTEX_SHADER, vsSource);
    if (!vertexShader)
        return;
    const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fsSource);
    if (!fragmentShader)
        return;
    // Create the shader program
    const shaderProgram = gl.createProgram();
    if (!shaderProgram)
        return;
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
        return null;
    }
    return shaderProgram;
}
function initPositionBuffer() {
    // Create a buffer for the square's positions.
    const positionBuffer = gl.createBuffer();
    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Now create an array of positions for the square.
    const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    return positionBuffer;
}
function initBuffers() {
    const positionBuffer = initPositionBuffer();
    return {
        position: positionBuffer
    };
}
function setPositionAttribute(buffers, programInfo) {
    const numComponents = 2; // pull out 2 values per iteration
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}
function drawScene(programInfo, buffers, Uni) {
    gl.clearColor(0.0, 0.5, 0.2, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if (programInfo == null)
        return;
    setPositionAttribute(buffers, programInfo);
    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program);
    Ubo_set1.apply(0, programInfo.program, gl);
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
}
let Md = [0, 0], MouseClick = [false, false], Wheel = 0, Keys = new Array(255).fill(false);
// For FullScreen
// export async function main(w: number, h: number) {
export async function main() {
    const vsResponse = await fetch("./march.vertex.glsl" + "?nocache" + new Date().getTime());
    const vsText = await vsResponse.text();
    console.log(vsText);
    const fsResponse = await fetch("./march.fragment.glsl" + "?nocache" + new Date().getTime());
    const fsText = await fsResponse.text();
    console.log(fsText);
    const canvas = document.querySelector("#glcanvas");
    if (!canvas) {
        return;
    }
    // Initialize the GL context
    gl = canvas.getContext("webgl2");
    // For FullScreen
    // gl.canvas.width = w;
    // gl.canvas.height = h;
    // Only continue if WebGL is available and working
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }
    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.5, 0.2, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);
    let shaderProgram = initShaderProgram(vsText, fsText);
    if (!shaderProgram)
        return;
    let programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "in_pos")
        }
    };
    const Uni = gl.getAttribLocation(shaderProgram, "time");
    const buffers = initBuffers();
    Ubo_set1_data = new Ubo_Utils(new vec3(0, 0, 0), new vec3(0, 0, 0), new vec3(0, 0, 0), new vec3(0, 0, 0), new vec3(0, 0, 0), new vec3(0, 0, 0), new vec3(0, 0, 0), new vec3(0, 0, 0), new vec3(0, 0, 0));
    Ubo_set1 = UBO.create(Ubo_set1_data.toArray().length, "Utils", gl);
    initCam();
    // For FullScreen
    // gl.viewport(0, 0, w, h);
    // resizeCam(w, h);
    resizeCam(700, 700);
    const render = async () => {
        let programInf = await reloadShaders();
        MyTime.response();
        // console.log(MyCam.loc);
        window.addEventListener("mousedown", (e) => {
            e.preventDefault();
            if (e.button == 0) {
                MouseClick[0] = true;
            }
            if (e.button == 2) {
                MouseClick[1] = true;
            }
        });
        window.addEventListener("mouseup", (e) => {
            if (e.button == 0) {
                MouseClick[0] = false;
            }
            if (e.button == 2) {
                MouseClick[1] = false;
            }
        });
        window.addEventListener("mousemove", (e) => {
            Md[0] = e.movementX;
            Md[1] = e.movementY;
        });
        window.addEventListener("keydown", (e) => {
            Keys[e.keyCode] = 1;
        });
        window.addEventListener("keyup", (e) => {
            Keys[e.keyCode] = 0;
        });
        window.addEventListener("wheel", (e) => {
            Wheel = e.deltaY / 10.0;
        });
        MyControl.response(Md, MouseClick, Wheel, Keys);
        if (MyControl.keysClick[82])
            FlagDataObjectUpdate = true;
        Md[0] = Md[1] = 0;
        CameraRender();
        Ubo_set1_data.TimeGlobalDeltaGlobalDeltaLocal.x = MyTime.globalTime;
        Ubo_set1.update(Ubo_set1_data.toArray(), gl);
        drawScene(programInf, buffers, Uni);
        Wheel = 0;
        Keys.fill(0);
        // console.log(MyTime.FPS);
        window.requestAnimationFrame(render);
    };
    render();
}
window.addEventListener("load", (event) => {
    // For FullScreen
    // let w: number = window.innerWidth;
    // let h: number = window.innerHeight;
    // main(w, h);
    main();
});
window.addEventListener("resize", (event) => {
    let w = window.innerWidth;
    let h = window.innerHeight;
    // For FullScreen
    // gl.canvas.width = w;
    // gl.canvas.height = h;
    // gl.viewport(0, 0, w, h);
    resizeCam(w, h);
});
//# sourceMappingURL=main.js.map