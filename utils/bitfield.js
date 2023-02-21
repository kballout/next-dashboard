const permissionsObject = {
    CREATE_INSTANT_INVITE: 0x1,
    KICK_MEMBERS: 0x2,
    BAN_MEMBERS: 0x4,
    ADMINISTRATOR: 0x8,
    MANAGE_CHANNELS: 0x10,
    MANAGE_GUILD: 0x20,
    ADD_REACTIONS: 0x40,
    VIEW_AUDIT_LOG: 0x80,
    PRIORITY_SPEAKER: 0x100,
    STREAM: 0x200,
    VIEW_CHANNEL: 0x400,
    SEND_MESSAGES: 0x800,
    SEND_TTS_MESSAGES: 0x1000,
    MANAGE_MESSAGES: 0x2000,
    EMBED_LINKS: 0x4000,
    ATTACH_FILES: 0x8000,
    READ_MESSAGE_HISTORY: 0x10000,
    MENTION_EVERYONE: 0x20000,
    USE_EXTERNAL_EMOJIS: 0x40000,
    VIEW_GUILD_INSIGHTS: 0x80000,
    CONNECT: 0x100000,
    SPEAK: 0x200000,
    MUTE_MEMBERS: 0x400000,
    DEAFEN_MEMBERS: 0x800000,
    MOVE_MEMBERS: 0x1000000,
    USE_VAD: 0x2000000,
    CHANGE_NICKNAME: 0x4000000,
    MANAGE_NICKNAMES: 0x8000000,
    MANAGE_ROLES: 0x10000000,
    MANAGE_WEBHOOKS: 0x20000000,
    MANAGE_EMOJIS_AND_STICKERS: 0x40000000,
    USE_APPLICATION_COMMANDS: 0x800000000,
    REQUEST_TO_SPEAK: 0x100000000,
    MANAGE_THREADS: 0x400000000,
    USE_PUBLIC_THREADS: 0x800000000,
    USE_PRIVATE_THREADS: 0x1000000000,
    USE_EXTERNAL_STICKERS: 0x2000000000
  };
  
  const permissions = (permBitfield) => {
    let currentPermissions = [];
    const permissionUpper = Math.floor(permBitfield / 0x100000000);
    const permissionLower = Math.floor(permBitfield % 0x100000000);
    for (let key in permissionsObject) {
        if ((permissionsObject[key] >= 0x100000000 && (permissionUpper & Math.floor(permissionsObject[key] / 0x100000000))) || (permissionsObject[key] < 0x100000000 && (permissionLower & permissionsObject[key]))) {
            currentPermissions.push(key);
        } else {
            continue;
        };
    };
    return currentPermissions;
  }
  const bitfield = (bitfield) => {
    if (permissionsObject[bitfield]) {
        return permissionsObject[bitfield];
    } else {
        return new Error("that is not a valid bitfield");
    };
  }
  
  export default permissions