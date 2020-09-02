export const apiKey = "cffa047e4f2e83b565d15715e66d2a35"
export const posterUrl = "https://image.tmdb.org/t/p/original"
export const w500PosterUrl = "https://image.tmdb.org/t/p/w500"

export const getData = (url) => {
    return new Promise(resolve => {
        fetch(url)
        .then(response => response.json())
        .then( response => {
            console.log("Fetched succesfully")
            if(response.fault){
                console.log(response.fault.faultstring)
            }else{
                return resolve(response)
            }
        })     
    })
}

export const createList = (array) => {
    for(let i=0; i<array.length; i++) {
        array[i].clicked = false
    }
    return array
}


//Returnerer en string som ikke overstiger maks antall tegn
export const shortenText = (str, length) => {
    let ending = '...';
    
    if (str.length > length) {
        return str.substring(0, length - ending.length) + ending;
    } 
    else {
        return str
    }

}


