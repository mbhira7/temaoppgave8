<script>
    import { createEventDispatcher } from 'svelte'
    import {showDisplayMovies,selected,showActorDirectorMovies,titles,crew,moviesByActorDirector,page,searchValue} from "../stores/stores.js"
    import {apiKey,getData,w500PosterUrl} from "../constants/constant.js"
    export let searchResultsArray
    export let noResultsMessage 
    import DisplaySearchResults from "./DisplaySearchResults.svelte"
    const dispatch = createEventDispatcher()

    const viewMovie = (movie) => {
        dispatch('route',{
            route:'movieInfo',
            data: movie
        })
    }

    const showAll = () => {
        $titles = searchResultsArray.filter(result => result.title) //Filtrerer ut filmer 
        $crew = searchResultsArray.filter(result => result.name) // Filtrerer ut skuespillere og regissører
        $searchValue = ""
        $page = "DisplaySearchResults"
        $showActorDirectorMovies = false
        $showDisplayMovies = true //Går ut av filmartikkel
    }

    const setActorDirector = async (id) => {
        $searchValue = "" //Nuller ut søkefeltet
        $page = "DisplaySearchResults" //Går til ny page
        $showActorDirectorMovies = true //Viser filmene til valgt skespiller/regissør
        $showDisplayMovies = true //Går ut av filmartikkel

        /*Bruker den valgte personen sin id til å fetche ut filmer personen har spilt inn i/regissert
        (basert på om brukeren har valgt å søke etter actor/director)*/
        await getData(`https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${apiKey}`)
            .then(
                $selected === "Director" ?  (
                    res => $moviesByActorDirector = res.crew.filter(a => {
                        return a.job === "Director" && a.release_date
                })) 
                    : res => $moviesByActorDirector = res.cast.filter(a => a.release_date) //Viser filmer skuespilleren har spilt i
            )
        $showActorDirectorMovies = true
        
    }


</script>

<!--Dropdown section med resultater fra søk-->
<section class="results-section" >
    {#if searchResultsArray.length > 0}
        {#each searchResultsArray.slice(0,8) as item}
            <div class="flex card cursor-pointer" on:click={item.name ? () => setActorDirector(item.id) : () => viewMovie(item)}>
                <div class="image-container">
                    {#if item.profile_path || item.poster_path}
                        <img class="castProfile" src={w500PosterUrl + (item.title ? item.poster_path : item.profile_path)} alt="Poster"/>
                    {:else} 
                        <div class="castProfile empty">
                            <p class="message">No image</p>
                        </div>
                    {/if}
                </div>
                <p style="margin-top:3px; max-width:11rem;">{item.title ? item.title : item.name}</p>
            </div>
        {/each}
        <button on:click={showAll} class="bold cursor-pointer">
            Show all results
        </button>
    {:else}
        <h4>{noResultsMessage ? noResultsMessage  : "Loading.."}</h4>
    {/if}
</section>


<style>
    .results-section{
        max-height:350px;
        overflow-y: scroll;
        background-color:rgb(41, 41, 41);
        border-radius: 10px;
        margin-top: 10px;
        padding: 0 0 0 1rem;
        transition: all 0.4s;
    }

    .image-container{
        height:105px;
        width:70px;
        margin-right:0.7rem;
    }

    .card{
        gap:1rem;
        margin-top:0.5rem;
    }

    button{
        padding:1rem 0 1rem 0;
    }

    .message{
        font-size:0.8rem;
    }

</style>