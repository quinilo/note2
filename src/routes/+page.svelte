<script>
  import svelteLogo from "../assets/svelte.svg";
  import viteLogo from "../assets/svelte.svg";
  import Counter from "../lib/Counter.svelte";
  import Login from "../lib/Login.svelte";
  import CreateCollection from "../lib/CreateCollection.svelte";
  import PocketBase from "pocketbase";
  import "../app.css";

  const pb = new PocketBase("http://quinilo.de:32772");
  let loggedIn = !pb.authStore.isValid;
  let collections = "";
  let notes = [];

  function logout() {
    loggedIn = true;
    pb.authStore.clear();
  }

  function login() {
    loggedIn = false;
    pb.collection("note_users").authRefresh().then(updateCollections);
  }

  updateCollections();
  function updateCollections() {
    if (pb.authStore.isValid) {
      collections = "";
      try {
        for (let c of pb.authStore.model.collections) {
          collections =
            collections +
            '<div><button class="btn btn-ghost mb-3" onclick=\'console.log("kekw")\'>' +
            c +
            "</button></div>";
        }
      } catch (error) {}
    }
  }

  async function loadCollection(name) {
    const record = await pb
      .collection("note_notes")
      .getFullList({ fields: "name", filter: `collection = '${name}'` })
      .then((res) => {
        console.log(res);
      });
  }

  let exports = {
    login: login,
  };
</script>

<main class="app">
  {#if loggedIn}
    <Login {exports} />
  {:else}
    <button class="btn" on:click={logout()}>logout</button>

    <div class="flex flex-row">
      <div class="basis-1/6 flex-col">
        Collections
        {#each pb.authStore.model.collections as col (col)}
          <div>
            <button class="btn btn-ghost mb-3" on:click={loadCollection(col)}
              >{col}</button
            >
          </div>
        {/each}
        <CreateCollection {exports} />
      </div>
      <div class="basis-1/6">
        Notes
        {#each notes as n (n)}
          <div><button class="btn btn-ghost mb-3">{n.name}</button></div>
        {/each}
      </div>
      <div class="basis-4/6">03</div>
    </div>
  {/if}
</main>
