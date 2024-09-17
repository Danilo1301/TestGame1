import express from "express";
import http from "http";
import socketio from "socket.io";
import path from "path";
import { resolve } from "path";
import { config } from "dotenv";
import {
  IPacket,
  IPacketData,
  IPacketData_DataToStartGame,
  IPacketData_MatchStatusChange,
  IPacketData_PadDownOrUp,
  PACKET_TYPE,
} from "../game/network/packet";
import { eMatchStatus, MatchData } from "../game/gameface/matchData";
import axios from "axios";
import { API_KEY } from "./keys";
import { GameLogic } from "../game/gameface/gameLogic";
import { SongManager } from "../game/songManager";
import { Debug } from "../utils/debug/debug";

config({ path: resolve(__dirname, "../../.env") });

Debug.useColor = false;

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const io: socketio.Server = new socketio.Server();
const port = 3000;

interface PlayerData {
  gameLogic: GameLogic;
}

const songManager = new SongManager();
const players = new Map<string, PlayerData>();

const main = async () => {
  setupExpressServer();
  setupSocketServer();

  server.listen(port, "0.0.0.0", () => {
    console.log(`Express web server started: http://localhost:${port}`);
  });

  await loadSongs();
};

const setupExpressServer = () => {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });

  // app.get("/", function (req, res, next) {
  //   res.redirect(
  //     "/play/bed9a8b55460f864acf684d8f5d83d385b2d04c2d78f7f2ef5a5839a9de3b6335d20fa39353b1ffb0f43dfff657a01aa"
  //   );
  //   next();
  // });

  app.use(express.static(path.join(__dirname, "..", "..", "public")));

  app.get("/play/:q", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "..", "public", "index.html"));
  });

  io.attach(server, {
    //path: '/socket',
    cors: { origin: "*" },
  });
};

const setupSocketServer = () => {
  io.on("connection", (socket) => {
    console.log("Socket connected", socket.id);

    const send = <T extends IPacketData>(packetType: PACKET_TYPE, data: T) => {
      const packet: IPacket = {
        type: packetType,
        data: data,
      };
      socket.emit("p", packet);
      console.log(`[server] sent packet '${packet.type}'`, packet);
    };

    const playerData: PlayerData = {
      gameLogic: new GameLogic(),
    };
    players.set(socket.id, playerData);

    console.log(`There are ${players.size} players playing`);

    socket.on("p", async (packet: IPacket) => {
      console.log("Received packet type " + packet.type);

      if (packet.type == PACKET_TYPE.PACKET_MATCH_DATA_TO_START_GAME) {
        const data = packet.data as IPacketData_DataToStartGame;

        playerData.gameLogic.matchData = data.matchData;
        playerData.gameLogic.money = data.matchData.betValue;

        //const songId = data.matchData.songId;
        const songId = "song1";

        await songManager.loadSong(songId);
        playerData.gameLogic.song = songManager.getSong(songId);
        playerData.gameLogic.createAll();

        send(PACKET_TYPE.PACKET_MATCH_CONFIRM_START_GAME, {});
      }

      if (packet.type == PACKET_TYPE.PACKET_MATCH_STATUS_CHANGE) {
        const data = packet.data as IPacketData_MatchStatusChange;

        console.log(data);

        playerData.gameLogic.matchData.status = data.newStatus;

        if (data.newStatus != eMatchStatus.NONE) {
          updateMatchStatus(playerData, data.message);
        }
      }

      if (packet.type == PACKET_TYPE.PACKET_PAD_DOWN_OR_UP) {
        const data = packet.data as IPacketData_PadDownOrUp;
        const padIndex = data.index;

        playerData.gameLogic.songTime = data.time;
        if (data.down) {
          playerData.gameLogic.processPadDown(padIndex);
        } else {
          playerData.gameLogic.processPadUp(padIndex);
        }
        playerData.gameLogic.printBalanceInfo();
      }

      if (packet.type == PACKET_TYPE.PACKET_NOTE_MISS) {
        playerData.gameLogic.breakCombo();
        playerData.gameLogic.printBalanceInfo();
      }
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected");

      playerData.gameLogic.matchData.status = eMatchStatus.DISCONNECTED;
      playerData.gameLogic.printBalanceInfo();

      updateMatchStatus(playerData, "player disconnected");

      players.delete(socket.id);

      console.log(`There are ${players.size} players playing`);
    });
  });
};

const loadSongs = async () => {
  await songManager.loadSong("song1");
};

main();

const updateMatchStatus = async (playerData: PlayerData, message: string) => {
  const gameLogic = playerData.gameLogic;
  const matchData = gameLogic.matchData;

  const status: string = matchData.status;

  const data = {
    matchId: matchData.matchId,
    status: status,
    userId: matchData.userId,
    betValue: gameLogic.money,
    message: message,
    apiKey: API_KEY,
  };

  const serverUrl = "https://abstractor.serveo.net";
  const url = serverUrl + "/match/update";

  console.log("updateMatch", url, data);

  try {
    const response = await axios.put(url, data, {
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    console.log("Response:", response.data);
  } catch (error) {
    const code = (error as any).code;
    console.error("Error code:", code);
  }
};
