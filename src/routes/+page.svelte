<script>

    import { onMount } from 'svelte';
    import Card from '$lib/components/Card.svelte';

    let players = [
        {
            name: 'Stephen',
            score: 0,
            cardsWon: [],
        },
        {
            name: 'Kenny',
            score: 0,
            cardsWon: [],
        },
        {
            name: 'Katie',
            score: 0,
            cardsWon: [],
        }
    ]

    let cardProps = {
        quantity: [1, 2, 3],
        colors: ['red', 'green', 'purple'],
        shading: ['solid', 'striped', 'open'],
        shape: ['oval', 'squiggle', 'diamond'],
    }

    let displayCards = [];
    let drawPile = [];
    let playSpots = [];
    
    for (let i = 0; i < 12; i++) {
        playSpots.push({
            x: null,
            y: null,
            disabled: false,
        });
    }

    // Set the Z axis of the cards to stack them up in the draw pile
    function cardPileZs(){
        for (let i = 0; i < drawPile.length; i++) {
            drawPile[i].z = (drawPile.length - i) * 1.5;
        }
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
        // Loop through playSpots
        for (let i = 0; i < playSpots.length; i++) {
            // .playarea .playspot
            let spot = document.querySelector(`.playarea .playspot:nth-child(${i+1})`);
            let spotX = spot.offsetLeft;
            let spotY = spot.offsetTop;

            // Set the card's position to the spot's position
            drawPile[i].x = spotX;
            drawPile[i].y = spotY;
            drawPile[i].z = 0;
            drawPile[i].rotX = 0;
            drawPile[i].rotY = 0;
            drawPile[i].rotZ = 0;
        }
    }

    onMount(() => {
        // Generate deck of cards
        let tempCards = [];
        cardProps.quantity.forEach(quantity => {
            cardProps.colors.forEach(color => {
                cardProps.shading.forEach(shading => {
                    cardProps.shape.forEach(shape => {
                        tempCards.push({
                            quantity: quantity,
                            color: color,
                            shading: shading,
                            shape: shape,
                            id: `${quantity}-${color}-${shading}-${shape}`,
                            x: 0,
                            y: 0,
                            z: 0,
                            rotX: 0,
                            rotY: 180,
                            rotZ: 90,
                        });
                    });
                });
            });
        });
        displayCards = tempCards;
        drawPile = tempCards;
        cardPileZs();
        // shuffle(cards);
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
</style>

<div class="settlegame">
    <h1>Welcome to Settle</h1>
    <p>
        {displayCards.length} cards in the deck.
    </p>

    <button on:click={shuffle(drawPile)}>Shuffle Deck</button>
    <button on:click={deal}>Deal</button>

    <!-- <ul class="allcards">
        {#each displayCards as card}
            <li>
                <Card 
                    quantity={card.quantity} 
                    color={card.color} 
                    shading={card.shading} 
                    shape={card.shape}
                />
            </li>
        {/each}
    </ul> -->

    <div class="cardtable">
        <div class="drawarea">
            <div class="drawpile">
                {#each drawPile as card}
                    <Card 
                        quantity={card.quantity} 
                        color={card.color} 
                        shading={card.shading} 
                        shape={card.shape}
                        x={card.x}
                        y={card.y}
                        z={card.z}
                        rotX={card.rotX}
                        rotY={card.rotY}
                        rotZ={card.rotZ}
                    />
                {/each}
            </div>
        </div>
        <div class="playarea">
            {#each playSpots as spot}
                <button class="playspot" 
                    on:click|preventDefault={spotClick} 
                    disabled={spot.disabled}
                ></button>
            {/each}
        </div>
        <div class="playerarea">
            {#each players as player}
                <div class="name">{player.name}</div>
            {/each}
        </div>
    </div>
</div>




