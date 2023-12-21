<script>
	// import Shape from "./Shape.svelte";

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
  </script>
  
  <div 
    class="card quantity{quantity} {color} {shading} {shape}" 
    style="--x: {x}; --y: {y}; --z: {z}; --rotX: {rotX}; --rotY: {rotY}; --rotZ: {rotZ};"
    >
    <div class="back"></div>
    <div class="front">
        {#each Array(quantity) as _}
            <img src="/images/shapes/{color}-{shading}-{shape}.svg" alt="">
        {/each}
    </div>
  </div>
  
  <style lang="scss">
    .card {
        display: block;
        position: absolute;
        width: 100%;
        aspect-ratio: 3.5/2.5;
        transition: 0.5s all ease-in-out;
        transform-style: preserve-3d;
        transform: 
            translate3d(calc(var(--x) * 1px), calc(var(--y) * 1px), calc(var(--z) * 1px))
            rotateX(calc(var(--rotX) * 1deg)) rotateY(calc(var(--rotY) * 1deg)) rotateZ(calc(var(--rotZ) * 1deg)) ;
        perspective: 1000px;
        
        .front {
            display: flex;
            gap: 4%;
            background-color: #f5f5e9;
            border-radius: 0.5rem;
            align-items: center;
            justify-content:center;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            border: 0.5px solid transparent;
            border-color: rgb(255,255,255,0.5) rgba(0,0,0,0.5) ;

            img {
                height: 65%;
                width: auto;
            }
        }

        &.oval {
            .front {
                gap: 6%;
            }
        }

        .back {
            display: block;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-image:url('/images/back-pattern1.svg');
            border-radius: 0.5rem;
            background-size: auto 56%;
            background-position: center;
            backface-visibility: hidden;
            transform: rotateY(180deg);
            border: 0.5px solid transparent;
            border-color: rgb(255,255,255,0.5) rgba(0,0,0,0.5) ;
        }

    }
  </style>
  