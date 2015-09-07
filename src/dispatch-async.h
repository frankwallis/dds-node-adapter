#include <v8.h>
#include <uv.h>

struct AsyncRequest;

typedef int (*SyncDelegate)(AsyncRequest*);
typedef v8::Local<v8::Value> (*ResultDelegate)(AsyncRequest*);

struct AsyncRequest {
	v8::Isolate* isolate;
	v8::Persistent<v8::Function> callback;
	SyncDelegate performSync;
	ResultDelegate asyncResult;
	int errorCode;
	
	/* inherit to add custom params */
};

extern "C" {
	void dispatchAsync(AsyncRequest* request);
}