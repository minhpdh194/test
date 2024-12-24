# 1xMM App

## Getting started

We need to complete Readme

## Server side
When a PR to main is executed, the code is automatically pushed to the server, Dockerfile creates the docker containers.<br/>
**Before executing a PR**, if the any table has been changed, drop all the tables in the database so that migration / seed can occur.<br/>
The CRON job is running on the api container. To stop CRON job:<br/>
```
docker ps -a // to list all docker containers
docker exec -it [CONTAINER_ID] bash // to access bash on the targeted container
service cron status // to check cron status
service cron stop // to stop cron job
service cron start // to start cron job
```
