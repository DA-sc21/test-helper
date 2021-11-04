FROM adoptopenjdk/openjdk11:ubi
MAINTAINER da.ajou.ac.kr
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src
RUN chmod +x ./gradlew

ENTRYPOINT ["./gradlew","bootRun"]