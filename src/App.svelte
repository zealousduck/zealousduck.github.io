<script lang="ts">
  import logo from './assets/svelte.png'
  import Counter from './lib/Counter.svelte'
  import TailwindCss from './TailwindCSS.svelte';
  import Logo from "./lib/Logo.svelte";
import Game from './lib/Game.svelte';
</script>

<TailwindCss/>

<main class="bg-stone-500 flex centered">
  <div class="flex-col justify-center w-4/5">
    <Logo/>
    <div class=" rounded-sm">
      <Game/>
    </div>
  </div>
</main>


