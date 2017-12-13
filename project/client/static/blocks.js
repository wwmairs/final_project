const svgns = "http://www.w3.org/2000/svg";


// block is B_SIZE pixels square, with B_PADDING between blocks
const B_SIZE    = 4;
const B_PADDING = 2;
const B_RATIO   = B_SIZE + B_PADDING

const B_SIZE_POP = 4;
const B_PADDING_POP = 2;
const B_RATIO_POP = B_SIZE_POP + B_PADDING_POP
const POP_SCALE = 200000

const BS_PADDING = 15
const BS_HEIGHT = 235
const BS_WIDTH = 300
const GUN_SCALE = 10

const MESSAGES = ["this is our final project",
                  "here are the populations of each country",
                  "something different will happen here soon",
                  "woah, changed scale on ya; this is the number of gun deaths per 5 million people",
                  "oh shit, that blue stuff is all the gun deaths caused by suicide",
                  "let's look at the intersection between gun deaths and suicide",
                  "now the red is all gun deaths whose cause is not suicide",
                  "these are out of order"]

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
        this.block = new Blocks (x, y, BS_WIDTH, BS_HEIGHT, B_SIZE_POP, B_PADDING_POP)
    }

    turnOff() {
        this.block.allOff();
    }

    displayBlah() {
        this.block.allOn();
    }

    updateBlocks(size, padding) {
        this.block.changeBlockSize(size, padding)
    }

    displayPopulation() {
        this.block.allOff();
        this.updateBlocks(B_SIZE_POP, B_PADDING_POP)
        var numBlocks = Math.floor(this.population / POP_SCALE)
        this.block.makeSquare(numBlocks)
        
    }

    displayPopulationPortion(val) {
        var portion = val / POP_SCALE
        this.block.makeSquare(portion)
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

    displayGunDeathsPer5Mil() {
        // clear screen
        this.block.allOff();
        // draw square for gun deaths (some color, gun deaths per 100,000)
        this.block.makeSquareWithColor(per5Mil(this.gunDeaths,
                                               this.population),
                                       "red");
    }

    displayGunDeathsWithSuicidesPer5Mil() {
        // clear screen
        this.block.allOff();
        // draw square for gun deaths (some color, gun deaths per 100,000)
        this.block.makeSquareWithColor(per5Mil(this.gunDeaths,
                                               this.population),
                                       "red");
        this.block.makeSquareWithColor(per5Mil(this.gunSuicide,
                                               this.population),
                                       "blue");
    }

    displayGunDeathSuicideOverlapPer5Mil() {
        let c1 = {"name"  : "gunDeath",
                  "size"  : per5Mil(this.gunDeaths, this.population),
                  "color" : "red"};
        let c2 = {"name"  : "totalSuicide",
                  "size"  : per5Mil(this.totalSuicide, this.population),
                  "color" : "blue"};
        let c3 = {"name"  : "gunSuicide",
                  "size"  : per5Mil(this.gunSuicide, this.population),
                  "color" : "purple"};
        this.block.allOff();
        this.block.overlap([c1, c2, c3]);
    }

    displayGunDeathsWithoutSuicidePer5Mil() {
        this.block.allOff();
        this.block.makeSquareWithColor(per5Mil(this.gunDeaths,
                                               this.population),
                                       "grey");
        this.block.makeSquareWithColor(per5Mil(this.gunDeaths - this.gunSuicide,
                                               this.population),
                                       "red");
    }
}

class Scale {
    constructor(container, scale) {
        this.b = new Block(scaleSvg, B_SIZE_POP, 10, 10, "black");
        $("#scale-svg").next().html(scale);
    }
}

class Blocks {
    constructor(_x, _y, width, height, size, padding) {
        this.x  = _x;
        this.y  = _y;
        this.w  = width;
        this.h  = height;
        this.bs = [];
        this.g  = document.createElementNS(svgns, "g");
        this.g.setAttribute("class", "block-chart");
        svg.appendChild(this.g);
        // make an array of Block s
        this.blocksWide = Math.ceil(width / (size + padding));
        this.blocksTall = Math.ceil(height / (size + padding));
        this.capacity = this.blocksWide * this.blocksTall;
        let counter = 0
        for (let i = 0; i < this.blocksWide; i++) {
            for (let j = 0; j < this.blocksTall; j++) {
                this.bs[counter] = new Block(this.g, size, this.x + i * (size + padding), this.y + j * (size + padding), "black");
                counter++;
            }
        }
    }

    changeBlockSize(size, padding) {
        let counter = 0
        for (let i = 0; i < this.blocksWide; i++) {
            for (let j = 0; j < this.blocksTall; j++) {
                this.bs[counter].updatePosition(this.x + i * (size + padding), this.y + j * (size + padding), size)
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
        console.log("first side: ", firstSide);
        console.log("overlap should have ", cs[2].size, " blocks");
        let diff = Math.floor(Math.sqrt(cs[2].size));
        this.makeOverlappingSquare(cs[1].size, cs[1].color, cs[2].color, firstSide - diff + 1, firstSide - diff + 1);
    }

    makeSquare(numBlocks) {
        this.allOff();
        if (numBlocks > this.capacity) {
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
    constructor(container, size, _x, _y, _c) {
        this.parent = container;
        this.x = _x;
        this.y = _y;
        this.c = _c;
        this.on = true;
        this.b = document.createElementNS(svgns, "rect");
        this.b.setAttribute("x", this.x);
        this.b.setAttribute("y", this.y);
        this.b.setAttribute("width", size);
        this.b.setAttribute("height", size);
        this.parent.appendChild(this.b);
        let parent = this;
        this.b.addEventListener("click", function(event) {
            parent.toggle();
        });
    }

    updatePosition(_x, _y, size) {
        this.x = _x;
        this.y = _y;
        this.b.setAttribute("width", size);
        this.b.setAttribute("height", size);
        this.b.setAttribute("x", this.x);
        this.b.setAttribute("y", this.y);
    }

    turnOff() {
        this.on = false;
        this.b.setAttribute("opacity", 0);
    }
    turnOn() {
        this.on = true;
        this.b.setAttribute("fill", "black");
        this.b.setAttribute("opacity", 100);
    }

    toggle() {
        this.on = ! this.on;
        this.on ? this.b.setAttribute("fill", this.c) : this.b.setAttribute("fill", "white");
    }

    setColor(_c) {
        if (_c == "white") {
            this.on = false;
        } else {
            this.b.setAttribute("opacity", 100)
            this.on = true;
        }
        this.c = _c;
        this.b.setAttribute("fill", this.c);
    }
}

function makeCountries(cs) {
    // this is messy code, we should talk about how to structure it.
    // starting point for drawing blocks
    startY = BS_PADDING;
    startX = BS_PADDING;
    
    x_pos = startX;
    y_pos = startY;
    for (var i = 0; i < cs.length; i++) {
        country = new Country(cs[i], x_pos, y_pos)
        countries.push(country)
        if ((i + 1) % 3 == 0) {
            x_pos = startX;
            y_pos += (BS_HEIGHT + BS_PADDING);
        } else {
            x_pos += (BS_WIDTH + BS_PADDING);
        }
    }
}

function blahView() {
    console.log('HELLOOOO O O O');
    for (var i = 0; i < countries.length; i++) {
        countries[i].displayBlah();
    }
}

function populationView() {
    for (var i = 0; i < countries.length; i++) {
        countries[i].displayPopulation();
    }
}

function populationPortionView(val) {
    for (var i = 0; i < countries.length; i++) {
        countries[i].displayPopulationPortion(val);
    }    
}

function scaleView(val) {
    for (var i = 0; i < countries.length; i++) {
        countries[i].turnOff(val);
    }
    b.allOn()
    crazyNumber = 5000000 / b.capacity;
    console.log(crazyNumber);
}

function per5Mil(value, population) {
    // is ceiling wrong here? I'm not sure -w
    let ratio = population / 5000000;
    return Math.ceil(value / ratio);
}

function gunDeathsPer5Mil() {
    for (var i = 0; i < countries.length; i++) {
        countries[i].displayGunDeathsPer5Mil();
    }    
}
function gunDeathsWithSuicidesPer5Mil() {
    for (var i = 0; i < countries.length; i++) {
        countries[i].displayGunDeathsWithSuicidesPer5Mil();
    }    
}
function gunDeathSuicideOverlapPer5Mil() {
    for (var i = 0; i < countries.length; i++) {
        // clear screen
        countries[i].displayGunDeathSuicideOverlapPer5Mil();
        // draw overlapping gun deaths and suicides
    }   

}

function gunDeathsWithoutSuicdePer5Mil() {
    for (var i = 0; i < countries.length; i++) {
        // clear screen
        countries[i].displayGunDeathsWithoutSuicidePer5Mil();
        // draw overlapping gun deaths and suicides
    } 
}

function displayMessage(index) {
    $("#message").html(MESSAGES[index]);
}

// views that we need
// Maybe this one'll be implemented once the rest are done (?)
// 1. pop of all countries
// Katya's doing these ones
// 2. separate countries, display pop of each
// 3. turn into 100,000, so they're all the same size
// 4. show gun deaths per overlaid on top of 100,000
// Will's doing these ones
// 5. only show gun deaths
// 6. show percent of gun deaths that are suicides
// 7. overlap gun deaths and suicides
// 8. show gun deaths that AREN'T suicides

function changeView(view) {
    b.allOff()
    // console.log("in changeView, view = ", view);
    // console.log("view is this type: ", typeof(view));
    switch(view) {
    case 0:
        console.log("trying to change to blahView");
        blahView();
        displayMessage(0);
        break;
    case 1:
        console.log("trying to change to populationView");
        populationView();
        displayMessage(1);
        break;
    case 2:
        console.log("trying to change to populationPortionView");
        populationPortionView(5000000);
        displayMessage(2);
        break;
    case 3:
        console.log("trying to change to scaleView");        
        scaleView(5000000);
        displayMessage(3);
        break;
    case 4:
        console.log("trying to change to gunDeathsPer5Mil");
        gunDeathsPer5Mil();
        displayMessage(4);
        break;
    case 5:
        console.log("trying to change to gunDeathsWithSuicidesPer5Mil");
        gunDeathsWithSuicidesPer5Mil();
        displayMessage(5);
        break;
    case 6:
        console.log("trying to change to gunDeathSuicideOverlapPer5Mil");
        gunDeathSuicideOverlapPer5Mil();
        displayMessage(6);
        break;
    case 7: console.log("trying to change to gunDeathsWithoutSuicdePer5Mil");
        gunDeathsWithoutSuicdePer5Mil();
        displayMessage(7);
        break;
    default:
        console.log("default case in changeView switch\nwe shouldn't be here");
        break;
    }
}

function nextView() {
    var selectedButton = $(".btn-default.active");
    selectedButton.removeClass("active");
    nextButton(selectedButton).classList.add("active");
    // get val of child of selectedButton, send that to changeView
    var next = $(".btn-default.active");
    changeView(parseInt(next.children()[0].value));
}

function nextButton(currentButton) {
    let next = currentButton.next();
    if (next.length == 0) {
        return currentButton.siblings()[0];
    } else {
        return next[0];
    }
}

// here's where it all begins
var countries = []
let container = document.getElementById("container");
let svg = document.createElementNS(svgns, "svg");
svg.setAttribute("width", ((BS_WIDTH + BS_PADDING) * 3) + BS_PADDING);
svg.setAttribute("height", ((BS_HEIGHT + BS_PADDING) * 2) + BS_PADDING);
container.appendChild(svg);
let scaleContainer = document.getElementById("scale-svg");
let scaleSvg = document.createElementNS(svgns, "svg");
scaleSvg.setAttribute("width", 20);
scaleSvg.setAttribute("height", 20);
scaleContainer.appendChild(scaleSvg);
let scale = new Scale(scaleContainer, POP_SCALE);

var width = svg.getAttribute("width")
var height = svg.getAttribute("height")
var b = new Blocks (15, 15, width, height, B_SIZE_POP, B_PADDING_POP)
b.allOff()

// get req to get country data
$.get( {url : "/country_data",
        success : function(data) {
            parsedData = JSON.parse(data);
            view_data = parsedData.countries;
            makeCountries(view_data); // Pass data to a function
            changeView(0);
        }
       });

$("#myButtons :input").change(function() {
    changeView(parseInt(this.value));
});

$("#next").click(function () {
    nextView();
    $('input:radio[name=view]:nth(1)').attr('checked',true);
    //$('input:radio[name=sex]')[0].checked = true;
});


// TODO: update scale when necessary