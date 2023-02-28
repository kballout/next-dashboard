let perms = require('../../../utils/bitfield')

const handler = async (req, res) => {
  const fetchGuilds = await fetch(
    `https://discord.com/api/v10/users/@me/guilds`,
    {
      headers: {
        Authorization: `Bearer ${req.body}`,
      },
    }
  );
  const userGuilds = await fetchGuilds.json();
  const botGuildsFetch = await fetch(
    `https://discord.com/api/v10/users/@me/guilds`,
    {
      headers: {
        Authorization: `Bot ${process.env.TOKEN}`,
      },
    }
  )
  const result = await botGuildsFetch.json();
  const botGuilds = new Map(result.map((obj) => [obj.id, obj]));

  const guilds = [];
  let isManager, guild, permissions;
  for (const next of userGuilds) {
    guild = botGuilds.get(next.id);
    if (guild) {
      permissions = perms.default(next.permissions);
      isManager = permissions.includes("MANAGE_GUILD");
      if (isManager) {
        guilds.push(guild);
      }
    }
  }
  res.send(guilds)
};

export default handler;
