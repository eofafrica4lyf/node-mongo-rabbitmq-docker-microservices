# receipt for display help information
.PHONY: help
help: Makefile
	@echo "Available commands:"
	@sed -n 's/^##//p' $<

# -----

## install:               Install dependencies
install:
	@echo "Build containers..."
	@docker compose build
	@echo "Installing agent service dependencies..."
	@docker compose run --rm agent-svc npm install
	@echo "Installing channel service dependencies..."
	@docker compose run --rm channel-svc npm install

## reset-env:             Reset env files
reset-env:
	@rm -rf .env && cp .env.example .env
	@rm -rf ./agent-svc/.env && cp ./agent-svc/.env.example ./agent-svc/.env
	@rm -rf ./channel-svc/.env && cp ./channel-svc/.env.example ./channel-svc/.env

## up:                    Run service containers
up:
	@docker compose up -d --build --force-recreate --remove-orphans

## down:                  Stop and remove service containers
down:
	@docker compose down

# Agent Service
## server-dev:            Run NPM script "dev" for server
agent-svc-dev:
	@docker compose run --rm agent-svc npm run dev

## server-start:          Run NPM script "start" for server
agent-svc-start:
	@docker compose run --rm agent-svc npm run start


# Channel Service
## server-dev:            Run NPM script "dev" for server
channel-svc-dev:
	@docker compose run --rm channel-svc npm run dev

## server-start:          Run NPM script "start" for server
channel-svc-start:
	@docker compose run --rm channel-svc npm run start