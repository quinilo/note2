<script>
  // @ts-nocheck

  import svelteLogo from "../assets/svelte.svg";
  import viteLogo from "../assets/svelte.svg";
  import Counter from "../lib/Counter.svelte";
  import Login from "../lib/Login.svelte";
  import Topbar from "../lib/Topbar.svelte";
  import CreateCollection from "../lib/CreateCollection.svelte";
  import axios from "axios";

  let backend = "http://localhost:3003";

  let loggedIn = false;
  let loaded = false;
  /**
   * @type {any}
   */
  let collections;
  let notes = [];
  let note;
  let collection;
  let fontSize = 16;
  let fullScreen = false;
  let showAlert = false;
  let modal = false;

  if (cookie() === null) window.location.href = "/setup"
  backend = cookie()

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
    console.log("aaAS");
    collection = name;

    axios
      .get(backend + "/api/notes/" + name, { withCredentials: true })
      .then((response) => {
        notes = response.data;
      });
  }

  function createNote() {
    axios
      .get(backend + "/api/createNote/" + collection, {
        withCredentials: true,
      })
      .then((response) => {
        loadCollection(collection);
      });
  }

  function openNote(n) {
    note = n
  }

  function saveNote() {
    axios.post(backend + "/api/updateNote/" + note.id, {
      name: note.name,
      content: note.content
    }, {
      withCredentials: true
    }).then(function (response) {
      showAlert = true

      setTimeout(() => {
        showAlert = false;
      }, 3000);
    })
  }

  function toggleFullScreen() {
    fullScreen = !fullScreen;
  }

  let exports = {
    login: login,
    logout: logout,
    cookie: cookie

  };

  function cookie() {
    const nameEQ = `url=`;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.startsWith(nameEQ)) {
        return cookie.substring(nameEQ.length);
      }
    }
    return null;
  }

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

    <Topbar {exports} />

    <div class="flex flex-row">
      {#if !fullScreen}
      <div class="basis-1/6 flex-col">
        Collections
        {#each collections as col}
          <div>
            <button
              class="btn btn-ghost mb-3"
              on:click={() => loadCollection(col)}>
              {col}
            </button>
          </div>
        {/each}
        <CreateCollection {exports} />
      </div>
      <div class="basis-1/6 flex-col">
        {collection}
        {#each notes as n}
          <div>
            <button on:click={() => openNote(n)} class="btn btn-ghost mb-3">
              {n.name}
            </button>
          </div>
        {/each}
        <div>
          {#if collection}
            <button on:click={() => createNote()} class="btn btn-success"
              >create</button
            >
          {/if}
        </div>
      </div>
      {/if}
      <div class="w-full flex-col">

        Note
        {#if note}
        <div>
          <input
            type="text"
            placeholder="Type here"
            bind:value={note.name}
            class="input input-bordered w-11/12 mb-4 mt-5"
          />
        </div>
        <div>
          <textarea
            class="textarea textarea-success w-11/12 h-96 mb-4"
            style="height: 55vh; font-size: {fontSize}px"
            bind:value={note.content}
            placeholder="Bio"
          ></textarea>
        </div>
        <div>
          <input
            type="range"
            min="0"
            max="100"
            class="range range-success"
            bind:value={fontSize}
          />
        </div>
        <div>
          <button on:click={() => toggleFullScreen()} class="btn btn-ghost">Full screen</button>
          {#if !fullScreen}
          <button class="btn btn-success m-2" on:click={() => saveNote()}>Save</button>
          <button class="btn btn-warning" on:click={() => modal.showModal()}>Delete</button>
          {/if}
        </div>

          <dialog bind:this={modal} id="my_modal_1" class="modal">
            <div class="modal-box">
              <h3 class="text-lg font-bold">Delete {note.name}?</h3>
              <p class="mx-9">This note will be permanently deleted and you cant restore it!</p>
              <div class="modal-action">
                <form method="dialog">
                  <button class="btn m-3">Close</button>
                  <button class="btn btn-warning">Delete</button>
                </form>
              </div>
            </div>
          </dialog>
        {/if}
      </div>
    </div>
  {/if}

  {#if showAlert}
    <div class="toast">
      <div class="alert alert-info">
        <span class="loading loading-dots loading-md"></span><span class="font-bold">Updated successful!</span>
      </div>
    </div>
  {/if}
</main>
