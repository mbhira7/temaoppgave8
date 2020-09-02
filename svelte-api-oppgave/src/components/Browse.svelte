<script>
    import {onMount} from "svelte"
    import { createEventDispatcher } from 'svelte'
    import Fa from 'svelte-fa'
    import { faFire,faStar,faChevronDown,faAngleRight,faForward,faAngleDown} from '@fortawesome/free-solid-svg-icons'
    import { faBookmark as bookmark1} from '@fortawesome/free-regular-svg-icons'
    import { faBookmark as bookmark2} from '@fortawesome/free-solid-svg-icons'
    import { faPlayCircle } from '@fortawesome/free-regular-svg-icons'
    import {db} from "../firebase.js"
    import{genresList,languagesList,chosenGenres,decadesList,languageValue,decadeStartValue, decadeEndValue, filterChoiceValue} from "../stores/stores.js"
    import {getData,apiKey} from "../constants/constant.js"
    import Filter from "./Filter.svelte"
    import Movie from "./Movie.svelte"
   
    let currentPage = 1
    let topRatedMoviesUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&page=`
    let trendingMoviesUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&region=US&page=`
    let nowPlayingUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&region=US&page=`
    let upcomingMoviesUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&region=US&page=`
    let movies = []
    let current = "Top rated movies"
    let showRightIcon = true
    let inputMessage = ""
    let noResultsMessage = ""
    let orAndFilter
    let showEmpty = true
    let movieUrl = topRatedMoviesUrl

    const dispatch = createEventDispatcher()

    onMount(async () => {
        await getData(topRatedMoviesUrl)
            .then(res => movies = res.results)
    })

    const viewMovie = (movie) => {
        dispatch('route',{
            route:'movieInfo',
            data: movie
        })
    }

    //Kjører funksjonen når man er på bunnen av siden 
    window.onscroll = async () => {
        if((window.innerHeight + window.scrollY) >= document.body.scrollHeight ){
            loadPages() 
       }
    }

    //Fetcher ut ny side med resultater hver gang man når bunnen av nettsiden
    const loadPages = async () => {
        await getData(movieUrl+(currentPage+=1))
            .then(res => movies = [...movies,...res.results])
    }

    //Fetcher ny data hver gang man klikker på en ny heading 
    const fetchMovies = async (evt) => {
       current = evt.target.textContent
       movieUrl = ""
       currentPage = 1

       if(current === "Top rated movies"){
           await getData(topRatedMoviesUrl)
                .then(res => movies = res.results)
            movieUrl = topRatedMoviesUrl
       }
       if(current === "Trending movies"){
           await getData(trendingMoviesUrl)
                .then(res => movies = res.results)
           movieUrl = trendingMoviesUrl
       }
       if(current === "Upcoming movies"){
           await getData(upcomingMoviesUrl)
                .then(res => movies = res.results)
            movieUrl = upcomingMoviesUrl
       }
       if(current === "Now playing"){
            await getData(nowPlayingUrl)
                .then(res => movies = res.results)
            movieUrl = nowPlayingUrl
       }
       
    }

    const toggle = () => {
        showRightIcon = !showRightIcon
    }

    //Setter inn parametrene for filtreringssøk og fetcher matchende filmer
    const filterSearch = async () => {
        inputMessage = ""
        noResultsMessage = ""
        orAndFilter = $filterChoiceValue === "AND" ? $chosenGenres : $chosenGenres.join("|")
        
        if($languageValue != "" || $chosenGenres.length > 0 || $decadeEndValue != "" || $decadeStartValue != "" ){
            movieUrl = `https://api.themoviedb.org/3/discover/movie?with_original_language=${$languageValue}&with_genres=${encodeURI(orAndFilter)}&primary_release_date.gte=${$decadeStartValue}&primary_release_date.lte=${$decadeEndValue}&api_key=${apiKey}&page=`
            await getData(movieUrl)
                .then(res => movies = res.results)
            
            if(movies.length === 0){
                noResultsMessage = "Sorry,no results"
            }
        }

        else{
            inputMessage = "Please filter by at least one parameter"
            
        }
    }

</script>


<div style=" padding: 1rem 2rem 1rem 2rem; justify-content:center;">
    <div class="grid" >
        <div>
            <div>
                <div class="flex alignCenter">
                    <Fa icon={faStar} size="1.1x" color="white" />
                    <h4 class="{current === "Top rated movies" ? "active" : ""} browse-tekst cursor-pointer" on:click={fetchMovies}  >Top rated movies</h4>
                </div>
                <div class="flex alignCenter">
                    <Fa icon={faFire} size="1.3x" color="white" />
                    <h4 class="{current === "Trending movies" ? "active" : ""} browse-tekst cursor-pointer" on:click={fetchMovies}  >Trending movies</h4>
                </div>
                <div class="flex alignCenter">
                    <Fa icon={faPlayCircle} size="1.3x" color="white" />
                    <h4 class="{current === "Now playing" ? "active" : ""} browse-tekst cursor-pointer" on:click={fetchMovies} >Now playing</h4>
                </div>
                <div class="flex alignCenter">
                    <Fa icon={faForward} size="1.3x" color="white" />
                    <h4 value="Upcoming movies" class="{current === "Upcoming movies" ? "active" : ""} browse-tekst cursor-pointer" on:click={fetchMovies} >Upcoming movies</h4>
                </div>
            </div>
            
            <div on:click={toggle} class="filter" >
                <h4 >Filters</h4>
                <Fa style="justify-self: flex-end; margin-right:1rem;" icon={showRightIcon ? faAngleRight : faAngleDown} size="1.3x" color="white" />
            </div>
            {#if !showRightIcon}
                <div class="filter-box">
                    <div style="padding-left:1rem;">
                        <Filter heading="Genres" genre={true} array={$genresList}/>
                        <Filter heading="Language" language={true} array={$languagesList}/>
                        <Filter heading="Release Year" year={true} array={$decadesList}/>
                    </div>
                    <div class="btn-container">
                        <button on:click={filterSearch} class="search-btn">Search</button>
                    </div>
                    <p class={inputMessage === "" ? "" : "input-message"}>{inputMessage}</p>
                </div>
            {/if}
        </div>
        
        <div class="right-grid">
            {#if movies.length > 0}
                {#each movies as movie}
                    <div on:click={()=>viewMovie(movie)} class="image-grid" >
                        <div class="img" style="background-image:url('{"https://image.tmdb.org/t/p/original" + movie.poster_path}')" >
                            <div class="rating-box">
                                <p class="vote">{movie.vote_average}</p>
                            </div>
                        </div>
                        <h4 class="title cursor-pointer">{movie.title}</h4>         
                    </div>
                {/each}
            {:else}
                <h2>{noResultsMessage}</h2>
            {/if}
        </div>
    </div>
</div>

<style>

    .input-message{
        padding-left:1rem; 
        padding-bottom:1rem; 
        margin:0 
    }
    .browse-tekst{
        margin-left: 1rem;
    }

    .btn-container{
        padding: 1rem 0 1rem 0.5rem; 
    }

    .search-btn{
        cursor: pointer;
        background-color: rgb(80, 80, 80);
        padding: 0.5em;
        width: 90%;
        border-radius: 12px;
        margin: 0.4rem;
    }

    .filter-box{
        width:100%; 
        height:auto; 
        background-color:rgb(41, 41, 41);
        
    }

    .rating-box{
        height:35px;
        width:35px;
    }

    .vote{
        font-size: 0.85rem;
    }

    .filter{
        background-color: rgba(155, 155, 155, 0.164);
        align-items: center;
        height: 55px;
        border-radius: 6px;
        display: grid;
        grid-template-columns: 60px auto;
        padding-left: 1rem;
    }

    .right-grid{
        display: grid;
        grid-template-columns: repeat(auto-fit,minmax(50px, 200px) );
        column-gap: 2rem;
        row-gap: 2.5rem;
        border-radius:8px;
        justify-content: center;
    }

    .active{
        border-bottom:3px solid rgb(116, 116, 116);
    }

    .grid{
        display: grid;
        grid-template-columns: 1fr 4fr;
        gap:1rem;

    }

    .image-grid{
        display: grid;
        grid-template-rows: 300px auto;
        background-color: rgba(155,155,155,0.12);
        box-shadow: 0 2px 8px rgba(165, 165, 165, 0.1);
        color:rgb(255, 255, 255);
        border-radius:10px;
        
    }

    .img{
        height:100%;
        width:100%;
        cursor: pointer;
        border-radius:6px;
        background-size: cover;
        position: relative;
    }

    .title{
        padding: 0 1rem 0 1rem; 
        word-break: break-word;
    }
   
</style>