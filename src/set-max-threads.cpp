#include <v8.h>
#include <dll.h>
#include "set-max-threads.h"

using namespace v8;

void NODE_SetMaxThreads(const FunctionCallbackInfo<Value>& args) {
	int arg0 = args[0] ->IntegerValue();
	SetMaxThreads(arg0);
}
