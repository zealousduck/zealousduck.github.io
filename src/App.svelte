<script lang="ts">
  import TailwindCss from "./TailwindCSS.svelte";
  import Menu from "./lib/Menu.svelte";
  import Logo from "./lib/Logo.svelte";
  import Game from "./lib/Game.svelte";
  import { darkMode } from "./lib/dark-mode";

  $: {
    document.getElementById("app").parentElement.parentElement.className =
      $darkMode ? "dark-mode" : "";
  }
</script>

<TailwindCss />

<main class="flex centered">
  <div class="wrapper justify-center">
    <Menu />
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
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 600px;
  }

  @media (max-width: 500px) {
    .wrapper {
      width: 98%;
    }
  }
</style>
