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
let repeat = false; // repeat off
let shuffle = false; // shuffle off
let wave = false; // canvas off
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
    playSong()
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
        shuffle = true;
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

function waveSong(){
    // свойства точки
    const properties = {
        // личное пространство точки
        spaceDiameter : 32, //зазор между точками
        dotDiameter   : 14, // диаметр самой точки 
        wavelength    : 100, // длина волны
        velocity      : .06, //быстрота изменения размера точки
        direction     : 1, // направление волны
        displacement  : 1 // гексагональность
    }
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let w = canvas.width = innerWidth;
    let h = canvas.height = innerHeight;
    let dotsList;

    canvas.style.background = 'rgba(252, 169, 169, 0.6)';
    document.querySelector('body').appendChild(canvas);

    // функция, отслеживающая изменения размера окна и адаптирует canvas

    window.onresize = function() {
        w = canvas.width = innerWidth;
        h = canvas.height = innerHeight;
        init();
    }

    class Dot {
        constructor(x, y) {
            //положение точки на экране
            this.x = x;
            this.y = y;
            this.radius = properties.dotDiameter / 2;
            this.scale = getDistance(x, y) / properties.wavelength;
        }

        update() {
            this.resize();
            this.draw();
        }
        // метод, обновляющий размер точки 
        resize() {
            this.scale = this.scale - properties.velocity; //this.scale - properties.velocity * properties.direction
        }

        draw() {

            let s = (1 - Math.abs(Math.sin(this.scale))); // scale
            let o = (1 - s) *255; // other color
            let r = this.radius * s; // локальный радиус * scale
            // отрисуем круг по методу
            ctx.beginPath();
            // координаты x,y, radius, начальный угол, конечный угол, замыкание отключено
            ctx.arc(this.x, this.y, r, 0 , 2 * Math.PI, false);
            ctx.closePath();
            ctx.fillStyle = 'rgba('+ '255' + ',' + '255' + ',' + '255' + ',' + s + ')';
            ctx.fill();
        }
    }

    init();
    function init() {
        dotsList = [];
        // число точек на всю ширину экрана 
        const dotsCountX = w / properties.spaceDiameter | 0; //Math.floor(w/properties.spaceDiametr);
        const dotsCountY = h / properties.spaceDiameter | 0;
        //смещение стартовой позиции                  размер зазора
        const startX = (properties.spaceDiameter + w - dotsCountX * properties.spaceDiameter) / 2;
        const startY = (properties.spaceDiameter + h - dotsCountY * properties.spaceDiameter) / 2;

        //hexagonality
        let displacement = properties.spaceDiameter / 4 * properties.displacement;

        //заполнение точками по высоте и щирине
        for (let j = 0; j < dotsCountY; j++) {
            displacement = - displacement
            let y = startY + j * properties.spaceDiameter;
            for (let i = 0; i < dotsCountX; i++) {
                let x = startX + i * properties.spaceDiameter + displacement; 
                dotsList.push(new Dot(x, y));
            }
        }    
    }
    // отображение точек на экране 
    loop();
    function loop() {
        ctx.clearRect(0, 0, w, h);

        for (let a in dotsList) {
            dotsList[a].update();
        }

        requestAnimationFrame(loop);
    }
    // функция, определяющая расстояние до точки
    function getDistance(x, y) {
        let dx = w / 2 - x;
        let dy = h / 2 - y;
        // найдём гипотенузу ( расстояние от центра экрана до точки)
        return Math.sqrt((dx * dx) + (dy * dy));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    audio.volume = 0.2;
    waveSong(); 
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
