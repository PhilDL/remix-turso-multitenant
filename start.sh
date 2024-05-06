#!/bin/sh

set -ex

pnpm drizzle:migrate

pnpm run start