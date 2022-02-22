<script lang="ts">
  import Guess from "./Guess.svelte";
  import {
    emptyGuess,
    exportGame,
    getTodaysWord,
    GuessCharacter,
    GuessResult,
  } from "./wdlgame";

  const todaysWord = getTodaysWord();
  // const { word, date } = { word: "asylum", date: todaysWord.date }
  const {word, date} = todaysWord;
  let input: GuessCharacter[] = new Array(word.length).fill("");
  let guesses: GuessResult[] = [];
  let emptyGuesses: GuessResult[] = new Array(word.length - 1).fill(
    emptyGuess,
    0,
    word.length - guesses.length - 1 // -1 to account for current input line
  );
  let success = false;
  let gameOver = false;
  $: {
    gameOver = success || guesses.length >= word.length;
    if (success && guesses.length < word.length) {
      // push an empty guess to hide the missing input row
      emptyGuesses.push(emptyGuess);
    }
  }

  function guess(input: string): GuessResult {
    success = input === word;
    const characterCounts = new Map<string, number>();
    for (let i = 0; i < word.length; i += 1) {
      const count = characterCounts.get(word.charAt(i)) ?? 0;
      characterCounts.set(word.charAt(i), count + 1);
    }
    const result: GuessResult = {
      characters: [],
    };
    for (let i = 0; i < input.length; i += 1) {
      let match: GuessCharacter["match"] = "NONE";
      if (word.charAt(i) === input.charAt(i)) {
        match = "EXACT";
      } else if (
        word.includes(input.charAt(i)) &&
        characterCounts.get(input.charAt(i)) > 0
      ) {
        match = "ALMOST";
      }
      const count = characterCounts.get(input.charAt(i)) ?? 0;
      characterCounts.set(input.charAt(i), count - 1);
      result.characters[i] = {
        character: input.charAt(i),
        match,
      };
    }
    guesses = [...guesses, result];
    emptyGuesses = emptyGuesses.slice(1);
    return result;
  }

  let previous = [];
  function goNext(current, next): void {
    if (
      current.getAttribute &&
      current.value.length === Number(current.getAttribute("maxLength"))
    ) {
      next.focus();
      previous.push(current);
    }
  }

  function goPrev(): void {
    if (previous.length) {
      previous.pop().focus();
    }
  }

  let copiedToClipboard = false;
  function submit(e): void {
    if (gameOver) {
      navigator.clipboard.writeText(exportGame(todaysWord, guesses));
      copiedToClipboard = true;
    } else {
      const formData = new FormData(e.target);
      const data = {};
      for (let field of formData) {
        const [key, value] = field;
        data[key] = value;
      }
      const formGuess = Object.keys(data)
        .sort()
        .map((key) => data[key])
        .join("")
        .toLowerCase();
      guess(formGuess);
      e.target.reset(); // clear the form
      previous = [];

      if (success) {
        const button = document.getElementById("submit-button");
        console.log(button);
        button.focus();
      } else {
        (document.forms[0][0] as HTMLElement).focus();
      }
    }
  }

  let buttonText = "Guess";
  $: {
    if (copiedToClipboard) {
      buttonText = "Copied to clipboard!";
    } else if (gameOver) {
      buttonText = "Share";
    }
  }
</script>

<form name="wdl" class="wdl-game" on:submit|preventDefault={submit}>
  <div>
    <h2>{todaysWord.date.toLocaleString()}</h2>
  </div>
  {#each guesses as guess}
    <Guess {guess} />
  {/each}
  {#if !gameOver}
    <div class="flex-row">
      {#each input as _, i}
        <input
          on:input={function (e) {
            goNext(e.target, document.forms[0][i + 1]);
          }}
          on:keydown={function (e) {
            const key = e.key;
            if (key === "Backspace") {
              goPrev();
            }
          }}
          class="character-input"
          type="text"
          name={`${i}`}
          required
          pattern="[A-Za-z]"
          minlength={1}
          maxlength={1}
          autocomplete="off"
        />
      {/each}
    </div>
  {/if}
  {#each emptyGuesses as guess}
    <Guess {guess} />
  {/each}
  <button
    id="submit-button"
    class={`btn ${copiedToClipboard ? "done" : "ready"}`}
    type="submit"
    on:keydown={function (e) {
      const key = e.key;
      if (key === "Backspace") {
        goPrev();
      }
    }}>{buttonText}</button
  >
</form>

<style>
  .wdl-game {
    @apply flex flex-col justify-between rounded bg-stone-100;
    height: 20em;
    padding: 0.25em 1em 1em 1em;
  }

  h2 {
    font-weight: lighter;
    padding-bottom: 0.2em;
  }

  input {
    @apply content-center;
    display: inline-block;
    border-color: grey;
    border-radius: 3px;
    border-width: 1px;
    color: black;
    display: inline-block;
    height: 2em;
    padding-top: 0.1em;
    margin: 0.2em 0.2em;
    width: 2em;
    text-align: center;
  }

  input:focus {
    outline-color: rgb(8 145 178);
  }

  .btn {
    @apply font-bold bg-cyan-600 text-white rounded;
    margin-top: 0.5em;
    padding: 0.5em 1em;
    cursor: pointer;
  }

  .btn.ready {
    @apply bg-cyan-600;
  }

  .btn.ready:hover,
  .btn.ready:focus {
    @apply bg-cyan-800;
    outline: none;
  }

  .btn.done {
    background-color: darkgreen;
  }

  .btn.done:hover,
  .btn.done:focus {
    outline: none;
  }
</style>
