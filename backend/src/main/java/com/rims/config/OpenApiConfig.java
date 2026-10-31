package com.rims.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "BearerAuth";
        return new OpenAPI()
                .info(new Info()
                        .title("Retail Inventory Management System (RIMS) API")
                        .version("1.0.0")
                        .description("Enterprise REST APIs for XYZ Retail Corporation - PRG_RIMS_001. " +
                                "Covers 8 Epics: Catalog, Multi-Location Inventory, Order Fulfillment, " +
                                "Suppliers & POs, Barcode/RFID, Analytics & Reporting, RBAC Security, and Integrations.")
                        .contact(new Contact()
                                .name("RIMS Engineering Core Architecture Team")
                                .email("architecture@xyzretail.com"))
                        .license(new License().name("Apache 2.0").url("https://springdoc.org")))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Provide JWT bearer token generated from /api/v1/auth/login")));
    }
}

