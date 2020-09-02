<script>
    import {onMount} from "svelte"
    import {db} from "../firebase.js"
    import {watchlist,user} from "../stores/stores.js"
    import DisplaySearchResults from "./DisplaySearchResults.svelte"
    let loaded = false
    
    onMount(async () => {
        if($user){
            //Sjekker om brukeren er logget på, og lager en firebase collection med brukeren sin unike id
            const movies = db.collection($user.uid) 
            await movies
                .onSnapshot(snap => {
                    //Henter ut brukeren sine favoritter fra firebase 
                    $watchlist= snap.docs 
            })
        }

         loaded = true
    })
   
   
</script>

{#if loaded}
    {#if $user }
        {#if $watchlist.length > 0}
            <DisplaySearchResults on:route/>
        {:else}
            <h1 class="centerText">Add your favourites first!</h1>
        {/if}
    {:else}
        <h1 class="centerText">Log in to see your watchlist</h1>
    {/if}
{/if}

