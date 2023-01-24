function novoElemento(tagName, className) {
    const element = document.createElement(tagName)
    element.classList.add(className)
    return element
}

function Barreira(reversa = false) {
    this.elemento = novoElemento("div", "barreira")

    const borda = novoElemento("div", "borda")
    const corpo = novoElemento("div", "corpo")
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)

    this.setAltura = altura => corpo.style.height = `${altura}px`
}

function ParDeBarreiras(altura, abertura, x) {
    this.elemento = novoElemento("div", "parDeBarreiras")

    // colisão
    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura + 42)
        const alturaInferior = altura - alturaSuperior - abertura + 42
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }

    this.getX = () => parseInt(this.elemento.style.left.split("px")[0])
    this.setX = (x) => this.elemento.style.left = `${x}px`
    this.getLargura = () => this.elemento.clientWidth

    this.sortearAbertura()
    this.setX(x)
}

function Barreiras(altura, largura, abertura, espaço, notificarPonto) {
    this.pares = [
        new ParDeBarreiras(altura, abertura, largura + 134),
        new ParDeBarreiras(altura, abertura, largura + espaço + 134),
        new ParDeBarreiras(altura, abertura, largura + espaço * 2 + 134),
        new ParDeBarreiras(altura, abertura, largura + espaço * 3 + 134)
    ]

    const deslocamento = 3

    this.animar = () => {
        this.pares.forEach(par => {
            const x = par.getX() - deslocamento
            par.setX(x)

            if (par.getX() < - par.getLargura()) {
                par.setX(par.getX() + espaço * 4)
                par.sortearAbertura()
            }

            const meio = largura / 2
            const cruzouMeio = par.getX() + deslocamento >= meio
                && par.getX() < meio

            cruzouMeio && notificarPonto()
        })
    }

}

function Passaro(altura) {
    let voando = false;
    this.elemento = novoElemento("img", "passaro");
    this.elemento.src = "imgs/batman.png"

    this.getY = () => parseInt(this.elemento.style.bottom.split("px")[0])
    this.setY = (y) => this.elemento.style.bottom = `${y}px`

    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false

    this.animar = () => {
        const novoY = this.getY() + (voando ? 6 : -4);
        const alturaMax = altura - this.elemento.clientHeight

        if (novoY <= 0) {
            this.setY(0);
        } else if (novoY >= alturaMax) {
            this.setY(alturaMax)
        } else {
            this.setY(novoY)
        }
    }

    this.setY(altura / 2)
}

function Progresso() {
    this.elemento = novoElemento("div", "progresso")
    this.atualizarPontos = (pontos) => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
}

function sobrepor(elementoA, elementoB) {
    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left
        && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top
        && b.top + b.height >= a.top

    return horizontal && vertical
}

function colidir(passaro, barreiras) {
    let colidiu = false
    barreiras.forEach(ParDeBarreiras => {
        const superior = ParDeBarreiras.superior
        const inferior = ParDeBarreiras.inferior
        if (!colidiu) {
            colidiu = sobrepor(superior.elemento, passaro.elemento)
                || sobrepor(inferior.elemento, passaro.elemento)
        }
    })
    return colidiu
}

window.onload = () => {
    const audio = document.createElement("audio")
    audio.src = "./sounds/game.mp3"
    document.body.appendChild(audio)
    audio.play()
}

function loopGame(){
    setInterval(()=>{
        document.querySelector("audio").play()
    }, 4400)
}

setTimeout(() => {
    loopGame()
},4400)

function FlappyBird() {
    let pontos = 0

    const jogo = document.querySelector("[wm-flappy]")
    const altura = jogo.clientHeight
    const largura = jogo.clientWidth

    const passaro = new Passaro(altura)
    const progresso = new Progresso()
    const barreiras = new Barreiras(altura, largura, 280, 350, () => {
        progresso.atualizarPontos(++pontos)
    })

    barreiras.pares.forEach(par => {
        jogo.appendChild(par.elemento)
    })
    jogo.appendChild(passaro.elemento)
    jogo.appendChild(progresso.elemento)

    this.start = () => {
        const temporizador = setInterval(() => {
            barreiras.animar()
            passaro.animar()
            
            if (colidir(passaro, barreiras.pares)) {
                clearInterval(temporizador)
                window.location.href = "./gameover.html"
            }
        }, 20)
    }
}

new FlappyBird().start()