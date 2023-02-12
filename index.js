

const formEl = document.getElementById("movie-form")
const searchMain = document.getElementById("search-main")
const watchlistMain = document.getElementById("watchlist-main")

const myApiKey = "aa0ccf9b"
const url = "http://www.omdbapi.com/"
const placeHolderImg = "https://via.placeholder.com/148x222.png?text=No+Image+Available"

let movieIDArray = localStorage.getItem("movieIDs") === null ? [] : JSON.parse(localStorage.getItem("movieIDs"))

formEl.addEventListener("submit", (e)=> {
    e.preventDefault()
    
    const formData = new FormData(formEl)
    const title = formData.get("movie-search")
    searchMain.innerHTML = ""

    //get list of movie titles that match with our search

    fetch(`${url}?s=${title}&apikey=${myApiKey}`).then(res=>{
        if(res.ok){
            return res.json()
        }
        throw new Error("Something went wrong")
    })
    
        .then(data =>{
            if(data.Response === "False"){    //Search has zero matches
                searchMain.innerHTML += `
            <div  class="not-found">
                <h2>Unable to find what you're looking for. Please try another search.</h2>
            </div>`
    
            }else{
                // For each title, fetch its additional info (rating, genre etc..) and 
                // render the final movie card

                data.Search.forEach(element => {
                    const {imdbID} = element 
                    fetchMovieInfo(url, imdbID, myApiKey, searchMain)
                });
            }
        })
        .catch(err => console.log(err))
    
})

//TODO: refractor to ternary
document.addEventListener("click", (e)=>{
    const movieID = e.target.dataset.id
    const btn = e.target.parentElement

    if(e.target.id === "add-movie"){
        if(!movieIDArray.includes(movieID)){
            movieIDArray.unshift(movieID)
            btn.innerHTML = `
            <i class="fa-solid fa-trash" 
                                data-id="${movieID}"
                                id="add-movie">
                            </i>
                            <p>Remove</p>
            `
            // const x = document.getElementsByClassName("add-movie")
            // console.log(x[0].textContent += "bye")
            
        }else{
            movieIDArray=  movieIDArray.filter(movie => movie !== movieID)
            btn.innerHTML = `
            <i class="fa-solid fa-circle-plus" 
                data-id="${movieID}"
                id="add-movie">
            </i>
            <p>Watchlist</p>
            `
        }
        localStorage.setItem("movieIDs", JSON.stringify(movieIDArray))

        
    }
})





function fetchMovieInfo(APIurl, Movieid, ApiKey, htmlEl) {
            fetch(`${APIurl}?i=${Movieid}&apikey=${ApiKey}`)
                .then(res => {
                    if(res.ok){
                        return res.json()
                    }
                    throw new Error("Something wrong")
                })
                .then(movie =>  {
                    htmlEl.innerHTML += getMovieHtml(movie)

                })
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
                            <i data-id="${data.imdbID}" id="add-movie"
                                class= "fa-solid ${movieIDArray.includes(data.imdbID) ? "fa-trash" : "fa-circle-plus"}"
                                >
                            </i>
                            <p>${movieIDArray.includes(data.imdbID) ? "Remove": "Watchlist"}</p>
                        </div>
                    </div>
                </div>
                    <div class="bottom-section">
                        <p>${data.Plot}</p>
                    </div>  
            </div>`
                    
        return htmlString
}



