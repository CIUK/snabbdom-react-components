'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var lodash = _interopDefault(require('lodash'));

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var runtime = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = module.exports;

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() {
    return this || (typeof self === "object" && self);
  })() || Function("return this")()
);
});

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() {
  return this || (typeof self === "object" && self);
})() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

var runtimeModule = runtime;

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}

var regenerator = runtimeModule;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var asyncToGenerator = _asyncToGenerator;

var vnode = function vnode(sel, data, children, text, elm) {
  var key = data === undefined ? undefined : data.key;
  return {
    sel: sel,
    data: data,
    children: children,
    text: text,
    elm: elm,
    key: key
  };
};

var is = {
  array: Array.isArray,
  primitive: function primitive(s) {
    return typeof s === 'string' || typeof s === 'number';
  }
};

function addNS(data, children) {
  data.ns = 'http://www.w3.org/2000/svg';

  if (children !== undefined) {
    for (var i = 0; i < children.length; ++i) {
      addNS(children[i].data, children[i].children);
    }
  }
}

var h = function h(sel, b, c) {
  var data = {},
      children,
      text,
      i;

  if (arguments.length === 3) {
    data = b;

    if (is.array(c)) {
      children = c;
    } else if (is.primitive(c)) {
      text = c;
    }
  } else if (arguments.length === 2) {
    if (is.array(b)) {
      children = b;
    } else if (is.primitive(b)) {
      text = b;
    } else {
      data = b;
    }
  }

  if (is.array(children)) {
    for (i = 0; i < children.length; ++i) {
      if (is.primitive(children[i])) children[i] = vnode(undefined, undefined, undefined, children[i]);
    }
  }

  if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g') {
    addNS(data, children);
  }

  return vnode(sel, data, children, text, undefined);
};

function createElement(tagName) {
  return document.createElement(tagName);
}

function createElementNS(namespaceURI, qualifiedName) {
  return document.createElementNS(namespaceURI, qualifiedName);
}

function createTextNode(text) {
  return document.createTextNode(text);
}

function insertBefore(parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild(node, child) {
  node.removeChild(child);
}

function appendChild(node, child) {
  node.appendChild(child);
}

function parentNode(node) {
  return node.parentElement;
}

function nextSibling(node) {
  return node.nextSibling;
}

function tagName(node) {
  return node.tagName;
}

function setTextContent(node, text) {
  node.textContent = text;
}

var htmldomapi = {
  createElement: createElement,
  createElementNS: createElementNS,
  createTextNode: createTextNode,
  appendChild: appendChild,
  removeChild: removeChild,
  insertBefore: insertBefore,
  parentNode: parentNode,
  nextSibling: nextSibling,
  tagName: tagName,
  setTextContent: setTextContent
};

function isUndef(s) {
  return s === undefined;
}

function isDef(s) {
  return s !== undefined;
}

var emptyNode = vnode('', {}, [], undefined, undefined);

function sameVnode(vnode1, vnode2) {
  return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}

function createKeyToOldIdx(children, beginIdx, endIdx) {
  var i,
      map = {},
      key;

  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) map[key] = i;
  }

  return map;
}

var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];

function init(modules, api) {
  var i,
      j,
      cbs = {};
  if (isUndef(api)) api = htmldomapi;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];

    for (j = 0; j < modules.length; ++j) {
      if (modules[j][hooks[i]] !== undefined) cbs[hooks[i]].push(modules[j][hooks[i]]);
    }
  }

  function emptyNodeAt(elm) {
    return vnode(api.tagName(elm).toLowerCase(), {}, [], undefined, elm);
  }

  function createRmCb(childElm, listeners) {
    return function () {
      if (--listeners === 0) {
        var parent = api.parentNode(childElm);
        api.removeChild(parent, childElm);
      }
    };
  }

  function createElm(vnode$$1, insertedVnodeQueue) {
    var i,
        data = vnode$$1.data;

    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) {
        i(vnode$$1);
        data = vnode$$1.data;
      }
    }

    var elm,
        children = vnode$$1.children,
        sel = vnode$$1.sel;

    if (isDef(sel)) {
      // Parse selector
      var hashIdx = sel.indexOf('#');
      var dotIdx = sel.indexOf('.', hashIdx);
      var hash = hashIdx > 0 ? hashIdx : sel.length;
      var dot = dotIdx > 0 ? dotIdx : sel.length;
      var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
      elm = vnode$$1.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, tag) : api.createElement(tag);
      if (hash < dot) elm.id = sel.slice(hash + 1, dot);
      if (dotIdx > 0) elm.className = sel.slice(dot + 1).replace(/\./g, ' ');

      if (is.array(children)) {
        for (i = 0; i < children.length; ++i) {
          api.appendChild(elm, createElm(children[i], insertedVnodeQueue));
        }
      } else if (is.primitive(vnode$$1.text)) {
        api.appendChild(elm, api.createTextNode(vnode$$1.text));
      }

      for (i = 0; i < cbs.create.length; ++i) {
        cbs.create[i](emptyNode, vnode$$1);
      }

      i = vnode$$1.data.hook; // Reuse variable

      if (isDef(i)) {
        if (i.create) i.create(emptyNode, vnode$$1);
        if (i.insert) insertedVnodeQueue.push(vnode$$1);
      }
    } else {
      elm = vnode$$1.elm = api.createTextNode(vnode$$1.text);
    }

    return vnode$$1.elm;
  }

  function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      api.insertBefore(parentElm, createElm(vnodes[startIdx], insertedVnodeQueue), before);
    }
  }

  function invokeDestroyHook(vnode$$1) {
    var i,
        j,
        data = vnode$$1.data;

    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode$$1);

      for (i = 0; i < cbs.destroy.length; ++i) {
        cbs.destroy[i](vnode$$1);
      }

      if (isDef(i = vnode$$1.children)) {
        for (j = 0; j < vnode$$1.children.length; ++j) {
          invokeDestroyHook(vnode$$1.children[j]);
        }
      }
    }
  }

  function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var i,
          listeners,
          rm,
          ch = vnodes[startIdx];

      if (isDef(ch)) {
        if (isDef(ch.sel)) {
          invokeDestroyHook(ch);
          listeners = cbs.remove.length + 1;
          rm = createRmCb(ch.elm, listeners);

          for (i = 0; i < cbs.remove.length; ++i) {
            cbs.remove[i](ch, rm);
          }

          if (isDef(i = ch.data) && isDef(i = i.hook) && isDef(i = i.remove)) {
            i(ch, rm);
          } else {
            rm();
          }
        } else {
          // Text node
          api.removeChild(parentElm, ch.elm);
        }
      }
    }
  }

  function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
    var oldStartIdx = 0,
        newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, before;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) {
        // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) {
        // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        idxInOld = oldKeyToIdx[newStartVnode.key];

        if (isUndef(idxInOld)) {
          // New element
          api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];
          patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
          oldCh[idxInOld] = undefined;
          api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        }
      }
    }

    if (oldStartIdx > oldEndIdx) {
      before = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function patchVnode(oldVnode, vnode$$1, insertedVnodeQueue) {
    var i, hook;

    if (isDef(i = vnode$$1.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
      i(oldVnode, vnode$$1);
    }

    var elm = vnode$$1.elm = oldVnode.elm,
        oldCh = oldVnode.children,
        ch = vnode$$1.children;
    if (oldVnode === vnode$$1) return;

    if (!sameVnode(oldVnode, vnode$$1)) {
      var parentElm = api.parentNode(oldVnode.elm);
      elm = createElm(vnode$$1, insertedVnodeQueue);
      api.insertBefore(parentElm, elm, oldVnode.elm);
      removeVnodes(parentElm, [oldVnode], 0, 0);
      return;
    }

    if (isDef(vnode$$1.data)) {
      for (i = 0; i < cbs.update.length; ++i) {
        cbs.update[i](oldVnode, vnode$$1);
      }

      i = vnode$$1.data.hook;
      if (isDef(i) && isDef(i = i.update)) i(oldVnode, vnode$$1);
    }

    if (isUndef(vnode$$1.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue);
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) api.setTextContent(elm, '');
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        api.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode$$1.text) {
      api.setTextContent(elm, vnode$$1.text);
    }

    if (isDef(hook) && isDef(i = hook.postpatch)) {
      i(oldVnode, vnode$$1);
    }
  }

  return function (oldVnode, vnode$$1) {
    var i, elm, parent;
    var insertedVnodeQueue = [];

    for (i = 0; i < cbs.pre.length; ++i) {
      cbs.pre[i]();
    }

    if (isUndef(oldVnode.sel)) {
      oldVnode = emptyNodeAt(oldVnode);
    }

    if (sameVnode(oldVnode, vnode$$1)) {
      patchVnode(oldVnode, vnode$$1, insertedVnodeQueue);
    } else {
      elm = oldVnode.elm;
      parent = api.parentNode(elm);
      createElm(vnode$$1, insertedVnodeQueue);

      if (parent !== null) {
        api.insertBefore(parent, vnode$$1.elm, api.nextSibling(elm));
        removeVnodes(parent, [oldVnode], 0, 0);
      }
    }

    for (i = 0; i < insertedVnodeQueue.length; ++i) {
      insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
    }

    for (i = 0; i < cbs.post.length; ++i) {
      cbs.post[i]();
    }

    return vnode$$1;
  };
}

var snabbdom = {
  init: init
};

function updateClass(oldVnode, vnode) {
  var cur,
      name,
      elm = vnode.elm,
      oldClass = oldVnode.data.class || {},
      klass = vnode.data.class || {};

  for (name in oldClass) {
    if (!klass[name]) {
      elm.classList.remove(name);
    }
  }

  for (name in klass) {
    cur = klass[name];

    if (cur !== oldClass[name]) {
      elm.classList[cur ? 'add' : 'remove'](name);
    }
  }
}

var _class = {
  create: updateClass,
  update: updateClass
};

function updateProps(oldVnode, vnode) {
  var key,
      cur,
      old,
      elm = vnode.elm,
      oldProps = oldVnode.data.props || {},
      props = vnode.data.props || {};

  for (key in oldProps) {
    if (!props[key]) {
      delete elm[key];
    }
  }

  for (key in props) {
    cur = props[key];
    old = oldProps[key];

    if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
      elm[key] = cur;
    }
  }
}

var props = {
  create: updateProps,
  update: updateProps
};

var booleanAttrs = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "compact", "controls", "declare", "default", "defaultchecked", "defaultmuted", "defaultselected", "defer", "disabled", "draggable", "enabled", "formnovalidate", "hidden", "indeterminate", "inert", "ismap", "itemscope", "loop", "multiple", "muted", "nohref", "noresize", "noshade", "novalidate", "nowrap", "open", "pauseonexit", "readonly", "required", "reversed", "scoped", "seamless", "selected", "sortable", "spellcheck", "translate", "truespeed", "typemustmatch", "visible"];
var booleanAttrsDict = {};

for (var i = 0, len = booleanAttrs.length; i < len; i++) {
  booleanAttrsDict[booleanAttrs[i]] = true;
}

function updateAttrs(oldVnode, vnode) {
  var key,
      cur,
      old,
      elm = vnode.elm,
      oldAttrs = oldVnode.data.attrs || {},
      attrs = vnode.data.attrs || {}; // update modified attributes, add new attributes

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];

    if (old !== cur) {
      // TODO: add support to namespaced attributes (setAttributeNS)
      if (!cur && booleanAttrsDict[key]) elm.removeAttribute(key);else elm.setAttribute(key, cur);
    }
  } //remove removed attributes
  // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
  // the other option is to remove all attributes with value == undefined


  for (key in oldAttrs) {
    if (!(key in attrs)) {
      elm.removeAttribute(key);
    }
  }
}

var attributes = {
  create: updateAttrs,
  update: updateAttrs
};

var raf = typeof window !== 'undefined' && window.requestAnimationFrame || setTimeout;

var nextFrame = function nextFrame(fn) {
  raf(function () {
    raf(fn);
  });
};

function setNextFrame(obj, prop, val) {
  nextFrame(function () {
    obj[prop] = val;
  });
}

function updateStyle(oldVnode, vnode) {
  if (typeof vnode.data.style === 'string') {
    vnode.elm.style = vnode.data.style;
    return;
  }

  var cur;
  var name;
  var elm = vnode.elm;
  var oldStyle = oldVnode.data.style || {};
  var style = vnode.data.style || {};
  var oldHasDel = 'delayed' in oldStyle;

  for (name in oldStyle) {
    if (!style[name]) {
      elm.style[name] = '';
    }
  }

  for (name in style) {
    cur = style[name];

    if (name === 'delayed') {
      for (name in style.delayed) {
        cur = style.delayed[name];

        if (!oldHasDel || cur !== oldStyle.delayed[name]) {
          setNextFrame(elm.style, name, cur);
        }
      }
    } else if (name !== 'remove' && cur !== oldStyle[name]) {
      elm.style[name] = cur;
    }
  }
}

function applyDestroyStyle(vnode) {
  var style;
  var name;
  var elm = vnode.elm;
  var s = vnode.data.style;
  if (!s || !(style = s.destroy)) return;

  for (name in style) {
    elm.style[name] = style[name];
  }
}

function applyRemoveStyle(vnode, rm) {
  var s = vnode.data.style;

  if (!s || !s.remove) {
    rm();
    return;
  }

  var name;
  var elm = vnode.elm;
  var i = 0;
  var compStyle;
  var style = s.remove;
  var amount = 0;
  var applied = [];

  for (name in style) {
    applied.push(name);
    elm.style[name] = style[name];
  }

  compStyle = getComputedStyle(elm);
  var props = compStyle['transition-property'].split(', ');

  for (; i < props.length; ++i) {
    if (applied.indexOf(props[i]) !== -1) amount++;
  }

  elm.addEventListener('transitionend', function (ev) {
    if (ev.target === elm) --amount;
    if (amount === 0) rm();
  });
}

var style = {
  create: updateStyle,
  update: updateStyle,
  destroy: applyDestroyStyle,
  remove: applyRemoveStyle
};

function arrInvoker(arr) {
  return function () {
    // Special case when length is two, for performance
    arr.length === 2 ? arr[0](arr[1]) : arr[0].apply(undefined, arr.slice(1));
  };
}

function fnInvoker(o) {
  return function (ev) {
    o.fn(ev);
  };
}

function updateEventListeners(oldVnode, vnode) {
  var name,
      cur,
      old,
      elm = vnode.elm,
      oldOn = oldVnode.data.on || {},
      on = vnode.data.on;
  if (!on) return;

  for (name in on) {
    cur = on[name];
    old = oldOn[name];

    if (old === undefined) {
      if (is.array(cur)) {
        elm.addEventListener(name, arrInvoker(cur));
      } else {
        cur = {
          fn: cur
        };
        on[name] = cur;
        elm.addEventListener(name, fnInvoker(cur));
      }
    } else if (is.array(old)) {
      // Deliberately modify old array since it's captured in closure created with `arrInvoker`
      old.length = cur.length;

      for (var i = 0; i < old.length; ++i) {
        old[i] = cur[i];
      }

      on[name] = old;
    } else {
      old.fn = cur;
      on[name] = old;
    }
  }
}

var eventlisteners = {
  create: updateEventListeners,
  update: updateEventListeners
};

var patch = snabbdom.init([_class, props, attributes, style, eventlisteners]);

var isFunction = lodash.isFunction,
    isArray = lodash.isArray,
    isString = lodash.isString;

var getLoader = function getLoader(waitComponent) {
  var loader = waitComponent;

  if (isFunction(loader)) {
    loader = loader();

    if (!isArray(loader)) {
      loader = [loader];
    }
  }

  if (!isString(loader) && !isArray(loader)) {
    loader = [loader];
  }

  return loader;
};

var lazy = function lazy(lazyComponent, waitComponent) {
  return function (params) {
    return h('div', {
      hook: {
        insert: function () {
          var _insert = asyncToGenerator(
          /*#__PURE__*/
          regenerator.mark(function _callee(vnode) {
            var view;
            return regenerator.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return lazyComponent(params);

                  case 2:
                    view = _context.sent;
                    patch(vnode, view);

                  case 4:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          function insert(_x) {
            return _insert.apply(this, arguments);
          }

          return insert;
        }()
      }
    }, getLoader(waitComponent));
  };
};

var lazy_1 = lazy;

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }
}

var arrayWithoutHoles = _arrayWithoutHoles;

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

var iterableToArray = _iterableToArray;

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var nonIterableSpread = _nonIterableSpread;

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || nonIterableSpread();
}

var toConsumableArray = _toConsumableArray;

var _typeof_1 = createCommonjsModule(function (module) {
function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

function _typeof(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
});

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

var arrayWithHoles = _arrayWithHoles;

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

var iterableToArrayLimit = _iterableToArrayLimit;

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var nonIterableRest = _nonIterableRest;

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || nonIterableRest();
}

var slicedToArray = _slicedToArray;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var defineProperty = _defineProperty;

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      defineProperty(target, key, source[key]);
    });
  }

  return target;
}

var objectSpread = _objectSpread;

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

var _listCacheClear = listCacheClear;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

var eq_1 = eq;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq_1(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

var _assocIndexOf = assocIndexOf;

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

var _listCacheDelete = listCacheDelete;

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

var _listCacheGet = listCacheGet;

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return _assocIndexOf(this.__data__, key) > -1;
}

var _listCacheHas = listCacheHas;

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

var _listCacheSet = listCacheSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = _listCacheClear;
ListCache.prototype['delete'] = _listCacheDelete;
ListCache.prototype.get = _listCacheGet;
ListCache.prototype.has = _listCacheHas;
ListCache.prototype.set = _listCacheSet;

var _ListCache = ListCache;

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new _ListCache;
  this.size = 0;
}

var _stackClear = stackClear;

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

var _stackDelete = stackDelete;

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

var _stackGet = stackGet;

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

var _stackHas = stackHas;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

var _root = root;

/** Built-in value references. */
var Symbol$1 = _root.Symbol;

var _Symbol = Symbol$1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

var _baseGetTag = baseGetTag;

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject;

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction$1(value) {
  if (!isObject_1(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = _baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

var isFunction_1 = isFunction$1;

/** Used to detect overreaching core-js shims. */
var coreJsData = _root['__core-js_shared__'];

var _coreJsData = coreJsData;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

var _isMasked = isMasked;

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

var _toSource = toSource;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype,
    objectProto$2 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject_1(value) || _isMasked(value)) {
    return false;
  }
  var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
  return pattern.test(_toSource(value));
}

var _baseIsNative = baseIsNative;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

var _getValue = getValue;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = _getValue(object, key);
  return _baseIsNative(value) ? value : undefined;
}

var _getNative = getNative;

/* Built-in method references that are verified to be native. */
var Map = _getNative(_root, 'Map');

var _Map = Map;

/* Built-in method references that are verified to be native. */
var nativeCreate = _getNative(Object, 'create');

var _nativeCreate = nativeCreate;

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
  this.size = 0;
}

var _hashClear = hashClear;

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

var _hashDelete = hashDelete;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (_nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
}

var _hashGet = hashGet;

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$3.call(data, key);
}

var _hashHas = hashHas;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

var _hashSet = hashSet;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = _hashClear;
Hash.prototype['delete'] = _hashDelete;
Hash.prototype.get = _hashGet;
Hash.prototype.has = _hashHas;
Hash.prototype.set = _hashSet;

var _Hash = Hash;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new _Hash,
    'map': new (_Map || _ListCache),
    'string': new _Hash
  };
}

var _mapCacheClear = mapCacheClear;

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

var _isKeyable = isKeyable;

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return _isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

var _getMapData = getMapData;

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = _getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

var _mapCacheDelete = mapCacheDelete;

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return _getMapData(this, key).get(key);
}

var _mapCacheGet = mapCacheGet;

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return _getMapData(this, key).has(key);
}

var _mapCacheHas = mapCacheHas;

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = _getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

var _mapCacheSet = mapCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = _mapCacheClear;
MapCache.prototype['delete'] = _mapCacheDelete;
MapCache.prototype.get = _mapCacheGet;
MapCache.prototype.has = _mapCacheHas;
MapCache.prototype.set = _mapCacheSet;

var _MapCache = MapCache;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof _ListCache) {
    var pairs = data.__data__;
    if (!_Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new _MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

var _stackSet = stackSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new _ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = _stackClear;
Stack.prototype['delete'] = _stackDelete;
Stack.prototype.get = _stackGet;
Stack.prototype.has = _stackHas;
Stack.prototype.set = _stackSet;

var _Stack = Stack;

var defineProperty$1 = (function() {
  try {
    var func = _getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

var _defineProperty$1 = defineProperty$1;

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && _defineProperty$1) {
    _defineProperty$1(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

var _baseAssignValue = baseAssignValue;

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
  if ((value !== undefined && !eq_1(object[key], value)) ||
      (value === undefined && !(key in object))) {
    _baseAssignValue(object, key, value);
  }
}

var _assignMergeValue = assignMergeValue;

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

var _createBaseFor = createBaseFor;

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = _createBaseFor();

var _baseFor = baseFor;

var _cloneBuffer = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;
});

/** Built-in value references. */
var Uint8Array = _root.Uint8Array;

var _Uint8Array = Uint8Array;

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new _Uint8Array(result).set(new _Uint8Array(arrayBuffer));
  return result;
}

var _cloneArrayBuffer = cloneArrayBuffer;

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? _cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

var _cloneTypedArray = cloneTypedArray;

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

var _copyArray = copyArray;

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject_1(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

var _baseCreate = baseCreate;

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var _overArg = overArg;

/** Built-in value references. */
var getPrototype = _overArg(Object.getPrototypeOf, Object);

var _getPrototype = getPrototype;

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$5;

  return value === proto;
}

var _isPrototype = isPrototype;

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !_isPrototype(object))
    ? _baseCreate(_getPrototype(object))
    : {};
}

var _initCloneObject = initCloneObject;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
}

var _baseIsArguments = baseIsArguments;

/** Used for built-in method references. */
var objectProto$6 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$6.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
  return isObjectLike_1(value) && hasOwnProperty$4.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

var isArguments_1 = isArguments;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray$1 = Array.isArray;

var isArray_1 = isArray$1;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

var isLength_1 = isLength;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength_1(value.length) && !isFunction_1(value);
}

var isArrayLike_1 = isArrayLike;

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike_1(value) && isArrayLike_1(value);
}

var isArrayLikeObject_1 = isArrayLikeObject;

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

var stubFalse_1 = stubFalse;

var isBuffer_1 = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse_1;

module.exports = isBuffer;
});

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto$2 = Function.prototype,
    objectProto$7 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$2 = funcProto$2.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString$2.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike_1(value) || _baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = _getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$5.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString$2.call(Ctor) == objectCtorString;
}

var isPlainObject_1 = isPlainObject;

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag$1 = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag$1] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike_1(value) &&
    isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
}

var _baseIsTypedArray = baseIsTypedArray;

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

var _baseUnary = baseUnary;

var _nodeUtil = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && _freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;
});

/* Node.js helper references. */
var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

var isTypedArray_1 = isTypedArray;

/**
 * Gets the value at `key`, unless `key` is "__proto__".
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function safeGet(object, key) {
  if (key == '__proto__') {
    return;
  }

  return object[key];
}

var _safeGet = safeGet;

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$6.call(object, key) && eq_1(objValue, value)) ||
      (value === undefined && !(key in object))) {
    _baseAssignValue(object, key, value);
  }
}

var _assignValue = assignValue;

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      _baseAssignValue(object, key, newValue);
    } else {
      _assignValue(object, key, newValue);
    }
  }
  return object;
}

var _copyObject = copyObject;

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

var _baseTimes = baseTimes;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER$1 : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

var _isIndex = isIndex;

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray_1(value),
      isArg = !isArr && isArguments_1(value),
      isBuff = !isArr && !isArg && isBuffer_1(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? _baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$7.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           _isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

var _arrayLikeKeys = arrayLikeKeys;

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

var _nativeKeysIn = nativeKeysIn;

/** Used for built-in method references. */
var objectProto$a = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$a.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject_1(object)) {
    return _nativeKeysIn(object);
  }
  var isProto = _isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$8.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

var _baseKeysIn = baseKeysIn;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object, true) : _baseKeysIn(object);
}

var keysIn_1 = keysIn;

/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return _copyObject(value, keysIn_1(value));
}

var toPlainObject_1 = toPlainObject;

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = _safeGet(object, key),
      srcValue = _safeGet(source, key),
      stacked = stack.get(srcValue);

  if (stacked) {
    _assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    var isArr = isArray_1(srcValue),
        isBuff = !isArr && isBuffer_1(srcValue),
        isTyped = !isArr && !isBuff && isTypedArray_1(srcValue);

    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray_1(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject_1(objValue)) {
        newValue = _copyArray(objValue);
      }
      else if (isBuff) {
        isCommon = false;
        newValue = _cloneBuffer(srcValue, true);
      }
      else if (isTyped) {
        isCommon = false;
        newValue = _cloneTypedArray(srcValue, true);
      }
      else {
        newValue = [];
      }
    }
    else if (isPlainObject_1(srcValue) || isArguments_1(srcValue)) {
      newValue = objValue;
      if (isArguments_1(objValue)) {
        newValue = toPlainObject_1(objValue);
      }
      else if (!isObject_1(objValue) || isFunction_1(objValue)) {
        newValue = _initCloneObject(srcValue);
      }
    }
    else {
      isCommon = false;
    }
  }
  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  _assignMergeValue(object, key, newValue);
}

var _baseMergeDeep = baseMergeDeep;

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  _baseFor(source, function(srcValue, key) {
    if (isObject_1(srcValue)) {
      stack || (stack = new _Stack);
      _baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer(_safeGet(object, key), srcValue, (key + ''), object, source, stack)
        : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      _assignMergeValue(object, key, newValue);
    }
  }, keysIn_1);
}

var _baseMerge = baseMerge;

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

var identity_1 = identity;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

var _apply = apply;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return _apply(func, this, otherArgs);
  };
}

var _overRest = overRest;

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

var constant_1 = constant;

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !_defineProperty$1 ? identity_1 : function(func, string) {
  return _defineProperty$1(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant_1(string),
    'writable': true
  });
};

var _baseSetToString = baseSetToString;

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

var _shortOut = shortOut;

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = _shortOut(_baseSetToString);

var _setToString = setToString;

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return _setToString(_overRest(func, start, identity_1), func + '');
}

var _baseRest = baseRest;

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject_1(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike_1(object) && _isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq_1(object[index], value);
  }
  return false;
}

var _isIterateeCall = isIterateeCall;

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return _baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && _isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

var _createAssigner = createAssigner;

/**
 * This method is like `_.merge` except that it accepts `customizer` which
 * is invoked to produce the merged values of the destination and source
 * properties. If `customizer` returns `undefined`, merging is handled by the
 * method instead. The `customizer` is invoked with six arguments:
 * (objValue, srcValue, key, object, source, stack).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} customizer The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   if (_.isArray(objValue)) {
 *     return objValue.concat(srcValue);
 *   }
 * }
 *
 * var object = { 'a': [1], 'b': [2] };
 * var other = { 'a': [3], 'b': [4] };
 *
 * _.mergeWith(object, other, customizer);
 * // => { 'a': [1, 3], 'b': [2, 4] }
 */
var mergeWith = _createAssigner(function(object, source, srcIndex, customizer) {
  _baseMerge(object, source, srcIndex, customizer);
});

var mergeWith_1 = mergeWith;

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

var _arrayEach = arrayEach;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = _overArg(Object.keys, Object);

var _nativeKeys = nativeKeys;

/** Used for built-in method references. */
var objectProto$b = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$b.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!_isPrototype(object)) {
    return _nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$9.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

var _baseKeys = baseKeys;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
}

var keys_1 = keys;

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && _baseFor(object, iteratee, keys_1);
}

var _baseForOwn = baseForOwn;

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike_1(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

var _createBaseEach = createBaseEach;

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = _createBaseEach(_baseForOwn);

var _baseEach = baseEach;

/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */
function castFunction(value) {
  return typeof value == 'function' ? value : identity_1;
}

var _castFunction = castFunction;

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _.forEach([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray_1(collection) ? _arrayEach : _baseEach;
  return func(collection, _castFunction(iteratee));
}

var forEach_1 = forEach;

/**
 * The base implementation of methods like `_.findKey` and `_.findLastKey`,
 * without support for iteratee shorthands, which iterates over `collection`
 * using `eachFunc`.
 *
 * @private
 * @param {Array|Object} collection The collection to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {Function} eachFunc The function to iterate over `collection`.
 * @returns {*} Returns the found element or its key, else `undefined`.
 */
function baseFindKey(collection, predicate, eachFunc) {
  var result;
  eachFunc(collection, function(value, key, collection) {
    if (predicate(value, key, collection)) {
      result = key;
      return false;
    }
  });
  return result;
}

var _baseFindKey = baseFindKey;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED$2);
  return this;
}

var _setCacheAdd = setCacheAdd;

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

var _setCacheHas = setCacheHas;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new _MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd;
SetCache.prototype.has = _setCacheHas;

var _SetCache = SetCache;

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

var _arraySome = arraySome;

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

var _cacheHas = cacheHas;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new _SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!_arraySome(other, function(othValue, othIndex) {
            if (!_cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

var _equalArrays = equalArrays;

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

var _mapToArray = mapToArray;

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

var _setToArray = setToArray;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$1 = 1,
    COMPARE_UNORDERED_FLAG$1 = 2;

/** `Object#toString` result references. */
var boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    errorTag$1 = '[object Error]',
    mapTag$1 = '[object Map]',
    numberTag$1 = '[object Number]',
    regexpTag$1 = '[object RegExp]',
    setTag$1 = '[object Set]',
    stringTag$1 = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag$1 = '[object ArrayBuffer]',
    dataViewTag$1 = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag$1:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag$1:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new _Uint8Array(object), new _Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag$1:
    case dateTag$1:
    case numberTag$1:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq_1(+object, +other);

    case errorTag$1:
      return object.name == other.name && object.message == other.message;

    case regexpTag$1:
    case stringTag$1:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag$1:
      var convert = _mapToArray;

    case setTag$1:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1;
      convert || (convert = _setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG$1;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = _equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

var _equalByTag = equalByTag;

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

var _arrayPush = arrayPush;

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
}

var _baseGetAllKeys = baseGetAllKeys;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

var _arrayFilter = arrayFilter;

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

var stubArray_1 = stubArray;

/** Used for built-in method references. */
var objectProto$c = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$c.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray_1 : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return _arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable$1.call(object, symbol);
  });
};

var _getSymbols = getSymbols;

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return _baseGetAllKeys(object, keys_1, _getSymbols);
}

var _getAllKeys = getAllKeys;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$2 = 1;

/** Used for built-in method references. */
var objectProto$d = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$a = objectProto$d.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
      objProps = _getAllKeys(object),
      objLength = objProps.length,
      othProps = _getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty$a.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

var _equalObjects = equalObjects;

/* Built-in method references that are verified to be native. */
var DataView = _getNative(_root, 'DataView');

var _DataView = DataView;

/* Built-in method references that are verified to be native. */
var Promise$1 = _getNative(_root, 'Promise');

var _Promise = Promise$1;

/* Built-in method references that are verified to be native. */
var Set = _getNative(_root, 'Set');

var _Set = Set;

/* Built-in method references that are verified to be native. */
var WeakMap = _getNative(_root, 'WeakMap');

var _WeakMap = WeakMap;

/** `Object#toString` result references. */
var mapTag$2 = '[object Map]',
    objectTag$2 = '[object Object]',
    promiseTag = '[object Promise]',
    setTag$2 = '[object Set]',
    weakMapTag$1 = '[object WeakMap]';

var dataViewTag$2 = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = _toSource(_DataView),
    mapCtorString = _toSource(_Map),
    promiseCtorString = _toSource(_Promise),
    setCtorString = _toSource(_Set),
    weakMapCtorString = _toSource(_WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = _baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$2) ||
    (_Map && getTag(new _Map) != mapTag$2) ||
    (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
    (_Set && getTag(new _Set) != setTag$2) ||
    (_WeakMap && getTag(new _WeakMap) != weakMapTag$1)) {
  getTag = function(value) {
    var result = _baseGetTag(value),
        Ctor = result == objectTag$2 ? value.constructor : undefined,
        ctorString = Ctor ? _toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag$2;
        case mapCtorString: return mapTag$2;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag$2;
        case weakMapCtorString: return weakMapTag$1;
      }
    }
    return result;
  };
}

var _getTag = getTag;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$3 = 1;

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    objectTag$3 = '[object Object]';

/** Used for built-in method references. */
var objectProto$e = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$b = objectProto$e.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray_1(object),
      othIsArr = isArray_1(other),
      objTag = objIsArr ? arrayTag$1 : _getTag(object),
      othTag = othIsArr ? arrayTag$1 : _getTag(other);

  objTag = objTag == argsTag$2 ? objectTag$3 : objTag;
  othTag = othTag == argsTag$2 ? objectTag$3 : othTag;

  var objIsObj = objTag == objectTag$3,
      othIsObj = othTag == objectTag$3,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer_1(object)) {
    if (!isBuffer_1(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new _Stack);
    return (objIsArr || isTypedArray_1(object))
      ? _equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : _equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG$3)) {
    var objIsWrapped = objIsObj && hasOwnProperty$b.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty$b.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new _Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new _Stack);
  return _equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

var _baseIsEqualDeep = baseIsEqualDeep;

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike_1(value) && !isObjectLike_1(other))) {
    return value !== value && other !== other;
  }
  return _baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

var _baseIsEqual = baseIsEqual;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$4 = 1,
    COMPARE_UNORDERED_FLAG$2 = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new _Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$4 | COMPARE_UNORDERED_FLAG$2, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

var _baseIsMatch = baseIsMatch;

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject_1(value);
}

var _isStrictComparable = isStrictComparable;

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys_1(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, _isStrictComparable(value)];
  }
  return result;
}

var _getMatchData = getMatchData;

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

var _matchesStrictComparable = matchesStrictComparable;

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = _getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return _matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || _baseIsMatch(object, source, matchData);
  };
}

var _baseMatches = baseMatches;

/** `Object#toString` result references. */
var symbolTag$1 = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag$1);
}

var isSymbol_1 = isSymbol;

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray_1(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol_1(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

var _isKey = isKey;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || _MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = _MapCache;

var memoize_1 = memoize;

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize_1(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

var _memoizeCapped = memoizeCapped;

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = _memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

var _stringToPath = stringToPath;

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

var _arrayMap = arrayMap;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined,
    symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray_1(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return _arrayMap(value, baseToString) + '';
  }
  if (isSymbol_1(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

var _baseToString = baseToString;

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : _baseToString(value);
}

var toString_1 = toString;

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray_1(value)) {
    return value;
  }
  return _isKey(value, object) ? [value] : _stringToPath(toString_1(value));
}

var _castPath = castPath;

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol_1(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

var _toKey = toKey;

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = _castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[_toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

var _baseGet = baseGet;

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : _baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

var get_1 = get;

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

var _baseHasIn = baseHasIn;

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = _castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = _toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength_1(length) && _isIndex(key, length) &&
    (isArray_1(object) || isArguments_1(object));
}

var _hasPath = hasPath;

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && _hasPath(object, path, _baseHasIn);
}

var hasIn_1 = hasIn;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$5 = 1,
    COMPARE_UNORDERED_FLAG$3 = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (_isKey(path) && _isStrictComparable(srcValue)) {
    return _matchesStrictComparable(_toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get_1(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn_1(object, path)
      : _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$5 | COMPARE_UNORDERED_FLAG$3);
  };
}

var _baseMatchesProperty = baseMatchesProperty;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

var _baseProperty = baseProperty;

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return _baseGet(object, path);
  };
}

var _basePropertyDeep = basePropertyDeep;

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return _isKey(path) ? _baseProperty(_toKey(path)) : _basePropertyDeep(path);
}

var property_1 = property;

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity_1;
  }
  if (typeof value == 'object') {
    return isArray_1(value)
      ? _baseMatchesProperty(value[0], value[1])
      : _baseMatches(value);
  }
  return property_1(value);
}

var _baseIteratee = baseIteratee;

/**
 * This method is like `_.find` except that it returns the key of the first
 * element `predicate` returns truthy for instead of the element itself.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category Object
 * @param {Object} object The object to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {string|undefined} Returns the key of the matched element,
 *  else `undefined`.
 * @example
 *
 * var users = {
 *   'barney':  { 'age': 36, 'active': true },
 *   'fred':    { 'age': 40, 'active': false },
 *   'pebbles': { 'age': 1,  'active': true }
 * };
 *
 * _.findKey(users, function(o) { return o.age < 40; });
 * // => 'barney' (iteration order is not guaranteed)
 *
 * // The `_.matches` iteratee shorthand.
 * _.findKey(users, { 'age': 1, 'active': true });
 * // => 'pebbles'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findKey(users, ['active', false]);
 * // => 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.findKey(users, 'active');
 * // => 'barney'
 */
function findKey(object, predicate) {
  return _baseFindKey(object, _baseIteratee(predicate, 3), _baseForOwn);
}

var findKey_1 = findKey;

/** `Object#toString` result references. */
var stringTag$2 = '[object String]';

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString$1(value) {
  return typeof value == 'string' ||
    (!isArray_1(value) && isObjectLike_1(value) && _baseGetTag(value) == stringTag$2);
}

var isString_1 = isString$1;

/**
 * Converts `iterator` to an array.
 *
 * @private
 * @param {Object} iterator The iterator to convert.
 * @returns {Array} Returns the converted array.
 */
function iteratorToArray(iterator) {
  var data,
      result = [];

  while (!(data = iterator.next()).done) {
    result.push(data.value);
  }
  return result;
}

var _iteratorToArray = iteratorToArray;

/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function asciiToArray(string) {
  return string.split('');
}

var _asciiToArray = asciiToArray;

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsZWJ = '\\u200d';

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

var _hasUnicode = hasUnicode;

/** Used to compose unicode character classes. */
var rsAstralRange$1 = '\\ud800-\\udfff',
    rsComboMarksRange$1 = '\\u0300-\\u036f',
    reComboHalfMarksRange$1 = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange$1 = '\\u20d0-\\u20ff',
    rsComboRange$1 = rsComboMarksRange$1 + reComboHalfMarksRange$1 + rsComboSymbolsRange$1,
    rsVarRange$1 = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange$1 + ']',
    rsCombo = '[' + rsComboRange$1 + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange$1 + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ$1 = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange$1 + ']?',
    rsOptJoin = '(?:' + rsZWJ$1 + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/**
 * Converts a Unicode `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}

var _unicodeToArray = unicodeToArray;

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
  return _hasUnicode(string)
    ? _unicodeToArray(string)
    : _asciiToArray(string);
}

var _stringToArray = stringToArray;

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return _arrayMap(props, function(key) {
    return object[key];
  });
}

var _baseValues = baseValues;

/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return object == null ? [] : _baseValues(object, keys_1(object));
}

var values_1 = values;

/** `Object#toString` result references. */
var mapTag$3 = '[object Map]',
    setTag$3 = '[object Set]';

/** Built-in value references. */
var symIterator = _Symbol ? _Symbol.iterator : undefined;

/**
 * Converts `value` to an array.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Array} Returns the converted array.
 * @example
 *
 * _.toArray({ 'a': 1, 'b': 2 });
 * // => [1, 2]
 *
 * _.toArray('abc');
 * // => ['a', 'b', 'c']
 *
 * _.toArray(1);
 * // => []
 *
 * _.toArray(null);
 * // => []
 */
function toArray(value) {
  if (!value) {
    return [];
  }
  if (isArrayLike_1(value)) {
    return isString_1(value) ? _stringToArray(value) : _copyArray(value);
  }
  if (symIterator && value[symIterator]) {
    return _iteratorToArray(value[symIterator]());
  }
  var tag = _getTag(value),
      func = tag == mapTag$3 ? _mapToArray : (tag == setTag$3 ? _setToArray : values_1);

  return func(value);
}

var toArray_1 = toArray;

/**
 * An alternative to `_.reduce`; this method transforms `object` to a new
 * `accumulator` object which is the result of running each of its own
 * enumerable string keyed properties thru `iteratee`, with each invocation
 * potentially mutating the `accumulator` object. If `accumulator` is not
 * provided, a new object with the same `[[Prototype]]` will be used. The
 * iteratee is invoked with four arguments: (accumulator, value, key, object).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @since 1.3.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [accumulator] The custom accumulator value.
 * @returns {*} Returns the accumulated value.
 * @example
 *
 * _.transform([2, 3, 4], function(result, n) {
 *   result.push(n *= n);
 *   return n % 2 == 0;
 * }, []);
 * // => [4, 9]
 *
 * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
 *   (result[value] || (result[value] = [])).push(key);
 * }, {});
 * // => { '1': ['a', 'c'], '2': ['b'] }
 */
function transform(object, iteratee, accumulator) {
  var isArr = isArray_1(object),
      isArrLike = isArr || isBuffer_1(object) || isTypedArray_1(object);

  iteratee = _baseIteratee(iteratee, 4);
  if (accumulator == null) {
    var Ctor = object && object.constructor;
    if (isArrLike) {
      accumulator = isArr ? new Ctor : [];
    }
    else if (isObject_1(object)) {
      accumulator = isFunction_1(Ctor) ? _baseCreate(_getPrototype(object)) : {};
    }
    else {
      accumulator = {};
    }
  }
  (isArrLike ? _arrayEach : _baseForOwn)(object, function(value, index, object) {
    return iteratee(accumulator, value, index, object);
  });
  return accumulator;
}

var transform_1 = transform;

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return _baseIsEqual(value, other);
}

var isEqual_1 = isEqual;

var createNestedObject = function createNestedObject(obj, keyPath, value) {
  var lastKeyIndex = keyPath.length - 1;

  for (var i = 0; i < lastKeyIndex; ++i) {
    var key = keyPath[i];

    if (!(key in obj)) {
      obj[key] = {};
    }

    obj = obj[key];
  }

  obj[keyPath[lastKeyIndex]] = value;
};

var multiFn = function multiFn(fns) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (fns) {
    if (Array.isArray(fns)) {
      fns.forEach(function (fn) {
        return fn.apply(void 0, args);
      });
    } else {
      return fns.apply(void 0, args);
    }
  }
};

var composeFn = function composeFn(fns) {
  return function () {
    return multiFn(fns);
  };
};

var mergeWithArrayCustomizer = function mergeWithArrayCustomizer(objValue, srcValue) {
  if (isArray_1(objValue)) {
    return objValue.concat(srcValue);
  }
};

var mergeWithArray = function mergeWithArray(object, source) {
  return mergeWith_1(object, source, mergeWithArrayCustomizer);
};

var mergeWithFnCustomizer = function mergeWithFnCustomizer(objValue, srcValue) {
  if (isFunction_1(objValue) && isFunction_1(srcValue)) {
    return function () {
      objValue.apply(void 0, arguments);
      srcValue.apply(void 0, arguments);
    };
  }
};

var mergeWithFn = function mergeWithFn(object, source) {
  return mergeWith_1(object, source, mergeWithFnCustomizer);
};

var objectToUrl = function objectToUrl(o) {
  var q = '';
  var i = 0;
  forEach_1(o, function (v, k) {
    q += (i === 0 ? '?' : '&') + k + '=' + v;
    i++;
  });
  return q;
};

var toPrice = function toPrice(n, currency) {
  return currency + '' + n.toFixed(2).replace(/./g, function (c, i, a) {
    return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? ',' + c : c;
  });
};

var capitalize = function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

var escapeICS = function escapeICS(s) {
  return s.replace(/,/g, '\\,').replace(/:/g, '\\:').replace(/;/g, '\\;');
};

var getPropertyByCaseInsensitiveKey = function getPropertyByCaseInsensitiveKey() {
  var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var k = findKey_1(o, function (v, p) {
    return p.toLowerCase() === n.toLowerCase();
  });
  return o[k];
};

var delayApi = function delayApi() {
  var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2000;
  return new Promise(function (resolve) {
    setTimeout(resolve, delay);
  });
};

var differenceDeep = function differenceDeep(object, base) {
  function changes(object, base) {
    return transform_1(object, function (result, value, key) {
      if (!isEqual_1(value, base[key])) {
        result[key] = isObject_1(value) && isObject_1(base[key]) ? changes(value, base[key]) : value;
      }
    });
  }

  return changes(object, base);
};

var divideByProps = function divideByProps(object, base) {
  var items = {};
  var rest = {};
  forEach_1(object, function (o, k) {
    if (!base.hasOwnProperty(k)) {
      items[k] = o;
    } else {
      rest[k] = o;
    }
  });
  return [items, rest];
};

function defaultsDeepPreserveArrays() {
  var output = {};
  toArray_1(arguments).reverse().forEach(function (item) {
    mergeWith_1(output, item, function (objectValue, sourceValue) {
      return isArray_1(sourceValue) ? sourceValue : undefined;
    });
  });
  return output;
}

function asyncForEach(_x, _x2) {
  return _asyncForEach.apply(this, arguments);
}

function _asyncForEach() {
  _asyncForEach = asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee(array, callback) {
    var index;
    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            index = 0;

          case 1:
            if (!(index < array.length)) {
              _context.next = 7;
              break;
            }

            _context.next = 4;
            return callback(array[index], index, array);

          case 4:
            index++;
            _context.next = 1;
            break;

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _asyncForEach.apply(this, arguments);
}

var so = function so(obj, dv) {
  return obj || dv || {};
};

var sa = function sa(arr, dv) {
  return arr || dv || [];
};

var ss = function ss(str, dv) {
  return str || dv || '';
};

var toSnakeCase = function toSnakeCase(s) {
  var upperChars = s.match(/([A-Z])/g);

  if (!upperChars) {
    return s;
  }

  var str = s.toString();

  for (var i = 0, n = upperChars.length; i < n; i++) {
    str = str.replace(new RegExp(upperChars[i]), '_' + upperChars[i].toLowerCase());
  }

  if (str.slice(0, 1) === '_') {
    str = str.slice(1);
  }

  str = str.replace('i_d', 'id');
  return str;
};

var withShared = function withShared(obj, pms) {
  if (!obj.shared) {
    obj.shared = {};
  }

  if (!obj.shared.params) {
    obj.shared.params = pms;
  }

  if (!obj.state) {
    obj.state = {};
  }

  return obj;
};

var createNestedObject_1 = createNestedObject;
var multiFn_1 = multiFn;
var composeFn_1 = composeFn;
var mergeWithArray_1 = mergeWithArray;
var mergeWithFn_1 = mergeWithFn;
var objectToUrl_1 = objectToUrl;
var toPrice_1 = toPrice;
var capitalize_1 = capitalize;
var escapeICS_1 = escapeICS;
var getPropertyByCaseInsensitiveKey_1 = getPropertyByCaseInsensitiveKey;
var delayApi_1 = delayApi;
var differenceDeep_1 = differenceDeep;
var defaultsDeepPreserveArrays_1 = defaultsDeepPreserveArrays;
var so_1 = so;
var sa_1 = sa;
var ss_1 = ss;
var toSnakeCase_1 = toSnakeCase;
var withShared_1 = withShared;
var asyncForEach_1 = asyncForEach;
var divideByProps_1 = divideByProps;
var helpers = {
  createNestedObject: createNestedObject_1,
  multiFn: multiFn_1,
  composeFn: composeFn_1,
  mergeWithArray: mergeWithArray_1,
  mergeWithFn: mergeWithFn_1,
  objectToUrl: objectToUrl_1,
  toPrice: toPrice_1,
  capitalize: capitalize_1,
  escapeICS: escapeICS_1,
  getPropertyByCaseInsensitiveKey: getPropertyByCaseInsensitiveKey_1,
  delayApi: delayApi_1,
  differenceDeep: differenceDeep_1,
  defaultsDeepPreserveArrays: defaultsDeepPreserveArrays_1,
  so: so_1,
  sa: sa_1,
  ss: ss_1,
  toSnakeCase: toSnakeCase_1,
  withShared: withShared_1,
  asyncForEach: asyncForEach_1,
  divideByProps: divideByProps_1
};

var defaultsDeepPreserveArrays$1 = helpers.defaultsDeepPreserveArrays,
    divideByProps$1 = helpers.divideByProps;
var defaultsDeep = lodash.defaultsDeep,
    forEach$1 = lodash.forEach,
    map = lodash.map,
    last = lodash.last,
    uniq = lodash.uniq,
    includes = lodash.includes,
    concat = lodash.concat,
    toArray$1 = lodash.toArray,
    mergeWith$1 = lodash.mergeWith,
    isFunction$2 = lodash.isFunction,
    isArray$2 = lodash.isArray; // ####### Defaults ##########

var CONSTS = {
  ACTION: {}
};
var state = {
  data: null,
  wait: false
};
var defaultParams = {
  key: null,
  render: null,
  async: false,
  // If true, component will be returned as a promise
  reducer: null,
  state: objectSpread({}, state),
  ejectComponent: false,
  // If true, component will return object with actions and elm
  CONSTS: objectSpread({}, CONSTS),
  shouldComponentUpdate: true,
  componentDidInit: null,
  componentWillInit: null,
  componentDidMount: null,
  componentWillMount: null,
  componentDidUpdate: null,
  componentDidUnmount: null,
  componentWillUpdate: null,
  componentWillUnmount: null,
  componentWillPrepatch: null,
  componentWillPostpatch: null,
  componentDidCreateViewObject: null,
  componentWillCreateViewObject: null // ######## Actions ###########

};

var actions = function actions(viewObject) {
  var items = divideByProps$1(viewObject.params, defaultParams)[0];

  var getState = function getState() {
    return viewObject.actions.state;
  };

  var setState = function setState() {
    var newState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var updateView = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    console.log('Setting new state...');
    var state = newState;
    var shouldComponentUpdate = true;

    if (isFunction$2(newState)) {
      state = newState(viewObject.actions.state);
    }

    viewObject.actions.state = defaultsDeepPreserveArrays$1(state, viewObject.actions.state);
    console.log('shouldComponentUpdate');

    if (isFunction$2(viewObject.actions.shouldComponentUpdate)) {
      shouldComponentUpdate = !!viewObject.actions.shouldComponentUpdate(viewObject.actions.state, viewObject.actions);
    } else {
      shouldComponentUpdate = !!viewObject.actions.shouldComponentUpdate;
    }

    if (shouldComponentUpdate) {
      if (updateView) {
        console.log('componentWillUpdate');

        if (viewObject.actions.componentWillUpdate) {
          if (isFunction$2(viewObject.actions.componentWillUpdate)) {
            viewObject.actions.componentWillUpdate(viewObject.actions.state, viewObject.actions, viewObject);
          }
        }

        viewObject.nodes.view = patch(viewObject.nodes.view, viewObject.component.getViewComponent(viewObject.actions.state));
        console.log('componentDidUpdate');

        if (viewObject.actions.componentDidUpdate) {
          if (isFunction$2(viewObject.actions.componentDidUpdate)) {
            viewObject.actions.componentDidUpdate(viewObject.actions.state, viewObject.actions);
          }
        }
      }
    }

    if (isFunction$2(callback)) {
      return callback(viewObject.actions.state, viewObject.actions);
    }

    return viewObject.actions.state;
  };

  var forceUpdate = function forceUpdate() {
    setState();
  };

  var remount = function remount() {
    viewObject.nodes.view = patch(viewObject.nodes.view, createComponent(viewObject.params));
  };

  var dispatch = function dispatch() {
    var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      type: null,
      payload: {}
    };

    if (viewObject.actions.reducer && isFunction$2(viewObject.actions.reducer)) {
      setState(function (prevState) {
        var nextAction = action;

        if (isFunction$2(nextAction)) {
          nextAction = nextAction(prevState);
        }

        return viewObject.actions.reducer(prevState, nextAction, viewObject.actions);
      });
    } else {
      console.error('Please provide reducer function to use this functionality!');
    }
  };

  var useHook = function useHook(hook) {
    var _divideByProps = divideByProps$1(hook, defaultParams),
        _divideByProps2 = slicedToArray(_divideByProps, 2),
        items = _divideByProps2[0],
        defs = _divideByProps2[1];

    forEach$1(defs, function (d, k) {
      if (!viewObject.hooks[k]) {
        viewObject.hooks[k] = [viewObject.actions[k]];
      }

      viewObject.hooks[k].push(d);
    });
    forEach$1(items, function (d, k) {
      if (!viewObject.hooks.items) {
        viewObject.hooks.items = {};
      }

      if (!viewObject.hooks.items[k]) {
        viewObject.hooks.items[k] = [viewObject.actions.items[k]];
      }

      viewObject.hooks.items[k].push(d);
    });
  };

  return objectSpread({
    items: items,
    useHook: useHook,
    remount: remount,
    dispatch: dispatch,
    getState: getState,
    setState: setState,
    forceUpdate: forceUpdate
  }, viewObject.params);
};

var componentFn = function componentFn(viewObject) {
  var getViewComponent = function getViewComponent(newState) {
    console.log('Getting view...');

    if (viewObject.actions.render && isFunction$2(viewObject.actions.render)) {
      var node = null; // try {

      node = viewObject.actions.render(newState, viewObject.actions); // } catch (error) {
      //   throw new Error(error)
      // }

      if (!node) {
        return h('div', "It's looks like you're render function does not return any value!");
      }

      return node;
    }

    return h('div', 'Nothing to render');
  };

  var getViewContext = function getViewContext() {
    console.log('Finding view context...');
    console.log('View context found: `render()` result');
    return getViewComponent(viewObject.actions.state);
  };

  var profileHook = function profileHook(hook) {
    var types = uniq(map(hook, function (h$$1) {
      var type = _typeof_1(h$$1);

      if (type !== 'object') {
        return type;
      }

      if (isArray$2(h$$1)) {
        return 'array';
      }
    }));

    if (includes(types, 'function')) {
      return 'function';
    }

    if (includes(types, 'string')) {
      return 'string';
    }

    if (includes(types, 'number')) {
      return 'number';
    }

    if (includes(types, 'boolean')) {
      return 'boolean';
    }

    if (includes(types, 'array')) {
      return 'array';
    }

    return 'object';
  };

  var createCallStactReducer = function createCallStactReducer(hook, name) {
    var profile = profileHook(hook);

    if (profile === 'string' || profile === 'number' || profile === 'boolean') {
      return last(hook);
    }

    if (profile === 'array') {
      return concat.apply(void 0, toConsumableArray(hook));
    }

    if (profile === 'object') {
      return defaultsDeepPreserveArrays$1.apply(void 0, toConsumableArray(hook));
    }

    if (profile === 'function') {
      return function () {
        var result = {};

        var _arguments = Array.prototype.slice.call(arguments),
            state = _arguments[0],
            component = _arguments[1],
            action = _arguments[2],
            rest = _arguments.slice(3);

        if (name === 'reducer') {
          var t = action;
          action = component;
          component = t;
        }

        forEach$1(hook, function (fn) {
          var cmpnt = objectSpread({}, component);

          if (result.hasOwnProperty(name)) {
            cmpnt[name] = function () {
              return result[name];
            };
          }

          if (name === 'reducer') {
            result[name] = isFunction$2(fn) ? fn.apply(void 0, [state, action, cmpnt].concat(toConsumableArray(rest))) : fn;
          } else {
            result[name] = isFunction$2(fn) ? fn.apply(void 0, [state, cmpnt, action].concat(toConsumableArray(rest))) : fn;
          }
        });
        return result[name];
      };
    }
  };

  var registerHooks = function registerHooks() {
    forEach$1(viewObject.hooks, function (hook, name) {
      if (name === 'items') {
        if (!viewObject.actions.items) {
          viewObject.actions.items = {};
        }

        forEach$1(hook, function (h$$1, n) {
          viewObject.actions.items[n] = createCallStactReducer(h$$1, n);
        });
      } else {
        viewObject.actions[name] = createCallStactReducer(hook, name);
      }
    });
  };

  return {
    getViewComponent: getViewComponent,
    getViewContext: getViewContext,
    registerHooks: registerHooks
  };
}; // ########### Composing View ###########


var createComponent = function createComponent() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultParams;
  defaultsDeep(params, defaultParams);
  params.state = isFunction$2(params.state) ? params.state(params) : params.state;

  if (params.componentWillCreateViewObject && isFunction$2(params.componentWillCreateViewObject)) {
    console.log('componentWillCreateViewObject');
    params.componentWillCreateViewObject(params.state);
  }

  var viewObject = {
    hooks: {},
    actions: null,
    params: params,
    component: null,
    nodes: {
      view: null
    }
  };
  viewObject.actions = actions(viewObject);
  viewObject.component = componentFn(viewObject);

  if (viewObject.actions.componentWillInit && isFunction$2(viewObject.actions.componentWillInit)) {
    console.log('componentWillInit');
    viewObject.actions.componentWillInit(viewObject.actions.state, viewObject.actions);
  }

  viewObject.component.registerHooks();
  viewObject.nodes.view = viewObject.component.getViewContext();
  viewObject.nodes.view.key = params.key;
  viewObject.nodes.view.data = objectSpread({}, viewObject.nodes.view.data, {
    hook: {
      init: function init() {
        console.log('init');

        if (viewObject.actions.componentDidInit && isFunction$2(viewObject.actions.componentDidInit)) {
          viewObject.actions.componentDidInit(viewObject.actions.state, viewObject.actions);
        }
      },
      create: function create() {
        console.log('componentWillMount');

        if (viewObject.actions.componentWillMount && isFunction$2(viewObject.actions.componentWillMount)) {
          viewObject.actions.componentWillMount(viewObject.actions.state, viewObject.actions);
        }
      },
      prepatch: function prepatch() {
        console.log('prepatch');

        if (viewObject.actions.componentWillPrepatch && isFunction$2(viewObject.actions.componentWillPrepatch)) {
          viewObject.actions.componentWillPrepatch(viewObject.actions.state, viewObject.actions);
        }
      },
      postpatch: function postpatch() {
        console.log('postpatch');

        if (viewObject.actions.componentWillPostpatch && isFunction$2(viewObject.actions.componentWillPostpatch)) {
          viewObject.actions.componentWillPostpatch(viewObject.actions.state, viewObject.actions);
        }
      },
      insert: function insert() {
        console.log('componentDidMount');

        if (viewObject.actions.componentDidMount && isFunction$2(viewObject.actions.componentDidMount)) {
          viewObject.actions.componentDidMount(viewObject.actions.state, viewObject.actions);
        }
      },
      destroy: function destroy() {
        console.log('componentWillUnmount');

        if (viewObject.actions.componentWillUnmount && isFunction$2(viewObject.actions.componentWillUnmount)) {
          viewObject.actions.componentWillUnmount(viewObject.actions.state, viewObject.actions);
        }
      },
      remove: function remove(vnode, removeCallback) {
        console.log('componentDidUnmount');

        if (viewObject.actions.componentDidUnmount && isFunction$2(viewObject.actions.componentDidUnmount)) {
          viewObject.actions.componentDidUnmount(viewObject.actions.state, viewObject.actions);
        }

        return removeCallback();
      }
    }
  });

  if (viewObject.actions.componentDidCreateViewObject && isFunction$2(viewObject.actions.componentDidCreateViewObject)) {
    console.log('componentDidCreateViewObject');
    viewObject.actions.componentDidCreateViewObject(viewObject.actions.state, viewObject.actions);
  }

  if (viewObject.actions.async) {
    if (viewObject.actions.ejectComponent) {
      return Promise.resolve(viewObject);
    }

    return Promise.resolve(viewObject.nodes.view);
  }

  if (viewObject.actions.ejectComponent) {
    return viewObject;
  }

  return viewObject.nodes.view;
}; // ######### Export ###########


var component = createComponent;

var defaultsDeepPreserveArrays$2 = helpers.defaultsDeepPreserveArrays,
    divideByProps$2 = helpers.divideByProps;
var defaultsDeep$1 = lodash.defaultsDeep,
    forEach$2 = lodash.forEach,
    map$1 = lodash.map,
    last$1 = lodash.last,
    uniq$1 = lodash.uniq,
    includes$1 = lodash.includes,
    concat$1 = lodash.concat,
    isFunction$3 = lodash.isFunction,
    isArray$3 = lodash.isArray; // ####### Defaults ##########

var CONSTS$1 = {
  ACTION: {}
};
var state$1 = {
  data: null,
  wait: false
};
var defaultParams$1 = {
  key: null,
  render: null,
  async: false,
  // If true, component will be returned as a promise
  reducer: null,
  spinner: false,
  state: objectSpread({}, state$1),
  delaySpinner: false,
  // If true, component spinner will appear with delay (for fast internet connection spinner will not be shown)
  ejectComponent: false,
  // If true, component will return object with actions and elm
  CONSTS: objectSpread({}, CONSTS$1),
  componentDidInit: null,
  componentWillInit: null,
  componentDidMount: null,
  componentWillMount: null,
  componentDidUpdate: null,
  componentDidUnmount: null,
  componentWillUpdate: null,
  componentWillUnmount: null,
  shouldComponentUpdate: true,
  componentWillPrepatch: null,
  componentWillPostpatch: null,
  componentWillUpdateVNode: null,
  componentDidCreateViewObject: null,
  componentWillCreateViewObject: null // ####### Component Helpers ##########

};

var loader = function loader() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var delaySpinner = params.delaySpinner;
  var s = delaySpinner ? {
    style: {
      WebkitAnimationDuration: '0.5s',
      WebkitAnimationFillMode: 'both',
      WebkitAnimationDelay: '0.3s',
      WebkitAnimationName: 'fadeIn',
      animationDuration: '0.5s',
      animationFillMode: 'both',
      animationDelay: '0.3s',
      animationName: 'fadeIn'
    }
  } : {};
  return h('div', objectSpread({
    style: {
      display: 'block',
      opacyty: '0',
      height: '32px',
      padding: '10px'
    },
    key: 'loader'
  }, s, params.loaderData), 'loading...');
}; // ######## Actions ###########


var actions$1 = function actions(viewObject) {
  var items = divideByProps$2(viewObject.params, defaultParams$1)[0];

  var getState = function getState() {
    return viewObject.actions.state;
  };

  var setState =
  /*#__PURE__*/
  function () {
    var _ref = asyncToGenerator(
    /*#__PURE__*/
    regenerator.mark(function _callee() {
      var newState,
          callback,
          updateView,
          state,
          shouldComponentUpdate,
          _args = arguments;
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              newState = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
              callback = _args.length > 1 && _args[1] !== undefined ? _args[1] : null;
              updateView = _args.length > 2 && _args[2] !== undefined ? _args[2] : true;
              console.log('Setting new state...');
              state = newState;
              shouldComponentUpdate = true;

              if (!isFunction$3(newState)) {
                _context.next = 10;
                break;
              }

              _context.next = 9;
              return newState(viewObject.actions.state);

            case 9:
              state = _context.sent;

            case 10:
              viewObject.actions.state = defaultsDeepPreserveArrays$2(state, viewObject.actions.state);
              console.log('shouldComponentUpdate');

              if (!isFunction$3(viewObject.actions.shouldComponentUpdate)) {
                _context.next = 18;
                break;
              }

              _context.next = 15;
              return !!viewObject.actions.shouldComponentUpdate(viewObject.actions.state, viewObject.actions);

            case 15:
              shouldComponentUpdate = _context.sent;
              _context.next = 19;
              break;

            case 18:
              shouldComponentUpdate = !!viewObject.actions.shouldComponentUpdate;

            case 19:
              if (!shouldComponentUpdate) {
                _context.next = 30;
                break;
              }

              if (!updateView) {
                _context.next = 30;
                break;
              }

              console.log('componentWillUpdate');

              if (!(viewObject.actions.componentWillUpdate && isFunction$3(viewObject.actions.componentWillUpdate))) {
                _context.next = 25;
                break;
              }

              _context.next = 25;
              return viewObject.actions.componentWillUpdate(viewObject.actions.state, viewObject.actions, viewObject);

            case 25:
              viewObject.nodes.view = patch(viewObject.nodes.view, viewObject.component.getViewComponent(viewObject.actions.state));
              console.log('componentDidUpdate');

              if (!(viewObject.actions.componentDidUpdate && isFunction$3(viewObject.actions.componentDidUpdate))) {
                _context.next = 30;
                break;
              }

              _context.next = 30;
              return viewObject.actions.componentDidUpdate(viewObject.actions.state, viewObject.actions);

            case 30:
              if (!isFunction$3(callback)) {
                _context.next = 32;
                break;
              }

              return _context.abrupt("return", callback(viewObject.actions.state, viewObject.actions));

            case 32:
              return _context.abrupt("return", viewObject.actions.state);

            case 33:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function setState() {
      return _ref.apply(this, arguments);
    };
  }();

  var forceUpdate = function forceUpdate() {
    setState();
  };

  var remount = function remount() {
    viewObject.nodes.view = patch(viewObject.nodes.view, createAsyncComponent(viewObject.params));
  };

  var dispatch = function dispatch() {
    var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      type: null,
      payload: {}
    };

    if (viewObject.actions.reducer && isFunction$3(viewObject.actions.reducer)) {
      setState(
      /*#__PURE__*/
      function () {
        var _ref2 = asyncToGenerator(
        /*#__PURE__*/
        regenerator.mark(function _callee2(prevState) {
          var nextAction, result;
          return regenerator.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  nextAction = action;

                  if (isFunction$3(nextAction)) {
                    nextAction = nextAction(prevState);
                  }

                  _context2.next = 4;
                  return viewObject.actions.reducer(prevState, nextAction, viewObject.actions);

                case 4:
                  result = _context2.sent;
                  return _context2.abrupt("return", result);

                case 6:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        return function (_x) {
          return _ref2.apply(this, arguments);
        };
      }());
    } else {
      console.error('Please provide reducer function to use this functionality!');
    }
  };

  var useHook = function useHook(hook) {
    var _divideByProps = divideByProps$2(hook, defaultParams$1),
        _divideByProps2 = slicedToArray(_divideByProps, 2),
        items = _divideByProps2[0],
        defs = _divideByProps2[1];

    forEach$2(defs, function (d, k) {
      if (!viewObject.hooks[k]) {
        viewObject.hooks[k] = [viewObject.actions[k]];
      }

      viewObject.hooks[k].push(d);
    });
    forEach$2(items, function (d, k) {
      if (!viewObject.hooks.items) {
        viewObject.hooks.items = {};
      }

      if (!viewObject.hooks.items[k]) {
        viewObject.hooks.items[k] = [viewObject.actions.items[k]];
      }

      viewObject.hooks.items[k].push(d);
    });
  };

  var getLoader = function getLoader() {
    return loader(viewObject.params);
  };

  return objectSpread({
    items: items,
    useHook: useHook,
    remount: remount,
    dispatch: dispatch,
    getState: getState,
    setState: setState,
    getLoader: getLoader,
    forceUpdate: forceUpdate
  }, viewObject.params);
};

var componentFn$1 = function componentFn(viewObject) {
  var getViewComponent = function getViewComponent(newState) {
    console.log('Getting view...');

    if (viewObject.actions.render && isFunction$3(viewObject.actions.render)) {
      var node = null; // try {

      node = viewObject.actions.render(newState, viewObject.actions); // } catch (error) {
      //   throw new Error(error)
      // }

      if (!node) {
        return h('div', "It's looks like you're render function does not return any value!");
      }

      return node;
    }

    return h('div', 'Nothing to render');
  };

  var getViewContext = function getViewContext() {
    console.log('Finding view context...');

    if (viewObject.actions.spinner) {
      console.log('View context found: Spinner');
      return loader(viewObject.actions);
    }

    console.log('View context found: `render()` result');
    return getViewComponent(viewObject.actions.state);
  };

  var profileHook = function profileHook(hook) {
    var types = uniq$1(map$1(hook, function (h$$1) {
      var type = _typeof_1(h$$1);

      if (type !== 'object') {
        return type;
      }

      if (isArray$3(h$$1)) {
        return 'array';
      }
    }));

    if (includes$1(types, 'function')) {
      return 'function';
    }

    if (includes$1(types, 'string')) {
      return 'string';
    }

    if (includes$1(types, 'number')) {
      return 'number';
    }

    if (includes$1(types, 'boolean')) {
      return 'boolean';
    }

    if (includes$1(types, 'array')) {
      return 'array';
    }

    return 'object';
  };

  var createCallStactReducer = function createCallStactReducer(hook, name) {
    var profile = profileHook(hook);

    if (profile === 'string' || profile === 'number' || profile === 'boolean') {
      return last$1(hook);
    }

    if (profile === 'array') {
      return concat$1.apply(void 0, toConsumableArray(hook));
    }

    if (profile === 'object') {
      return defaultsDeepPreserveArrays$2.apply(void 0, toConsumableArray(hook));
    }

    if (profile === 'function') {
      return function () {
        var result = {};

        var _arguments = Array.prototype.slice.call(arguments),
            state = _arguments[0],
            component = _arguments[1],
            action = _arguments[2],
            rest = _arguments.slice(3);

        if (name === 'reducer') {
          var t = action;
          action = component;
          component = t;
        }

        forEach$2(hook, function (fn) {
          var cmpnt = objectSpread({}, component);

          if (result.hasOwnProperty(name)) {
            cmpnt[name] = function () {
              return result[name];
            };
          }

          if (name === 'reducer') {
            result[name] = isFunction$3(fn) ? fn.apply(void 0, [state, action, cmpnt].concat(toConsumableArray(rest))) : fn;
          } else {
            result[name] = isFunction$3(fn) ? fn.apply(void 0, [state, cmpnt, action].concat(toConsumableArray(rest))) : fn;
          }
        });
        return result[name];
      };
    }
  };

  var registerHooks = function registerHooks() {
    forEach$2(viewObject.hooks, function (hook, name) {
      if (name === 'items') {
        if (!viewObject.actions.items) {
          viewObject.actions.items = {};
        }

        forEach$2(hook, function (h$$1, n) {
          viewObject.actions.items[n] = createCallStactReducer(h$$1, n);
        });
      } else {
        viewObject.actions[name] = createCallStactReducer(hook, name);
      }
    });
  };

  return {
    getViewComponent: getViewComponent,
    getViewContext: getViewContext,
    registerHooks: registerHooks
  };
}; // ########### Composing View ###########


var createAsyncComponent =
/*#__PURE__*/
function () {
  var _ref3 = asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee3() {
    var params,
        viewObject,
        _args3 = arguments;
    return regenerator.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            params = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : defaultParams$1;
            defaultsDeep$1(params, defaultParams$1);

            if (!isFunction$3(params.state)) {
              _context3.next = 6;
              break;
            }

            _context3.next = 5;
            return params.state(params);

          case 5:
            params.state = _context3.sent;

          case 6:
            if (params.componentWillCreateViewObject && isFunction$3(params.componentWillCreateViewObject)) {
              console.log('componentWillCreateViewObject');
              params.componentWillCreateViewObject(params.state);
            }

            viewObject = {
              hooks: {},
              actions: null,
              params: params,
              component: null,
              nodes: {
                view: null
              }
            };
            viewObject.actions = actions$1(viewObject);
            viewObject.component = componentFn$1(viewObject);

            if (viewObject.actions.componentWillInit && isFunction$3(viewObject.actions.componentWillInit)) {
              console.log('componentWillInit');
              viewObject.actions.componentWillInit(viewObject.actions.state, viewObject.actions);
            }

            viewObject.component.registerHooks();
            viewObject.nodes.view = viewObject.component.getViewContext();
            viewObject.nodes.view.key = params.key;
            viewObject.nodes.view.data = objectSpread({}, viewObject.nodes.view.data, {
              hook: {
                init: function init() {
                  console.log('init');

                  if (viewObject.actions.componentDidInit && isFunction$3(viewObject.actions.componentDidInit)) {
                    viewObject.actions.componentDidInit(viewObject.actions.state, viewObject.actions);
                  }
                },
                create: function create() {
                  console.log('componentWillMount');

                  if (viewObject.actions.componentWillMount && isFunction$3(viewObject.actions.componentWillMount)) {
                    viewObject.actions.componentWillMount(viewObject.actions.state, viewObject.actions);
                  }
                },
                prepatch: function prepatch() {
                  console.log('prepatch');

                  if (viewObject.actions.componentWillPrepatch && isFunction$3(viewObject.actions.componentWillPrepatch)) {
                    viewObject.actions.componentWillPrepatch(viewObject.actions.state, viewObject.actions);
                  }
                },
                // update: () => {
                //   console.log('update')
                //   if (viewObject.actions.componentWillUpdateVNode && isFunction(viewObject.actions.componentWillUpdateVNode)) {
                //     viewObject.actions.componentWillUpdateVNode(viewObject.actions.state, viewObject.actions)
                //   }
                // },
                postpatch: function postpatch() {
                  console.log('postpatch');

                  if (viewObject.actions.componentWillPostpatch && isFunction$3(viewObject.actions.componentWillPostpatch)) {
                    viewObject.actions.componentWillPostpatch(viewObject.actions.state, viewObject.actions);
                  }
                },
                insert: function insert() {
                  console.log('componentDidMount');

                  if (viewObject.actions.componentDidMount && isFunction$3(viewObject.actions.componentDidMount)) {
                    viewObject.actions.componentDidMount(viewObject.actions.state, viewObject.actions);
                  }
                },
                destroy: function destroy() {
                  console.log('componentWillUnmount');

                  if (viewObject.actions.componentWillUnmount && isFunction$3(viewObject.actions.componentWillUnmount)) {
                    viewObject.actions.componentWillUnmount(viewObject.actions.state, viewObject.actions);
                  }
                },
                remove: function remove(vnode, removeCallback) {
                  console.log('componentDidUnmount');

                  if (viewObject.actions.componentDidUnmount && isFunction$3(viewObject.actions.componentDidUnmount)) {
                    viewObject.actions.componentDidUnmount(viewObject.actions.state, viewObject.actions);
                  }

                  return removeCallback();
                }
              }
            });

            if (viewObject.actions.componentDidCreateViewObject && isFunction$3(viewObject.actions.componentDidCreateViewObject)) {
              console.log('componentDidCreateViewObject');
              viewObject.actions.componentDidCreateViewObject(viewObject.actions.state, viewObject.actions);
            }

            if (!viewObject.actions.async) {
              _context3.next = 20;
              break;
            }

            if (!viewObject.actions.ejectComponent) {
              _context3.next = 19;
              break;
            }

            return _context3.abrupt("return", Promise.resolve(viewObject));

          case 19:
            return _context3.abrupt("return", Promise.resolve(viewObject.nodes.view));

          case 20:
            if (!viewObject.actions.ejectComponent) {
              _context3.next = 22;
              break;
            }

            return _context3.abrupt("return", viewObject);

          case 22:
            return _context3.abrupt("return", viewObject.nodes.view);

          case 23:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function createAsyncComponent() {
    return _ref3.apply(this, arguments);
  };
}(); // ######### Export ###########


var componentAsync = lazy_1(createAsyncComponent, loader);

function toProperty(name) {
  if (name.charAt(0) === '-') name = name.slice(0);
  return name.replace(/[^a-z0-9]([a-z0-9])?/gi, function (v, l) {
    if (l) return l.toUpperCase();
    return '';
  });
}

function tokenizer(code) {
  var whitespc = ['\r\n', '\n\r', '\n', '\r'];
  var specialChars = ['{', '}', ':', ';'];
  var specialCharsPB = ['{', '}', ';'];
  var tokens = [];
  var token = '';
  var lastChar = '\0';
  var nextChar = '\0';
  var char = '\0';
  var sc = null;
  var inBrackets = false;

  for (var i = 0; i < code.length; i++) {
    if (i) lastChar = code.charAt(i - 1);
    char = code.charAt(i);
    if (i + 1 < code.length) nextChar = code.charAt(i + 1);

    if (~whitespc.indexOf(char) && ~whitespc.indexOf(lastChar)) {
      continue;
    }

    sc = inBrackets ? specialChars : specialCharsPB;

    if (~sc.indexOf(char)) {
      if (char === '{') inBrackets = true;
      if (char === '}') inBrackets = false;
      tokens.push(token);
      tokens.push(char);
      token = '';
      continue;
    }

    token += char;
  }

  if (token) tokens.push(token);
  var result = tokens.map(function (token) {
    return token.trim();
  }).filter(function (token) {
    return token && token !== ';';
  });
  return result;
}

var cssToJS = function cssToJS(code) {
  var tokens = tokenizer(code);
  var props = {};
  tokens.forEach(function (token) {
    var _token$split = token.split(':'),
        _token$split2 = slicedToArray(_token$split, 2),
        prop = _token$split2[0],
        value = _token$split2[1];

    prop = props ? prop.trim() : '';
    value = value ? value.trim() : '';
    props[toProperty(prop)] = value;
  });
  return props;
};

/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike_1(collection) ? Array(collection.length) : [];

  _baseEach(collection, function(value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

var _baseMap = baseMap;

/**
 * Creates an array of values by running each element in `collection` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
 *
 * The guarded methods are:
 * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
 * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
 * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
 * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * _.map([4, 8], square);
 * // => [16, 64]
 *
 * _.map({ 'a': 4, 'b': 8 }, square);
 * // => [16, 64] (iteration order is not guaranteed)
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, 'user');
 * // => ['barney', 'fred']
 */
function map$2(collection, iteratee) {
  var func = isArray_1(collection) ? _arrayMap : _baseMap;
  return func(collection, _baseIteratee(iteratee, 3));
}

var map_1 = map$2;

/** Used for built-in method references. */
var objectProto$f = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$c = objectProto$f.hasOwnProperty;

/**
 * The base implementation of `_.has` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHas(object, key) {
  return object != null && hasOwnProperty$c.call(object, key);
}

var _baseHas = baseHas;

/**
 * Checks if `path` is a direct property of `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = { 'a': { 'b': 2 } };
 * var other = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.has(object, 'a');
 * // => true
 *
 * _.has(object, 'a.b');
 * // => true
 *
 * _.has(object, ['a', 'b']);
 * // => true
 *
 * _.has(other, 'a');
 * // => false
 */
function has(object, path) {
  return object != null && _hasPath(object, path, _baseHas);
}

var has_1 = has;

var toVNode = function toVNode(textOrVNode) {
  if (_typeof_1(textOrVNode) === 'object') return textOrVNode;else {
    return {
      children: undefined,
      data: undefined,
      elm: undefined,
      key: undefined,
      sel: undefined,
      text: textOrVNode
    };
  }
};

var isVNode = function isVNode(vnode) {
  if (isObject_1(vnode) && has_1(vnode, 'children') && has_1(vnode, 'data') && has_1(vnode, 'elm') && has_1(vnode, 'key') && has_1(vnode, 'sel') && has_1(vnode, 'text')) {
    return true;
  }

  return false;
};

var trustHTML = function trustHTML(RawHTML) {
  var AddHTML = function AddHTML(vnode) {
    return vnode.elm.innerHTML = RawHTML;
  };

  var hook = {
    insert: AddHTML,
    update: AddHTML
  };
  return h('div', {
    hook: hook
  });
};

var JsonToVNode = function JsonToVNode(json, context) {
  if (isString_1(json)) {
    json = JSON.parse(json);
  }

  var children;

  if (isArray_1(json['children'])) {
    children = map_1(json['children'], function (c) {
      return JsonToVNode(c, context);
    });
  } else if (isObject_1(json['children'])) {
    children = [JsonToVNode(json['children'], context)];
  } else if (isString_1(json['children']) && json['children'].match(/{{\s*[\w\.]+\s*}}/g)) {
    var ctx = get_1(context, json['children'].match(/[\w\.]+/)[0]);

    if (isString_1(ctx)) {
      json['children'] = ctx;
    } else if (isArray_1(ctx)) {
      children = ctx;
    } else if (isObject_1(ctx)) {
      children = [ctx];
    }
  }

  return {
    children: children,
    data: {
      style: json['style'],
      class: json['class'],
      attrs: json['attrs'],
      props: json['props']
    },
    elm: undefined,
    key: json['key'],
    sel: json['tag'],
    text: isString_1(json['children']) ? json['children'] : undefined
  };
};

var toVNode_1 = toVNode;
var isVNode_1 = isVNode;
var trustHTML_1 = trustHTML;
var JsonToVNode_1 = JsonToVNode;
var vDomHelpers = {
  toVNode: toVNode_1,
  isVNode: isVNode_1,
  trustHTML: trustHTML_1,
  JsonToVNode: JsonToVNode_1
};

var forEach$3 = lodash.forEach,
    isArray$4 = lodash.isArray,
    isString$2 = lodash.isString,
    has$1 = lodash.has;
var mergeWithFn$1 = helpers.mergeWithFn,
    ss$1 = helpers.ss;
var isVNode$1 = vDomHelpers.isVNode; // ####### Helpers ##########

var getVNode = function getVNode() {
  var sel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'div';
  var literals = arguments.length > 1 ? arguments[1] : undefined;

  for (var _len = arguments.length, expressions = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    expressions[_key - 2] = arguments[_key];
  }

  return function () {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var children = arguments.length > 1 ? arguments[1] : undefined;
    var style = cssWithProps(data.styled).apply(void 0, [literals].concat(expressions));
    var defprops = {
      style: style,
      styledProps: {
        css: cssWithPropsPlain(data.styled).apply(void 0, [literals].concat(expressions))
      }
    };

    if (!children && (isVNode$1(data) || isArray$4(data) || isString$2(data))) {
      return h(sel, defprops, data);
    }

    return h(sel, mergeWithFn$1(defprops, data), children);
  };
};

var execFuncArgs = function execFuncArgs(arg, props) {
  if (typeof arg === 'function') {
    if (getVNode().toString() === arg.toString()) {
      var vnode = arg();

      if (has$1(vnode, 'data.styledProps.css')) {
        return vnode.data.styledProps.css;
      }

      throw new Error('Cannot get property data.styledProps.css of given Vnode. Are you sure you passed styled component?');
    }

    if (props) {
      return ss$1(arg(props));
    }

    return ss$1(arg());
  }

  return arg;
};

var css = function css(literals) {
  for (var _len2 = arguments.length, expressions = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    expressions[_key2 - 1] = arguments[_key2];
  }

  var styles = "";
  forEach$3(literals, function (literal, i) {
    if (expressions[i]) {
      styles += "".concat(literal).concat(execFuncArgs(expressions[i]));
    } else {
      styles += literal;
    }
  });
  return cssToJS(styles);
};

var cssWithPropsPlain = function cssWithPropsPlain(props) {
  return function (literals) {
    for (var _len3 = arguments.length, expressions = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      expressions[_key3 - 1] = arguments[_key3];
    }

    var styles = "";
    forEach$3(literals, function (literal, i) {
      if (expressions[i]) {
        styles += "".concat(literal).concat(execFuncArgs(expressions[i], props || {}));
      } else {
        styles += literal;
      }
    });
    return styles;
  };
};

var cssWithProps = function cssWithProps(props) {
  return function (literals) {
    for (var _len4 = arguments.length, expressions = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      expressions[_key4 - 1] = arguments[_key4];
    }

    return cssToJS(cssWithPropsPlain(props).apply(void 0, [literals].concat(expressions)));
  };
};

var selector = function selector() {
  var sel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'div';
  var literals = arguments.length > 1 ? arguments[1] : undefined;

  for (var _len5 = arguments.length, expressions = new Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
    expressions[_key5 - 2] = arguments[_key5];
  }

  return getVNode.apply(void 0, [sel, literals].concat(expressions));
}; // ########### Composing export ###########


var styled = {
  a: function a(literals) {
    for (var _len6 = arguments.length, expressions = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
      expressions[_key6 - 1] = arguments[_key6];
    }

    return selector.apply(void 0, ['a', literals].concat(expressions));
  },
  abbr: function abbr(literals) {
    for (var _len7 = arguments.length, expressions = new Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
      expressions[_key7 - 1] = arguments[_key7];
    }

    return selector.apply(void 0, ['abbr', literals].concat(expressions));
  },
  address: function address(literals) {
    for (var _len8 = arguments.length, expressions = new Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
      expressions[_key8 - 1] = arguments[_key8];
    }

    return selector.apply(void 0, ['address', literals].concat(expressions));
  },
  area: function area(literals) {
    for (var _len9 = arguments.length, expressions = new Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) {
      expressions[_key9 - 1] = arguments[_key9];
    }

    return selector.apply(void 0, ['area', literals].concat(expressions));
  },
  article: function article(literals) {
    for (var _len10 = arguments.length, expressions = new Array(_len10 > 1 ? _len10 - 1 : 0), _key10 = 1; _key10 < _len10; _key10++) {
      expressions[_key10 - 1] = arguments[_key10];
    }

    return selector.apply(void 0, ['article', literals].concat(expressions));
  },
  aside: function aside(literals) {
    for (var _len11 = arguments.length, expressions = new Array(_len11 > 1 ? _len11 - 1 : 0), _key11 = 1; _key11 < _len11; _key11++) {
      expressions[_key11 - 1] = arguments[_key11];
    }

    return selector.apply(void 0, ['aside', literals].concat(expressions));
  },
  audio: function audio(literals) {
    for (var _len12 = arguments.length, expressions = new Array(_len12 > 1 ? _len12 - 1 : 0), _key12 = 1; _key12 < _len12; _key12++) {
      expressions[_key12 - 1] = arguments[_key12];
    }

    return selector.apply(void 0, ['audio', literals].concat(expressions));
  },
  b: function b(literals) {
    for (var _len13 = arguments.length, expressions = new Array(_len13 > 1 ? _len13 - 1 : 0), _key13 = 1; _key13 < _len13; _key13++) {
      expressions[_key13 - 1] = arguments[_key13];
    }

    return selector.apply(void 0, ['b', literals].concat(expressions));
  },
  base: function base(literals) {
    for (var _len14 = arguments.length, expressions = new Array(_len14 > 1 ? _len14 - 1 : 0), _key14 = 1; _key14 < _len14; _key14++) {
      expressions[_key14 - 1] = arguments[_key14];
    }

    return selector.apply(void 0, ['base', literals].concat(expressions));
  },
  bdi: function bdi(literals) {
    for (var _len15 = arguments.length, expressions = new Array(_len15 > 1 ? _len15 - 1 : 0), _key15 = 1; _key15 < _len15; _key15++) {
      expressions[_key15 - 1] = arguments[_key15];
    }

    return selector.apply(void 0, ['bdi', literals].concat(expressions));
  },
  bdo: function bdo(literals) {
    for (var _len16 = arguments.length, expressions = new Array(_len16 > 1 ? _len16 - 1 : 0), _key16 = 1; _key16 < _len16; _key16++) {
      expressions[_key16 - 1] = arguments[_key16];
    }

    return selector.apply(void 0, ['bdo', literals].concat(expressions));
  },
  big: function big(literals) {
    for (var _len17 = arguments.length, expressions = new Array(_len17 > 1 ? _len17 - 1 : 0), _key17 = 1; _key17 < _len17; _key17++) {
      expressions[_key17 - 1] = arguments[_key17];
    }

    return selector.apply(void 0, ['big', literals].concat(expressions));
  },
  blockquote: function blockquote(literals) {
    for (var _len18 = arguments.length, expressions = new Array(_len18 > 1 ? _len18 - 1 : 0), _key18 = 1; _key18 < _len18; _key18++) {
      expressions[_key18 - 1] = arguments[_key18];
    }

    return selector.apply(void 0, ['blockquote', literals].concat(expressions));
  },
  body: function body(literals) {
    for (var _len19 = arguments.length, expressions = new Array(_len19 > 1 ? _len19 - 1 : 0), _key19 = 1; _key19 < _len19; _key19++) {
      expressions[_key19 - 1] = arguments[_key19];
    }

    return selector.apply(void 0, ['body', literals].concat(expressions));
  },
  br: function br(literals) {
    for (var _len20 = arguments.length, expressions = new Array(_len20 > 1 ? _len20 - 1 : 0), _key20 = 1; _key20 < _len20; _key20++) {
      expressions[_key20 - 1] = arguments[_key20];
    }

    return selector.apply(void 0, ['br', literals].concat(expressions));
  },
  button: function button(literals) {
    for (var _len21 = arguments.length, expressions = new Array(_len21 > 1 ? _len21 - 1 : 0), _key21 = 1; _key21 < _len21; _key21++) {
      expressions[_key21 - 1] = arguments[_key21];
    }

    return selector.apply(void 0, ['button', literals].concat(expressions));
  },
  canvas: function canvas(literals) {
    for (var _len22 = arguments.length, expressions = new Array(_len22 > 1 ? _len22 - 1 : 0), _key22 = 1; _key22 < _len22; _key22++) {
      expressions[_key22 - 1] = arguments[_key22];
    }

    return selector.apply(void 0, ['canvas', literals].concat(expressions));
  },
  caption: function caption(literals) {
    for (var _len23 = arguments.length, expressions = new Array(_len23 > 1 ? _len23 - 1 : 0), _key23 = 1; _key23 < _len23; _key23++) {
      expressions[_key23 - 1] = arguments[_key23];
    }

    return selector.apply(void 0, ['caption', literals].concat(expressions));
  },
  cite: function cite(literals) {
    for (var _len24 = arguments.length, expressions = new Array(_len24 > 1 ? _len24 - 1 : 0), _key24 = 1; _key24 < _len24; _key24++) {
      expressions[_key24 - 1] = arguments[_key24];
    }

    return selector.apply(void 0, ['cite', literals].concat(expressions));
  },
  code: function code(literals) {
    for (var _len25 = arguments.length, expressions = new Array(_len25 > 1 ? _len25 - 1 : 0), _key25 = 1; _key25 < _len25; _key25++) {
      expressions[_key25 - 1] = arguments[_key25];
    }

    return selector.apply(void 0, ['code', literals].concat(expressions));
  },
  col: function col(literals) {
    for (var _len26 = arguments.length, expressions = new Array(_len26 > 1 ? _len26 - 1 : 0), _key26 = 1; _key26 < _len26; _key26++) {
      expressions[_key26 - 1] = arguments[_key26];
    }

    return selector.apply(void 0, ['col', literals].concat(expressions));
  },
  colgroup: function colgroup(literals) {
    for (var _len27 = arguments.length, expressions = new Array(_len27 > 1 ? _len27 - 1 : 0), _key27 = 1; _key27 < _len27; _key27++) {
      expressions[_key27 - 1] = arguments[_key27];
    }

    return selector.apply(void 0, ['colgroup', literals].concat(expressions));
  },
  data: function data(literals) {
    for (var _len28 = arguments.length, expressions = new Array(_len28 > 1 ? _len28 - 1 : 0), _key28 = 1; _key28 < _len28; _key28++) {
      expressions[_key28 - 1] = arguments[_key28];
    }

    return selector.apply(void 0, ['data', literals].concat(expressions));
  },
  datalist: function datalist(literals) {
    for (var _len29 = arguments.length, expressions = new Array(_len29 > 1 ? _len29 - 1 : 0), _key29 = 1; _key29 < _len29; _key29++) {
      expressions[_key29 - 1] = arguments[_key29];
    }

    return selector.apply(void 0, ['datalist', literals].concat(expressions));
  },
  dd: function dd(literals) {
    for (var _len30 = arguments.length, expressions = new Array(_len30 > 1 ? _len30 - 1 : 0), _key30 = 1; _key30 < _len30; _key30++) {
      expressions[_key30 - 1] = arguments[_key30];
    }

    return selector.apply(void 0, ['dd', literals].concat(expressions));
  },
  del: function del(literals) {
    for (var _len31 = arguments.length, expressions = new Array(_len31 > 1 ? _len31 - 1 : 0), _key31 = 1; _key31 < _len31; _key31++) {
      expressions[_key31 - 1] = arguments[_key31];
    }

    return selector.apply(void 0, ['del', literals].concat(expressions));
  },
  details: function details(literals) {
    for (var _len32 = arguments.length, expressions = new Array(_len32 > 1 ? _len32 - 1 : 0), _key32 = 1; _key32 < _len32; _key32++) {
      expressions[_key32 - 1] = arguments[_key32];
    }

    return selector.apply(void 0, ['details', literals].concat(expressions));
  },
  dfn: function dfn(literals) {
    for (var _len33 = arguments.length, expressions = new Array(_len33 > 1 ? _len33 - 1 : 0), _key33 = 1; _key33 < _len33; _key33++) {
      expressions[_key33 - 1] = arguments[_key33];
    }

    return selector.apply(void 0, ['dfn', literals].concat(expressions));
  },
  dialog: function dialog(literals) {
    for (var _len34 = arguments.length, expressions = new Array(_len34 > 1 ? _len34 - 1 : 0), _key34 = 1; _key34 < _len34; _key34++) {
      expressions[_key34 - 1] = arguments[_key34];
    }

    return selector.apply(void 0, ['dialog', literals].concat(expressions));
  },
  div: function div(literals) {
    for (var _len35 = arguments.length, expressions = new Array(_len35 > 1 ? _len35 - 1 : 0), _key35 = 1; _key35 < _len35; _key35++) {
      expressions[_key35 - 1] = arguments[_key35];
    }

    return selector.apply(void 0, ['div', literals].concat(expressions));
  },
  dl: function dl(literals) {
    for (var _len36 = arguments.length, expressions = new Array(_len36 > 1 ? _len36 - 1 : 0), _key36 = 1; _key36 < _len36; _key36++) {
      expressions[_key36 - 1] = arguments[_key36];
    }

    return selector.apply(void 0, ['dl', literals].concat(expressions));
  },
  dt: function dt(literals) {
    for (var _len37 = arguments.length, expressions = new Array(_len37 > 1 ? _len37 - 1 : 0), _key37 = 1; _key37 < _len37; _key37++) {
      expressions[_key37 - 1] = arguments[_key37];
    }

    return selector.apply(void 0, ['dt', literals].concat(expressions));
  },
  em: function em(literals) {
    for (var _len38 = arguments.length, expressions = new Array(_len38 > 1 ? _len38 - 1 : 0), _key38 = 1; _key38 < _len38; _key38++) {
      expressions[_key38 - 1] = arguments[_key38];
    }

    return selector.apply(void 0, ['em', literals].concat(expressions));
  },
  embed: function embed(literals) {
    for (var _len39 = arguments.length, expressions = new Array(_len39 > 1 ? _len39 - 1 : 0), _key39 = 1; _key39 < _len39; _key39++) {
      expressions[_key39 - 1] = arguments[_key39];
    }

    return selector.apply(void 0, ['embed', literals].concat(expressions));
  },
  fieldset: function fieldset(literals) {
    for (var _len40 = arguments.length, expressions = new Array(_len40 > 1 ? _len40 - 1 : 0), _key40 = 1; _key40 < _len40; _key40++) {
      expressions[_key40 - 1] = arguments[_key40];
    }

    return selector.apply(void 0, ['fieldset', literals].concat(expressions));
  },
  figcaption: function figcaption(literals) {
    for (var _len41 = arguments.length, expressions = new Array(_len41 > 1 ? _len41 - 1 : 0), _key41 = 1; _key41 < _len41; _key41++) {
      expressions[_key41 - 1] = arguments[_key41];
    }

    return selector.apply(void 0, ['figcaption', literals].concat(expressions));
  },
  figure: function figure(literals) {
    for (var _len42 = arguments.length, expressions = new Array(_len42 > 1 ? _len42 - 1 : 0), _key42 = 1; _key42 < _len42; _key42++) {
      expressions[_key42 - 1] = arguments[_key42];
    }

    return selector.apply(void 0, ['figure', literals].concat(expressions));
  },
  footer: function footer(literals) {
    for (var _len43 = arguments.length, expressions = new Array(_len43 > 1 ? _len43 - 1 : 0), _key43 = 1; _key43 < _len43; _key43++) {
      expressions[_key43 - 1] = arguments[_key43];
    }

    return selector.apply(void 0, ['footer', literals].concat(expressions));
  },
  form: function form(literals) {
    for (var _len44 = arguments.length, expressions = new Array(_len44 > 1 ? _len44 - 1 : 0), _key44 = 1; _key44 < _len44; _key44++) {
      expressions[_key44 - 1] = arguments[_key44];
    }

    return selector.apply(void 0, ['form', literals].concat(expressions));
  },
  h1: function h1(literals) {
    for (var _len45 = arguments.length, expressions = new Array(_len45 > 1 ? _len45 - 1 : 0), _key45 = 1; _key45 < _len45; _key45++) {
      expressions[_key45 - 1] = arguments[_key45];
    }

    return selector.apply(void 0, ['h1', literals].concat(expressions));
  },
  h2: function h2(literals) {
    for (var _len46 = arguments.length, expressions = new Array(_len46 > 1 ? _len46 - 1 : 0), _key46 = 1; _key46 < _len46; _key46++) {
      expressions[_key46 - 1] = arguments[_key46];
    }

    return selector.apply(void 0, ['h2', literals].concat(expressions));
  },
  h3: function h3(literals) {
    for (var _len47 = arguments.length, expressions = new Array(_len47 > 1 ? _len47 - 1 : 0), _key47 = 1; _key47 < _len47; _key47++) {
      expressions[_key47 - 1] = arguments[_key47];
    }

    return selector.apply(void 0, ['h3', literals].concat(expressions));
  },
  h4: function h4(literals) {
    for (var _len48 = arguments.length, expressions = new Array(_len48 > 1 ? _len48 - 1 : 0), _key48 = 1; _key48 < _len48; _key48++) {
      expressions[_key48 - 1] = arguments[_key48];
    }

    return selector.apply(void 0, ['h4', literals].concat(expressions));
  },
  h5: function h5(literals) {
    for (var _len49 = arguments.length, expressions = new Array(_len49 > 1 ? _len49 - 1 : 0), _key49 = 1; _key49 < _len49; _key49++) {
      expressions[_key49 - 1] = arguments[_key49];
    }

    return selector.apply(void 0, ['h5', literals].concat(expressions));
  },
  h6: function h6(literals) {
    for (var _len50 = arguments.length, expressions = new Array(_len50 > 1 ? _len50 - 1 : 0), _key50 = 1; _key50 < _len50; _key50++) {
      expressions[_key50 - 1] = arguments[_key50];
    }

    return selector.apply(void 0, ['h6', literals].concat(expressions));
  },
  head: function head(literals) {
    for (var _len51 = arguments.length, expressions = new Array(_len51 > 1 ? _len51 - 1 : 0), _key51 = 1; _key51 < _len51; _key51++) {
      expressions[_key51 - 1] = arguments[_key51];
    }

    return selector.apply(void 0, ['head', literals].concat(expressions));
  },
  header: function header(literals) {
    for (var _len52 = arguments.length, expressions = new Array(_len52 > 1 ? _len52 - 1 : 0), _key52 = 1; _key52 < _len52; _key52++) {
      expressions[_key52 - 1] = arguments[_key52];
    }

    return selector.apply(void 0, ['header', literals].concat(expressions));
  },
  hgroup: function hgroup(literals) {
    for (var _len53 = arguments.length, expressions = new Array(_len53 > 1 ? _len53 - 1 : 0), _key53 = 1; _key53 < _len53; _key53++) {
      expressions[_key53 - 1] = arguments[_key53];
    }

    return selector.apply(void 0, ['hgroup', literals].concat(expressions));
  },
  hr: function hr(literals) {
    for (var _len54 = arguments.length, expressions = new Array(_len54 > 1 ? _len54 - 1 : 0), _key54 = 1; _key54 < _len54; _key54++) {
      expressions[_key54 - 1] = arguments[_key54];
    }

    return selector.apply(void 0, ['hr', literals].concat(expressions));
  },
  html: function html(literals) {
    for (var _len55 = arguments.length, expressions = new Array(_len55 > 1 ? _len55 - 1 : 0), _key55 = 1; _key55 < _len55; _key55++) {
      expressions[_key55 - 1] = arguments[_key55];
    }

    return selector.apply(void 0, ['html', literals].concat(expressions));
  },
  i: function i(literals) {
    for (var _len56 = arguments.length, expressions = new Array(_len56 > 1 ? _len56 - 1 : 0), _key56 = 1; _key56 < _len56; _key56++) {
      expressions[_key56 - 1] = arguments[_key56];
    }

    return selector.apply(void 0, ['i', literals].concat(expressions));
  },
  iframe: function iframe(literals) {
    for (var _len57 = arguments.length, expressions = new Array(_len57 > 1 ? _len57 - 1 : 0), _key57 = 1; _key57 < _len57; _key57++) {
      expressions[_key57 - 1] = arguments[_key57];
    }

    return selector.apply(void 0, ['iframe', literals].concat(expressions));
  },
  img: function img(literals) {
    for (var _len58 = arguments.length, expressions = new Array(_len58 > 1 ? _len58 - 1 : 0), _key58 = 1; _key58 < _len58; _key58++) {
      expressions[_key58 - 1] = arguments[_key58];
    }

    return selector.apply(void 0, ['img', literals].concat(expressions));
  },
  input: function input(literals) {
    for (var _len59 = arguments.length, expressions = new Array(_len59 > 1 ? _len59 - 1 : 0), _key59 = 1; _key59 < _len59; _key59++) {
      expressions[_key59 - 1] = arguments[_key59];
    }

    return selector.apply(void 0, ['input', literals].concat(expressions));
  },
  ins: function ins(literals) {
    for (var _len60 = arguments.length, expressions = new Array(_len60 > 1 ? _len60 - 1 : 0), _key60 = 1; _key60 < _len60; _key60++) {
      expressions[_key60 - 1] = arguments[_key60];
    }

    return selector.apply(void 0, ['ins', literals].concat(expressions));
  },
  kbd: function kbd(literals) {
    for (var _len61 = arguments.length, expressions = new Array(_len61 > 1 ? _len61 - 1 : 0), _key61 = 1; _key61 < _len61; _key61++) {
      expressions[_key61 - 1] = arguments[_key61];
    }

    return selector.apply(void 0, ['kbd', literals].concat(expressions));
  },
  keygen: function keygen(literals) {
    for (var _len62 = arguments.length, expressions = new Array(_len62 > 1 ? _len62 - 1 : 0), _key62 = 1; _key62 < _len62; _key62++) {
      expressions[_key62 - 1] = arguments[_key62];
    }

    return selector.apply(void 0, ['keygen', literals].concat(expressions));
  },
  label: function label(literals) {
    for (var _len63 = arguments.length, expressions = new Array(_len63 > 1 ? _len63 - 1 : 0), _key63 = 1; _key63 < _len63; _key63++) {
      expressions[_key63 - 1] = arguments[_key63];
    }

    return selector.apply(void 0, ['label', literals].concat(expressions));
  },
  legend: function legend(literals) {
    for (var _len64 = arguments.length, expressions = new Array(_len64 > 1 ? _len64 - 1 : 0), _key64 = 1; _key64 < _len64; _key64++) {
      expressions[_key64 - 1] = arguments[_key64];
    }

    return selector.apply(void 0, ['legend', literals].concat(expressions));
  },
  li: function li(literals) {
    for (var _len65 = arguments.length, expressions = new Array(_len65 > 1 ? _len65 - 1 : 0), _key65 = 1; _key65 < _len65; _key65++) {
      expressions[_key65 - 1] = arguments[_key65];
    }

    return selector.apply(void 0, ['li', literals].concat(expressions));
  },
  link: function link(literals) {
    for (var _len66 = arguments.length, expressions = new Array(_len66 > 1 ? _len66 - 1 : 0), _key66 = 1; _key66 < _len66; _key66++) {
      expressions[_key66 - 1] = arguments[_key66];
    }

    return selector.apply(void 0, ['link', literals].concat(expressions));
  },
  main: function main(literals) {
    for (var _len67 = arguments.length, expressions = new Array(_len67 > 1 ? _len67 - 1 : 0), _key67 = 1; _key67 < _len67; _key67++) {
      expressions[_key67 - 1] = arguments[_key67];
    }

    return selector.apply(void 0, ['main', literals].concat(expressions));
  },
  map: function map(literals) {
    for (var _len68 = arguments.length, expressions = new Array(_len68 > 1 ? _len68 - 1 : 0), _key68 = 1; _key68 < _len68; _key68++) {
      expressions[_key68 - 1] = arguments[_key68];
    }

    return selector.apply(void 0, ['map', literals].concat(expressions));
  },
  mark: function mark(literals) {
    for (var _len69 = arguments.length, expressions = new Array(_len69 > 1 ? _len69 - 1 : 0), _key69 = 1; _key69 < _len69; _key69++) {
      expressions[_key69 - 1] = arguments[_key69];
    }

    return selector.apply(void 0, ['mark', literals].concat(expressions));
  },
  marquee: function marquee(literals) {
    for (var _len70 = arguments.length, expressions = new Array(_len70 > 1 ? _len70 - 1 : 0), _key70 = 1; _key70 < _len70; _key70++) {
      expressions[_key70 - 1] = arguments[_key70];
    }

    return selector.apply(void 0, ['marquee', literals].concat(expressions));
  },
  menu: function menu(literals) {
    for (var _len71 = arguments.length, expressions = new Array(_len71 > 1 ? _len71 - 1 : 0), _key71 = 1; _key71 < _len71; _key71++) {
      expressions[_key71 - 1] = arguments[_key71];
    }

    return selector.apply(void 0, ['menu', literals].concat(expressions));
  },
  menuitem: function menuitem(literals) {
    for (var _len72 = arguments.length, expressions = new Array(_len72 > 1 ? _len72 - 1 : 0), _key72 = 1; _key72 < _len72; _key72++) {
      expressions[_key72 - 1] = arguments[_key72];
    }

    return selector.apply(void 0, ['menuitem', literals].concat(expressions));
  },
  meta: function meta(literals) {
    for (var _len73 = arguments.length, expressions = new Array(_len73 > 1 ? _len73 - 1 : 0), _key73 = 1; _key73 < _len73; _key73++) {
      expressions[_key73 - 1] = arguments[_key73];
    }

    return selector.apply(void 0, ['meta', literals].concat(expressions));
  },
  meter: function meter(literals) {
    for (var _len74 = arguments.length, expressions = new Array(_len74 > 1 ? _len74 - 1 : 0), _key74 = 1; _key74 < _len74; _key74++) {
      expressions[_key74 - 1] = arguments[_key74];
    }

    return selector.apply(void 0, ['meter', literals].concat(expressions));
  },
  nav: function nav(literals) {
    for (var _len75 = arguments.length, expressions = new Array(_len75 > 1 ? _len75 - 1 : 0), _key75 = 1; _key75 < _len75; _key75++) {
      expressions[_key75 - 1] = arguments[_key75];
    }

    return selector.apply(void 0, ['nav', literals].concat(expressions));
  },
  noscript: function noscript(literals) {
    for (var _len76 = arguments.length, expressions = new Array(_len76 > 1 ? _len76 - 1 : 0), _key76 = 1; _key76 < _len76; _key76++) {
      expressions[_key76 - 1] = arguments[_key76];
    }

    return selector.apply(void 0, ['noscript', literals].concat(expressions));
  },
  object: function object(literals) {
    for (var _len77 = arguments.length, expressions = new Array(_len77 > 1 ? _len77 - 1 : 0), _key77 = 1; _key77 < _len77; _key77++) {
      expressions[_key77 - 1] = arguments[_key77];
    }

    return selector.apply(void 0, ['object', literals].concat(expressions));
  },
  ol: function ol(literals) {
    for (var _len78 = arguments.length, expressions = new Array(_len78 > 1 ? _len78 - 1 : 0), _key78 = 1; _key78 < _len78; _key78++) {
      expressions[_key78 - 1] = arguments[_key78];
    }

    return selector.apply(void 0, ['ol', literals].concat(expressions));
  },
  optgroup: function optgroup(literals) {
    for (var _len79 = arguments.length, expressions = new Array(_len79 > 1 ? _len79 - 1 : 0), _key79 = 1; _key79 < _len79; _key79++) {
      expressions[_key79 - 1] = arguments[_key79];
    }

    return selector.apply(void 0, ['optgroup', literals].concat(expressions));
  },
  option: function option(literals) {
    for (var _len80 = arguments.length, expressions = new Array(_len80 > 1 ? _len80 - 1 : 0), _key80 = 1; _key80 < _len80; _key80++) {
      expressions[_key80 - 1] = arguments[_key80];
    }

    return selector.apply(void 0, ['option', literals].concat(expressions));
  },
  output: function output(literals) {
    for (var _len81 = arguments.length, expressions = new Array(_len81 > 1 ? _len81 - 1 : 0), _key81 = 1; _key81 < _len81; _key81++) {
      expressions[_key81 - 1] = arguments[_key81];
    }

    return selector.apply(void 0, ['output', literals].concat(expressions));
  },
  p: function p(literals) {
    for (var _len82 = arguments.length, expressions = new Array(_len82 > 1 ? _len82 - 1 : 0), _key82 = 1; _key82 < _len82; _key82++) {
      expressions[_key82 - 1] = arguments[_key82];
    }

    return selector.apply(void 0, ['p', literals].concat(expressions));
  },
  param: function param(literals) {
    for (var _len83 = arguments.length, expressions = new Array(_len83 > 1 ? _len83 - 1 : 0), _key83 = 1; _key83 < _len83; _key83++) {
      expressions[_key83 - 1] = arguments[_key83];
    }

    return selector.apply(void 0, ['param', literals].concat(expressions));
  },
  picture: function picture(literals) {
    for (var _len84 = arguments.length, expressions = new Array(_len84 > 1 ? _len84 - 1 : 0), _key84 = 1; _key84 < _len84; _key84++) {
      expressions[_key84 - 1] = arguments[_key84];
    }

    return selector.apply(void 0, ['picture', literals].concat(expressions));
  },
  pre: function pre(literals) {
    for (var _len85 = arguments.length, expressions = new Array(_len85 > 1 ? _len85 - 1 : 0), _key85 = 1; _key85 < _len85; _key85++) {
      expressions[_key85 - 1] = arguments[_key85];
    }

    return selector.apply(void 0, ['pre', literals].concat(expressions));
  },
  progress: function progress(literals) {
    for (var _len86 = arguments.length, expressions = new Array(_len86 > 1 ? _len86 - 1 : 0), _key86 = 1; _key86 < _len86; _key86++) {
      expressions[_key86 - 1] = arguments[_key86];
    }

    return selector.apply(void 0, ['progress', literals].concat(expressions));
  },
  q: function q(literals) {
    for (var _len87 = arguments.length, expressions = new Array(_len87 > 1 ? _len87 - 1 : 0), _key87 = 1; _key87 < _len87; _key87++) {
      expressions[_key87 - 1] = arguments[_key87];
    }

    return selector.apply(void 0, ['q', literals].concat(expressions));
  },
  rp: function rp(literals) {
    for (var _len88 = arguments.length, expressions = new Array(_len88 > 1 ? _len88 - 1 : 0), _key88 = 1; _key88 < _len88; _key88++) {
      expressions[_key88 - 1] = arguments[_key88];
    }

    return selector.apply(void 0, ['rp', literals].concat(expressions));
  },
  rt: function rt(literals) {
    for (var _len89 = arguments.length, expressions = new Array(_len89 > 1 ? _len89 - 1 : 0), _key89 = 1; _key89 < _len89; _key89++) {
      expressions[_key89 - 1] = arguments[_key89];
    }

    return selector.apply(void 0, ['rt', literals].concat(expressions));
  },
  ruby: function ruby(literals) {
    for (var _len90 = arguments.length, expressions = new Array(_len90 > 1 ? _len90 - 1 : 0), _key90 = 1; _key90 < _len90; _key90++) {
      expressions[_key90 - 1] = arguments[_key90];
    }

    return selector.apply(void 0, ['ruby', literals].concat(expressions));
  },
  s: function s(literals) {
    for (var _len91 = arguments.length, expressions = new Array(_len91 > 1 ? _len91 - 1 : 0), _key91 = 1; _key91 < _len91; _key91++) {
      expressions[_key91 - 1] = arguments[_key91];
    }

    return selector.apply(void 0, ['s', literals].concat(expressions));
  },
  samp: function samp(literals) {
    for (var _len92 = arguments.length, expressions = new Array(_len92 > 1 ? _len92 - 1 : 0), _key92 = 1; _key92 < _len92; _key92++) {
      expressions[_key92 - 1] = arguments[_key92];
    }

    return selector.apply(void 0, ['samp', literals].concat(expressions));
  },
  script: function script(literals) {
    for (var _len93 = arguments.length, expressions = new Array(_len93 > 1 ? _len93 - 1 : 0), _key93 = 1; _key93 < _len93; _key93++) {
      expressions[_key93 - 1] = arguments[_key93];
    }

    return selector.apply(void 0, ['script', literals].concat(expressions));
  },
  section: function section(literals) {
    for (var _len94 = arguments.length, expressions = new Array(_len94 > 1 ? _len94 - 1 : 0), _key94 = 1; _key94 < _len94; _key94++) {
      expressions[_key94 - 1] = arguments[_key94];
    }

    return selector.apply(void 0, ['section', literals].concat(expressions));
  },
  select: function select(literals) {
    for (var _len95 = arguments.length, expressions = new Array(_len95 > 1 ? _len95 - 1 : 0), _key95 = 1; _key95 < _len95; _key95++) {
      expressions[_key95 - 1] = arguments[_key95];
    }

    return selector.apply(void 0, ['select', literals].concat(expressions));
  },
  small: function small(literals) {
    for (var _len96 = arguments.length, expressions = new Array(_len96 > 1 ? _len96 - 1 : 0), _key96 = 1; _key96 < _len96; _key96++) {
      expressions[_key96 - 1] = arguments[_key96];
    }

    return selector.apply(void 0, ['small', literals].concat(expressions));
  },
  source: function source(literals) {
    for (var _len97 = arguments.length, expressions = new Array(_len97 > 1 ? _len97 - 1 : 0), _key97 = 1; _key97 < _len97; _key97++) {
      expressions[_key97 - 1] = arguments[_key97];
    }

    return selector.apply(void 0, ['source', literals].concat(expressions));
  },
  span: function span(literals) {
    for (var _len98 = arguments.length, expressions = new Array(_len98 > 1 ? _len98 - 1 : 0), _key98 = 1; _key98 < _len98; _key98++) {
      expressions[_key98 - 1] = arguments[_key98];
    }

    return selector.apply(void 0, ['span', literals].concat(expressions));
  },
  strong: function strong(literals) {
    for (var _len99 = arguments.length, expressions = new Array(_len99 > 1 ? _len99 - 1 : 0), _key99 = 1; _key99 < _len99; _key99++) {
      expressions[_key99 - 1] = arguments[_key99];
    }

    return selector.apply(void 0, ['strong', literals].concat(expressions));
  },
  style: function style(literals) {
    for (var _len100 = arguments.length, expressions = new Array(_len100 > 1 ? _len100 - 1 : 0), _key100 = 1; _key100 < _len100; _key100++) {
      expressions[_key100 - 1] = arguments[_key100];
    }

    return selector.apply(void 0, ['style', literals].concat(expressions));
  },
  sub: function sub(literals) {
    for (var _len101 = arguments.length, expressions = new Array(_len101 > 1 ? _len101 - 1 : 0), _key101 = 1; _key101 < _len101; _key101++) {
      expressions[_key101 - 1] = arguments[_key101];
    }

    return selector.apply(void 0, ['sub', literals].concat(expressions));
  },
  summary: function summary(literals) {
    for (var _len102 = arguments.length, expressions = new Array(_len102 > 1 ? _len102 - 1 : 0), _key102 = 1; _key102 < _len102; _key102++) {
      expressions[_key102 - 1] = arguments[_key102];
    }

    return selector.apply(void 0, ['summary', literals].concat(expressions));
  },
  sup: function sup(literals) {
    for (var _len103 = arguments.length, expressions = new Array(_len103 > 1 ? _len103 - 1 : 0), _key103 = 1; _key103 < _len103; _key103++) {
      expressions[_key103 - 1] = arguments[_key103];
    }

    return selector.apply(void 0, ['sup', literals].concat(expressions));
  },
  table: function table(literals) {
    for (var _len104 = arguments.length, expressions = new Array(_len104 > 1 ? _len104 - 1 : 0), _key104 = 1; _key104 < _len104; _key104++) {
      expressions[_key104 - 1] = arguments[_key104];
    }

    return selector.apply(void 0, ['table', literals].concat(expressions));
  },
  tbody: function tbody(literals) {
    for (var _len105 = arguments.length, expressions = new Array(_len105 > 1 ? _len105 - 1 : 0), _key105 = 1; _key105 < _len105; _key105++) {
      expressions[_key105 - 1] = arguments[_key105];
    }

    return selector.apply(void 0, ['tbody', literals].concat(expressions));
  },
  td: function td(literals) {
    for (var _len106 = arguments.length, expressions = new Array(_len106 > 1 ? _len106 - 1 : 0), _key106 = 1; _key106 < _len106; _key106++) {
      expressions[_key106 - 1] = arguments[_key106];
    }

    return selector.apply(void 0, ['td', literals].concat(expressions));
  },
  textarea: function textarea(literals) {
    for (var _len107 = arguments.length, expressions = new Array(_len107 > 1 ? _len107 - 1 : 0), _key107 = 1; _key107 < _len107; _key107++) {
      expressions[_key107 - 1] = arguments[_key107];
    }

    return selector.apply(void 0, ['textarea', literals].concat(expressions));
  },
  tfoot: function tfoot(literals) {
    for (var _len108 = arguments.length, expressions = new Array(_len108 > 1 ? _len108 - 1 : 0), _key108 = 1; _key108 < _len108; _key108++) {
      expressions[_key108 - 1] = arguments[_key108];
    }

    return selector.apply(void 0, ['tfoot', literals].concat(expressions));
  },
  th: function th(literals) {
    for (var _len109 = arguments.length, expressions = new Array(_len109 > 1 ? _len109 - 1 : 0), _key109 = 1; _key109 < _len109; _key109++) {
      expressions[_key109 - 1] = arguments[_key109];
    }

    return selector.apply(void 0, ['th', literals].concat(expressions));
  },
  thead: function thead(literals) {
    for (var _len110 = arguments.length, expressions = new Array(_len110 > 1 ? _len110 - 1 : 0), _key110 = 1; _key110 < _len110; _key110++) {
      expressions[_key110 - 1] = arguments[_key110];
    }

    return selector.apply(void 0, ['thead', literals].concat(expressions));
  },
  time: function time(literals) {
    for (var _len111 = arguments.length, expressions = new Array(_len111 > 1 ? _len111 - 1 : 0), _key111 = 1; _key111 < _len111; _key111++) {
      expressions[_key111 - 1] = arguments[_key111];
    }

    return selector.apply(void 0, ['time', literals].concat(expressions));
  },
  title: function title(literals) {
    for (var _len112 = arguments.length, expressions = new Array(_len112 > 1 ? _len112 - 1 : 0), _key112 = 1; _key112 < _len112; _key112++) {
      expressions[_key112 - 1] = arguments[_key112];
    }

    return selector.apply(void 0, ['title', literals].concat(expressions));
  },
  tr: function tr(literals) {
    for (var _len113 = arguments.length, expressions = new Array(_len113 > 1 ? _len113 - 1 : 0), _key113 = 1; _key113 < _len113; _key113++) {
      expressions[_key113 - 1] = arguments[_key113];
    }

    return selector.apply(void 0, ['tr', literals].concat(expressions));
  },
  track: function track(literals) {
    for (var _len114 = arguments.length, expressions = new Array(_len114 > 1 ? _len114 - 1 : 0), _key114 = 1; _key114 < _len114; _key114++) {
      expressions[_key114 - 1] = arguments[_key114];
    }

    return selector.apply(void 0, ['track', literals].concat(expressions));
  },
  u: function u(literals) {
    for (var _len115 = arguments.length, expressions = new Array(_len115 > 1 ? _len115 - 1 : 0), _key115 = 1; _key115 < _len115; _key115++) {
      expressions[_key115 - 1] = arguments[_key115];
    }

    return selector.apply(void 0, ['u', literals].concat(expressions));
  },
  ul: function ul(literals) {
    for (var _len116 = arguments.length, expressions = new Array(_len116 > 1 ? _len116 - 1 : 0), _key116 = 1; _key116 < _len116; _key116++) {
      expressions[_key116 - 1] = arguments[_key116];
    }

    return selector.apply(void 0, ['ul', literals].concat(expressions));
  },
  var: function _var(literals) {
    for (var _len117 = arguments.length, expressions = new Array(_len117 > 1 ? _len117 - 1 : 0), _key117 = 1; _key117 < _len117; _key117++) {
      expressions[_key117 - 1] = arguments[_key117];
    }

    return selector.apply(void 0, ['var', literals].concat(expressions));
  },
  video: function video(literals) {
    for (var _len118 = arguments.length, expressions = new Array(_len118 > 1 ? _len118 - 1 : 0), _key118 = 1; _key118 < _len118; _key118++) {
      expressions[_key118 - 1] = arguments[_key118];
    }

    return selector.apply(void 0, ['video', literals].concat(expressions));
  },
  wbr: function wbr(literals) {
    for (var _len119 = arguments.length, expressions = new Array(_len119 > 1 ? _len119 - 1 : 0), _key119 = 1; _key119 < _len119; _key119++) {
      expressions[_key119 - 1] = arguments[_key119];
    }

    return selector.apply(void 0, ['wbr', literals].concat(expressions));
  } // ########### Export ###########

};
var styled_1 = {
  styled: styled,
  css: css,
  cssWithProps: cssWithProps,
  cssWithPropsPlain: cssWithPropsPlain
};

var styled$1 = styled_1.styled,
    css$1 = styled_1.css,
    cssWithProps$1 = styled_1.cssWithProps,
    cssWithPropsPlain$1 = styled_1.cssWithPropsPlain;
var snabbomReactComponents = {};
var src = snabbomReactComponents;
var h_1 = h;
var css_1 = css$1;
var lazy_1$1 = lazy_1;
var patch_1 = patch;
var styled_1$1 = styled$1;
var cssWithProps_1 = cssWithProps$1;
var createComponent_1 = component;
var cssWithPropsPlain_1 = cssWithPropsPlain$1;
var createAsyncComponent_1 = componentAsync;
src.h = h_1;
src.css = css_1;
src.lazy = lazy_1$1;
src.patch = patch_1;
src.styled = styled_1$1;
src.cssWithProps = cssWithProps_1;
src.createComponent = createComponent_1;
src.cssWithPropsPlain = cssWithPropsPlain_1;
src.createAsyncComponent = createAsyncComponent_1;

exports.default = src;
exports.h = h_1;
exports.css = css_1;
exports.lazy = lazy_1$1;
exports.patch = patch_1;
exports.styled = styled_1$1;
exports.cssWithProps = cssWithProps_1;
exports.createComponent = createComponent_1;
exports.cssWithPropsPlain = cssWithPropsPlain_1;
exports.createAsyncComponent = createAsyncComponent_1;
