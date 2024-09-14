import { IPacket, PACKET_TYPE } from "./packet";

export class PacketListener {
    public functions = new Map<PACKET_TYPE, Function[]>();

    public emitReceivedPacketEvent(packet: IPacket)
    {
        if(!this.functions.has(packet.type)) return;

        const fns = this.functions.get(packet.type)!;

        for(const fn of fns)
        {
            fn(packet.data);
        }

        this.functions.delete(packet.type);

        console.log(`[PacketListener] There are ${0} functions listening for packet ${packet.type}`);
    }

    public listen(type: PACKET_TYPE, callback: Function)
    {
        if(!this.functions.has(type))
        {
            this.functions.set(type, []);
        }

        const fns = this.functions.get(type)!;
        
        fns.push(callback);

        console.log(`[PacketListener] There are ${fns.length} functions listening for packet ${type}`);
    }
}
