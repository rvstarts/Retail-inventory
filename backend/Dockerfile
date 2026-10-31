# Multi-Stage Dockerfile for RIMS Spring Boot 3.x Backend (Java 21)
# Stage 1: Build & Package
FROM eclipse-temurin:21-jdk-jammy AS builder
WORKDIR /workspace

# Cache Maven wrapper and dependencies
COPY pom.xml .
COPY src ./src

# Build production jar without running test suite in container build
RUN apt-get update && apt-get install -y maven \
    && mvn clean package -DskipTests -Ppostgres \
    && rm -rf /var/lib/apt/lists/*

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

# Environment variables
ENV SPRING_PROFILES_ACTIVE=postgres \
    JAVA_OPTS="-Xms512m -Xmx2048m -XX:+UseG1GC -XX:+ExitOnOutOfMemoryError"

# Container Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Execute as unprivileged user
USER rims:rims

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/rims-backend.jar"]

