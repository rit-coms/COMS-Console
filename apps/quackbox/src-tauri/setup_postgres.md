To install postgres on docker: `docker pull postgres:latest`
Then run the container: `docker run --name quackbox-db -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres`
Then run diesel migrations `diesel database setup`
You can connect to the database with `psql -h localhost -p 5432 -U postgres -d quackbox-db` and then just go to town.