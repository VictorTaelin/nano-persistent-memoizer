module.exports = function(name) {
  function get(key) {
    return window.localStorage.getItem(name + "-" + key);
  }

  function set(key, val) {
    window.localStorage.setItem(name + "-" + key, val);
    return val;
  }

  function sync(func) {
    function memo(key) {
      return get(key) || set(key, func(key));
    }
    memo.clear = clear;
    return memo;
  }

  function async(func) {
    function memo(key) {
      var val = get(key);
      if (val) {
        return Promise.resolve(val);
      } else {
        return func(key).then(function(val) {
          return set(key, val);
        });
      }
    }
    memo.clear = clear;
    return memo;
  };

  function clear() {
    Object.keys(window.localStorage).forEach(function(key) {
      if (key.slice(0,name.length) === name) {
        window.localStorage.removeItem(key);
      }
    });
  }

  return {
    sync: sync,
    async: async,
    clear: clear
  }
};
