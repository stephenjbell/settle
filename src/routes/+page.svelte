
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

    let cardProps = {
        quantity: [1, 2, 3],
        color: ['red', 'green', 'purple'],
        shading: ['solid', 'striped', 'open'],
        shape: ['oval', 'squiggle', 'diamond'],
    }

    // Card checker
    let cardChecker = [];
    let cardCheckerResults = {
        set: false,
        properties: []
    };

    function checkCards(){

        cardCheckerResults.set = true;

        // ["quantity","color","shading","shape"];
        let props = Object.keys(cardProps);

        props.forEach (prop => {
            // Are the cards all the same for this property?
            if(cardChecker[0][prop] === cardChecker[1][prop] && cardChecker[1][prop] === cardChecker[2][prop]){
                cardCheckerResults.properties.push([prop, "same"]);

            // Are the cards all different for this property?
            } else if(cardChecker[0][prop] !== cardChecker[1][prop] && cardChecker[1][prop] !== cardChecker[2][prop] && cardChecker[0][prop] !== cardChecker[2][prop]){
                cardCheckerResults.properties.push([prop, "different"]);

            // If neither of the above, then it's not a set
            } else {
                cardCheckerResults.properties.push([prop, "noset"]);
                cardCheckerResults.set = false;
            }
        });

        if(cardCheckerResults.set){
            console.log("That's a set!");
            // TODO: Move cards to player's pile
        }

        cardCheckerResults = cardCheckerResults; // Tell Svelte to update variable
    }

    function addCardToChecker(i){

        // If there's no currentPlayer, return false
        if(currentPlayer === null){
            noPlayerWarning = "show";
            // Turn off noPlayerWarning after 3 seconds
            setTimeout(() => {
                noPlayerWarning = "";
            }, 3000);
            return false;
        } 

        // If card is already in the checker, don't add it
        if(cardChecker.find(card => card.name === playSpots[i].card.name)){
            return false;
        }

        // Add card to checker
        if(cardChecker.length < 3){
            cardChecker = [...cardChecker, playSpots[i].card];

            // Check cards if there are 3
            if(cardChecker.length === 3){
                checkCards();
            }
        }

        
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
        fillPlaySpots();
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
            cardProps.color.forEach(color => {
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
        
        updateDisplayCards();
        
        // Wait 1ms to set up cards and then deal()
        setTimeout(() => {
            deal();
        }, 1);
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
            displayCards[drawPile.cards[i].name].rotY = -180;
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

        drawPile = drawPile; // Tell Svelte to update variable
        updateDisplayCards();
    }

    let currentPlayer = null;
    let noPlayerWarning = "";

    function playerTurn(i){
        currentPlayer = i;
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
                <pre>{JSON.stringify(drawPile,null,2)}</pre>
            </div>
            <div class="column">
                <h2>Play Spots</h2>
                <pre>{JSON.stringify(playSpots,null,2)}</pre>
            </div>
            <div class="column">
                <h2>Player Card Piles</h2>
                <pre>{JSON.stringify(players,null,2)}</pre>
            </div>
        </div>
    </details>
{/if}

<div class="settlegame">
    <h1>Settle</h1>

    <!-- <button class="ui-button" on:click|preventDefault={deal}>Deal</button> -->

    <div class="noplayerwarning {noPlayerWarning}">Select a player.</div>

    {#if currentPlayer !== null}
        <div class="currentplayer">
            <h2>{players[currentPlayer].name}'s Turn!</h2>

            <div class="cardchecker">
                <div class="cards">
                    {#each {length:3} as _, i}
                        <div class="cardslot">
                            {#if cardChecker[i]}
                                <div class="card quantity{cardChecker[i].quantity} {cardChecker[i].color} {cardChecker[i].shading} {cardChecker[i].shape}" >
                                    <div class="front">
                                        {#each Array(cardChecker[i].quantity) as _}
                                            <img src="/images/shapes/{cardChecker[i].color}-{cardChecker[i].shading}-{cardChecker[i].shape}.svg" alt="">
                                        {/each}
                                    </div>
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
                {#if cardChecker.length === 3}
                    <div class="message">
                        <ul>
                            {#each cardCheckerResults.properties as result}
                                <li class="{result[1]}">
                                    {#if result[1] === "same" || result[1] === "different"}
                                        ✅
                                    {:else}
                                        ❌
                                    {/if}
                                    {result[0]}
                                </li>
                            {/each}
                        </ul>
                    </div>

                    <div class="result">
                        {#if cardCheckerResults.set}
                            <strong>Set!</strong>
                        {:else}
                            <strong>No Set.</strong>
                        {/if}
                    </div>
                {/if}
                
                
            </div>

        </div>
    {/if}

    

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
                        --delay:{displayCards[cardName].delay};
                    "
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
        <div class="drawarea">
            <div class="drawpile">
            </div>
        </div>
        <div class="playarea">
            {#each playSpots as spot, i}
                <button class="playspot"
                    on:click|preventDefault={() => addCardToChecker(i)}
                    disabled={spot.card === null}
                ></button>
            {/each}
        </div>
        <div class="playerarea">
            {#each players.filter(player => player.active) as player, i}
                <div class="player">
                    <button class="cardpile" on:click|preventDefault={() => playerTurn(i)}></button>
                    <button class="key" on:click|preventDefault={() => playerTurn(i)}>
                        Press <span class="letter">{player.key.toUpperCase()}</span>
                    </button>
                    <div class="name" bind:innerHTML={players[i].name} contenteditable></div>
                </div>
            {/each}
        </div>
    </div>
</div>




