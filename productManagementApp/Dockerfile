# Stage 1: Build the application using Maven
FROM maven:3.9.4-eclipse-temurin-21 AS build
WORKDIR /app

# Copy only the pom.xml to leverage Docker layer caching
COPY pom.xml .

# Download dependencies in advance (caching optimization)
RUN mvn dependency:go-offline

# Copy source files
COPY src ./src

# Build the application, skipping tests for faster builds
RUN mvn clean package -DskipTests

# Stage 2: Create a minimal runtime image
FROM eclipse-temurin:21-jdk
WORKDIR /app

# Copy the built JAR from the builder stage
COPY --from=build /app/target/*.jar app.jar

# Expose the application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
