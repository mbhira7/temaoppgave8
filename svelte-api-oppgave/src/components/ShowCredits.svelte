<script>
    import {posterUrl} from "../constants/constant.js"
    export let array 
    export let title

    //Endrer objektnavn 
    const changeJobTitle = (job) => {
        if(job === "Original Music Composer"){ 
            return "Music"
        }
        else{
            return job
        }
    }
    
   
</script>

<h3>{title}</h3>
<div class="flex card-container">
    {#each array.slice(0,8) as item}
        <div class="margin-right">
            <div class="image-container">
                {#if item.profile_path}
                    <img class="castProfile" src="{posterUrl + item.profile_path}" alt="Profile pic"/>
                {:else}
                    <div class="castProfile empty">
                        <p class="message">No image</p>
                    </div>
                {/if}
            </div>
            <p class="bold">{item.job ? changeJobTitle(item.job) : ""}</p>
            <p>{item.name}</p>
        </div>
    {/each}
</div>


<style>

.card-container{
    max-width:120px;  
}

.image-container{
    height:130px;
    width:90px;
}

.message{
    position: absolute;
}

</style>