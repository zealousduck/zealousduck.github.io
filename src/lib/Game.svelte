<script lang="ts">
  import Guess from "./Guess.svelte";
  import { getTodaysWord, GuessCharacter, GuessResult } from "./wdlgame";

  const emptyGuess: GuessResult = {
    characters: [
      {
        character: "\u200e",
        match: "",
      },
      {
        character: "\u200e",
        match: "",
      },
      {
        character: "\u200e",
        match: "",
      },
      {
        character: "\u200e",
        match: "",
      },
      {
        character: "\u200e",
        match: "",
      },
      {
        character: "\u200e",
        match: "",
      },
    ],
  };

  const word = getTodaysWord();
  let guesses: GuessResult[] = [];
  let emptyGuesses: GuessResult[] = new Array(word.length).fill(
    emptyGuess,
    0,
    word.length - guesses.length
  );
  let success = false;

  function guess(input: string): GuessResult {
    success = input === word;
    const result: GuessResult = {
      characters: [],
    };
    for (let i = 0; i < input.length; i += 1) {
      let match: GuessCharacter["match"] = "NONE";
      if (word.charAt(i) === input.charAt(i)) {
        match = "EXACT";
      } else if (word.includes(input.charAt(i))) {
        match = "ALMOST";
      }
      result.characters[i] = {
        character: input.charAt(i),
        match,
      };
    }
    guesses = [...guesses, result];
    emptyGuesses = emptyGuesses.slice(1);
    return result;
  }

  function submit(e): void {
    const formData = new FormData(e.target);
    const data = {};
    for (let field of formData) {
      const [key, value] = field;
      data[key] = value;
    }
    guess(data["guess"]);
    e.target.reset();
  }
</script>

<form class="wdl-game" on:submit|preventDefault={submit}>
  {#each guesses as guess}
    <Guess {guess} />
  {/each}
  <input
    type="text"
    name="guess"
    required
    minlength={word.length}
    maxlength={word.length}
    autocomplete="off"
  />
  {#each emptyGuesses as guess}
    <Guess {guess} />
  {/each}
  <button class="btn" type="submit" disabled={success}>Guess</button>
</form>

<style>
  .wdl-game {
    @apply flex flex-col justify-between rounded bg-stone-100;
    height: 20em;
    padding: 1em;
  }

  input {
    width: 100%;
    border-color: light-grey;
    border-width: 1px;
  }

  .btn {
    @apply font-bold bg-cyan-600 text-white rounded;
    margin-top: 1em;
    padding: 0.5em 1em;
    cursor: pointer;
  }

  .btn:hover {
    @apply bg-cyan-800;
  }
</style>
