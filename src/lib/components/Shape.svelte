<script>
    export let shape = 'oval';
    export let color = 'red';
    export let shading = 'solid';

    const sizes = {
        oval: { width: 53, height: 112 },
        squiggle: { width: 55, height: 106 },
        diamond: { width: 62, height: 119 }
    };

    let shapeColor;

    if(color === 'red'){
        shapeColor = '#F14F2C';
    } else if(color === 'green'){
        shapeColor = '#24BC3C';
    } else if(color === 'purple'){
        shapeColor = '#B23FA6';
    }

    let fill;

    if(shading === 'solid'){
        fill = shapeColor;
    } else if(shading === 'striped'){
        fill = `url(#stripes-${color})`;
    } else if(shading === 'open'){
        fill = 'none';
    }

</script>

<!-- Usage: <Shape shape={shape} color={color} shading={shading} /> -->

<svg width="{sizes[shape].width}" height="{sizes[shape].height}" viewBox="0 0 {sizes[shape].width} {sizes[shape].height}" xmlns="http://www.w3.org/2000/svg">

    {#if shading === 'striped'}
        <defs>
            <pattern id="stripes-{color}" patternUnits="userSpaceOnUse" width="50" height="6">
                <rect width="62" height="2" fill="{shapeColor}"/>
            </pattern>
        </defs>
    {/if}
    
    {#if shape === 'diamond'}
        <path d="M2 59.5L31 2L60 59.5L31 117L2 59.5Z" fill="{fill}" stroke="{shapeColor}" stroke-width="4" stroke-linejoin="round"/>
    {:else if shape === 'oval'}
        <rect x="2" y="2" width="49" height="108" rx="24.5" fill="{fill}" stroke="{shapeColor}" stroke-width="4" stroke-linejoin="round"/>
    {:else if shape === 'squiggle'}
        <path d="M40.4291 70.1824C40.4291 77.3427 45.7532 83.2339 49.1136 87.8558C51.0355 90.4991 53 92.8215 53 94.5404C53 98.2217 47.7076 104 36.2746 104C14.9906 104 6.1498 85.079 6.1498 73.6552C6.1498 60.9688 14.5709 48.5916 14.5709 35.8175C14.5709 28.6572 9.24685 22.7661 5.88636 18.1442C3.96448 15.5008 2 13.2913 2 11.4596C2 7.89112 7.29246 2 18.7255 2C40.0095 2 48.8502 20.921 48.8502 32.3448C48.8502 44.91 40.4291 57.4619 40.4291 70.1824Z" fill="{fill}" stroke="{shapeColor}" stroke-width="4" stroke-linejoin="round"/>
    {/if}
</svg>