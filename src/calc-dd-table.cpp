#include <v8.h>
#include <string>
#include <dll.h>
#include "calc-dd-table.h"

using namespace v8;

void NODE_SetMaxThreads(const FunctionCallbackInfo<Value>& args) {
	int arg0 = args[0] ->IntegerValue();
	SetMaxThreads(arg0);
}

void NODE_CalcDDtable(const FunctionCallbackInfo<Value>& args) {
	Isolate* isolate = Isolate::GetCurrent();
	HandleScope scope(isolate);
  
	ddTableDealPBN pbn;
	ddTableResults result;

	String::Utf8Value input(args[0] ->ToString());
	char * pbn_arg = *input;
	strncpy(pbn.cards, pbn_arg, sizeof pbn.cards - 1);
 	pbn.cards[sizeof pbn.cards-1] = '\0';

	int ret = CalcDDtablePBN(pbn, &result);

	if (ret != RETURN_NO_FAULT) {
		char msg[80];
		ErrorMessage(ret, msg);
		printf("%s\n", msg);
	}

 	Local<Array> resTable = Array::New(isolate, 5);

 	for (int i = 0; i < DDS_HANDS; ++i) {
 		Local<Array> resRow = Array::New(isolate, 4);

 		for (int j = 0; j < DDS_STRAINS; ++j) {
 			Local<Number> num = Number::New(isolate, result.resTable[i][j]); 
 			resRow ->Set(j, num);
 		}

 		resTable ->Set(i, resRow);
 	}

 	args.GetReturnValue().Set(resTable);
}