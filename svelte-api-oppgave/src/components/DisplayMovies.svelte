<script>
    import { createEventDispatcher } from 'svelte'
    import { fly } from 'svelte/transition';
    export let title
    export let array
    
    const dispatch = createEventDispatcher()

    const viewMovie = (movie) => {
        dispatch('route',{
            route:'movieInfo',
            data: movie
        })
    }

</script>


<div class="white padding">
    <h2>{title}</h2>
    <div class="movie-div white" >
        <div class="movie-div2"> 
            {#each array as movie}
                <div on:click={()=>viewMovie(movie)} style="margin-right:1.3rem; " >
                    <div class="poster cursor-pointer" style="background-image:url('{"https://image.tmdb.org/t/p/original" + movie.poster_path}')"  >
                        <div class="rating-box">
                            <p class="vote">{movie.vote_average}</p>
                        </div>
                    </div> 
                    <p class="center cursor-pointer">{movie.title}</p>
                </div>
            {/each}
        </div>
    </div>
</div>

		

<style>
    .movie-div{
		position: relative;
        width:auto;
    }

    .movie-div2{
        display:flex;
        overflow-x:scroll; 
    }

	.poster{
        position: relative;
        background-size: 100% 100%;
		height:210px;
        width:140px;
        border-radius:8px;
    }

    .center{
        margin-left:0.8rem;
        font-weight: 600;
    }

    .padding{
        padding:1.2rem;
    }

</style>