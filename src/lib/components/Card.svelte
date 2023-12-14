<script>
    // Props for the Card component
    export let quantity = 1;
    export let color = 'red';
    export let shading = 'solid';
    export let shape = 'oval';
  </script>
  
  <div class="card {color} {shading} {shape}" style="color:{color};">
    {quantity}, {color}, {shading}, {shape}

    {#each Array(quantity) as shape}
      *
    {/each}
  </div>
  
  <style>
  </style>
  