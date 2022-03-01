import { DateTime } from "luxon";
import { writable } from "svelte/store";
import type { GuessResult, TodaysWord } from "./wdlgame";

export interface WdlStore {
  date: DateTime;
  guesses: GuessResult[];
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
  };
}

export const store = writable(parsed);
store.subscribe((value) => {
  const stringified = JSON.stringify(value);
  localStorage.setItem(wdlKey, stringified);
});
