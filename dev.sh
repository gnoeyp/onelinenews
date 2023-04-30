#!/bin/bash

docker-compose -f ./docker-compose.dev.yml --env-file ./config/.env.dev up -d
