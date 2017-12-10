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
    constructor(_x, _y, width, height, numBlocks) {
        this.x  = _x;
        this.y  = _y;
        this.w  = width;
        this.h  = height;
        this.bs = [];
        this.g  = document.createElementNS(svgns, "g");
        this.g.setAttribute("class", "block-chart");
        svg.appendChild(this.g);
        // make an array of Block s
        this.blocksWide = Math.ceil(width / B_RATIO);
        this.blocksTall = Math.ceil(height / B_RATIO);
        this.capacity = this.blocksWide * this.blocksTall;
        let counter = 0
        for (let i = 0; i < this.blocksWide; i++) {
            for (let j = 0; j < this.blocksTall; j++) {
                this.bs[counter] = new Block(this.g, this.x + i * B_RATIO, this.y + j * B_RATIO, "black");
                counter++;
            }
        }
        this.makeSquare(numBlocks);
    }

    makeSquare(numBlocks) {
        this.allOff();
        let side = Math.sqrt(numBlocks);
        for (let x = 0; x < side; x++) {
            for (let y = 0; y < side; y++) {
                this.bs[x + this.blocksTall * y].turnOn();
            }
        }
    }

    allOff() {
        for (let n = 0; n < this.bs.length; n++) {
            this.bs[n].turnOff();
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
        let parent = this;
        this.b.addEventListener("click", function(event) {
            parent.toggle();
        });
    }

    turnOff() {
        this.on = false;
        this.b.setAttribute("fill", "white");
    }
    turnOn() {
        this.on = true;
        this.b.setAttribute("fill", this.c);
    }

    toggle() {
        this.on = ! this.on;
        this.on ? this.b.setAttribute("fill", this.c) : this.b.setAttribute("fill", "white");
    }

    setColor(_c) {
        this.c = _c;
        this.b.setAttribute("fill", this.c);
    }


}

// here's where it all begins
let container = document.getElementById("container");
let svg = document.createElementNS(svgns, "svg");
svg.setAttribute("width", window.innerWidth);
svg.setAttribute("height", 500);
container.appendChild(svg);
let b = new Blocks(10, 10, 600, 400, 10);
