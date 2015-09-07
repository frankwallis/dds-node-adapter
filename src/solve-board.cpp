#include <v8.h>
#include <string>
#include <dll.h>
#include "solve-board.h"
#include "dispatch-async.h"

using namespace v8;

struct SolveAsyncRequest : AsyncRequest {
	dealPBN * deal;
	int target;
	int solutions;
	int mode;
	futureTricks * result;
	int threadIndex;

	~SolveAsyncRequest() {
		delete deal;
		delete result;
	}
};

int PerformSyncSolve(AsyncRequest* asyncReq) {
	SolveAsyncRequest* request = reinterpret_cast<SolveAsyncRequest*>(asyncReq);
	return SolveBoardPBN(*(request ->deal), request ->target, request ->solutions, 
		request ->mode, request ->result, request ->threadIndex);
}

Local<Value> AsyncResultSolve(AsyncRequest* asyncReq) {
	SolveAsyncRequest* request = reinterpret_cast<SolveAsyncRequest*>(asyncReq);
	futureTricks * result = request ->result;
	Isolate * isolate = request ->isolate;

	/* extract the results */
	Local<Object> futureTricksJS = Object::New(isolate);
	futureTricksJS ->Set(String::NewFromUtf8(isolate, "nodes"), Integer::New(isolate, result ->nodes));
	futureTricksJS ->Set(String::NewFromUtf8(isolate, "cards"), Integer::New(isolate, result ->cards));

	Local<Array> suits = Array::New(isolate, 13);

	for(int i = 0; i < 13; ++i)
		suits -> Set(i, Integer::New(isolate, result ->suit[i]));

	futureTricksJS ->Set(String::NewFromUtf8(isolate, "suit"), suits);
	
	Local<Array> ranks = Array::New(isolate, 13);

	for(int i = 0; i < 13; ++i)
		ranks -> Set(i, Integer::New(isolate, result ->rank[i]));

	futureTricksJS ->Set(String::NewFromUtf8(isolate, "rank"), ranks);

	Local<Array> equals = Array::New(isolate, 13);

	for(int i = 0; i < 13; ++i)
		equals -> Set(i, Integer::New(isolate, result ->equals[i]));

	futureTricksJS ->Set(String::NewFromUtf8(isolate, "equals"), equals);

	Local<Array> scores = Array::New(isolate, 13);

	for(int i = 0; i < 13; ++i)
		scores ->Set(i, Integer::New(isolate, result ->score[i]));

	futureTricksJS ->Set(String::NewFromUtf8(isolate, "score"), scores);

	return futureTricksJS;
}

void NODE_SolveBoard(const FunctionCallbackInfo<Value>& args) {
	Isolate* isolate = Isolate::GetCurrent();
	HandleScope scope(isolate);

	/* sort out the arguments */
	dealPBN* deal = new dealPBN;

	Local<Object> dealJS = args[0] ->ToObject();
	deal ->trump = dealJS ->Get(String::NewFromUtf8(isolate, "trump")) ->IntegerValue();
	deal ->first = dealJS ->Get(String::NewFromUtf8(isolate, "first")) ->IntegerValue();
	
 	Local<Array> trickSuits = Local<Array>::Cast(dealJS ->Get(String::NewFromUtf8(isolate, "currentTrickSuit")));

 	for (unsigned i = 0; i < 3; ++i) {
 		if (i < trickSuits ->Length())
			deal ->currentTrickSuit[i] = trickSuits ->Get(i) ->IntegerValue();	
		else 
			deal ->currentTrickSuit[i] = 0;
 	}

 	Local<Array> trickRanks = Local<Array>::Cast(dealJS ->Get(String::NewFromUtf8(isolate, "currentTrickRanks")));

 	for (unsigned j = 0; j < 3; ++j) {
 		if (j < trickRanks ->Length())
			deal ->currentTrickRank[j] = trickRanks ->Get(j) ->IntegerValue();	
		else 
			deal ->currentTrickRank[j] = 0;
 	}

	String::Utf8Value remaining(dealJS ->Get(String::NewFromUtf8(isolate, "remainCards")) ->ToString());
	strncpy(deal ->remainCards, *remaining, sizeof deal ->remainCards - 1);
 	deal ->remainCards[sizeof deal ->remainCards-1] = '\0';

	int target      = args[1] ->IntegerValue();
	int solutions   = args[2] ->IntegerValue();
	int mode        = args[3] ->IntegerValue();
	int threadIndex = args[4] ->IntegerValue();

	Local<Function> callback = Local<Function>::Cast(args[5]);

	/* call the function */
	futureTricks* result = new futureTricks();
	memset(result, 0, sizeof(futureTricks));

	/* setup the request */
	SolveAsyncRequest* asyncRequest = new SolveAsyncRequest();
	asyncRequest ->isolate = isolate;
	asyncRequest ->performSync = &PerformSyncSolve;
	asyncRequest ->asyncResult = &AsyncResultSolve;
	asyncRequest ->callback.Reset(isolate, callback);
	asyncRequest ->deal = deal;
	asyncRequest ->target = target;
	asyncRequest ->solutions = solutions;
	asyncRequest ->mode = mode;
	asyncRequest ->result = result;
	asyncRequest ->threadIndex = threadIndex;

	/* and dispatch it */
	dispatchAsync(asyncRequest);
 	args.GetReturnValue().SetUndefined();
}