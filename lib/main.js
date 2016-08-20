const DOMNodeCollection = require('./dom_node_collection.js');

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
