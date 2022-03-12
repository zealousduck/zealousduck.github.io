<script lang="ts">
  export let character;
  export let match: "" | "NONE" | "ALMOST" | "EXACT";
  export let isFocused: boolean = false;
  export let classes = "";
  let style = match.toLowerCase();
</script>

<span class={`character ${isFocused ? "focused" : ""} ${style} ${classes}`}>
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

  .character.focused {
    @apply bg-blue-100;
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
