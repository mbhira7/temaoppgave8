<script>
    import {getData,apiKey,w500PosterUrl} from "../constants/constant.js"
    import {showActorDirectorMovies,crew,moviesByActorDirector,selected} from "../stores/stores.js"

    /*Bruker den valgte personen sin id til å fetche ut filmer personen har spilt inn i/regissert
    (basert på om brukeren har valgt å søke etter actor/director)*/
    const setActorDirector = async (id) => {
        await getData(`https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${apiKey}`)
            .then(
                $selected === "Director" ?  (
                    res => $moviesByActorDirector = res.crew.filter(a => {
                    return a.job === "Director" && a.release_date
                })) 
                    : res => $moviesByActorDirector = res.cast.filter(a => a.release_date)
            )
        $showActorDirectorMovies = true
    }

</script>

{#if !$showActorDirectorMovies}
    <div class="flex actor-container" >
        {#each $crew as item}
            <div class="cursor-pointer" style="margin-right:1.3rem;" on:click={() => setActorDirector(item.id)}>
                <div class="image-container">
                    {#if item.profile_path }
                        <img class="castProfile" src={w500PosterUrl + item.profile_path} alt="Profile pic"/>
                    {:else} 
                        <div class="castProfile empty">
                            <p class="message">No image</p>
                        </div>
                    {/if}
                </div>
                <p class="break-word" style="max-width:7rem;">{item.name}</p>
            </div>
        {/each} 
    </div>  
{/if}


<style>
     .image-container{
        height:105px;
        width:70px;
        margin-right:0.7rem;
    }

     .empty{
       background-color: #111;
    }

   .actor-container{
       max-width: 95vw;
       overflow-x: scroll;
    }

</style>