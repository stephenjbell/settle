<script>

    import { onMount } from 'svelte';
    import Card from '$lib/components/Card.svelte';

    let cardProps = {
        quantity: [1, 2, 3],
        colors: ['red', 'green', 'purple'],
        shading: ['solid', 'striped', 'open'],
        shape: ['oval', 'squiggle', 'diamond'],
    }

    let cards = [];

    // Shuffle deck
    function shuffle() {
        console.log("shuffling...");
        for (let i = cards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
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
                        });
                    });
                });
            });
        });
        cards = tempCards;
        // shuffle(cards);
    });
    
</script>

<style lang="scss">

    .settlegame {
        background-color: #4e4b46;
        color: #fff;
        padding: 2rem;

        h1 {
            color: #24BC3C
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

        ul {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            list-style-type: none;
            padding: 0;
        }
    }
    
</style>

<div class="settlegame">
    <h1>Welcome to Settle</h1>
    <p>
        {cards.length} cards in the deck.
    </p>

    <button on:click={shuffle}>Shuffle</button>

    <ul>
        {#each cards as card}
            <li>
                <Card 
                    quantity={card.quantity} 
                    color={card.color} 
                    shading={card.shading} 
                    shape={card.shape}
                />
            </li>
        {/each}
    </ul>
</div>




