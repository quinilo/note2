<script>
    let themes = ["note2", "coffee", "forest", "black", "cyberpunk", "light"]
</script>

<div class="navbar bg-base-200 mb-4">
    <div class="navbar-start">
        <div class="dropdown">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
                <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                    <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h7" />
                </svg>
            </div>
            <ul
                    tabindex="0"
                    class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                <li><a>Reload</a></li>
                <li><a>About</a></li>
                <li><a>GitHub</a></li>
            </ul>
        </div>
    </div>
    <div class="navbar-center">
        <h1 class="font-bold text-xl">not logged in</h1>
        <button class="btn " on:click={() => logout()}>logout</button>
    </div>
    <div class="navbar-end">
        <div class="dropdown">
            <div tabindex="0" role="button" class="btn m-1">
                Theme
                <svg
                        width="12px"
                        height="12px"
                        class="inline-block w-2 fill-current opacity-60"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 2048 2048">
                    <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                </svg>
            </div>
            <ul tabindex="0" class="dropdown-content bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl">
                {#each themes as theme}
                    <li>
                        <input
                                type="radio"
                                name="theme-dropdown"
                                class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                                aria-label="{theme}"
                                value="{theme}" />
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</div>