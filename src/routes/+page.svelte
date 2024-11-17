<script>
  // @ts-nocheck

  import svelteLogo from "../assets/svelte.svg";
  import viteLogo from "../assets/svelte.svg";
  import Counter from "../lib/Counter.svelte";
  import Login from "../lib/Login.svelte";
  import CreateCollection from "../lib/CreateCollection.svelte";
  import "../app.css";
  import axios from "axios";

  const backend = "http://localhost:3003";

  let loggedIn = false;
  let loaded = false;
  /**
   * @type {any}
   */
  let collections;
  let notes = [];
  let collection;

  function logout() {
    loggedIn = false;
  }

  function login() {
    loggedIn = true;
    updateCollections();
  }

  function updateCollections() {
    axios
      .get(backend + "/api/categories", { withCredentials: true })
      .then((response) => {
        collections = response.data;
      });
  }

  function loadCollection(name) {
    collection = name;
  }

  function createNote() {
    axios.get(backend + "/api/createNote/" + collection, {
      withCredentials: true,
    });
  }

  let exports = {
    login: login,
  };

  //Check login
  axios
    .get(backend + "/api/hello-world", { withCredentials: true })
    .then((response) => {
      loggedIn = response.data !== "auth failed";
      loaded = true;

      if (loggedIn) login();
    });
</script>

<main class="app">
  {#if !loaded}
    <h1>Loading note2...</h1>
  {/if}
  {#if !loggedIn}
    {#if loaded}
      <Login {exports} />
    {/if}
  {:else}
    <button class="btn" on:click={logout()}>logout</button>

    <div class="flex flex-row">
      <div class="basis-1/6 flex-col">
        Collections
        {#each collections as col}
          <div>
            <button class="btn btn-ghost mb-3" on:click={loadCollection(col)}
              >{col}</button
            >
          </div>
        {/each}
        <CreateCollection {exports} />
      </div>
      <div class="basis-1/6 flex-col">
        Notes
        <div>
          {#if collection}
            <button on:click={createNote()} class="btn btn-success"
              >create</button
            >
          {/if}
        </div>
      </div>
      <div class="basis-4/6">03</div>
    </div>
  {/if}
</main>
