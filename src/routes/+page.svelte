<script>
  // @ts-nocheck

  import svelteLogo from "../assets/svelte.svg";
  import viteLogo from "../assets/svelte.svg";
  import Login from "../lib/Login.svelte";
  import Topbar from "../lib/Topbar.svelte";
  import CreateCollection from "../lib/CreateCollection.svelte";
  import axios from "axios";
  import {onMount} from "svelte";

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

  onMount(() => {
    if (cookie() === null) window.location.href = "/setup"
    backend = cookie()
  })

  function logout() {
    axios.get(backend + "/api/logout", { withCredentials: true })
            .then((response) => {
              loggedIn = false;

              collection = null;
              note = null;
              notes = null;
              collections = []
            });
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
    note = null
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

  function updatePreview() {
    const textarea = document.getElementById('editor');
    const preview = document.getElementById('preview');
    const lines = textarea.value.split('\n');

    preview.innerHTML = lines
            .map(line => (line.startsWith('#') ? `<span class="bold">${line}</span>` : line))
            .join('\n');
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

  function format() {
    const container = document.getElementById("editor");

    if (container) {
      const divs = container.querySelectorAll("div");

      divs.forEach(div => {
        if (div.textContent.trim().startsWith("#")) {
          div.classList.add("font-bold");
        } else {
          div.classList.remove("font-bold")
        }
      });
    }
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

    {#if !fullScreen}
    <Topbar {exports} />
    {/if}

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
          <div
                  id="editor"
                  contenteditable="true"
                  class="w-11/12 h-96 mb-4 bg-base-200 mx-auto p-3 rounded-3xl"
                  style="font-size: {fontSize}px"
                  on:input={() => format()}
                  bind:innerHTML={note.content}>

          </div>
        </div>
        <div>
          <input
            type="range"
            min="0"
            max="100"
            class="range range-success"
            bind:value={fontSize}
          />
          <div id="preview" aria-hidden="true"></div>
        </div>
        <div>
          <button on:click={() => toggleFullScreen()} class="btn btn-ghost">Full screen</button>
          {#if !fullScreen}
            <div class="dropdown dropdown-hover">
              <div tabindex="0" role="button" class="btn btn-ghost">•••</div>
              <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                <li><a>Share</a></li>
                <li><a on:click={() => modal.showModal()} >Delete</a></li>
              </ul>
            </div>
          <button class="btn btn-success m-2" on:click={() => saveNote()}>Save</button>
          {:else}
            <p>words: {note.content.split(" ").length}, sentences: {note.content.split(".").length - 1}</p>
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
        {:else}
          <h1 class="font-bold accent-white text-5xl mt-16">Nothing to show!</h1>
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

<style>
  #editor {
    min-height: 55vh;
    text-align: left;
  }

  [contenteditable="true"] {
    border: 2px solid var(bg);
    padding: 8px;
    border-radius: 4px;
    outline: none;
  }
</style>
