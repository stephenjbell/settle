<script>
    export let quantity = 1;
    export let color = 'red';
    export let shading = 'solid';
    export let shape = 'oval';

    // Position and rotation
    export let x = 0;
    export let y = 0;
    export let z = 0;
    export let rotX = 0;
    export let rotY = 0;
    export let rotZ = 0;
    export let cardWidth = 100;
    export let delay = 0;
  </script>

  <style>
    @import '$lib/styles/card.scss';
  </style>
  
  <div 
    class="card quantity{quantity} {color} {shading} {shape}" 
    style="--x: {x}; --y: {y}; --z: {z}; --rotX: {rotX}; --rotY: {rotY}; --rotZ: {rotZ}; --cardWidth: {cardWidth}; --delay: {delay}ms; "
    >
    <div class="back"></div>
    <div class="front">
        {#each Array(quantity) as _}
            <img src="/images/shapes/{color}-{shading}-{shape}.svg" alt="">
        {/each}
    </div>
  </div>
  