class Pawn extends THREE.Mesh {

    constructor(x) {
        super() // wywołanie konstruktora klasy z której dziedziczymy czyli z Mesha
        
        
        this.material = new THREE.MeshBasicMaterial({ color: x, map: new THREE.TextureLoader().load('mats/wood.jpg') });
        this.geometry = new THREE.CylinderGeometry(5, 5, 2, 32);
    }
}
