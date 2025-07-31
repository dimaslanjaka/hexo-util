# syntax=docker/dockerfile:1.7-labs
# This Dockerfile builds images for testing with different Node.js versions.




FROM node:18 AS node18
WORKDIR /workspace
RUN apt-get update -y && apt-get install -y build-essential libssl-dev libcurl4-openssl-dev
COPY scripts/ ./scripts/
COPY package.json ./
RUN npm install




FROM node:20 AS node20
WORKDIR /workspace
RUN apt-get update -y && apt-get install -y build-essential libssl-dev libcurl4-openssl-dev
COPY scripts/ ./scripts/
COPY package.json ./
RUN npm install




FROM node:22 AS node22
WORKDIR /workspace
RUN apt-get update -y && apt-get install -y build-essential libssl-dev libcurl4-openssl-dev
COPY scripts/ ./scripts/
COPY package.json ./
RUN npm install



FROM node:24 AS node24
WORKDIR /workspace
RUN apt-get update -y && apt-get install -y build-essential libssl-dev libcurl4-openssl-dev
COPY scripts/ ./scripts/
COPY package.json ./
RUN npm install