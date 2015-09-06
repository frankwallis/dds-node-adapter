#include <v8.h>
#include <node.h>

#include "src/calc-dd-table.h"
#include "src/solve-board.h"
#include "src/par.h"

using namespace v8;

extern "C" {
	static void start(Handle<Object> target) {
		HandleScope scope(Isolate::GetCurrent());
	   
	   NODE_SET_METHOD(target, "SetMaxThreads", NODE_SetMaxThreads);
	   NODE_SET_METHOD(target, "SolveBoard", NODE_SolveBoard);
		NODE_SET_METHOD(target, "CalcDDtable", NODE_CalcDDtable);
		NODE_SET_METHOD(target, "Par", NODE_Par);
	}
}

// what the hell is app3?!
NODE_MODULE(app3, start)