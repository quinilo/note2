<script>
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'
  import Login from './lib/Login.svelte'
  import PocketBase from 'pocketbase';

  const pb = new PocketBase('http://quinilo.de:32772');
  let loggedIn = !pb.authStore.isValid

  function logout() {
    loggedIn = true
    pb.authStore.clear()
  }

  function login() {
    loggedIn = false
  }

  let exports = {
    login: login
  }

</script>

<main>

  {#if loggedIn}
    <h1>ASD</h1>
    <Login {exports}/>
  {:else}
    <button class="btn" on:click={logout()}>logout</button>

    <div class="flex flex-row">
      <div class="basis-1/6">01</div>
      <div class="basis-1/6">02</div>
      <div class="basis-4/6">03</div>
    </div>
  {/if}
</main>
