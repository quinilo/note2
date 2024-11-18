<script>
    let url
</script>

<main class="app">
    <div class="flex justify-center mt-5">
        <div>
            <h1 class="text-5xl font-bold mb-2 text-green-400 mt-5">note2</h1>

            <h1 class="mb-5 text-green-400 font-bold">developed by quinilo</h1>

            <h1 class="mb-5">Welcome! Setup your note2-backend <br>url and start using the app!</h1>

            <label class="form-control w-full max-w-xs">
                <div class="label">
                    <span class="label-text">Your server url</span>
                </div>
                <input bind:value={url} type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
            </label>

            <button on:click={auth()} id="btn" class="btn btn-outline btn-success mt-5 green-400">CONNECT</button>
        </div>
    </div>
</main>