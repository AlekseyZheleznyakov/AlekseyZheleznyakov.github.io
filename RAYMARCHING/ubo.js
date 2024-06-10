import { vec3 } from "./math/mth.js";
export class Ubo_Utils {
    CamLoc;
    CamAt;
    CamRight;
    CamUp;
    CamDir;
    ProjDistFarTimeLocal;
    TimeGlobalDeltaGlobalDeltaLocal;
    FrameW;
    FrameH;
    constructor(CamLoc, CamAt, CamRight, CamUp, CamDir, ProjDistFarTimeLocal, TimeGlobalDeltaGlobalDeltaLocal, FrameW, FrameH) {
        this.CamLoc = CamLoc;
        this.CamAt = CamAt;
        this.CamRight = CamRight;
        this.CamUp = CamUp;
        this.CamDir = CamDir;
        this.ProjDistFarTimeLocal = ProjDistFarTimeLocal;
        this.TimeGlobalDeltaGlobalDeltaLocal = TimeGlobalDeltaGlobalDeltaLocal;
        this.FrameW = FrameW;
        this.FrameH = FrameH;
    }
    toArray() {
        return new Float32Array([
            ...vec3.vec3(this.CamLoc),
            1,
            ...vec3.vec3(this.CamAt),
            1,
            ...vec3.vec3(this.CamRight),
            1,
            ...vec3.vec3(this.CamUp),
            1,
            ...vec3.vec3(this.CamDir),
            1,
            ...vec3.vec3(this.ProjDistFarTimeLocal),
            1,
            ...vec3.vec3(this.TimeGlobalDeltaGlobalDeltaLocal),
            1,
            ...vec3.vec3(this.FrameW),
            1,
            ...vec3.vec3(this.FrameH),
            1
        ]);
    }
}
export class UBO {
    name;
    id;
    constructor(name, uboid) {
        this.name = name;
        this.id = uboid;
    }
    static create(Size, name, gl) {
        let fr = gl.createBuffer();
        gl.bindBuffer(gl.UNIFORM_BUFFER, fr);
        gl.bufferData(gl.UNIFORM_BUFFER, Size * 4, gl.STATIC_DRAW);
        return new UBO(name, fr);
    }
    update(UboArray, gl) {
        gl.bindBuffer(gl.UNIFORM_BUFFER, this.id);
        gl.bufferSubData(gl.UNIFORM_BUFFER, 0, UboArray);
    }
    apply(point, ShdNo, gl) {
        let blk_loc = gl.getUniformBlockIndex(ShdNo, this.name);
        gl.uniformBlockBinding(ShdNo, blk_loc, point);
        gl.bindBufferBase(gl.UNIFORM_BUFFER, point, this.id);
    }
}
//# sourceMappingURL=ubo.js.map