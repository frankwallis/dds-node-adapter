dds-node-adapter
==================

A node addon for the DDS bridge double dummy solver.

## Depends

- Node.js 0.11.x or higher

## Install

Install from binary:

    npm install

Install from source:

    npm install --build-from-source

## Developing

The [node-pre-gyp](https://github.com/mapbox/node-pre-gyp#usage) tool is used to handle building from source and packaging.

To recompile only the C++ files that have changed, first put `node-gyp` and `node-pre-gyp` on your PATH:

    export PATH=`npm explore npm -g -- pwd`/bin/node-gyp-bin:./node_modules/.bin:${PATH}

Then simply run:

    node-pre-gyp build

### Packaging

    node-pre-gyp build package

### Publishing

    npm install aws-sdk
    node-pre-gyp publish
