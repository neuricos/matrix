/* author: Zetian Chen
 * description: This is a javascript file adding animation to file index.html
 */

/* Global variables:
 *     bgColor: the background color of the canvas
 *     bgOpct: the opacity of the background
 *     symSize: the font size of each symbol
 *     symRange: the code range of symbols
 *     maxOpct: the maximum opacity
 *     fdInt: interval after which the color of symbols fades
 *     lines: an empty array to contain line objects
 *     switchInt: the interval after which a symbol switch to another symbol
 *     colorScheme: current color scheme sequence
 *     schemes: 5 rgb color scheme sets
 */
var bgColor = 0;
var bgOpct = 120;
var symSize = 18;
var symRange = 96;
var maxOpct = 255;
var fdInt = 1.6;
var lines = [];
var switchInt = 5;
var colorScheme = 0;
var schemes = [
    // dark green
    [
        [140, 255, 170],
        [32, 194, 14]
    ],
    // dark blue
    [
        [169, 233, 248],
        [40, 136, 217]
    ],
    // purple
    [
        [184, 181, 222],
        [91, 83, 196]
    ],
    // dark red
    [
        [251, 172, 196],
        [246, 35, 28]
    ],
    // golden
    [
        [245, 236, 170],
        [244, 208, 58]
    ]
];

function setup() {
    var minSymNum = 6;
    var maxSymNum = 36;
    var minSpd = 5;
    var maxSpd = 20;
    var xCoor = 0;

    /* create a canvas covering the whole screen */
    createCanvas(window.innerWidth, window.innerHeight);
    background(bgColor);

    /* create lines covering the whole screen width */
    for (var i = 0; i <= width / symSize; i ++) {
        var line = new Line(minSymNum, maxSymNum, minSpd, maxSpd);
        line.genSyms(xCoor, random(-2000, 0));
        lines.push(line);
        xCoor += symSize;
    }

    /* set an interval to switch the color scheme */
    setInterval(function() {
            colorScheme = (colorScheme + 1) % schemes.length;
        }, switchInt * 1000);
    textFont('Kokoro');
    textSize(symSize);
};

function draw() {
    background(bgColor, bgOpct);
    lines.forEach(function(line) {
        line.render();
    });
};

function Sym(xCoor, yCoor, spd, fst, opct) {
    this.xCoor = xCoor;
    this.yCoor = yCoor;
    this.spd = spd;
    this.fst = fst;
    this.opct = opct;

    this.val;
    this.tsfInt = round(random(2, 25));

    this.setSym = function() {
        if (frameCount % this.tsfInt == 0) {
            this.val = (round(random(0, 7)) > 1) ?
                String.fromCharCode(
                    0x30A0 + round(random(0, symRange))
                ): round(random(0, 9)
            );
        }
    };

    this.fall = function() {

        /* if the symbol is below the canvas, then move it to the top of the canvas */
        this.yCoor = (this.yCoor >= height) ? 0 : (this.yCoor + this.spd);
    };
};

function Line(minSymNum, maxSymNum, minSpd, maxSpd) {
    this.syms = [];
    this.totalSyms = round(random(minSymNum, maxSymNum));
    this.spd = random(minSpd, maxSpd);

    this.genSyms = function(xCoor, yCoor) {
        var opct = maxOpct;
        var fst = round(random(0, 4)) == 1;
        for (var i = 0; i <= this.totalSyms; i ++) {
            var sym = new Sym(xCoor, yCoor, this.spd, fst, opct);
            sym.setSym();
            this.syms.push(sym);
            opct -= (maxOpct / this.totalSyms) / fdInt;
            yCoor -= symSize;
            fst = false;
        }
    };

    this.render = function() {
        this.syms.forEach(function(sym) {

            /* if the symbol is the first of its line, then set it to special rgb color
             * otherwise, set it to the general rgb color
             */
            if (sym.fst) {
                fill(
                    schemes[colorScheme][0][0],
                    schemes[colorScheme][0][1],
                    schemes[colorScheme][0][2],
                    sym.opct
                );
            } else {
                fill(
                    schemes[colorScheme][1][0],
                    schemes[colorScheme][1][1],
                    schemes[colorScheme][1][2],
                    sym.opct
                );
            }
            text(sym.val, sym.xCoor, sym.yCoor);
            sym.fall();
            sym.setSym();
        });
    };
};