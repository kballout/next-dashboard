// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
let DbConnection = require("../../../utils/mongo");

export default async function handler(req, res) {
  const { storeName, icon } = req.body;
  if (storeName) {
    if (
      storeName === "Store 1" ||
      storeName === "Store 2" ||
      storeName === "Store 3" ||
      storeName === "Team Store"
    ) {
      let client = await DbConnection.Get();
      let database = client.db(req.body.id);
      await database.collection("Stores").updateOne(
        {
          Name: storeName,
        },
        {
          $set: {
            Icon: icon,
          },
        }
      );
      res.status(200).json({ status: "success" });
    } else {
      const { levelRequired } = req.body;
      let client = await DbConnection.Get();
      let database = client.db(req.body.id);
      let storeData = await database.collection("Stores").findOne({
        Name: storeName,
      });
      let oldOptions = storeData.Options;
      let newOptions = new Map();
      for (const option of req.body.options) {
        newOptions.set(option, 1);
      }

      for (const option of oldOptions) {
        if (!newOptions.get(option)) {
          //remove
          await database.collection("Stores").updateOne(
            {
              Name: option,
            },
            {
              $pull: {
                Options:storeName ,
              },
            }
          );
        } else {
            newOptions.delete(option)
        }
      }

      if (newOptions.size !== 0) {
        //add new options
        for (const next of newOptions) {
          await database.collection("Stores").updateOne(
            {
              Name: next[0],
            },
            {
              $push: {
                Options: storeName,
              },
            }
          );
        }
      }

      //make the main store update
      await database.collection("Stores").updateOne(
        {
          Name: storeName,
        },
        {
          $set: {
            Icon: icon,
            "Level Required": levelRequired,
            Options: req.body.options,
          },
        }
      );
      res.status(200).json({ status: "success" });
    }
  } else {
    res.status(200).json({ status: "failed" });
  }
}
