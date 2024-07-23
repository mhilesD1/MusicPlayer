const menuBtn = document.querySelector(".menu-btn"),
    container = document.querySelector(".container");

const progressBar = document.querySelector(".bar"),
    progressDot = document.querySelector(".dot"),
    currentTimeEl = document.querySelector(".current-time"),
    DurationEl = document.querySelector(".duration");


menuBtn.addEventListener("click", () => {
    container.classList.toggle("active");
});

let playing = false,
    currentSong = 0,
    shuffle = false,
    repeat = false,
    favourits = [0],
    audio = new Audio();

const songs = [
    {
        title: "Mayo kana",
        artist: "Artist JAIRO",
        img_src: "1.jpg",
        src: "1.mp3",
    },
    {
        title: "YK",
        artist: "Artist Cean Jr",
        img_src: "2.jpg",
        src: "2.mp3",
    },
];

const playlistContainer = document.querySelector("#playlist"),
      infoWrapper = document.querySelector(".info"),
      coverImage = document.querySelector(".cover-image"),
      currentSongTitle = document.querySelector(".current-song-title"),
      currentFavourite = document.querySelector("#current-favourite");

function init(){
    updatePlaylist(songs);
    loadSong(currentSong);
}

init();

function updatePlaylist(songs) {
    // Remove any existing elements
    playlistContainer.innerHTML = "";

    // Use forEach on songs array
    songs.forEach((song, index) => {
        // Extract data from song 
        const { title, src } = song;

        // Check if included in favourites array
        const isFavourite = favourits.includes(index);

        // Create a tr to wrap song
        const tr = document.createElement("tr");
        tr.classList.add("song");
        tr.innerHTML = `
            <td class="no">
                <h5>${index + 1}</h5>
            </td>
            <td class="title">
                <h5>${title}</h5>
            </td>
            <td class="length">
                <h5>2:03</h5>
            </td>
            <td>
                <i class="fas fa-heart ${isFavourite ? "active" : ""}"></i>
            </td>
        `;

        playlistContainer.appendChild(tr);

        // Play song when clicked on playlist songs
        tr.addEventListener("click", (e) => {
            // Add to favourites when click on heart
            if (e.target.classList.contains("fa-heart")) {
                addToFavourites(index);
                e.target.classList.toggle("active");
                // If heart clicked just add to favourite don't play
                return;
            }

            currentSong = index;
            loadSong(currentSong);
            audio.play();
            container.classList.remove("active");
            playPauseBtn.classList.replace("fa-play", "fa-pause");
            playing = true;
        });

        const audioForDuration = new Audio(`data/${src}`);
        audioForDuration.addEventListener("loadedmetadata", () => {
            const duration = audioForDuration.duration;
            let songDuration = formatTime(duration);
            tr.querySelector(".length h5").innerText = songDuration;
        });
    });
}

function formatTime(time) {
    // Format time like 2:30
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    // Add trailing zero if seconds less than 10
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${seconds}`;
}

// Add audio play functionality
function loadSong(num){
    // Change all the title, artist, and times to current song
    infoWrapper.innerHTML = `
        <h2>${songs[num].title}</h2>
        <h3>${songs[num].artist}</h3>
    `;

    currentSongTitle.innerHTML = songs[num].title;

    // Change the cover image
    coverImage.style.backgroundImage = `url(data/${songs[num].img_src})`;

    // Add src of current song to audio variable
    audio.src = `data/${songs[num].src}`;

    // If song is in favourites, highlight the favourite icon
    if (favourits.includes(num)) {
        currentFavourite.classList.add("active");
    } else {
        // If not, remove active class
        currentFavourite.classList.remove("active");
    }
}

// Play/pause, next, and previous functionality
const playPauseBtn = document.querySelector("#playpause"),
      nextBtn = document.querySelector("#next"),
      prevBtn = document.querySelector("#prev");

playPauseBtn.addEventListener("click", () => {
    if (playing) {
        // Pause if already playing
        playPauseBtn.classList.replace("fa-pause", "fa-play");
        playing = false;
        audio.pause();
    } else {
        // If not playing, play
        playPauseBtn.classList.replace("fa-play", "fa-pause");
        playing = true;
        audio.play();
    }
});

function nextSong() {
    // Shuffle when playing next song
    if (shuffle) {
        shuffleFunc();
        loadSong(currentSong);
    } else {
        // If current song is not last in playlist
        if (currentSong < songs.length - 1) {
            // Load the next song
            currentSong++;
        } else {
            // Else if it's the last song then play the first
            currentSong = 0;
        }
        loadSong(currentSong);
    }

    // After load, if song was playing continue playing
    if (playing) {
        audio.play();
    }
}

nextBtn.addEventListener("click", nextSong);

function prevSong() {
    // Shuffle when playing previous song
    if (shuffle) {
        shuffleFunc();
        loadSong(currentSong);
    } else {
        // If current song is not the first in playlist
        if (currentSong > 0) {
            // Load the previous song
            currentSong--;
        } else {
            // Else if it's the first song then play the last
            currentSong = songs.length - 1;
        }
        loadSong(currentSong);
    }

    // After load, if song was playing continue playing
    if (playing) {
        audio.play();
    }
}

prevBtn.addEventListener("click", prevSong);

function addToFavourites(index) {
    if (favourits.includes(index)) {
        favourits = favourits.filter(item => item !== index);
        currentFavourite.classList.remove("active");
    } else {
        favourits.push(index);
        // If coming from current favourite that is index and current are equals
        if (index == currentSong) {
            currentFavourite.classList.add("active");
        }
    }

    // After adding favourite, rerender playlist to show favourites
    updatePlaylist(songs);
}

// Also add to favourite current playing song when clicked heart
currentFavourite.addEventListener("click", () => {
    addToFavourites(currentSong);
    currentFavourite.classList.toggle("active");
});

// Shuffle functionality
const shuffleBtn = document.querySelector("#shuffle");

function shuffleSongs() {
    // If shuffle false make it true or vice versa
    shuffle = !shuffle;
    shuffleBtn.classList.toggle("active");
}

shuffleBtn.addEventListener("click", shuffleSongs);

// Shuffle songs when playing next or prev
function shuffleFunc() {
    if (shuffle) {
        // Select a random song from playlist
        currentSong = Math.floor(Math.random() * songs.length);
    }
}


// repeat function 

const repeatBtn = document.querySelector("#repeat");

function repeatSong(){
    if (repeat == 0) {
        // if repeat is off make it 1 means repeat current song
        repeat -1;
        //repeat is a off make button active
        repeatBtn.classList.add("active");
    }
    else if (repeat == 1){
        //if repeat is 1 that is only repeat current song make it 2 that means repeat playlist
        repeat = 2;
        repeatBtn.classList.add("active");
    } else {
        //else turn off repeat
        repeat = 0;
        repeatBtn.classList.remove("active");
    }
}

repeatBtn.addEventListener("click", repeatSong);
//on one click its repeat == 1 on second repeat == 2 on third repeat ==0 and revise

//now if repeat on audio end
audio.addEventListener("ended", () =>{
    if(repeat == 1){
        //if repeat current song
        //again load currentsong
        loadSong(currentSong);
        audio.play();
    } else if (repeat == 2) {
        //if repeat playlist
        //play next song
        nextSong();
        audio.play();
    } else {
        //if repeat off
        //just play all playlist on time then stop
        if (currentSong == songs.length - 1) {
            //if its last song in playlist stop playing now
            audio.pause();
            playPauseBtn.classList.replace("fa-pause", "fa-play");
            playing - false;
        } else {
            //if not last continue to next
            nextSong();
            audio.play();
        }
    }
});

//progress function

function progress() {
    //get duration and current time from audio
    let { duration, currentTime } = audio;

    //if anyone not a number make it 0

    isNaN(duration) ? (duration = 0) : duration;
    isNaN(currentTime) ? (currentTime = 0) : currentTime;

    //update time elements

    currentTimeEl.innerHTML = formatTime(currentTime);
    DurationEl.innerHTML = formatTime(duration);

    //lets move the progress dot

    let progressPercentage = (currentTime / duration) * 100;
    progressDot.style.left = `${progressPercentage}%`;
}

//update progress on audio timeupdate event

audio.addEventListener("timeupdate", progress);

//change progress when clicked on bar

function setProgress(e) {
    let width = this.clientWidth;
    let clickX = e.offsetX;
    let duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

progressBar.addEventListener("click", setProgress);
