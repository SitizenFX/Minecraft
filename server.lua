-- Command to join Minecraft server
RegisterCommand("mcjoin", function(source, args, rawCommand)
    local playerName = GetPlayerName(source)
    
    PerformHttpRequest(
        "http://localhost:3000/mcjoin",
        function(statusCode, text, headers)
            if statusCode == 200 then
                TriggerClientEvent("chat:addMessage", source, {
                    args = {"Minecraft", "✅ You have joined the Minecraft server!"}
                })
            else
                TriggerClientEvent("chat:addMessage", source, {
                    args = {"Minecraft", "❌ Failed to join Minecraft server. Make sure you own the game and are using the correct username."}
                })
            end
        end,
        "POST",
        json.encode({player = playerName}),
        {["Content-Type"] = "application/json"}
    )
end, false)

-- Command to send chat message to Minecraft
RegisterCommand("mcchat", function(source, args, rawCommand)
    local playerName = GetPlayerName(source)
    local msg = table.concat(args, " ")

    if msg == "" then
        TriggerClientEvent("chat:addMessage", source, {
            args = {"Minecraft", "❌ Please provide a message to send."}
        })
        return
    end
    
    PerformHttpRequest(
        "http://localhost:3000/mcchat",
        function(statusCode, text, headers)
            if statusCode == 200 then
                TriggerClientEvent("chat:addMessage", source, {
                    args = {"Minecraft", "✅ Message sent to Minecraft!"}
                })
            else
                TriggerClientEvent("chat:addMessage", source, {
                    args = {"Minecraft", "❌ Message failed. Are you connected to the Minecraft server?"}
                })
            end
        end,
        "POST",
        json.encode({player = playerName, message = msg}),
        {["Content-Type"] = "application/json"}
    )
end, false)
