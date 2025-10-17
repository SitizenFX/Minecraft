fx_version 'cerulean'
game 'gta5'

author 'Elijah Siita / VidllQ Authority'
description 'Minecraft Bridge for FiveM / FiveZ'
version '1.0.0'

-- Client script: runs on player side
client_scripts {
    'client.lua'
}

-- Server scripts: runs on server
server_scripts {
    '@oxmysql/lib/MySQL.lua', -- optional if you use oxmysql database features
    'server.lua'
}

-- Optional dependency if using MySQL
dependencies {
    'oxmysql'
}
