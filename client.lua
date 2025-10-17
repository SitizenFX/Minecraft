-- Listen for messages coming from Minecraft
RegisterNetEvent("minecraft:message")
AddEventHandler("minecraft:message", function(sender, msg)
    TriggerEvent("chat:addMessage", {
        color = {255, 255, 0}, -- optional: yellow
        multiline = true,
        args = {sender, msg}
    })
end)

-- Optional: periodically send player data to server
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(10000) -- every 10 seconds

        local playerPed = PlayerPedId()
        local coords = GetEntityCoords(playerPed)
        local health = GetEntityHealth(playerPed)

        local data = {
            x = coords.x,
            y = coords.y,
            z = coords.z,
            health = health,
            name = GetPlayerName(PlayerId())
        }

        TriggerServerEvent("minecraft:syncData", data)
    end
end)
