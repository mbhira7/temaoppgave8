<script>
	import { createEventDispatcher } from 'svelte'
	import {page,showDisplayMovies,watchlist,user} from "./stores/stores.js"
	import Home from "./components/Home.svelte"
	import Browse from "./components/Browse.svelte"
	import Header from "./components/Header.svelte"
	import DisplaySearchResults  from "./components/DisplaySearchResults.svelte"
	import Watchlist from "./components/Watchlist.svelte"
	import Movie from "./components/Movie.svelte"

	let movieId
	$: $page
	

// Tar imot data fra alle dispatchene og sender de videre 
const route = (e) => {
	movieId = e.detail.data.id
	$showDisplayMovies = false
}
</script>


<Header on:route={route} />
{#if $page === "Home"}
	{#if $showDisplayMovies}
		<Home on:route={route}/>
	{:else}
		<Movie movieId={movieId} />
	{/if}
{/if}
{#if $page === "Browse"}
	{#if $showDisplayMovies}
		<Browse on:route={route}/>
	{:else}
		<Movie movieId={movieId} />
	{/if}
{/if}

{#if $page === "DisplaySearchResults"}
	{#if $showDisplayMovies}
		<DisplaySearchResults on:route={route}/>
	{:else}
		<Movie movieId={movieId} />
	{/if}
{/if}

{#if $page === "Watchlist"}
	{#if $showDisplayMovies}
		<Watchlist on:route={route}/>
	{:else}
		<Movie movieId={movieId} />
	{/if}
{/if}



