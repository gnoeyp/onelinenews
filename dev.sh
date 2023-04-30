#!/bin/bash

if [ $# -ne 1 ]; then
    echo "Usage: $0 run or $0 stop"
    exit -1
fi

if [[ "$1" != "run" ]] && [[ "$1" != "stop" ]]; then
    echo "Usage: $0 run or $0 stop"
    exit -1
fi

if [[ "$1" == "run" ]]; then
    docker-compose -f ./docker-compose.base.yml -f ./docker-compose.dev.yml --env-file ./config/.env.local --env-file ./config/.env.dev up -d
else
    docker-compose -f ./docker-compose.base.yml -f ./docker-compose.dev.yml --env-file ./config/.env.local --env-file ./config/.env.dev down
fi

