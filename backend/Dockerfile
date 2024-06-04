FROM amazoncorretto:22-alpine-jdk

COPY target/backend-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT ["sh", "-c", "java -Djwt.secret=$JWT_SECRET -Dtime=$TIME -jar /app.jar"]