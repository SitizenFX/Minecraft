fx_version 'cerulean'
game 'gta5'

author 'Elijah Siita / VidllQ Authority'
description 'Minecraft Bridge for FiveM'
version '1.0.0'

client_scripts {
    'client.lua'
}

server_scripts {
    '@oxmysql/lib/MySQL.lua', -- optional if using database
    'server.lua'
}

dependencies {
    'oxmysql' -- optional
}
