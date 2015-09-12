#include <node.h>
#include <v8.h>
#include <uv.h>
#include <dll.h>
#include "dispatch-async.h"

using namespace v8;
using namespace node;

void DoAsync (uv_work_t* task) {
	AsyncRequest* req = reinterpret_cast<AsyncRequest*>(task ->data);
  	req ->errorCode = req ->performSync(req);
}

void AfterAsync (uv_work_t* task) {
	AsyncRequest* req = reinterpret_cast<AsyncRequest*>(task ->data);
	Isolate * isolate = Isolate::GetCurrent();//req ->isolate;
	HandleScope scope(isolate);

	Local<Function> callback = Local<Function>::New(isolate, req ->callback);
  	TryCatch try_catch;

  	if (req ->errorCode != RETURN_NO_FAULT) {
  		char msg[80];
  		ErrorMessage(req->errorCode, msg);

  		Local<Value> argv[2] = { Undefined(isolate), String::NewFromUtf8(isolate, msg) };
		callback ->Call(isolate->GetCurrentContext()->Global(), 2, argv);
   }
  	else {
  		Local<Value> argv[2] = { req ->asyncResult(req), Undefined(isolate) };
		callback ->Call(isolate->GetCurrentContext()->Global(), 2, argv);
  	}

  	// cleanup
  	delete req;
  	delete task;

  	if (try_catch.HasCaught()) {
   	FatalException(isolate, try_catch);
  	}
}

void dispatchAsync(AsyncRequest* request) {
	uv_work_t* task = new uv_work_t();
	task ->data = request;

	uv_queue_work(uv_default_loop(),
                 task,
                 DoAsync,
                 (uv_after_work_cb)AfterAsync);
}
