import { Double } from "mongodb";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
let DbConnection = require("../../../utils/mongo");

export default async function handler(req, res) {
  const { storeName, itemNumber, itemName, itemQty, itemCost, itemAvailable } =
    req.body;

  if (storeName) {
    let client = await DbConnection.Get();
    let database = client.db(req.body.id);
    if (database) {
      let pathName = "Items." + itemNumber + ".Name";
      let pathQty = "Items." + itemNumber + ".Qty";
      let pathCost = "Items." + itemNumber + ".Cost";
      let pathAva = "Items." + itemNumber + ".Available";
      await database.collection("Stores").updateOne(
        {
          Name: storeName,
        },
        {
          $set: {
            [pathName]: itemName,
            [pathQty]: itemQty,
            [pathCost]: itemCost,
            [pathAva]: itemAvailable,
          },
        }
      );
      res.status(200).json({ status: "success" });
    }
  } else {
    res.status(200).json({ status: "failed" });
  }
}
