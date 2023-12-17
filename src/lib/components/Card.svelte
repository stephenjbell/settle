<script>
	// import Shape from "./Shape.svelte";

    export let quantity = 1;
    export let color = 'red';
    export let shading = 'solid';
    export let shape = 'oval';
  </script>
  
  <div 
    class="card quantity{quantity} {color} {shading} {shape}" 
    title="{quantity} {color} {shading} {quantity === 1 ? shape : shape + 's'}"
    >
    {#each Array(quantity) as _}
        <img src="/images/shapes/{color}-{shading}-{shape}.svg" alt="">
    {/each}
  </div>
  
  <style lang="scss">
    .card {
        display: flex;
        gap: 5%;
        width: 250px;
        height: 150px;
        background-color: #f5f5e9;
        border-radius: 0.5rem;
        align-items: center;
        justify-content:center;

        img {
            height: 75%;
            width: auto;
        }
    }
  </style>
  