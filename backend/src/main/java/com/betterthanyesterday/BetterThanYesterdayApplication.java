package com.betterthanyesterday;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BetterThanYesterdayApplication {

    public static void main(String[] args) {
        SpringApplication.run(BetterThanYesterdayApplication.class, args);
        System.out.println("=================================================");
        System.out.println("🚀 Better Than Yesterday Java Backend Running!");
        System.out.println("📡 Server Port: http://localhost:8080");
        System.out.println("🌟 Healthcheck: http://localhost:8080/api/health");
        System.out.println("=================================================");
    }
}

