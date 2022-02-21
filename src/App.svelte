<script lang="ts">
  import TailwindCss from "./TailwindCSS.svelte";
  import Logo from "./lib/Logo.svelte";
  import Game from "./lib/Game.svelte";
</script>

<TailwindCss />

<main class="flex centered">
  <div class="flex-col justify-center">
    <Logo />
    <Game />
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: row;
    justify-content: center;
    text-align: center;
    margin: 0 auto;
    padding: 0;
    height: 100%;
    width: 100%;
    @apply bg-stone-200;
  }
</style>
