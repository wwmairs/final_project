const svgns = "http://www.w3.org/2000/svg";





// block is B_SIZE pixels square, with B_PADDING between blocks
const B_SIZE    = 4;
const B_PADDING = 2;
const B_RATIO   = B_SIZE + B_PADDING



// TODO
// extend Blocks with:
//  - # people to represent
//  - ratio of people per Block
//  - left and top justified
//  - instead of holding a single list of Block instances
//    it should have a dictionary of lists of Block instances
//
// extend Block with:
//  - 

// an instance of a Blocks class should make:
//      - a wrapper for all of the Blocks it contains
//      - a square for each Block it contains
class Blocks {
    constructor(_x, _y, width, height, num_blocks) {
        this.x  = _x;
        this.y  = _y;
        this.w  = width;
        this.h  = height;
        this.bs = [];
        this.g  = document.createElementNS(svgns, "g");
        this.g.setAttribute("class", "block-chart");
        svg.appendChild(this.g);
        // make an array of Block s
        let blocks_wide = Math.ceil(width / B_RATIO);
        let blocks_tall = Math.ceil(height / B_RATIO);
        this.totalBlocks = blocks_wide * blocks_tall;
        console.log(this.totalBlocks);
        for (let i = 0; i < blocks_wide; i++) {
            for (let j = 0; j < blocks_tall; j++) {
                this.bs[i] = new Block(this.g, this.x + i * B_RATIO, this.y + j * B_RATIO, "black")
            }
        }
    }
}

class Block {
    constructor(container, _x, _y, _c) {
        this.parent = container;
        this.x = _x;
        this.y = _y;
        this.c = _c;
        this.on = true;
        this.b = document.createElementNS(svgns, "rect");
        this.b.setAttribute("x", this.x);
        this.b.setAttribute("y", this.y);
        this.b.setAttribute("width", B_SIZE);
        this.b.setAttribute("height", B_SIZE);
        this.parent.appendChild(this.b);
        this.b.addEventListener("click", function(event) {
            toggle();
        });
    }

    toggle() {
        this.on = ! this.on;
        this.on ? this.b.setAttribute("fill", this.c) : this.b.setAttribute("fill", "white");
    }


}

// here's where it all begins
let container = document.getElementById("container");
let svg = document.createElementNS(svgns, "svg");
svg.setAttribute("width", window.innerWidth);
svg.setAttribute("height", 500);
container.appendChild(svg);
let b = new Blocks(10, 10, 600, 400, 40);
