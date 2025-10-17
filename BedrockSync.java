package com.example.bedrocksync;

import cn.nukkit.Player;
import cn.nukkit.plugin.PluginBase;
import cn.nukkit.scheduler.Task;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import com.google.gson.Gson;

public class BedrockSync extends PluginBase {
    private final Gson gson = new Gson();

    @Override
    public void onEnable() {
        this.getServer().getScheduler().scheduleRepeatingTask(this, new Task() {
            @Override
            public void onRun(int currentTick) {
                for (Player player : getServer().getOnlinePlayers().values()) {
                    syncPlayer(player);
                }
            }
        }, 20*10); // every 10s
    }

    private void syncPlayer(Player player) {
        try {
            HashMap<String, Object> data = new HashMap<>();
            data.put("x", player.getX());
            data.put("y", player.getY());
            data.put("z", player.getZ());
            data.put("health", player.getHealth());
            data.put("name", player.getName());

            String json = gson.toJson(new HashMap<String, Object>() {{
                put("playerId", player.getUniqueId().toString());
                put("data", data);
            }});

            URL url = new URL("http://localhost:3000/minecraft-sync");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);
            OutputStream os = conn.getOutputStream();
            os.write(json.getBytes());
            os.flush();
            os.close();
            conn.getResponseCode();
            conn.disconnect();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
