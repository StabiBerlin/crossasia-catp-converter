class PicaXField {
  constructor(codeOrObj, subCode = '', lang = '', value = '') {
    // Check if first parameter is an object
    if (typeof codeOrObj === 'object') {
      this.code = codeOrObj.code || null;
      this.subCode = codeOrObj.subCode || '';
      this.lang = codeOrObj.lang || '';
      this.value = codeOrObj.value || '';
    } else {
      // Otherwise treat it as individual parameters
      this.code = codeOrObj || null;
      this.subCode = subCode;
      this.lang = lang;
      this.value = value;
    }
  }

  // toString method
  toString() {
    return this.code ? `${this.code} ${this.subCode}${this.lang}${this.value}` : null;
  }

  // toHTML method
  toHTML() {
    if (!this.code) return null;
    return `
        <span class="code">${this.code}</span><span class="subCode">${this.subCode}</span><span class="lang">${this.lang}</span>${this.value.replace(/(\$[a-z])/gm, '<span class="dollar">$1</span>').replace(/([[\]|])/gm, '<span class="dollar">$1</span>')}`.trim();
  }
}

// Update the original functions to use PICAX class

const toString = function (obj) {
  const picax = new PicaXField(obj);
  return picax.toString();
}

const toHTML = function (obj) {
  const picax = new PicaXField(obj);
  return picax.toHTML();
}

export { PicaXField, toString, toHTML };