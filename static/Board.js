class Board extends THREE.Mesh {

    constructor(x) {
        super() // wywołanie konstruktora klasy z której dziedziczymy czyli z Mesha
        
        
        this.material = new THREE.MeshBasicMaterial({
            color: x,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('mats/wood.jpg')

        });
        this.geometry = new THREE.BoxGeometry(10, 2, 10);
    }
}
