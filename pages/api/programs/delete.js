import { Double } from "mongodb";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
let DbConnection = require("../../../utils/mongo");

export default async function handler(req, res) {
  const { name } =
    req.body;

  if (name) {
    let client = await DbConnection.Get();
    let database = client.db(req.body.id);
    if (database) {
      let progs = await database.collection("Guild Settings").findOne({
        Name: "Program IDs"
      })
      let list = Object.values(progs.Programs)
      let programList = {}
      let nextPath
      let count = 1
      for (let i = 0; i < list.length; i++) {
          if(list[i].Name !== name){
              nextPath = `Program ${count}`
              programList[nextPath] = {
                  Name: list[i].Name,
                  Factor: new Double(list[i].Factor),
                  "Bonus Type": list[i]['Bonus Type'],
                  "Bonus Amount": new Double(list[i]['Bonus Amount'])
              }
              count++
        }
      }
      await database.collection("Guild Settings").updateOne({
        Name: "Program IDs"
      }, {
        $set: {
            "Programs": programList
        }
      })

      await database.collection("Guild Settings").updateOne({
        Name: "Program IDs"
      }, {
        $set: {
            "Total Programs": progs['Total Programs'] - 1
        }
      })

      //delete program for all players
      let totalPath = `Participation.Total Attendance Per Program.${name}` 
      let highestPath = `Participation.Highest Streaks Per Program.${name}` 
      let currPath = `Participation.Current Streaks.${name}` 
      let monthlyPath = `Participation.Monthly Attendance Per Program.${name}` 
      await database.collection("Player Profile").updateMany({},{
        $unset: {
          [totalPath]: "",
          [highestPath]: "",
          [currPath]: "",
          [monthlyPath]: "",
        }
      })
      res.status(200).json({ status: "success" });
    }
  } else {
    res.status(200).json({ status: "failed" });
  }
}
