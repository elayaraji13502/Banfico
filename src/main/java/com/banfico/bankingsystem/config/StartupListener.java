package com.banfico.bankingsystem.config;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * StartupListener
 *
 * Listens for the ApplicationReadyEvent to log application startup details.
 * Dynamically resolves the port and context path from the environment to avoid hardcoding.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class StartupListener implements ApplicationListener<ApplicationReadyEvent> {

    private final Environment environment;

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        String port = environment.getProperty("local.server.port");
        if (port == null) {
            port = environment.getProperty("server.port", "8080");
        }
        String contextPath = environment.getProperty("server.servlet.context-path", "");

        log.info("=================================================");
        log.info("  Banfico Banking System started successfully!   ");
        log.info("  Health : http://localhost:{}{}/health          ", port, contextPath);
        log.info("  Info   : http://localhost:{}{}/api/info        ", port, contextPath);
        log.info("=================================================");
    }
}
