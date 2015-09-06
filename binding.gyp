{
  # NOTE: 'module_name' and 'module_path' come from the 'binary' property in package.json
  # node-pre-gyp handles passing them down to node-gyp when you build from source
  "targets": [
		{
		"target_name": "lib-dds",
      "product_name": "dds",
      "type": "static_library",
      "sources": [
      	"dds/src/dds.cpp",
			"dds/src/ABsearch.cpp",
			"dds/src/ABstats.cpp",
			"dds/src/CalcTables.cpp",
			"dds/src/DealerPar.cpp",
			"dds/src/Init.cpp",
			"dds/src/LaterTricks.cpp",
			"dds/src/Moves.cpp",
			"dds/src/Par.cpp",
			"dds/src/PlayAnalyser.cpp",
			"dds/src/PBN.cpp",
			"dds/src/QuickTricks.cpp",
			"dds/src/Scheduler.cpp",
			"dds/src/SolveBoard.cpp",
			"dds/src/SolverIF.cpp",
			"dds/src/Stats.cpp",
			"dds/src/Timer.cpp",
			"dds/src/TransTable.cpp"
      ],
      "include_dirs": [
          
      ],
      'direct_dependent_settings': {
        'include_dirs': [ 'dds/include/' ],
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
      	"src/calc-dd-table.cpp" 
      ],
      "dependencies": [
        "lib-dds"
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
