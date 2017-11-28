"use strict";
import path from 'path'
import del from 'del'

const util = {
  debounce(fn, delay = 500){
      let timer;
      return function() {
          let context = this;
          let args = arguments;
          clearTimeout(timer)
          timer = setTimeout(() => {
              fn.apply(this, arguments)
          }, delay)
      }
  }
}


module.exports = util;
