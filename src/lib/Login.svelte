<script>
    import axios from 'axios';
    export let exports

    let name = ""
    let password = ""
    let adminPw = ""
    let showAlert = false

    async function auth() {

        let e = document.getElementById("btn")

        e.disabled = true;
        e.innerHTML = e.innerHTML + "<span class=\"loading loading-spinner loading-xs\"></span>"

        axios.post(exports.cookie() + "/login", {
            name: name,
            password: password
        }, {
            withCredentials: true
        }).then(function (response) {
            console.log(response);
            if (response.data === "success") {
                exports.login()
            } else {
                showAlert = true
                e.disabled = false;
                e.innerHTML = "LOGIN"

                setTimeout(() => {
                    showAlert = false;
                }, 3000);
            }
        })
    }

    function register() {
        axios.post(exports.cookie() + "/register", {
            name: name,
            password: password,
            adminPw: adminPw
        }, {
            withCredentials: true
        }).then(function (response) {
            console.log(response);
        })
    }
</script>

<div class="fixed top-0 left-0 m-5">
    <button class="btn text-4xl font-bold" on:click={create.showModal()}>+</button>
</div>

<div class="flex justify-center">
    <div>
        <h1 class="text-5xl font-bold mb-2 text-green-400">Login</h1>

        <h1 class="mb-5">Welcome back {name}</h1>

        <label class="form-control w-full max-w-xs">
            <div class="label">
                <span class="label-text">Username</span>
            </div>
            <input bind:value={name} type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
        </label>

        <label class="form-control w-full max-w-xs mt-3">
            <div class="label">
                <span class="label-text">Password</span>
            </div>
            <input bind:value={password} type="password" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
        </label>

        <button on:click={() => {auth()}} id="btn" class="btn btn-outline btn-success mt-5 green-400">LOGIN</button>
        <br>
    </div>

    <dialog id="create" class="modal">
        <div class="bg-base-200 p-5 rounded-xl">
            <form method="dialog">
            </form>
            <h3 class="text-lg font-bold">Create an account</h3>

            <label class="form-control w-full max-w-xs">
                <div class="label">
                    <span class="label-text">Username</span>
                </div>
                <input bind:value={name} type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
            </label>

            <label class="form-control">
                <div class="label content-center">
                    <span class="label-text">Password</span>
                </div>
                <input bind:value={password} type="password" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
            </label>

            <label class="form-control">
                <div class="label content-center">
                    <span class="label-text">Admin password</span>
                </div>
                <input bind:value={adminPw} type="password" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
            </label>

            <button class="btn btn-success mt-4" on:click={register()}>Create</button>

            <p class="py-4">Press ESC key to close</p>
        </div>
    </dialog>

    {#if showAlert}
        <div class="toast">
            <div class="alert alert-warning">
                <span class="loading loading-dots loading-md"></span><span class="font-bold">Login failed!</span>
            </div>
        </div>
    {/if}
</div>
