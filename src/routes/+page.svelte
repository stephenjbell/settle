
<script>

    import { onMount } from 'svelte';

    // Set the card width to the width of the play area spots
    let cardWidth = 150;

    function setCardWidth(){
        let firstSpot = document.querySelector(`.playarea .playspot:nth-child(1)`);
        cardWidth = firstSpot.offsetWidth;
    }

    let players = [];
    let playerKeys = ["z","v","m","/"]; // Action key on keyboard

    for (let i = 0; i < playerKeys.length; i++) {
        players[i] = {
            name: `Player ${i + 1}`,
            key: playerKeys[i],
            active: false,
            x: 0,
            y: 0,
            z: 0,
            cards: [],
        };
    }
    
    // Create the 12 play spots
    let playSpots = [];

    for (let i = 0; i < 12; i++) {
        playSpots.push({
            x: null,
            y: null,
            z: 0.001,
            card: null, // This should only ever have 1 card in it
        });
    }

    // Shuffle deck
    function shuffle(array) {
        console.log("shuffling...");
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function deal(){
        //
    }

    // Set the location of each play spot relative to .cardtable
    function setPlaySpotLocations(){
        // Get the location of the play area (card grid)
        let playArea = document.querySelector(`.playarea`);

        // Get the location of each play spot and set to the array
        for (let i = 0; i < playSpots.length; i++) {
            let spot = document.querySelector(`.playarea .playspot:nth-child(${i+1})`);
            playSpots[i].x = spot.offsetLeft + playArea.offsetLeft;
            playSpots[i].y = spot.offsetTop + playArea.offsetTop;
        }
    }

    // Set the location of the draw pile relative to .cardtable
    function setDrawPileLocation(){
        // Get the location of the draw area
        let drawArea = document.querySelector(`.drawarea`);

        // Get the location of the draw pile
        let drawPileEl = document.querySelector(`.drawpile`);
        drawPile.x = drawPileEl.offsetLeft + drawArea.offsetLeft;
        drawPile.y = drawPileEl.offsetTop + drawArea.offsetTop;
    }

    // Set the X and Y coordinates of each player card pile
    function setPlayerCardPileLocation(){
        // Get the location of the player area
        let playerArea = document.querySelector(`.playerarea`);

        // Get the location of each player card pile
        let cardPiles = document.querySelectorAll(`.playerarea .player .cardpile`);
        for (let i = 0; i < cardPiles.length; i++) {
            players[i].x = cardPiles[i].offsetLeft + playerArea.offsetLeft;
            players[i].y = cardPiles[i].offsetTop + playerArea.offsetTop;
        }
    }

    // Create all the cards (visible and in memory)
    let cardProps = {
        quantity: [1, 2, 3],
        colors: ['red', 'green', 'purple'],
        shading: ['solid', 'striped', 'open'],
        shape: ['oval', 'squiggle', 'diamond'],
    }

    let displayCards = {};
    let drawPile = {
        x: 0,
        y: 0,
        rotZ: 90,
        cards: []
    };

    onMount(() => {
        // Generate deck of cards
        let tempDisplayCards = {};
        let tempDrawPileCards = [];

        cardProps.quantity.forEach(quantity => {
            cardProps.colors.forEach(color => {
                cardProps.shading.forEach(shading => {
                    cardProps.shape.forEach(shape => {

                        // Create all the named display cards to animate
                        tempDisplayCards[`${quantity} ${color} ${shading} ${shape}`] = {
                            quantity: quantity,
                            color: color,
                            shading: shading,
                            shape: shape,
                            x: 0,
                            y: 0,
                            z: 0,
                            rotX: 0,
                            rotY: 180,
                            rotZ: 90,
                        }

                        // Create the cards in memory to move around arrays
                        tempDrawPileCards.push({
                            name: `${quantity} ${color} ${shading} ${shape}`,
                            quantity: quantity,
                            color: color,
                            shading: shading,
                            shape: shape,
                        });
                    });
                });
            });
        });
        displayCards = tempDisplayCards;
        drawPile.cards = tempDrawPileCards;
        setCardWidth();
        // shuffle(drawPile.cards);
        setPlaySpotLocations();
        setDrawPileLocation();
        setPlayerCardPileLocation();
    });

    function spotClick(e) {

        // Get the center of the spot
        // let spotX = e.target.offsetLeft + e.target.offsetWidth / 2;
        // let spotY = e.target.offsetTop + e.target.offsetHeight / 2;
        let spotX = e.target.offsetLeft;
        let spotY = e.target.offsetTop;
        console.log(spotX, spotY);

        drawPile[0].rotY = 0;
        drawPile[0].rotZ = 0;
        drawPile[0].rotX = 0;
        drawPile[0].x = spotX;
        drawPile[0].y = spotY;
        drawPile[0].z = 0;
    }
    
</script>

<style>
    @import '$lib/styles/page.scss';
    @import '$lib/styles/card.scss';
</style>

<h2>Display Cards</h2>
<ol>
    {#each Object.keys(displayCards) as cardName}
        <li>{displayCards[cardName].quantity} {displayCards[cardName].color} {displayCards[cardName].shading} {displayCards[cardName].shape}</li>
    {/each}
</ol>

<h2>Draw Pile {drawPile.cards.length}</h2>
{drawPile.x} {drawPile.y}
<ol>
    {#each drawPile.cards as card}
        <li>{card.name}</li>
    {/each}
</ol>

<h2>Play Spots</h2>
<ol>
    {#each playSpots as spot}
        <li>{spot.x} {spot.y}</li>
    {/each}
</ol>

<h2>Players</h2>
<ol>
    {#each players as player}
        <li>{player.name} {player.x} {player.y}</li>
    {/each}
</ol>

<div class="settlegame">
    <h1>Settle</h1>
    <p>
        {drawPile.cards.length} cards in the draw pile.
    </p>

    <button on:click={shuffle(drawPile)}>Shuffle Deck</button>
    <button on:click={deal}>Deal</button>

    <div class="cardtable" style="--cardWidth:{cardWidth}px;">
        <div class="drawarea">
            <div class="drawpile">
                {#each Object.keys(displayCards) as cardName, i}
                    <div 
                        class="card quantity{displayCards[cardName].quantity} {displayCards[cardName].color} {displayCards[cardName].shading} {displayCards[cardName].shape}" 
                        style="--x: {displayCards[cardName].x}; --y: {displayCards[cardName].y}; --i: {i}; --rotX: {displayCards[cardName].rotX}; --rotY: {displayCards[cardName].rotY}; --rotZ: {displayCards[cardName].rotZ}; --delay: {drawPile.length - i - 1}; "
                        >
                        <div class="back"></div>
                        <div class="front">
                            {#each Array(displayCards[cardName].quantity) as _}
                                <img src="/images/shapes/{displayCards[cardName].color}-{displayCards[cardName].shading}-{displayCards[cardName].shape}.svg" alt="">
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
        <div class="playarea">
            {#each playSpots as spot}
                <button class="playspot" 
                    on:click|preventDefault={spotClick} 
                    disabled={spot.card === null}
                ></button>
            {/each}
        </div>
        <div class="playerarea">
            {#each players as player, i}
                <div class="player">
                    <div class="cardpile"></div>
                    <div class="name" bind:innerHTML={players[i].name} contenteditable></div>
                    <div class="key">
                        Press <span class="letter">{player.key.toUpperCase()}</span>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>




