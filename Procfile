web: java $JAVA_OPTS -Xmx256m -jar target/*.jar --spring.profiles.active=prod,heroku,no-liquibase --server.port=$PORT
release: ./mvnw -ntp liquibase:update -Pprod,heroku
