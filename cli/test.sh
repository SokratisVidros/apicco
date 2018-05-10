#!/bin/bash

trap 'exit 1' 30 SIGINT

PACKAGES=`find . -name package.json -not -path '*/node_modules/*' -mindepth 2`

for project in $PACKAGES; do
  (
    cd $(dirname $project)
    echo -e "\n==== $(pwd) ====\n"
    npm test

    if [ $? -ne 0 ]
    then
      kill -30 $$
    fi
  )
done
