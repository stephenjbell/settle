
<script>

    import { onDestroy, onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { page } from '$app/stores'

    // Set debug variable to true or false
    let debug = $page.url.searchParams.get('debug');

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
            active: true,
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
            i: 0, // Index of cards up from the bottom, sets Z
            rotX: 0,
            rotY: 0,
            rotZ: 0,
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

    // Get the offset of an element relative to .cardtable
    function cardTableOffset(el){
        let cardTable = document.querySelector(`.cardtable`);

        // Break out of loop if element isn't a descendant of cardTable
        if(!cardTable.contains(el)) return false;

        // Get middle of element
        let offset = {
            x: el.offsetLeft + el.offsetWidth / 2,
            y: el.offsetTop + el.offsetHeight / 2,
        }

        let parent = el.offsetParent;
        while(parent !== cardTable){
            offset.x += parent.offsetLeft;
            offset.y += parent.offsetTop;
            parent = parent.offsetParent;
        }
        return offset;
    }

    // Set the location of each play spot relative to .cardtable
    function setPlaySpotLocations(){

        // Get the location of each play spot and set to the array
        for (let i = 0; i < playSpots.length; i++) {
            let spot = document.querySelector(`.playarea .playspot:nth-child(${i+1})`);

            // Set offsets using cardTableOffset function instead
            let offset = cardTableOffset(spot);
            playSpots[i].x = offset.x;
            playSpots[i].y = offset.y;
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

    function handleKeydown(e) {
        // If we're editing a field, textarea or a contenteditable div, don't do anything
        if (e.target.nodeName === 'INPUT' || e.target.nodeName === 'TEXTAREA' || e.target.isContentEditable) return;

        // If we're holding down a modifier key, don't do anything
        if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;

        for (let i = 0; i < players.length; i++) {
            if(e.key === players[i].key && players[i].active){
                playerTurn(i);
            }
        }
    }

    onMount(() => {
        if(browser){
            window.addEventListener('keydown', handleKeydown);
        }

        // Generate deck of cards
        let tempDisplayCards = {};
        let tempDrawPileCards = [];

        cardProps.quantity.forEach(quantity => {
            cardProps.colors.forEach(color => {
                cardProps.shading.forEach(shading => {
                    cardProps.shape.forEach(shape => {

                        let viewBox; // The dimensions of the SVG shape
                        switch (shape) {
                            case 'oval':
                                viewBox = [53,112];
                                break;
                            case 'squiggle':
                                viewBox = [55,106];
                                break;
                            case 'diamond':
                                viewBox = [62,119];
                                break;
                        }

                        // Create all the named display cards to animate
                        tempDisplayCards[`${quantity} ${color} ${shading} ${shape}`] = {
                            quantity: quantity,
                            color: color,
                            shading: shading,
                            shape: shape,
                            viewBox: viewBox,
                            x: 0,
                            y: 0,
                            z: 0,
                            rotX: 0,
                            rotY: 0,
                            rotZ: 0,
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
        shuffle(drawPile.cards);

        // Set x and y coordinates of each card location
        setPlaySpotLocations();
        setDrawPileLocation();
        setPlayerCardPileLocation();

        // Fill empty play spots with cards
        fillPlaySpots();
    });

    onDestroy(() => {
        if(browser){
            window.removeEventListener('keydown', handleKeydown);
        }
    });

    function updateDisplayCards(){

        // Check draw pile for cards, then move displayCards there
        for (let i = 0; i < drawPile.cards.length; i++) {
            // Set card to draw pile location
            displayCards[drawPile.cards[i].name].x = drawPile.x;
            displayCards[drawPile.cards[i].name].y = drawPile.y;
            displayCards[drawPile.cards[i].name].z = i;
            displayCards[drawPile.cards[i].name].delay = drawPile.cards.length - i - 1;
            displayCards[drawPile.cards[i].name].rotX = 0;
            displayCards[drawPile.cards[i].name].rotY = 180;
            displayCards[drawPile.cards[i].name].rotZ = drawPile.rotZ;
        }

        // Check play spots for cards, then move displayCards there
        for (let i = 0; i < playSpots.length; i++) {
            // Check if there's a card in the spot
            if(playSpots[i].card !== null){
                // If so, update the display card
                displayCards[playSpots[i].card.name].x = playSpots[i].x;
                displayCards[playSpots[i].card.name].y = playSpots[i].y;
                displayCards[playSpots[i].card.name].z = 0.01;
                displayCards[playSpots[i].card.name].rotX = playSpots[i].rotX;
                displayCards[playSpots[i].card.name].rotY = playSpots[i].rotY;
                displayCards[playSpots[i].card.name].rotZ = playSpots[i].rotZ;
            }
        }

        // Check player card piles for cards

    }

    function fillPlaySpots(){
        // Fill the play spots with cards
        for (let i = 0; i < playSpots.length; i++) {
            // Check if there's a card in the spot
            if(playSpots[i].card === null){
                // If not, add a card
                playSpots[i].card = drawPile.cards.pop();
            }
        }

        updateDisplayCards();
    }

    function playerTurn(i){
        let playerName = players[i].name;
        console.log(`${playerName}'s turn!`);
    }
    
</script>

<style>
    @import '$lib/styles/page.scss';
</style>

{#if debug === "true"}
    <details class="debug">
        <summary>Display Cards</summary>
        <ol>
            {#each Object.keys(displayCards) as cardName}
                <li>{displayCards[cardName].quantity} {displayCards[cardName].color} {displayCards[cardName].shading} {displayCards[cardName].shape}</li>
            {/each}
        </ol>
    </details>

    <details class="debug" open>
        <summary>Card Arrays</summary>
        <div class="cardcolumns">
            <div class="column">
                <h2>Draw Pile {drawPile.cards.length}</h2>
                {drawPile.x} {drawPile.y}
                <ol>
                    {#each drawPile.cards as card}
                        <li>{card.name}</li>
                    {/each}
                </ol>
            </div>
            <div class="column">
                <h2>Play Spots</h2>
                <ol>
                    {#each playSpots as spot}
                        <li>
                            <strong>{spot.x},{spot.y}</strong>
                            <ul>
                                {#if spot.card !== null}
                                    <li>{spot.card.name}</li>
                                {/if}
                            </ul>
                        </li>
                    {/each}
                </ol>
            </div>
            <div class="column">
                <h2>Player Card Piles</h2>
                <ol>
                    {#each players as player}
                        <li>
                            <strong>{player.name} ({player.x},{player.y})</strong>
                            <ol>
                                {#each player.cards as card}
                                    <li>{card.name}</li>
                                {/each}
                            </ol>
                        </li>
                    {/each}
                </ol>
            </div>
        </div>
    </details>
{/if}

<div class="settlegame">
    <h1>Settle</h1>
    <p>
        {drawPile.cards.length} cards in the draw pile.
    </p>

    <button class="ui-button" on:click={shuffle(drawPile)}>Shuffle Deck</button>
    <button class="ui-button" on:click={deal}>Deal</button>

    <div class="cardtable" style="--cardWidth:{cardWidth}px;">
        <div class="displaycards">
            {#each Object.keys(displayCards) as cardName, i}
                <div 
                    class="card quantity{displayCards[cardName].quantity} {displayCards[cardName].color} {displayCards[cardName].shading} {displayCards[cardName].shape}" 
                    style="
                        --x:{displayCards[cardName].x};
                        --y:{displayCards[cardName].y};
                        --z:{displayCards[cardName].z};
                        --rotX:{displayCards[cardName].rotX};
                        --rotY:{displayCards[cardName].rotY};
                        --rotZ:{displayCards[cardName].rotZ};
                        --delay:{drawPile.length - i - 1};
                    "
                    >
                    <div class="back"></div>
                    <div class="front">
                        {#each Array(displayCards[cardName].quantity) as _}
                            <svg width="{displayCards[cardName].viewBox[0]}" height="{displayCards[cardName].viewBox[1]}" viewBox="0 0 {displayCards[cardName].viewBox[0]} {displayCards[cardName].viewBox[1]}" xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="xMinYMin">
                                <use xlink:href="#img-{displayCards[cardName].color}-{displayCards[cardName].shading}-{displayCards[cardName].shape}"></use>
                            </svg>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
        <div class="drawarea">
            <div class="drawpile">
            </div>
        </div>
        <div class="playarea">
            {#each playSpots as spot}
                <button class="playspot" 
                    disabled={spot.card === null}
                ></button>
            {/each}
        </div>
        <div class="playerarea">
            {#each players.filter(player => player.active) as player, i}
                <div class="player">
                    <button class="cardpile" on:click={() => playerTurn(i)}></button>
                    <button class="key" on:click={() => playerTurn(i)}>
                        Press <span class="letter">{player.key.toUpperCase()}</span>
                    </button>
                    <div class="name" bind:innerHTML={players[i].name} contenteditable></div>
                </div>
            {/each}
        </div>
    </div>
</div>




