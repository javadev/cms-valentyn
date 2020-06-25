web: java $JAVA_OPTS -Xmx256m -jar target/*.jar --spring.profiles.active=prod,heroku,no-liquibase --server.port=$PORT
release: cp -R BOOT-INF/classes/config config && ./mvnw -ntp liquibase:update -Pprod,heroku
