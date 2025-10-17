RegisterNetEvent("minecraft:message")
AddEventHandler("minecraft:message", function(sender, msg)
    TriggerEvent("chat:addMessage", {args = {sender, msg}})
end)
