<script lang="ts">
  import Character from "./Character.svelte";
  import type { GuessResult } from "./wdlgame";

  const today = new Date().toLocaleDateString();

  const logo: GuessResult = {
    characters: [
      {
        character: "w",
        match: "EXACT",
      },
      {
        character: "\u200e",
        match: "NONE",
      },
      {
        character: "\u200e",
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
        character: "\u200e",
        match: "NONE",
      },
    ],
  };
</script>

<div class="logo">
  {#each logo.characters as character}
    <Character {...character} />
  {/each}
  <h2>{today}</h2>
</div>

<style>
  .logo {
    padding: 1.5em 1em;
  }

  h2 {
    font-weight: lighter;
  }
</style>
