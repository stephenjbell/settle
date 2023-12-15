<script>
    export let quantity = 1;
    export let color = 'red';
    export let shading = 'solid';
    export let shape = 'oval';
  </script>
  
  <div class="card {color} {shading} {shape}" style="color:{color};">
    {quantity} {color} {shading} {shape}

    {#each Array(quantity) as _}
        <img src="images/{shading}-{shape}.svg" width="20" alt=""/>
    {/each}
  </div>
  
  <style lang="scss">
    .card {
        background-color: rgb(214, 231, 180);
    }
  </style>
  