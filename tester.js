window = {};
localStorage = window.localStorage = {
  getItem: key => localStorage[key],
  setItem: (key, val) => (localStorage[key] = val, null),
  removeItem: key => { delete localStorage[key] }
};

var assert = require("assert");
var memoN = require("./node-api");
var memoB = require("./browser-api");

var ns = memoN("ns").sync(x => x + x);
var ns_ = memoN("ns").sync(x => "bad");

var na = memoN("na").async(x => Promise.resolve(x + x));
var na_ = memoN("na").async(x => Promise.resolve("bad"));

var bs = memoB("bs").sync(x => x + x);
var bs_ = memoB("bs").sync(x => "bad");

var ba = memoB("ba").async(x => Promise.resolve(x + x));
var ba_ = memoB("ba").async(x => Promise.resolve("bad"));

(async () => {
  assert(ns("foo") === ns_("foo"));
  assert(ns("bar") === ns_("bar"));
  assert(ns("foo") !== ns("bar"));

  assert(await na("foo") === await na_("foo"));
  assert(await na("bar") === await na_("bar"));
  assert(await na("foo") !== await na("bar"));

  assert(bs("foo") === bs_("foo"));
  assert(bs("bar") === bs_("bar"));
  assert(bs("foo") !== bs("bar"));

  assert(await ba("foo") === await ba_("foo"));
  assert(await ba("bar") === await ba_("bar"));
  assert(await ba("foo") !== await ba("bar"));

  bs.clear();
  assert(JSON.stringify(localStorage) === '{"ba-foo":"foofoo","ba-bar":"barbar"}');

  ns.clear();
  na.clear();

  console.log("ok");
})();
