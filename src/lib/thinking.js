
// Let's sketch out our data before we start doing play logic

// Display cards move around the board
// but aren't really part of the game logic
let displayCards = { // 81 cards
    "1 red solid oval": {
        "x":0,
        "y":0,
        "z":0,
        "rotX":0,
        "rotY":0,
        "rotZ":0,
        "quantity":1,
        "color":"red",
        "shading":"solid",
        "shape":"oval"
    }
};

// The game is played by cards moving from the draw pile
// to the play spots, and then to each players pile

// Draw pile
let drawPile = {
    "x":0,
    "y":0,
    "cards":[
        {
            "name":"1 red solid oval",
            "quantity":1,
            "color":"red",
            "shading":"solid",
            "shape":"oval",
            "z":0 // Stacks upwards
        }
    ]
};

// Play spots X 12 (or 15, or 18)
let playSpots = [
    {
        "x":0,
        "y":0,
        "card": {
            "name":"1 red solid oval",
            "quantity":1,
            "color":"red",
            "shading":"solid",
            "shape":"oval",
            "z":0.001 // Slightly above table
        }
    },
    // ...
];

/* No separate overflow area

Instead of adding on a separate area with 3 more play spots, we can
have the play spot area be up to 18 spots (filled from left to right)
that adds 3 cards to the play area if there are no sets in the 12 (or 15).

This will probably require the play spots to be laid out as flexbox
instead of grid, so that they can be filled from left to right.

*/


// Card checker X 3
// Important: Cards don't move here, they are just checked
let cardChecker = [
    {
        "name":"1 red solid oval",
        "quantity":1,
        "color":"red",
        "shading":"solid",
        "shape":"oval"
    },
    // ...
];

// Players X 4
let players = [
    {
        "name":"Player 1",
        "key":"x",
        "penalty":0,
        "active":true,
        "x":0,
        "y":0,
        "cards":[
            {
                "name":"1 red solid oval",
                "quantity":1,
                "color":"red",
                "shading":"solid",
                "shape":"oval",
                "z":0 // Stacks upwards
            }
        ]
    },
    // ...
];


/* List of functions to implement

* Check play spots for empty spots
* Move card from draw pile to play spots
* Start player turn on key press
* Add card info to to card checker
* Check card checker for Set
* Move cards from play spots to player pile

*/
