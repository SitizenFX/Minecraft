local http = require("socket.http") -- you can use any HTTP library

RegisterCommand("mcjoin", function(source, args, rawCommand)
    local playerName = GetPlayerName(source)
    local message = table.concat(args, " ")
    -- Send join request to bridge server
    PerformHttpRequest("http://localhost:3000/mcjoin", function(err, text, headers)
        if err == 200 then
            TriggerClientEvent("chat:addMessage", source, {
                args = {"Minecraft", "You have joined the Minecraft server!"}
            })
        else
            TriggerClientEvent("chat:addMessage", source, {
                args = {"Minecraft", "Failed to join Minecraft server."}
            })
        end
    end, "POST", json.encode({player = playerName}), {["Content-Type"] = "application/json"})
end, false)

RegisterCommand("mcchat", function(source, args, rawCommand)
    local playerName = GetPlayerName(source)
    local msg = table.concat(args, " ")
    PerformHttpRequest("http://localhost:3000/mcchat", function(err, text, headers) end, "POST", json.encode({player = playerName, message = msg}), {["Content-Type"] = "application/json"})
end, false)

