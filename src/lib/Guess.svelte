<script lang="ts">
  import type { GuessResult } from "./wdlgame";
  import Character from "./Character.svelte";
  export let guess: GuessResult;
  export let focus: number | undefined = undefined;
  export let classes = "";
</script>

<div class="guess-line">
  {#each guess.characters as character, i}
    <Character {...character} isFocused={focus === i} {classes} />
  {/each}
</div>

<style>
  .guess-line {
    margin: 0.3em auto;
    width: fit-content;
  }
</style>
