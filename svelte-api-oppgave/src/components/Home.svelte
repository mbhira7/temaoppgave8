<script>
	import {onMount} from "svelte"
	import { createEventDispatcher } from 'svelte'
	import { fade } from 'svelte/transition'
	import Fa from 'svelte-fa'
    import { faAngleLeft, faAngleRight,faPause,faPlay } from '@fortawesome/free-solid-svg-icons'
	import {apiKey,getData,shortenText,posterUrl} from "../constants/constant.js"
	import Movie from './Movie.svelte'
	import DisplayMovies from "./DisplayMovies.svelte"
   
	const trendingMoviesUrl = `https://api.themoviedb.org/3/movie/popular?&api_key=${apiKey}`
    const newMoviesUrl = `https://api.themoviedb.org/3/discover/movie?primary_release_year=2020&api_key=${apiKey}`
    const upComingMoviesUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`
    const nowPlayingUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`
	
	let trendingMovies = []
    let newMovies = []
    let upComingMovies = []
	let nowPlaying = []

	let interval 
	let loaded = false
	let i = 0
	let stopSlide = false
	let slidesLength = 8

	const dispatch = createEventDispatcher()
	
	//Fetcher data
	onMount(async () => {
		await getData(trendingMoviesUrl)
        .then(res => trendingMovies = res.results)
        
		await getData(newMoviesUrl)
			.then(res => newMovies = res.results)
		await getData(upComingMoviesUrl)
			.then(res => upComingMovies = res.results)
		await getData(nowPlayingUrl)
			.then(res => nowPlaying = res.results)
    
		await slideshow()
		
		loaded = true
	})

    const viewMovie = (movie) => {
        dispatch('route',{
            route:'movieInfo',
            data: movie
		})
    }

	const slideshow = (p) => {
		if(upComingMovies.length > 0 && loaded){
			
			//Går til neste slide
			if(p !== "previous"){
				if(i >= slidesLength ) {
					i = 0
				}
			}
			
			//Går til forrige slide
			if(p === "previous"){
				if(i > slidesLength){
					i = slidesLength - 1
				}

				if(i === 1){
					i = slidesLength + 1
				}
				
				i--
			}

			//Kjører slideshow som vanlig
			else{
				i++
			}
			
		}

	}

	//Toggler mellom play og pause ikonene
	//Stopper og kjører slideshow avhenging av ikonene
	const toggle = (evt) => {
		evt.stopPropagation()
		stopSlide = !stopSlide

		if(stopSlide){
			stopSlideshow()
		}

		else{
			nextMovie()
		}
	}

	//Går til neste slide manuelt
	const nextMovie = (param) => {
		if(!stopSlide){
			slideshow(param)
			interval = clearInterval(interval)
			interval = setInterval(slideshow, 3000)
		}
		else{
			slideshow(param)
		}
		
	}

	//Stopper slideshow
	const stopSlideshow = () => {
		interval = clearInterval(interval)
	}

	interval = setInterval(slideshow, 3000)

</script>

{#if loaded}
	<div in:fade="{{duration:1200}}" on:click={() =>viewMovie(upComingMovies[i])} class="slide transition cursor-pointer" style="  background-image: linear-gradient(transparent 80%,rgb(17, 17, 17)),url('{posterUrl + upComingMovies[i].backdrop_path}'); transition:2s;" >
		<div on:click={toggle} class="top padding white">
			<Fa icon={!stopSlide ? faPause : faPlay} size="1.3x"/>
		</div>
		
		<div class="wrapper">
			<div on:click={(evt) => evt.stopPropagation()} class="white text-box transition2" >
				<h2 class="text-shadow">{upComingMovies[i].title}</h2>
				<p class="text-shadow">{shortenText(upComingMovies[i].overview,250)}</p>
				<div class="flex icons">
					<div style="margin-right:2rem;" on:click={() => nextMovie("previous")}>
						<Fa icon={faAngleLeft} size="2x"/>
					</div>
					<div on:click={() => nextMovie()}>
						<Fa icon={faAngleRight} size="2x"/>
					</div>
				</div>
			</div>
		</div>
	</div>

	<DisplayMovies title="New releases" on:route array={newMovies}/>
	<DisplayMovies title="Trending movies" on:route array={trendingMovies}/> 
{/if}


<style>
	.icons{
		position: absolute;
		bottom:0;
		right:0;
		padding:1.2rem;
		margin-top:2rem;
	}

	.wrapper{
		position:absolute;
		height:280px;
		width:420px;
		left:0;
	}

	.text-shadow{
		text-shadow: 1px 1px 2px rgb(11, 17, 109);
	}

	.text-box{
		position: relative;
		left:0;
		background-color: rgba(0,0,0,0.5);
		height:100%;
		overflow:hidden;
		width:100%;
		line-height: 1.8rem;
		padding:1.2rem;
		box-shadow: 2px 2px 12px black;
	}

	.text-box:hover{
		transform: scale(1.03);
	}

	.top{
		position:absolute; 
		top:0; 
		right:0;
	}

	.transition{
		transition: 2s;
	}

	.slide{
		width: 100vw;
		height: 75vh;
		background-size: cover;
		background-repeat: no-repeat;
		background-position:top;
		position: relative;
		display: grid;
		place-items: center;
	}

	.padding{
		padding: 1.3rem
	}

</style>
