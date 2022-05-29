
class Net {
    constructor() {
        this.statusBox = document.getElementById("statusBox")
        this.loginBox = document.getElementById("loginBox")
        this.waitScreen = document.getElementById("waitScreen")
        this.pawnChart = document.getElementById("chart")
        this.username = document.getElementById("username")
        this.waitForMoveScreen = document.getElementById("waitForMoveScreen")
        this.timer = document.getElementById("timer")
        document.getElementById("login").onclick = this.login 
        document.getElementById("reset").onclick = this.reset 
        
        // this.waitForSecondPayer = this.waitForSecondPayer.bind(this)

        this.firstIn = false
        this.white = false
        this.black = false
        this.intervalId2
        this.box
        this.x
        this.intervalId
        this.interval3
        this.currentMove
        this.count = 30
        this.set = false
        this.winner
    }

    waitForSecondPayer = () => {
        this.intervalId = setInterval(this.checkForPlayer, 500)
    }

    waitForPayerMove = () => {
        this.intervalId2 = setInterval(this.checkForPlayerMove, 500)

    }
    setTimer = () => {
        this.count = 30
        let c = 30
        this.timer.innerText = this.count
        this.interval3 = setInterval(function () {
            console.log(this.count);
            c -= 1 
            this.count = c
            this.timer.innerText = this.count
            
        }, 1000)

    }
    

    checkForPlayer = () => {
        const body = JSON.stringify({ wait: "wait" }) // body czyli przesyłane na serwer dane

        const headers = { "Content-Type": "application/json" } // nagłowek czyli typ danych

        fetch("/CHECK", { method: "post", body, headers }) // fetch
            .then(response => response.json())
            .then(
                data => {
                    // console.log(data)
                    if (data == 2) {
                        this.waitScreen.innerText = ``
                        this.white = true
                    }
                }

            )
    }

    checkForPlayerMove = () => {
        

        fetch("/CHECK_FOR_MOVE", { method: "get" })
            .then(response => response.json())
            .then(
                data => {
                    // console.log(data.pawnsData)
                    console.log(data);
                    this.currentMove = data.currentMove
                    this.winner = data.winner
                    this.waitForMoveScreen.innerText = ''
                    
                    console.log(this.count);
                    if(this.currentMove == 'white' && this.white == false){
                        this.waitForMoveScreen.innerText = "Przeciwnik ma Ruch"
                        if(this.set == false){
                            this.setTimer()
                            this.set = true
                        }
                        console.log(this.count);
                        
                        
                        
                    }if(this.currentMove == 'black' && this.black == false){
                        this.waitForMoveScreen.innerText = "Przeciwnik ma Ruch"
                        if(this.set == false){
                            this.setTimer()
                            this.set = true
                        }
                        
                        
                    }
                    if(this.currentMove == 'white' && this.white == true){
                        this.set = false
                        clearInterval(this.interval3)
                        this.timer.innerText = ''
                    }if(this.currentMove == 'black' && this.black == true){
                        this.set = false
                        clearInterval(this.interval3)
                        this.timer.innerText = ''
                    }
                    if(this.white == true && this.winner == 'white'){
                        this.waitForMoveScreen.innerText = "Wygrałeś"
                        this.set = false
                        clearInterval(this.interval3)
                        this.timer.innerText = ''
                    }
                    if(this.black == true && this.winner == 'white'){
                        this.waitForMoveScreen.innerText = "Przegrałeś"
                        this.set = false
                        clearInterval(this.interval3)
                        this.timer.innerText = ''
                    }
                    if(this.black == true && this.winner == 'black'){
                        this.waitForMoveScreen.innerText = "Wygrałeś"
                        this.set = false
                        clearInterval(this.interval3)
                        this.timer.innerText = ''
                    }
                    if(this.white == true && this.winner == 'black'){
                        this.waitForMoveScreen.innerText = "Przegrałeś"
                        this.set = false
                        clearInterval(this.interval3)
                        this.timer.innerText = ''
                    }
                    if(this.count < 1){
                        if(this.white == true && this.currentMove == 'white'){
                            this.waitForMoveScreen.innerText = "Przegrałeś"
                            this.set = false
                            clearInterval(this.interval3)
                            this.timer.innerText = ''
                        }
                        if(this.white == true && this.currentMove == 'black'){
                            this.waitForMoveScreen.innerText = "Wygrałeś"
                            this.set = false
                            clearInterval(this.interval3)
                            this.timer.innerText = ''
                        }
                        if(this.black == true && this.currentMove == 'white'){
                            this.waitForMoveScreen.innerText = "Wygrałeś"
                            this.set = false
                            clearInterval(this.interval3)
                            this.timer.innerText = ''
                        }
                        if(this.black == true && this.currentMove == 'black'){
                            this.waitForMoveScreen.innerText = "Przegrałeś"
                            this.set = false
                            clearInterval(this.interval3)
                            this.timer.innerText = ''
                        }
                    }
                    
                    game.changingPawnsBoard(data.pawnsData)
                    
                    this.box = data.pawnsData
                    this.box.forEach(row => {
                        this.x += '\n' + row

                    });
                    // x = x.replace(',','  ')
                    this.pawnChart.innerText = this.x
                    this.x = ""
                }

            )
    }
    
    login = () => {
        
        
        if (this.username.value != '') {
            

            const body = JSON.stringify({ username: this.username.value }) // body czyli przesyłane na serwer dane

            const headers = { "Content-Type": "application/json" } // nagłowek czyli typ danych

            fetch("/ADD_USER", { method: "post", body, headers }) // fetch
                .then(response => response.json())
                .then(
                    data => {
                        if (data == "gracz1") {
                            console.log("gracz 1");
                            this.statusBox.innerText = `Witaj ${this.username.value} grasz białymi`
                            this.waitScreen.innerText = `Czekaj na drugiego gracza...`
                            this.loginBox.style.visibility = 'hidden'
                            this.waitForSecondPayer()


                        } if (data == "gracz2") {
                            console.log("gracz 2");
                            this.statusBox.innerText = `Witaj ${this.username.value} grasz czarnymi`
                            this.loginBox.style.visibility = 'hidden'
                            this.black = true
                        } if (data == "zlanazwa") {
                            console.log("nazwa zajęta");
                            this.statusBox.innerText = `Nazwa ${this.username.value} jest zajęta`
                        } if (data == "x") {
                            console.log("miejsca zajęte");
                            this.statusBox.innerText = `Brak miejsc ;<`

                        }

                    }

                )

        }

    }



    reset = function () {

        const body = JSON.stringify({ reset: "reset" }) // body czyli przesyłane na serwer dane

        const headers = { "Content-Type": "application/json" } // nagłowek czyli typ danych

        fetch("/RESET", { method: "post", body, headers }) // fetch
            .then(response => response.json())
            .then(
                data => {

                }

            )

    }
}



