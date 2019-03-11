package cn.edu.tju.gisbim.configserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.config.server.EnableConfigServer;

@SpringBootApplication
@EnableDiscoveryClient
@EnableConfigServer

public class GisBimConfigServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(GisBimConfigServerApplication.class, args);
    }

}
