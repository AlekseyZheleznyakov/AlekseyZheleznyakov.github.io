export class vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(v) {
        return new vec3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    sub(v) {
        return new vec3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    mulNum(num) {
        return new vec3(this.x * num, this.y * num, this.z * num);
    }

    divNum(num) {
        return new vec3(this.x / num, this.y / num, this.z / num);
    }

    neg() {
        return new vec3(-this.x, -this.y, -this.z);
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + v.z * this.z;
    }

    cross(v) {
        return new vec3(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
    }

    len() {
        let len = this.dot(this);

        if (len === 1 || len === 0)
          return len;
        return Math.sqrt(len);
    }

    len2() {
        let len = this.dot(this);

        return len;
    }

    norm() {
        let len = this.dot(this);

        if (len == 1 || len == 0)
          return this;
        return this.divNum(Math.sqrt(len));
    }

    trans(matr) {
        return new vec3(this.x * matr.a[0][0] + this.y * matr.a[1][0] + this.z * matr.a[2][0] + matr.a[3][0],
                        this.x * matr.a[0][1] + this.y * matr.a[1][1] + this.z * matr.a[2][1] + matr.a[3][1],
                        this.x * matr.a[0][2] + this.y * matr.a[1][2] + this.z * matr.a[2][2] + matr.a[3][2]);
    }    
}

export class vec4 {
    constructor(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    add(v) {
        return new vec4(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w);
    }

    sub(v) {
        return new vec3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + v.z * this.z;
    }
}

export class mat4 {
    constructor(a00, a01, a02, a03,
                a10, a11, a12, a13,
                a20, a21, a22, a23,
                a30, a31, a32, a33) {
        if (a00 == null) {
            return new mat4(1, 0, 0, 0,
                            0, 1, 0, 0,
                            0, 0, 1, 0,
                            0, 0, 0, 1);
        }
        this.a = [
            [a00, a01, a02, a03],
            [a10, a11, a12, a13],
            [a20, a21, a22, a23],
            [a30, a31, a32, a33]
        ];
    }

    trans() {
        let m = new mat4(1, 0, 0, 0,
                     0, 1, 0, 0,
                     0, 0, 1, 0,
                     0, 0, 0, 1);

        m.a[3][0] = this.x;
        m.a[3][1] = this.y;
        m.a[3][2] = this.z;
        return m;      
    }

    mul(obj) {
        if (obj.constructor.name === "mat4") {
            let i, j, k;
            let r = new mat4(0, 0, 0, 0,
                            0, 0, 0, 0,
                            0, 0, 0, 0,
                            0, 0, 0, 0);
            
            for (i = 0; i < 4; i++)
                for (j = 0; j < 4; j++)
                    for (k = 0; k < 4; k++)
                        r.a[i][j] += this.a[i][k] * obj.a[k][j];
            
            return r;
        }
        if (obj.constructor.name === "vec3") {
            let w = obj.x * this.a[0][3] + obj.y * this.a[1][3] + obj.z * this.a[2][3] + this.a[3][3];
 
            return VecSet((obj.x * this.a[0][0] + obj.y * this.a[1][0] + obj.z * this.a[2][0] + this.a[3][0]) / w,
                          (obj.x * this.a[0][1] + obj.y * this.a[1][1] + obj.z * this.a[2][1] + this.a[3][1]) / w,
                          (obj.x * this.a[0][2] + obj.y * this.a[1][2] + obj.z * this.a[2][2] + this.a[3][2]) / w);
        }
    }

    determ3x3(a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        a30, a31, a32, a33) {
            return a11 * a22 * a33 + a12 * a23 * a31 + a13 * a21 * a32 -
                   a11 * a23 * a32 - a12 * a21 * a33 - a13 * a22 * a31;
    }

    determ() {
        return
            this.a[0][0] * this.determ3x3(this.a[1][1], this.a[1][2], this.a[1][3],
                                    this.a[2][1], this.a[2][2], this.a[2][3],
                                    this.a[3][1], this.a[3][2], this.a[3][3]) +
            -this.a[0][1] * this.determ3x3(this.a[1][0], this.a[1][2], this.a[1][3],
                                    this.a[2][0], this.a[2][2], this.a[2][3],
                                    this.a[3][0], this.a[3][2], this.a[3][3]) +
            +this.a[0][2] * this.determ3x3(this.a[1][0], this.a[1][1], this.a[1][3],
                                    this.a[2][0], this.a[2][1], this.a[2][3],
                                    this.a[3][0], this.a[3][1], this.a[3][3]) +
            -this.a[0][3] * this.determ3x3(this.a[1][0], this.a[1][1], this.a[1][2],
                                    this.a[2][0], this.a[2][1], this.a[2][2],
                                    this.a[3][0], this.a[3][1], this.a[3][2]);
    }

    transpose() {
        let m = new mat4(0, 0, 0, 0,
                        0, 0, 0, 0,
                        0, 0, 0, 0,
                        0, 0, 0, 0);

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
            let det = this.determ();
            let r = new mat4(0, 0, 0, 0,
                             0, 0, 0, 0,
                             0, 0, 0, 0,
                             0, 0, 0, 0);

            if (det == 0)
                return new mat4(
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1);

            /* build adjoint matrix */
            r.a[0][0] =
                +this.determ(this.a[1][1], this.a[1][2], this.a[1][3],
                            this.a[2][1], this.a[2][2], this.a[2][3],
                            this.a[3][1], this.a[3][2], this.a[3][3]) / det;

            r.a[1][0] =
                -this.determ(this.a[1][0], this.a[1][2], this.a[1][3],
                            this.a[2][0], this.a[2][2], this.a[2][3],
                            this.a[3][0], this.a[3][2], this.a[3][3]) / det;

            r.a[2][0] =
                +this.determ(this.a[1][0], this.a[1][1], this.a[1][3],
                            this.a[2][0], this.a[2][1], this.a[2][3],
                            this.a[3][0], this.a[3][1], this.a[3][3]) / det;

            r.a[3][0] =
                -this.determ(this.a[1][0], this.a[1][1], this.a[1][2],
                            this.a[2][0], this.a[2][1], this.a[2][2],
                            this.a[3][0], this.a[3][1], this.a[3][2]) / det;

            r.a[0][1] =
                -this.determ(this.a[0][1], this.a[0][2], this.a[0][3],
                            this.a[2][1], this.a[2][2], this.a[2][3],
                            this.a[3][1], this.a[3][2], this.a[3][3]) / det;

            r.a[1][1] =
                +this.determ(this.a[0][0], this.a[0][2], this.a[0][3],
                            this.a[2][0], this.a[2][2], this.a[2][3],
                            this.a[3][0], this.a[3][2], this.a[3][3]) / det;

            r.a[2][1] =
                -this.determ(this.a[0][0], this.a[0][1], this.a[0][3],
                            this.a[2][0], this.a[2][1], this.a[2][3],
                            this.a[3][0], this.a[3][1], this.a[3][3]) / det;

            r.a[3][1] =
                +this.determ(this.a[0][0], this.a[0][1], this.a[0][2],
                            this.a[2][0], this.a[2][1], this.a[2][2],
                            this.a[3][0], this.a[3][1], this.a[3][2]) / det;

            r.a[0][2] =
                +this.determ(this.a[0][1], this.a[0][2], this.a[0][3],
                            this.a[1][1], this.a[1][2], this.a[1][3],
                            this.a[3][1], this.a[3][2], this.a[3][3]) / det;

            r.a[1][2] =
                -this.determ(this.a[0][0], this.a[0][2], this.a[0][3],
                            this.a[1][0], this.a[1][2], this.a[1][3],
                            this.a[3][0], this.a[3][2], this.a[3][3]) / det;

            r.a[2][2] =
                +this.determ(this.a[0][0], this.a[0][1], this.a[0][3],
                            this.a[1][0], this.a[1][1], this.a[1][3],
                            this.a[3][0], this.a[3][1], this.a[3][3]) / det;

            r.a[3][2] =
                -this.determ(this.a[0][0], this.a[0][1], this.a[0][2],
                            this.a[1][0], this.a[1][1], this.a[1][2],
                            this.a[3][0], this.a[3][1], this.a[3][2]) / det;

            r.a[0][3] =
                +this.determ(this.a[0][1], this.a[0][2], this.a[0][3],
                            this.a[1][1], this.a[1][2], this.a[1][3],
                            this.a[2][1], this.a[2][2], this.a[2][3]) / det;

            r.a[1][3] =
                -this.determ(this.a[0][0], this.a[0][2], this.a[0][3],
                            this.a[1][0], this.a[1][2], this.a[1][3],
                            this.a[2][0], this.a[2][2], this.a[2][3]) / det;

            r.a[2][3] =
                +this.determ(this.a[0][0], this.a[0][1], this.a[0][3],
                            this.a[1][0], this.a[1][1], this.a[1][3],
                            this.a[2][0], this.a[2][1], this.a[2][3]) / det;

            r.a[3][3] =
                -this.determ(this.a[0][0], this.a[0][1], this.a[0][2],
                            this.a[1][0], this.a[1][1], this.a[1][2],
                            this.a[2][0], this.a[2][1], this.a[2][2]) / det;

            return r;
    }

    scale(v) {
        let M = new mat4(v.x, 0, 0, 0,
                        0, v.y, 0, 0,
                        0, 0, v.z, 0,
                        0, 0, 0, 1);
      
        return M;      
    }

    ortho(Left, Right, Bottom, Top, Near, Far) {
        return new mat4(2 / (Right - Left),0, 0, 0,
            0, 2 / (Top - Bottom), 0, 0,
            0, 0, 2 / (Near - Far), 0,
            (Right + Left) / (Left - Right), (Top + Bottom) / (Bottom - Top),
            (Far + Near) / (Near - Far), 1);
    }

    frustum(l, r, b, t, n, f) {
        return new mat4(2 * n / (r - l), 0, 0, 0,
            0, 2 * n / (t - b), 0, 0,
            (r + l) / (r - l), (t + b) / (t - b), (f + n) / (n - f), -1,
            0, 0, 2 * n * f / (n - f), 0);
    }

    view(Loc, At, Up1) {
        let
            Dir = (At.sub(Loc)).norm(),
            Right = (Dir.cross(Up1)).norm(),
            Up = Right.cross(Dir);
    
       return new mat4(Right.x, Up.x, -Dir.x, 0,
                      Right.y, Up.y, -Dir.y, 0,
                      Right.z, Up.z, -Dir.z, 0,
                      -Loc.dot(Right), -Loc.dot(Up), Loc.dot(Dir), 1);
    }

    rotateX(angl) {
        let
            A = ((angl) * (3.14159265358979323846 / 180.0)),
            si = Math.sin(A), co = Math.cos(A);
        let M = new mat4(             
                        1, 0, 0, 0,
                        0, co, si, 0,
                        0, -si, co, 0,
                        0, 0, 0, 1);
        return M;
    }

    rotateY(angl) {
        let
            A = ((angl) * (3.14159265358979323846 / 180.0)),
            si = Math.sin(A), co = Math.cos(A);
        let M = new mat4(            
            co, 0, -si, 0,
            0, 1, 0, 0,
            si, 0, co, 0,
            0, 0, 0, 1            
        );
        
        return M;
    }

    rotateZ(angl) {
        let
            A = ((angl) * (3.14159265358979323846 / 180.0)),
            si = Math.sin(A), co = Math.cos(A);
        let M = new mat4(
            co, si, 0, 0,
            -si, co, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );

        return M;
    }

    toArray() {
        let r = [];

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                r.push(this.a[i][j]);
            }
        }
        return r;
    }
}

export class camera {
    constructor() {
        // Projection properties
        this.projSize = 0.1; // Project plane fit square
        this.projDist = 0.1; // Distance to project plane from viewer (near)
        this.projFarClip = 1800; // Distance to project far clip plane (far)
    
        // Local size data
        this.frameW = 1000; // Frame width
        this.frameH = 1000; // Frame height
    
        // Matrices
        this.matrView = new mat4(); // View coordinate system matrix
        this.matrProj = new mat4(); // Projection coordinate system matrix
        this.matrVP = new mat4(); // View and projection matrix precalculate value
    
        // Set camera default settings
        this.loc = new vec3(); // Camera location
        this.at = new vec3(); // Camera destination
        this.dir = new vec3(); // Camera Direction
        this.up = new vec3(); // Camera UP direction
        this.right = new vec3(); // Camera RIGHT direction
      }   
      
      projSet() {
            let rx, ry;

            rx = ry = this.projSize;
        
            if (this.frameW > this.frameH)
                rx *= this.frameW / this.frameH;
            else
                ry *= this.frameH / this.frameW;
        
            this.matrProj =
                this.matrProj.frustum(-rx / 2, rx / 2, -ry / 2, ry / 2,
                    this.projDist, this.projFarClip);
            this.matrVP = this.matrView.mul(this.matrProj);
      }

      camSet(Loc, At, Up) {
            this.matrView = this.matrView.view(Loc, At, Up);
            this.matrVP = this.matrView.mul(this.matrProj);
            this.at = At;
            this.loc = Loc;
        
            this.dir = new vec3(-this.matrView.a[0][2],
                                -this.matrView.a[1][2],
                                -this.matrView.a[2][2]);
            this.up = new vec3(this.matrView.a[0][1],
                               this.matrView.a[1][1],
                               this.matrView.a[2][1]);
            this.right = new vec3(this.matrView.a[0][0],
                                  this.matrView.a[1][0],
                                  this.matrView.a[2][0]);
      }

      resize(w, h) {
        /* Setup projection */
        this.frameW = w;
        this.frameH = h;
        this.projSet();     
      }
}