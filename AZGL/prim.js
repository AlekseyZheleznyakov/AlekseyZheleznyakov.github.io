import { gl } from "./render.js";
import { vec3, mat4, camera } from "./mth.js";

const
    vertex = "xyzrgba",
    sizeInBytes = vertex.length * 4,
    sizeInNumbers = vertex.length;

export class prim {
    constructor(type, vData, vCnt, iData, iCnt, shaderProgram) {
        this.type = type;
        this.vData = vData;
        this.iData = iData;

        this.vCnt = vCnt;
        this.iCnt = iCnt;
        this.gl = gl;

        this.trans = new mat4();

        if (vData.length != 0 && vCnt != 0) {
            // Create vertex buffer object
            this.vBuf = gl.createBuffer();
            this.vArray = gl.createVertexArray();
            gl.bindVertexArray(this.vArray);
        
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuf);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vData), gl.STATIC_DRAW);

            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, sizeInBytes, 0);  // position
            gl.vertexAttribPointer(1, 4, gl.FLOAT, false, sizeInBytes, 12); // color

            gl.enableVertexAttribArray(0);
            gl.enableVertexAttribArray(1);

            gl.bindVertexArray(null);
        }

        if (iData.length != 0 && iCnt != 0) {
            // Create index buffer object
            this.iBuf = gl.createBuffer();
            gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.iBuf);
            gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.iData), this.gl.STATIC_DRAW);
            gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        }

        this.shader = shaderProgram;
    }

    draw(World, cam) {
        let w = this.trans.mul(World);
        let winv = (w.inverse()).transpose();
        let wvp = w.mul(cam.matrVP);
    
        const locWVP = gl.getUniformLocation(this.shader, "matrWVP");
        if (locWVP != null)
            gl.uniformMatrix4fv(locWVP, false, new Float32Array(wvp.toArray()));        
        gl.bindVertexArray(this.vArray);
        gl.useProgram(this.shader);

        if (this.iCnt == 0) {
            gl.drawArrays(this.type, 0, this.vData.length / sizeInNumbers);
        }
        else {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuf);
            gl.drawElements(this.type, this.iCnt, gl.UNSIGNED_INT, 0);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        }
        gl.bindVertexArray(null);
        gl.useProgram(null);
    }

    load() {
        
    }
}