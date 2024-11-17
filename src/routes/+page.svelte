<script>
  import svelteLogo from "../assets/svelte.svg";
  import viteLogo from "../assets/svelte.svg";
  import Counter from "../lib/Counter.svelte";
  import Login from "../lib/Login.svelte";
  import CreateCollection from "../lib/CreateCollection.svelte";
  import "../app.css";
  import axios from 'axios';

  const backend = "http://localhost:3003"

  let loggedIn = false;
  let loaded = false;
  let collections = [];
  let notes = [];

  function logout() {
    loggedIn = false;
  }

  function login() {
    loggedIn = true;
  }

  updateCollections();
  function updateCollections() {
  }

  let exports = {
    login: login,
  };

  //Check login
  axios.get(backend + "/api/hello-world", {withCredentials: true}).then((response) => {
    loggedIn = response.data !== "auth failed";
    loaded = true
  })
</script>

<main class="app">
  {#if !loggedIn}
    {#if loaded}
      <Login {exports} />
    {/if}
  {:else}
    <button class="btn" on:click={logout()}>logout</button>

    <div class="flex flex-row">
      <div class="basis-1/6 flex-col">
        Collections
        <CreateCollection {exports} />
      </div>
      <div class="basis-1/6">
        Notes
      </div>
      <div class="basis-4/6">03</div>
    </div>
  {/if}
</main>
