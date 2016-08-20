/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const DOMNodeCollection = __webpack_require__(1);

	function $l(arg) {
	  if (typeof arg === 'string') {
	    const nodeList = document.querySelectorAll(arg);
	    const nodeArray = Array.from(nodeList);
	    return new DOMNodeCollection(nodeArray);
	  } else if (arg instanceof HTMLElement) {
	    return new DOMNodeCollection([arg]);
	  } else if (arg instanceof Function) {
	    if (document.readyState === "loading") {
	      documentReadyQueue.push(arg);
	    }
	    else {
	      arg();
	    }
	  }
	}

	$l.extend = function(...objs) {
	  const result = objs[0];
	  objs.slice(1).forEach(obj => {
	    Object.keys(obj).forEach(key => {
	      result[key] = obj[key];
	    });
	  });
	  return result;
	};

	$l.ajax = function(options) {
	  const defaults = {
	    method: "GET",
	    url: "http://google.com",
	    data: {},
	    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
	    success: () => {},
	    error: () => {},
	  };
	  options = $l.extend(defaults, options);

	  const xhr = new XMLHttpRequest();
	  xhr.open(options.method, options.url);
	  xhr.onload = () => {
	    if (xhr.status === 200) {
	      return options.success(xhr.response);
	    } else {
	      return options.error(xhr.response);
	    }
	  };

	  const optionalData = options.data;
	  xhr.send(optionalData);
	};


	const documentReadyQueue = [];
	document.addEventListener('DOMContentLoaded', () => {
	  documentReadyQueue.forEach(f => f());
	});

	window.$l = $l;


/***/ },
/* 1 */
/***/ function(module, exports) {

	class DOMNodeCollection {
	  constructor(elements) {
	    this.elements = elements;
	  }

	  html(string) {
	    if (string !== undefined) {
	      this.elements.forEach( el => {
	        el.innerHTML = string;
	      });
	    } else {
	      return this.elements[0].innerHTML;
	    }
	  }

	  empty() {
	    this.html("");
	  }

	  append(arg) {
	    if (arg instanceof DOMNodeCollection) {
	      this.elements.forEach(outerEl => {
	        arg.elements.forEach(innerEl => {
	          outerEl.innerHTML += innerEl.outerHTML;
	        });
	      });
	    } else if (arg instanceof HTMLElement) {
	      this.elements.forEach(outerEl => {
	        outerEl.innerHTML += arg.outerHTML;
	      });
	    } else if (typeof arg === 'string') {
	      this.elements.forEach(outerEl => {
	        outerEl.innerHTML += arg;
	      });
	    }
	    return this;
	  }

	  attr(attrName, value) {
	    if (value === undefined) {
	      return this.elements[0].getAttribute(attrName);
	    }
	    else {
	      this.elements.forEach(el => el.setAttribute(attrName, value));
	      return this;
	    }
	  }

	  addClass(className) {
	    this.elements.forEach(el => {
	      if (el.className.length === 0) {
	        el.className = className;
	      }
	      else {
	        el.className += (" " + className);
	      }
	    });
	    return this;
	  }

	  removeClass(className) {
	    this.elements.forEach(el => {
	      let classes = el.elements[0].className.split(" ");
	      classes = classes.filter(cls => cls !== className );
	      el.className = classes.join(" ");
	    });
	    return this;
	  }

	  children() {
	    return new DOMNodeCollection(
	      [].concat(this.elements.map(el => el.children))
	    );
	  }

	  parent() {
	    return new DOMNodeCollection(
	      this.elements.map(el => el.parent)
	    );
	  }

	  find(selector) {
	    let results = [];
	    this.elements.forEach( el => {
	      results = results.concat(el.querySelectorAll(selector));
	    });
	    return new DOMNodeCollection(results);
	  }

	  remove() {
	    this.elements.forEach( el => el.remove());
	    this.elements = [];
	    return this;
	  }

	  on(event, callback) {
	    this.elements.forEach( el => {
	      el.addEventListener(event, callback);
	    });
	  }

	  off(event, callback) {
	    this.elements.forEach( el => {
	      el.removeEventListener(event, callback);
	    });
	  }

	  each(callback) {
	    this.elements.forEach((el, i) => {
	      callback(i, el);
	    });
	    return this;
	  }

	  text(text) {
	    if (text === undefined) {
	      return this.elements[0].innerText;
	    } else {
	      this.elements.forEach(el => {
	        el.innerText = text;
	      });
	      return this;
	    }
	  }
	}

	module.exports = DOMNodeCollection;


/***/ }
/******/ ]);