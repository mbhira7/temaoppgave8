<script>
    import { onMount } from 'svelte'
    import {fly, fade} from 'svelte/transition'
    import Fa from 'svelte-fa'
    import { faBookmark as emptyBookmark} from '@fortawesome/free-regular-svg-icons'
    import { faBookmark as fullBookmark} from '@fortawesome/free-solid-svg-icons'
    import {user,watchlist} from "../stores/stores.js"
    import {db} from "../firebase.js"
    import {apiKey,getData,createList,shortenText,posterUrl} from "../constants/constant.js"
    import Header from './Header.svelte'
    import ShowCredits from "./ShowCredits.svelte"
    export let movieId

    let movieDetails = []
    let videoes = []
    let cast = []
    let reviews = []
    let personer = []
    let showCredits = true
    let loaded = false
    let showEmptyBookmark = true
    let logInMessage = ""
    let movies
    
    $:{
        if(movieId){
            loadData() //Fetcher data hver gang det kommer inn en ny filmId
        }
        if($user){
            //Sjekker om brukeren er logget på, og lager en firebase collection med brukeren sin unike id
            movies = db.collection($user.uid)
            checkIfMovieExists() //Sjekker om filmen finnes i databasen 
        }
    }
    
    $:trailerTeaser = videoes.find(video => video.name.includes("Trailer") || video.name.includes("Teaser"))
    
    $:crew = personer.filter(person => {
        return person.job === "Director" || person.job === "Screenplay" || person.job === "Original Music Composer" || person.job === "Producer"
    })
    
    onMount( async () => {
        await loadData()
    })

    const checkIfMovieExists = async () => {
        const ref = movies.doc(`${movieId}`);
        const movie = await ref.get();

        if(movie.exists){
            showEmptyBookmark = false
        }
        else{
            showEmptyBookmark = true
        }
    }

    const loadData = async () => {
        await getData(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`)
            .then(res => movieDetails = res)

        await getData(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`)
            .then(res => videoes = res.results)

        await getData(`https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${apiKey}`)
            .then(res => reviews = res.results)

        await getData(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`)
            .then(res => {
                cast = res.cast
                personer = res.crew
            })

        await createList(reviews)

        loaded = true
    }
   
    //Returnerer filmens spilletid i timer og minutter
    const convertToHoursMinutes = (num) => {
        let number = num
        let hours = (number / 60)
        let restHours = Math.floor(hours);
        let minutes = (hours - restHours) * 60;
        let restMinutes = Math.round(minutes);
        return (restHours > 0 ? restHours + " hr " : "") + (restMinutes > 0 ? (restMinutes + " min") : "");
    }

    //Toggler mellom read more/read less for hver anmeldelse
    const checkIndex = (i,clicked) => {
        reviews[i].clicked = !clicked
    }

    //Toggler mellom bookmark ikonene
    //Legger til og fjerner favoritter i databasen
    const addToWatchlist = () => {
        showEmptyBookmark=!showEmptyBookmark
        
        if(!showEmptyBookmark){
            movies.doc(`${movieId}`).set({
                id:movieId,
                title:movieDetails.title,
                overview:movieDetails.overview,
                poster_path:movieDetails.poster_path,
                vote_average:movieDetails.vote_average,
                release_date:movieDetails.release_date   
            })
        }

        else {
            movies.doc(`${movieId}`).delete();
        }
    }

</script>

{#if loaded}
    <div in:fly="{{y:700, delay:300, duration:900}}" 
        out:fade class="background"  style="background-image:linear-gradient(to top,transparent 80%, rgb(0, 0, 0)),url('{posterUrl + movieDetails.backdrop_path}')">
        <div class="gradient">
            {#if trailerTeaser}
                <div class="video-container">
                    <iframe title="Trailer" src="https://www.youtube.com/embed/{trailerTeaser.key}?rel=0;&autoplay=0&fs=1" frameborder="0" allowfullscreen="allowfullscreen"></iframe>
                </div>
            {:else}
                {#if movieDetails.poster_path}
                    <img src="{posterUrl + movieDetails.poster_path}" alt="Movie poster" style="height:600px; width:32vw; margin-top:30px;"/>
                {/if}
            {/if}
            
            <div>
                <h1 class="title">{movieDetails.title} </h1>
                <div class="flex alignCenter marginTop-10">
                    <h4 class="flex-info">{movieDetails.vote_average + " / 10"}</h4>
                    <h4 class="flex-info">{movieDetails.release_date.slice(0, 4)}</h4>
                    <h4 class="{movieDetails.runtime ? "flex-info" : ""}">{convertToHoursMinutes(movieDetails.runtime)}</h4>
                    <div style="margin-left:0.4rem;" on:click={$user ? addToWatchlist : () => logInMessage = "Log in to save your favourites"}>
                        {#if showEmptyBookmark}
                            <Fa icon={emptyBookmark} size="1.3x"/>
                        {:else}
                            <Fa icon={fullBookmark} size="1.3x"/>
                        {/if}
                    </div>
                </div>
                {#if !$user}
                    <h4 style="margin-top:0; ">{logInMessage}</h4>
                {/if}
                <p class="overview" >{movieDetails.overview}</p>
                <div class="flex genres-div">
                    {#each movieDetails.genres as genre}
                        <p class="genre">{genre.name}</p>
                    {/each}
                </div>
            
                <div class="flex ">
                    <h3 on:click={() => showCredits = true} class="{showCredits ? "border-bottom" : ""} margin-right cursor-pointer">Credits</h3>
                    <h3 on:click={() => showCredits = false} class="{!showCredits ? "border-bottom" : ""} cursor-pointer">Reviews</h3>
                </div>
                    
                {#if showCredits}
                    {#if cast.length > 0}
                        <ShowCredits array={cast} title="Cast"/>
                    {:else}
                        <h4>Sorry, no cast available</h4>
                    {/if}
                                
                    {#if crew.length > 0}
                        <ShowCredits array={crew} title="Crew"/>
                    {:else}
                        <h4>Sorry, no information available</h4>
                    {/if}
                            
                {:else}
                    {#if reviews.length > 0}
                        <div class="review-container">
                            {#each reviews as review, index}
                                <div class="review-border-bottom">
                                    <h3>{review.author}</h3>
                                    <p class="review">{!review.clicked ? shortenText(review.content,500) : shortenText(review.content,review.content.length)}</p>
                                    {#if review.content.length > 500 }
                                        <button on:click={() => checkIndex(index,review.clicked)}  >
                                            {!review.clicked ?  "Read more" : "Read less"}
                                        </button>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <h4>Sorry, no reviews available</h4>
                    {/if}
                {/if}
            </div>          
        </div>
    </div>
{:else}
    <h2>Loading...</h2>
{/if}


<style>
    .video-container iframe {
        width: 58vw;
        height: calc(58vw/1.7777778);
        margin-top:30px;
    }

    .flex-info:after{
        content: " | ";
        margin-right: 0.4rem;
        margin-left: 0.4rem;
    }

    .review{
        line-height: 1.7rem;
    }

    .review-container{
        max-height:500px;
        overflow-y: scroll;
        margin-right:2rem;
    }

    .genre{
        margin-right:0.7rem; 
        background-color:rgb(37, 37, 37);
        padding:0.4rem;
        border-radius:8px;
    }


    .review-border-bottom{
        border-bottom: 1px solid white;
    }

    .review-border-bottom:last-child{
        border: none;
    }
    
    .gradient{
        background-image: linear-gradient(to left,rgba(71, 71, 71, 0.45),black 65%);
    }

    .title{
        margin-bottom: 0;
    }
   
    .overview{
        line-height: 1.5rem;
        max-width:50vw;
        margin-top:5px;
    }

    .background{
        margin-left: 2rem;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: 0%;
    }

    button{
        padding-bottom: 1rem;
        padding-left: 0;
    }
    
   
</style>