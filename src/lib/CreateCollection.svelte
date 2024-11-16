<script>
    import PocketBase from 'pocketbase';
    export let exports

    const pb = new PocketBase('http://quinilo.de:32772');
    let name

    function update() {
        let data = {
            "collections": [name]
        };

        try {
            let c = pb.authStore.model.collections
            c.push(name)

            data = {
                "collections": c
            };
        } catch (e) {}

        const record = pb.collection('note_users').update(pb.authStore.model.id, data).then(exports.login());
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