#!/usr/bin/env bash

# Run tslint before running the build
npm run lint

# Run the Typescript compiler before running the build
npm run typescript

# Run the unit tests
npm test
