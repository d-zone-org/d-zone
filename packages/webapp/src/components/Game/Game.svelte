<script lang="typescript">
    import { onMount } from 'svelte'
    import { initGame } from './Game'

    let canvas: HTMLCanvasElement

    // Initialize game with canvas when svelte mounts game component
    onMount(() => {
        initGame(canvas)
    })
</script>

<canvas bind:this={canvas}></canvas>
