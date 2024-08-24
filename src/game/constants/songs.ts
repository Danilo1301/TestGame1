export interface SongNote {
    time: number
    pads: number[]
    dragTime: number
}

export interface BPMChange {
    time: number
    bpm: number
}

export interface Song {
    name: string
    sound: string
    offset: number
    bpms: BPMChange[]
    notes: SongNote[]
}

export const songs: Song[] = [
    {"name":"Guns N' Roses - Sweet Child O' Mine","sound":"sound4","offset":0,"bpms":[{"time":26.50000000000027,"bpm":128},{"time":14686.09999999896,"bpm":128},{"time":30275.689000001683,"bpm":126},{"time":44576.25700000055,"bpm":127},{"time":60190.511,"bpm":128},{"time":64002.563,"bpm":126},{"time":73567.214,"bpm":126},{"time":76055.971,"bpm":125},{"time":90548.33899999999,"bpm":125},{"time":106876.81,"bpm":126},{"time":121144.186,"bpm":125},{"time":137523.64800000002,"bpm":124},{"time":153065.334,"bpm":125},{"time":175680.358,"bpm":124},{"time":185803.263,"bpm":125},{"time":217396.797,"bpm":129},{"time":243478.062,"bpm":127},{"time":264173.239,"bpm":127}],"notes":[{"time":3776.5,"pads":[1],"dragTime":0},{"time":4010.875,"pads":[0],"dragTime":0},{"time":4245.25,"pads":[1],"dragTime":0},{"time":4479.625,"pads":[0],"dragTime":0},{"time":4714,"pads":[1],"dragTime":468.75},{"time":5651.5,"pads":[3],"dragTime":0},{"time":5885.875,"pads":[4],"dragTime":0},{"time":6120.25,"pads":[3],"dragTime":0},{"time":6354.625,"pads":[4],"dragTime":0},{"time":6589,"pads":[3],"dragTime":468.75},{"time":7526.5,"pads":[3],"dragTime":0},{"time":7760.875,"pads":[2],"dragTime":0},{"time":8464,"pads":[0],"dragTime":468.75},{"time":7995.249,"pads":[1],"dragTime":0},{"time":8229.624,"pads":[2],"dragTime":0},{"time":9401.5,"pads":[2],"dragTime":0},{"time":9635.875,"pads":[1],"dragTime":0},{"time":9870.25,"pads":[2],"dragTime":0},{"time":10104.625,"pads":[3],"dragTime":0},{"time":10339,"pads":[4],"dragTime":468.75},{"time":11276.5,"pads":[0],"dragTime":0},{"time":11510.875,"pads":[1],"dragTime":0},{"time":11745.25,"pads":[2],"dragTime":0},{"time":11979.625,"pads":[3],"dragTime":0},{"time":12214,"pads":[4],"dragTime":0},{"time":12448.375,"pads":[3],"dragTime":0},{"time":12682.75,"pads":[4],"dragTime":0},{"time":13151.5,"pads":[2],"dragTime":0},{"time":13620.25,"pads":[2],"dragTime":0},{"time":14089,"pads":[2],"dragTime":0},{"time":14557.75,"pads":[2],"dragTime":0},{"time":15113.602,"pads":[1,3],"dragTime":1681.8720000000012},{"time":17029.849000000002,"pads":[2],"dragTime":1640.625},{"time":18904.849000000002,"pads":[0,3],"dragTime":1640.625},{"time":20779.849000000002,"pads":[1],"dragTime":1640.625},{"time":22654.849000000002,"pads":[0,3],"dragTime":1640.625},{"time":24529.849000000002,"pads":[2],"dragTime":1640.625},{"time":26404.849000000002,"pads":[1,3],"dragTime":3750},{"time":31704.260000000002,"pads":[1],"dragTime":0},{"time":32180.45,"pads":[0],"dragTime":0},{"time":32656.641,"pads":[1],"dragTime":0},{"time":33132.831000000006,"pads":[2],"dragTime":0},{"time":33609.022000000004,"pads":[2],"dragTime":0},{"time":33847.117,"pads":[3],"dragTime":0},{"time":34323.308,"pads":[3],"dragTime":0},{"time":34561.403,"pads":[2],"dragTime":0},{"time":34799.498,"pads":[2],"dragTime":0},{"time":35037.593,"pads":[3],"dragTime":0},{"time":36228.068999999996,"pads":[1],"dragTime":0},{"time":36466.16499999999,"pads":[3],"dragTime":0},{"time":37418.546,"pads":[1],"dragTime":0},{"time":36704.259999999995,"pads":[1],"dragTime":476.1900000000023},{"time":37656.641,"pads":[0],"dragTime":714.2860000000001},{"time":38609.022000000004,"pads":[2],"dragTime":0},{"time":30302.989,"pads":[2],"dragTime":1163.1759999999995},{"time":38847.117,"pads":[3],"dragTime":0},{"time":39323.308,"pads":[3],"dragTime":0},{"time":39799.498,"pads":[4],"dragTime":0},{"time":40275.689,"pads":[4],"dragTime":0},{"time":40751.879,"pads":[3],"dragTime":238.0949999999939},{"time":41228.068999999996,"pads":[3],"dragTime":0},{"time":41704.259999999995,"pads":[2],"dragTime":952.3810000000085},{"time":43132.831000000006,"pads":[1],"dragTime":0},{"time":43609.022000000004,"pads":[3],"dragTime":0},{"time":44085.212,"pads":[4],"dragTime":1199.7059999999983},{"time":45521.138,"pads":[3],"dragTime":0},{"time":45757.359000000004,"pads":[2],"dragTime":0},{"time":45993.579,"pads":[3],"dragTime":0},{"time":46466.02,"pads":[3],"dragTime":0},{"time":46938.460999999996,"pads":[2],"dragTime":0},{"time":47174.682,"pads":[3],"dragTime":0},{"time":47410.902,"pads":[4],"dragTime":0},{"time":47883.343,"pads":[4],"dragTime":0},{"time":48355.784,"pads":[2,4],"dragTime":0},{"time":35513.784,"pads":[1,3],"dragTime":0},{"time":48828.225000000006,"pads":[3],"dragTime":0},{"time":49300.666,"pads":[2],"dragTime":0},{"time":49773.107,"pads":[2],"dragTime":0},{"time":50245.548,"pads":[1],"dragTime":0},{"time":50717.989,"pads":[0],"dragTime":0},{"time":49536.886000000006,"pads":[1],"dragTime":0},{"time":51662.871,"pads":[2],"dragTime":0},{"time":52135.312,"pads":[2],"dragTime":0},{"time":51190.43,"pads":[2],"dragTime":0},{"time":51426.65,"pads":[2],"dragTime":0},{"time":52607.753000000004,"pads":[3],"dragTime":0},{"time":52843.973,"pads":[3],"dragTime":0},{"time":53080.193999999996,"pads":[2,3],"dragTime":0},{"time":53552.634,"pads":[2],"dragTime":0},{"time":54025.075000000004,"pads":[1],"dragTime":708.6619999999966},{"time":54969.957,"pads":[1],"dragTime":0},{"time":55206.178,"pads":[1],"dragTime":0},{"time":55442.397999999994,"pads":[1],"dragTime":0},{"time":55914.839,"pads":[0],"dragTime":0},{"time":56859.721,"pads":[0,2],"dragTime":1417.3229999999967},{"time":56387.28,"pads":[1],"dragTime":0},{"time":58749.485,"pads":[0],"dragTime":0},{"time":59221.92600000001,"pads":[4],"dragTime":0},{"time":59694.367,"pads":[0],"dragTime":0},{"time":60166.808000000005,"pads":[4],"dragTime":0},{"time":60659.261,"pads":[1,3],"dragTime":1171.875},{"time":62065.511,"pads":[1,3],"dragTime":0},{"time":62534.261,"pads":[0,2],"dragTime":0},{"time":63003.011,"pads":[2,4],"dragTime":0},{"time":63471.761,"pads":[1,3],"dragTime":0},{"time":63940.511,"pads":[2],"dragTime":0},{"time":64490.036,"pads":[2],"dragTime":3322.0499999999956},{"time":68288.27699999999,"pads":[2,3],"dragTime":238.09500000000116},{"time":68764.46699999999,"pads":[2],"dragTime":0},{"time":69240.658,"pads":[2],"dragTime":0},{"time":69716.848,"pads":[2],"dragTime":476.19100000000617},{"time":70669.229,"pads":[1],"dragTime":0},{"time":71145.42,"pads":[0],"dragTime":476.1900000000023},{"time":71859.705,"pads":[0],"dragTime":0},{"time":72097.801,"pads":[1],"dragTime":3374.173999999999},{"time":75774.019,"pads":[1],"dragTime":0},{"time":76055.971,"pads":[1],"dragTime":480},{"time":76695.971,"pads":[2],"dragTime":0},{"time":76855.97099999999,"pads":[2],"dragTime":800},{"time":77815.971,"pads":[3],"dragTime":0},{"time":77975.971,"pads":[3],"dragTime":640},{"time":78775.971,"pads":[1],"dragTime":0},{"time":78935.97099999999,"pads":[1],"dragTime":640},{"time":79735.971,"pads":[4],"dragTime":0},{"time":79895.971,"pads":[4],"dragTime":0},{"time":80695.971,"pads":[0],"dragTime":0},{"time":80855.97099999999,"pads":[0],"dragTime":640},{"time":81655.97099999999,"pads":[1],"dragTime":0},{"time":81815.971,"pads":[1],"dragTime":640},{"time":82615.971,"pads":[3],"dragTime":0},{"time":82775.971,"pads":[3],"dragTime":640},{"time":83575.97099999999,"pads":[2],"dragTime":0},{"time":83735.971,"pads":[2],"dragTime":1119.9999999999854},{"time":85015.97099999999,"pads":[2],"dragTime":0},{"time":85255.59199999999,"pads":[0],"dragTime":0},{"time":85495.97099999999,"pads":[2],"dragTime":0},{"time":85759.618,"pads":[3],"dragTime":0},{"time":86455.971,"pads":[2],"dragTime":800},{"time":91508.33799999999,"pads":[1],"dragTime":0},{"time":91748.338,"pads":[2],"dragTime":0},{"time":91988.33899999999,"pads":[1],"dragTime":0},{"time":87408.204,"pads":[1],"dragTime":3860.1349999999948},{"time":92948.338,"pads":[2],"dragTime":0},{"time":92468.338,"pads":[1],"dragTime":0},{"time":93428.33899999999,"pads":[2],"dragTime":0},{"time":93668.338,"pads":[2],"dragTime":0},{"time":93908.33899999999,"pads":[3],"dragTime":0},{"time":94388.338,"pads":[3],"dragTime":0},{"time":94868.33799999999,"pads":[2],"dragTime":240.00000000001455},{"time":95348.33899999999,"pads":[1],"dragTime":0},{"time":95828.33899999999,"pads":[0],"dragTime":0},{"time":96548.33899999999,"pads":[1],"dragTime":0},{"time":98948.338,"pads":[3],"dragTime":0},{"time":99188.33899999999,"pads":[4],"dragTime":0},{"time":97028.338,"pads":[2],"dragTime":1199.9999999999854},{"time":96788.33899999999,"pads":[2],"dragTime":0},{"time":99668.338,"pads":[4],"dragTime":0},{"time":99428.33899999999,"pads":[4],"dragTime":0},{"time":100148.339,"pads":[1,3],"dragTime":0},{"time":100388.338,"pads":[2],"dragTime":0},{"time":101108.338,"pads":[2],"dragTime":0},{"time":101348.33899999999,"pads":[2],"dragTime":0},{"time":101828.33899999999,"pads":[1],"dragTime":0},{"time":102548.33899999999,"pads":[0],"dragTime":0},{"time":102788.33899999999,"pads":[0],"dragTime":0},{"time":103748.338,"pads":[2],"dragTime":0},{"time":103028.338,"pads":[1],"dragTime":479.99999999998545},{"time":104468.338,"pads":[2],"dragTime":0},{"time":104708.33899999999,"pads":[1,3],"dragTime":1679.9990000000107},{"time":106628.33899999999,"pads":[2],"dragTime":0},{"time":106876.809,"pads":[1,2],"dragTime":476.19100000000617},{"time":107591.095,"pads":[3],"dragTime":238.09500000000116},{"time":108067.286,"pads":[3],"dragTime":0},{"time":108305.381,"pads":[3],"dragTime":0},{"time":108543.476,"pads":[4],"dragTime":0},{"time":108781.571,"pads":[3],"dragTime":0},{"time":109257.762,"pads":[2],"dragTime":0},{"time":109733.952,"pads":[2],"dragTime":0},{"time":110210.143,"pads":[1],"dragTime":0},{"time":110686.333,"pads":[2],"dragTime":0}]},
    {
        name: "Foghat - Slow Ride",
        sound: "sound7",
        offset: 0,
        bpms: [
            {time: 0, bpm: 100},
            {time: 2264.2459999999996, bpm: 59},
            {time: 20496.82, bpm: 117},
            {time: 37025.486, bpm: 117},
            {time: 42741.315, bpm: 117},
            {time: 46916.36, bpm: 117},
            {time: 50586.802, bpm: 117},
        ],
        notes: [
            {time: 2264.6600000000003, pads: [2], dragTime: 0},
        ]
    },
    {
        name: "[Test] Guns N' Roses - Sweet Child O' Mine",
        sound: "sound6",
        offset: 0,
        bpms: [
            {time: 0, bpm: 400},
            {time: 760, bpm: 77},
            {time: 6900, bpm: 144},
            {time: 11300, bpm: 77}
        ],
        notes: [
            {time: 1875, pads: [0,4], dragTime: 468.75},
            {time: 2500, pads: [3], dragTime: 3000}
        ]
    }
];