# Stage 1: Build the project using Maven
FROM maven:3.8.4-openjdk-11 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package

# Stage 2: Create a lightweight runtime image
FROM openjdk:11-jre-slim
WORKDIR /app
COPY --from=build /app/target/safeai-plugin-1.0.0.jar ./safeai-plugin.jar
CMD ["java", "-jar", "safeai-plugin.jar"]
