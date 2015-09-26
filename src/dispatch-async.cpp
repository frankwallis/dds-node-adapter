#include <node.h>
#include <v8.h>
#include <uv.h>
#include <dll.h>
#include "dispatch-async.h"

using namespace v8;
using namespace node;

static uv_mutex_t call_queue_mutex;
static uv_once_t uv_once_guard = UV_ONCE_INIT;

void initialise() {
	memset(&call_queue_mutex, 0, sizeof(uv_mutex_t));
	
	if (uv_mutex_init(&call_queue_mutex) != 0) {
		perror("dds-node-adapter: Failed to create mutex");
		//throw std::runtime_error("Failed to create mutex");
	}
}

void DoAsync (uv_work_t* task) {
	AsyncRequest* req = reinterpret_cast<AsyncRequest*>(task ->data);

	uv_once(&uv_once_guard, initialise);
	uv_mutex_lock(&call_queue_mutex);

  	req ->errorCode = req ->performSync(req);
  	uv_mutex_unlock(&call_queue_mutex);
}

void AfterAsync (uv_work_t* task) {
	AsyncRequest* req = reinterpret_cast<AsyncRequest*>(task ->data);
	Isolate * isolate = req ->isolate;
	HandleScope scope(isolate);

	Local<Function> callback = Local<Function>::New(isolate, req ->callback);
  	TryCatch try_catch;

  	if (req ->errorCode != RETURN_NO_FAULT) {
  		char msg[80];
  		ErrorMessage(req->errorCode, msg);

  		Local<Value> argv[2] = { Undefined(isolate), String::NewFromUtf8(isolate, msg) };
  		MakeCallback(isolate, isolate->GetCurrentContext()->Global(), callback, 2, argv);
   }
  	else {
  		Local<Value> argv[2] = { req ->asyncResult(req), Undefined(isolate) };
  		MakeCallback(isolate, isolate->GetCurrentContext()->Global(), callback, 2, argv);
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
