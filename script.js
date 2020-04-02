const musicContainer = document.querySelector('#music-container');
const playBtn = document.querySelector('#play');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const repeatBtn = document.querySelector('#rep');

const shuffleBtn = document.querySelector('#shuffle');
const volumeSlider = document.querySelector('#volume');
const audio = document.querySelector('#audio');
const time = document.querySelector('#time');
const duration = document.querySelector('#duration');
const progress = document.querySelector('#progress');
const progressContainer = document.querySelector('#progress-container');
const title = document.querySelector('#title');
const logoSong = document.querySelector('#cover');
const songName = document.querySelector('h1');

const songs = ['hey', 'summer', 'ukulele', 'nomy'];

// индекс трека, который будет запускаться первым
let songIndex = 0;
let repeat = false;
let shuffle = false;

audio.loop = false;
loadSong(songs[songIndex]);

// загрузка песни
function loadSong(song) {
    title.innerHTML = song;
    audio.src = `music/${song}.mp3`;
    logoSong.src = `img/${song}.jpg`;
    if (song === 'hey') {
        songName.innerHTML = `трек - ${song}`;
    } else if (song === 'summer') {
        songName.innerHTML = `трек - ${song}`;
    } else if (song === 'ukulele') {
        songName.innerHTML = `трек - ${song}`;
    } else {
        songName.innerHTML = `трек - ${song}`;
    }
    audio.volume = volumeSlider.value;
    setTimeout(showDuration, 1000);
    time.innerHTML = convertTime(Math.round(audio.currentTime));
}

setInterval(updateSong, 100);
// текущее время трека
function updateSong() {
    let convert = Math.round(audio.currentTime);
    time.textContent = convertTime(convert);
}
// конвертер для audio.currentTime
function convertTime(secs) {
    let min = Math.floor(secs/60);
    let sec = secs % 60;
    min = (min < 10) ? '0' + min : min;
    sec = (sec < 10) ? '0' + sec : sec;
    return (min + ':' + sec);
}
// длительность трека
function showDuration() {
    let durMath = Math.floor(audio.duration);
    duration.textContent = convertTime(durMath);
}

// проигрывание трека
function playSong() {
    musicContainer.classList.add('play');
    playBtn.querySelector('i.fas').classList.remove('fa-play');
    playBtn.querySelector('i.fas').classList.add('fa-pause');
    audio.play();
}
// пауза
function pauseSong() {
    musicContainer.classList.remove('play');
    playBtn.querySelector('i.fas').classList.remove('fa-pause');
    playBtn.querySelector('i.fas').classList.add('fa-play');
    audio.pause();
}

// запуск предыдущей трека
function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
    playSong();
}

// запуск следующей трека
function nextSong() {
    songIndex++;
    if (songIndex > songs.length -1) {
        songIndex = 0;
    }
    loadSong(songs[songIndex]);
    playSong();
}

// shuffle Song 
function shuffleSong() {
    shuffleBtn.classList.toggle('active');
    shuffle = true;
    if (shuffleBtn.classList.contains('active')) {
    let shuffleSounds = songs[Math.floor(Math.random() * songs.length)];
        console.log(`пришла песня - ${shuffleSounds}, shuffle - ${shuffle}`);
        title.innerHTML = shuffleSounds;
        songName.innerHTML = `трек - ${shuffleSounds}`;
        audio.src = `music/${shuffleSounds}.mp3`;
        logoSong.src = `img/${shuffleSounds}.jpg`;
        shuffle = false;
        playSong();
    } else {
        console.log('Shuffle off')
    }
}

// repeat
function repeatSong() {
    repeatBtn.classList.toggle('active');
    if (repeatBtn.classList.contains('active')) {
        audio.loop = true;
    } else {
        audio.loop = false;
    }
}

// прогресс бар
function updateProgress(e) {
    const {duration, currentTime} = e.srcElement;
    const progressProcent = (currentTime / duration) * 100;
    progress.style.width = `${progressProcent}%`;
}

// регулировка прогрессбара
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

playBtn.addEventListener('click', () => {
    const isPlaying = musicContainer.classList.contains('play');

    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

function adjustVolume() {
    audio.volume = volumeSlider.value;
}

document.addEventListener('DOMContentLoaded', () => {
    audio.volume = 0.2;
}, false)

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
repeatBtn.addEventListener('click', repeatSong);


shuffleBtn.addEventListener('click', shuffleSong);
audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);

// true <-> true;
if (!repeat) {
    audio.addEventListener('ended', nextSong);
} else {
    audio.addEventListener('ended', repeatSong);
}
if (!shuffle) {
    audio.addEventListener('ended', nextSong);
    console.log(`shuffle отключён: ${shuffle}`);
} else {
    audio.addEventListener('ended', shuffleSong);
    console.log(`shuffle включён: ${shuffle}`);
}
