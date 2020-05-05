<script lang="typescript">
    import { onMount } from 'svelte'
    import {init} from './Pixi'
    let canvas: HTMLCanvasElement

    onMount(() => {
        init(canvas)
    })
</script>

<canvas bind:this={canvas}></canvas>
