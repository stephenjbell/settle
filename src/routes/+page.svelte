<script>

    import { onMount } from 'svelte';

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
        shuffle(cards);
    });
    
</script>

<style>
    h1 {
        color: #ff3e00;
    }
</style>

<h1>Welcome to Settle!</h1>

{cards.length} cards in the deck.

<button on:click={shuffle}>Shuffle</button>

<ol>
    {#each cards as card}
        <li>{card.quantity} {card.color} {card.shading} {card.shape}</li>
    {/each}
</ol>

