"use strict";
import path from 'path'
import del from 'del'

const util = {
  debounce(fn, delay = 500) {
      let timer;
      return function() {
          let context = this;
          let args = arguments;
          clearTimeout(timer)
          timer = setTimeout(() => {
              fn.apply(this, arguments)
          }, delay)
      }
  },
  throttle(fn, delay = 500) {
    let timer, last;
    return () => {
      let now = +new Date();
      let context = this;
      let args = arguments;
      if(last && now - last < delay){
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(context, args)
            last = now
        }, delay)
      }else{
        fn.apply(context, args)
        last = now
      }
    }
  }
}


module.exports = util;
