const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const app = express();
app.use(express.json());

const initializeDBAndServer = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(3000, () => {
      // console.log(");
    });
  } catch (e) {
    //console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

//Get Players API

module.exports = app.get("/players/", async (request, response) => {
  const getPlayersQuery = `SELECT * FROM cricket_team ORDER BY player_id ;`;
  const playersArray = await db.all(getPlayersQuery);
  response.send(playersArray);
});

//Post Player or Create Player API

module.exports = app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { player_name, jersey_number, role } = playerDetails;
  const addPlayerQuery = `INSERT INTO cricket_team(player_name, jersey_number, role)
 VALUES ('${player_name}',${jersey_number},'${role}');`;
  const dbResponse = await db.run(addPlayerQuery);
  const player_Id = dbResponse.lastID;
  response.send("Player Added to Team");
});

//GET player API

module.exports = app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `SELECT * FROM cricket_team WHERE player_id=${playerId};`;
  const player = await db.get(getPlayerQuery);
  response.send(player);
});

// PUT player or Update Player API

module.exports = app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { player_name, jersey_number, role } = playerDetails;
  const updatePlayerQuery = `UPDATE  cricket_team SET player_name= '${player_name}', 
  jersey_number = ${jersey_number}, 
  role= '${role}'
    WHERE  player_id=${playerId};`;

  const dbResponse = await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

//Delete Player API

module.exports = app.delete(
  "/players/:playerId/",
  async (request, response) => {
    const { playerId } = request.params;
    const deletePlayerQuery = `DELETE FROM cricket_team WHERE player_id=${playerId};`;
    const dbResponse = await db.run(deletePlayerQuery);
    response.send("Player Removed");
  }
);
