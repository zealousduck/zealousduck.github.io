import { cloneDeep } from "lodash";
import { DateTime } from "luxon";
import { isFresh, WdlStore } from "./store";
import valid_words from "./words_pruned.json";

export const validWords = new Set<string>(valid_words);

export const EMPTY_CHARACTER = "\u200e";

export interface GuessCharacter {
  match: "" | "NONE" | "ALMOST" | "EXACT";
  character: string;
}

export interface GuessResult {
  characters: GuessCharacter[];
}

export interface TodaysWord {
  word: string;
  date: DateTime;
}

export function getYesterdaysWord(): TodaysWord {
  const epoch = DateTime.fromObject({ year: 2022, month: 2, day: 20 });
  const today = DateTime.fromJSDate(new Date());
  const index = -Math.floor(epoch.diff(today, "days").days) - 1;
  const dict = JSON.parse(atob(dictionary));
  const result = {
    word: dict[index % dict.length],
    date: today,
  };
  return result;
}

export function getTodaysWord(): TodaysWord {
  const epoch = DateTime.fromObject({ year: 2022, month: 2, day: 20 });
  const today = DateTime.fromJSDate(new Date());
  const index = -Math.floor(epoch.diff(today, "days").days);
  const dict = JSON.parse(atob(dictionary));
  const result = {
    word: dict[index % dict.length],
    date: today,
  };
  return result;
}

export function exportOneLiner(game: WdlStore): string {
  let builder = "";
  if (game.success) {
    builder += `${game.guesses.length}/6`;
  } else {
    builder += `X/6`;
  }
  return builder;
}

export function exportGame(
  word: string,
  game: WdlStore,
  previousIn: WdlStore[]
): string {
  const previous = cloneDeep(previousIn);
  const { date, guesses, keyboardAssist } = game;
  let builder = `wdl | ${date.toJSDate().toLocaleDateString()} | ${
    guesses.length
  }/${word.length}`;
  builder += "\r\n";

  if (game.success) {
    const badges: string[] = [];
    if (!keyboardAssist) {
      badges.push("🧠");
    }
    if (isFresh(game, previous)) {
      badges.push("✨");
    }
    if (isOrangeBadge(game)) {
      badges.push("🍊");
    }
    if (isComebackBadge(game)) {
      badges.push("🪃");
    }
    // +1 to account for 0-indexing
    const totalWins: number = previous.filter((_) => _.success).length;
    const consecutiveWins: number =
      totalWins === previous.length
        ? totalWins
        : previous.reverse().findIndex((_) => !_.success) + 1;
    if (consecutiveWins > 1) {
      // +1 to account for today's win
      badges.push(`🔥x${consecutiveWins + 1}`);
    }
    if (badges.length > 0) {
      builder += badges.join(" | ");
      builder += "\r\n";
    }
  }

  for (const guess of guesses) {
    for (const { match } of guess.characters) {
      if (match === "EXACT") {
        builder += "🟩 ";
      } else if (match === "ALMOST") {
        builder += "🟨 ";
      } else {
        builder += "⬛ ";
      }
    }
    builder += "\r\n";
  }
  return builder;
}

function isOrangeBadge(game: WdlStore): boolean {
  for (const match of game.guesses
    .map((_) => _.characters)
    .flat()
    .map((_) => _.match)) {
    if (match === "ALMOST") {
      return false;
    }
  }
  return true;
}

function isComebackBadge(game: WdlStore): boolean {
  for (const match of game.guesses[0].characters.map(_ => _.match)) {
    if (match !== "NONE") {
      return false;
    }
  }
  return true;
}

export const emptyGuess: GuessResult = {
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

const dictionary =
  "WyJsaXF1aWQiLCJhc3lsdW0iLCJyYXJlZnkiLCJzY2FyYWIiLCJ3YWZmbGUiLCJhbHBpbmUiLCJhY3R1YWwiLCJhZG1pcmUiLCJwYXN0ZWwiLCJwdWxwaXQiLCJ1bmlzb24iLCJhZnJhaWQiLCJ5b2d1cnQiLCJiYW5nbGUiLCJkYWVtb24iLCJzZXJtb24iLCJtaXNoYXAiLCJraXR0ZW4iLCJ1bmlxdWUiLCJ3cmFpdGgiLCJjYWpvbGUiLCJjYWN0dXMiLCJlZmZpZ3kiLCJyZXNpZ24iLCJ1c2VmdWwiLCJzZWxkb20iLCJjYXJhZmUiLCJtb3Rpb24iLCJjb3VnYXIiLCJ0cmliYWwiLCJpbnZlc3QiLCJjbGF1c2UiLCJzaGFkb3ciLCJuYXBraW4iLCJpbm1hdGUiLCJzZXB0dW0iLCJyZWdpbWUiLCJuZWJ1bGEiLCJwcmlzb24iLCJzYWNyZWQiLCJvZmZpY2UiLCJkZWJhdGUiLCJzZWxmaWUiLCJtb3ZpZXMiLCJ6b2RpYWMiLCJuYXVzZWEiLCJjb2duYWMiLCJhdmVudWUiLCJmYWxjb24iLCJhcm1waXQiLCJmZXRpc2giLCJ6aWd6YWciLCJjYW5vcHkiLCJyaXR1YWwiLCJjZW5zb3IiLCJzZXJpYWwiLCJvY3RhbmUiLCJ3b3JrZXIiLCJjYW5kaWQiLCJuYXR1cmUiLCJpbmZlY3QiLCJ0cmVuY2giLCJyYW5jaWQiLCJwYXJsb3IiLCJpZ25vcmUiLCJjYW55b24iLCJ2YWNhbnQiLCJ0dW5kcmEiLCJ1dG9waWEiLCJyZWplY3QiLCJ5ZW9tYW4iLCJyYW5nZXIiLCJqdW5pb3IiLCJzZWxlY3QiLCJyYWNvb24iLCJpc2xhbmQiLCJleGVtcHQiLCJhbXVsZXQiLCJ3cmVuY2giLCJkb25nbGUiLCJiYW1ib28iLCJiZXJhdGUiLCJtb3RsZXkiLCJ3aGlza3kiLCJkZWR1Y3QiLCJib2JjYXQiLCJkZWZ1bmQiLCJsb2NrZXQiLCJ0YWhpbmkiLCJuZXBoZXciLCJub3Rpb24iLCJqdW5nbGUiLCJpbm5hdGUiLCJpZ3VhbmEiLCJjaHJvbWUiLCJzaHJld2QiLCJzYWRpc3QiLCJuYXBhbG0iLCJjYXNrZXQiLCJ6ZXBoeXIiLCJzYWZldHkiLCJwYXJhZGUiLCJtYWlkZW4iLCJhdmlhcnkiLCJrZW5uZWwiLCJyZWJ1a2UiLCJzZXdhZ2UiLCJhY2NlbnQiLCJwb3dkZXIiLCJvY3RhdmUiLCJuaW1ibGUiLCJ2aW9sZXQiLCJjYWxtbHkiLCJhbG1vbmQiLCJ6ZWFsb3QiLCJ3aWRnZXQiLCJhZGRpY3QiLCJ3ZWJjYW0iLCJwYXRyb24iLCJuYXVnaHQiLCJhY3RpbmciLCJ2ZXNzZWwiLCJpZ25pdGUiLCJmZXJ2b3IiLCJpbXByb3YiLCJjb2l0dXMiLCJkaXNwZWwiLCJhZGp1c3QiLCJwYXJkb24iLCJyZWNvaWwiLCJqdWljZXIiLCJmaWVzdGEiLCJpbXBvc2UiLCJtYWtldXAiLCJtYW51cmUiLCJhaXJiYWciLCJjYW5kbGUiLCJxdWlya3kiLCJpbmZhbXkiLCJnYXJhZ2UiLCJwdXJpZnkiLCJyZXNvcnQiLCJuYXRpdmUiLCJ1cHRvd24iLCJjYXRuaXAiLCJpbmRpZ28iLCJ1bmlzZXgiLCJzaWNrZW4iLCJjYW5jZWwiLCJyb3N0ZXIiLCJtb3JzZWwiLCJkZWZpbmUiLCJyZWZvcm0iLCJjYXJib24iLCJleHRlbnQiLCJiYWtlcnkiLCJqaWdzYXciLCJnYW1ibGUiLCJ2aWV3ZXIiLCJyZWNrb24iLCJwb3VuY2UiLCJhY3Rpb24iLCJyb3R1bmQiLCJvYmplY3QiLCJpY2Vib3giLCJhYnN1cmQiLCJub3p6bGUiLCJtYXJvb24iLCJjaG9yZXMiLCJ3b21iYXQiLCJhbWJ1c2giLCJqdWdnbGUiLCJ0cm9waWMiLCJ2ZXJiYWwiLCJzZW50cnkiLCJlZGlibGUiLCJzY2FyZWQiLCJyYXBpZHMiLCJyZWJvb3QiLCJibHVmZnMiLCJnYXNrZXQiLCJzY2FtcGkiLCJhbmVtaWMiLCJkZWZyYWciLCJ3YWl2ZXIiLCJhY2lkaWMiLCJhZXJpYWwiLCJsb2FmZXIiLCJob3JuZXQiLCJwYXJvZHkiLCJub3ZpY2UiLCJ0YW1hbGUiLCJjYXZlcm4iLCJ2YW5kYWwiLCJ2YW5pdHkiLCJleGhhbGUiLCJiZWhhbGYiLCJhYm91bmQiLCJmaWVyY2UiLCJ0cmVuZHkiLCJyZWdnYWUiLCJtYWduZXQiLCJ3YXNhYmkiLCJqZXRsYWciLCJpbmhhbGUiLCJzY2VuaWMiLCJzZWV0aGUiLCJtb3J0YWwiLCJiYWRnZXIiLCJqaW5nbGUiLCJjYW1wdXMiLCJiZW11c2UiLCJpbXBpc2giLCJyYW5zb20iLCJib2lsZXIiLCJnZWlzaGEiLCJ0cmFnaWMiLCJhYmR1Y3QiLCJhc3BlY3QiLCJwYXBpc3QiLCJnYW5kZXIiLCJzZXF1ZWwiLCJyb21jb20iLCJhYmp1cmUiLCJiYW5hbmEiLCJhbmdsZXIiLCJiZWFjb24iLCJwdWxsZXkiLCJodW1ibGUiLCJ0cmFuY2UiLCJjaHViYnkiLCJ2aWFibGUiLCJhZHJpZnQiLCJnb3Zlcm4iLCJibGF6ZXIiLCJyYWZmbGUiLCJpbmN1YmkiLCJhYnNlbnQiLCJtaXNmaXQiLCJhZmZhaXIiLCJ3ZWFzZWwiLCJhZ2hhc3QiLCJyZXdpbmQiLCJiZWFnbGUiLCJyYWRpc2giLCJzY2FyY2UiLCJwYXJpYWgiLCJodW5ncnkiLCJhbXVzZWQiLCJpbmNpdGUiLCJyZWxlbnQiLCJtb3JhbGUiLCJwcm9wZWwiLCJ0cmVtb3IiLCJmcnVnYWwiLCJ5YXVwb24iLCJjYWxpY28iLCJiZWhvbGQiLCJkb21haW4iLCJwcm9maXQiLCJhYnNvcmIiLCJ3aWNrZWQiLCJyb3R0ZW4iLCJyZWZ1Z2UiLCJleG9kdXMiLCJ3YWxudXQiLCJhZ2VuZGEiLCJvYmxpZ2UiLCJzY3JpcHQiLCJqdW1ibGUiLCJyb29raWUiLCJwb3RlbnQiLCJnYXJsaWMiLCJvYnR1c2UiLCJlZGl0b3IiLCJtYXJtb3QiLCJtb3JiaWQiLCJhZGhlcmUiLCJodWJjYXAiLCJwdXJwbGUiLCJ0dW1vdXIiLCJ2aXN1YWwiLCJlZ2dub2ciLCJwdW1tZWwiLCJ2ZXJpZnkiLCJvdXRsYXciLCJ3b29sZW4iLCJvYnNlc3MiLCJmYXRoZXIiLCJhdmF0YXIiLCJiYWNrdXAiLCJzaGFnZ3kiLCJzZXh1YWwiLCJuZWFyYnkiLCJhc3RobWEiLCJ3aXphcmQiLCJiZWRsYW0iLCJpY2ljbGUiLCJwYWRkbGUiLCJpbmRpY3QiLCJ0dXJiYW4iLCJsb2NhbGUiLCJtYWdwaWUiLCJzaG9ydHMiLCJ0cmVibGUiLCJzaG91bGQiLCJ5dXBwaWUiLCJoeWJyaWQiLCJ3aW50ZXIiLCJkYWRib2QiLCJpbmZ1c2UiLCJleGNpc2UiLCJpbXB1cmUiLCJtdWxsZXQiLCJzY2FsYXIiLCJ2ZXJtaW4iLCJ3aXNkb20iLCJzY3JhcGUiLCJmcm9saWMiLCJnb2FsaWUiLCJyZWxvYWQiLCJwdWZmaW4iLCJ5b25kZXIiLCJwaW5hdGEiLCJjYXJwZXQiLCJnbGl0Y2giLCJodW1tdXMiLCJxdWlub2EiLCJtb3JndWUiLCJnZW50bGUiLCJ0aHdhcnQiLCJiZWF1dHkiLCJmYXVjZXQiLCJzZW5pb3IiLCJqZXdlbHMiLCJhYnJvYWQiLCJiZWdnYXIiLCJiZWNrb24iLCJzaXRjb20iLCJwaXN0b24iLCJ5YWt1emEiLCJjYWJhbmEiLCJjYXJlc3MiLCJ3YXJkZW4iLCJ0b2ZmZWUiLCJzYWZhcmkiLCJiZWxvbmciLCJodXN0bGUiLCJnYW1pbmciLCJsb2F0aGUiLCJyYWNrZXQiLCJlc2NvcnQiLCJzaWduYWwiLCJyYXBpZXIiLCJzZW5zZWkiLCJwYWNrZXQiLCJ0dW1ibGUiLCJiYWxsb3QiLCJzY3JpYmUiLCJjYW5hcnkiLCJ0YWNrbGUiLCJnb2xkZW4iLCJtdW1ibGUiLCJ0dW5uZWwiLCJpbXBhbGUiLCJjaGl0aW4iLCJ1cmdlbnQiLCJ3aW5kb3ciLCJwcmluY2UiLCJwYWxhdGUiLCJyZXZlcmIiLCJsb2N1c3QiLCJwYXNjYWwiLCJtb3RpdmUiLCJjaG9pY2UiLCJiYW5nZXIiLCJmYXVsdHkiLCJ5ZWFybHkiLCJyYXZhZ2UiLCJnYXJnbGUiLCJyZWNpcGUiLCJoeW1uYWwiLCJvY2N1bHQiLCJiZWxmcnkiLCJvcGVuZXIiLCJuYWNob3MiLCJyZXRhaW4iLCJjbGV2ZXIiLCJhYmplY3QiLCJwYXN0cnkiLCJzY3JlYW0iLCJnbmFybHkiLCJvY2N1cHkiLCJyYXB0b3IiLCJwYXVwZXIiLCJzZXJlbmUiLCJtYWdnb3QiLCJwcmF5ZXIiLCJwYWxhY2UiLCJzaWVzdGEiLCJnYXJkZW4iLCJhbmtsZXQiLCJsaW5ldXAiLCJhbGthbGkiLCJydWJiZXIiLCJ0aXNzdWUiLCJyZW5lZ2UiLCJzaHJpbXAiLCJ2aXJ0dWUiLCJyZWZsZXgiLCJwYWNpZnkiLCJ3aWVuZXIiLCJzYWlsb3IiLCJpZGlvY3kiLCJibHVycnkiLCJweXRob24iLCJkYWludHkiLCJjb2hvcnQiLCJyZWdpb24iLCJkaXNvd24iLCJhc3RyYWwiLCJ1bmVhc3kiLCJkYW1hZ2UiLCJhbm9pbnQiLCJtYXJpbmUiLCJwdW5kaXQiLCJtYW51YWwiLCJpbW11bmUiLCJ0YW1wb24iLCJtYXJibGUiLCJob25lc3QiLCJzaGFudHkiLCJhYmFjdXMiLCJyZW1lZHkiLCJ1cmNoaW4iLCJiYWJibGUiLCJtb3NhaWMiLCJ2ZWN0b3IiLCJsaXF1b3IiLCJob29rYWgiLCJhdmVyc2UiLCJ6eWdvdGUiLCJyYXZpbmUiLCJhcnRpc3QiLCJhYnJ1cHQiLCJ6b21iaWUiLCJhY3VpdHkiLCJ0YW5uaW4iLCJvdXRiaWQiLCJjYXJyb3QiLCJldGhpY3MiLCJ0aW1icmUiLCJ3cml0aGUiLCJjYW5pbmUiLCJpb25pemUiLCJmaWFuY2UiLCJpcm9uaWMiLCJyYWRpdXMiLCJmYWNhZGUiLCJhZHZpY2UiLCJjb3dib3kiLCJwaXJhdGUiLCJjaG9zZW4iLCJhZGRsZWQiLCJwYXJlbnQiLCJnb2JsaW4iLCJtb3NxdWUiLCJibGVhY2giLCJhdXRob3IiLCJwYXBheWEiLCJjZWxlcnkiLCJhbmNob3IiLCJwcmFpc2UiLCJjb3ZlcnQiLCJiYXlpbmciLCJpbmp1cnkiLCJhY3RpdmUiLCJmYXRob20iLCJiaXN0cm8iLCJodWJyaXMiLCJtb3Jhc3MiLCJyYW5kb20iLCJ2ZW5kb3IiLCJtb3RoZXIiLCJjYXN1YWwiLCJqZXJzZXkiLCJ2ZWxsdW0iLCJjYW52YXMiLCJhZHZlcmIiLCJhdWJ1cm4iLCJ2YWN1dW0iLCJ3YWxydXMiLCJlc3RhdGUiLCJib25uZXQiLCJjb2VyY2UiLCJ2aW9saW4iLCJjbGVyZ3kiLCJmaWRnZXQiLCJudWFuY2UiLCJjb3dhcmQiLCJvcmFjbGUiLCJhYmxhemUiLCJmaWNrbGUiLCJtdWZmaW4iLCJwb3RhdG8iLCJtYWxpZ24iLCJjYWNrbGUiLCJjbGllbnQiLCJza2V0Y2giLCJtaXR0ZW4iLCJzaWVubmEiLCJhbGJpbm8iLCJ3YW50b24iLCJ0aWNrbGUiLCJiYWJvb24iLCJhdmVuZ2UiLCJjbGFzc3kiLCJmZXVkYWwiLCJhY3F1aXQiLCJ0YW5kZW0iLCJnYW1iaXQiLCJib2RpY2UiLCJwdXRyaWQiLCJiYW5kaXQiLCJjYXN0bGUiLCJ5ZWxsb3ciLCJ2aWN0b3IiLCJzY3JvbGwiLCJzaGFtYW4iLCJyb3RhcnkiLCJnYXplYm8iLCJicmFuZHkiLCJ0cm9waHkiLCJjYXNoZXciLCJ3b29kZW4iLCJhYm9hcmQiLCJhc2NlbmQiLCJhbmdzdHkiLCJ2aWxpZnkiLCJzaXN0ZXIiLCJmcmluZ2UiLCJzY290Y2giLCJmcmlza3kiLCJ2YWxsZXkiLCJiYXJlbHkiLCJnZWxhdG8iLCJzZXNhbWUiLCJvcGFxdWUiLCJnZXlzZXIiLCJmYWJyaWMiLCJhY2NydWUiLCJ1bmRlYWQiLCJtYWx0ZWQiLCJyYWJiaXQiLCJkZWZlY3QiLCJzZXJhcGgiLCJ6aXBwZXIiLCJpY29uaWMiLCJ2ZWx2ZXQiLCJzYWRkbGUiLCJiYWxsYWQiLCJqdW1wZXIiLCJzaHJ1bmsiLCJxdWl2ZXIiLCJkZWZpbGUiLCJkb2xsb3AiLCJhbGx1cmUiLCJ0aW5kZXIiLCJhbnN3ZXIiLCJyaHl0aG0iLCJiYXRtYW4iLCJnYWxsb24iLCJhdG9taWMiLCJ0b2dnbGUiLCJvY2Vsb3QiLCJmcm96ZW4iLCJmYWNpYWwiLCJjb2xsYXIiLCJhbHVtbmkiLCJzaHJpbmUiLCJkZWJ1bmsiLCJ1cmluYWwiLCJyZWxpc2giLCJjZW1lbnQiLCJkb25rZXkiLCJyZW1hcmsiLCJ0YWJhcmQiLCJhdXJvcmEiLCJyZWJvcm4iLCJ3eXZlcm4iLCJodXJkbGUiLCJjb3N0YWwiLCJ1dG1vc3QiLCJiaXRtYXAiLCJiZWhlYWQiLCJvcGlhdGUiLCJzaHJvdWQiLCJob3RrZXkiLCJhbmltYWwiLCJ3ZWFsdGgiLCJkaXNhcm0iLCJ0YWN0aWMiLCJpbmtwb3QiLCJjYXZlYXQiLCJub3JtYWwiLCJzY29yY2giLCJob3Rkb2ciLCJ2YXBpbmciLCJtYXJsaW4iLCJyaWRkbGUiLCJhcmd5bGUiLCJqZXN0ZXIiLCJjbGltYXgiLCJub3RpZnkiLCJtaXNlcnkiLCJ3aW5lcnkiLCJjb2RpZnkiLCJ3ZWFwb24iLCJkZWJyaXMiLCJtYW50cmEiLCJvYnRhaW4iLCJjaXRydXMiLCJjYW5vbGEiLCJhY2NlcHQiLCJjaGl2ZXMiLCJvdXRmaXQiLCJhbGNvdmUiLCJvcHRpY3MiLCJmYXN0ZW4iLCJjb2ZmZWUiLCJzY2hpc20iLCJjaGFrcmEiLCJ0cmF2ZWwiXQ==";
