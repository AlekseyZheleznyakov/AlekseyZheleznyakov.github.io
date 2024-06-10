import { vec3, mat4 } from "./math/mth.js";
export let MyCam;
let ProjSize = 0.1 /* Project plane fit square */, ProjDist = 0.1 /* Distance to project plane from viewer (near) */, ProjFarClip = 3000; /* Distance to project far clip plane (far) */
class camera {
    projSize;
    projDist;
    projFarClip;
    frameW;
    frameH;
    matrVP;
    matrView;
    matrProj;
    loc;
    at;
    dir;
    up;
    right;
    constructor(ProjSize, ProjDist, ProjFarClip, MatrVP, MatrView, MatrProj, Loc, At, Dir, Up, Right, FrameW, FrameH) {
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
        let rx, ry;
        rx = ry = ProjSize;
        if (this.frameW > this.frameH) {
            rx *= this.frameW / this.frameH;
        }
        else {
            ry *= this.frameH / this.frameW;
        }
        let Wp = rx, Hp = ry;
        this.matrProj = new mat4().setFrustum(-rx / 2, rx / 2, -ry / 2, ry / 2, ProjDist, ProjFarClip);
        this.matrVP = this.matrView.mul(this.matrProj);
    }
    static view(Loc, At, Up1) {
        const Dir = At.sub(Loc).normalize(), Right = Dir.cross(Up1).normalize(), Up = Right.cross(Dir);
        return new mat4(Right.x, Up.x, -Dir.x, 0, Right.y, Up.y, -Dir.y, 0, Right.z, Up.z, -Dir.z, 0, -Loc.dot(Right), -Loc.dot(Up), Loc.dot(Dir), 1);
    }
}
export function CamSet(Loc, At, Up1) {
    let Up, Dir, Right;
    let MatrView = camera.view(Loc, At, Up1);
    Up = new vec3(MatrView.a[0][1], MatrView.a[1][1], MatrView.a[2][1]);
    Dir = new vec3(-MatrView.a[0][2], -MatrView.a[1][2], -MatrView.a[2][2]);
    Right = new vec3(MatrView.a[0][0], MatrView.a[1][0], MatrView.a[2][0]);
    const rx = ProjSize, ry = ProjSize;
    let MatrProj = new mat4().setFrustum(-rx / 2, rx / 2, -ry / 2, ry / 2, ProjDist, ProjFarClip), MatrVP = MatrView.mul(MatrProj);
    MyCam = new camera(ProjSize, ProjDist, ProjFarClip, MatrVP, MatrView, MatrProj, Loc, At, Dir, Up, Right, 500, 500);
}
//# sourceMappingURL=camera.js.map