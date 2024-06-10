import { vec3 } from "./math/mth.js";

export class Ubo_Utils {
  CamLoc: vec3;
  CamAt: vec3;
  CamRight: vec3;
  CamUp: vec3;
  CamDir: vec3;

  ProjDistFarTimeLocal: vec3;
  TimeGlobalDeltaGlobalDeltaLocal: vec3;
  
  FrameW: vec3;
  FrameH: vec3;

  constructor(CamLoc: vec3, CamAt: vec3, CamRight: vec3, CamUp: vec3, CamDir: vec3, 
              ProjDistFarTimeLocal: vec3, TimeGlobalDeltaGlobalDeltaLocal: vec3, FrameW: vec3, FrameH: vec3) {
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
  name: string;
  id: WebGLBuffer | null;
  
  constructor(name: string, uboid: WebGLBuffer | null) {
    this.name = name;
    this.id = uboid;
  }

  static create(Size: number, name: string, gl: WebGL2RenderingContext) {
    let fr = gl.createBuffer();
    gl.bindBuffer(gl.UNIFORM_BUFFER, fr);

    gl.bufferData(gl.UNIFORM_BUFFER, Size * 4, gl.STATIC_DRAW);
    return new UBO(name, fr);
  }

  update(UboArray: Float32Array, gl: WebGL2RenderingContext) {
    gl.bindBuffer(gl.UNIFORM_BUFFER, this.id);
    gl.bufferSubData(gl.UNIFORM_BUFFER, 0, UboArray);
  }

  apply(point: number, ShdNo: WebGLProgram, gl: WebGL2RenderingContext) {
    let blk_loc = gl.getUniformBlockIndex(ShdNo, this.name);

    gl.uniformBlockBinding(ShdNo, blk_loc, point);
    gl.bindBufferBase(gl.UNIFORM_BUFFER, point, this.id);
  }
}
