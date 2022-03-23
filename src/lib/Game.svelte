<script lang="ts">
  import { DateTime } from "luxon";
  import Guess from "./Guess.svelte";
  import Keyboard from "./Keyboard.svelte";
  import { getPreviousGames, saveGame, store } from "./store";
  import {
    emptyGuess,
    EMPTY_CHARACTER,
    exportGame,
    getTodaysWord,
    GuessCharacter,
    GuessResult,
    validWords,
  } from "./wdlgame";

  const todaysWord = getTodaysWord();
  // const { word, date } = { word: "result", date: DateTime.now().plus({ day: 14}) };
  const { word, date } = todaysWord;

  let emptyGuesses: GuessResult[];
  let position: number = 0;
  let characters: GuessCharacter[] = new Array(word.length).fill({
    character: EMPTY_CHARACTER,
    match: "",
  });

  function resetGuess(): void {
    characters = new Array(word.length).fill({
      character: EMPTY_CHARACTER,
      match: "",
    });
    position = 0;
  }

  function doGuess(input: string): GuessResult {
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
        const count = characterCounts.get(input.charAt(i)) ?? 0;
        characterCounts.set(input.charAt(i), count - 1);
      }
      result.characters[i] = {
        character: input.charAt(i),
        match,
      };
    }
    for (let i = 0; i < input.length; i += 1) {
      let match: GuessCharacter["match"] = result.characters[i].match;
      if (
        word.charAt(i) !== input.charAt(i) &&
        word.includes(input.charAt(i)) &&
        characterCounts.get(input.charAt(i)) > 0
      ) {
        match = "ALMOST";
        const count = characterCounts.get(input.charAt(i)) ?? 0;
        characterCounts.set(input.charAt(i), count - 1);
      }
      result.characters[i] = {
        character: input.charAt(i),
        match,
      };
    }
    store.set({
      date,
      guesses: [...$store.guesses, result],
      keyboardAssist: $store.keyboardAssist,
      success,
    });
    emptyGuesses = emptyGuesses.slice(1);
    resetGuess();
    return result;
  }

  function onInput(character) {
    if (position < word.length) {
      characters[position] = { character, match: "" };
      position += 1;
    }
  }

  function onBackspace() {
    if (position > 0) {
      position -= 1;
      characters[position] = { character: EMPTY_CHARACTER, match: "" };
    }
  }

  let debug = false;
  function onSubmit() {
    const guess = characters.map((_) => _.character).join("");
    if (guess === `debug${EMPTY_CHARACTER}`) {
      debug = true;
      resetGuess();
      return;
    }
    const isValid = validWords.has(guess);
    if (isValid) {
      doGuess(guess);
    } else {
      alert("Please use a real word.");
      resetGuess();
    }
  }

  function onKeyDown(e: KeyboardEvent) {
    const key = e.key.toLowerCase();
    if (key === "backspace") {
      onBackspace();
    } else if (key === "enter" && position >= word.length) {
      onSubmit();
    } else if (key.length === 1 && key >= "a" && key <= "z") {
      onInput(key);
    }
  }
  document.addEventListener("keydown", onKeyDown);

  let gameCopiedToClipboard = false;
  let badWord = false;
  let success = false;
  let gameOver = false;
  $: {
    if ($store.date && $store.date.toISODate() !== date.toISODate()) {
      store.set({ date, guesses: [], keyboardAssist: false, success: false });
    }

    if ($store.guesses.length) {
      // wow this sure is unreadable, huh?
      success =
        $store.guesses[$store.guesses.length - 1].characters
          .map((_) => _.character)
          .join("") === word;
    }

    // -1 to account for current input line
    const emptyLength = Math.max(word.length - $store.guesses.length - 1, 0);
    emptyGuesses = new Array(emptyLength).fill(emptyGuess, 0, emptyLength);

    if (success && $store.guesses.length < word.length) {
      // push an empty guess to hide the missing input row
      emptyGuesses.push(emptyGuess);
    }

    const tentative = characters
      .map((_) => _.character)
      .filter((_) => _ !== EMPTY_CHARACTER)
      .join("");
    badWord = tentative.length === word.length && !validWords.has(tentative);

    gameOver = success || $store.guesses.length >= word.length;

    if (gameOver) {
      document.removeEventListener("keydown", onKeyDown);
      saveGame($store);
    }
  }
</script>

<div name="wdl" class="wdl-game">
  <div class="rows">
    <div>
      <h2>{todaysWord.date.toLocaleString()}</h2>
    </div>
    <dialog class="debug" open={debug}>
      <pre>{JSON.stringify(getPreviousGames(), undefined, 2)}</pre>
      <button on:click={() => navigator.clipboard.writeText(JSON.stringify(getPreviousGames(), undefined, 2))}>Copy</button>
      <button on:click={() => (debug = false)}>Close</button>
    </dialog>
    {#each $store.guesses as guess}
      <Guess {guess} />
    {/each}
    {#if !gameOver}
      <Guess
        guess={{ characters }}
        focus={position}
        classes={badWord ? "invalid" : ""}
      />
    {/if}
    {#each emptyGuesses as guess}
      <Guess {guess} />
    {/each}
  </div>
  {#if gameOver}
    <div class="actions">
      <button
        class={gameCopiedToClipboard ? "done" : "ready"}
        on:click={() => {
          navigator.clipboard.writeText(
            exportGame(word, $store, getPreviousGames())
          );
          gameCopiedToClipboard = true;
          // scoreCopiedToClipboard = false;
        }}
      >
        <span>{gameCopiedToClipboard ? "Copied" : "Share"}</span>
        <!-- heroicons copy-to-clipboard -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="share"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
          />
        </svg>
      </button>
    </div>
  {:else}
    {#if !$store.keyboardAssist}
      <button
        class="help"
        on:click={() => store.set({ ...$store, keyboardAssist: true })}
      >
        Turn on keyboard assist? 🧠
        <!-- heroicon ban -->
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
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
      </button>
    {/if}
    <Keyboard {store} {onInput} {onBackspace} {onSubmit} />
  {/if}
</div>

<style>
  .wdl-game {
    @apply flex flex-col justify-between rounded bg-stone-100;
    padding-bottom: 0.15em;
    margin-bottom: 0.1em;
    height: fit-content;
    flex: 1;
  }

  h2 {
    font-weight: lighter;
    padding-bottom: 0.2em;
  }

  .rows {
    padding-bottom: 1em;
  }

  .help {
    @apply text-white;
    background-color: brown;
    border-radius: 999em;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 1em;
    padding: 0.25em 1em;
    position: relative;
  }

  .help svg {
    color: white;
    display: inline;
    height: 1.9em;
    width: 1.9em;
    position: absolute;
    top: 0.1em;
    right: 0.75em;
  }

  .actions {
    @apply text-white;
    display: flex;
    padding: 1em 3em;
    justify-content: space-evenly;
    width: 100%;
  }

  .actions button.ready {
    @apply bg-cyan-600;
  }
  .actions button.ready:hover {
    @apply bg-cyan-800;
  }
  .actions button.done {
    background-color: darkgreen;
  }

  .actions button {
    border-radius: 999em;
    height: fit-content;
    width: fit-content;
    padding: 0.3em 0.6em;
    position: relative;
  }

  .actions button svg {
    display: inline;
    height: 1.5em;
    width: 1.5em;
    position: relative;
    top: -1px;
    left: 1px;
  }

  dialog.debug {
    z-index: 999;
  }

  dialog.debug pre {
    text-align: start;
    max-height: 30em;
    font-size: 69%;
    overflow: scroll;
  }
</style>
