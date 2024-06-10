class control {
    keys;
    keysClick;
    mx;
    my;
    mz;
    mdx;
    mdy;
    mdz;
    lClick;
    rClick;
    constructor() {
        this.keys = this.keysClick = [];
        this.mx = this.my = this.mz = this.mdx = this.mdy = this.mdz = 0;
        this.lClick = false;
        this.rClick = false;
    }
    response(M, MouseClick, Wheel, Keys) {
        for (let i = 0; i < 256; i++) {
            this.keysClick[i] = Keys[i] && !this.keys[i] ? true : false;
        }
        for (let i = 0; i < 256; i++) {
            this.keys[i] = Keys[i];
        }
        this.mdx = M[0];
        this.mdy = M[1];
        this.mdz = Wheel;
        this.mz += Wheel;
        this.lClick = MouseClick[0];
        this.rClick = MouseClick[1];
    }
} // End of 'Input' function
export let MyControl = new control();
//# sourceMappingURL=input.js.map