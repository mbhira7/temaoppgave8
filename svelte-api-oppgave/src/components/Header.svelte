<script>
    import { createEventDispatcher } from 'svelte'
    import Fa from 'svelte-fa'
    import { faSearch } from '@fortawesome/free-solid-svg-icons'
    import {db,auth, googleProvider} from "../firebase.js"
    import {authState} from "rxfire/auth"
    import {user,moviesByActorDirector,page,showDisplayMovies,searchValue,selected} from "../stores/stores.js"
    import {apiKey,getData} from "../constants/constant.js"
    import DropdownResults from "./DropdownResults.svelte"
    import Movie from "./Movie.svelte"
    
    let placeholderText = "titles"
    let noResultsMessage
    let searchResultsArray = []
    let personer = []
    let showSearchBar = false
    const unsubscribe = authState(auth).subscribe(u => $user = u)

    $:{
        if($selected === "Title"){
            placeholderText = "titles"
        } 
        
        if($selected === "Actor"){
            placeholderText = "actors"
            //Filtrerer kun ut personer som er skuespillere
            searchResultsArray = personer.filter(person => person.known_for_department === "Acting") 
        }
        if($selected === "Director"){
            placeholderText = "directors"
            //Filtrerer kun ut personer som er regissører
            searchResultsArray = personer.filter(person => person.known_for_department === "Directing") 
        }
    }

    //Går tilbake til startsiden og ut av filmartikkel når brukeren logger inn
    const login = () => {
        $page = "Home"
        $showDisplayMovies = true
        auth.signInWithPopup(googleProvider)
      
    }

    //Går tilbake til startsiden og ut av filmartikkel når brukeren logger ut
    const logout = () => {
        $page = "Home"
        $showDisplayMovies = true
        auth.signOut()
    }

    //Toggler mellom å vise frem hele søkefeltet eller bare søkeikonet 
    const toggle = () => {
        showSearchBar = !showSearchBar
        $searchValue = ""
    }

    const search = async () => {
        noResultsMessage = ""

        if($searchValue.length === 0) { 
            searchResultsArray = []
            personer = []
            noResultsMessage = ""
            return 
        }

        //Fetcher ut filmer som passer med tittelsøk 
        if($selected === "Title"){
            await getData(`https://api.themoviedb.org/3/search/movie?query=${encodeURI($searchValue)}&api_key=${apiKey}`)
                .then(res => searchResultsArray= res.results)
        }

        //Fetcher ut personer som passer med skuespiller/regissør søk
        else{
            await getData(`https://api.themoviedb.org/3/search/person?query=${encodeURI($searchValue)}&api_key=${apiKey}`)
                .then(res => personer = res.results)
        }

        //Melding til brukeren, hvis søket ikke gir noe treff
        if($searchValue.length > 0 && searchResultsArray.length === 0 ) {
           noResultsMessage = "Sorry, no results"
        }
    }

    //Sørger for å gå til valgt page, at søkefeltet nulles ut, går ut av en filmartikkel
    const resetAll = (p) => {
        $page = p
        $showDisplayMovies = true
        $searchValue = ""
    }
    
</script>


<header >
    <nav>
        <div class="flex">
            <button class="margin-right" on:click={() => resetAll("Home")}>Home</button>
            <button class="margin-right" on:click={() => resetAll("Browse")}>Browse</button>
        </div>
        <div class="flex">
            <div style="display:grid;">
                <div class="search-box margin-right" >
                    {#if showSearchBar}
                        <select bind:value={$selected} name="Title" on:change={search}  >
                            <option value="Title">Title</option>
                            <option value="Actor">Actor</option>
                            <option value="Director">Director</option>
                        </select>
                    {/if}
                    <input bind:value={$searchValue} on:input={search} type="text" style="{!showSearchBar ? "padding:0; width:0" : "padding:0; width:10rem;"}" placeholder="Search for {placeholderText}" />
                    <a on:click={toggle} class="search-btn" >
                        <Fa icon={faSearch} size="1.1x" color="black" />
                    </a>
                    {#if $searchValue.length > 0}
                        <DropdownResults on:route searchResultsArray={searchResultsArray} noResultsMessage={noResultsMessage}/>
                    {/if}
                </div>
            </div>

            <div class="flex">
                <button class="margin-right" on:click={() => resetAll("Watchlist")}>Watchlist</button>
                <section  class="flex login">
                    {#if $user}
                        <img src={$user.photoURL} alt="profile pic">
                        <button on:click={logout}>Log out</button>
                    {:else}
                        <button on:click={login}>Log inn</button>
                    {/if}
                </section>
            </div>
        </div>
    </nav>
</header>





<style>
    select{
        color: black;
        background-color: transparent;
        width: 85px;
        border-right: 1px solid rgb(182, 182, 182);
        transition:0.4s;
    }

    .search-box{
        background: rgb(255, 255, 255);
        height:1.3rem;
        border-radius: 10px;
        padding:8px;
        cursor: pointer;
        z-index:1;
    }

    header{
        width: 100%;
        background-color: #111;
        color: white;
        height: 70px;
        display:grid;
        align-items: center;
    }

    header nav{
        display:grid;
        grid-template-columns: 1fr auto;
        padding:0.5rem;
    }
    
    button{
        margin-right: 1rem;
    }
    
    button:hover{
        color: gray;
        cursor: pointer;
    }

    input, button, select{
        transition: 0.4s;
    }

    img{
        height:40px;
        border-radius: 50%;
    }

    .login{
        align-items: center;
    }
    

</style>