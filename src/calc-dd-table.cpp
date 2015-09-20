#include <v8.h>
#include <cstring>
#include <dll.h>
#include "calc-dd-table.h"
#include "dispatch-async.h"

using namespace v8;

struct CalcAsyncRequest : AsyncRequest {
	ddTableDealPBN* tableDeal;
	ddTableResults* result;
	
	~CalcAsyncRequest() {
		delete tableDeal;
		delete result;
	}
};

int PerformSyncCalc(AsyncRequest* asyncReq) {
	CalcAsyncRequest* request = reinterpret_cast<CalcAsyncRequest*>(asyncReq);
	return CalcDDtablePBN(*(request ->tableDeal), request ->result);
}

Local<Value> AsyncResultCalc(AsyncRequest* asyncReq) {
	CalcAsyncRequest* request = reinterpret_cast<CalcAsyncRequest*>(asyncReq);
	ddTableResults * result = request ->result;
	Isolate * isolate = request ->isolate;

	/* extract the results */
 	Local<Array> resTable = Array::New(isolate, 5);

 	for (int i = 0; i < DDS_STRAINS; ++i) {
 		Local<Array> resRow = Array::New(isolate, 4);

 		for (int j = 0; j < DDS_HANDS; ++j) {
 			Local<Number> num = Number::New(isolate, result ->resTable[i][j]); 
 			resRow ->Set(j, num);
 		}

 		resTable ->Set(i, resRow);
 	}

 	return resTable;
}

void NODE_CalcDDtable(const FunctionCallbackInfo<Value>& args) {
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);
 	args.GetReturnValue().SetUndefined();
 	  
	ddTableDealPBN* tableDeal = new ddTableDealPBN();

 	if (!args[0] ->IsString()) {
		isolate ->ThrowException(Exception::TypeError(String::NewFromUtf8(isolate, "pbn should be a PBN string")));
		return;
 	}

	String::Utf8Value input(args[0] ->ToString());
	strncpy(tableDeal ->cards, *input, sizeof tableDeal ->cards - 1);
 	tableDeal ->cards[sizeof tableDeal ->cards-1] = '\0';

 	if (!args[1] ->IsFunction()) {
		isolate ->ThrowException(Exception::TypeError(String::NewFromUtf8(isolate, "callback should be a function")));
		return;
 	}

	Local<Function> callback = Local<Function>::Cast(args[1]);

	ddTableResults * result = new ddTableResults();
	memset(result, 0, sizeof(ddTableResults));

	/* setup the request */
	CalcAsyncRequest* asyncRequest = new CalcAsyncRequest();
	asyncRequest ->isolate = isolate;
	asyncRequest ->performSync = &PerformSyncCalc;
	asyncRequest ->asyncResult = &AsyncResultCalc;
	asyncRequest ->callback.Reset(isolate, callback);
	asyncRequest ->tableDeal = tableDeal;
	asyncRequest ->result = result;

	/* and dispatch it */
	dispatchAsync(asyncRequest);
}