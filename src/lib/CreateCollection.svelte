<script>
    import PocketBase from 'pocketbase';

    const pb = new PocketBase('http://quinilo.de:32772');
    let name

    function update() {
        const data = {
            "collections": [name]
        };

        const record = pb.collection('note_users').update(pb.authStore.model.id, data);
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
            <button on:click={update()} class="btn btn-success">create</button>
            <label for="my_modal_6" class="btn">close</label>
        </div>
    </div>
</div>