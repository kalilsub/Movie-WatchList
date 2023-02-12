
const watchlistMain = document.getElementById("watchlist-main")

const myApiKey = "aa0ccf9b"
const url = "http://www.omdbapi.com/"
const placeHolderImg = "https://via.placeholder.com/148x222.png?text=No+Image+Available"

let movieIDArray = localStorage.getItem("movieIDs") === null ? [] : JSON.parse(localStorage.getItem("movieIDs"))


function render(){
    watchlistMain.innerHTML = ""
    movieIDArray = JSON.parse(localStorage.getItem("movieIDs"))
    if(movieIDArray.length === 0){
        console.log("no movies")
        watchlistMain.innerHTML += `<div class="empty">
        <!-- <i class="fa-solid fa-film"></i> -->
        <img src="./images/empty-state.png">
        <p>Start Exporting</p>
    </div>`
    }else{
        movieIDArray.forEach(id =>{
        fetchMovieInfo(url, id, myApiKey, watchlistMain)
        })
        // document.querySelector(".empty").style.display = "block" 
    }
}



//TODO: Try exporting functions and variables...

function fetchMovieInfo(APIurl, Movieid, ApiKey, htmlEl) {
    fetch(`${APIurl}?i=${Movieid}&apikey=${ApiKey}`)
        .then(res => {
            if(res.ok){
                return res.json()
            }
            throw new Error("Something wrong")
        })
        .then(movie => htmlEl.innerHTML += getMovieHtml(movie))
        .catch(error => console.log(error))
}


function getMovieHtml(data) {
htmlString = ` 
    <div class="movie-card">
        <div class="poster-container">
            <img class="poster" src=${data.Poster === "N/A" ? placeHolderImg : data.Poster}/>
        </div>
        <div class="movie-info">
            <div class="top-section">
                <h3>${data.Title}</h3>
                <div class="rating">
                    <i class="fa-regular fa-star"></i>
                    <p>${data.imdbRating}</p>
                </div>
            </div>
            <div class="mid-section">
                <p>${data.Runtime}</p>
                <p>${data.Genre}</p>
                <div class="add-movie" >
                    <i class="fa-solid fa-trash" 
                        data-id="${data.imdbID}"
                        id="add-movie">
                    </i>
                    <p>Remove</p>
                </div>
            </div>
        </div>
            <div class="bottom-section">
                <p>${data.Plot}</p>
            </div>  
    </div>`
            
return htmlString
}

document.addEventListener("click", (e)=>{
    const movieID = e.target.dataset.id
    if(e.target.id === "add-movie"){
        if(movieIDArray.includes(movieID)){
            const updatedArray = movieIDArray.filter(movie => movie !== movieID)
            movieIDArray = updatedArray
            localStorage.setItem("movieIDs", JSON.stringify(movieIDArray))
            render()

         }
         
        
        
    }
})

render()