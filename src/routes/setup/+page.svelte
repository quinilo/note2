<script>
    import axios from "axios";

    let url = ""
    let errorBool = false
    let errorMsg = "Unknown error"

    function connect() {

        my_modal_3.showModal()

        axios.get(url + "/note2-ping")
            .then((response) => {
                console.log("RES" + response)
                if (response.data === "pong!") {
                    setCookie("url", url, 350)
                    window.location.href = "/"
                }
            }).catch((error) => {
                errorMsg = error.message
            errorBool = true
        })
    }

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value}; ${expires}; path=/`;
    }
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

            <button on:click={() => connect()} id="btn" class="btn btn-outline btn-success mt-5 green-400">CONNECT</button>
        </div>
    </div>

    <dialog id="my_modal_3" class="modal">
        <div class="modal-box">
            <h3 class="text-lg font-bold">Connecting to server...</h3>
            {#if errorBool}
                <div>{errorMsg}</div>
                <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
            {:else}
                <span class="loading loading-spinner loading-lg mt-5"></span>
            {/if}
        </div>
    </dialog>
</main>