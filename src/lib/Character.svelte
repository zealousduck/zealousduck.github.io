<script lang="ts">
  import { darkMode } from "./dark-mode";
  export let character;
  export let match: "" | "NONE" | "ALMOST" | "EXACT";
  export let isFocused: boolean = false;
  export let classes = "";
  export let setPosition: undefined | (() => void) = undefined;
  let style = match.toLowerCase();

  let darkModeClass = $darkMode ? "dark-mode" : "";
  $: {
    darkModeClass = $darkMode ? "dark-mode" : "";
  }
</script>

<span
  class={`character ${darkModeClass} ${
    isFocused ? "focused" : ""
  } ${style} ${classes} ${setPosition ? "cursor-pointer" : ""}`}
  on:click={() => setPosition && setPosition()}
>
  {character}
</span>

<style>
  .character {
    color: black;
    display: inline-block;
    border-color: grey;
    border-width: 1px;
    width: 2em;
    height: 2em;
    border-radius: 3px;
    padding-top: 0.1em;
    margin: 0 0.2em;
  }
  .character.dark-mode {
    @apply text-white;
  }

  .character.focused {
    @apply bg-blue-100;
  }

  .character.focused.dark-mode {
    background-color: rgb(47, 95, 95);
  }

  .character.cursor-pointer {
    cursor: pointer;
  }

  .none {
    color: white;
    border-color: grey;
    background-color: grey;
  }

  .exact {
    color: white;
    background-color: darkgreen;
    border-color: darkgreen;
  }

  .almost {
    color: white;
    background-color: chocolate;
    border-color: chocolate;
  }

  .invalid {
    color: white;
    background-color: brown;
  }
</style>
