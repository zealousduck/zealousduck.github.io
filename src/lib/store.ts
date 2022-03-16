import { DateTime } from "luxon";
import { writable } from "svelte/store";
import type { getTodaysWord, GuessResult, TodaysWord } from "./wdlgame";

export interface WdlStore {
  date: DateTime;
  guesses: GuessResult[];
  keyboardAssist: boolean;
  success: boolean;
}

const wdlKey = "local_storage_wdl";

const fromStore = localStorage.getItem(wdlKey);
let parsed: WdlStore;
try {
  parsed = JSON.parse(fromStore);
  if (typeof parsed.date === "string") {
    parsed.date = DateTime.fromISO(parsed.date);
  }
} catch (error) {
  console.warn(error);
  parsed = {
    date: DateTime.now(),
    guesses: [],
    keyboardAssist: false,
    success: false,
  };
}

export const store = writable(parsed);
store.subscribe((value) => {
  const stringified = JSON.stringify(value);
  localStorage.setItem(wdlKey, stringified);
});

const gamesKey = "wdl_games";
const previousGames = localStorage.getItem(gamesKey);

export function getPreviousGames(): WdlStore[] {
  try {
    const parsed: WdlStore[] = JSON.parse(previousGames);
    for (const game of parsed) {
      if (typeof game.date === "string") {
        game.date = DateTime.fromISO(game.date);
      }
    }
    return parsed;
  } catch (error) {
    localStorage.setItem(gamesKey, JSON.stringify([]));
    return [];
  }
}

export function isFresh(game: WdlStore, previousGames: WdlStore[]): boolean {
  const firstGuesses = new Set<string>();
  for (const previous of previousGames.filter(
    (_) => _.date.toISODate() !== game.date.toISODate()
  )) {
    const word = previous.guesses[0].characters
      .map((_) => _.character)
      .join("");
    firstGuesses.add(word);
  }
  const wordToCheck = game.guesses[0].characters
    .map((_) => _.character)
    .join("");
  return !firstGuesses.has(wordToCheck);
}

export function saveGame(game: WdlStore): void {
  const previous = getPreviousGames().filter(
    (_) => _.date.toISODate() !== game.date.toISODate()
  );
  previous.push(game);
  localStorage.setItem(gamesKey, JSON.stringify(previous));
}
