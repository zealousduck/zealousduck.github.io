<style global>
  @tailwind utilities;
  @tailwind components;
  @tailwind base;

  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    font-size: 150%;
  }

  @media (max-width: 410px) {
    :root {
      font-size: 125%;
    }
  }

  html {
    @apply bg-stone-200;
  }

  body {
    width: 100vw;
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
