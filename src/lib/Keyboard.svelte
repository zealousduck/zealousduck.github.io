<script lang="ts">
  export let onSubmit: () => void;
  export let onBackspace: () => void;
  export let onInput: (character: string) => void;

  const characters: string[][] = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
  ];
</script>

<div class="keyboard">
  <div class="row one">
    {#each characters[0] as character}
      <div class="character" on:click={() => onInput(character)}>
        <span>{character}</span>
      </div>
    {/each}
  </div>
  <div class="row two">
    {#each characters[1] as character}
      <div class="character" on:click={() => onInput(character)}>
        <span>{character}</span>
      </div>
    {/each}
  </div>
  <div class="row three">
    <div class="character" on:click={() => onSubmit()}>
      <!-- heroicons.com check -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>
    {#each characters[2] as character}
      <div class="character" on:click={() => onInput(character)}>
        <span>{character}</span>
      </div>
    {/each}
    <div class="character" on:click={() => onBackspace()}>
      <!-- heroicons.com backspace -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
        />
      </svg>
    </div>
  </div>
</div>

<style>
  .row {
    display: flex;
    justify-content: space-around;
    margin-top: 0.15em;
    margin-bottom: 0.15em;
    padding-left: 0.1em;
    padding-right: 0.1em;
  }

  .row.two {
    padding-left: 0.8em;
    padding-right: 0.8em;
  }

  .row.three {
    padding-left: 0.2em;
    padding-right: 0.2em;
  }

  .character {
    @apply rounded-sm bg-stone-100;
    display: inline-block;
    border-color: #999999;
    border-width: 1px;
    max-width: 3em;
    margin-left: 0.05em;
    margin-right: 0.05em;
    flex: 1;
    cursor: pointer;
    position: relative;
    box-shadow: 1px 1px 2px grey;
  }

  .character:hover {
    @apply bg-stone-300;
  }

  .character span {
    display: inline-block;
    position: relative;
    top: 0.4em;
    width: 1.4em;
    height: 2.5em;
  }

  .character svg {
    display: inline-block;
    width: 2em;
    height: 2.5em;
  }
</style>
