import * as THREE from 'three';
import { gameSize } from '../phaserLoad/config';
import MeshObject from './meshObject';

export default class Three
{
    //public static size = new Phaser.Math.Vector2(500, 500);

    public static scene: THREE.Scene;
    public static camera: THREE.PerspectiveCamera;
    public static renderer: THREE.WebGLRenderer;
    
    public static meshObjects: MeshObject[] = [];

    public static async init()
    {
        const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 100 );
        this.camera = camera;

        camera.position.y = 2;
        camera.position.z = 2;
        camera.lookAt(0, 0, 0);

        const scene = new THREE.Scene();
        this.scene = scene;

        const renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer = renderer;

        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize(gameSize.x, gameSize.y);
        renderer.setClearColor( 0xff0000, 1);

        console.log(renderer.getSize(new THREE.Vector2(0, 0)))

        //renderer.setClearColor( 0xffffff, 0);
        //renderer.setAnimationLoop( animate );
        
        document.body.appendChild( renderer.domElement );
    }

    public static animate()
    {
        const renderer = this.renderer;

        for(const meshObject of this.meshObjects)
        {
            meshObject.update();
        }

        // fix stupid issue
        //renderer.domElement.width = gameSize.x;
        //renderer.domElement.height = gameSize.y;

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

    public static getDomElementSize()
    {
        const domElement = this.renderer.domElement;
        return new THREE.Vector2(domElement.width, domElement.height);
    }

    public static createBox(width: number, height: number, depth: number)
    {
        const texture = new THREE.TextureLoader().load( 'crate.gif' );
        texture.colorSpace = THREE.SRGBColorSpace;

        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshBasicMaterial( { map: texture } );
        //const material = new THREE.MeshBasicMaterial();

        const mesh = new THREE.Mesh( geometry, material );
        this.scene.add( mesh );

        return mesh;
    }

    public static addMeshObject(mesh: THREE.Mesh)
    {
        const meshObject = new MeshObject(mesh);
        this.meshObjects.push(meshObject);
        return meshObject;
    }
}