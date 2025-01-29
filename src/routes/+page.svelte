<script>
  // @ts-nocheck

  import svelteLogo from "../assets/svelte.svg";
  import viteLogo from "../assets/svelte.svg";
  import { writable } from 'svelte/store';
  import Login from "../lib/Login.svelte";
  import Topbar from "../lib/Topbar.svelte";
  import CreateCollection from "../lib/CreateCollection.svelte";
  import axios from "axios";
  import {onMount} from "svelte";

  let backend;

  let loggedIn = false;
  let loaded = false;
  /**
   * @type {any}
   */
  let collections;
  let notes = [];
  let note;
  let collection;
  let collectionLoaded = false;
  let fontSize = 16;
  let fullScreen = false;
  let showAlert = false;
  let alert = "unknown message"
  let modal = false;
  let isSmallScreen = writable(false);
  let sessionExpired = false;

  let showCollections = true;
  let showNotes = true;
  let showCurrentNote = true;

  onMount(() => {
    console.log("C: " + cookie())

    if (cookie() === null) window.location.href = "/setup"
    backend = cookie()

    checkLogin()

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  })

  function logout() {
    axios.get(backend + "/api/logout", { withCredentials: true })
            .then((response) => {
              loggedIn = false;

              collection = null;
              note = null;
              notes = null;
              collections = []
            }).catch(error => console.error('Axios error:', error.message));
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
              loaded = true;
              loggedIn = true;
            }).catch(error => console.error('Axios error:', error.message));
  }

  function loadCollection(name) {
    note = null
    notes = null
    collection = name;
    collectionLoaded = false;

    axios
            .get(backend + "/api/notes/" + name, { withCredentials: true })
            .then((response) => {
              notes = response.data;
              collectionLoaded = true;
            }).catch(error => console.error('Axios error:', error.message));
  }

  function createNote() {
    axios
            .get(backend + "/api/createNote/" + collection, {
              withCredentials: true,
            })
            .then((response) => {
              loadCollection(collection);
            }).catch(error => console.error('Axios error:', error.message));
  }

  function openNote(n) {
    note = n

    if (isSmallScreen) {
      showCurrentNote = true;
      showCollections = false;
      showNotes = false;
    }
  }

  function closeNoteWhenSmallScreen() {
    showCurrentNote = false;
    showCollections = true;
    showNotes = true;
  }

  function saveNote() {
    axios.post(backend + "/api/updateNote/" + note.id, {
      name: note.name,
      content: note.content
    }, {
      withCredentials: true
    }).then(function (response) {
      showAlert = true

      if (response.data === "auth failed") {
        sessionExpired = true;
      }

      alert = "saved";
      setTimeout(() => {
        showAlert = false;
      }, 3000);

      return true;
    }).catch(error => {
      console.error('Axios error:', error.message)
      return false;
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

  function checkLogin() {
    axios
            .get(backend + "/api/hello-world", { withCredentials: true })
            .then((response) => {
              loggedIn = response.data !== "auth failed";

              loaded = true;
              if (loggedIn) login();
            }).catch(error => console.error('Axios error:', error.message));
  }

  function checkScreenSize() {
    isSmallScreen = window.innerWidth < 768;

    if (isSmallScreen) {
      showCollections = true;
      showNotes = true;
      showCurrentNote = false;
    } else {
      showCollections = true;
      showNotes = true;
      showCurrentNote = true;
    }
  }

  async function runRepeatingTask() {
    while (true) {
      if (note != null) {
        showAlert = true;
        alert = "saving progress...";
        await saveNote();
      }
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
  runRepeatingTask();

</script>

<main class="app">

  {#if sessionExpired}
    <div class="modal-box mx-auto bg-red-500">
      <h3 class="text-lg font-bold">Your session is expired and you have to login again!</h3>
      <div class="modal-action">
        <a on:click={window.location.href = "/"} class="btn btn-outline">Login</a>
      </div>
    </div>
  {/if}

  {#if isSmallScreen}
    {#if showCurrentNote && loaded}
      <a class="fixed top-0 left-0 btn btn-ghost m-5" href="/" on:click={() => closeNoteWhenSmallScreen()}>
        ←
      </a>
      <div class="mt-5"></div>
    {/if}
  {/if}

  {#if !loaded}
    <h1>Loading note2...</h1>
    <a href="/setup" class="btn btn-ghost">switch server</a>
  {/if}
  {#if !loggedIn}
    {#if loaded}
      <Login {exports} />
    {/if}
  {:else}

    {#if !fullScreen}
      {#if showCollections}
        <Topbar {exports} />
      {/if}
    {/if}

    <div class="flex flex-row">
      {#if !fullScreen}

        <!--
        COLLECTIONS
        -->

        {#if showCollections}
      <div class="basis-1/6 flex-col mx-5">
        <p class="font-bold">Collections</p>
        {#each collections as col}
          <div>
            <button
              class="btn btn-ghost mb-3 font-normal"
              on:click={() => loadCollection(col)}>
              {col}
            </button>
          </div>
        {/each}
        <CreateCollection {exports} />
      </div>
        {/if}

        <!--
        NOTES IN COLLECTION
        -->

        {#if showNotes}
      <div class="basis-1/6 flex-col mx-5">
        <p class="font-bold">{collection}</p>
        {#each notes as n}
          <div>
            <button on:click={() => openNote(n)} class="btn btn-ghost mb-3 font-normal">
              {n.name}
            </button>
          </div>
        {/each}
        <div>
          {#if collection}
            {#if !collectionLoaded}
            <div class="skeleton mt-2 h-4 w-full"></div>
            <div class="skeleton mt-2 h-4 w-20"></div>
            <div class="skeleton mt-2 h-4 w-full"></div>
            <div class="skeleton mt-2 h-4 w-20"></div>
            <div class="skeleton mt-2 h-4 w-20"></div>
            <div class="skeleton mt-2 mb-3 h-4 w-full"></div>
            {:else}
              <button on:click={() => createNote()} class="btn btn-success"
              >create</button
              >
            {/if}
          {/if}
        </div>
      </div>
      {/if}
      {/if}

      <!--
      NOTE
      -->

       {#if showCurrentNote}
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
          {#if !isSmallScreen} <button on:click={() => toggleFullScreen()} class="btn btn-ghost">Full screen</button>{/if}
          <div class="dropdown dropdown-hover">
            <div tabindex="0" role="button" class="btn btn-ghost">•••</div>
            <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
              <li><a>Share</a></li>
              <li><a on:click={() => modal.showModal()} >Delete</a></li>
            </ul>
          </div>
          {#if fullScreen}
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
       {/if}
    </div>
  {/if}

  {#if showAlert}
    <div class="toast">
      <div class="mx-auto loader"></div><span class="font-bold">{alert}</span>
    </div>
  {/if}
</main>

<style>
  #editor {
    text-align: left;
    height: auto;
  }

  [contenteditable="true"] {
    border: 2px solid var(bg);
    padding: 8px;
    border-radius: 4px;
    outline: none;
  }

  .loader {
    --uib-size: 80px;
    --uib-color: white;
    --uib-speed: 1.4s;
    --uib-stroke: 5px;
    --uib-bg-opacity: .1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--uib-stroke);
    width: var(--uib-size);
    border-radius: calc(var(--uib-stroke) / 2);
    overflow: hidden;
    transform: translate3d(0, 0, 0);
  }

  .loader::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: var(--uib-color);
    opacity: var(--uib-bg-opacity);
    transition: background-color 0.3s ease;
  }

  .loader::after {
    content: '';
    height: 100%;
    width: 100%;
    border-radius: calc(var(--uib-stroke) / 2);
    animation: zoom var(--uib-speed) ease-in-out infinite;
    transform: translateX(-100%);
    background-color: var(--uib-color);
    transition: background-color 0.3s ease;
  }

  @keyframes zoom {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
</style>
