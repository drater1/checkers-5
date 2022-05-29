const express = require("express")
let app = express()
let fs = require("fs")
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('static')) // serwuje stronę index.html
app.use(express.static('static/cwiczenia')) // serwuje pozostałe pliki, czyli ćwiczenia

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})

// przykładowy get obsługujący request ze strony

app.get("/", function (req, res) {

})
let currentMove = 'white'
let players = []
let pawns = [

    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],

];
let wKilled = 0
let bKilled = 0
let winner = 'none'
let loser = 'none'

app.post("/ADD_USER", (req, res) => {

    // console.log(players);
    username = req.body.username

    if (players.length == 0) {


        res.send(JSON.stringify("gracz1"))
        players.push(username)
    } if (players.length == 1) {
        // console.log(players[0]);
        // console.log(username);
        if(players[0] == username){
            res.send(JSON.stringify("zlanazwa"))
        }else{
            res.send(JSON.stringify("gracz2"))
            players.push(username)
        }

        

    } if (players.length > 1) {

        res.send(JSON.stringify("x"))
    }
    // console.log(players);
})

app.post("/RESET", (req, res) => {

    players = []
    pawns = [

        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
    
    ];
    currentMove = 'white'
    wKilled = 0
    bKilled = 0
    winner = 'none'
    loser = 'none'

})

app.post("/CHECK", (req, res) => {

    res.send(JSON.stringify(players.length))

})

app.post("/WHITE_MOVE", (req, res) => {

    // console.log(req.body)
    pawns = req.body.pawnsData
    res.end('')
    currentMove = 'black'
    bKilled = req.body.kills
    if(bKilled == 8){
        winner = 'white'
        loser = 'black'
    }

})

app.post("/BLACK_MOVE", (req, res) => {

    // console.log(req.body)
    pawns = req.body.pawnsData
    res.end('')
    currentMove = 'white'
    wKilled = req.body.kills
    
    if(wKilled == 8){
        loser = 'white'
        winner = 'black'
    }
})



app.get("/CHECK_FOR_MOVE", (req, res) => {
    // console.log(pawns);
    res.end(JSON.stringify({pawnsData:pawns,currentMove:currentMove,winner:winner,loser:loser}))

})



