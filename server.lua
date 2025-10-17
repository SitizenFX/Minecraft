local json = require "json"

-- Player data sync
RegisterNetEvent("minecraft:syncData")
AddEventHandler("minecraft:syncData", function(data)
    local src = source
    print(("Received sync from player %d: %s"):format(src, json.encode(data)))

    -- Forward to Node.js bridge
    PerformHttpRequest(
        "http://localhost:3000/fivem-sync",
        function(err, text, headers)
            print("Sent data to bridge, response:", text)
        end,
        "POST",
        json.encode({playerId = src, data = data}),
        {["Content-Type"] = "application/json"}
    )
end)

-- Minecraft commands
RegisterCommand("mcjoin", function(source, args, rawCommand)
    local playerName = GetPlayerName(source)
    PerformHttpRequest(
        "http://localhost:3000/mcjoin",
        function(statusCode, text, headers)
            if statusCode == 200 then
                TriggerClientEvent("chat:addMessage", source, {args = {"Minecraft", "✅ You have joined the Minecraft server!"}})
            else
                TriggerClientEvent("chat:addMessage", source, {args = {"Minecraft", "❌ Failed to join Minecraft server. Check your account."}})
            end
        end,
        "POST",
        json.encode({player = playerName}),
        {["Content-Type"] = "application/json"}
    )
end, false)

RegisterCommand("mcchat", function(source, args, rawCommand)
    local playerName = GetPlayerName(source)
    local msg = table.concat(args, " ")
    if msg == "" then return end
    PerformHttpRequest(
        "http://localhost:3000/mcchat",
        function(statusCode, text, headers)
            if statusCode ~= 200 then
                TriggerClientEvent("chat:addMessage", source, {args = {"Minecraft", "❌ Message failed. Are you connected?"}})
            end
        end,
        "POST",
        json.encode({player = playerName, message = msg}),
        {["Content-Type"] = "application/json"}
    )
end, false)
