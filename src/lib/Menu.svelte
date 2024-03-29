<script lang="ts">
  import { cloneDeep } from "lodash";
  import { darkMode } from "./dark-mode";
  import { getPreviousGames, WdlStore } from "./store";
  import { exportOneLiner } from "./wdlgame";

  let menuOpen = false;

  function getFirstWord({ guesses }: WdlStore): string {
    return guesses[0].characters.map((_) => _.character).join("");
  }

  const previousGames = cloneDeep(getPreviousGames()).reverse();

  let darkModeClass = $darkMode ? "dark-mode" : "";
  $: {
    darkModeClass = $darkMode ? "dark-mode" : "";
  }
</script>

<button
  class={`menu-button ${darkModeClass}`}
  id="open-menu"
  on:click={() => (menuOpen = true)}
>
  <!-- heroicon menu -->
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
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
</button>
<div class={`menu-wrapper ${menuOpen ? "" : "hidden"}`}>
  <div
    class={`backdrop ${menuOpen ? "" : "hidden"}`}
    on:click={() => (menuOpen = false)}
  />
  <div class={`menu ${darkModeClass} ${menuOpen ? `` : "hidden"}`}>
    <div class="previous-days">
      <div class="day">Previous Games</div>
      {#each previousGames as game, i}
        <div class="day">
          <div class="line">
            <span class="inline-block">{game.date.toLocaleString()}</span>
            <span class="inline-block">{exportOneLiner(game)}</span>
          </div>
          <div class="line">
            <span class="inline-block">Starter word: {getFirstWord(game)}</span>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
<button
  class={`dark-mode-button ${darkModeClass}`}
  on:click={() => (darkMode.set(!$darkMode))}
>
  <!-- heroicon moon -->
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
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
</button>

<style>
  .menu-button {
    position: absolute;
    top: 0.75em;
    left: 0.75em;
    width: 1.5em;
    height: 1.5em;
  }

  .menu-button.dark-mode {
    @apply text-white;
  }

  .dark-mode-button {
    position: absolute;
    top: 0.75em;
    right: 0.75em;
    width: 1.5em;
    height: 1.5em;
  }

  .dark-mode-button.dark-mode {
      @apply text-white;
  }

  .menu-wrapper.hidden {
    transition: visibility 0.5s;
    visibility: hidden;
  }

  .backdrop {
    top: 0;
    left: 0;
    position: absolute;
    background-color: rgba(10, 10, 10, 0.4);
    width: 100%;
    height: 100%;
    z-index: 10;
    transition: background-color 0.5s ease-in-out;
  }

  .backdrop.hidden {
    background-color: rgba(10, 10, 10, 0);
    transition: background-color 0.5s ease-in-out;
  }

  .menu {
    @apply bg-stone-100;
    height: 100%;
    width: 80%;
    max-width: 25em;
    overflow-x: hidden;
    overflow-y: auto;
    padding-top: 0.5em;
    padding-left: 0.75em;
    padding-right: 0.75em;
    padding-bottom: 1.5em;
    position: absolute;
    left: 0;
    top: 0;
    transition: left 0.5s;
    z-index: 11;
  }

  .menu.hidden {
    transition: left 0.5s;
    left: -80%;
  }

  .menu.dark-mode {
    @apply bg-neutral-700 text-white;
  }

  .menu.hidden.dark-mode {
    @apply bg-neutral-700;
  }

  .previous-days {
    text-align: start;
  }

  .previous-days .day {
    width: 100%;
    padding-bottom: 0.25em;
    padding-top: 0.25em;
    border-bottom: 1px solid rgba(150, 150, 150, 0.5);
    display: flex;
    flex-direction: column;
  }
  .previous-days .day .line {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
</style>
