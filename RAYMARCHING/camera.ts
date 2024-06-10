import { vec3, mat4 } from "./math/mth.js";

export let MyCam: camera;

let ProjSize = 0.1 /* Project plane fit square */,
  ProjDist = 0.1 /* Distance to project plane from viewer (near) */,
  ProjFarClip = 3000; /* Distance to project far clip plane (far) */

class camera {
  projSize: number;
  projDist: number;
  projFarClip: number;
  frameW: number;
  frameH: number;

  matrVP: mat4;
  matrView: mat4;
  matrProj: mat4;

  loc: vec3;
  at: vec3;
  dir: vec3;
  up: vec3;
  right: vec3;

  constructor(
    ProjSize: number,
    ProjDist: number,
    ProjFarClip: number,

    MatrVP: mat4,
    MatrView: mat4,
    MatrProj: mat4,

    Loc: vec3,
    At: vec3,
    Dir: vec3,
    Up: vec3,
    Right: vec3,

    FrameW: number,
    FrameH: number
  ) {
    this.projSize = ProjSize;
    this.projDist = ProjDist;
    this.projFarClip = ProjFarClip;

    this.matrVP = MatrVP;
    this.matrView = MatrView;
    this.matrProj = MatrProj;

    this.loc = Loc;
    this.at = At;
    this.dir = Dir;
    this.up = Up;
    this.right = Right;
    
    this.frameW = FrameW;
    this.frameH = FrameH;
  }

  projSet() {
    let rx, ry: number;

    rx = ry = ProjSize;

    if (this.frameW > this.frameH) {
      rx *= this.frameW / this.frameH;
    } else {
      ry *= this.frameH / this.frameW;
    }

    let Wp = rx,
      Hp = ry;

    this.matrProj = new mat4().setFrustum(-rx / 2, rx / 2, -ry / 2, ry / 2, ProjDist, ProjFarClip);
    this.matrVP = this.matrView.mul(this.matrProj);
  }

  static view(Loc: vec3, At: vec3, Up1: vec3) {
    const Dir = At.sub(Loc).normalize(),
      Right = Dir.cross(Up1).normalize(),
      Up = Right.cross(Dir);
    return new mat4(Right.x, Up.x, -Dir.x, 0, 
                    Right.y, Up.y, -Dir.y, 0, 
                    Right.z, Up.z, -Dir.z, 0, 
                    -Loc.dot(Right), -Loc.dot(Up), Loc.dot(Dir), 1);
  }
}

export function CamSet(Loc: vec3, At: vec3, Up1: vec3) {
  let Up, Dir, Right;
  let MatrView = camera.view(Loc, At, Up1);

  Up = new vec3(MatrView.a[0][1], MatrView.a[1][1], MatrView.a[2][1]);
  Dir = new vec3(-MatrView.a[0][2], -MatrView.a[1][2], -MatrView.a[2][2]);
  Right = new vec3(MatrView.a[0][0], MatrView.a[1][0], MatrView.a[2][0]);

  const rx = ProjSize,
    ry = ProjSize;

  let MatrProj = new mat4().setFrustum( -rx / 2, rx / 2, -ry / 2, ry / 2, ProjDist, ProjFarClip),
    MatrVP = MatrView.mul(MatrProj);

  MyCam = new camera(ProjSize, ProjDist, ProjFarClip, MatrVP, MatrView, MatrProj, Loc, At, Dir, Up, Right, 500, 500);
}
