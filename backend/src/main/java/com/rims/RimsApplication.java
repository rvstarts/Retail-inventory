package com.rims;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.net.URI;

@SpringBootApplication
@EnableAsync
@EnableScheduling
public class RimsApplication {

    public static void main(String[] args) {
        normalizeCloudDatabaseEnvironment();
        SpringApplication.run(RimsApplication.class, args);
    }

    private static void normalizeCloudDatabaseEnvironment() {
        String dbUrl = System.getenv("SPRING_DATASOURCE_URL");
        if (dbUrl == null || dbUrl.isBlank()) {
            dbUrl = System.getenv("DATABASE_URL");
        }

        if (dbUrl != null && !dbUrl.isBlank() && !dbUrl.startsWith("jdbc:")) {
            try {
                // Normalize postgres:// or postgresql:// formats from Render/Railway/Neon
                String normalized = dbUrl.replace("postgres://", "postgresql://");
                URI uri = new URI(normalized);
                String host = uri.getHost();
                int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                String path = uri.getPath();
                String query = uri.getQuery();

                String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path + (query != null ? "?" + query : "");
                System.setProperty("spring.datasource.url", jdbcUrl);

                if (uri.getUserInfo() != null) {
                    String[] userInfo = uri.getUserInfo().split(":", 2);
                    if (userInfo.length > 0 && !userInfo[0].isBlank()) {
                        System.setProperty("spring.datasource.username", userInfo[0]);
                    }
                    if (userInfo.length > 1) {
                        System.setProperty("spring.datasource.password", userInfo[1]);
                    }
                }
            } catch (Exception e) {
                System.setProperty("spring.datasource.url", "jdbc:" + dbUrl);
            }
        }
    }
}
