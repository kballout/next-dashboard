let DbConnection = require("../../../utils/mongo");

const handler = async (req, res) => {
  let client = await DbConnection.Get();
  let database = client.db(req.query.id);
  let initialize = await database.collection("Initialize").distinct("Started");
  if (initialize[0]) {
    let general = await database
      .collection("Guild Settings")
      .findOne({ Name: "General Settings" });
    let programs = await database
      .collection("Guild Settings")
      .findOne({ Name: "Program IDs" });
    let teams = await database.collection("Teams").find({}).toArray();
    let stores = await database.collection("Stores").find({}).toArray();
    let emblems = await database.collection("Emblems").find({}).toArray();
    const data = {
      initialize: true,
      general,
      programs,
      teams,
      stores,
      emblems,
    };

    res.send(data);
  } else {
    res.send({ initialize: false });
  }
};

export default handler;
