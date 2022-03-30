<style global>
  @tailwind utilities;
  @tailwind components;
  @tailwind base;

  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    font-size: 140%;
  }

  @media (max-width: 500px) {
    :root {
      font-size: 120%;
    }
  }

  html {
    @apply bg-stone-200;
    height: 100%;
    width: 100%;
  }

  html.dark-mode {
    @apply bg-neutral-700;
  }

  body {
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    /* prevent scrolling */
    /* overflow: hidden;
    position: fixed; */
  }

  #app {
    height: 100%;
    width: 100%;
  }
</style>
