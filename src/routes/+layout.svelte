<script !src="">
    import {onMount} from "svelte";

    export const prerender = true;
    export const ssr = false;

    import "../app.css"

    function loadThem() {
        document.documentElement.setAttribute('data-theme', cookie());
    }

    function cookie() {
        const nameEQ = `theme=`;
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.startsWith(nameEQ)) {
                return cookie.substring(nameEQ.length);
            }
        }
        return null;
    }

    onMount(() => {
        loadThem()
    })
</script>

<slot/>

<h1></h1>
