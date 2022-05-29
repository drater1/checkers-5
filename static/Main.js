let game;
let net;
let ui;
let pawn;
let board;
window.onload = () => {
   net = new Net();
   game = new Game();
   pawn = new Pawn();
   board = new Board();
   
   ui = new Ui();
}