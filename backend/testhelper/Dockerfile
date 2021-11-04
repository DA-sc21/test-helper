FROM adoptopenjdk/openjdk11:ubi
MAINTAINER da.ajou.ac.kr
ARG JAR_FILE=build/libs/testhelper-0.0.1-SNAPSHOT-plain.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]