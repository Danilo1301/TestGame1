import * as THREE from 'three';
import { config, gameSize } from '../phaserLoad/config';

export default class Three
{
    //public static size = new Phaser.Math.Vector2(500, 500);

    public static scene: THREE.Scene;
    public static camera: THREE.PerspectiveCamera;
    public static renderer: THREE.WebGLRenderer;
    public static mesh: THREE.Mesh;

    public static async init()
    {
        const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 100 );
        camera.position.z = 2;
        this.camera = camera;

        const scene = new THREE.Scene();
        this.scene = scene;

        const texture = new THREE.TextureLoader().load( 'crate.gif' );
        texture.colorSpace = THREE.SRGBColorSpace;

        const geometry = new THREE.BoxGeometry(1, 0.1, 1);
        const material = new THREE.MeshBasicMaterial( { map: texture } );
        //const material = new THREE.MeshBasicMaterial();

        const mesh = new THREE.Mesh( geometry, material );
        this.mesh = mesh;
        scene.add( mesh );


        const renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer = renderer;

        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize(gameSize.x, gameSize.y);
        renderer.setClearColor( 0xff0000, 1);

        console.log(renderer.getSize(new THREE.Vector2(0, 0)))

        //renderer.setClearColor( 0xffffff, 0);
        
        //renderer.setAnimationLoop( animate );
        

        document.body.appendChild( renderer.domElement );

        /*
        setInterval(() => {
            this.animate();
        }, 10);
        */
    }

    public static animate()
    {
        const renderer = this.renderer;

        const mesh = this.mesh;

        mesh.rotation.x += 0.01;
        //mesh.rotation.y += 0.01;

        mesh.position.x += 0.01;
        mesh.position.z -= 0.01;

        // Render the scene from the perspective of the camera
        renderer.render(this.scene, this.camera);
    }

    public static getImageData()
    {
        const canvas = this.renderer.domElement;
        const gl = this.renderer.getContext();

        const pixelBuffer = new Uint8Array(canvas.width * canvas.height * 4);   

        gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixelBuffer);

        return pixelBuffer
    }

    public static convert3DPositionTo2D(position: THREE.Vector3) {
        const camera = this.camera;
        const renderer = this.renderer;

        const vector = new THREE.Vector3(position.x, position.y, position.z);
        vector.project(camera);
    
        // Convertendo de coordenadas normalizadas para coordenadas de tela
        const widthHalf = gameSize.x / 2;
        const heightHalf = gameSize.y / 2;
    
        const x = (vector.x * widthHalf) + widthHalf;
        const y = -(vector.y * heightHalf) + heightHalf;
    
        return { x, y };
    }
}