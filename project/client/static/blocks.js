const svgns = "http://www.w3.org/2000/svg";


// block is B_SIZE pixels square, with B_PADDING between blocks
const B_SIZE    = 3;
const B_PADDING = 2;
const B_RATIO   = B_SIZE + B_PADDING

const BS_PADDING = 15
const BS_HEIGHT = 230
const BS_WIDTH = 370
const BS_TOTAL = (BS_HEIGHT / B_RATIO) * (BS_WIDTH / B_RATIO)
const B_SCALE = 100000
const GUN_SCALE = 10


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
        this.block = new Blocks (x, y, BS_WIDTH, BS_HEIGHT)
    }

    displayPopulation() {
        var num_blocks = Math.floor(this.population / B_SCALE)
        this.block.makeSquare(num_blocks)
    }

    colorByCategory() {
        let c1 = {"name"  : "gunSuicide",
                  "size"  : this.gunSuicide / GUN_SCALE,
                  "color" : "red"};
        let c2 = {"name"  : "otherGunDeath",
                  "size"  : (this.gunDeaths - this.gunSuicide) / GUN_SCALE,
                  "color" : "blue"};
        // this.block.makeSquareWithCategories([c1, c2]);
        this.block.allOff();
        this.block.makeSquareWithColor(this.gunDeaths / GUN_SCALE, "blue");
        this.block.makeSquareWithColor(this.gunSuicide / GUN_SCALE, "red");
        
    }

    displayOverlap() {
        let c1 = {"name"  : "gunDeath",
                  "size"  : this.gunDeaths / GUN_SCALE,
                  "color" : "purple"};
        let c2 = {"name"  : "totalSuicide",
                  "size"  : (this.totalSuicide) / GUN_SCALE,
                  "color" : "orange"};
        let c3 = {"name"  : "gunSuicide",
                  "size"  : (this.gunSuicide) / GUN_SCALE,
                  "color" : "red"};
        this.block.allOff();
        this.block.overlap([c1, c2, c3]);
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
    // expects a list of 3 categories that look like this: 
    // {name  : "someName",
    //  size  : someNumberOfBlocks,
    //  color : "someColorStringOrMaybeHexValue"}
    // where the first two elements are the two categories that overlap,
    // and the third element is the overlapping section
    overlap(cs) {
        let firstSide = this.makeSquareWithColorXY(cs[0].size, cs[0].color, 0, 0);
        console.log(firstSide);
        let diff = Math.floor(Math.sqrt(cs[2].size));
        console.log(diff);
        this.makeOverlappingSquare(cs[1].size, cs[1].color, cs[2].color, firstSide - diff, firstSide - diff);
    }

    makeSquare(numBlocks) {
        this.allOff();
        if (numBlocks >= this.capacity) {
            throw "ya tried to make " + numBlocks + " blocks, but the capacity of these dimensions is only " + this.capacity;
        }
        let side = Math.floor(Math.sqrt(numBlocks));
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
            if (y >= side) {
                y = 0;
                x++;
            }
            count++;
        }

    }

    makeSquareWithColor(numBlocks, color) {

        if (numBlocks >= this.capacity) {
            throw "ya tried to make " + numBlocks + " blocks, but the capacity of these dimensions is only " + this.capacity;
        }
        let side = Math.floor(Math.sqrt(numBlocks));
        let count = 0;
        for (var x = 0; x < side; x++) {
            for (var y = 0; y < side; y++) {
                this.bs[y + this.blocksTall * x].setColor(color);
                count++;
            }
        }
        y = 0
        while (count < numBlocks) {
            this.bs[y + this.blocksTall * x].setColor(color);
            y++;
            if (y >= side) {
                y = 0;
                x++;
            }
            count++;
        }
    }

    makeSquareWithColorXY(numBlocks, color, startX, startY) {

        if (numBlocks >= this.capacity) {
            throw "ya tried to make " + numBlocks + " blocks, but the capacity of these dimensions is only " + this.capacity;
        }
        let side = Math.floor(Math.sqrt(numBlocks));
        let count = 0;
        for (var x = 0; x < side; x++) {
            for (var y = 0; y < side; y++) {
                try {
                    this.bs[(y + startY) + this.blocksTall * (x + startX)].setColor(color);
                }
                catch(err) {
                    console.log("tried setcolor at block " + (y + startY) + ", " + (x + startX));
                }
                count++;
            }
        }
        y = 0
        while (count < numBlocks) {
            try {
                this.bs[(y + startY) + this.blocksTall * (x + startX)].setColor(color);
            }
            catch(err) {
                console.log("tried setcolor at block " + (y + startY) + ", " + (x + startX));
            }
            y++;
            if (y >= side) {
                y = 0;
                x++;
            }
            count++;
        }
        return side;
    }
    makeOverlappingSquare(numBlocks, color, overlapColor, startX, startY) {
        if (numBlocks >= this.capacity) {
            throw "ya tried to make " + numBlocks + " blocks, but the capacity of these dimensions is only " + this.capacity;
        }
        let side = Math.floor(Math.sqrt(numBlocks));
        let count = 0;
        for (var x = 0; x < side; x++) {
            for (var y = 0; y < side; y++) {
                try {
                    if (this.bs[(y + startY) + this.blocksTall * (x + startX)].on) {
                        // it's overlapping
                        this.bs[(y + startY) + this.blocksTall * (x + startX)].setColor(overlapColor);
                    } else {
                        this.bs[(y + startY) + this.blocksTall * (x + startX)].setColor(color);
                    }
                }
                catch(err) {
                    console.log("tried setcolor at block " + (y + startY) + ", " + (x + startX));
                }
                count++;
            }
        }
        y = 0
        while (count < numBlocks) {
            try {
                this.bs[(y + startY) + this.blocksTall * (x + startX)].setColor(color);
            }
            catch(err) {
                console.log("tried setcolor at block " + (y + startY) + ", " + (x + startX));
            }
            y++;
            if (y >= side) {
                y = 0;
                x++;
            }
            count++;
        }
        return side;
    }
    // expects a list of 3 categories that look like this: 
    // {name  : "someName",
    //  size  : someNumberOfBlocks,
    //  color : "someColorStringOrMaybeHexValue"}
    makeSquareWithCategories(categories) {
        this.allOff();
        let sum = 0;
        categories.map(c => sum += c.size);
        if (sum > this.capacity) {
            throw "you're trying to color " + sum + " blocks, but only " + this.capacity + " blocks can fit";
        }
        let side = Math.floor(Math.sqrt(sum));
        let count = 0;
        let i = 0;
        let localCount = 0;
        for (var x = 0; x < side; x++) {
            for (var y = 0; y < side; y++) {
                this.bs[y + this.blocksTall * x].setColor(categories[i].color);
                count++;
                localCount++;
                if (localCount >= categories[i].size) {
                    i++;
                    localCount = 0;
                }
            }
        }
        y = 0
        while (count < sum) {
            this.bs[y + this.blocksTall * x].setColor(categories[i].color);
            y++;
            if (y >= side) {
                y = 0;
                x++;
            }
            count++;
            localCount++;
            if (localCount >= categories[i].size) {
                i++;
                localCount = 0;
            }
        }

    }
    // expects a list of objects shaped like this:
    // {name  : "someName",
    //  size  : someNumberOfBlocks,
    //  color : "someColorStringOrMaybeHexValue"}
    colorCategories(categories) {
        // TODO: make this color in a square!
        this.allOff();
        let sum = 0;
        categories.map(c => sum += c.size);
        if (sum > this.capacity) {
            throw "you're trying to color " + sum + " blocks, but only " + this.capacity + " blocks can fit";
        }
        let count = 0;
        categories.map(c => {
            for (let n = 0; n < c.size; n++) {
                this.bs[count].setColor(c.color);
                count++;
            }
        });
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
        if (_c == "white") {
            this.on = false;
        } else {
            this.on = true;
        }
        this.c = _c;
        this.b.setAttribute("fill", this.c);
    }
}

function makeCountries(cs) {
    // this is messy code, we should talk about how to structure it.
    // starting point for drawing blocks
    x_pos = 15
    y_pos = 15
    for (var i = 0; i < cs.length; i++) {
        country = new Country(cs[i], x_pos, y_pos)
        countries.push(country)
        if (i % 2 == 0) {
            x_pos += (BS_WIDTH + BS_PADDING)
        } else {
            x_pos = 15
            y_pos += (BS_HEIGHT + BS_PADDING)
        }
    }
}

function main() {
    for (var i = 0; i < countries.length; i++) {
        // countries[i].displayPopulation();
        // countries[i].colorByCategory();
        countries[i].displayOverlap();
    }
}

function populationView() {
    console.log("HEL L O")
    for (var i = 0; i < countries.length; i++) {
        countries[i].displayPopulation();
    }
}

function gunSuicideView() {
    for (var i = 0; i < countries.length; i++) {
        countries[i].colorByCategory();
    }
}

function suicideGunOverlapView() {
    for (var i = 0; i < countries.length; i++) {
        countries[i].displayOverlap();
    }    
}

function changeView(view) {
    console.log("HELLOOOOO")
    console.log(view)
    switch(view) {
    case "0":
        console.log("HELLO")
        populationView();
        break;
    case "1":
        gunSuicideView();
        break;
    case "2":
        suicideGunOverlapView();
        break;
    case "3":
        break;
    case "4":
        break;
    default:
        break;
    }
}

function nextView() {
    var checked = $('input:radio[name=view]:checked').val();
    console.log(checked)
    var new_checked = parseInt(checked) + 1

    $('input:radio[name=view]')[new_checked].checked = true;

    var checked = $('input:radio[name=view]:checked').val();
    console.log(checked)
    
    var radio = $("#myButtons :input")
    var view;
    
    for(var i = 0; i < radio.length; i++){
        if(radio[i].checked){
            view = radio[i].id;
        }
    }
    /*
    var newView = parseInt(view) + 1
    var radiobtn = document.getElementById(String(newView));
    console.log(radiobtn)
    console.log(radiobtn.checked)
    radiobtn.checked = true;
    console.log(radiobtn.checked)
    */
}
// here's where it all begins
var countries = []
// create container to contain all things SVG
let container = document.getElementById("container");
let svg = document.createElementNS(svgns, "svg");
svg.setAttribute("width", document.getElementById("container").offsetWidth);
svg.setAttribute("height", 800);
container.appendChild(svg);


// get req to get country data.... this was truly the best way to do it
$.get( {url : "/country_data",
        success : function(data) {
            parsedData = JSON.parse(data);
            view_data = parsedData.countries;
            makeCountries(view_data); // Pass data to a function
        }
       });

$("#myButtons :input").change(function() {
    console.log(this.value); // points to the clicked input button
    changeView(this.value);
});

$("#next").click(function () {
    $('input:radio[name=view]:nth(1)').attr('checked',true);
    //$('input:radio[name=sex]')[0].checked = true;
});
