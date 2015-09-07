#include <v8.h>
#include <string>
#include <dll.h>
#include "par.h"
#include "dispatch-async.h"

using namespace v8;

struct ParAsyncRequest : AsyncRequest {
	int vulnerable;
	ddTableResults * tableResults;
	parResults * result;

	~ParAsyncRequest() {
		delete tableResults;
		delete result;
	}
};

int PerformSyncPar(AsyncRequest* asyncReq) {
	ParAsyncRequest* request = reinterpret_cast<ParAsyncRequest*>(asyncReq);
	return Par(request ->tableResults, request ->result, request ->vulnerable);
}

Local<Value> AsyncResultPar(AsyncRequest* asyncReq) {
	ParAsyncRequest* request = reinterpret_cast<ParAsyncRequest*>(asyncReq);
	parResults * result = request ->result;
	Isolate * isolate = request ->isolate;

	/* extract the results */
	Local<Array> parScore = Array::New(isolate, 2);
	parScore ->Set(0, String::NewFromUtf8(isolate, result ->parScore[0]));
	parScore ->Set(1, String::NewFromUtf8(isolate, result ->parScore[1]));

	Local<Array> parContractsString = Array::New(isolate, 2);
	parContractsString ->Set(0, String::NewFromUtf8(isolate, result ->parContractsString[0]));
	parContractsString ->Set(1, String::NewFromUtf8(isolate, result ->parContractsString[1]));

 	Local<Object> parResultsJS = Object::New(isolate);
	parResultsJS ->Set(String::NewFromUtf8(isolate, "parResults"), parScore);
	parResultsJS ->Set(String::NewFromUtf8(isolate, "parContractsString"), parContractsString);

	return parResultsJS;
}

void NODE_Par(const FunctionCallbackInfo<Value>& args) {
	Isolate* isolate = args.GetIsolate();
	HandleScope scope(isolate);

	/* get the arguments */
	ddTableResults* tableResults = new ddTableResults(); // TODO - check this gets freed
 	Local<Array> tableResultsJS = Local<Array>::Cast(args[0]);

 	for (int i = 0; i < DDS_STRAINS; ++i) {
 		Local<Array> resRow = Local<Array>::Cast(tableResultsJS ->Get(i));

 		for (int j = 0; j < DDS_HANDS; ++j) {
 			tableResults ->resTable[i][j] = resRow ->Get(j) ->IntegerValue();
 		}
 	}

	int vulnerable = args[1] ->IntegerValue();
	Local<Function> callback = Local<Function>::Cast(args[2]);

	/* results struct */
	parResults* result = new parResults(); // TODO - check this gets freed
	memset(result, 0, sizeof(parResults));

	/* setup the request */
	ParAsyncRequest* asyncRequest = new ParAsyncRequest();
	asyncRequest ->isolate = isolate;
	asyncRequest ->performSync = &PerformSyncPar;
	asyncRequest ->asyncResult = &AsyncResultPar;
	//asyncRequest.callback = Persistent<Function>::New(isolate, callback);
	asyncRequest ->callback.Reset(isolate, callback);
	asyncRequest ->tableResults = tableResults;
	asyncRequest ->vulnerable = vulnerable;
	asyncRequest ->result = result;

	/* and dispatch it */
	dispatchAsync(asyncRequest);
 	args.GetReturnValue().SetUndefined();
}