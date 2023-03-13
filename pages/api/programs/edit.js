import { Double } from "mongodb";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
let DbConnection = require("../../../utils/mongo");

export default async function handler(req, res) {
  const { name, factor, type, amount } =
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
      for (let i = 0; i < list.length; i++) {
        nextPath = `Program ${(i+1)}`
        if(list[i].Name === name){
            programList[nextPath] = {
                Name: name,
                Factor: new Double(factor),
                "Bonus Type": type,
                "Bonus Amount": new Double(amount)
            }
        } else {
            programList[nextPath] = {
                Name: list[i].Name,
                Factor: new Double(list[i].Factor),
                "Bonus Type": list[i]['Bonus Type'],
                "Bonus Amount": new Double(list[i]['Bonus Amount'])
            }
        }
        
      }
      //edit program
      await database.collection("Guild Settings").updateOne({
        Name: "Program IDs"
      }, {
        $set: {
            "Programs": programList
        }
      })
      res.status(200).json({ status: "success" });
    }
  } else {
    res.status(200).json({ status: "failed" });
  }
}
