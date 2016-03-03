.PHONY: install start build-docker start-docker

default:
	@echo "Usage:"
	@echo "  make install  -> to install nodejs local dependancies (without docker) [npm install]"
	@echo "  make start    -> to run localy the application (without docker) [npm start]"
	@echo "  make trello-harvest -> run the trello harvester localy"
	@echo "  make build-docker -> to build roadmapjs:latest docker image localy (needed before start-docker)"
	@echo "  make start-docker -> to run the app with docker-compose (it uses roadmapjs image and official mongodb image)"
	@echo "  make trello-harvest-docker -> run the trello harvester in the docker container (need make start-docker)"

install:
	npm install

start:
	npm start

trello-harvest:
	./trello-harvester.njs

build-docker:
	docker build -t roadmapjs --build-arg http_proxy --build-arg https_proxy .

start-docker:
	docker-compose up

trello-harvest-docker:
	docker exec -it webserver_roadmapjs_1 /app/trello-harvester.njs