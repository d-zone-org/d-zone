<script lang="typescript">
	import HelloComponent from './components/Hello/Hello.svelte'
	import GameComponent from './components/Game/Game.svelte'
</script>

<main>
	<HelloComponent></HelloComponent>
	<GameComponent></GameComponent>
</main>

<style lang="scss">
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;

    h1 {
      color: #ff3e00;
      text-transform: uppercase;
      font-size: 4em;
      font-weight: 100;
	  }
  }
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
