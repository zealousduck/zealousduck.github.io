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

  body {
    height: 100vh;
    width: 100vw;
    padding: 0;
    margin: 0;
  }

  #app {
    height: 100%;
    width: 100%;
  }
</style>
