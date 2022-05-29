
class Game {

    constructor() {

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0x222222);

        this.axes = new THREE.AxesHelper(1000)
        this.scene.add(this.axes)
        this.camera.position.set(0, 65, 100)
        this.camera.lookAt(this.scene.position)

        this.pokab = false
        this.pokac = false

        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector2()

        this.yellowMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, map: new THREE.TextureLoader().load('mats/wood.jpg') });
        this.whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffdddd, map: new THREE.TextureLoader().load('mats/wood.jpg') });
        this.blackMaterial = new THREE.MeshBasicMaterial({ color: 0x753742, map: new THREE.TextureLoader().load('mats/wood.jpg') });

        document.getElementById("root").append(this.renderer.domElement);

        this.szachownica = [

            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],

        ];

        this.pionki = [

            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],

        ];
        this.pionkiClone = [

            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],

        ];
        this.yellowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('mats/wood.jpg')

        });
        this.blackerMaterial = new THREE.MeshBasicMaterial({
            color: 0x332222,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('mats/wood.jpg')

        });
        

        this.box = new Board("#332222")
        this.box2 = new Board("#aaaaaa")

        this.box.name = "blackBoard"
        this.box2.name = "whiteBoard"

        this.pawn = new Pawn("#ffdddd")
        this.pawn2 = new Pawn("#753742")

        this.pawn.name = "whitePawn"
        this.pawn2.name = "blackPawn"

        this.objectBoard = 0
        this.createBoard(this.szachownica)

        console.log(this.objectBoard);

        console.log(this.scene.children);

        this.yellowCells = []

        this.canKill = false
        this.toKill = {}
        this.killingCell = {}
        this.whitesKilled = 0
        this.blacksKilled = 0
        

        let whiteMoving = false
        let blackMoving = false
        let movingPawn
        let moved = false
        window.addEventListener("mousedown", (e) => {
            this.mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;
            this.raycaster.setFromCamera(this.mouseVector, this.camera);
            const intersects = this.raycaster.intersectObjects(this.scene.children);


            if (intersects.length > 0) {

                // zerowy w tablicy czyli najbliższy kamery obiekt to ten, którego potrzebujemy:
                // console.log(intersects[0].object);
                console.log(intersects[0].object.info);
                if (intersects[0].object.name == "whitePawn" && net.white == true && net.currentMove == 'white') {
                    this.yellowCells.forEach(element => {
                        element.material = this.blackerMaterial
                        this.yellowCells = []
                    });
                    console.log("Nacisnieto Bialy Pionek");
                    console.log(intersects[0].object.info);
                    try {
                        movingPawn.material = this.whiteMaterial
                    }
                    catch {
                        console.log("movingPawn not defined");
                    }
                    moved = false
                    intersects[0].object.material = this.yellowMaterial
                    whiteMoving = true
                    blackMoving = false
                    movingPawn = intersects[0].object
                    console.log(whiteMoving);
                    this.szachownica.forEach((row,i) => {
                        row.forEach((cell,j) => {
                            if(cell.name == 'blackBoard'){
                                if( cell.info.x - movingPawn.info.x == -1 ){
                                    if( cell.info.z - movingPawn.info.z == -1 || cell.info.z - movingPawn.info.z == 1 ){
                                        if(this.pionkiClone[i][j] == 0){
                                            cell.material = this.yellowMaterial
                                            this.yellowCells.push(cell)
                                        }
                                        if(this.pionkiClone[i][j] == 2){
                                            if(cell.info.z - movingPawn.info.z == -1){
                                                if(this.pionkiClone[i-1][j-1] == 0){
                                                    this.szachownica[i-1][j-1].material = this.yellowMaterial
                                                    this.yellowCells.push(this.szachownica[i-1][j-1])
                                                    this.canKill = true
                                                    this.toKill = {x:i, z:j }
                                                    this.killingCell = {x:i-1,z:j-1}
                                                    console.log("==============");
                                                    console.log(this.toKill);
                                                    console.log(this.killingCell);
                                                    console.log("==============");
                                                }
                                            }
                                            if(cell.info.z - movingPawn.info.z == 1){
                                                if(this.pionkiClone[i-1][j+1] == 0){
                                                    this.szachownica[i-1][j+1].material = this.yellowMaterial
                                                    this.yellowCells.push(this.szachownica[i-1][j+1])
                                                    this.canKill = true
                                                    this.toKill = {x:i, z:j }
                                                    this.killingCell = {x:i-1,z:j+1}
                                                    console.log("==============");
                                                    console.log(this.toKill);
                                                    console.log(this.killingCell);
                                                    console.log("==============");
                                                }
                                            }
                                            
                                        }
                                        
                                    }
                                    
                                }
                            }
                        });
                    });


                } if (intersects[0].object.name == "blackPawn" && net.black == true && net.currentMove == 'black') {
                    this.yellowCells.forEach(element => {
                        element.material = this.blackerMaterial
                        this.yellowCells = []
                    });
                    console.log("Nacisnieto Czarny Pionek");
                    console.log(intersects[0].object.info);
                    try {
                        movingPawn.material = this.blackMaterial
                    }
                    catch {
                        console.log("movingPawn not defined");
                    }
                    moved = false
                    intersects[0].object.material = this.yellowMaterial
                    blackMoving = true
                    whiteMoving = false
                    movingPawn = intersects[0].object
                    console.log(whiteMoving);
                    this.szachownica.forEach((row,i) => {
                        row.forEach((cell,j) => {
                            if(cell.name == 'blackBoard'){
                                if( cell.info.x - movingPawn.info.x == 1 ){
                                    if( cell.info.z - movingPawn.info.z == -1 || cell.info.z - movingPawn.info.z == 1 ){
                                        if(this.pionkiClone[i][j] == 0){
                                            cell.material = this.yellowMaterial
                                            this.yellowCells.push(cell)
                                        }
                                        if(this.pionkiClone[i][j] == 1){
                                            if(cell.info.z - movingPawn.info.z == -1){
                                                if(this.pionkiClone[i+1][j-1] == 0){
                                                    this.szachownica[i+1][j-1].material = this.yellowMaterial
                                                    this.yellowCells.push(this.szachownica[i+1][j-1])
                                                    this.canKill = true
                                                    this.toKill = {x:i, z:j }
                                                    this.killingCell = {x:i+1,z:j-1}
                                                    console.log("==============");
                                                    console.log(this.toKill);
                                                    console.log(this.killingCell);
                                                    console.log("==============");
                                                }
                                            }
                                            if(cell.info.z - movingPawn.info.z == 1){
                                                if(this.pionkiClone[i+1][j+1] == 0){
                                                    this.szachownica[i+1][j+1].material = this.yellowMaterial
                                                    this.yellowCells.push(this.szachownica[i+1][j+1])
                                                    this.canKill = true
                                                    this.toKill = {x:i, z:j }
                                                    this.killingCell = {x:i+1,z:j+1}
                                                    console.log("==============");
                                                    console.log(this.toKill);
                                                    console.log(this.killingCell);
                                                    console.log("==============");
                                                }
                                            }
                                            
                                        }
                                    }
                                    
                                }
                            }
                        });
                    });

                }

                if (intersects[0].object.name == "blackBoard") {
                    console.log(whiteMoving);

                    if (whiteMoving == true && moved == false) {

                        
                        
                        if (intersects[0].object.info.x - movingPawn.info.x == -1 ) {
                            if (intersects[0].object.info.z - movingPawn.info.z == 1 || intersects[0].object.info.z - movingPawn.info.z == -1  ) {
                                if (this.pionkiClone[intersects[0].object.info.x][intersects[0].object.info.z] != 1 && this.pionkiClone[intersects[0].object.info.x][intersects[0].object.info.z] != 2) {
                                    this.yellowCells.forEach(element => {
                                        element.material = this.blackerMaterial
                                        this.yellowCells = []
                                    });
                                    movingPawn.position.x = intersects[0].object.position.x
                                    movingPawn.position.z = intersects[0].object.position.z
                                    this.pionkiClone[movingPawn.info.x][movingPawn.info.z] = 0
                                    this.pionkiClone[intersects[0].object.info.x][intersects[0].object.info.z] = 1
                                    movingPawn.info = { x: intersects[0].object.info.x, z: intersects[0].object.info.z }
                                    movingPawn.material = this.whiteMaterial
                                    moved = true
                                    console.log(this.pionkiClone);

                                    const body = JSON.stringify({ pawnsData: this.pionkiClone, kills:this.blacksKilled })
                                    const headers = { "Content-Type": "application/json" }
                                    fetch("/WHITE_MOVE", { method: "post", body, headers })



                                }
                            }
                        }
                        
                        if (intersects[0].object.info.x == this.killingCell.x && intersects[0].object.info.z == this.killingCell.z ) {
                            if(this.canKill == true){
                                this.yellowCells.forEach(element => {
                                    element.material = this.blackerMaterial
                                    this.yellowCells = []
                                });
                                movingPawn.position.x = intersects[0].object.position.x
                                movingPawn.position.z = intersects[0].object.position.z
                                this.pionkiClone[movingPawn.info.x][movingPawn.info.z] = 0
                                this.pionkiClone[intersects[0].object.info.x][intersects[0].object.info.z] = 1
                                movingPawn.info = { x: intersects[0].object.info.x, z: intersects[0].object.info.z }
                                movingPawn.material = this.whiteMaterial
                                moved = true
                                this.pionkiClone[this.toKill.x][this.toKill.z] = 0
                                console.log(this.pionkiClone);

                                this.pionki.forEach(row => {
                                    row.forEach(element => {
                                        if(element != 0){
                                            if(element.info.x == this.toKill.x && element.info.z == this.toKill.z){
                                                element.position.y = -10
                                                element.position.x = 0
                                                element.position.z = 0
                                                this.blacksKilled += 1
                                                if(this.blacksKilled > 8){
                                                    this.blacksKilled = 1
                                                }
                                            }
                                        }
                                    });
                                });

                                const body = JSON.stringify({ pawnsData: this.pionkiClone, kills:this.blacksKilled})
                                const headers = { "Content-Type": "application/json" }
                                fetch("/WHITE_MOVE", { method: "post", body, headers })
                            }
                            this.canKill = false
                            this.toKill = {}
                            this.killingCell = {}
                        }

                    }
                    if (blackMoving == true && moved == false) {
                        
                        if (intersects[0].object.info.x - movingPawn.info.x == 1) {
                            if (intersects[0].object.info.z - movingPawn.info.z == 1 || intersects[0].object.info.z - movingPawn.info.z == -1  ) {
                                if (this.pionkiClone[intersects[0].object.info.x][intersects[0].object.info.z] != 1 && this.pionkiClone[intersects[0].object.info.x][intersects[0].object.info.z] != 2) {
                                    this.yellowCells.forEach(element => {
                                        element.material = this.blackerMaterial
                                        this.yellowCells = []
                                    });
                                    movingPawn.position.x = intersects[0].object.position.x
                                    movingPawn.position.z = intersects[0].object.position.z
                                    this.pionkiClone[movingPawn.info.x][movingPawn.info.z] = 0
                                    this.pionkiClone[intersects[0].object.info.x][intersects[0].object.info.z] = 2
                                    movingPawn.info = { x: intersects[0].object.info.x, z: intersects[0].object.info.z }
                                    movingPawn.material = this.blackMaterial
                                    moved = true
                                    console.log(this.pionkiClone);

                                    const body = JSON.stringify({ pawnsData: this.pionkiClone , kills:this.whitesKilled})
                                    const headers = { "Content-Type": "application/json" }
                                    fetch("/BLACK_MOVE", { method: "post", body, headers })

                                }
                            }
                        }
                        
                        if (intersects[0].object.info.x == this.killingCell.x && intersects[0].object.info.z == this.killingCell.z ) {
                            if(this.canKill == true){
                                this.yellowCells.forEach(element => {
                                    element.material = this.blackerMaterial
                                    this.yellowCells = []
                                });
                                movingPawn.position.x = intersects[0].object.position.x
                                movingPawn.position.z = intersects[0].object.position.z
                                this.pionkiClone[movingPawn.info.x][movingPawn.info.z] = 0
                                this.pionkiClone[intersects[0].object.info.x][intersects[0].object.info.z] = 2
                                movingPawn.info = { x: intersects[0].object.info.x, z: intersects[0].object.info.z }
                                movingPawn.material = this.blackMaterial
                                moved = true
                                this.pionkiClone[this.toKill.x][this.toKill.z] = 0
                                console.log(this.pionkiClone);

                                this.pionki.forEach(row => {
                                    row.forEach(element => {
                                        if(element != 0){
                                            if(element.info.x == this.toKill.x && element.info.z == this.toKill.z){
                                                element.position.y = -10
                                                element.position.x = 0
                                                element.position.z = 0
                                                this.whitesKilled += 1
                                                if(this.whitesKilled > 8){
                                                    this.whitesKilled = 1
                                                }
                                            }
                                        }
                                    });
                                });

                                const body = JSON.stringify({ pawnsData: this.pionkiClone , kills:this.whitesKilled})
                                const headers = { "Content-Type": "application/json" }
                                fetch("/BLACK_MOVE", { method: "post", body, headers })
                            }
                            this.canKill = false
                            this.toKill = {}
                            this.killingCell = {}
                        }

                    }
                }

            }

        });

        this.render() // wywołanie metody render

    }



    createBoard = (board) => {
        let i = 0
        let j = 0

        board.forEach(row => {
            row.forEach(cell => {
                if (cell == 0) {
                    let b1 = this.box.clone()
                    b1.info = { x: i, z: j }
                    board[i][j] = b1
                } else {
                    let b2 = this.box2.clone()
                    b2.info = { x: i, z: j }
                    board[i][j] = b2
                }

                board[i][j].position.x = j * 10 - 35
                board[i][j].position.z = i * 10 - 35

                this.scene.add(board[i][j])
                j += 1
            });
            i += 1
            j = 0
        });
        this.objectBoard = board

    }

    createPawns = (board) => {
        let i = 0
        let j = 0

        board.forEach(row => {
            row.forEach(cell => {
                if (cell != 0) {
                    if (cell == 1) {
                        let p = this.pawn.clone()
                        p.info = { x: i, z: j }
                        board[i][j] = p
                    } if (cell == 2) {
                        let p2 = this.pawn2.clone()
                        p2.info = { x: i, z: j }
                        board[i][j] = p2
                    }
                    board[i][j].position.y = 2
                    board[i][j].position.x = j * 10 - 35
                    board[i][j].position.z = i * 10 - 35

                    this.scene.add(board[i][j])
                }

                j += 1
            });
            i += 1
            j = 0
        });

    }

    render = () => {
        requestAnimationFrame(this.render);
        this.renderer.render(this.scene, this.camera);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        

        if (this.pokab == false && this.pokac == false) {
            
            if (net.white) {
                console.log('bialo');
                this.createPawns(this.pionki)
                this.pokab = true
                net.waitForPayerMove()
            }
            if (net.black) {
                console.log('czarno');
                this.createPawns(this.pionki)
                this.camera.position.set(0, 65, -100)
                this.camera.lookAt(this.scene.position)
                this.pokac = true
                
                net.waitForPayerMove()
                
            }
        }



    }

    
    changingPawnsBoard = (d) => {
        // console.log("===========================================");
        // console.log(this.pionkiClone);
        // console.log("===========================================");
        // console.log(d);
        // console.log("===========================================");
        if(JSON.stringify(this.pionkiClone) != JSON.stringify(d)){
            d.forEach((element, i) => {
                // console.log(element);
                element.forEach((x,j) => {
                    // console.log(x);
                    // if(x instanceof Pawn){
                    //     if(x.name == "blackPawn"){
                    //         console.log("black");
                    //         d[i][j] = 2
                    //     }
                    //     if(x.name == "whitePawn"){
                    //         console.log("white");
                    //         d[i][j] = 1
                    //     }
                    // }
                    if(x == 2){
                        console.log("black");
                        this.pionkiClone[i][j] = 2
                        this.pionki[i][j] = 2
                    }
                    if(x == 1){
                        console.log("white");
                        this.pionkiClone[i][j] = 1
                        this.pionki[i][j] = 1
                    }if(x == 0){
                        console.log("empo");
                        this.pionkiClone[i][j] = 0
                        this.pionki[i][j] = 0
                    }
                });
                
            });
            // console.log(this.pionki);
            // console.log(this.pionkiClone );
            
            // console.log("dzdoakaskdapsdasjdaol;sijda;osijdas;odhaspiduhaspdiuhasdpiohu");
            for(let i = this.scene.children.length - 1;i>-1;i--){
                // console.log(element.name);
                // if(element.name == "whitePawn" || element.name == "blackPawn" ){
                //     this.scene.remove(element)
                // }
                
                console.log(this.scene.children[i]);
                if(this.scene.children[i] instanceof Pawn){
                    
                    console.log(this.scene.children[i]);
                    this.scene.children[i].removeFromParent()
                }
                
            };
            // console.log(d);
            // this.pionki = d
            // console.log(this.pionki);
            this.createPawns(this.pionki)
            
        }
        
        // console.log(this.scene.children);
        // this.scene.children.forEach(element => {
        //     // console.log(element.name);
        //     if(element.name == "whitePawn" ||element.name == "blackPawn" ){
        //         this.scene.remove(element)
        //     }
            
        // });
        // this.createPawns(d)
    }
}