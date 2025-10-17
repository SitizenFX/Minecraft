package com.example.minecraftsync;

import org.bukkit.entity.Player;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.scheduler.BukkitRunnable;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import com.google.gson.Gson;
import java.util.HashMap;

public class MCJavaSync extends JavaPlugin {

    private final Gson gson = new Gson();

    @Override
    public void onEnable() {
        new BukkitRunnable() {
            @Override
            public void run() {
                for (Player player : getServer().getOnlinePlayers()) {
                    syncPlayer(player);
                }
            }
        }.runTaskTimer(this, 0L, 200L); // every 10 seconds
    }

    private void syncPlayer(Player player) {
        try {
            HashMap<String, Object> data = new HashMap<>();
            data.put("x", player.getLocation().getX());
            data.put("y", player.getLocation().getY());
            data.put("z", player.getLocation().getZ());
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

            conn.getResponseCode(); // trigger request
            conn.disconnect();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
