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

// Blocks contructor is passed a list of objects that look like this:
// {"name"  : "categoryName",
//  "size"  :  categorySize,
//  "color" : "someColor"}
class Blocks {
    constructor(_x, _y, width, height, categoryInfo) {
        this.x    = _x;
        this.y    = _y;
        this.w    = width;
        this.h    = height;
        this.cats = [];
        this.g    = document.createElementNS(svgns, "g");
        this.g.setAttribute("class", "block-chart");
        svg.appendChild(this.g);

        for (let n = 0; n < categoryInfo.length; n++) {
            let info = categoryInfo[n];
            info["blocks"] = [];
            this.cats.push(info);
        }
        var sum = 0;
        for (let n = 0; n < this.cats.length; n++) {
            sum += cats[n].size;
        }
        this.totalSize = sum;

        var blocks_wide = Math.ceil(width / B_RATIO);
        var blocks_tall = Math.ceil(height / B_RATIO);
        this.capacity = blocks_wide * blocks_tall;
        console.assert(this.totalSize < this.capacity);
        var i = 0;
        var j = 0;
        var counter = 0;
        // loop through cats drawing each category
        for (let n = 0; n < this.cats.length; n++) {
            let c = this.cats[n];
            counter = 0;
            while (counter < c.size) {
                c.blocks[counter] = new Block(this.g, this.x + i * B_RATIO, this.y + j * B_RATIO, c.color, c.name);
                counter++;
                j++;
                if (j == blocks_tall) {
                    i++;
                    j = 0;
                }
                if (i == blocks_wide) {
                    console.error("ran out of room trying to draw blocks for category " + c.name + " in Block " + this);
                    // we should never get here if the assert works
                }
            }
        }
    }

    getCategory(name) {
        // returns category from this.cats where name == cats[_].name;
    }
}

class Block {
    constructor(container, _x, _y, _c, _name) {
        this.parent = container;
        this.x = _x;
        this.y = _y;
        this.c = _c;
        this.category = _name;
        this.on = true;
        this.b = document.createElementNS(svgns, "rect");
        this.b.setAttribute("x", this.x);
        this.b.setAttribute("y", this.y);
        this.b.setAttribute("width", B_SIZE);
        this.b.setAttribute("height", B_SIZE);
        this.b.setAttribute("fill", this.c);
        this.parent.appendChild(this.b);
        let parent = this;
        this.b.addEventListener("click", function(event) {
            console.log(parent.category);
        });
    }

    toggle() {
        this.on = ! this.on;
        this.on ? this.b.setAttribute("fill", this.c) : this.b.setAttribute("fill", "white");
    }


}

// Blocks contructor is passed a list of objects that look like this:
// {"name"  : "categoryName",
//  "size"  :  categorySize,
//  "color" : "someColor"}

// here's where it all begins
let container = document.getElementById("container");
let svg = document.createElementNS(svgns, "svg");
svg.setAttribute("width", window.innerWidth);
svg.setAttribute("height", 500);
container.appendChild(svg);
let sampleCat1 = {"name" : "murder",
                  "size" : 500,
                  "color" : "black"};
let sampleCat2 = {"name" : "suicide",
                  "size" : 300,
                  "color" : "blue"};
let sampleCat3 = {"name" : "accident",
                  "size" : 100,
                  "color" : "red"};
let cats = [sampleCat1, sampleCat2, sampleCat3];
let b = new Blocks(10, 10, 600, 400, cats);
