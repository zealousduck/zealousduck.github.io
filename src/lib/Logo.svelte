<script lang="ts">
  import Character from "./Character.svelte";
  import { darkMode } from "./dark-mode";
  import { EMPTY_CHARACTER, getYesterdaysWord, GuessResult } from "./wdlgame";

  const today = new Date().toLocaleDateString();

  const logo: GuessResult = {
    characters: [
      {
        character: "w",
        match: "EXACT",
      },
      {
        character: EMPTY_CHARACTER,
        match: "NONE",
      },
      {
        character: EMPTY_CHARACTER,
        match: "NONE",
      },
      {
        character: "d",
        match: "EXACT",
      },
      {
        character: "l",
        match: "EXACT",
      },
      {
        character: EMPTY_CHARACTER,
        match: "NONE",
      },
    ],
  };

  const yesterdaysWord = getYesterdaysWord();

  let darkModeClass = $darkMode ? "dark-mode" : "";
  $: {
    darkModeClass = $darkMode ? "dark-mode" : "";
  }
</script>

<div class="logo">
  {#each logo.characters as character}
    <Character {...character} />
  {/each}
  <h2 class={darkModeClass}>{`Yesterday's answer: ${yesterdaysWord.word}`}</h2>
</div>

<style>
  .logo {
    padding: 0.4em 1em 0.5em 1em;
  }

  h2 {
    font-weight: lighter;
  }

  h2.dark-mode {
    @apply text-white;
  }
</style>
