const svgns = "http://www.w3.org/2000/svg";


// block is B_SIZE pixels square, with B_PADDING between blocks
const B_SIZE    = 4;
const B_PADDING = 2;
const B_RATIO   = B_SIZE + B_PADDING

const BS_PADDING = 10
const BS_DIMEN = 150


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

class Country {
    constructor(data, x, y) {
        this.name = data[0];
        this.population = data[1];
        this.gunDeaths = data[2];
        this.gunSuicide = data[3];
        this.totalSuicide = data[4];
        this.totalGuns = data[5]
        this.block = new Blocks (x, y, BS_DIMEN, BS_DIMEN, 100)
    }
}
class Canvas {
    constructor(countries, largest_pop) {
        this.countries = countries 
        
    }
}

class Blocks {
    constructor(_x, _y, width, height) {
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
    }

    makeSquare(numBlocks) {
        this.allOff();
        if (numBlocks >= this.capacity) {
            throw "ya tried to make " + numBlocks + " blocks, but the capacity of these dimensions is only " + this.capacity;
        }
        let side = Math.floor(Math.sqrt(numBlocks));
        console.log(side);
        let count = 0;
        for (var x = 0; x < side; x++) {
            for (var y = 0; y < side; y++) {
                this.bs[y + this.blocksTall * x].turnOn();
                count++;
            }
        }
        y = 0
        while (count < numBlocks) {
            this.bs[y + this.blocksTall * x].turnOn();
            y++;
            count++;
        }

    }
    // expects a list of objects shaped like this:
    // {name  : "someName",
    //  size  : someNumberOfBlocks,
    //  color : "someColorStringOrMaybeHexValue"}
    colorCategories(categories) {
        let sum = 0;
        cateries.map(c => sum += c.size);
        if (sum > this.capacity) {
            throw "you're trying to color " + sum + " blocks, but only " + this.capacity + " blocks can fit";
        }

    }

    allOff() {
        for (let n = 0; n < this.bs.length; n++) {
            this.bs[n].turnOff();
        }
    }

    allOn() {
        for (let n = 0; n < this.bs.length; n++) {
            this.bs[n].turnOn();
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
var countries = []
// get req to get country data.... this was truly the best way to do it
$.get( {url : "/country_data",
        success : function(data) {
            parsedData = JSON.parse(data)
            view_data = parsedData.countries;
            makeCountries(view_data); // Pass data to a function
        }
       });

function makeCountries(countrees) {
    // this is messy code, we should talk about how to structure it.
    //var countries = []
    x_pos = 10
    y_pos = 10
    for (var i = 0; i < countrees.length; i++) {
        country = new Country(countrees[i], x_pos, y_pos)
        countries.push(country)

        if (i % 2 == 0) {
            x_pos += (BS_DIMEN + BS_PADDING)
        } else {
            x_pos = 10
            y_pos += (BS_DIMEN + BS_PADDING)
        }
    }
    console.log(countries)
}

// end bullshit

// create container to contain all things SVG
let container = document.getElementById("container");
let svg = document.createElementNS(svgns, "svg");
svg.setAttribute("width", window.innerWidth);
svg.setAttribute("height", 800);
container.appendChild(svg);
