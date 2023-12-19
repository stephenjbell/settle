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

    // Shuffle deck
    function shuffle(array) {
        console.log("shuffling...");
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
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
                            id: `${quantity}-${color}-${shading}-${shape}`
                        });
                    });
                });
            });
        });
        displayCards = tempCards;
        drawPile = tempCards;
        // shuffle(cards);
    });
    
</script>

<style lang="scss">

    .settlegame {
        background-color: #4e4b46;
        color: #fff;
        padding: 2rem;
        perspective: 1000px;

        h1 {
            color: #24BC3C;
        }

        button {
            background-color: #F14F2C;
            color: #fff;
            border: none;
            border-radius: 0.5rem;
            padding: 0.5rem 1rem;
            font-size: 2em;
            cursor: pointer;
            transition: 0.2s all ease-in-out;

            &:hover {
                background-color: #e0401c;
            }
        }

        ul.allcards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            list-style-type: none;
            padding: 0;
        }

        .cardtable {
            display: grid;
            grid-template-columns: 1fr 3fr;
            grid-template-areas: 
                "drawarea playarea"
                ". playerarea";
            gap: 2rem;
            transform-origin: center bottom;
            transform: rotateX(30deg);

            .drawarea {
                .drawpile {
                    position:relative;
                    .card {
                        position: absolute;
                        left: 0;
                        top:0;
                    }
                }
            }

            .playarea {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                grid-template-rows: repeat(3, 1fr);
                gap: 1rem;

                .playspot {
                    display: block;
                    background-color: rgba(255,255,255,0.1);
                    width: 100%;
                    aspect-ratio: 3.5/2.5;
                }
            }
        }
    }
    
</style>

<div class="settlegame">
    <h1>Welcome to Settle</h1>
    <p>
        {displayCards.length} cards in the deck.
    </p>

    <button on:click={shuffle(drawPile)}>Shuffle Deck</button>

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
                    />
                {/each}
            </div>
        </div>
        <div class="playarea">
            {#each Array(12) as _}
                <div class="playspot"></div>
            {/each}
        </div>
        <div class="playerarea">
            {#each players as player}
                <div class="name">{player.name}</div>
            {/each}
        </div>
    </div>
</div>




