<script lang="ts">
  import type { GuessResult } from "./wdlgame";
  import Character from "./Character.svelte";
  export let guess: GuessResult;
</script>

<div class="guess-line">
  {#each guess.characters as character}
    <Character {...character} />
  {/each}
</div>

<style>
  .guess-line {
    margin: 0.2em auto;
    width: fit-content;
  }
</style>
