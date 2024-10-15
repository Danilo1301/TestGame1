import { io, Socket } from "socket.io-client";
import { BaseObject } from "../../utils/baseObject";
import { IPacket, IPacketData, PACKET_TYPE } from "./packet";
import { PacketListener } from "./packetListener";

export class Network extends BaseObject
{
    public static REDIRECT_URL: string = "";

    public get socket() { return this._socket; }

    private _socket!: Socket;
    private _onConnectCallback?: Function;
    //private _lastSentData = performance.now();
    private _packetListener = new PacketListener();
    
    constructor() {
        super();
        this.initSocket();
    }

    private initSocket()
    {
        this._socket = io(this.getAddress(), {
            autoConnect: false,
            reconnection: false
        });

        this._socket.once('connect', () => {
            console.log("connect")

            this._onConnectCallback?.();
        })

        this._socket.on('p', (packet: IPacket) => {
            this.onReceivePacket(packet);
        })

        this._socket.on('error', () => {
            console.log("error")
        })
    }

    public send<T extends IPacketData>(packetType: PACKET_TYPE, data: T)
    {
        const packet: IPacket = {
            type: packetType,
            data: data
        }
        this._socket.emit('p', packet);
        this.log(`sent packet '${packet.type}'`);
    }

    public onReceivePacket(packet: IPacket)
    {
        this.log(`reiceved packet ${packet.type}`);

        this._packetListener.emitReceivedPacketEvent(packet);
    }

    public connectAndWait()
    {
        return new Promise<void>((resolve => {
            this.connect(() => {
                resolve();
            });
        }));
    }

    public connect(callback?: Function)
    {
        this.log("connect");
        this.log(`address: (${this.getAddress()})`)

        this._onConnectCallback = callback;
        
        if(this.socket.connected) {
            this._onConnectCallback?.();
            return; 
        }

        this._socket.connect();
    }

    public getAddress()
    {
        return `${location.protocol}//${location.host}`;
    }

    public update(delta: number)
    {
        
    }

    public waitForPacket<T>(type: PACKET_TYPE)
    {
        return new Promise<T>((resolve) => {
            this._packetListener.listen(type, (data: T) => {
                
                resolve(data);
            });
        });
    }
}