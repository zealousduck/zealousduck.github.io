import { writable } from "svelte/store";

const key = "dark-mode";
let on = false;
try {
    on = !!localStorage.getItem("dark-mode");
} catch (err) {
    // no-op
}

export const darkMode = writable(on);

darkMode.subscribe((value) => {
    localStorage.setItem(key, value ? "dark-mode" : "");
});