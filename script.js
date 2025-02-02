let currSong = new Audio();
let currFolder;
async function getSongs(folder) {
    currFolder = folder
    let s = await fetch(`http://127.0.0.1:3000/Projects/SpotifyClone/${folder}`)
    let text = await s.text()
    let div = document.createElement('div')
    div.innerHTML = text;
    let as = div.getElementsByTagName('a');
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    return songs

}
let a = 0;
const playMusic = (e) => {
    a++;
    currSong.src = `/Projects/SpotifyClone/${currFolder}/${e}`;
    currSong.play();
    document.querySelector('.songinfo').innerHTML = e;
    document.getElementById('play').setAttribute('src', 'pause.svg')

}
function displayTime(currentTime) {
    // Calculate the number of minutes
    const minutes = Math.floor(currentTime / 60);

    // Calculate the remaining seconds
    const seconds = Math.floor(currentTime % 60);

    // Format the minutes and seconds to always be two digits
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    // Combine minutes and seconds in the desired format
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function displayAlbums(){
    let a=await fetch(`http://127.0.0.1:3000/Projects/SpotifyClone/songs/`)
    let resp= await a.text();
    let div=document.createElement('div')
    div.innerHTML=resp
    let anchors=div.getElementsByTagName('a')
    let arr=Array.from(anchors)
    for (let index = 0; index < arr.length; index++) {
        const e = arr[index];
        
            
             console.log(e.innerHTML.replace('/',''))
             let set=e.innerHTML.replace('/','');
    

             if(set!='..'){

                 let b= await fetch(`http://127.0.0.1:3000/Projects/SpotifyClone/songs/${set}/info.json`)
        
                 let response= await b.json()
                 document.querySelector('.cardContainer').innerHTML=document.querySelector('.cardContainer').innerHTML+`<div data-folder=${set} class="card">
                 <div class="play">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" color="#000000" fill="none">
                         <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="1.5" fill="#90EE90" />
                         <path d="M19 22.3996V25.6004C19 28.639 19 30.1582 19.9115 30.7724C20.8231 31.3864 22.0696 30.707 24.563 29.3482L27.4994 27.7476C30.4998 26.1124 32 25.2948 32 24C32 22.7052 30.4998 21.8876 27.4994 20.2524L24.563 18.6519C22.0696 17.293 20.8231 16.6136 19.9115 17.2276C19 17.8418 19 19.361 19 22.3996Z" fill="black" />
                     </svg>
                 </div>
                 <img  src="/Projects/SpotifyClone/songs/${set}/cover.jpg" alt="" >
                 <h2>${response.title}</h2>
                 <p> ${response.description} </p>
             </div>`
             }

            
       }
       Array.from(document.getElementsByClassName('card')).forEach((e) => {
        console.log(e)
        e.addEventListener('click', async folder => {
            console.log(e.dataset)
            let songs = await getSongs(`songs/${e.dataset.folder}`)
            let songUL = document.querySelector('.songList').getElementsByTagName('ul')[0]
            songUL.innerHTML = '';
            for (const song of songs) {
                songUL.innerHTML = songUL.innerHTML + `<li>
                                <img src="music.svg" alt="">
                                <div class="info">
                                    <div>${song.replaceAll('%20', ' ')}</div>
                                    <div>Jaisheesh</div>
                                </div>
                                <div class="playNow flex">
                                    <div>Play Now</div>
                                     <img src="play.svg" alt="">
                                </div>
                            </li>`
            }
            Array.from(document.querySelector('.songList').getElementsByTagName('li')).forEach((e) => {
                e.addEventListener("click", () => {
    
                    console.log(e.querySelector('.info').firstElementChild.innerHTML);
                    playMusic(e.querySelector('.info').firstElementChild.innerHTML)
                }
                )
            }
            );
        }
        )

        
    }
    )
        
    }  

async function main() {
     
    displayAlbums()
   
    document.getElementById('play').addEventListener('click', () => {
        if (a == 0) {
            playMusic(document.querySelector('.songList').firstElementChild.firstElementChild.querySelector('.info').firstElementChild.innerHTML)


        }
        else if (currSong.paused) {
            document.getElementById('play').setAttribute('src', 'pause.svg')
            currSong.play();
        }
        else {
            document.getElementById('play').setAttribute('src', 'play.svg')
            currSong.pause();
        }
    }
    )

    currSong.addEventListener('timeupdate', () => {

        document.querySelector('.songtime').innerHTML = `${displayTime(currSong.currentTime)} / ${displayTime(currSong.duration)}`
        let clickPercentage = document.querySelector('.circle').style.left
        clickPercentage = ((currSong.currentTime) / (currSong.duration)) * 100 + '%'

        document.querySelector('.seekBar').style.background = `linear-gradient(to right, #c965c0 ${clickPercentage}, #3d4a3d ${clickPercentage})`;
        document.querySelector('.circle').style.left = `${clickPercentage}`;
    }
    )

    document.querySelector('.seekBar').addEventListener('click', (e) => {
        let seek = document.querySelector('.seekBar');
        // Get the click position relative to the seek bar
        const rect = seek.getBoundingClientRect();
        const clickX = e.clientX - rect.left;

        // Calculate the percentage of the click position
        const clickPercentage = clickX / rect.width;

        // Update the current time of the audio
        const newTime = clickPercentage * currSong.duration;
        currSong.currentTime = newTime;

        // Update the position of the seek circle
        document.querySelector('.circle').style.left = `${clickPercentage}`;

    });

    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector('.left').style.left = 0
        document.querySelector('.left').setAttribute('width', '25vw')
    }
    )
    document.querySelector('.close').addEventListener('click', () => {
        document.querySelector('.left').style.left = `-100%`
    }
    )

    //add event listener to prev and next button
    document.querySelector('#prev').addEventListener('click', () => {
        let testSong = currSong.src.split(`/Projects/SpotifyClone/${currFolder}/`)[1];
        testSong = testSong.replaceAll('%20', ' ')
        console.log(testSong)
        let e;
        Array.from(document.querySelector('.songList').getElementsByTagName('li')).forEach((e) => {
            if (testSong == e.querySelector('.info').firstElementChild.innerHTML) {
                if (e.previousElementSibling != null) {
                    playMusic(e.previousElementSibling.querySelector('.info').firstElementChild.innerHTML)
                }

            }
        }
        );

    }
    )
    document.querySelector('#next').addEventListener('click', () => {
        let testSong = currSong.src.split(`/Projects/SpotifyClone/${currFolder}/`)[1];
        testSong = testSong.replaceAll('%20', ' ')
        console.log(testSong)
        let e;
        Array.from(document.querySelector('.songList').getElementsByTagName('li')).forEach((e) => {
            if (testSong == e.querySelector('.info').firstElementChild.innerHTML) {
                if (e.nextElementSibling != null) {
                    playMusic(e.nextElementSibling.querySelector('.info').firstElementChild.innerHTML)
                }

            }
        }
        );

    }
    )

    document.querySelector('.volbar').addEventListener('click', (e) => {
        let vol = document.querySelector('.volbar');
        // Get the click position relative to the seek bar
        const rect = vol.getBoundingClientRect();
        const clickX = e.clientX - rect.left;

        // Calculate the percentage of the click position
        let clickPercentage = clickX / rect.width;

        // Update the current time of the audio
        currSong.volume = clickPercentage
        clickPercentage = clickPercentage * 100
        console.log(clickPercentage)
        // Update the position of the volume circle
        document.querySelector('.volbar').style.background = `linear-gradient(to right, #ffffff ${clickPercentage}%, #3d4a3d ${clickPercentage}%)`;
        document.querySelector('.circle-2').style.left = `${clickPercentage}%`;
    }
    )
    let volImage = document.querySelector('.volume')
    let volbar = document.querySelector('.volbar')
    volImage.addEventListener('mouseover', () => {
        volbar.style.visibility = 'visible';
    });

    volImage.addEventListener('mouseout', () => {
        volbar.style.visibility = 'hidden';
    });
    volbar.addEventListener('mouseover', () => {
        volbar.style.visibility = 'visible';
    });

    volbar.addEventListener('mouseout', () => {
        volbar.style.visibility = 'hidden';
    });
    volImage.addEventListener('touchstart', () => {
        volbar.style.visibility = 'visible';
    });

    volImage.addEventListener('touchend', () => {
        volbar.style.visibility = 'hidden';
    });
    volbar.addEventListener('touchstart', () => {
        volbar.style.visibility = 'visible';
    });

    volbar.addEventListener('touchend', () => {
        volbar.style.visibility = 'hidden';
    });

    volImage.addEventListener('click',() => {
        if(currSong.volume==0){
            currSong.volume=1;
            volImage.setAttribute('src',`volume.svg`)
            
        }
        else{
            currSong.volume=0;
            volImage.setAttribute('src',`mute.svg`)
            volbar.style.visibility='hidden'
        }
    }
    )

    let isDragging = false;
    let volumeCircle = document.querySelector('.circle-2')


    volumeCircle.addEventListener('mousedown', (e) => {
        isDragging = true;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    const onMouseMove = (e) => {
        if (isDragging) {
            const rect = volbar.getBoundingClientRect();
            let clickX = e.clientX - rect.left;

            // Ensure the circle stays within the bounds of the volume bar
            if (clickX < 0) clickX = 0;
            if (clickX > rect.width) clickX = rect.width;

            const clickPercentage = clickX / rect.width;

            // Update the volume of the audio
            currSong.volume = clickPercentage;

            document.querySelector('.volbar').style.background = `linear-gradient(to right, #ffffff ${clickPercentage * 100}%, #3d4a3d ${clickPercentage * 100}%)`;

            // Update the position of the volume circle
            volumeCircle.style.left = `${clickPercentage * 100}%`;
        }
    };

    const onMouseUp = () => {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    //Load the playlist when clicked
    
    


}

main()