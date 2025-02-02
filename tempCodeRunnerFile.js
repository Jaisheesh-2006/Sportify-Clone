async function getSongs() {
    let s = await fetch('http://127.0.0.1:3000/Projects/SpotifyClone/songs/')
    let text = await s.text()
    console.log(text)
    let div = document.createElement('div')
    div.innerHTML = text;
    let as = div.getElementsByTagName('a');
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href)
        }
    }
    console.log(songs)

}

getSongs()