export const d2r = (x) => {
    return x * Math.PI / 180;
};
export const r2d = (x) => {
    return x * 180 / Math.PI;
};
export function determ3x3(a00, a01, a02, a10, a11, a12, a20, a21, a22) {
    return a00 * a11 * a22 + a01 * a12 * a20 + a02 * a10 * a21 -
        a00 * a12 * a21 - a01 * a10 * a22 - a02 * a11 * a20;
}
export class mat4 {
    a;
    constructor(...args) {
        this.a = [[]];
        if (args.length == 16) {
            this.a = [
                [args[0], args[1], args[2], args[3]],
                [args[4], args[5], args[6], args[7]],
                [args[8], args[9], args[10], args[11]],
                [args[12], args[13], args[14], args[15]]
            ];
        }
        else if (args.length == 0) {
            this.a = [
                [0.0, 0.0, 0.0, 0.0],
                [0.0, 0.0, 0.0, 0.0],
                [0.0, 0.0, 0.0, 0.0],
                [0.0, 0.0, 0.0, 0.0]
            ];
        }
    }
    mul(obj) {
        let r = new mat4();
        r.a[0][0] = this.a[0][0] * obj.a[0][0] + this.a[0][1] * obj.a[1][0] +
            this.a[0][2] * obj.a[2][0] + this.a[0][3] * obj.a[3][0];
        r.a[0][1] = this.a[0][0] * obj.a[0][1] + this.a[0][1] * obj.a[1][1] +
            this.a[0][2] * obj.a[2][1] + this.a[0][3] * obj.a[3][1];
        r.a[0][2] = this.a[0][0] * obj.a[0][2] + this.a[0][1] * obj.a[1][2] +
            this.a[0][2] * obj.a[2][2] + this.a[0][3] * obj.a[3][2];
        r.a[0][3] = this.a[0][0] * obj.a[0][3] + this.a[0][1] * obj.a[1][3] +
            this.a[0][2] * obj.a[2][3] + this.a[0][3] * obj.a[3][3];
        r.a[1][0] = this.a[1][0] * obj.a[0][0] + this.a[1][1] * obj.a[1][0] +
            this.a[1][2] * obj.a[2][0] + this.a[1][3] * obj.a[3][0];
        r.a[1][1] = this.a[1][0] * obj.a[0][1] + this.a[1][1] * obj.a[1][1] +
            this.a[1][2] * obj.a[2][1] + this.a[1][3] * obj.a[3][1];
        r.a[1][2] = this.a[1][0] * obj.a[0][2] + this.a[1][1] * obj.a[1][2] +
            this.a[1][2] * obj.a[2][2] + this.a[1][3] * obj.a[3][2];
        r.a[1][3] = this.a[1][0] * obj.a[0][3] + this.a[1][1] * obj.a[1][3] +
            this.a[1][2] * obj.a[2][3] + this.a[1][3] * obj.a[3][3];
        r.a[2][0] = this.a[2][0] * obj.a[0][0] + this.a[2][1] * obj.a[1][0] +
            this.a[2][2] * obj.a[2][0] + this.a[2][3] * obj.a[3][0];
        r.a[2][1] = this.a[2][0] * obj.a[0][1] + this.a[2][1] * obj.a[1][1] +
            this.a[2][2] * obj.a[2][1] + this.a[2][3] * obj.a[3][1];
        r.a[2][2] = this.a[2][0] * obj.a[0][2] + this.a[2][1] * obj.a[1][2] +
            this.a[2][2] * obj.a[2][2] + this.a[2][3] * obj.a[3][2];
        r.a[2][3] = this.a[2][0] * obj.a[0][3] + this.a[2][1] * obj.a[1][3] +
            this.a[2][2] * obj.a[2][3] + this.a[2][3] * obj.a[3][3];
        r.a[3][0] = this.a[3][0] * obj.a[0][0] + this.a[3][1] * obj.a[1][0] +
            this.a[3][2] * obj.a[2][0] + this.a[3][3] * obj.a[3][0];
        r.a[3][1] = this.a[3][0] * obj.a[0][1] + this.a[3][1] * obj.a[1][1] +
            this.a[3][2] * obj.a[2][1] + this.a[3][3] * obj.a[3][1];
        r.a[3][2] = this.a[3][0] * obj.a[0][2] + this.a[3][1] * obj.a[1][2] +
            this.a[3][2] * obj.a[2][2] + this.a[3][3] * obj.a[3][2];
        r.a[3][3] = this.a[3][0] * obj.a[0][3] + this.a[3][1] * obj.a[1][3] +
            this.a[3][2] * obj.a[2][3] + this.a[3][3] * obj.a[3][3];
        return r;
    }
    determ() {
        return +this.a[0][0] * determ3x3(this.a[1][1], this.a[1][2], this.a[1][3], this.a[2][1], this.a[2][2], this.a[2][3], this.a[3][1], this.a[3][2], this.a[3][3]) +
            -this.a[0][1] * determ3x3(this.a[1][0], this.a[1][2], this.a[1][3], this.a[2][0], this.a[2][2], this.a[2][3], this.a[3][0], this.a[3][2], this.a[3][3]) +
            +this.a[0][2] * determ3x3(this.a[1][0], this.a[1][1], this.a[1][3], this.a[2][0], this.a[2][1], this.a[2][3], this.a[3][0], this.a[3][1], this.a[3][3]) +
            -this.a[0][3] * determ3x3(this.a[1][0], this.a[1][1], this.a[1][2], this.a[2][0], this.a[2][1], this.a[2][2], this.a[3][0], this.a[3][1], this.a[3][2]);
    }
    transpose() {
        let m = new mat4();
        m.a[0][0] = this.a[0][0];
        m.a[0][1] = this.a[1][0];
        m.a[0][2] = this.a[2][0];
        m.a[0][3] = this.a[3][0];
        m.a[1][0] = this.a[0][1];
        m.a[1][1] = this.a[1][1];
        m.a[1][2] = this.a[2][1];
        m.a[1][3] = this.a[3][1];
        m.a[2][0] = this.a[0][2];
        m.a[2][1] = this.a[1][2];
        m.a[2][2] = this.a[2][2];
        m.a[2][3] = this.a[3][2];
        m.a[3][0] = this.a[0][3];
        m.a[3][1] = this.a[1][3];
        m.a[3][2] = this.a[2][3];
        m.a[3][3] = this.a[3][3];
        return m;
    }
    inverse() {
        let m = new mat4();
        let det = this.determ();
        if (det == 0) {
            return matrIdentity();
        }
        m.a[0][0] =
            +determ3x3(this.a[1][1], this.a[1][2], this.a[1][3], this.a[2][1], this.a[2][2], this.a[2][3], this.a[3][1], this.a[3][2], this.a[3][3]) / det;
        m.a[1][0] =
            -determ3x3(this.a[1][0], this.a[1][2], this.a[1][3], this.a[2][0], this.a[2][2], this.a[2][3], this.a[3][0], this.a[3][2], this.a[3][3]) / det;
        m.a[2][0] =
            +determ3x3(this.a[1][0], this.a[1][1], this.a[1][3], this.a[2][0], this.a[2][1], this.a[2][3], this.a[3][0], this.a[3][1], this.a[3][3]) / det;
        m.a[3][0] =
            +determ3x3(this.a[1][0], this.a[1][1], this.a[1][2], this.a[2][0], this.a[2][1], this.a[2][2], this.a[3][0], this.a[3][1], this.a[3][2]) / det;
        m.a[0][1] =
            -determ3x3(this.a[0][1], this.a[0][2], this.a[0][3], this.a[2][1], this.a[2][2], this.a[2][3], this.a[3][1], this.a[3][2], this.a[3][3]) / det;
        m.a[1][1] =
            +determ3x3(this.a[0][0], this.a[0][2], this.a[0][3], this.a[2][0], this.a[2][2], this.a[2][3], this.a[3][0], this.a[3][2], this.a[3][3]) / det;
        m.a[2][1] =
            -determ3x3(this.a[0][0], this.a[0][1], this.a[0][3], this.a[2][0], this.a[2][1], this.a[2][3], this.a[3][0], this.a[3][1], this.a[3][3]) / det;
        m.a[3][1] =
            -determ3x3(this.a[0][0], this.a[0][1], this.a[0][2], this.a[2][0], this.a[2][1], this.a[2][2], this.a[3][0], this.a[3][1], this.a[3][2]) / det;
        m.a[0][2] =
            +determ3x3(this.a[0][1], this.a[0][2], this.a[0][3], this.a[1][1], this.a[1][2], this.a[1][3], this.a[3][1], this.a[3][2], this.a[3][3]) / det;
        m.a[1][2] =
            -determ3x3(this.a[0][0], this.a[0][2], this.a[0][3], this.a[1][0], this.a[1][2], this.a[1][3], this.a[3][0], this.a[3][2], this.a[3][3]) / det;
        m.a[2][2] =
            +determ3x3(this.a[0][0], this.a[0][1], this.a[0][3], this.a[1][0], this.a[1][1], this.a[1][3], this.a[3][0], this.a[3][1], this.a[3][3]) / det;
        m.a[3][2] =
            +determ3x3(this.a[0][0], this.a[0][1], this.a[0][2], this.a[1][0], this.a[1][1], this.a[1][2], this.a[3][0], this.a[3][1], this.a[3][2]) / det;
        m.a[0][3] =
            +determ3x3(this.a[0][1], this.a[0][2], this.a[0][3], this.a[1][1], this.a[1][2], this.a[1][3], this.a[2][1], this.a[2][2], this.a[2][3]) / det;
        m.a[1][3] =
            -determ3x3(this.a[0][0], this.a[0][2], this.a[0][3], this.a[1][0], this.a[1][2], this.a[1][3], this.a[2][0], this.a[2][2], this.a[2][3]) / det;
        m.a[2][3] =
            +determ3x3(this.a[0][0], this.a[0][1], this.a[0][3], this.a[1][0], this.a[1][1], this.a[1][3], this.a[2][0], this.a[2][1], this.a[2][3]) / det;
        m.a[3][3] =
            +determ3x3(this.a[0][0], this.a[0][1], this.a[0][2], this.a[1][0], this.a[1][1], this.a[1][2], this.a[2][0], this.a[2][1], this.a[2][2]) / det;
        return m;
    }
    setIdentity() {
        this.a[0] = [1, 0, 0, 0];
        this.a[1] = [0, 1, 0, 0];
        this.a[2] = [0, 0, 1, 0];
        this.a[3] = [0, 0, 0, 1];
        return this;
    }
    setScale(v) {
        this.a[0] = [v.x, 0, 0, 0];
        this.a[1] = [0, v.y, 0, 0];
        this.a[2] = [0, 0, v.z, 0];
        this.a[3] = [0, 0, 0, 1];
        return this;
    }
    setTranslate(v) {
        this.a[0] = [1, 0, 0, 0];
        this.a[1] = [0, 1, 0, 0];
        this.a[2] = [0, 0, 1, 0];
        this.a[3] = [v.x, v.y, v.z, 1];
        return this;
    }
    setRotateX(angle) {
        let a = d2r(angle), s = Math.sin(a), c = Math.cos(a);
        this.setIdentity();
        this.a[1][1] = c;
        this.a[1][2] = s;
        this.a[2][1] = -s;
        this.a[2][2] = c;
        return this;
    }
    setRotateY(angle) {
        let a = d2r(angle), s = Math.sin(a), c = Math.cos(a);
        this.setIdentity();
        this.a[0][0] = c;
        this.a[0][2] = -s;
        this.a[2][0] = s;
        this.a[2][2] = c;
        return this;
    }
    setRotateZ(angle) {
        let a = d2r(angle), s = Math.sin(a), c = Math.cos(a);
        this.setIdentity();
        this.a[0][0] = c;
        this.a[0][2] = s;
        this.a[2][0] = -s;
        this.a[2][2] = c;
        return this;
    }
    setRotate(v, angle) {
        let a = d2r(angle), s = Math.sin(a), c = Math.cos(a);
        let r = v.normalize(), m = new mat4();
        this.a[0][0] = c + r.x * r.x * (1 - c);
        this.a[0][1] = r.x * r.y * (1 - c) + r.z * s;
        this.a[0][2] = r.x * r.z * (1 - c) - r.y * s;
        this.a[0][3] = 0;
        this.a[1][0] = r.y * r.x * (1 - c) - r.z * s;
        this.a[1][1] = c + r.y * r.y * (1 - c);
        this.a[1][2] = r.y * r.z * (1 - c) + r.z * s;
        this.a[1][3] = 0;
        this.a[2][0] = r.z * r.x * (1 - c) + r.y * s;
        this.a[2][1] = r.z * r.y * (1 - c) - r.x * s;
        this.a[2][2] = c + r.z * r.z * (1 - c);
        this.a[2][3] = 0;
        this.a[3][0] = 0;
        this.a[3][1] = 0;
        this.a[3][2] = 0;
        this.a[3][3] = 1;
        return this;
    }
    setView(loc, at, up1) {
        let dir = at.sub(loc).normalize(), right = dir.cross(up1).normalize(), up = right.cross(dir);
        this.a[0] = [right.x, up.x, -dir.x, 0];
        this.a[1] = [right.y, up.y, -dir.y, 0];
        this.a[2] = [right.z, up.z, -dir.z, 0];
        this.a[3] = [-loc.dot(right), -loc.dot(up), loc.dot(dir), 1];
        return this;
    }
    setFrustum(l, r, b, t, n, f) {
        this.a[0] = [2 * n / (r - l), 0, 0, 0];
        this.a[1] = [0, 2 * n / (t - b), 0, 0];
        this.a[2] = [(r + l) / (r - l), (t + b) / (t - b), (f + n) / (n - f), -1];
        this.a[3] = [0, 0, 2 * n * f / (n - f), 0];
        return this;
    }
    toArray() {
        return [this.a[0][0], this.a[0][1], this.a[0][2], this.a[0][3],
            this.a[1][0], this.a[1][1], this.a[1][2], this.a[1][3],
            this.a[2][0], this.a[2][1], this.a[2][2], this.a[2][3],
            this.a[3][0], this.a[3][1], this.a[3][2], this.a[3][3]];
    }
    check() {
        console.log(this.a[0], this.a[1], this.a[2], this.a[3]);
    }
}
export function matrIdentity() {
    return new mat4().setIdentity();
}
export function matrScale(v) {
    return new mat4().setScale(v);
}
export function matrTranslate(v) {
    return new mat4().setTranslate(v);
}
export function matrRotateX(angle) {
    return new mat4().setRotateX(angle);
}
export function matrRotateY(angle) {
    return new mat4().setRotateY(angle);
}
export function matrRotateZ(angle) {
    return new mat4().setRotateZ(angle);
}
export function matrRotate(v, angle) {
    return new mat4().setRotate(v, angle);
}
export function vec3Set(...args) {
    if (args.length == 1) {
        let x = arguments[0];
        if (typeof x == "object") {
            return new vec3(x[0], x[1], x[2]);
        }
        else {
            return new vec3(x, x, x);
        }
    }
    else if (args.length == 3) {
        let x = args[0], y = args[1], z = args[2];
        return new vec3(x, y, z);
    }
    return new vec3(0.0, 0.0, 0.0);
}
export class vec3 {
    x;
    y;
    z;
    constructor(...args) {
        if (args.length == 3) {
            this.x = args[0];
            this.y = args[1];
            this.z = args[2];
        }
        else if (args.length == 1) {
            this.x = this.y = this.z = args[0];
        }
        else {
            this.x = this.y = this.z = 0;
        }
    }
    add(v) {
        return new vec3(this.x + v.x, this.y + v.y, this.z + v.z);
    }
    sub(v) {
        return new vec3(this.x - v.x, this.y - v.y, this.z - v.z);
    }
    mul(n) {
        return new vec3(this.x * n, this.y * n, this.z * n);
    }
    dot(v) {
        return this.x * v.x + this.y * v.y + v.z * this.z;
    }
    cross(v) {
        return new vec3(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
    }
    len() {
        let len = this.dot(this);
        if (len == 1 || len == 0) {
            return len;
        }
        return Math.sqrt(len);
    }
    len2() {
        return this.dot(this);
    }
    normalize() {
        return this.mul(1 / this.len());
    }
    transform(m) {
        return new vec3(this.x * m.a[0][0] + this.y * m.a[1][0] + this.z * m.a[2][0], this.x * m.a[0][1] + this.y * m.a[1][1] + this.z * m.a[2][1], this.x * m.a[0][2] + this.y * m.a[1][2] + this.z * m.a[2][2]);
    }
    pointTransform(m) {
        return new vec3(this.x * m.a[0][0] + this.y * m.a[1][0] + this.z * m.a[2][0] + m.a[3][0], this.x * m.a[0][1] + this.y * m.a[1][1] + this.z * m.a[2][1] + m.a[3][1], this.x * m.a[0][2] + this.y * m.a[1][2] + this.z * m.a[2][2] + m.a[3][2]);
    }
    static vec3(a) {
        return [a.x, a.y, a.z];
    }
    toArray() {
        return [this.x, this.y, this.z];
    }
    check() {
        console.log(this);
    }
}
//# sourceMappingURL=mth.js.map