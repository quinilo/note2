<script>
    import axios from "axios";
    export let exports

    const backend = exports.cookie()
    let name = ""

    function update() {

        try {
            axios.get(backend + "/api/categories", {withCredentials: true}).then((response) => {
                let c = response.data;
                c.push(name);

                axios.post(backend + "/api/setCategories", {categories: c}, {withCredentials: true}).then((response1) => {
                    console.log(response1.data)
                    window.location.reload();
                })
            })
        } catch (e) {}

    }

</script>

<div><label class="btn btn-success" for="my_modal_6">create</label></div>

<input type="checkbox" id="my_modal_6" class="modal-toggle" />
<div class="modal" role="dialog">
    <div class="modal-box">
        <h3 class="text-lg font-bold">Create a collection</h3>

        <label class="form-control">
            <div class="label">
                <span class="label-text">Name</span>
            </div>
            <input bind:value={name} type="text"  class="input input-bordered text-center" />
        </label>

        <div class="modal-action">
            <label for="my_modal_6" on:click={update()} class="btn btn-success">create</label>
            <label for="my_modal_6" class="btn">close</label>
        </div>
    </div>
</div>