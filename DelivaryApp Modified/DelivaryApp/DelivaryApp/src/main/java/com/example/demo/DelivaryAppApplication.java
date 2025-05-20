package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.example.demo", "com.example.security"})

public class DelivaryAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(DelivaryAppApplication.class, args);
	}

}
