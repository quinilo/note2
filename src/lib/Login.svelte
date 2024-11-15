<script>
    import PocketBase from 'pocketbase';

    async function auth() {
        const pb = new PocketBase('http://quinilo.de:32772');

        const authData = await pb.collection('note_users').authWithPassword(
            'YOUR_USERNAME_OR_EMAIL',
            'YOUR_PASSWORD',
        );
    }
</script>