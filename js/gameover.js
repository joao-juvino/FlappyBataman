window.onload = () => {
    const audio = document.createElement("audio")
    audio.src = "./sounds/gameover2.wav"
    document.body.appendChild(audio)
    audio.play()
}

const audio = document.createElement("audio")
audio.src = "./sounds/click.wav"
audio.classList.add("click")
document.body.appendChild(audio)

document.querySelector(".return").onclick = (event) => {
    document.querySelector(".click").play()
    setTimeout(() => {
        window.location.href = "index.html"
    }, 300)
}