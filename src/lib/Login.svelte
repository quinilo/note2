<script>
    import axios from 'axios';
    export let exports

    let name = ""
    let password = ""

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
            }
        })
    }
</script>

<div class="flex justify-center">
    <div>
        <h1 class="text-5xl font-bold mb-2 text-green-400">Login</h1>

        <h1 class="mb-5">Welcome back {name}</h1>

        <label class="form-control w-full max-w-xs">
            <div class="label">
                <span class="label-text">Email or username</span>
            </div>
            <input bind:value={name} type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
        </label>

        <label class="form-control w-full max-w-xs mt-3">
            <div class="label">
                <span class="label-text">Password</span>
            </div>
            <input bind:value={password} type="password" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
        </label>

        <button on:click={auth()} id="btn" class="btn btn-outline btn-success mt-5 green-400">LOGIN</button>
    </div>
</div>
