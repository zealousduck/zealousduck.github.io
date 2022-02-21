<style global>
  @tailwind utilities;
  @tailwind components;
  @tailwind base;

  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    font-size: 125%;
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

  main {
    display: flex;
    flex-direction: row;
    justify-content: center;
    text-align: center;
    margin: 0 auto;
    padding: 0;
    height: 100%;
    width: 100%;
  }

  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }

    p {
      max-width: none;
    }
  }
</style>
