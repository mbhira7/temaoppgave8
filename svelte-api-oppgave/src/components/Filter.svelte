<script>
    import {onMount} from "svelte"
    import Fa from 'svelte-fa'
    import { faPlus,faMinus } from '@fortawesome/free-solid-svg-icons'
    import {filterChoiceValue,chosenGenres,languageValue,decadeStartValue,decadeEndValue} from "../stores/stores.js"
    
    export let heading
    export let array 
    export let year
    export let genre
    export let language

    let showPlusSign = true

    const genreSearch = (id,i,clicked) => {
        //Går gjennom de valgte sjangrene og finner indeksen som matcher med sjanger som blir klikket på
        const indeks = $chosenGenres.findIndex(g => g === id)

        //Legger ikke til flere sjangre hvis lengden på arrayet er > 3
        if($chosenGenres.length === 3 && array[i].clicked === false ) {
            return
        }
        
        //Togggler mellom klikket og ikke klikket for hvert element 
        array[i].clicked = !clicked

        //Legger til ny valgt sjanger, så lenge den ikke finnes i arrayet fra før
        if(array[i].clicked === true && ! $chosenGenres.includes(array[i].id)) {
            $chosenGenres = [...$chosenGenres, array[i].id].slice(0,3)
        }

        //Sletter sjanger fra arrayet hvis det finnes fra før
        else{
            $chosenGenres.splice(indeks,1)
        }

    }

    const yearAndLanguageSearch = (id,i,clicked) => {
        array[i].clicked = !clicked
        
        //Setter alle andre elementer utenom den brukeren klikker på til false
        const alleAndre = array.filter(item => item.id !== id)
        alleAndre.forEach(a => {
            a.clicked = false
        }) 

        //Gjør om tiår til presis datoformat
        const replaceCharacter = () => {
            let str = `${id}-12-31`;
            str = setCharAt(str,3,"9");
            $decadeEndValue = str
        }

        const setCharAt = (str,i,chr) => {
            if(i > str.length-1) return str;
            return str.substr(0,i) + chr + str.substr(i+1);
        }

        if(array[i].clicked) {
            if(language){ 
                $languageValue = id //Hvis brukeren filtrerer etter språk 
            }
            else{
                replaceCharacter()
                $decadeStartValue = `${id}-01-01` //Hvis brukeren filtrerer etter tiår
            }
        }
        else{
            if(language){
                $languageValue = ""
            }
            else{
                $decadeStartValue = ""
                $decadeEndValue = ""
            }
            
        }
    }   

    const setFilterChoice = (evt) => {
        //Blir satt til enten OR eller AND
        $filterChoiceValue = evt.target.textContent 
    }
</script>

<div class="flex">
    <h4 class="margin-right">{heading}</h4>
    <div on:click={() => showPlusSign = !showPlusSign}>
        <Fa icon={showPlusSign ? faPlus : faMinus} size="1x" class="cursor-pointer"/>
    </div>
</div>


{#if !showPlusSign}
    <div class="main-container" >
        <div class="filter-container" >
            {#if genre}
                <h5 style="margin-top:auto;">(Max 3 genres)</h5>
                <div class="flex">
                    <button on:click={setFilterChoice} class="{$filterChoiceValue === "OR" ? "active " : ""} orAndButton button1">OR</button>
                    <button on:click={setFilterChoice} class="{$filterChoiceValue === "AND" ? "active " : ""} orAndButton button2">AND</button>
                </div>
            {/if}
            {#each array as g,index}
                {#if genre}
                    <button class="{$chosenGenres.includes(g.id) ? "black" : "grey"} genre-button" on:click={() => genreSearch(g.id,index,genre.clicked)}>{g.name}</button>
                {:else}
                    <button class="{g.clicked ? "black" : "grey"} genre-button" on:click={() => yearAndLanguageSearch(g.id,index,g.clicked)}>{!year ? g.name : g.id + "s"}</button>
                {/if}
            {/each}
        </div>
    </div>
{/if}


<style>
   
   .genre-button{
        border-radius:12px;
        font-size:13px;
    }

    button{
        padding: 0.4em;
        margin: 0.4rem 0.4rem 0.4rem 0;
        cursor: pointer;
    }

    .orAndButton{
        font-size:14px;
        background-color: rgb(59, 59, 59);
        border-radius: 4px;
    }

    .button1{
        margin-right: -4px; 
        padding-right:14px;
        transition-property: padding-right;
        transition: 0.3s;
    }
    
    .button2{
        padding-right:10px;
        transition-property: padding-right;
        transition: 0.3s;
    }


    .active{
        background-color: black;
    }
    

    .grey{
        background-color: rgba(114, 114, 114, 0.4);
    }

    .black{
        background-color: rgba(0, 0, 0, 0.464);
    }

     .flex{
        align-items:center;
        
    }

    h4{
        font-size:14.5px;
    }


</style>