var fs = require("fs");
var path = require("path");

module.exports = function(name) {
  var homePath = process.env[process.platform === "win32" ? "USERPROFILE" : "HOME"];
  var cachePath = path.join(homePath, ".nano-persistent-memoizer");
  var valPath = key => path.join(cachePath, name+"-"+key);

  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath);
  }

  var sync = func => {
    var memo = key => {
      if (fs.existsSync(valPath(key))) {
        return fs.readFileSync(valPath(key), "utf8");
      }
      var val = func(key);
      fs.writeFileSync(valPath(key), val);
      return val;
    };
    memo.clear = clear;
    return memo;
  };

  var async = func => {
    var memo = key => new Promise((resolve, reject) => {
      fs.exists(valPath(key), (exists) => {
        if (exists) {
          fs.readFile(valPath(key), "utf8", (err, val) => {
            if (err) {
              func(key).then(resolve).catch(reject);
            } else {
              resolve(val);
            }
          });
        } else {
          func(key).then(val => {
            fs.writeFile(valPath(key), val, err => {
              resolve(val);
            })
          }).catch(reject);
        }
      });
    });
    memo.clear = clear;
    return memo;
  };

  var clear = () => {
    fs.readdirSync(cachePath).forEach(key => {
      if (key.slice(0,name.length) === name) {
        fs.unlinkSync(path.join(cachePath,key));
      }
    });
  };

  return {
    sync: sync,
    async: async,
    clear: clear
  }
};
