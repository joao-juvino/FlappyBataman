const links = document.querySelectorAll(".menuLink")

const audio = document.createElement("audio")
audio.src = "./sounds/click.wav"
document.body.appendChild(audio)

links.forEach((link, index) => {
    link.onclick = event => {
        event.preventDefault()
        audio.play()
        if(index == 0){
            setTimeout(() => {
                window.location.href = "flappy.html"
            }, 300)
        }
    }
})
let personagem = "imgs/batman.png"
