const svgns = "http://www.w3.org/2000/svg";


// block is B_SIZE pixels square, with B_PADDING between blocks
const B_SIZE    = 4;
const B_PADDING = 2;
const B_RATIO   = B_SIZE + B_PADDING

const B_SIZE_POP = 4;
const B_PADDING_POP = 2;
const B_RATIO_POP = B_SIZE_POP + B_PADDING_POP
const POP_SCALE = 200000


const BS_LABEL_PADDING = 20
const BS_PADDING = 15
const BS_HEIGHT = 235
const BS_WIDTH = 300
const GUN_SCALE = 1

const GUN_DEATH_COLOR = "#990000";
const GUN_SUICIDE_COLOR = "#cccccc";
const SUICIDE_COLOR = "#004C99";

const VIEW_DESCRIPTION = ["A closer look at gun violence",
                          "Population",
                          "Scaling down",
                          "Five million people",
                          "Gun deaths per five million",
                          "Suicide by gun",
                          "Intersection of suicide and gun deaths",
                          "Gun deaths adjusted for suicide"
                         ]
const VIEW_COPY = ["In the United States there are 89 civilian guns for every hundred people.  That's more than twice the rate in Germany, and twenty times that in the United Kingdom, where there are fewer than 4 guns per hundred people.  These six countries are ordered (left to right, top to bottom) by the number of guns per capita.",
              "The populations of these six countries vary greatly, as well.",
              "So, we'll look at multiple gun death statistics as rates of occurrence per five million people.",
              "With one square per person, you would need forty laptops to display all five million people.  This box only fits fifteen thousand",
              "With the exception of Germany, the rate of gun death is directly proportional to gun ownership.  But many causes make up these rates.",
              "The majority of gun deaths <a href='https://fivethirtyeight.com/features/gun-deaths/'>are suicides</a>.  This raises the question of whether prevalence of guns lead to more suicides, or more people commit suicide using guns in countries where there are more guns?",
              "The intersection of gun deaths and suicide is shown in grey.  The rate of suicide across these countries is not shown to be correlated with the rate of gun deaths.  In fact, the United States has the lowest proportion of gun deaths that are suicides, at 62%, in contrast with Australia, where 83% of gun deaths are suicides.",
              "Adjusting for suicide reveals an even greater discrepacy of gun death rates between the United States and other countries of similar socio-economic status."
             ]

class Country {
    constructor(data, x, y) {
        this.name = data[0];
        this.population = data[1];
        this.gunDeaths = data[2];
        this.gunSuicide = data[3];
        this.totalSuicide = data[4];
        this.totalGuns = data[5]
        this.block = new Blocks (x, y, BS_WIDTH, BS_HEIGHT, B_SIZE_POP, B_PADDING_POP);
        this.t = document.createElementNS(svgns, "text");
        this.t.innerHTML = this.name;
        this.t.setAttribute("x", x);
        this.t.setAttribute("y", y - (BS_LABEL_PADDING / 2));
        this.block.label.appendChild(this.t);
        let c = this;
        this.block.g.addEventListener("mouseover", function (event) {
            let container = $("#info-container");
            container.html("<h3>" + c.name + "</h3><p>pop: " + c.population.toLocaleString() + "<br>gun deaths: " + c.gunDeaths.toLocaleString() + "<br>gun suicide: " + c.gunSuicide.toLocaleString() + "<br>suicide: " + c.totalSuicide.toLocaleString() + "<br>guns: " + c.totalGuns.toLocaleString() + "</p>");
        });

    }

    labelOff() {
        this.t.setAttribute("opacity", 0);
    }

    labelOn() {
        this.t.setAttribute("opacity", 100);
    }

    turnOff() {
        this.block.allOff();
    }

    displayLanding() {
        this.block.allOn();
    }

    displayGuns() {
        let gunsPer100 = this.totalGuns / (this.population / 100000)
        this.block.makeSquare(gunsPer100 / 100);
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
                  "color" : GUN_SUICIDE_COLOR};
        let c2 = {"name"  : "otherGunDeath",
                  "size"  : (this.gunDeaths - this.gunSuicide) / GUN_SCALE,
                  "color" : GUN_DEATH_COLOR};
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
                                       GUN_DEATH_COLOR);
    }

    displayGunDeathsWithSuicidesPer5Mil() {
        // clear screen
        this.block.allOff();
        // draw square for gun deaths (some color, gun deaths per 100,000)
        this.block.makeSquareWithColor(per5Mil(this.gunDeaths,
                                               this.population),
                                       GUN_DEATH_COLOR);
        this.block.makeSquareWithColor(per5Mil(this.gunSuicide,
                                               this.population),
                                       GUN_SUICIDE_COLOR);
    }

    displayGunDeathSuicideOverlapPer5Mil() {
        let c1 = {"name"  : "gunDeath",
                  "size"  : per5Mil(this.gunDeaths, this.population),
                  "color" : GUN_DEATH_COLOR};
        let c2 = {"name"  : "totalSuicide",
                  "size"  : per5Mil(this.totalSuicide, this.population),
                  "color" : SUICIDE_COLOR};
        let c3 = {"name"  : "gunSuicide",
                  "size"  : per5Mil(this.gunSuicide, this.population),
                  "color" : GUN_SUICIDE_COLOR};
        this.block.allOff();
        this.block.overlap([c1, c2, c3]);
    }

    displayGunDeathsWithoutSuicidePer5Mil() {
        this.block.allOff();
        // this.block.makeSquareWithColor(per5Mil(this.gunDeaths,
        //                                        this.population),
        //                                "grey");
        this.block.makeSquareWithColor(per5Mil(this.gunDeaths - this.gunSuicide,
                                               this.population),
                                       GUN_DEATH_COLOR);
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
        this.label = document.createElementNS(svgns, "g");
        svg.appendChild(this.g);
        svg.appendChild(this.label);
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
                    console.error("tried setcolor at block " + (y + startY) + ", " + (x + startX));
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
                console.error("tried setcolor at block " + (y + startY) + ", " + (x + startX));
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
                    console.error("tried setcolor at block " + (y + startY) + ", " + (x + startX));
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
                console.error("tried setcolor at block " + (y + startY) + ", " + (x + startX));
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
    startY = BS_LABEL_PADDING * 2;
    startX = 0;
    
    x_pos = startX;
    y_pos = startY;
    for (var i = 0; i < cs.length; i++) {
        country = new Country(cs[i], x_pos, y_pos)
        countries.push(country)
        if ((i + 1) % 3 == 0) {
            x_pos = startX;
            y_pos += (BS_HEIGHT + BS_PADDING + BS_LABEL_PADDING);
        } else {
            x_pos += (BS_WIDTH + BS_PADDING - 4);
        }
    }
}

function landingView() {
    for (var i = 0; i < countries.length; i++) {
        countries[i].displayLanding();
    }
}

function gunsView() {
    for (var i = 0; i < countries.length; i++) {
        countries[i].displayGuns();
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
    $("#title").html(VIEW_DESCRIPTION[index]);
    $("#message").html(VIEW_COPY[index]);
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
    switch(view) {
    case 0:
        // var s = Snap("#svg1");
        // var whiteRect = s.rect(0, 0,
        //                        ((BS_WIDTH + BS_PADDING) * 3) + BS_PADDING,
        //                        ((BS_HEIGHT + BS_PADDING + BS_LABEL_PADDING) * 2) + BS_LABEL_PADDING).attr({fill: "white", "fill-opacity":1});
        // whiteRect.animate({"fill-opacity": 0}, 2000)
        landingView();
        for (let n = 0; n < countries.length; n++) {
            countries[n].labelOn();
        }
        displayMessage(0);
        $("#scale-svg").next().html(String(100) + " guns");
        break;
    case 1:
        populationView();
        for (let n = 0; n < countries.length; n++) {
            countries[n].labelOn();
        }
        displayMessage(1);
        $("#scale-svg").next().html(String(POP_SCALE) + " people");
        break;
    case 2:
        populationPortionView(5000000);
        for (let n = 0; n < countries.length; n++) {
            countries[n].labelOn();
        }
        displayMessage(2);
        $("#scale-svg").next().html(String(POP_SCALE) + " people");
        break;
    case 3:
        scaleView(5000000);
        for (let n = 0; n < countries.length; n++) {
            countries[n].labelOff();
        }
        displayMessage(3);
        $("#scale-svg").next().html(String(GUN_SCALE) + " person");
        break;
    case 4:
        gunDeathsPer5Mil();
        for (let n = 0; n < countries.length; n++) {
            countries[n].labelOn();
        }
        displayMessage(4);
        $("#scale-svg").next().html(String(GUN_SCALE) + " person");
        break;
    case 5:
        gunDeathsWithSuicidesPer5Mil();
        for (let n = 0; n < countries.length; n++) {
            countries[n].labelOn();
        }
        displayMessage(5);
        $("#scale-svg").next().html(String(GUN_SCALE) + " person");
        break;
    case 6:
        gunDeathSuicideOverlapPer5Mil();
        for (let n = 0; n < countries.length; n++) {
            countries[n].labelOn();
        }
        displayMessage(6);
        $("#scale-svg").next().html(String(GUN_SCALE) + " person");
        break;
    case 7: 
        gunDeathsWithoutSuicdePer5Mil();
        for (let n = 0; n < countries.length; n++) {
            countries[n].labelOn();
        }
        displayMessage(7);
        $("#scale-svg").next().html(String(GUN_SCALE) + " person");
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
svg.id="svg1"
svg.setAttribute("width", ((BS_WIDTH + BS_PADDING) * 3) + BS_PADDING);
svg.setAttribute("height", ((BS_HEIGHT + BS_PADDING + BS_LABEL_PADDING) * 2) + BS_LABEL_PADDING);
svg.addEventListener("mouseleave", function(event) {
            $("#info-container").html("");
        });
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
