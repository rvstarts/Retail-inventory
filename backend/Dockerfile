# Multi-Stage Dockerfile for RIMS Spring Boot 3.x Backend (Java 21)
# Stage 1: Build & Package with matched Maven 3.9 and Temurin JDK 21
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /workspace

# Copy Maven POM and source files
COPY pom.xml .
COPY src ./src

# Build production jar without running test suite in container build
RUN mvn clean package -DskipTests

# Stage 2: Minimal Production JRE Runtime
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Create unprivileged application user
RUN groupadd -r rims && useradd -r -g rims -s /bin/false rims

# Copy compiled jar from builder stage
COPY --from=builder /workspace/target/rims-backend-*.jar /app/rims-backend.jar
RUN chown -R rims:rims /app

# Expose standard Spring Boot port
EXPOSE 8080

# Environment variables (dynamic RAM scaling for cloud containers)
ENV SPRING_PROFILES_ACTIVE=postgres \
    JAVA_OPTS="-XX:MaxRAMPercentage=75.0 -XX:+UseG1GC -XX:+ExitOnOutOfMemoryError"

# Execute as unprivileged user
USER rims:rims

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/rims-backend.jar"]
