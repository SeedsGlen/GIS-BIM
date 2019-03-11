package cn.edu.tju.gisbim.eureka.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class GisBimServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(GisBimServerApplication.class, args);
    }

}
