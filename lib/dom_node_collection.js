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
