dds-node-adapter
==================

[![build status](https://secure.travis-ci.org/frankwallis/dds-node-adapter.png)](http://travis-ci.org/frankwallis/dds-node-adapter)

A node addon for the [DDS](https://github.com/dds-bridge/dds) bridge double dummy solver. The computation methods are run asynchronously and can return results eithr in a Promise or via a callback. Uses [node-pre-gyp](https://github.com/mapbox/node-pre-gyp) to manage the build and install.

## Platform requirements

- Node.js 0.12.x or higher
- It has been tested on Linux, Max and Win32 and prebuilt binaries will normally be available for those platforms.

## Methods Implemented

```
solveBoard(boardInfo, options): Promise<SolveResults>;
solveBoard(boardInfo, options, callback<SolveResults>);

calcResultTable(deal): Promise<ResultTable>;
calcResultTable(deal, callback<ResultTable>);

par(resultTable, vulnerability): Promise<ParContracts>;
par(resultTable, vulnerability, callback<ParContracts>);
```