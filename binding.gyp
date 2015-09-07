{
  # NOTE: 'module_name' and 'module_path' come from the 'binary' property in package.json
  # node-pre-gyp handles passing them down to node-gyp when you build from source
  "targets": [
		{
		"target_name": "libdds",
		"product_name": "dds",
		"type": "static_library",
		"sources": [
			"node_modules/dds/src/dds.cpp",
			"node_modules/dds/src/ABsearch.cpp",
			"node_modules/dds/src/ABstats.cpp",
			"node_modules/dds/src/CalcTables.cpp",
			"node_modules/dds/src/DealerPar.cpp",
			"node_modules/dds/src/Init.cpp",
			"node_modules/dds/src/LaterTricks.cpp",
			"node_modules/dds/src/Moves.cpp",
			"node_modules/dds/src/Par.cpp",
			"node_modules/dds/src/PlayAnalyser.cpp",
			"node_modules/dds/src/PBN.cpp",
			"node_modules/dds/src/QuickTricks.cpp",
			"node_modules/dds/src/Scheduler.cpp",
			"node_modules/dds/src/SolveBoard.cpp",
			"node_modules/dds/src/SolverIF.cpp",
			"node_modules/dds/src/Stats.cpp",
			"node_modules/dds/src/Timer.cpp",
			"node_modules/dds/src/TransTable.cpp"
		],
		"include_dirs": [
			 
		],
		'direct_dependent_settings': {
		  'include_dirs': [ 'node_modules/dds/include/' ],
		},
		"cflags": [ '-Wno-unused' ],
		"cflags_cc": [ '-Wno-unused' ],
		"cflags!": [ '-fno-exceptions' ],
		"cflags_cc!": [ '-fno-exceptions' ],
		"conditions": [
			['OS=="mac"', {
				'xcode_settings': {
					'GCC_ENABLE_CPP_EXCEPTIONS': 'YES'
				}
			}]
		]
	 },
	 {
		"target_name": "<(module_name)",
		"sources": [ 
			"binding.cpp",
			"src/solve-board.cpp",
			"src/calc-dd-table.cpp",
			"src/par.cpp"
		],
		"dependencies": [
		  "libdds"
		]
	 },
	 {
		"target_name": "action_after_build",
		"type": "none",
		"dependencies": [ "<(module_name)" ],
		"copies": [
		  {
			 "files": [ "<(PRODUCT_DIR)/<(module_name).node" ],
			 "destination": "<(module_path)"
		  }
		]
	 }
  ]
}
