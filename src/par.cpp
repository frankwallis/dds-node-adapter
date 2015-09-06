#include <v8.h>
#include <string>
#include <dll.h>
#include "par.h"

using namespace v8;

void NODE_Par(const FunctionCallbackInfo<Value>& args) {
	Isolate* isolate = Isolate::GetCurrent();
	HandleScope scope(isolate);

	/* get the arguments */
	ddTableResults tableResults;
 	Local<Array> tableResultsJS = Local<Array>::Cast(args[0]);

 	for (int i = 0; i < DDS_STRAINS; ++i) {
 		Local<Array> resRow = Local<Array>::Cast(tableResultsJS ->Get(i));

 		for (int j = 0; j < DDS_HANDS; ++j) {
 			tableResults.resTable[i][j] = resRow ->Get(j) ->IntegerValue();
 		}
 	}

	int vulnerable = args[1] ->IntegerValue();

	/* call the function */
	parResults result;

	int ret = Par(&tableResults, &result, vulnerable);

	if (ret != RETURN_NO_FAULT) {
		char msg[80];
		ErrorMessage(ret, msg);
		printf("%s\n", msg);
	}

	/* extract the results */
	Local<Array> parScore = Array::New(isolate, 2);
	parScore ->Set(0, String::NewFromUtf8(isolate, result.parScore[0]));
	parScore ->Set(1, String::NewFromUtf8(isolate, result.parScore[1]));

	Local<Array> parContractsString = Array::New(isolate, 2);
	parContractsString ->Set(0, String::NewFromUtf8(isolate, result.parContractsString[0]));
	parContractsString ->Set(1, String::NewFromUtf8(isolate, result.parContractsString[1]));

 	Local<Object> parResultsJS = Object::New(isolate);
	parResultsJS ->Set(String::NewFromUtf8(isolate, "parResults"), parScore);
	parResultsJS ->Set(String::NewFromUtf8(isolate, "parContractsString"), parContractsString);

 	args.GetReturnValue().Set(parResultsJS);
}