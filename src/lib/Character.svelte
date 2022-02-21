<script lang="ts">
  export let character;
  export let match: "" | "NONE" | "ALMOST" | "EXACT";
  let style = match.toLowerCase();
</script>

<span class={"character " + style}>
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
    margin: 0.1em;
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
</style>
