<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,100..900;1,100..900&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

*:focus {
  outline: none;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background: #f2f4f8;
  color: #1e293b;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
}

/* Scrollbar personalizada */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #e2e8f0;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 4px;
}
</style>

