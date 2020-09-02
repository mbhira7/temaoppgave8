<script>
    import {onMount} from "svelte"
    import { createEventDispatcher } from 'svelte'
    import Fa from 'svelte-fa'
    import {faTimes} from '@fortawesome/free-solid-svg-icons'
    import {db} from "../firebase.js"
    import {user,watchlist,page,showActorDirectorMovies,titles,moviesByActorDirector,selected} from "../stores/stores.js"
    import {w500PosterUrl} from "../constants/constant.js"
    import SelectActorDirector from "./SelectActorDirector.svelte"
    let array 
    let message = ""
    
    
    const dispatch = createEventDispatcher()
    $: movies = $user ? db.collection($user.uid) : "" //Lager en firebase collection med bruker id, hvis brukeren er logget på 
    $:{ 
        //Arrayet inneholder filmene til valgt skuespiller/regissør
        if($showActorDirectorMovies){
            array = $moviesByActorDirector
            if($moviesByActorDirector.length === 0){
                message = "Sorry,no results"
            }
            else{
                message = "Search results"
            }
        } 
        //Arrayet inneholder filmtitler som matcher med tittelsøk
        if(!$showActorDirectorMovies){
            array = $titles
            message = "Search results"
        }

        //Arrayet inneholder brukeren sine favoriserte filmer
        if($page === "Watchlist"){
            array = $watchlist
            message = "Your favourites"
        }
    }

    const viewMovie = (movie) => {
        dispatch('route',{
            route:'movieInfo',
            data: movie
        })
    }

    //Fjerner favoritt fra watchlist
    const removeFavourite = (id,evt) => {
        evt.stopPropagation()
        movies.doc(`${id}`).delete();
    }

</script>


<h2 class="centerText">{message}</h2>
<div style="padding-left:2rem; padding-right:2rem;">
    {#each array as item}
        <div on:click={$page === "Watchlist" ? ( () => viewMovie( item.data() ) ) : ( () => viewMovie(item) ) } class="movie-card">
            <div class="poster" style="background-image:url('{$page === "Watchlist" ? w500PosterUrl + item.data().poster_path : "https://image.tmdb.org/t/p/original" + item.poster_path}')"  >
                <div class="rating-box">
                    <p class="vote">{$page === "Watchlist" ? item.data().vote_average : item.vote_average}</p>
                </div>
            </div>
            <div class="right">
                <h3 style="margin-top:5px;">{$page === "Watchlist" ? item.data().title : item.title}</h3>
                <p>{$page === "Watchlist" ? item.data().overview : item.overview}</p>
                {#if $page === "Watchlist"}
                    <div class="delete-icon" on:click={(evt) => removeFavourite(item.data().id,evt)}>
                        <Fa icon={faTimes} size="1.3x" color="white" />
                    </div>
                {/if}
            </div>
        </div>
    {/each}
</div>
<SelectActorDirector />



<style>
    .delete-icon{
        position: absolute;
        top: 0;
        right: 0;
        padding:1.3rem;
    }

    .movie-card{
        display:grid;
        position: relative;
        grid-template-columns: 105px 60vw;
        grid-auto-rows: 170px;
        gap:1.2rem;
        margin-top:1.2rem;
        margin-bottom:1.2rem;
        padding-left:2rem;
        box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(58, 58, 58, 0.4);
        padding:1rem;
        overflow: hidden;
        cursor: pointer;
        border-radius:10px;
        background-color: rgba(155,155,155,0.07);
    }



    .poster{
        height:100%;
        width:100%;
        border-radius:8px;
        position:relative;
        background-size: 100% 100%;

    }

    p{
        line-height:1.7rem;
    }
    

</style>