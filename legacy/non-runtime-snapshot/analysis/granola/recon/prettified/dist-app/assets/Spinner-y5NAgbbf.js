const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "./index-CHx3lakx.js",
      "./index-Cnk1amp1.js",
      "./index-CiyuIfNE.css",
      "./client-Bbb5Wbb6.js",
      "./cacheStore-fi4qkUF1.js",
      "./LinkPreviewCard-DtO4M86I.js",
      "./observers-DohMzB7_.js",
    ]),
) => i.map((i) => d[i]);
import {
  bd as x,
  be as C,
  bf as V,
  bg as L,
  bh as S,
  bi as E,
  bj as Ut,
  bk as be,
  _ as it,
  G as ot,
  l as Ft,
  i as wr,
  r as at,
} from "./index-Cnk1amp1.js";
import { i as qt, c as Ir, j as ga } from "./client-Bbb5Wbb6.js";
import {
  gD as ht,
  g as pa,
  gE as ma,
  gF as ya,
} from "./cacheStore-fi4qkUF1.js";
import { c as ba } from "./LinkPreviewCard-DtO4M86I.js";
try {
  let t =
      typeof window < "u"
        ? window
        : typeof global < "u"
          ? global
          : typeof globalThis < "u"
            ? globalThis
            : typeof self < "u"
              ? self
              : {},
    e = new t.Error().stack;
  e &&
    ((t._sentryDebugIds = t._sentryDebugIds || {}),
    (t._sentryDebugIds[e] = "ea6f8c38-1a04-450a-91f9-dfb44c0efded"),
    (t._sentryDebugIdIdentifier =
      "sentry-dbid-ea6f8c38-1a04-450a-91f9-dfb44c0efded"));
} catch {}
var Ce;
(function (t) {
  ((t.SET = "$set"),
    (t.SET_ONCE = "$setOnce"),
    (t.ADD = "$add"),
    (t.APPEND = "$append"),
    (t.PREPEND = "$prepend"),
    (t.REMOVE = "$remove"),
    (t.PREINSERT = "$preInsert"),
    (t.POSTINSERT = "$postInsert"),
    (t.UNSET = "$unset"),
    (t.CLEAR_ALL = "$clearAll"));
})(Ce || (Ce = {}));
var se;
(function (t) {
  ((t.IDENTIFY = "$identify"),
    (t.GROUP_IDENTIFY = "$groupidentify"),
    (t.REVENUE = "revenue_amount"));
})(se || (se = {}));
var yn = "-",
  Yt = "AMP",
  Gi = "".concat(Yt, "_unsent"),
  Hi = "$default_instance",
  Wi = "https://api2.amplitude.com/2/httpapi",
  Ea = "https://api.eu.amplitude.com/2/httpapi",
  Sa = "https://api2.amplitude.com/batch",
  Ta = "https://api.eu.amplitude.com/batch",
  wa = "utm_campaign",
  Ia = "utm_content",
  _a = "utm_id",
  Pa = "utm_medium",
  Ca = "utm_source",
  Aa = "utm_term",
  bn = "dclid",
  En = "fbclid",
  Sn = "gbraid",
  Tn = "gclid",
  wn = "ko_click_id",
  In = "li_fat_id",
  _n = "msclkid",
  Pn = "rdt_cid",
  Cn = "ttclid",
  An = "twclid",
  kn = "wbraid",
  Jt = {
    utm_campaign: void 0,
    utm_content: void 0,
    utm_id: void 0,
    utm_medium: void 0,
    utm_source: void 0,
    utm_term: void 0,
    referrer: void 0,
    referring_domain: void 0,
    dclid: void 0,
    gbraid: void 0,
    gclid: void 0,
    fbclid: void 0,
    ko_click_id: void 0,
    li_fat_id: void 0,
    msclkid: void 0,
    rdt_cid: void 0,
    ttclid: void 0,
    twclid: void 0,
    wbraid: void 0,
  },
  Bt = [
    "access-control-allow-origin",
    "access-control-allow-credentials",
    "access-control-expose-headers",
    "access-control-max-age",
    "access-control-allow-methods",
    "access-control-allow-headers",
    "accept-patch",
    "accept-ranges",
    "age",
    "allow",
    "alt-svc",
    "cache-control",
    "connection",
    "content-disposition",
    "content-encoding",
    "content-language",
    "content-length",
    "content-location",
    "content-md5",
    "content-range",
    "content-type",
    "date",
    "delta-base",
    "etag",
    "expires",
    "im",
    "last-modified",
    "link",
    "location",
    "permanent",
    "p3p",
    "pragma",
    "proxy-authenticate",
    "public-key-pins",
    "retry-after",
    "server",
    "status",
    "strict-transport-security",
    "trailer",
    "transfer-encoding",
    "tk",
    "upgrade",
    "vary",
    "via",
    "warning",
    "www-authenticate",
    "x-b3-traceid",
    "x-frame-options",
  ],
  ka = ["authorization", "cookie", "set-cookie"],
  Ra = 1e3,
  _r = function (t) {
    if (Object.keys(t).length > Ra) return !1;
    for (var e in t) {
      var r = t[e];
      if (!Ki(e, r)) return !1;
    }
    return !0;
  },
  Ki = function (t, e) {
    var r, n;
    if (typeof t != "string") return !1;
    if (Array.isArray(e)) {
      var i = !0;
      try {
        for (var o = x(e), a = o.next(); !a.done; a = o.next()) {
          var s = a.value;
          if (Array.isArray(s)) return !1;
          if (typeof s == "object") i = i && _r(s);
          else if (!["number", "string"].includes(typeof s)) return !1;
          if (!i) return !1;
        }
      } catch (u) {
        r = { error: u };
      } finally {
        try {
          a && !a.done && (n = o.return) && n.call(o);
        } finally {
          if (r) throw r.error;
        }
      }
    } else {
      if (e == null) return !1;
      if (typeof e == "object") return _r(e);
      if (!["number", "string", "boolean"].includes(typeof e)) return !1;
    }
    return !0;
  },
  He = (function () {
    function t() {
      ((this._propertySet = new Set()), (this._properties = {}));
    }
    return (
      (t.prototype.getUserProperties = function () {
        return C({}, this._properties);
      }),
      (t.prototype.set = function (e, r) {
        return (this._safeSet(J.SET, e, r), this);
      }),
      (t.prototype.setOnce = function (e, r) {
        return (this._safeSet(J.SET_ONCE, e, r), this);
      }),
      (t.prototype.append = function (e, r) {
        return (this._safeSet(J.APPEND, e, r), this);
      }),
      (t.prototype.prepend = function (e, r) {
        return (this._safeSet(J.PREPEND, e, r), this);
      }),
      (t.prototype.postInsert = function (e, r) {
        return (this._safeSet(J.POSTINSERT, e, r), this);
      }),
      (t.prototype.preInsert = function (e, r) {
        return (this._safeSet(J.PREINSERT, e, r), this);
      }),
      (t.prototype.remove = function (e, r) {
        return (this._safeSet(J.REMOVE, e, r), this);
      }),
      (t.prototype.add = function (e, r) {
        return (this._safeSet(J.ADD, e, r), this);
      }),
      (t.prototype.unset = function (e) {
        return (this._safeSet(J.UNSET, e, yn), this);
      }),
      (t.prototype.clearAll = function () {
        return (
          (this._properties = {}),
          (this._properties[J.CLEAR_ALL] = yn),
          this
        );
      }),
      (t.prototype._safeSet = function (e, r, n) {
        if (this._validate(e, r, n)) {
          var i = this._properties[e];
          return (
            i === void 0 && ((i = {}), (this._properties[e] = i)),
            (i[r] = n),
            this._propertySet.add(r),
            !0
          );
        }
        return !1;
      }),
      (t.prototype._validate = function (e, r, n) {
        return this._properties[J.CLEAR_ALL] !== void 0 ||
          this._propertySet.has(r)
          ? !1
          : e === J.ADD
            ? typeof n == "number"
            : e !== J.UNSET && e !== J.REMOVE
              ? Ki(r, n)
              : !0;
      }),
      t
    );
  })(),
  J;
(function (t) {
  ((t.SET = "$set"),
    (t.SET_ONCE = "$setOnce"),
    (t.ADD = "$add"),
    (t.APPEND = "$append"),
    (t.PREPEND = "$prepend"),
    (t.REMOVE = "$remove"),
    (t.PREINSERT = "$preInsert"),
    (t.POSTINSERT = "$postInsert"),
    (t.UNSET = "$unset"),
    (t.CLEAR_ALL = "$clearAll"));
})(J || (J = {}));
var Oa = [
    J.CLEAR_ALL,
    J.UNSET,
    J.SET,
    J.SET_ONCE,
    J.ADD,
    J.APPEND,
    J.PREPEND,
    J.PREINSERT,
    J.POSTINSERT,
    J.REMOVE,
  ],
  La = "Event tracked successfully",
  Da = "Unexpected error occurred",
  Na = "Event rejected due to exceeded retry count",
  Ma = "Event skipped due to optOut config",
  xa = "Event rejected due to missing API key",
  Ua = "Invalid API key",
  Fa = "Client not initialized",
  te;
(function (t) {
  ((t.Unknown = "unknown"),
    (t.Skipped = "skipped"),
    (t.Success = "success"),
    (t.RateLimit = "rate_limit"),
    (t.PayloadTooLarge = "payload_too_large"),
    (t.Invalid = "invalid"),
    (t.Failed = "failed"),
    (t.Timeout = "Timeout"),
    (t.SystemError = "SystemError"));
})(te || (te = {}));
var Ge = function (t, e, r) {
    return (
      e === void 0 && (e = 0),
      r === void 0 && (r = te.Unknown),
      { event: t, code: e, message: r }
    );
  },
  B = function () {
    var t = "ampIntegrationContext";
    if (typeof globalThis < "u" && typeof globalThis[t] < "u")
      return globalThis[t];
    if (typeof globalThis < "u") return globalThis;
    if (typeof window < "u") return window;
    if (typeof self < "u") return self;
    if (typeof global < "u") return global;
  },
  qa = function (t) {
    return t
      ? (t ^ ((Math.random() * 16) >> (t / 4))).toString(16)
      : (
          String(1e7) +
          String(-1e3) +
          String(-4e3) +
          String(-8e3) +
          String(-1e11)
        ).replace(/[018]/g, Re);
  },
  Rn = V([], L(Array(256).keys()), !1).map(function (t) {
    return t.toString(16).padStart(2, "0");
  }),
  Re = function (t) {
    var e,
      r = B();
    if (!(!((e = r?.crypto) === null || e === void 0) && e.getRandomValues))
      return qa(t);
    var n = r.crypto.getRandomValues(new Uint8Array(16));
    return (
      (n[6] = (n[6] & 15) | 64),
      (n[8] = (n[8] & 63) | 128),
      V([], L(n.entries()), !1)
        .map(function (i) {
          var o = L(i, 2),
            a = o[0],
            s = o[1];
          return [4, 6, 8, 10].includes(a) ? "-".concat(Rn[s]) : Rn[s];
        })
        .join("")
    );
  },
  Ba = (function () {
    function t(e) {
      ((this.client = e),
        (this.queue = []),
        (this.applying = !1),
        (this.plugins = []));
    }
    return (
      (t.prototype.register = function (e, r) {
        var n, i;
        return S(this, void 0, void 0, function () {
          return E(this, function (o) {
            switch (o.label) {
              case 0:
                return this.plugins.some(function (a) {
                  return a.name === e.name;
                })
                  ? (this.loggerProvider.warn(
                      "Plugin with name ".concat(
                        e.name,
                        " already exists, skipping registration",
                      ),
                    ),
                    [2])
                  : (e.name === void 0 &&
                      ((e.name = Re()),
                      this.loggerProvider.warn(
                        `Plugin name is undefined. 
      Generating a random UUID for plugin name: `.concat(
                          e.name,
                          `. 
      Set a name for the plugin to prevent it from being added multiple times.`,
                        ),
                      )),
                    (e.type =
                      (n = e.type) !== null && n !== void 0 ? n : "enrichment"),
                    [
                      4,
                      (i = e.setup) === null || i === void 0
                        ? void 0
                        : i.call(e, r, this.client),
                    ]);
              case 1:
                return (o.sent(), this.plugins.push(e), [2]);
            }
          });
        });
      }),
      (t.prototype.deregister = function (e, r) {
        var n;
        return S(this, void 0, void 0, function () {
          var i, o;
          return E(this, function (a) {
            switch (a.label) {
              case 0:
                return (
                  (i = this.plugins.findIndex(function (s) {
                    return s.name === e;
                  })),
                  i === -1
                    ? (r.loggerProvider.warn(
                        "Plugin with name ".concat(
                          e,
                          " does not exist, skipping deregistration",
                        ),
                      ),
                      [2])
                    : ((o = this.plugins[i]),
                      this.plugins.splice(i, 1),
                      [
                        4,
                        (n = o.teardown) === null || n === void 0
                          ? void 0
                          : n.call(o),
                      ])
                );
              case 1:
                return (a.sent(), [2]);
            }
          });
        });
      }),
      (t.prototype.reset = function (e) {
        this.applying = !1;
        var r = this.plugins;
        (r.map(function (n) {
          var i;
          return (i = n.teardown) === null || i === void 0 ? void 0 : i.call(n);
        }),
          (this.plugins = []),
          (this.client = e));
      }),
      (t.prototype.push = function (e) {
        var r = this;
        return new Promise(function (n) {
          (r.queue.push([e, n]), r.scheduleApply(0));
        });
      }),
      (t.prototype.scheduleApply = function (e) {
        var r = this;
        this.applying ||
          ((this.applying = !0),
          setTimeout(function () {
            r.apply(r.queue.shift()).then(function () {
              ((r.applying = !1), r.queue.length > 0 && r.scheduleApply(0));
            });
          }, e));
      }),
      (t.prototype.apply = function (e) {
        return S(this, void 0, void 0, function () {
          var r, n, i, o, a, s, u, v, h, c, l, f, d, v, h, m, y, p, g, b, T, w;
          return E(this, function (I) {
            switch (I.label) {
              case 0:
                if (!e) return [2];
                ((r = L(e, 1)),
                  (n = r[0]),
                  (i = L(e, 2)),
                  (o = i[1]),
                  this.loggerProvider.log("Timeline.apply: Initial event", n),
                  (a = this.plugins.filter(function (_) {
                    return _.type === "before";
                  })),
                  (I.label = 1));
              case 1:
                (I.trys.push([1, 6, 7, 8]),
                  (s = x(a)),
                  (u = s.next()),
                  (I.label = 2));
              case 2:
                return u.done
                  ? [3, 5]
                  : ((v = u.value),
                    v.execute ? [4, v.execute(C({}, n))] : [3, 4]);
              case 3:
                if (((h = I.sent()), h === null))
                  return (
                    this.loggerProvider.log(
                      "Timeline.apply: Event filtered out by before plugin '"
                        .concat(String(v.name), "', event: ")
                        .concat(JSON.stringify(n)),
                    ),
                    o({ event: n, code: 0, message: "" }),
                    [2]
                  );
                ((n = h),
                  this.loggerProvider.log(
                    "Timeline.apply: Event after before plugin '"
                      .concat(String(v.name), "', event: ")
                      .concat(JSON.stringify(n)),
                  ),
                  (I.label = 4));
              case 4:
                return ((u = s.next()), [3, 2]);
              case 5:
                return [3, 8];
              case 6:
                return ((c = I.sent()), (g = { error: c }), [3, 8]);
              case 7:
                try {
                  u && !u.done && (b = s.return) && b.call(s);
                } finally {
                  if (g) throw g.error;
                }
                return [7];
              case 8:
                ((l = this.plugins.filter(function (_) {
                  return _.type === "enrichment" || _.type === void 0;
                })),
                  (I.label = 9));
              case 9:
                (I.trys.push([9, 14, 15, 16]),
                  (f = x(l)),
                  (d = f.next()),
                  (I.label = 10));
              case 10:
                return d.done
                  ? [3, 13]
                  : ((v = d.value),
                    v.execute ? [4, v.execute(C({}, n))] : [3, 12]);
              case 11:
                if (((h = I.sent()), h === null))
                  return (
                    this.loggerProvider.log(
                      "Timeline.apply: Event filtered out by enrichment plugin '"
                        .concat(String(v.name), "', event: ")
                        .concat(JSON.stringify(n)),
                    ),
                    o({ event: n, code: 0, message: "" }),
                    [2]
                  );
                ((n = h),
                  this.loggerProvider.log(
                    "Timeline.apply: Event after enrichment plugin '"
                      .concat(String(v.name), "', event: ")
                      .concat(JSON.stringify(n)),
                  ),
                  (I.label = 12));
              case 12:
                return ((d = f.next()), [3, 10]);
              case 13:
                return [3, 16];
              case 14:
                return ((m = I.sent()), (T = { error: m }), [3, 16]);
              case 15:
                try {
                  d && !d.done && (w = f.return) && w.call(f);
                } finally {
                  if (T) throw T.error;
                }
                return [7];
              case 16:
                return (
                  (y = this.plugins.filter(function (_) {
                    return _.type === "destination";
                  })),
                  this.loggerProvider.log(
                    "Timeline.apply: Final event before destinations, event: ".concat(
                      JSON.stringify(n),
                    ),
                  ),
                  (p = y.map(function (_) {
                    var P = C({}, n);
                    return _.execute(P).catch(function (k) {
                      return Ge(P, 0, String(k));
                    });
                  })),
                  Promise.all(p).then(function (_) {
                    var P = L(_, 1),
                      k = P[0],
                      A =
                        k ||
                        Ge(
                          n,
                          100,
                          "Event not tracked, no destination plugins on the instance",
                        );
                    o(A);
                  }),
                  [2]
                );
            }
          });
        });
      }),
      (t.prototype.flush = function () {
        return S(this, void 0, void 0, function () {
          var e,
            r,
            n,
            i = this;
          return E(this, function (o) {
            switch (o.label) {
              case 0:
                return (
                  (e = this.queue),
                  (this.queue = []),
                  [
                    4,
                    Promise.all(
                      e.map(function (a) {
                        return i.apply(a);
                      }),
                    ),
                  ]
                );
              case 1:
                return (
                  o.sent(),
                  (r = this.plugins.filter(function (a) {
                    return a.type === "destination";
                  })),
                  (n = r.map(function (a) {
                    return a.flush && a.flush();
                  })),
                  [4, Promise.all(n)]
                );
              case 2:
                return (o.sent(), [2]);
            }
          });
        });
      }),
      (t.prototype.onIdentityChanged = function (e) {
        this.plugins.forEach(function (r) {
          var n;
          (n = r.onIdentityChanged) === null || n === void 0 || n.call(r, e);
        });
      }),
      (t.prototype.onSessionIdChanged = function (e) {
        this.plugins.forEach(function (r) {
          var n;
          (n = r.onSessionIdChanged) === null || n === void 0 || n.call(r, e);
        });
      }),
      (t.prototype.onOptOutChanged = function (e) {
        this.plugins.forEach(function (r) {
          var n;
          (n = r.onOptOutChanged) === null || n === void 0 || n.call(r, e);
        });
      }),
      (t.prototype.onReset = function () {
        this.plugins.forEach(function (e) {
          var r;
          (r = e.onReset) === null || r === void 0 || r.call(e);
        });
      }),
      t
    );
  })(),
  Va = function (t, e, r) {
    var n = typeof t == "string" ? { event_type: t } : t;
    return C(C(C({}, n), r), e && { event_properties: e });
  },
  Xr = function (t, e) {
    var r = C(C({}, e), {
      event_type: se.IDENTIFY,
      user_properties: t.getUserProperties(),
    });
    return r;
  },
  ja = function (t, e, r, n) {
    var i,
      o = C(C({}, n), {
        event_type: se.GROUP_IDENTIFY,
        group_properties: r.getUserProperties(),
        groups: ((i = {}), (i[t] = e), i),
      });
    return o;
  },
  Ga = function (t, e, r) {
    var n,
      i = new He();
    i.set(t, e);
    var o = C(C({}, r), {
      event_type: se.IDENTIFY,
      user_properties: i.getUserProperties(),
      groups: ((n = {}), (n[t] = e), n),
    });
    return o;
  },
  Ha = function (t, e) {
    return C(C({}, e), {
      event_type: se.REVENUE,
      event_properties: t.getEventProperties(),
    });
  },
  ie = function (t) {
    return { promise: t || Promise.resolve() };
  },
  Wa = (function () {
    function t(e) {
      (e === void 0 && (e = "$default"),
        (this.initializing = !1),
        (this.isReady = !1),
        (this.q = []),
        (this.dispatchQ = []),
        (this.logEvent = this.track.bind(this)),
        (this.timeline = new Ba(this)),
        (this.name = e));
    }
    return (
      (t.prototype._init = function (e) {
        return S(this, void 0, void 0, function () {
          return E(this, function (r) {
            switch (r.label) {
              case 0:
                return (
                  (this.config = e),
                  this.timeline.reset(this),
                  (this.timeline.loggerProvider = this.config.loggerProvider),
                  [4, this.runQueuedFunctions("q")]
                );
              case 1:
                return (r.sent(), (this.isReady = !0), [2]);
            }
          });
        });
      }),
      (t.prototype.runQueuedFunctions = function (e) {
        return S(this, void 0, void 0, function () {
          var r, n, i, o, a, s, u, c;
          return E(this, function (l) {
            switch (l.label) {
              case 0:
                ((r = this[e]), (this[e] = []), (l.label = 1));
              case 1:
                (l.trys.push([1, 8, 9, 10]),
                  (n = x(r)),
                  (i = n.next()),
                  (l.label = 2));
              case 2:
                return i.done
                  ? [3, 7]
                  : ((o = i.value),
                    (a = o()),
                    a && "promise" in a ? [4, a.promise] : [3, 4]);
              case 3:
                return (l.sent(), [3, 6]);
              case 4:
                return [4, a];
              case 5:
                (l.sent(), (l.label = 6));
              case 6:
                return ((i = n.next()), [3, 2]);
              case 7:
                return [3, 10];
              case 8:
                return ((s = l.sent()), (u = { error: s }), [3, 10]);
              case 9:
                try {
                  i && !i.done && (c = n.return) && c.call(n);
                } finally {
                  if (u) throw u.error;
                }
                return [7];
              case 10:
                return this[e].length
                  ? [4, this.runQueuedFunctions(e)]
                  : [3, 12];
              case 11:
                (l.sent(), (l.label = 12));
              case 12:
                return [2];
            }
          });
        });
      }),
      (t.prototype.track = function (e, r, n) {
        var i = Va(e, r, n);
        return ie(this.dispatch(i));
      }),
      (t.prototype.identify = function (e, r) {
        var n = Xr(e, r);
        return ie(this.dispatch(n));
      }),
      (t.prototype.groupIdentify = function (e, r, n, i) {
        var o = ja(e, r, n, i);
        return ie(this.dispatch(o));
      }),
      (t.prototype.setGroup = function (e, r, n) {
        var i = Ga(e, r, n);
        return ie(this.dispatch(i));
      }),
      (t.prototype.revenue = function (e, r) {
        var n = Ha(e, r);
        return ie(this.dispatch(n));
      }),
      (t.prototype.add = function (e) {
        return this.isReady
          ? this._addPlugin(e)
          : (this.q.push(this._addPlugin.bind(this, e)), ie());
      }),
      (t.prototype._addPlugin = function (e) {
        return ie(this.timeline.register(e, this.config));
      }),
      (t.prototype.remove = function (e) {
        return this.isReady
          ? this._removePlugin(e)
          : (this.q.push(this._removePlugin.bind(this, e)), ie());
      }),
      (t.prototype._removePlugin = function (e) {
        return ie(this.timeline.deregister(e, this.config));
      }),
      (t.prototype.dispatchWithCallback = function (e, r) {
        if (!this.isReady) return r(Ge(e, 0, Fa));
        this.process(e).then(r);
      }),
      (t.prototype.dispatch = function (e) {
        return S(this, void 0, void 0, function () {
          var r = this;
          return E(this, function (n) {
            return this.isReady
              ? [2, this.process(e)]
              : [
                  2,
                  new Promise(function (i) {
                    r.dispatchQ.push(r.dispatchWithCallback.bind(r, e, i));
                  }),
                ];
          });
        });
      }),
      (t.prototype.getOperationAppliedUserProperties = function (e) {
        var r = {};
        if (e === void 0) return r;
        var n = {};
        return (
          Object.keys(e).forEach(function (i) {
            Object.values(Ce).includes(i) || (n[i] = e[i]);
          }),
          Oa.forEach(function (i) {
            if (Object.keys(e).includes(i)) {
              var o = e[i];
              switch (i) {
                case Ce.CLEAR_ALL:
                  Object.keys(r).forEach(function (a) {
                    delete r[a];
                  });
                  break;
                case Ce.UNSET:
                  Object.keys(o).forEach(function (a) {
                    delete r[a];
                  });
                  break;
                case Ce.SET:
                  Object.assign(r, o);
                  break;
              }
            }
          }),
          Object.assign(r, n),
          r
        );
      }),
      (t.prototype.process = function (e) {
        return S(this, void 0, void 0, function () {
          var r, o, n, i, o;
          return E(this, function (a) {
            switch (a.label) {
              case 0:
                return (
                  a.trys.push([0, 2, , 3]),
                  this.config.optOut
                    ? [2, Ge(e, 0, Ma)]
                    : (e.event_type === se.IDENTIFY &&
                        ((r = this.getOperationAppliedUserProperties(
                          e.user_properties,
                        )),
                        this.timeline.onIdentityChanged({ userProperties: r })),
                      [4, this.timeline.push(e)])
                );
              case 1:
                return (
                  (o = a.sent()),
                  o.code === 200
                    ? this.config.loggerProvider.log(o.message)
                    : o.code === 100
                      ? this.config.loggerProvider.warn(o.message)
                      : this.config.loggerProvider.error(o.message),
                  [2, o]
                );
              case 2:
                return (
                  (n = a.sent()),
                  (i = String(n)),
                  this.config.loggerProvider.error(i),
                  (o = Ge(e, 0, i)),
                  [2, o]
                );
              case 3:
                return [2];
            }
          });
        });
      }),
      (t.prototype.setOptOut = function (e) {
        if (!this.isReady) {
          this.q.push(this._setOptOut.bind(this, !!e));
          return;
        }
        this._setOptOut(e);
      }),
      (t.prototype._setOptOut = function (e) {
        this.config.optOut !== e &&
          (this.timeline.onOptOutChanged(e), (this.config.optOut = !!e));
      }),
      (t.prototype.flush = function () {
        return ie(this.timeline.flush());
      }),
      (t.prototype.plugin = function (e) {
        var r = this.timeline.plugins.find(function (n) {
          return n.name === e;
        });
        if (r === void 0) {
          this.config.loggerProvider.debug(
            "Cannot find plugin with name ".concat(e),
          );
          return;
        }
        return r;
      }),
      (t.prototype.plugins = function (e) {
        return this.timeline.plugins.filter(function (r) {
          return r instanceof e;
        });
      }),
      t
    );
  })(),
  Ka = (function () {
    function t() {
      ((this.productId = ""), (this.quantity = 1), (this.price = 0));
    }
    return (
      (t.prototype.setProductId = function (e) {
        return ((this.productId = e), this);
      }),
      (t.prototype.setQuantity = function (e) {
        return (e > 0 && (this.quantity = e), this);
      }),
      (t.prototype.setPrice = function (e) {
        return ((this.price = e), this);
      }),
      (t.prototype.setRevenueType = function (e) {
        return ((this.revenueType = e), this);
      }),
      (t.prototype.setCurrency = function (e) {
        return ((this.currency = e), this);
      }),
      (t.prototype.setRevenue = function (e) {
        return ((this.revenue = e), this);
      }),
      (t.prototype.setReceipt = function (e) {
        return ((this.receipt = e), this);
      }),
      (t.prototype.setReceiptSig = function (e) {
        return ((this.receiptSig = e), this);
      }),
      (t.prototype.setEventProperties = function (e) {
        return (_r(e) && (this.properties = e), this);
      }),
      (t.prototype.getEventProperties = function () {
        var e = this.properties ? C({}, this.properties) : {};
        return (
          (e[pe.REVENUE_PRODUCT_ID] = this.productId),
          (e[pe.REVENUE_QUANTITY] = this.quantity),
          (e[pe.REVENUE_PRICE] = this.price),
          (e[pe.REVENUE_TYPE] = this.revenueType),
          (e[pe.REVENUE_CURRENCY] = this.currency),
          (e[pe.REVENUE] = this.revenue),
          (e[pe.RECEIPT] = this.receipt),
          (e[pe.RECEIPT_SIG] = this.receiptSig),
          e
        );
      }),
      t
    );
  })(),
  pe;
(function (t) {
  ((t.REVENUE_PRODUCT_ID = "$productId"),
    (t.REVENUE_QUANTITY = "$quantity"),
    (t.REVENUE_PRICE = "$price"),
    (t.REVENUE_TYPE = "$revenueType"),
    (t.REVENUE_CURRENCY = "$currency"),
    (t.REVENUE = "$revenue"),
    (t.RECEIPT = "$receipt"),
    (t.RECEIPT_SIG = "$receiptSig"));
})(pe || (pe = {}));
var za = function (t, e) {
    var r = Math.max(e, 1);
    return t.reduce(function (n, i, o) {
      var a = Math.floor(o / r);
      return (n[a] || (n[a] = []), n[a].push(i), n);
    }, []);
  },
  ae;
(function (t) {
  ((t[(t.None = 0)] = "None"),
    (t[(t.Error = 1)] = "Error"),
    (t[(t.Warn = 2)] = "Warn"),
    (t[(t.Verbose = 3)] = "Verbose"),
    (t[(t.Debug = 4)] = "Debug"));
})(ae || (ae = {}));
var Et = "Amplitude Logger ",
  gt = (function () {
    function t() {
      this.logLevel = ae.None;
    }
    return (
      (t.prototype.disable = function () {
        this.logLevel = ae.None;
      }),
      (t.prototype.enable = function (e) {
        (e === void 0 && (e = ae.Warn), (this.logLevel = e));
      }),
      (t.prototype.log = function () {
        for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
        this.logLevel < ae.Verbose ||
          console.log("".concat(Et, "[Log]: ").concat(e.join(" ")));
      }),
      (t.prototype.warn = function () {
        for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
        this.logLevel < ae.Warn ||
          console.warn("".concat(Et, "[Warn]: ").concat(e.join(" ")));
      }),
      (t.prototype.error = function () {
        for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
        this.logLevel < ae.Error ||
          console.error("".concat(Et, "[Error]: ").concat(e.join(" ")));
      }),
      (t.prototype.debug = function () {
        for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
        this.logLevel < ae.Debug ||
          console.log("".concat(Et, "[Debug]: ").concat(e.join(" ")));
      }),
      t
    );
  })(),
  kt = function () {
    return {
      flushMaxRetries: 12,
      flushQueueSize: 200,
      flushIntervalMillis: 1e4,
      instanceName: Hi,
      logLevel: ae.Warn,
      loggerProvider: new gt(),
      offline: !1,
      optOut: !1,
      serverUrl: Wi,
      serverZone: "US",
      useBatch: !1,
    };
  },
  zi = (function () {
    function t(e) {
      var r, n, i, o;
      this._optOut = !1;
      var a = kt();
      ((this.apiKey = e.apiKey),
        (this.flushIntervalMillis =
          (r = e.flushIntervalMillis) !== null && r !== void 0
            ? r
            : a.flushIntervalMillis),
        (this.flushMaxRetries = e.flushMaxRetries || a.flushMaxRetries),
        (this.flushQueueSize = e.flushQueueSize || a.flushQueueSize),
        (this.instanceName = e.instanceName || a.instanceName),
        (this.loggerProvider = e.loggerProvider || a.loggerProvider),
        (this.logLevel =
          (n = e.logLevel) !== null && n !== void 0 ? n : a.logLevel),
        (this.minIdLength = e.minIdLength),
        (this.plan = e.plan),
        (this.ingestionMetadata = e.ingestionMetadata),
        (this.offline = e.offline !== void 0 ? e.offline : a.offline),
        (this.optOut = (i = e.optOut) !== null && i !== void 0 ? i : a.optOut),
        (this.serverUrl = e.serverUrl),
        (this.serverZone = e.serverZone || a.serverZone),
        (this.storageProvider = e.storageProvider),
        (this.transportProvider = e.transportProvider),
        (this.useBatch =
          (o = e.useBatch) !== null && o !== void 0 ? o : a.useBatch),
        this.loggerProvider.enable(this.logLevel));
      var s = $i(e.serverUrl, e.serverZone, e.useBatch);
      ((this.serverZone = s.serverZone), (this.serverUrl = s.serverUrl));
    }
    return (
      Object.defineProperty(t.prototype, "optOut", {
        get: function () {
          return this._optOut;
        },
        set: function (e) {
          this._optOut = e;
        },
        enumerable: !1,
        configurable: !0,
      }),
      t
    );
  })(),
  $a = function (t, e) {
    return t === "EU" ? (e ? Ta : Ea) : e ? Sa : Wi;
  },
  $i = function (t, e, r) {
    if (
      (t === void 0 && (t = ""),
      e === void 0 && (e = kt().serverZone),
      r === void 0 && (r = kt().useBatch),
      t)
    )
      return { serverUrl: t, serverZone: void 0 };
    var n = ["US", "EU"].includes(e) ? e : kt().serverZone;
    return { serverZone: n, serverUrl: $a(n, r) };
  },
  Xa = (function () {
    function t() {
      this.sdk = { metrics: { histogram: {} } };
    }
    return (
      (t.prototype.recordHistogram = function (e, r) {
        this.sdk.metrics.histogram[e] = r;
      }),
      t
    );
  })();
function Pr(t) {
  return t >= 200 && t < 300;
}
var Rt = function (t) {
    t === void 0 && (t = 0);
    var e = new Error().stack || "";
    return e
      .split(
        `
`,
      )
      .slice(2 + t)
      .map(function (r) {
        return r.trim();
      });
  },
  Z = function (t) {
    return function () {
      var e = C({}, t.config),
        r = e.loggerProvider,
        n = e.logLevel;
      return { logger: r, logLevel: n };
    };
  },
  Ya = function (t, e) {
    var r, n;
    ((e = e.replace(/\[(\w+)\]/g, ".$1")), (e = e.replace(/^\./, "")));
    try {
      for (var i = x(e.split(".")), o = i.next(); !o.done; o = i.next()) {
        var a = o.value;
        if (a in t) t = t[a];
        else return;
      }
    } catch (s) {
      r = { error: s };
    } finally {
      try {
        o && !o.done && (n = i.return) && n.call(i);
      } finally {
        if (r) throw r.error;
      }
    }
    return t;
  },
  ee = function (t, e) {
    return function () {
      var r,
        n,
        i = {};
      try {
        for (var o = x(e), a = o.next(); !a.done; a = o.next()) {
          var s = a.value;
          i[s] = Ya(t, s);
        }
      } catch (u) {
        r = { error: u };
      } finally {
        try {
          a && !a.done && (n = o.return) && n.call(o);
        } finally {
          if (r) throw r.error;
        }
      }
      return i;
    };
  },
  z = function (t, e, r, n, i) {
    return (
      i === void 0 && (i = null),
      function () {
        for (var o = [], a = 0; a < arguments.length; a++) o[a] = arguments[a];
        var s = r(),
          u = s.logger,
          c = s.logLevel;
        if ((c && c < ae.Debug) || !c || !u) return t.apply(i, o);
        var l = {
          type: "invoke public method",
          name: e,
          args: o,
          stacktrace: Rt(1),
          time: { start: new Date().toISOString() },
          states: {},
        };
        n && l.states && (l.states.before = n());
        var f = t.apply(i, o);
        return (
          f && f.promise
            ? f.promise.then(function () {
                (n && l.states && (l.states.after = n()),
                  l.time && (l.time.end = new Date().toISOString()),
                  u.debug(JSON.stringify(l, null, 2)));
              })
            : (n && l.states && (l.states.after = n()),
              l.time && (l.time.end = new Date().toISOString()),
              u.debug(JSON.stringify(l, null, 2))),
          f
        );
      }
    );
  };
function Ja(t) {
  return t instanceof Error ? t.message : String(t);
}
function Je(t) {
  var e = "";
  try {
    "body" in t && (e = JSON.stringify(t.body, null, 2));
  } catch {}
  return e;
}
var Qa = (function () {
    function t(e) {
      ((this.name = "amplitude"),
        (this.type = "destination"),
        (this.retryTimeout = 1e3),
        (this.throttleTimeout = 3e4),
        (this.storageKey = ""),
        (this.scheduleId = null),
        (this.scheduledTimeout = 0),
        (this.flushId = null),
        (this.queue = []),
        (this.diagnosticsClient = e?.diagnosticsClient));
    }
    return (
      (t.prototype.setup = function (e) {
        var r;
        return S(this, void 0, void 0, function () {
          var n,
            i = this;
          return E(this, function (o) {
            switch (o.label) {
              case 0:
                return (
                  (this.config = e),
                  (this.storageKey = ""
                    .concat(Gi, "_")
                    .concat(this.config.apiKey.substring(0, 10))),
                  [
                    4,
                    (r = this.config.storageProvider) === null || r === void 0
                      ? void 0
                      : r.get(this.storageKey),
                  ]
                );
              case 1:
                return (
                  (n = o.sent()),
                  n &&
                    n.length > 0 &&
                    Promise.all(
                      n.map(function (a) {
                        return i.execute(a);
                      }),
                    ).catch(),
                  [2, Promise.resolve(void 0)]
                );
            }
          });
        });
      }),
      (t.prototype.execute = function (e) {
        var r = this;
        return (
          e.insert_id || (e.insert_id = Re()),
          new Promise(function (n) {
            var i = {
              event: e,
              attempts: 0,
              callback: function (o) {
                return n(o);
              },
              timeout: 0,
            };
            (r.queue.push(i),
              r.schedule(r.config.flushIntervalMillis),
              r.saveEvents());
          })
        );
      }),
      (t.prototype.removeEventsExceedFlushMaxRetries = function (e) {
        var r = this;
        return e.filter(function (n) {
          return (
            (n.attempts += 1),
            n.attempts < r.config.flushMaxRetries
              ? !0
              : (r.fulfillRequest([n], 500, Na), !1)
          );
        });
      }),
      (t.prototype.scheduleEvents = function (e) {
        var r = this;
        e.forEach(function (n) {
          r.schedule(
            n.timeout === 0 ? r.config.flushIntervalMillis : n.timeout,
          );
        });
      }),
      (t.prototype.schedule = function (e) {
        var r = this;
        if (
          !this.config.offline &&
          (this.scheduleId === null ||
            (this.scheduleId && e > this.scheduledTimeout))
        ) {
          (this.scheduleId && clearTimeout(this.scheduleId),
            (this.scheduledTimeout = e),
            (this.scheduleId = setTimeout(function () {
              ((r.queue = r.queue.map(function (n) {
                return ((n.timeout = 0), n);
              })),
                r.flush(!0));
            }, e)));
          return;
        }
      }),
      (t.prototype.resetSchedule = function () {
        ((this.scheduleId = null), (this.scheduledTimeout = 0));
      }),
      (t.prototype.flush = function (e) {
        return (
          e === void 0 && (e = !1),
          S(this, void 0, void 0, function () {
            var r,
              n,
              i,
              o = this;
            return E(this, function (a) {
              switch (a.label) {
                case 0:
                  return this.config.offline
                    ? (this.resetSchedule(),
                      this.config.loggerProvider.debug(
                        "Skipping flush while offline.",
                      ),
                      [2])
                    : this.flushId
                      ? (this.resetSchedule(),
                        this.config.loggerProvider.debug(
                          "Skipping flush because previous flush has not resolved.",
                        ),
                        [2])
                      : ((this.flushId = this.scheduleId),
                        this.resetSchedule(),
                        (r = []),
                        (n = []),
                        this.queue.forEach(function (s) {
                          return s.timeout === 0 ? r.push(s) : n.push(s);
                        }),
                        (i = za(r, this.config.flushQueueSize)),
                        [
                          4,
                          i.reduce(function (s, u) {
                            return S(o, void 0, void 0, function () {
                              return E(this, function (c) {
                                switch (c.label) {
                                  case 0:
                                    return [4, s];
                                  case 1:
                                    return (c.sent(), [4, this.send(u, e)]);
                                  case 2:
                                    return [2, c.sent()];
                                }
                              });
                            });
                          }, Promise.resolve()),
                        ]);
                case 1:
                  return (
                    a.sent(),
                    (this.flushId = null),
                    this.scheduleEvents(this.queue),
                    [2]
                  );
              }
            });
          })
        );
      }),
      (t.prototype.send = function (e, r) {
        var n;
        return (
          r === void 0 && (r = !0),
          S(this, void 0, void 0, function () {
            var i, o, a, s, u;
            return E(this, function (c) {
              switch (c.label) {
                case 0:
                  if (!this.config.apiKey)
                    return [2, this.fulfillRequest(e, 400, xa)];
                  ((i = {
                    api_key: this.config.apiKey,
                    events: e.map(function (l) {
                      var f = l.event;
                      f.extra;
                      var d = Ut(f, ["extra"]);
                      return d;
                    }),
                    options: { min_id_length: this.config.minIdLength },
                    client_upload_time: new Date().toISOString(),
                    request_metadata: this.config.requestMetadata,
                  }),
                    (this.config.requestMetadata = new Xa()),
                    (c.label = 1));
                case 1:
                  return (
                    c.trys.push([1, 3, , 4]),
                    (o = $i(
                      this.config.serverUrl,
                      this.config.serverZone,
                      this.config.useBatch,
                    ).serverUrl),
                    [4, this.config.transportProvider.send(o, i)]
                  );
                case 2:
                  return (
                    (a = c.sent()),
                    a === null
                      ? (this.fulfillRequest(e, 0, Da), [2])
                      : r
                        ? (this.handleResponse(a, e), [3, 4])
                        : ("body" in a
                            ? this.fulfillRequest(
                                e,
                                a.statusCode,
                                "".concat(a.status, ": ").concat(Je(a)),
                              )
                            : this.fulfillRequest(e, a.statusCode, a.status),
                          [2])
                  );
                case 3:
                  return (
                    (s = c.sent()),
                    (u = Ja(s)),
                    this.config.loggerProvider.error(u),
                    (n = this.diagnosticsClient) === null ||
                      n === void 0 ||
                      n.recordEvent(
                        "analytics.events.unsuccessful.from.catch.error",
                        {
                          events: e.map(function (l) {
                            return l.event.event_type;
                          }),
                          message: u,
                          stack_trace: Rt(),
                        },
                      ),
                    this.handleResponse(
                      { status: te.Failed, statusCode: 0 },
                      e,
                    ),
                    [3, 4]
                  );
                case 4:
                  return [2];
              }
            });
          })
        );
      }),
      (t.prototype.handleResponse = function (e, r) {
        var n;
        Pr(e.statusCode) ||
          (n = this.diagnosticsClient) === null ||
          n === void 0 ||
          n.recordEvent("analytics.events.unsuccessful", {
            events: r.map(function (o) {
              return o.event.event_type;
            }),
            code: e.statusCode,
            status: e.status,
            body: Je(e),
            stack_trace: Rt(),
          });
        var i = e.status;
        switch (i) {
          case te.Success: {
            this.handleSuccessResponse(e, r);
            break;
          }
          case te.Invalid: {
            this.handleInvalidResponse(e, r);
            break;
          }
          case te.PayloadTooLarge: {
            this.handlePayloadTooLargeResponse(e, r);
            break;
          }
          case te.RateLimit: {
            this.handleRateLimitResponse(e, r);
            break;
          }
          default: {
            (this.config.loggerProvider.warn(
              `{code: 0, error: "Status '`
                .concat(i, "' provided for ")
                .concat(r.length, ' events"}'),
            ),
              this.handleOtherResponse(r));
            break;
          }
        }
      }),
      (t.prototype.handleSuccessResponse = function (e, r) {
        this.fulfillRequest(r, e.statusCode, La);
      }),
      (t.prototype.handleInvalidResponse = function (e, r) {
        var n = this;
        if (e.body.missingField || e.body.error.startsWith(Ua)) {
          this.fulfillRequest(r, e.statusCode, e.body.error);
          return;
        }
        var i = V(
            V(
              V(
                V([], L(Object.values(e.body.eventsWithInvalidFields)), !1),
                L(Object.values(e.body.eventsWithMissingFields)),
                !1,
              ),
              L(Object.values(e.body.eventsWithInvalidIdLengths)),
              !1,
            ),
            L(e.body.silencedEvents),
            !1,
          ).flat(),
          o = new Set(i),
          a = r.filter(function (u, c) {
            if (o.has(c)) {
              n.fulfillRequest([u], e.statusCode, e.body.error);
              return;
            }
            return !0;
          });
        a.length > 0 && this.config.loggerProvider.warn(Je(e));
        var s = this.removeEventsExceedFlushMaxRetries(a);
        this.scheduleEvents(s);
      }),
      (t.prototype.handlePayloadTooLargeResponse = function (e, r) {
        if (r.length === 1) {
          this.fulfillRequest(r, e.statusCode, e.body.error);
          return;
        }
        (this.config.loggerProvider.warn(Je(e)),
          (this.config.flushQueueSize /= 2));
        var n = this.removeEventsExceedFlushMaxRetries(r);
        this.scheduleEvents(n);
      }),
      (t.prototype.handleRateLimitResponse = function (e, r) {
        var n = this,
          i = Object.keys(e.body.exceededDailyQuotaUsers),
          o = Object.keys(e.body.exceededDailyQuotaDevices),
          a = e.body.throttledEvents,
          s = new Set(i),
          u = new Set(o),
          c = new Set(a),
          l = r.filter(function (d, v) {
            if (
              (d.event.user_id && s.has(d.event.user_id)) ||
              (d.event.device_id && u.has(d.event.device_id))
            ) {
              n.fulfillRequest([d], e.statusCode, e.body.error);
              return;
            }
            return (c.has(v) && (d.timeout = n.throttleTimeout), !0);
          });
        l.length > 0 && this.config.loggerProvider.warn(Je(e));
        var f = this.removeEventsExceedFlushMaxRetries(l);
        this.scheduleEvents(f);
      }),
      (t.prototype.handleOtherResponse = function (e) {
        var r = this,
          n = e.map(function (o) {
            return ((o.timeout = o.attempts * r.retryTimeout), o);
          }),
          i = this.removeEventsExceedFlushMaxRetries(n);
        this.scheduleEvents(i);
      }),
      (t.prototype.fulfillRequest = function (e, r, n) {
        var i, o, a;
        (Pr(r)
          ? (a = this.diagnosticsClient) === null ||
            a === void 0 ||
            a.increment("analytics.events.sent", e.length)
          : ((i = this.diagnosticsClient) === null ||
              i === void 0 ||
              i.increment("analytics.events.dropped", e.length),
            (o = this.diagnosticsClient) === null ||
              o === void 0 ||
              o.recordEvent("analytics.events.dropped", {
                events: e.map(function (s) {
                  return s.event.event_type;
                }),
                code: r,
                message: n,
                stack_trace: Rt(),
              })),
          this.removeEvents(e),
          e.forEach(function (s) {
            return s.callback(Ge(s.event, r, n));
          }));
      }),
      (t.prototype.saveEvents = function () {
        if (this.config.storageProvider) {
          var e = this.queue.map(function (r) {
            return r.event;
          });
          this.config.storageProvider.set(this.storageKey, e);
        }
      }),
      (t.prototype.removeEvents = function (e) {
        ((this.queue = this.queue.filter(function (r) {
          return !e.some(function (n) {
            return n.event.insert_id === r.event.insert_id;
          });
        })),
          this.saveEvents());
      }),
      t
    );
  })(),
  Za = (function () {
    function t() {}
    return (
      (t.prototype.getApplicationContext = function () {
        return {
          versionName: this.versionName,
          language: es(),
          platform: "Web",
          os: void 0,
          deviceModel: void 0,
        };
      }),
      t
    );
  })(),
  es = function () {
    return (
      (typeof navigator < "u" &&
        ((navigator.languages && navigator.languages[0]) ||
          navigator.language)) ||
      ""
    );
  },
  ts = (function () {
    function t() {
      this.queue = [];
    }
    return (
      (t.prototype.logEvent = function (e) {
        this.receiver
          ? this.receiver(e)
          : this.queue.length < 512 && this.queue.push(e);
      }),
      (t.prototype.setEventReceiver = function (e) {
        ((this.receiver = e),
          this.queue.length > 0 &&
            (this.queue.forEach(function (r) {
              e(r);
            }),
            (this.queue = [])));
      }),
      t
    );
  })(),
  Ie = function () {
    return (
      (Ie =
        Object.assign ||
        function (e) {
          for (var r, n = 1, i = arguments.length; n < i; n++) {
            r = arguments[n];
            for (var o in r)
              Object.prototype.hasOwnProperty.call(r, o) && (e[o] = r[o]);
          }
          return e;
        }),
      Ie.apply(this, arguments)
    );
  };
function Ot(t) {
  var e = typeof Symbol == "function" && Symbol.iterator,
    r = e && t[e],
    n = 0;
  if (r) return r.call(t);
  if (t && typeof t.length == "number")
    return {
      next: function () {
        return (
          t && n >= t.length && (t = void 0),
          { value: t && t[n++], done: !t }
        );
      },
    };
  throw new TypeError(
    e ? "Object is not iterable." : "Symbol.iterator is not defined.",
  );
}
function On(t, e) {
  var r = typeof Symbol == "function" && t[Symbol.iterator];
  if (!r) return t;
  var n = r.call(t),
    i,
    o = [],
    a;
  try {
    for (; (e === void 0 || e-- > 0) && !(i = n.next()).done; ) o.push(i.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      i && !i.done && (r = n.return) && r.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return o;
}
var Lt = function (t, e) {
    var r,
      n,
      i = ["string", "number", "boolean", "undefined"],
      o = typeof t,
      a = typeof e;
    if (o !== a) return !1;
    try {
      for (var s = Ot(i), u = s.next(); !u.done; u = s.next()) {
        var c = u.value;
        if (c === o) return t === e;
      }
    } catch (y) {
      r = { error: y };
    } finally {
      try {
        u && !u.done && (n = s.return) && n.call(s);
      } finally {
        if (r) throw r.error;
      }
    }
    if (t == null && e == null) return !0;
    if (t == null || e == null || t.length !== e.length) return !1;
    var l = Array.isArray(t),
      f = Array.isArray(e);
    if (l !== f) return !1;
    if (l && f) {
      for (var d = 0; d < t.length; d++) if (!Lt(t[d], e[d])) return !1;
    } else {
      var v = Object.keys(t).sort(),
        h = Object.keys(e).sort();
      if (!Lt(v, h)) return !1;
      var m = !0;
      return (
        Object.keys(t).forEach(function (y) {
          Lt(t[y], e[y]) || (m = !1);
        }),
        m
      );
    }
    return !0;
  },
  rs = "$set",
  ns = "$unset",
  is = "$clearAll";
Object.entries ||
  (Object.entries = function (t) {
    for (var e = Object.keys(t), r = e.length, n = new Array(r); r--; )
      n[r] = [e[r], t[e[r]]];
    return n;
  });
var os = (function () {
    function t() {
      ((this.identity = { userProperties: {} }), (this.listeners = new Set()));
    }
    return (
      (t.prototype.editIdentity = function () {
        var e = this,
          r = Ie({}, this.identity.userProperties),
          n = Ie(Ie({}, this.identity), { userProperties: r });
        return {
          setUserId: function (i) {
            return ((n.userId = i), this);
          },
          setDeviceId: function (i) {
            return ((n.deviceId = i), this);
          },
          setUserProperties: function (i) {
            return ((n.userProperties = i), this);
          },
          setOptOut: function (i) {
            return ((n.optOut = i), this);
          },
          updateUserProperties: function (i) {
            var o,
              a,
              s,
              u,
              c,
              l,
              f = n.userProperties || {};
            try {
              for (
                var d = Ot(Object.entries(i)), v = d.next();
                !v.done;
                v = d.next()
              ) {
                var h = On(v.value, 2),
                  m = h[0],
                  y = h[1];
                switch (m) {
                  case rs:
                    try {
                      for (
                        var p = ((s = void 0), Ot(Object.entries(y))),
                          g = p.next();
                        !g.done;
                        g = p.next()
                      ) {
                        var b = On(g.value, 2),
                          T = b[0],
                          w = b[1];
                        f[T] = w;
                      }
                    } catch (P) {
                      s = { error: P };
                    } finally {
                      try {
                        g && !g.done && (u = p.return) && u.call(p);
                      } finally {
                        if (s) throw s.error;
                      }
                    }
                    break;
                  case ns:
                    try {
                      for (
                        var I = ((c = void 0), Ot(Object.keys(y))),
                          _ = I.next();
                        !_.done;
                        _ = I.next()
                      ) {
                        var T = _.value;
                        delete f[T];
                      }
                    } catch (P) {
                      c = { error: P };
                    } finally {
                      try {
                        _ && !_.done && (l = I.return) && l.call(I);
                      } finally {
                        if (c) throw c.error;
                      }
                    }
                    break;
                  case is:
                    f = {};
                    break;
                }
              }
            } catch (P) {
              o = { error: P };
            } finally {
              try {
                v && !v.done && (a = d.return) && a.call(d);
              } finally {
                if (o) throw o.error;
              }
            }
            return ((n.userProperties = f), this);
          },
          commit: function () {
            return (e.setIdentity(n), this);
          },
        };
      }),
      (t.prototype.getIdentity = function () {
        return Ie({}, this.identity);
      }),
      (t.prototype.setIdentity = function (e) {
        var r = Ie({}, this.identity);
        ((this.identity = Ie({}, e)),
          Lt(r, this.identity) ||
            this.listeners.forEach(function (n) {
              n(e);
            }));
      }),
      (t.prototype.addIdentityListener = function (e) {
        this.listeners.add(e);
      }),
      (t.prototype.removeIdentityListener = function (e) {
        this.listeners.delete(e);
      }),
      t
    );
  })(),
  Qe =
    typeof globalThis < "u" ? globalThis : typeof global < "u" ? global : self,
  Xi = (function () {
    function t() {
      ((this.identityStore = new os()),
        (this.eventBridge = new ts()),
        (this.applicationContextProvider = new Za()));
    }
    return (
      (t.getInstance = function (e) {
        return (
          Qe.analyticsConnectorInstances ||
            (Qe.analyticsConnectorInstances = {}),
          Qe.analyticsConnectorInstances[e] ||
            (Qe.analyticsConnectorInstances[e] = new t()),
          Qe.analyticsConnectorInstances[e]
        );
      }),
      t
    );
  })(),
  We = function (t) {
    return (t === void 0 && (t = Hi), Xi.getInstance(t));
  },
  as = function (t, e) {
    We(e).identityStore.editIdentity().setUserId(t).commit();
  },
  ss = function (t, e) {
    We(e).identityStore.editIdentity().setDeviceId(t).commit();
  },
  us = (function () {
    function t() {
      ((this.name = "identity"),
        (this.type = "before"),
        (this.identityStore = We().identityStore));
    }
    return (
      (t.prototype.execute = function (e) {
        return S(this, void 0, void 0, function () {
          var r;
          return E(this, function (n) {
            return (
              (r = e.user_properties),
              r &&
                this.identityStore
                  .editIdentity()
                  .updateUserProperties(r)
                  .commit(),
              [2, e]
            );
          });
        });
      }),
      (t.prototype.setup = function (e) {
        return S(this, void 0, void 0, function () {
          return E(this, function (r) {
            return (
              e.instanceName &&
                (this.identityStore = We(e.instanceName).identityStore),
              [2]
            );
          });
        });
      }),
      t
    );
  })(),
  Yi = function (t, e) {
    e === void 0 && (e = Date.now());
    var r = Date.now(),
      n = r - e;
    return n > t;
  },
  Ji = function (t, e, r) {
    return (
      e === void 0 && (e = ""),
      r === void 0 && (r = 10),
      [Yt, e, t.substring(0, r)].filter(Boolean).join("_")
    );
  },
  cs = function (t) {
    return "".concat(Yt.toLowerCase(), "_").concat(t.substring(0, 6));
  },
  ls = function () {
    var t, e, r, n;
    if (typeof navigator > "u") return "";
    var i = navigator.userLanguage;
    return (n =
      (r =
        (e =
          (t = navigator.languages) === null || t === void 0
            ? void 0
            : t[0]) !== null && e !== void 0
          ? e
          : navigator.language) !== null && r !== void 0
        ? r
        : i) !== null && n !== void 0
      ? n
      : "";
  },
  Vt = function () {
    var t,
      e = B();
    if (!(!((t = e?.location) === null || t === void 0) && t.search)) return {};
    var r = e.location.search.substring(1).split("&").filter(Boolean),
      n = r.reduce(function (i, o) {
        var a = o.split("=", 2),
          s = Ln(a[0]),
          u = Ln(a[1]);
        return (u && (i[s] = u), i);
      }, {});
    return n;
  },
  Ln = function (t) {
    t === void 0 && (t = "");
    try {
      return decodeURIComponent(t);
    } catch {
      return "";
    }
  },
  Cr = function (t, e) {
    return !e || !e.length
      ? !0
      : e.some(function (r) {
          return typeof r == "string" ? t === r : t.match(r);
        });
  },
  Ae = function (t, e) {
    var r = t;
    try {
      r = decodeURI(t);
    } catch (n) {
      e?.error("Malformed URI sequence: ", n);
    }
    return r;
  },
  jt = function (t) {
    var e = 0;
    if (t.length === 0) return e;
    for (var r = 0; r < t.length; r++) {
      var n = t.charCodeAt(r);
      ((e = (e << 5) - e + n), (e |= 0));
    }
    return e;
  },
  ds = function (t, e) {
    var r = jt(t.toString()),
      n = Math.abs(r),
      i = n * 31,
      o = i % 1e6;
    return o / 1e6 < e;
  },
  Dn = function (t, e) {
    var r = jt(t.toString()),
      n = Math.abs(r),
      i = n * 31,
      o = i % 1e5;
    return o / 1e5 < e;
  },
  Yr = (function () {
    function t() {
      this.memoryStorage = new Map();
    }
    return (
      (t.prototype.isEnabled = function () {
        return S(this, void 0, void 0, function () {
          return E(this, function (e) {
            return [2, !0];
          });
        });
      }),
      (t.prototype.get = function (e) {
        return S(this, void 0, void 0, function () {
          return E(this, function (r) {
            return [2, this.memoryStorage.get(e)];
          });
        });
      }),
      (t.prototype.getRaw = function (e) {
        return S(this, void 0, void 0, function () {
          var r;
          return E(this, function (n) {
            switch (n.label) {
              case 0:
                return [4, this.get(e)];
              case 1:
                return ((r = n.sent()), [2, r ? JSON.stringify(r) : void 0]);
            }
          });
        });
      }),
      (t.prototype.set = function (e, r) {
        return S(this, void 0, void 0, function () {
          return E(this, function (n) {
            return (this.memoryStorage.set(e, r), [2]);
          });
        });
      }),
      (t.prototype.remove = function (e) {
        return S(this, void 0, void 0, function () {
          return E(this, function (r) {
            return (this.memoryStorage.delete(e), [2]);
          });
        });
      }),
      (t.prototype.reset = function () {
        return S(this, void 0, void 0, function () {
          return E(this, function (e) {
            return (this.memoryStorage.clear(), [2]);
          });
        });
      }),
      t
    );
  })(),
  Ar = (function () {
    function t(e) {
      this.options = C({}, e);
    }
    return (
      (t.prototype.isEnabled = function () {
        return S(this, void 0, void 0, function () {
          var e, r, n;
          return E(this, function (i) {
            switch (i.label) {
              case 0:
                if (!B()) return [2, !1];
                ((t.testValue = String(Date.now())),
                  (e = new t(this.options)),
                  (r = "AMP_TEST"),
                  (i.label = 1));
              case 1:
                return (i.trys.push([1, 4, 5, 7]), [4, e.set(r, t.testValue)]);
              case 2:
                return (i.sent(), [4, e.get(r)]);
              case 3:
                return ((n = i.sent()), [2, n === t.testValue]);
              case 4:
                return (i.sent(), [2, !1]);
              case 5:
                return [4, e.remove(r)];
              case 6:
                return (i.sent(), [7]);
              case 7:
                return [2];
            }
          });
        });
      }),
      (t.prototype.get = function (e) {
        var r;
        return S(this, void 0, void 0, function () {
          var n, i;
          return E(this, function (o) {
            switch (o.label) {
              case 0:
                return [4, this.getRaw(e)];
              case 1:
                if (((n = o.sent()), !n)) return [2, void 0];
                try {
                  return (
                    (i = (r = fs(n)) !== null && r !== void 0 ? r : vs(n)),
                    i === void 0
                      ? (console.error(
                          "Amplitude Logger [Error]: Failed to decode cookie value for key: "
                            .concat(e, ", value: ")
                            .concat(n),
                        ),
                        [2, void 0])
                      : [2, JSON.parse(i)]
                  );
                } catch {
                  return (
                    console.error(
                      "Amplitude Logger [Error]: Failed to parse cookie value for key: "
                        .concat(e, ", value: ")
                        .concat(n),
                    ),
                    [2, void 0]
                  );
                }
                return [2];
            }
          });
        });
      }),
      (t.prototype.getRaw = function (e) {
        var r, n;
        return S(this, void 0, void 0, function () {
          var i, o, a;
          return E(this, function (s) {
            return (
              (i = B()),
              (o =
                (n =
                  (r = i?.document) === null || r === void 0
                    ? void 0
                    : r.cookie.split("; ")) !== null && n !== void 0
                  ? n
                  : []),
              (a = o.find(function (u) {
                return u.indexOf(e + "=") === 0;
              })),
              a ? [2, a.substring(e.length + 1)] : [2, void 0]
            );
          });
        });
      }),
      (t.prototype.set = function (e, r) {
        var n;
        return S(this, void 0, void 0, function () {
          var i, o, a, s, u, c, l;
          return E(this, function (f) {
            try {
              ((i =
                (n = this.options.expirationDays) !== null && n !== void 0
                  ? n
                  : 0),
                (o = r !== null ? i : -1),
                (a = void 0),
                o &&
                  ((s = new Date()),
                  s.setTime(s.getTime() + o * 24 * 60 * 60 * 1e3),
                  (a = s)),
                (u = ""
                  .concat(e, "=")
                  .concat(btoa(encodeURIComponent(JSON.stringify(r))))),
                a && (u += "; expires=".concat(a.toUTCString())),
                (u += "; path=/"),
                this.options.domain &&
                  (u += "; domain=".concat(this.options.domain)),
                this.options.secure && (u += "; Secure"),
                this.options.sameSite &&
                  (u += "; SameSite=".concat(this.options.sameSite)),
                (c = B()),
                c && (c.document.cookie = u));
            } catch (d) {
              ((l = d instanceof Error ? d.message : String(d)),
                console.error(
                  "Amplitude Logger [Error]: Failed to set cookie for key: "
                    .concat(e, ". Error: ")
                    .concat(l),
                ));
            }
            return [2];
          });
        });
      }),
      (t.prototype.remove = function (e) {
        return S(this, void 0, void 0, function () {
          return E(this, function (r) {
            switch (r.label) {
              case 0:
                return [4, this.set(e, null)];
              case 1:
                return (r.sent(), [2]);
            }
          });
        });
      }),
      (t.prototype.reset = function () {
        return S(this, void 0, void 0, function () {
          return E(this, function (e) {
            return [2];
          });
        });
      }),
      t
    );
  })(),
  fs = function (t) {
    try {
      return decodeURIComponent(atob(t));
    } catch {
      return;
    }
  },
  vs = function (t) {
    try {
      return decodeURIComponent(atob(decodeURIComponent(t)));
    } catch {
      return;
    }
  },
  Nn = function (t, e, r) {
    return (
      e === void 0 && (e = ""),
      r === void 0 && (r = 10),
      [Yt, e, t.substring(0, r)].filter(Boolean).join("_")
    );
  },
  Jr = (function () {
    function t(e) {
      this.storage = e;
    }
    return (
      (t.prototype.isEnabled = function () {
        return S(this, void 0, void 0, function () {
          var e, r, n, i;
          return E(this, function (o) {
            switch (o.label) {
              case 0:
                if (!this.storage) return [2, !1];
                ((e = String(Date.now())),
                  (r = new t(this.storage)),
                  (n = "AMP_TEST"),
                  (o.label = 1));
              case 1:
                return (o.trys.push([1, 4, 5, 7]), [4, r.set(n, e)]);
              case 2:
                return (o.sent(), [4, r.get(n)]);
              case 3:
                return ((i = o.sent()), [2, i === e]);
              case 4:
                return (o.sent(), [2, !1]);
              case 5:
                return [4, r.remove(n)];
              case 6:
                return (o.sent(), [7]);
              case 7:
                return [2];
            }
          });
        });
      }),
      (t.prototype.get = function (e) {
        return S(this, void 0, void 0, function () {
          var r;
          return E(this, function (n) {
            switch (n.label) {
              case 0:
                return (n.trys.push([0, 2, , 3]), [4, this.getRaw(e)]);
              case 1:
                return ((r = n.sent()), r ? [2, JSON.parse(r)] : [2, void 0]);
              case 2:
                return (
                  n.sent(),
                  console.error(
                    "[Amplitude] Error: Could not get value from storage",
                  ),
                  [2, void 0]
                );
              case 3:
                return [2];
            }
          });
        });
      }),
      (t.prototype.getRaw = function (e) {
        var r;
        return S(this, void 0, void 0, function () {
          return E(this, function (n) {
            return [
              2,
              ((r = this.storage) === null || r === void 0
                ? void 0
                : r.getItem(e)) || void 0,
            ];
          });
        });
      }),
      (t.prototype.set = function (e, r) {
        var n;
        return S(this, void 0, void 0, function () {
          return E(this, function (i) {
            try {
              (n = this.storage) === null ||
                n === void 0 ||
                n.setItem(e, JSON.stringify(r));
            } catch {}
            return [2];
          });
        });
      }),
      (t.prototype.remove = function (e) {
        var r;
        return S(this, void 0, void 0, function () {
          return E(this, function (n) {
            try {
              (r = this.storage) === null || r === void 0 || r.removeItem(e);
            } catch {}
            return [2];
          });
        });
      }),
      (t.prototype.reset = function () {
        var e;
        return S(this, void 0, void 0, function () {
          return E(this, function (r) {
            try {
              (e = this.storage) === null || e === void 0 || e.clear();
            } catch {}
            return [2];
          });
        });
      }),
      t
    );
  })(),
  hs = 10,
  gs = 1,
  W = {
    TAGS: "tags",
    COUNTERS: "counters",
    HISTOGRAMS: "histograms",
    EVENTS: "events",
    INTERNAL: "internal",
  },
  Mn = { LAST_FLUSH_TIMESTAMP: "last_flush_timestamp" },
  xn = (function () {
    function t(e, r) {
      ((this.dbPromise = null),
        (this.logger = r),
        (this.dbName = "AMP_diagnostics_".concat(e.substring(0, 10))));
    }
    return (
      (t.isSupported = function () {
        var e;
        return (
          ((e = B()) === null || e === void 0 ? void 0 : e.indexedDB) !== void 0
        );
      }),
      (t.prototype.getDB = function () {
        return S(this, void 0, void 0, function () {
          return E(this, function (e) {
            return (
              this.dbPromise || (this.dbPromise = this.openDB()),
              [2, this.dbPromise]
            );
          });
        });
      }),
      (t.prototype.openDB = function () {
        var e = this;
        return new Promise(function (r, n) {
          var i = indexedDB.open(e.dbName, gs);
          ((i.onerror = function () {
            ((e.dbPromise = null), n(new Error("Failed to open IndexedDB")));
          }),
            (i.onsuccess = function () {
              var o = i.result;
              ((o.onclose = function () {
                ((e.dbPromise = null),
                  e.logger.debug("DiagnosticsStorage: DB connection closed."));
              }),
                (o.onerror = function (a) {
                  (e.logger.debug(
                    "DiagnosticsStorage: A global database error occurred.",
                    a,
                  ),
                    o.close());
                }),
                r(o));
            }),
            (i.onupgradeneeded = function (o) {
              var a = o.target.result;
              e.createTables(a);
            }));
        });
      }),
      (t.prototype.createTables = function (e) {
        if (
          (e.objectStoreNames.contains(W.TAGS) ||
            e.createObjectStore(W.TAGS, { keyPath: "key" }),
          e.objectStoreNames.contains(W.COUNTERS) ||
            e.createObjectStore(W.COUNTERS, { keyPath: "key" }),
          e.objectStoreNames.contains(W.HISTOGRAMS) ||
            e.createObjectStore(W.HISTOGRAMS, { keyPath: "key" }),
          !e.objectStoreNames.contains(W.EVENTS))
        ) {
          var r = e.createObjectStore(W.EVENTS, {
            keyPath: "id",
            autoIncrement: !0,
          });
          r.createIndex("time_idx", "time", { unique: !1 });
        }
        e.objectStoreNames.contains(W.INTERNAL) ||
          e.createObjectStore(W.INTERNAL, { keyPath: "key" });
      }),
      (t.prototype.setTags = function (e) {
        return S(this, void 0, void 0, function () {
          var r,
            n,
            i,
            o,
            a = this;
          return E(this, function (s) {
            switch (s.label) {
              case 0:
                return (
                  s.trys.push([0, 2, , 3]),
                  Object.entries(e).length === 0 ? [2] : [4, this.getDB()]
                );
              case 1:
                return (
                  (r = s.sent()),
                  (n = r.transaction([W.TAGS], "readwrite")),
                  (i = n.objectStore(W.TAGS)),
                  [
                    2,
                    new Promise(function (u) {
                      var c = Object.entries(e);
                      ((n.oncomplete = function () {
                        u();
                      }),
                        (n.onabort = function (l) {
                          (a.logger.debug(
                            "DiagnosticsStorage: Failed to set tags",
                            l,
                          ),
                            u());
                        }),
                        c.forEach(function (l) {
                          var f = L(l, 2),
                            d = f[0],
                            v = f[1],
                            h = i.put({ key: d, value: v });
                          h.onerror = function (m) {
                            a.logger.debug(
                              "DiagnosticsStorage: Failed to set tag",
                              d,
                              v,
                              m,
                            );
                          };
                        }));
                    }),
                  ]
                );
              case 2:
                return (
                  (o = s.sent()),
                  this.logger.debug(
                    "DiagnosticsStorage: Failed to set tags",
                    o,
                  ),
                  [3, 3]
                );
              case 3:
                return [2];
            }
          });
        });
      }),
      (t.prototype.incrementCounters = function (e) {
        return S(this, void 0, void 0, function () {
          var r,
            n,
            i,
            o,
            a = this;
          return E(this, function (s) {
            switch (s.label) {
              case 0:
                return (
                  s.trys.push([0, 2, , 3]),
                  Object.entries(e).length === 0 ? [2] : [4, this.getDB()]
                );
              case 1:
                return (
                  (r = s.sent()),
                  (n = r.transaction([W.COUNTERS], "readwrite")),
                  (i = n.objectStore(W.COUNTERS)),
                  [
                    2,
                    new Promise(function (u) {
                      var c = Object.entries(e);
                      ((n.oncomplete = function () {
                        u();
                      }),
                        (n.onabort = function (l) {
                          (a.logger.debug(
                            "DiagnosticsStorage: Failed to increment counters",
                            l,
                          ),
                            u());
                        }),
                        c.forEach(function (l) {
                          var f = L(l, 2),
                            d = f[0],
                            v = f[1],
                            h = i.get(d);
                          ((h.onsuccess = function () {
                            var m = h.result,
                              y = m ? m.value : 0,
                              p = i.put({ key: d, value: y + v });
                            p.onerror = function (g) {
                              a.logger.debug(
                                "DiagnosticsStorage: Failed to update counter",
                                d,
                                g,
                              );
                            };
                          }),
                            (h.onerror = function (m) {
                              a.logger.debug(
                                "DiagnosticsStorage: Failed to read existing counter",
                                d,
                                m,
                              );
                            }));
                        }));
                    }),
                  ]
                );
              case 2:
                return (
                  (o = s.sent()),
                  this.logger.debug(
                    "DiagnosticsStorage: Failed to increment counters",
                    o,
                  ),
                  [3, 3]
                );
              case 3:
                return [2];
            }
          });
        });
      }),
      (t.prototype.setHistogramStats = function (e) {
        return S(this, void 0, void 0, function () {
          var r,
            n,
            i,
            o,
            a = this;
          return E(this, function (s) {
            switch (s.label) {
              case 0:
                return (
                  s.trys.push([0, 2, , 3]),
                  Object.entries(e).length === 0 ? [2] : [4, this.getDB()]
                );
              case 1:
                return (
                  (r = s.sent()),
                  (n = r.transaction([W.HISTOGRAMS], "readwrite")),
                  (i = n.objectStore(W.HISTOGRAMS)),
                  [
                    2,
                    new Promise(function (u) {
                      var c = Object.entries(e);
                      ((n.oncomplete = function () {
                        u();
                      }),
                        (n.onabort = function (l) {
                          (a.logger.debug(
                            "DiagnosticsStorage: Failed to set histogram stats",
                            l,
                          ),
                            u());
                        }),
                        c.forEach(function (l) {
                          var f = L(l, 2),
                            d = f[0],
                            v = f[1],
                            h = i.get(d);
                          ((h.onsuccess = function () {
                            var m = h.result,
                              y;
                            m
                              ? (y = {
                                  key: d,
                                  count: m.count + v.count,
                                  min: Math.min(m.min, v.min),
                                  max: Math.max(m.max, v.max),
                                  sum: m.sum + v.sum,
                                })
                              : (y = {
                                  key: d,
                                  count: v.count,
                                  min: v.min,
                                  max: v.max,
                                  sum: v.sum,
                                });
                            var p = i.put(y);
                            p.onerror = function (g) {
                              a.logger.debug(
                                "DiagnosticsStorage: Failed to set histogram stats",
                                d,
                                g,
                              );
                            };
                          }),
                            (h.onerror = function (m) {
                              a.logger.debug(
                                "DiagnosticsStorage: Failed to read existing histogram stats",
                                d,
                                m,
                              );
                            }));
                        }));
                    }),
                  ]
                );
              case 2:
                return (
                  (o = s.sent()),
                  this.logger.debug(
                    "DiagnosticsStorage: Failed to set histogram stats",
                    o,
                  ),
                  [3, 3]
                );
              case 3:
                return [2];
            }
          });
        });
      }),
      (t.prototype.addEventRecords = function (e) {
        return S(this, void 0, void 0, function () {
          var r,
            n,
            i,
            o,
            a = this;
          return E(this, function (s) {
            switch (s.label) {
              case 0:
                return (
                  s.trys.push([0, 2, , 3]),
                  e.length === 0 ? [2] : [4, this.getDB()]
                );
              case 1:
                return (
                  (r = s.sent()),
                  (n = r.transaction([W.EVENTS], "readwrite")),
                  (i = n.objectStore(W.EVENTS)),
                  [
                    2,
                    new Promise(function (u) {
                      ((n.oncomplete = function () {
                        u();
                      }),
                        (n.onabort = function (l) {
                          (a.logger.debug(
                            "DiagnosticsStorage: Failed to add event records",
                            l,
                          ),
                            u());
                        }));
                      var c = i.count();
                      ((c.onsuccess = function () {
                        var l = c.result,
                          f = Math.max(0, hs - l);
                        (f < e.length &&
                          a.logger.debug(
                            "DiagnosticsStorage: Only added "
                              .concat(f, " of ")
                              .concat(e.length, " events due to storage limit"),
                          ),
                          e.slice(0, f).forEach(function (d) {
                            var v = i.add(d);
                            v.onerror = function (h) {
                              a.logger.debug(
                                "DiagnosticsStorage: Failed to add event record",
                                h,
                              );
                            };
                          }));
                      }),
                        (c.onerror = function (l) {
                          a.logger.debug(
                            "DiagnosticsStorage: Failed to count existing events",
                            l,
                          );
                        }));
                    }),
                  ]
                );
              case 2:
                return (
                  (o = s.sent()),
                  this.logger.debug(
                    "DiagnosticsStorage: Failed to add event records",
                    o,
                  ),
                  [3, 3]
                );
              case 3:
                return [2];
            }
          });
        });
      }),
      (t.prototype.setInternal = function (e, r) {
        return S(this, void 0, void 0, function () {
          var n, i, o, a;
          return E(this, function (s) {
            switch (s.label) {
              case 0:
                return (s.trys.push([0, 2, , 3]), [4, this.getDB()]);
              case 1:
                return (
                  (n = s.sent()),
                  (i = n.transaction([W.INTERNAL], "readwrite")),
                  (o = i.objectStore(W.INTERNAL)),
                  [
                    2,
                    new Promise(function (u, c) {
                      i.onabort = function () {
                        return c(new Error("Failed to set internal value"));
                      };
                      var l = o.put({ key: e, value: r });
                      ((l.onsuccess = function () {
                        return u();
                      }),
                        (l.onerror = function () {
                          return c(new Error("Failed to set internal value"));
                        }));
                    }),
                  ]
                );
              case 2:
                return (
                  (a = s.sent()),
                  this.logger.debug(
                    "DiagnosticsStorage: Failed to set internal value",
                    a,
                  ),
                  [3, 3]
                );
              case 3:
                return [2];
            }
          });
        });
      }),
      (t.prototype.getInternal = function (e) {
        return S(this, void 0, void 0, function () {
          var r, n, i, o;
          return E(this, function (a) {
            switch (a.label) {
              case 0:
                return (a.trys.push([0, 2, , 3]), [4, this.getDB()]);
              case 1:
                return (
                  (r = a.sent()),
                  (n = r.transaction([W.INTERNAL], "readonly")),
                  (i = n.objectStore(W.INTERNAL)),
                  [
                    2,
                    new Promise(function (s, u) {
                      n.onabort = function () {
                        return u(new Error("Failed to get internal value"));
                      };
                      var c = i.get(e);
                      ((c.onsuccess = function () {
                        return s(c.result);
                      }),
                        (c.onerror = function () {
                          return u(new Error("Failed to get internal value"));
                        }));
                    }),
                  ]
                );
              case 2:
                return (
                  (o = a.sent()),
                  this.logger.debug(
                    "DiagnosticsStorage: Failed to get internal value",
                    o,
                  ),
                  [2, void 0]
                );
              case 3:
                return [2];
            }
          });
        });
      }),
      (t.prototype.getLastFlushTimestamp = function () {
        return S(this, void 0, void 0, function () {
          var e, r;
          return E(this, function (n) {
            switch (n.label) {
              case 0:
                return (
                  n.trys.push([0, 2, , 3]),
                  [4, this.getInternal(Mn.LAST_FLUSH_TIMESTAMP)]
                );
              case 1:
                return (
                  (e = n.sent()),
                  [2, e ? parseInt(e.value, 10) : void 0]
                );
              case 2:
                return (
                  (r = n.sent()),
                  this.logger.debug(
                    "DiagnosticsStorage: Failed to get last flush timestamp",
                    r,
                  ),
                  [2, void 0]
                );
              case 3:
                return [2];
            }
          });
        });
      }),
      (t.prototype.setLastFlushTimestamp = function (e) {
        return S(this, void 0, void 0, function () {
          var r;
          return E(this, function (n) {
            switch (n.label) {
              case 0:
                return (
                  n.trys.push([0, 2, , 3]),
                  [4, this.setInternal(Mn.LAST_FLUSH_TIMESTAMP, e.toString())]
                );
              case 1:
                return (n.sent(), [3, 3]);
              case 2:
                return (
                  (r = n.sent()),
                  this.logger.debug(
                    "DiagnosticsStorage: Failed to set last flush timestamp",
                    r,
                  ),
                  [3, 3]
                );
              case 3:
                return [2];
            }
          });
        });
      }),
      (t.prototype.clearTable = function (e, r) {
        return new Promise(function (n, i) {
          var o = e.objectStore(r),
            a = o.clear();
          ((a.onsuccess = function () {
            return n();
          }),
            (a.onerror = function () {
              return i(new Error("Failed to clear table ".concat(r)));
            }));
        });
      }),
      (t.prototype.getAllAndClear = function () {
        return S(this, void 0, void 0, function () {
          var e, r, n, i, o, a, s, u;
          return E(this, function (c) {
            switch (c.label) {
              case 0:
                return (c.trys.push([0, 4, , 5]), [4, this.getDB()]);
              case 1:
                return (
                  (e = c.sent()),
                  (r = e.transaction(
                    [W.TAGS, W.COUNTERS, W.HISTOGRAMS, W.EVENTS],
                    "readwrite",
                  )),
                  [
                    4,
                    Promise.all([
                      this.getAllFromStore(r, W.TAGS),
                      this.getAllFromStore(r, W.COUNTERS),
                      this.getAllFromStore(r, W.HISTOGRAMS),
                      this.getAllFromStore(r, W.EVENTS),
                    ]),
                  ]
                );
              case 2:
                return (
                  (n = L.apply(void 0, [c.sent(), 4])),
                  (i = n[0]),
                  (o = n[1]),
                  (a = n[2]),
                  (s = n[3]),
                  [
                    4,
                    Promise.all([
                      this.clearTable(r, W.COUNTERS),
                      this.clearTable(r, W.HISTOGRAMS),
                      this.clearTable(r, W.EVENTS),
                    ]),
                  ]
                );
              case 3:
                return (
                  c.sent(),
                  [2, { tags: i, counters: o, histogramStats: a, events: s }]
                );
              case 4:
                return (
                  (u = c.sent()),
                  this.logger.debug(
                    "DiagnosticsStorage: Failed to get all and clear data",
                    u,
                  ),
                  [
                    2,
                    { tags: [], counters: [], histogramStats: [], events: [] },
                  ]
                );
              case 5:
                return [2];
            }
          });
        });
      }),
      (t.prototype.getAllFromStore = function (e, r) {
        return new Promise(function (n, i) {
          var o = e.objectStore(r),
            a = o.getAll();
          ((a.onsuccess = function () {
            return n(a.result);
          }),
            (a.onerror = function () {
              return i(new Error("Failed to get all from ".concat(r)));
            }));
        });
      }),
      t
    );
  })(),
  ps = "__AMPLITUDE_SCRIPT_URL__",
  ms = "sdk.error.uncaught",
  ys = function () {
    var t = B();
    return t?.[ps];
  },
  bs = function (t) {
    var e = B();
    if (!(!e || typeof e.addEventListener != "function")) {
      var r = function (o) {
          var a = o.error instanceof Error ? o.error : void 0,
            s = a?.stack,
            u = Un({ filename: o.filename, stack: s });
          u &&
            i({
              type: "error",
              message: o.message,
              stack: s,
              filename: o.filename,
              errorName: a?.name,
              metadata: {
                colno: o.colno,
                lineno: o.lineno,
                isTrusted: o.isTrusted,
                matchReason: u,
              },
            });
        },
        n = function (o) {
          var a,
            s = o.reason instanceof Error ? o.reason : void 0,
            u = s?.stack,
            c = Es(u),
            l = Un({ filename: c, stack: u });
          l &&
            i({
              type: "unhandledrejection",
              message:
                (a = s?.message) !== null && a !== void 0 ? a : Ss(o.reason),
              stack: u,
              filename: c,
              errorName: s?.name,
              metadata: { isTrusted: o.isTrusted, matchReason: l },
            });
        },
        i = function (o) {
          t.recordEvent(
            ms,
            C(
              {
                type: o.type,
                message: o.message,
                filename: o.filename,
                error_name: o.errorName,
                stack: o.stack,
              },
              o.metadata,
            ),
          );
        };
      (e.addEventListener("error", r, !0),
        e.addEventListener("unhandledrejection", n, !0));
    }
  },
  Un = function (t) {
    var e = ys();
    if (e) {
      if (t.filename && t.filename.includes(e)) return "filename";
      if (t.stack && t.stack.includes(e)) return "stack";
    }
  },
  Es = function (t) {
    if (t) {
      var e = t.match(/(https?:\/\/\S+?)(?=[)\s]|$)/);
      return e ? e[1] : void 0;
    }
  },
  Ss = function (t) {
    if (typeof t == "string") return t;
    try {
      return JSON.stringify(t);
    } catch {
      return "[object Object]";
    }
  },
  Ts = 1e3,
  St = 300 * 1e3,
  ws = "https://diagnostics.prod.us-west-2.amplitude.com/v1/capture",
  Is = "https://diagnostics.prod.eu-central-1.amplitude.com/v1/capture",
  ar = 1e4,
  _s = 10,
  Ps = (function () {
    function t(e, r, n, i) {
      (n === void 0 && (n = "US"),
        (this.inMemoryTags = {}),
        (this.inMemoryCounters = {}),
        (this.inMemoryHistograms = {}),
        (this.inMemoryEvents = []),
        (this.saveTimer = null),
        (this.flushTimer = null),
        (this.apiKey = e),
        (this.logger = r),
        (this.serverUrl = n === "US" ? ws : Is),
        this.logger.debug(
          "DiagnosticsClient: Initializing with options",
          JSON.stringify(i, null, 2),
        ),
        (this.config = C({ enabled: !0, sampleRate: 0 }, i)),
        (this.startTimestamp = Date.now()),
        (this.shouldTrack =
          Dn(this.startTimestamp, this.config.sampleRate) &&
          this.config.enabled),
        xn.isSupported()
          ? (this.storage = new xn(e, r))
          : this.logger.debug("DiagnosticsClient: IndexedDB is not supported"),
        this.initializeFlushInterval(),
        this.shouldTrack &&
          (this.increment("sdk.diagnostics.sampled.in.and.enabled"), bs(this)));
    }
    return (
      (t.prototype.isStorageAndTrackEnabled = function () {
        return !!this.storage && !!this.shouldTrack;
      }),
      (t.prototype.setTag = function (e, r) {
        if (this.isStorageAndTrackEnabled()) {
          if (Object.keys(this.inMemoryTags).length >= ar) {
            this.logger.debug(
              "DiagnosticsClient: Early return setTags as reaching memory limit",
            );
            return;
          }
          ((this.inMemoryTags[e] = r), this.startTimersIfNeeded());
        }
      }),
      (t.prototype.increment = function (e, r) {
        if ((r === void 0 && (r = 1), !!this.isStorageAndTrackEnabled())) {
          if (Object.keys(this.inMemoryCounters).length >= ar) {
            this.logger.debug(
              "DiagnosticsClient: Early return increment as reaching memory limit",
            );
            return;
          }
          ((this.inMemoryCounters[e] = (this.inMemoryCounters[e] || 0) + r),
            this.startTimersIfNeeded());
        }
      }),
      (t.prototype.recordHistogram = function (e, r) {
        if (this.isStorageAndTrackEnabled()) {
          if (Object.keys(this.inMemoryHistograms).length >= ar) {
            this.logger.debug(
              "DiagnosticsClient: Early return recordHistogram as reaching memory limit",
            );
            return;
          }
          var n = this.inMemoryHistograms[e];
          (n
            ? ((n.count += 1),
              (n.min = Math.min(n.min, r)),
              (n.max = Math.max(n.max, r)),
              (n.sum += r))
            : (this.inMemoryHistograms[e] = {
                count: 1,
                min: r,
                max: r,
                sum: r,
              }),
            this.startTimersIfNeeded());
        }
      }),
      (t.prototype.recordEvent = function (e, r) {
        if (this.isStorageAndTrackEnabled()) {
          if (this.inMemoryEvents.length >= _s) {
            this.logger.debug(
              "DiagnosticsClient: Early return recordEvent as reaching memory limit",
            );
            return;
          }
          (this.inMemoryEvents.push({
            event_name: e,
            time: Date.now(),
            event_properties: r,
          }),
            this.startTimersIfNeeded());
        }
      }),
      (t.prototype.startTimersIfNeeded = function () {
        var e = this;
        (this.saveTimer ||
          (this.saveTimer = setTimeout(function () {
            e.saveAllDataToStorage()
              .catch(function (r) {
                e.logger.debug(
                  "DiagnosticsClient: Failed to save all data to storage",
                  r,
                );
              })
              .finally(function () {
                e.saveTimer = null;
              });
          }, Ts)),
          this.flushTimer ||
            (this.flushTimer = setTimeout(function () {
              e._flush()
                .catch(function (r) {
                  e.logger.debug("DiagnosticsClient: Failed to flush", r);
                })
                .finally(function () {
                  e.flushTimer = null;
                });
            }, St)));
      }),
      (t.prototype.saveAllDataToStorage = function () {
        return S(this, void 0, void 0, function () {
          var e, r, n, i;
          return E(this, function (o) {
            switch (o.label) {
              case 0:
                return this.storage
                  ? ((e = C({}, this.inMemoryTags)),
                    (r = C({}, this.inMemoryCounters)),
                    (n = C({}, this.inMemoryHistograms)),
                    (i = V([], L(this.inMemoryEvents), !1)),
                    (this.inMemoryEvents = []),
                    (this.inMemoryTags = {}),
                    (this.inMemoryCounters = {}),
                    (this.inMemoryHistograms = {}),
                    [
                      4,
                      Promise.all([
                        this.storage.setTags(e),
                        this.storage.incrementCounters(r),
                        this.storage.setHistogramStats(n),
                        this.storage.addEventRecords(i),
                      ]),
                    ])
                  : [2];
              case 1:
                return (o.sent(), [2]);
            }
          });
        });
      }),
      (t.prototype._flush = function () {
        return S(this, void 0, void 0, function () {
          var e, r, n, i, o, a, s, u, c, l;
          return E(this, function (f) {
            switch (f.label) {
              case 0:
                return this.storage ? [4, this.saveAllDataToStorage()] : [2];
              case 1:
                return (
                  f.sent(),
                  (this.saveTimer = null),
                  (this.flushTimer = null),
                  [4, this.storage.getAllAndClear()]
                );
              case 2:
                return (
                  (e = f.sent()),
                  (r = e.tags),
                  (n = e.counters),
                  (i = e.histogramStats),
                  (o = e.events),
                  this.storage.setLastFlushTimestamp(Date.now()),
                  (a = {}),
                  r.forEach(function (d) {
                    a[d.key] = d.value;
                  }),
                  (s = {}),
                  n.forEach(function (d) {
                    s[d.key] = d.value;
                  }),
                  (u = {}),
                  i.forEach(function (d) {
                    u[d.key] = {
                      count: d.count,
                      min: d.min,
                      max: d.max,
                      avg: Math.round((d.sum / d.count) * 100) / 100,
                    };
                  }),
                  (c = o.map(function (d) {
                    return {
                      event_name: d.event_name,
                      time: d.time,
                      event_properties: d.event_properties,
                    };
                  })),
                  Object.keys(s).length === 0 &&
                  Object.keys(u).length === 0 &&
                  c.length === 0
                    ? [2]
                    : ((l = { tags: a, histogram: u, counters: s, events: c }),
                      this.fetch(l),
                      [2])
                );
            }
          });
        });
      }),
      (t.prototype.fetch = function (e) {
        return S(this, void 0, void 0, function () {
          var r, n;
          return E(this, function (i) {
            switch (i.label) {
              case 0:
                if ((i.trys.push([0, 2, , 3]), !B()))
                  throw new Error("DiagnosticsClient: Fetch is not supported");
                return [
                  4,
                  fetch(this.serverUrl, {
                    method: "POST",
                    headers: {
                      "X-ApiKey": this.apiKey,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(e),
                  }),
                ];
              case 1:
                return (
                  (r = i.sent()),
                  r.ok
                    ? (this.logger.debug(
                        "DiagnosticsClient: Successfully sent diagnostics data",
                      ),
                      [3, 3])
                    : (this.logger.debug(
                        "DiagnosticsClient: Failed to send diagnostics data.",
                      ),
                      [2])
                );
              case 2:
                return (
                  (n = i.sent()),
                  this.logger.debug(
                    "DiagnosticsClient: Failed to send diagnostics data. ",
                    n,
                  ),
                  [3, 3]
                );
              case 3:
                return [2];
            }
          });
        });
      }),
      (t.prototype.initializeFlushInterval = function () {
        return S(this, void 0, void 0, function () {
          var e, r, n;
          return E(this, function (i) {
            switch (i.label) {
              case 0:
                return this.storage
                  ? ((e = Date.now()),
                    [4, this.storage.getLastFlushTimestamp()])
                  : [2];
              case 1:
                return (
                  (r = i.sent() || -1),
                  r === -1
                    ? (this.storage.setLastFlushTimestamp(e),
                      this._setFlushTimer(St),
                      [2])
                    : ((n = e - r),
                      n >= St
                        ? (this._flush(), [2])
                        : (this._setFlushTimer(St - n), [2]))
                );
            }
          });
        });
      }),
      (t.prototype._setFlushTimer = function (e) {
        var r = this;
        this.flushTimer = setTimeout(function () {
          r._flush()
            .catch(function (n) {
              r.logger.debug("DiagnosticsClient: Failed to flush", n);
            })
            .finally(function () {
              r.flushTimer = null;
            });
        }, e);
      }),
      (t.prototype._setSampleRate = function (e) {
        (this.logger.debug("DiagnosticsClient: Setting sample rate to", e),
          (this.config.sampleRate = e),
          (this.shouldTrack =
            Dn(this.startTimestamp, this.config.sampleRate) &&
            this.config.enabled),
          this.logger.debug(
            "DiagnosticsClient: Should track is",
            this.shouldTrack,
          ));
      }),
      t
    );
  })(),
  Qt = (function () {
    function t() {}
    return (
      (t.prototype.send = function (e, r) {
        return Promise.resolve(null);
      }),
      (t.prototype.buildResponse = function (e) {
        var r, n, i, o, a, s, u, c, l, f, d, v, h, m, y, p, g, b, T, w, I, _;
        if (typeof e != "object") return null;
        var P = e.code || 0,
          k = this.buildStatus(P);
        switch (k) {
          case te.Success:
            return {
              status: k,
              statusCode: P,
              body: {
                eventsIngested:
                  (r = e.events_ingested) !== null && r !== void 0 ? r : 0,
                payloadSizeBytes:
                  (n = e.payload_size_bytes) !== null && n !== void 0 ? n : 0,
                serverUploadTime:
                  (i = e.server_upload_time) !== null && i !== void 0 ? i : 0,
              },
            };
          case te.Invalid:
            return {
              status: k,
              statusCode: P,
              body: {
                error: (o = e.error) !== null && o !== void 0 ? o : "",
                missingField:
                  (a = e.missing_field) !== null && a !== void 0 ? a : "",
                eventsWithInvalidFields:
                  (s = e.events_with_invalid_fields) !== null && s !== void 0
                    ? s
                    : {},
                eventsWithMissingFields:
                  (u = e.events_with_missing_fields) !== null && u !== void 0
                    ? u
                    : {},
                eventsWithInvalidIdLengths:
                  (c = e.events_with_invalid_id_lengths) !== null &&
                  c !== void 0
                    ? c
                    : {},
                epsThreshold:
                  (l = e.eps_threshold) !== null && l !== void 0 ? l : 0,
                exceededDailyQuotaDevices:
                  (f = e.exceeded_daily_quota_devices) !== null && f !== void 0
                    ? f
                    : {},
                silencedDevices:
                  (d = e.silenced_devices) !== null && d !== void 0 ? d : [],
                silencedEvents:
                  (v = e.silenced_events) !== null && v !== void 0 ? v : [],
                throttledDevices:
                  (h = e.throttled_devices) !== null && h !== void 0 ? h : {},
                throttledEvents:
                  (m = e.throttled_events) !== null && m !== void 0 ? m : [],
              },
            };
          case te.PayloadTooLarge:
            return {
              status: k,
              statusCode: P,
              body: { error: (y = e.error) !== null && y !== void 0 ? y : "" },
            };
          case te.RateLimit:
            return {
              status: k,
              statusCode: P,
              body: {
                error: (p = e.error) !== null && p !== void 0 ? p : "",
                epsThreshold:
                  (g = e.eps_threshold) !== null && g !== void 0 ? g : 0,
                throttledDevices:
                  (b = e.throttled_devices) !== null && b !== void 0 ? b : {},
                throttledUsers:
                  (T = e.throttled_users) !== null && T !== void 0 ? T : {},
                exceededDailyQuotaDevices:
                  (w = e.exceeded_daily_quota_devices) !== null && w !== void 0
                    ? w
                    : {},
                exceededDailyQuotaUsers:
                  (I = e.exceeded_daily_quota_users) !== null && I !== void 0
                    ? I
                    : {},
                throttledEvents:
                  (_ = e.throttled_events) !== null && _ !== void 0 ? _ : [],
              },
            };
          case te.Timeout:
          default:
            return { status: k, statusCode: P };
        }
      }),
      (t.prototype.buildStatus = function (e) {
        return Pr(e)
          ? te.Success
          : e === 429
            ? te.RateLimit
            : e === 413
              ? te.PayloadTooLarge
              : e === 408
                ? te.Timeout
                : e >= 400 && e < 500
                  ? te.Invalid
                  : e >= 500
                    ? te.Failed
                    : te.Unknown;
      }),
      t
    );
  })(),
  Qi = (function (t) {
    be(e, t);
    function e(r) {
      r === void 0 && (r = {});
      var n = t.call(this) || this;
      return ((n.customHeaders = r), n);
    }
    return (
      (e.prototype.send = function (r, n) {
        return S(this, void 0, void 0, function () {
          var i, o, a;
          return E(this, function (s) {
            switch (s.label) {
              case 0:
                if (typeof fetch > "u")
                  throw new Error("FetchTransport is not supported");
                return (
                  (i = {
                    headers: C(
                      { "Content-Type": "application/json", Accept: "*/*" },
                      this.customHeaders,
                    ),
                    body: JSON.stringify(n),
                    method: "POST",
                  }),
                  [4, fetch(r, i)]
                );
              case 1:
                return ((o = s.sent()), [4, o.text()]);
              case 2:
                a = s.sent();
                try {
                  return [2, this.buildResponse(JSON.parse(a))];
                } catch {
                  return [2, this.buildResponse({ code: o.status })];
                }
                return [2];
            }
          });
        });
      }),
      e
    );
  })(Qt),
  Cs = (function () {
    function t(e, r) {
      ((this.key = "AMP_remote_config_".concat(e.substring(0, 10))),
        (this.logger = r));
    }
    return (
      (t.prototype.fetchConfig = function () {
        var e = null,
          r = { remoteConfig: null, lastFetch: new Date() };
        try {
          e = localStorage.getItem(this.key);
        } catch (i) {
          return (
            this.logger.debug(
              "Remote config localstorage failed to access: ",
              i,
            ),
            Promise.resolve(r)
          );
        }
        if (e === null)
          return (
            this.logger.debug(
              "Remote config localstorage gets null because the key does not exist",
            ),
            Promise.resolve(r)
          );
        try {
          var n = JSON.parse(e);
          return (
            this.logger.debug(
              "Remote config localstorage parsed successfully: ".concat(
                JSON.stringify(n),
              ),
            ),
            Promise.resolve({
              remoteConfig: n.remoteConfig,
              lastFetch: new Date(n.lastFetch),
            })
          );
        } catch (i) {
          return (
            this.logger.debug(
              "Remote config localstorage failed to parse: ",
              i,
            ),
            localStorage.removeItem(this.key),
            Promise.resolve(r)
          );
        }
      }),
      (t.prototype.setConfig = function (e) {
        try {
          return (
            localStorage.setItem(this.key, JSON.stringify(e)),
            this.logger.debug("Remote config localstorage set successfully."),
            Promise.resolve(!0)
          );
        } catch (r) {
          this.logger.debug("Remote config localstorage failed to set: ", r);
        }
        return Promise.resolve(!1);
      }),
      t
    );
  })(),
  As = "https://sr-client-cfg.amplitude.com/config",
  ks = "https://sr-client-cfg.eu.amplitude.com/config",
  Rs = 3,
  Os = 1e3,
  Ls = 300 * 1e3,
  Zi = (function () {
    function t(e, r, n, i) {
      (n === void 0 && (n = "US"),
        (this.callbackInfos = []),
        (this.lastSuccessfulFetch = null),
        (this.fetchPromise = null),
        (this.apiKey = e),
        (this.serverUrl = i || (n === "US" ? As : ks)),
        (this.logger = r),
        (this.storage = new Cs(e, r)));
    }
    return (
      (t.prototype.subscribe = function (e, r, n) {
        var i = Re(),
          o = { id: i, key: e, deliveryMode: r, callback: n };
        return (
          this.callbackInfos.push(o),
          r === "all"
            ? this.subscribeAll(o)
            : this.subscribeWaitForRemote(o, r.timeout),
          i
        );
      }),
      (t.prototype.unsubscribe = function (e) {
        var r = this.callbackInfos.findIndex(function (n) {
          return n.id === e;
        });
        return r === -1
          ? (this.logger.debug(
              "Remote config client unsubscribe failed because callback with id ".concat(
                e,
                " doesn't exist.",
              ),
            ),
            !1)
          : (this.callbackInfos.splice(r, 1),
            this.logger.debug(
              "Remote config client unsubscribe succeeded removing callback with id ".concat(
                e,
                ".",
              ),
            ),
            !0);
      }),
      (t.prototype.updateConfigs = function () {
        return S(this, void 0, void 0, function () {
          var e,
            r,
            n = this;
          return E(this, function (i) {
            switch (i.label) {
              case 0:
                return this.lastSuccessfulFetch &&
                  ((e = Date.now() - this.lastSuccessfulFetch), e < Ls)
                  ? (this.logger.debug(
                      "Remote config client skipping updateConfigs: Too recent",
                    ),
                    [2])
                  : [4, this.getOrCreateFetchPromise()];
              case 1:
                return (
                  (r = i.sent()),
                  this.storage.setConfig(r),
                  this.callbackInfos.forEach(function (o) {
                    n.sendCallback(o, r, "remote");
                  }),
                  [2]
                );
            }
          });
        });
      }),
      (t.prototype.getOrCreateFetchPromise = function () {
        var e = this;
        return this.fetchPromise
          ? this.fetchPromise
          : ((this.fetchPromise = this.fetch()
              .then(function (r) {
                return (
                  r.remoteConfig !== null &&
                    (e.lastSuccessfulFetch = Date.now()),
                  r
                );
              })
              .finally(function () {
                e.fetchPromise = null;
              })),
            this.fetchPromise);
      }),
      (t.prototype.subscribeAll = function (e) {
        return S(this, void 0, void 0, function () {
          var r,
            n,
            i,
            o = this;
          return E(this, function (a) {
            switch (a.label) {
              case 0:
                return (
                  (r = this.getOrCreateFetchPromise().then(function (s) {
                    (o.logger.debug(
                      "Remote config client subscription all mode fetched from remote: ".concat(
                        JSON.stringify(s),
                      ),
                    ),
                      o.sendCallback(e, s, "remote"),
                      o.storage.setConfig(s));
                  })),
                  (n = this.storage.fetchConfig().then(function (s) {
                    return s;
                  })),
                  [4, Promise.race([r, n])]
                );
              case 1:
                return (
                  (i = a.sent()),
                  i !== void 0 &&
                    (this.logger.debug(
                      "Remote config client subscription all mode fetched from cache: ".concat(
                        JSON.stringify(i),
                      ),
                    ),
                    i.remoteConfig !== null
                      ? this.sendCallback(e, i, "cache")
                      : this.logger.debug(
                          "Remote config client skips sending callback because cache is empty (first time user).",
                        )),
                  [4, r]
                );
              case 2:
                return (a.sent(), [2]);
            }
          });
        });
      }),
      (t.prototype.subscribeWaitForRemote = function (e, r) {
        return S(this, void 0, void 0, function () {
          var n, i, i;
          return E(this, function (o) {
            switch (o.label) {
              case 0:
                ((n = new Promise(function (a, s) {
                  setTimeout(function () {
                    s("Timeout exceeded");
                  }, r);
                })),
                  (o.label = 1));
              case 1:
                return (
                  o.trys.push([1, 3, , 5]),
                  [4, Promise.race([this.getOrCreateFetchPromise(), n])]
                );
              case 2:
                return (
                  (i = o.sent()),
                  this.logger.debug(
                    "Remote config client subscription wait for remote mode returns from remote.",
                  ),
                  this.sendCallback(e, i, "remote"),
                  this.storage.setConfig(i),
                  [3, 5]
                );
              case 3:
                return (
                  o.sent(),
                  this.logger.debug(
                    "Remote config client subscription wait for remote mode exceeded timeout. Try to fetch from cache.",
                  ),
                  [4, this.storage.fetchConfig()]
                );
              case 4:
                return (
                  (i = o.sent()),
                  i.remoteConfig !== null
                    ? (this.logger.debug(
                        "Remote config client subscription wait for remote mode returns a cached copy.",
                      ),
                      this.sendCallback(e, i, "cache"))
                    : (this.logger.debug(
                        "Remote config client subscription wait for remote mode failed to fetch cache.",
                      ),
                      this.sendCallback(e, i, "remote")),
                  [3, 5]
                );
              case 5:
                return [2];
            }
          });
        });
      }),
      (t.prototype.sendCallback = function (e, r, n) {
        e.lastCallback = new Date();
        var i;
        (e.key
          ? (i = e.key.split(".").reduce(function (o, a) {
              return o === null ? o : a in o ? o[a] : null;
            }, r.remoteConfig))
          : (i = r.remoteConfig),
          e.callback(i, n, r.lastFetch));
      }),
      (t.prototype.fetch = function (e, r) {
        return (
          e === void 0 && (e = Rs),
          r === void 0 && (r = Os),
          S(this, void 0, void 0, function () {
            var n,
              i,
              o,
              a,
              s,
              u,
              c = this;
            return E(this, function (l) {
              switch (l.label) {
                case 0:
                  ((n = r / e),
                    (i = { remoteConfig: null, lastFetch: new Date() }),
                    (o = function (f) {
                      var d, v, h, m, y, p;
                      return E(this, function (g) {
                        switch (g.label) {
                          case 0:
                            ((d = new AbortController()),
                              (v = setTimeout(function () {
                                return d.abort();
                              }, r)),
                              (g.label = 1));
                          case 1:
                            return (
                              g.trys.push([1, 7, 8, 9]),
                              [
                                4,
                                fetch(a.getUrlParams(), {
                                  method: "GET",
                                  headers: { Accept: "*/*" },
                                  signal: d.signal,
                                }),
                              ]
                            );
                          case 2:
                            return (
                              (h = g.sent()),
                              h.ok ? [3, 4] : [4, h.text()]
                            );
                          case 3:
                            return (
                              (m = g.sent()),
                              a.logger.debug(
                                "Remote config client fetch with retry time "
                                  .concat(e, " failed with ")
                                  .concat(h.status, ": ")
                                  .concat(m),
                              ),
                              [3, 6]
                            );
                          case 4:
                            return [4, h.json()];
                          case 5:
                            return (
                              (y = g.sent()),
                              [
                                2,
                                {
                                  value: {
                                    remoteConfig: y,
                                    lastFetch: new Date(),
                                  },
                                },
                              ]
                            );
                          case 6:
                            return [3, 9];
                          case 7:
                            return (
                              (p = g.sent()),
                              p instanceof Error && p.name === "AbortError"
                                ? a.logger.debug(
                                    "Remote config client fetch with retry time "
                                      .concat(e, " timed out after ")
                                      .concat(r, "ms"),
                                  )
                                : a.logger.debug(
                                    "Remote config client fetch with retry time ".concat(
                                      e,
                                      " is rejected because: ",
                                    ),
                                    p,
                                  ),
                              [3, 9]
                            );
                          case 8:
                            return (clearTimeout(v), [7]);
                          case 9:
                            return f < e - 1
                              ? [
                                  4,
                                  new Promise(function (b) {
                                    return setTimeout(b, c.getJitterDelay(n));
                                  }),
                                ]
                              : [3, 11];
                          case 10:
                            (g.sent(), (g.label = 11));
                          case 11:
                            return [2];
                        }
                      });
                    }),
                    (a = this),
                    (s = 0),
                    (l.label = 1));
                case 1:
                  return s < e ? [5, o(s)] : [3, 4];
                case 2:
                  if (((u = l.sent()), typeof u == "object"))
                    return [2, u.value];
                  l.label = 3;
                case 3:
                  return (s++, [3, 1]);
                case 4:
                  return [2, i];
              }
            });
          })
        );
      }),
      (t.prototype.getJitterDelay = function (e) {
        return Math.floor(Math.random() * e);
      }),
      (t.prototype.getUrlParams = function () {
        var e = encodeURIComponent(this.apiKey),
          r = new URLSearchParams();
        return (
          r.append("config_group", t.CONFIG_GROUP),
          "".concat(this.serverUrl, "/").concat(e, "?").concat(r.toString())
        );
      }),
      (t.CONFIG_GROUP = "browser"),
      t
    );
  })(),
  pt;
(function (t) {
  ((t.US = "US"), (t.EU = "EU"), (t.STAGING = "STAGING"));
})(pt || (pt = {}));
var Ds = null,
  Ns = [
    "a",
    "button",
    "input",
    "select",
    "textarea",
    "label",
    "video",
    "audio",
    '[contenteditable="true" i]',
    "[data-amp-default-track]",
    ".amp-default-track",
  ],
  eo = "data-amp-track-",
  Ms = ["div", "span", "h1", "h2", "h3", "h4", "h5", "h6"],
  xs = [
    "a",
    "button",
    '[role="button"]',
    '[role="link"]',
    '[role="menuitem"]',
    '[role="menuitemcheckbox"]',
    '[role="menuitemradio"]',
    '[role="option"]',
    '[role="tab"]',
    '[role="treeitem"]',
    '[contenteditable="true" i]',
  ],
  Us = V(
    [
      'input[type="button"]',
      'input[type="submit"]',
      'input[type="reset"]',
      'input[type="image"]',
      'input[type="file"]',
    ],
    L(xs),
    !1,
  ),
  Fs = ["*"],
  qs = 1e3,
  Bs = 4,
  Vs = 50;
function js(t) {
  return (
    typeof t == "string" ||
    typeof t == "number" ||
    typeof t == "boolean" ||
    t === null ||
    t === void 0
  );
}
function to(t, e, r) {
  if (t) {
    var n = e.map(Fn),
      i = r.map(Fn);
    ro({ json: t, allowlist: n, excludelist: i, ancestors: [] });
  }
}
function ro(t) {
  var e,
    r,
    n = t.json,
    i = t.targetObject,
    o = t.allowlist,
    a = t.excludelist,
    s = t.ancestors,
    u = t.parentObject,
    c = t.targetKey;
  i || (i = n);
  var l = Object.keys(i);
  try {
    for (var f = x(l), d = f.next(); !d.done; d = f.next()) {
      var v = d.value,
        h = V(V([], L(s), !1), [v], !1);
      js(i[v])
        ? (!qn(h, o) || qn(h, a)) && delete i[v]
        : ro({
            json: n,
            targetObject: i[v],
            allowlist: o,
            excludelist: a,
            ancestors: h,
            parentObject: i,
            targetKey: v,
          });
    }
  } catch (m) {
    e = { error: m };
  } finally {
    try {
      d && !d.done && (r = f.return) && r.call(f);
    } finally {
      if (e) throw e.error;
    }
  }
  Object.keys(i).length === 0 && u && c && delete u[c];
}
function Fn(t) {
  return (
    t.startsWith("/") && (t = t.slice(1)),
    t.split("/").map(function (e) {
      return e.replace(/~0/g, "~").replace(/~1/g, "/");
    })
  );
}
function kr(t, e, r, n) {
  if ((r === void 0 && (r = 0), n === void 0 && (n = 0), n === e.length))
    return r === t.length;
  if (r === t.length) {
    for (; n < e.length && e[n] === "**"; ) n++;
    return n === e.length;
  }
  var i = e[n];
  if (i === "**") {
    if (n + 1 === e.length) return !0;
    for (var o = r; o <= t.length; o++) if (kr(t, e, o, n + 1)) return !0;
    return !1;
  } else return i === "*" || i === t[r] ? kr(t, e, r + 1, n + 1) : !1;
}
function qn(t, e) {
  return e.some(function (r) {
    return kr(t, r);
  });
}
var Gs = 500,
  no = 100,
  Hs = (function () {
    function t(e) {
      this.request = e;
    }
    return (
      (t.prototype.headers = function (e) {
        var r, n;
        e === void 0 && (e = []);
        var i = this.request.headers,
          o = {};
        if (Array.isArray(i))
          i.forEach(function (f) {
            var d = L(f, 2),
              v = d[0],
              h = d[1];
            o[v] = h;
          });
        else if (i instanceof Headers)
          i.forEach(function (f, d) {
            o[d] = f;
          });
        else if (typeof i == "object" && i !== null)
          try {
            for (
              var a = x(Object.entries(i)), s = a.next();
              !s.done;
              s = a.next()
            ) {
              var u = L(s.value, 2),
                c = u[0],
                l = u[1];
              o[c] = l;
            }
          } catch (f) {
            r = { error: f };
          } finally {
            try {
              s && !s.done && (n = a.return) && n.call(a);
            } finally {
              if (r) throw r.error;
            }
          }
        return Zt(o, { allow: e });
      }),
      Object.defineProperty(t.prototype, "bodySize", {
        get: function () {
          if (typeof this._bodySize == "number") return this._bodySize;
          var e = B();
          if (e?.TextEncoder) {
            var r = this.request.body;
            return ((this._bodySize = io(r, no)), this._bodySize);
          }
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "method", {
        get: function () {
          return this.request.method;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "body", {
        get: function () {
          return typeof this.request.body == "string"
            ? this.request.body
            : null;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.prototype.json = function (e, r) {
        return (
          e === void 0 && (e = []),
          r === void 0 && (r = []),
          S(this, void 0, void 0, function () {
            var n;
            return E(this, function (i) {
              return e.length === 0
                ? [2, null]
                : ((n = this.body), [2, Qr(n, e, r)]);
            });
          })
        );
      }),
      t
    );
  })(),
  Ws = (function () {
    function t(e, r) {
      ((this.bodyRaw = e), (this.requestHeaders = r));
    }
    return (
      (t.prototype.headers = function (e) {
        return (
          e === void 0 && (e = []),
          Zt(this.requestHeaders, { allow: e })
        );
      }),
      Object.defineProperty(t.prototype, "bodySize", {
        get: function () {
          return io(this.bodyRaw, no);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "body", {
        get: function () {
          return typeof this.bodyRaw == "string" ? this.bodyRaw : null;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.prototype.json = function (e, r) {
        return (
          e === void 0 && (e = []),
          r === void 0 && (r = []),
          S(this, void 0, void 0, function () {
            var n;
            return E(this, function (i) {
              return e.length === 0
                ? [2, null]
                : ((n = this.body), [2, Qr(n, e, r)]);
            });
          })
        );
      }),
      t
    );
  })();
function io(t, e) {
  var r,
    n,
    i,
    o = B(),
    a = o?.TextEncoder;
  if (a) {
    var s;
    if (typeof t == "string") ((s = t), (i = new a().encode(s).length));
    else if (t instanceof Blob) ((s = t), (i = s.size));
    else if (t instanceof URLSearchParams)
      ((s = t), (i = new a().encode(s.toString()).length));
    else if (ArrayBuffer.isView(t)) ((s = t), (i = s.byteLength));
    else if (t instanceof ArrayBuffer) ((s = t), (i = s.byteLength));
    else if (t instanceof FormData) {
      var u = t,
        c = 0,
        l = 0;
      try {
        for (var f = x(u.entries()), d = f.next(); !d.done; d = f.next()) {
          var v = L(d.value, 2),
            h = v[0],
            m = v[1];
          if (((c += h.length), typeof m == "string"))
            c += new a().encode(m).length;
          else if (m instanceof Blob) c += m.size;
          else return;
          if (++l >= e) return;
        }
      } catch (y) {
        r = { error: y };
      } finally {
        try {
          d && !d.done && (n = f.return) && n.call(f);
        } finally {
          if (r) throw r.error;
        }
      }
      i = c;
    } else if (t instanceof ReadableStream) {
      s = t;
      return;
    }
    return i;
  }
}
var Ks = (function () {
    function t(e) {
      this.response = e;
    }
    return (
      (t.prototype.headers = function (e) {
        var r;
        if (
          (e === void 0 && (e = []), this.response.headers instanceof Headers)
        ) {
          var n = this.response.headers,
            i = {};
          return (
            (r = n?.forEach) === null ||
              r === void 0 ||
              r.call(n, function (o, a) {
                i[a] = o;
              }),
            Zt(i, { allow: e })
          );
        }
      }),
      Object.defineProperty(t.prototype, "bodySize", {
        get: function () {
          var e, r;
          if (this._bodySize !== void 0) return this._bodySize;
          var n =
              (r =
                (e = this.response.headers) === null || e === void 0
                  ? void 0
                  : e.get) === null || r === void 0
                ? void 0
                : r.call(e, "content-length"),
            i = n ? parseInt(n, 10) : void 0;
          return ((this._bodySize = i), i);
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "status", {
        get: function () {
          return this.response.status;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.prototype.text = function () {
        return S(this, void 0, void 0, function () {
          var e, r, n;
          return E(this, function (i) {
            switch (i.label) {
              case 0:
                (this.clonedResponse ||
                  (this.clonedResponse = this.response.clone()),
                  (i.label = 1));
              case 1:
                return (
                  i.trys.push([1, 3, , 4]),
                  (e = this.clonedResponse.text()),
                  (r = new Promise(function (o) {
                    return setTimeout(function () {
                      return o(null);
                    }, Gs);
                  })),
                  [4, Promise.race([e, r])]
                );
              case 2:
                return ((n = i.sent()), [2, n]);
              case 3:
                return (i.sent(), [2, null]);
              case 4:
                return [2];
            }
          });
        });
      }),
      (t.prototype.json = function (e, r) {
        return (
          e === void 0 && (e = []),
          r === void 0 && (r = []),
          S(this, void 0, void 0, function () {
            var n;
            return E(this, function (i) {
              switch (i.label) {
                case 0:
                  return e.length === 0 ? [2, null] : [4, this.text()];
                case 1:
                  return ((n = i.sent()), [2, Qr(n, e, r)]);
              }
            });
          })
        );
      }),
      t
    );
  })(),
  zs = (function () {
    function t(e, r, n, i) {
      ((this.statusCode = e),
        (this.headersString = r),
        (this.size = n),
        (this.getJson = i));
    }
    return (
      Object.defineProperty(t.prototype, "bodySize", {
        get: function () {
          return this.size;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "status", {
        get: function () {
          return this.statusCode;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.prototype.headers = function (e) {
        var r, n;
        if ((e === void 0 && (e = []), !this.headersString)) return {};
        var i = {},
          o = this.headersString.split(`\r
`);
        try {
          for (var a = x(o), s = a.next(); !s.done; s = a.next()) {
            var u = s.value,
              c = L(u.split(": "), 2),
              l = c[0],
              f = c[1];
            l && f && (i[l] = f);
          }
        } catch (d) {
          r = { error: d };
        } finally {
          try {
            s && !s.done && (n = a.return) && n.call(a);
          } finally {
            if (r) throw r.error;
          }
        }
        return Zt(i, { allow: e });
      }),
      (t.prototype.json = function (e, r) {
        return (
          e === void 0 && (e = []),
          r === void 0 && (r = []),
          S(this, void 0, void 0, function () {
            var n;
            return E(this, function (i) {
              return e.length === 0
                ? [2, null]
                : ((n = this.getJson()), n ? (to(n, e, r), [2, n]) : [2, null]);
            });
          })
        );
      }),
      t
    );
  })();
function Qr(t, e, r) {
  if (!t) return null;
  try {
    var n = JSON.parse(t);
    return (to(n, e, r), n);
  } catch {
    return null;
  }
}
var st;
(function (t) {
  ((t.REDACT = "redact"), (t.REMOVE = "remove"));
})(st || (st = {}));
var Bn = "[REDACTED]",
  Zt = function (t, e) {
    var r,
      n,
      i = e.allow,
      o = i === void 0 ? [] : i,
      a = e.strategy,
      s = a === void 0 ? st.REMOVE : a,
      u = V([], L(ka), !1),
      c = {},
      l = function (h) {
        var m = h.toLowerCase();
        u.find(function (y) {
          return y.toLowerCase() === m;
        })
          ? s === st.REDACT && (c[h] = Bn)
          : o.find(function (y) {
                return y.toLowerCase() === m;
              })
            ? (c[h] = t[h])
            : s === st.REDACT && (c[h] = Bn);
      };
    try {
      for (var f = x(Object.keys(t)), d = f.next(); !d.done; d = f.next()) {
        var v = d.value;
        l(v);
      }
    } catch (h) {
      r = { error: h };
    } finally {
      try {
        d && !d.done && (n = f.return) && n.call(f);
      } finally {
        if (r) throw r.error;
      }
    }
    return c;
  },
  $s = (function () {
    function t(e, r, n, i, o, a, s, u, c, l, f) {
      (s === void 0 && (s = 0),
        (this.type = e),
        (this.method = r),
        (this.timestamp = n),
        (this.startTime = i),
        (this.url = o),
        (this.requestWrapper = a),
        (this.status = s),
        (this.duration = u),
        (this.responseWrapper = c),
        (this.error = l),
        (this.endTime = f));
    }
    return (
      (t.prototype.toSerializable = function () {
        var e,
          r,
          n,
          i,
          o = {
            type: this.type,
            method: this.method,
            url: this.url,
            timestamp: this.timestamp,
            status: this.status,
            duration: this.duration,
            error: this.error,
            startTime: this.startTime,
            endTime: this.endTime,
            requestHeaders:
              (e = this.requestWrapper) === null || e === void 0
                ? void 0
                : e.headers(V([], L(Bt), !1)),
            requestBodySize:
              (r = this.requestWrapper) === null || r === void 0
                ? void 0
                : r.bodySize,
            responseHeaders:
              (n = this.responseWrapper) === null || n === void 0
                ? void 0
                : n.headers(V([], L(Bt), !1)),
            responseBodySize:
              (i = this.responseWrapper) === null || i === void 0
                ? void 0
                : i.bodySize,
          };
        return Object.fromEntries(
          Object.entries(o).filter(function (a) {
            var s = L(a, 2);
            s[0];
            var u = s[1];
            return u !== void 0;
          }),
        );
      }),
      t
    );
  })();
function Xs(t) {
  return typeof t == "object" && t !== null && "url" in t && "method" in t;
}
var Ys = (function () {
    function t(e, r) {
      (r === void 0 && (r = Re()), (this.callback = e), (this.id = r));
    }
    return t;
  })(),
  Js = (function () {
    function t(e) {
      ((this.eventCallbacks = new Map()),
        (this.isObserving = !1),
        (this.logger = e));
      var r = B();
      t.isSupported() && (this.globalScope = r);
    }
    return (
      (t.isSupported = function () {
        var e = B();
        return !!e && !!e.fetch;
      }),
      (t.prototype.subscribe = function (e, r) {
        var n, i, o, a, s, u, c, l, f, d;
        if (
          (this.logger || (this.logger = r),
          this.eventCallbacks.set(e.id, e),
          !this.isObserving)
        ) {
          var v =
              (o =
                (i =
                  (n = this.globalScope) === null || n === void 0
                    ? void 0
                    : n.XMLHttpRequest) === null || i === void 0
                  ? void 0
                  : i.prototype) === null || o === void 0
                ? void 0
                : o.open,
            h =
              (u =
                (s =
                  (a = this.globalScope) === null || a === void 0
                    ? void 0
                    : a.XMLHttpRequest) === null || s === void 0
                  ? void 0
                  : s.prototype) === null || u === void 0
                ? void 0
                : u.send,
            m =
              (f =
                (l =
                  (c = this.globalScope) === null || c === void 0
                    ? void 0
                    : c.XMLHttpRequest) === null || l === void 0
                  ? void 0
                  : l.prototype) === null || f === void 0
                ? void 0
                : f.setRequestHeader;
          v && h && m && this.observeXhr(v, h, m);
          var y =
            (d = this.globalScope) === null || d === void 0 ? void 0 : d.fetch;
          (y && this.observeFetch(y), (this.isObserving = !0));
        }
      }),
      (t.prototype.unsubscribe = function (e) {
        this.eventCallbacks.delete(e.id);
      }),
      (t.prototype.triggerEventCallbacks = function (e) {
        var r = this;
        this.eventCallbacks.forEach(function (n) {
          var i;
          try {
            n.callback(e);
          } catch (o) {
            (i = r.logger) === null ||
              i === void 0 ||
              i.debug(
                "an unexpected error occurred while triggering event callbacks",
                o,
              );
          }
        });
      }),
      (t.prototype.handleNetworkRequestEvent = function (e, r, n, i, o, a, s) {
        var u;
        if (!(a === void 0 || s === void 0)) {
          var c,
            l = "GET";
          if (
            (Xs(r)
              ? ((c = r.url), (l = r.method))
              : (c =
                  (u = r?.toString) === null || u === void 0
                    ? void 0
                    : u.call(r)),
            c)
          )
            try {
              var f = new URL(c);
              c = ""
                .concat(f.protocol, "//")
                .concat(f.host)
                .concat(f.pathname)
                .concat(f.search)
                .concat(f.hash);
            } catch {}
          l = n?.method || l;
          var d, v;
          (i && (d = i.status),
            o &&
              ((v = {
                name: o.name || "UnknownError",
                message: o.message || "An unknown error occurred",
              }),
              (d = 0)));
          var h = Math.floor(performance.now() - s),
            m = Math.floor(a + h),
            y = new $s(e, l, a, a, c, n, d, h, i, v, m);
          this.triggerEventCallbacks(y);
        }
      }),
      (t.prototype.getTimestamps = function () {
        var e, r;
        return {
          startTime:
            (e = Date.now) === null || e === void 0 ? void 0 : e.call(Date),
          durationStart:
            (r = performance?.now) === null || r === void 0
              ? void 0
              : r.call(performance),
        };
      }),
      (t.prototype.observeFetch = function (e) {
        var r = this;
        !this.globalScope ||
          !e ||
          (this.globalScope.fetch = function (n, i) {
            return S(r, void 0, void 0, function () {
              var o, a, s, u, c, l;
              return E(this, function (f) {
                switch (f.label) {
                  case 0:
                    try {
                      o = this.getTimestamps();
                    } catch (d) {
                      (c = this.logger) === null ||
                        c === void 0 ||
                        c.debug(
                          "an unexpected error occurred while retrieving timestamps",
                          d,
                        );
                    }
                    f.label = 1;
                  case 1:
                    return (f.trys.push([1, 3, , 4]), [4, e(n, i)]);
                  case 2:
                    return ((a = f.sent()), [3, 4]);
                  case 3:
                    return ((u = f.sent()), (s = u), [3, 4]);
                  case 4:
                    try {
                      this.handleNetworkRequestEvent(
                        "fetch",
                        n,
                        i ? new Hs(i) : void 0,
                        a ? new Ks(a) : void 0,
                        s,
                        o?.startTime,
                        o?.durationStart,
                      );
                    } catch (d) {
                      (l = this.logger) === null ||
                        l === void 0 ||
                        l.debug(
                          "an unexpected error occurred while handling fetch",
                          d,
                        );
                    }
                    if (a) return [2, a];
                    throw s;
                }
              });
            });
          });
      }),
      (t.createXhrJsonParser = function (e, r) {
        return function () {
          var n, i;
          try {
            if (e.responseType === "json") {
              if (
                !((n = r.globalScope) === null || n === void 0) &&
                n.structuredClone
              )
                return r.globalScope.structuredClone(e.response);
            } else if (["text", ""].includes(e.responseType))
              return JSON.parse(e.responseText);
          } catch (o) {
            return (
              o instanceof Error &&
                o.name === "InvalidStateError" &&
                ((i = r.logger) === null ||
                  i === void 0 ||
                  i.error(
                    "unexpected error when retrieving responseText. responseType='".concat(
                      e.responseType,
                      "'",
                    ),
                  )),
              null
            );
          }
          return null;
        };
      }),
      (t.prototype.observeXhr = function (e, r, n) {
        if (!(!this.globalScope || !e || !r)) {
          var i = this.globalScope.XMLHttpRequest.prototype,
            o = this;
          ((i.open = function () {
            for (var a, s, u = [], c = 0; c < arguments.length; c++)
              u[c] = arguments[c];
            var l = this,
              f = L(u, 2),
              d = f[0],
              v = f[1];
            try {
              l.$$AmplitudeAnalyticsEvent = C(
                {
                  method: d,
                  url:
                    (a = v?.toString) === null || a === void 0
                      ? void 0
                      : a.call(v),
                  headers: {},
                },
                o.getTimestamps(),
              );
            } catch (h) {
              (s = o.logger) === null ||
                s === void 0 ||
                s.error(
                  "an unexpected error occurred while calling xhr open",
                  h,
                );
            }
            return e.apply(l, u);
          }),
            (i.send = function () {
              for (var a = [], s = 0; s < arguments.length; s++)
                a[s] = arguments[s];
              var u = this,
                c = u,
                l = t.createXhrJsonParser(u, o),
                f = a[0],
                d = c.$$AmplitudeAnalyticsEvent;
              return (
                c.addEventListener("loadend", function () {
                  var v;
                  try {
                    var h = c.getAllResponseHeaders(),
                      m = c.getResponseHeader("content-length"),
                      y = new zs(c.status, h, m ? parseInt(m, 10) : void 0, l),
                      p = c.$$AmplitudeAnalyticsEvent.headers,
                      g = new Ws(f, p);
                    ((d.status = c.status),
                      o.handleNetworkRequestEvent(
                        "xhr",
                        { url: d.url, method: d.method },
                        g,
                        y,
                        void 0,
                        d.startTime,
                        d.durationStart,
                      ));
                  } catch (b) {
                    (v = o.logger) === null ||
                      v === void 0 ||
                      v.error(
                        "an unexpected error occurred while handling xhr send",
                        b,
                      );
                  }
                }),
                r.apply(c, a)
              );
            }),
            (i.setRequestHeader = function (a, s) {
              var u,
                c = this;
              try {
                c.$$AmplitudeAnalyticsEvent.headers[a] = s;
              } catch (l) {
                (u = o.logger) === null ||
                  u === void 0 ||
                  u.error(
                    "an unexpected error occurred while calling xhr setRequestHeader",
                    l,
                  );
              }
              n.apply(c, [a, s]);
            }));
        }
      }),
      t
    );
  })(),
  Vn = new Js(),
  oo = (function () {
    function t() {}
    return (
      (t.prototype.parse = function () {
        return S(this, void 0, void 0, function () {
          return E(this, function (e) {
            return [
              2,
              C(
                C(C(C({}, Jt), this.getUtmParam()), this.getReferrer()),
                this.getClickIds(),
              ),
            ];
          });
        });
      }),
      (t.prototype.getUtmParam = function () {
        var e = Vt(),
          r = e[wa],
          n = e[Ia],
          i = e[_a],
          o = e[Pa],
          a = e[Ca],
          s = e[Aa];
        return {
          utm_campaign: r,
          utm_content: n,
          utm_id: i,
          utm_medium: o,
          utm_source: a,
          utm_term: s,
        };
      }),
      (t.prototype.getReferrer = function () {
        var e,
          r,
          n = { referrer: void 0, referring_domain: void 0 };
        try {
          ((n.referrer = document.referrer || void 0),
            (n.referring_domain =
              (r =
                (e = n.referrer) === null || e === void 0
                  ? void 0
                  : e.split("/")[2]) !== null && r !== void 0
                ? r
                : void 0));
        } catch {}
        return n;
      }),
      (t.prototype.getClickIds = function () {
        var e,
          r = Vt();
        return (
          (e = {}),
          (e[bn] = r[bn]),
          (e[En] = r[En]),
          (e[Sn] = r[Sn]),
          (e[Tn] = r[Tn]),
          (e[wn] = r[wn]),
          (e[In] = r[In]),
          (e[_n] = r[_n]),
          (e[Pn] = r[Pn]),
          (e[Cn] = r[Cn]),
          (e[An] = r[An]),
          (e[kn] = r[kn]),
          e
        );
      }),
      t
    );
  })(),
  ut = "data-amp-mask",
  ke = "*****",
  Qs = /\b(?:\d[ -]*?){13,16}\b/,
  Zs = /(\d{3}-?\d{2}-?\d{4})/g,
  eu = /[^\s@]+@[^\s@.]+\.[^\s@]+/g,
  Zr = function (t, e) {
    var r, n;
    if ((e === void 0 && (e = []), typeof t != "string")) return "";
    var i = t;
    ((i = i.replace(Qs, ke)), (i = i.replace(Zs, ke)), (i = i.replace(eu, ke)));
    try {
      for (var o = x(e), a = o.next(); !a.done; a = o.next()) {
        var s = a.value;
        try {
          i = i.replace(s, ke);
        } catch {}
      }
    } catch (u) {
      r = { error: u };
    } finally {
      try {
        a && !a.done && (n = o.return) && n.call(o);
      } finally {
        if (r) throw r.error;
      }
    }
    return i;
  },
  en = function (t) {
    if (typeof document > "u" || !document.title) return "";
    var e = document.querySelector("title");
    return e && e.hasAttribute(ut)
      ? ke
      : t
        ? t(document.title)
        : document.title;
  };
function tu(t, e) {
  var r = (typeof Symbol < "u" && t[Symbol.iterator]) || t["@@iterator"];
  if (r) return (r = r.call(t)).next.bind(r);
  if (Array.isArray(t) || (r = ru(t)) || e) {
    r && (t = r);
    var n = 0;
    return function () {
      return n >= t.length ? { done: !0 } : { done: !1, value: t[n++] };
    };
  }
  throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ru(t, e) {
  if (t) {
    if (typeof t == "string") return jn(t, e);
    var r = Object.prototype.toString.call(t).slice(8, -1);
    if (
      (r === "Object" && t.constructor && (r = t.constructor.name),
      r === "Map" || r === "Set")
    )
      return Array.from(t);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))
      return jn(t, e);
  }
}
function jn(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var r = 0, n = new Array(e); r < e; r++) n[r] = t[r];
  return n;
}
function Gn(t, e) {
  for (var r = 0; r < e.length; r++) {
    var n = e[r];
    ((n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      "value" in n && (n.writable = !0),
      Object.defineProperty(t, n.key, n));
  }
}
function tn(t, e, r) {
  return (e && Gn(t.prototype, e), r && Gn(t, r), t);
}
var rn = function () {
    return typeof Symbol == "function";
  },
  nn = function (t) {
    return rn() && !!Symbol[t];
  },
  on = function (t) {
    return nn(t) ? Symbol[t] : "@@" + t;
  };
rn() && !nn("observable") && (Symbol.observable = Symbol("observable"));
var nu = on("iterator"),
  Rr = on("observable"),
  ao = on("species");
function Gt(t, e) {
  var r = t[e];
  if (r != null) {
    if (typeof r != "function") throw new TypeError(r + " is not a function");
    return r;
  }
}
function Ze(t) {
  var e = t.constructor;
  return (
    e !== void 0 && ((e = e[ao]), e === null && (e = void 0)),
    e !== void 0 ? e : de
  );
}
function iu(t) {
  return t instanceof de;
}
function Ke(t) {
  Ke.log
    ? Ke.log(t)
    : setTimeout(function () {
        throw t;
      });
}
function Dt(t) {
  Promise.resolve().then(function () {
    try {
      t();
    } catch (e) {
      Ke(e);
    }
  });
}
function so(t) {
  var e = t._cleanup;
  if (e !== void 0 && ((t._cleanup = void 0), !!e))
    try {
      if (typeof e == "function") e();
      else {
        var r = Gt(e, "unsubscribe");
        r && r.call(e);
      }
    } catch (n) {
      Ke(n);
    }
}
function Or(t) {
  ((t._observer = void 0), (t._queue = void 0), (t._state = "closed"));
}
function ou(t) {
  var e = t._queue;
  if (e) {
    ((t._queue = void 0), (t._state = "ready"));
    for (
      var r = 0;
      r < e.length && (uo(t, e[r].type, e[r].value), t._state !== "closed");
      ++r
    );
  }
}
function uo(t, e, r) {
  t._state = "running";
  var n = t._observer;
  try {
    var i = Gt(n, e);
    switch (e) {
      case "next":
        i && i.call(n, r);
        break;
      case "error":
        if ((Or(t), i)) i.call(n, r);
        else throw r;
        break;
      case "complete":
        (Or(t), i && i.call(n));
        break;
    }
  } catch (o) {
    Ke(o);
  }
  t._state === "closed"
    ? so(t)
    : t._state === "running" && (t._state = "ready");
}
function sr(t, e, r) {
  if (t._state !== "closed") {
    if (t._state === "buffering") {
      t._queue.push({ type: e, value: r });
      return;
    }
    if (t._state !== "ready") {
      ((t._state = "buffering"),
        (t._queue = [{ type: e, value: r }]),
        Dt(function () {
          return ou(t);
        }));
      return;
    }
    uo(t, e, r);
  }
}
var au = (function () {
    function t(r, n) {
      ((this._cleanup = void 0),
        (this._observer = r),
        (this._queue = void 0),
        (this._state = "initializing"));
      var i = new su(this);
      try {
        this._cleanup = n.call(void 0, i);
      } catch (o) {
        i.error(o);
      }
      this._state === "initializing" && (this._state = "ready");
    }
    var e = t.prototype;
    return (
      (e.unsubscribe = function () {
        this._state !== "closed" && (Or(this), so(this));
      }),
      tn(t, [
        {
          key: "closed",
          get: function () {
            return this._state === "closed";
          },
        },
      ]),
      t
    );
  })(),
  su = (function () {
    function t(r) {
      this._subscription = r;
    }
    var e = t.prototype;
    return (
      (e.next = function (n) {
        sr(this._subscription, "next", n);
      }),
      (e.error = function (n) {
        sr(this._subscription, "error", n);
      }),
      (e.complete = function () {
        sr(this._subscription, "complete");
      }),
      tn(t, [
        {
          key: "closed",
          get: function () {
            return this._subscription._state === "closed";
          },
        },
      ]),
      t
    );
  })(),
  de = (function () {
    function t(r) {
      if (!(this instanceof t))
        throw new TypeError("Observable cannot be called as a function");
      if (typeof r != "function")
        throw new TypeError("Observable initializer must be a function");
      this._subscriber = r;
    }
    var e = t.prototype;
    return (
      (e.subscribe = function (n) {
        return (
          (typeof n != "object" || n === null) &&
            (n = { next: n, error: arguments[1], complete: arguments[2] }),
          new au(n, this._subscriber)
        );
      }),
      (e.forEach = function (n) {
        var i = this;
        return new Promise(function (o, a) {
          if (typeof n != "function") {
            a(new TypeError(n + " is not a function"));
            return;
          }
          function s() {
            (u.unsubscribe(), o());
          }
          var u = i.subscribe({
            next: function (c) {
              try {
                n(c, s);
              } catch (l) {
                (a(l), u.unsubscribe());
              }
            },
            error: a,
            complete: o,
          });
        });
      }),
      (e.map = function (n) {
        var i = this;
        if (typeof n != "function")
          throw new TypeError(n + " is not a function");
        var o = Ze(this);
        return new o(function (a) {
          return i.subscribe({
            next: function (s) {
              try {
                s = n(s);
              } catch (u) {
                return a.error(u);
              }
              a.next(s);
            },
            error: function (s) {
              a.error(s);
            },
            complete: function () {
              a.complete();
            },
          });
        });
      }),
      (e.filter = function (n) {
        var i = this;
        if (typeof n != "function")
          throw new TypeError(n + " is not a function");
        var o = Ze(this);
        return new o(function (a) {
          return i.subscribe({
            next: function (s) {
              try {
                if (!n(s)) return;
              } catch (u) {
                return a.error(u);
              }
              a.next(s);
            },
            error: function (s) {
              a.error(s);
            },
            complete: function () {
              a.complete();
            },
          });
        });
      }),
      (e.reduce = function (n) {
        var i = this;
        if (typeof n != "function")
          throw new TypeError(n + " is not a function");
        var o = Ze(this),
          a = arguments.length > 1,
          s = !1,
          u = arguments[1],
          c = u;
        return new o(function (l) {
          return i.subscribe({
            next: function (f) {
              var d = !s;
              if (((s = !0), !d || a))
                try {
                  c = n(c, f);
                } catch (v) {
                  return l.error(v);
                }
              else c = f;
            },
            error: function (f) {
              l.error(f);
            },
            complete: function () {
              if (!s && !a)
                return l.error(
                  new TypeError("Cannot reduce an empty sequence"),
                );
              (l.next(c), l.complete());
            },
          });
        });
      }),
      (e.concat = function () {
        for (
          var n = this, i = arguments.length, o = new Array(i), a = 0;
          a < i;
          a++
        )
          o[a] = arguments[a];
        var s = Ze(this);
        return new s(function (u) {
          var c,
            l = 0;
          function f(d) {
            c = d.subscribe({
              next: function (v) {
                u.next(v);
              },
              error: function (v) {
                u.error(v);
              },
              complete: function () {
                l === o.length
                  ? ((c = void 0), u.complete())
                  : f(s.from(o[l++]));
              },
            });
          }
          return (
            f(n),
            function () {
              c && (c.unsubscribe(), (c = void 0));
            }
          );
        });
      }),
      (e.flatMap = function (n) {
        var i = this;
        if (typeof n != "function")
          throw new TypeError(n + " is not a function");
        var o = Ze(this);
        return new o(function (a) {
          var s = [],
            u = i.subscribe({
              next: function (l) {
                if (n)
                  try {
                    l = n(l);
                  } catch (d) {
                    return a.error(d);
                  }
                var f = o.from(l).subscribe({
                  next: function (d) {
                    a.next(d);
                  },
                  error: function (d) {
                    a.error(d);
                  },
                  complete: function () {
                    var d = s.indexOf(f);
                    (d >= 0 && s.splice(d, 1), c());
                  },
                });
                s.push(f);
              },
              error: function (l) {
                a.error(l);
              },
              complete: function () {
                c();
              },
            });
          function c() {
            u.closed && s.length === 0 && a.complete();
          }
          return function () {
            (s.forEach(function (l) {
              return l.unsubscribe();
            }),
              u.unsubscribe());
          };
        });
      }),
      (e[Rr] = function () {
        return this;
      }),
      (t.from = function (n) {
        var i = typeof this == "function" ? this : t;
        if (n == null) throw new TypeError(n + " is not an object");
        var o = Gt(n, Rr);
        if (o) {
          var a = o.call(n);
          if (Object(a) !== a) throw new TypeError(a + " is not an object");
          return iu(a) && a.constructor === i
            ? a
            : new i(function (s) {
                return a.subscribe(s);
              });
        }
        if (nn("iterator") && ((o = Gt(n, nu)), o))
          return new i(function (s) {
            Dt(function () {
              if (!s.closed) {
                for (var u = tu(o.call(n)), c; !(c = u()).done; ) {
                  var l = c.value;
                  if ((s.next(l), s.closed)) return;
                }
                s.complete();
              }
            });
          });
        if (Array.isArray(n))
          return new i(function (s) {
            Dt(function () {
              if (!s.closed) {
                for (var u = 0; u < n.length; ++u)
                  if ((s.next(n[u]), s.closed)) return;
                s.complete();
              }
            });
          });
        throw new TypeError(n + " is not observable");
      }),
      (t.of = function () {
        for (var n = arguments.length, i = new Array(n), o = 0; o < n; o++)
          i[o] = arguments[o];
        var a = typeof this == "function" ? this : t;
        return new a(function (s) {
          Dt(function () {
            if (!s.closed) {
              for (var u = 0; u < i.length; ++u)
                if ((s.next(i[u]), s.closed)) return;
              s.complete();
            }
          });
        });
      }),
      tn(t, null, [
        {
          key: ao,
          get: function () {
            return this;
          },
        },
      ]),
      t
    );
  })();
rn() &&
  Object.defineProperty(de, Symbol("extensions"), {
    value: { symbol: Rr, hostReportError: Ke },
    configurable: !0,
  });
function an(t, e) {
  return new de(function (r) {
    t.subscribe({
      next: function (n) {
        e(n)
          .then(function (i) {
            return r.next(i);
          })
          .catch(function (i) {
            return r.error(i);
          });
      },
      error: function (n) {
        r.error(n);
      },
      complete: function () {
        r.complete();
      },
    });
  });
}
function Ht(t, e) {
  return new de(function (r) {
    var n = !1,
      i = new Set(),
      o = function () {
        var s, u;
        n = !0;
        try {
          for (var c = x(i), l = c.next(); !l.done; l = c.next()) {
            var f = l.value;
            try {
              f.unsubscribe();
            } catch {}
          }
        } catch (d) {
          s = { error: d };
        } finally {
          try {
            l && !l.done && (u = c.return) && u.call(c);
          } finally {
            if (s) throw s.error;
          }
        }
        i.clear();
      },
      a = function (s) {
        var u = s.subscribe({
          next: function (c) {
            n || r.next(c);
          },
          error: function (c) {
            n || ((n = !0), r.error(c), o());
          },
          complete: function () {
            (i.delete(u), !n && i.size === 0 && (r.complete(), o(), (n = !0)));
          },
        });
        i.add(u);
      };
    return (a(t), a(e), o);
  });
}
function De(t) {
  var e = new Set(),
    r = null;
  function n() {
    (r?.unsubscribe(), (r = null), e.clear());
  }
  return new de(function (i) {
    return (
      e.add(i),
      r === null &&
        (r = t.subscribe({
          next: function (o) {
            var a, s, u;
            try {
              for (var c = x(e), l = c.next(); !l.done; l = c.next()) {
                var f = l.value;
                (u = f.next) === null || u === void 0 || u.call(f, o);
              }
            } catch (d) {
              a = { error: d };
            } finally {
              try {
                l && !l.done && (s = c.return) && s.call(c);
              } finally {
                if (a) throw a.error;
              }
            }
          },
          error: function (o) {
            var a, s, u;
            try {
              for (var c = x(e), l = c.next(); !l.done; l = c.next()) {
                var f = l.value;
                (u = f.error) === null || u === void 0 || u.call(f, o);
              }
            } catch (d) {
              a = { error: d };
            } finally {
              try {
                l && !l.done && (s = c.return) && s.call(c);
              } finally {
                if (a) throw a.error;
              }
            }
            n();
          },
          complete: function () {
            var o, a, s;
            try {
              for (var u = x(e), c = u.next(); !c.done; c = u.next()) {
                var l = c.value;
                (s = l.complete) === null || s === void 0 || s.call(l);
              }
            } catch (f) {
              o = { error: f };
            } finally {
              try {
                c && !c.done && (a = u.return) && a.call(u);
              } finally {
                if (o) throw o.error;
              }
            }
            n();
          },
        })),
      function () {
        (e.delete(i), e.size === 0 && r && (r.unsubscribe(), (r = null)));
      }
    );
  });
}
var ze = function (t, e) {
    return typeof t == "boolean" ? t : t?.[e] !== !1;
  },
  co = function (t) {
    return ze(t, "attribution");
  },
  uu = function (t) {
    return ze(t, "fileDownloads");
  },
  cu = function (t) {
    return ze(t, "formInteractions");
  },
  lo = function (t) {
    return ze(t, "pageViews");
  },
  Hn = function (t) {
    return ze(t, "sessions");
  },
  lu = function (t) {
    return ze(t, "pageUrlEnrichment");
  },
  fo = function (t) {
    return typeof t == "boolean"
      ? t
      : typeof t == "object" &&
          (t.networkTracking === !0 || typeof t.networkTracking == "object");
  },
  vo = function (t) {
    return typeof t == "boolean"
      ? t
      : typeof t == "object" &&
          (t.elementInteractions === !0 ||
            typeof t.elementInteractions == "object");
  },
  du = function (t) {
    return typeof t == "boolean"
      ? t
      : typeof t == "object" && t.webVitals === !0;
  },
  ho = function (t) {
    return typeof t == "boolean"
      ? t
      : typeof t == "object" &&
          (t.frustrationInteractions === !0 ||
            typeof t.frustrationInteractions == "object");
  },
  fu = function (t) {
    if (
      vo(t.autocapture) &&
      typeof t.autocapture == "object" &&
      typeof t.autocapture.elementInteractions == "object"
    )
      return t.autocapture.elementInteractions;
  },
  vu = function (t) {
    if (
      ho(t.autocapture) &&
      typeof t.autocapture == "object" &&
      typeof t.autocapture.frustrationInteractions == "object"
    )
      return t.autocapture.frustrationInteractions;
  },
  hu = function (t) {
    var e;
    if (fo(t.autocapture)) {
      var r = void 0;
      return (
        typeof t.autocapture == "object" &&
        typeof t.autocapture.networkTracking == "object"
          ? (r = t.autocapture.networkTracking)
          : t.networkTrackingOptions && (r = t.networkTrackingOptions),
        C(C({}, r), {
          captureRules:
            (e = r?.captureRules) === null || e === void 0
              ? void 0
              : e.map(function (n) {
                  var i, o, a;
                  if (
                    !((i = n.urls) === null || i === void 0) &&
                    i.length &&
                    !((o = n.hosts) === null || o === void 0) &&
                    o.length
                  ) {
                    var s = JSON.stringify(n.hosts),
                      u = JSON.stringify(n.urls);
                    return (
                      (a = t.loggerProvider) === null ||
                        a === void 0 ||
                        a.warn(
                          "Found network capture rule with both urls='"
                            .concat(u, "' and hosts='")
                            .concat(s, "' set. ") +
                            "Definition of urls takes precedence over hosts, so ignoring hosts.",
                        ),
                      C(C({}, n), { hosts: void 0 })
                    );
                  }
                  return n;
                }),
        })
      );
    }
  },
  gu = function (t) {
    var e = function () {
        return !1;
      },
      r = void 0,
      n,
      i = t.pageCounter,
      o = lo(t.defaultTracking);
    return (
      o &&
        ((e = void 0),
        (n = void 0),
        t.defaultTracking &&
          typeof t.defaultTracking == "object" &&
          t.defaultTracking.pageViews &&
          typeof t.defaultTracking.pageViews == "object" &&
          ("trackOn" in t.defaultTracking.pageViews &&
            (e = t.defaultTracking.pageViews.trackOn),
          "trackHistoryChanges" in t.defaultTracking.pageViews &&
            (r = t.defaultTracking.pageViews.trackHistoryChanges),
          "eventType" in t.defaultTracking.pageViews &&
            t.defaultTracking.pageViews.eventType &&
            (n = t.defaultTracking.pageViews.eventType))),
      { trackOn: e, trackHistoryChanges: r, eventType: n, pageCounter: i }
    );
  },
  pu = function (t) {
    return co(t.defaultTracking) &&
      t.defaultTracking &&
      typeof t.defaultTracking == "object" &&
      t.defaultTracking.attribution &&
      typeof t.defaultTracking.attribution == "object"
      ? C({}, t.defaultTracking.attribution)
      : {};
  },
  ur = function (t, e) {
    for (var r = 0; r < e.length; r++) {
      var n = e[r],
        i = n.name,
        o = n.args,
        a = n.resolve,
        s = t && t[i];
      if (typeof s == "function") {
        var u = s.apply(t, o);
        typeof a == "function" && a(u?.promise);
      }
    }
    return t;
  },
  cr = function (t) {
    var e = t;
    return e && e._q !== void 0;
  },
  sn = "2.33.0",
  go = "amplitude-ts",
  mu = "Web",
  yu = "$remote",
  bu = (function () {
    function t() {
      ((this.name = "@amplitude/plugin-context-browser"),
        (this.type = "before"),
        (this.library = "".concat(go, "/").concat(sn)),
        typeof navigator < "u" && (this.userAgent = navigator.userAgent));
    }
    return (
      (t.prototype.setup = function (e) {
        return ((this.config = e), Promise.resolve(void 0));
      }),
      (t.prototype.execute = function (e) {
        var r, n;
        return S(this, void 0, void 0, function () {
          var i, o, a, s;
          return E(this, function (u) {
            return (
              (i = new Date().getTime()),
              (o =
                (r = this.config.lastEventId) !== null && r !== void 0
                  ? r
                  : -1),
              (a = (n = e.event_id) !== null && n !== void 0 ? n : o + 1),
              (this.config.lastEventId = a),
              e.time || (this.config.lastEventTime = i),
              (s = C(
                C(
                  C(
                    C(
                      C(
                        C(
                          C(
                            C(
                              {
                                user_id: this.config.userId,
                                device_id: this.config.deviceId,
                                session_id: this.config.sessionId,
                                time: i,
                              },
                              this.config.appVersion && {
                                app_version: this.config.appVersion,
                              },
                            ),
                            this.config.trackingOptions.platform && {
                              platform: mu,
                            },
                          ),
                          this.config.trackingOptions.language && {
                            language: ls(),
                          },
                        ),
                        this.config.trackingOptions.ipAddress && { ip: yu },
                      ),
                      {
                        insert_id: Re(),
                        partner_id: this.config.partnerId,
                        plan: this.config.plan,
                      },
                    ),
                    this.config.ingestionMetadata && {
                      ingestion_metadata: {
                        source_name: this.config.ingestionMetadata.sourceName,
                        source_version:
                          this.config.ingestionMetadata.sourceVersion,
                      },
                    },
                  ),
                  e,
                ),
                {
                  event_id: a,
                  library: this.library,
                  user_agent: this.userAgent,
                },
              )),
              [2, s]
            );
          });
        });
      }),
      t
    );
  })(),
  Tt = 1e3,
  po = (function (t) {
    be(e, t);
    function e(r) {
      var n = this,
        i,
        o,
        a;
      try {
        a = (i = B()) === null || i === void 0 ? void 0 : i.localStorage;
      } catch (s) {
        ((o = r?.loggerProvider) === null ||
          o === void 0 ||
          o.debug(
            "Failed to access localStorage. error=".concat(JSON.stringify(s)),
          ),
          (a = void 0));
      }
      return (
        (n = t.call(this, a) || this),
        (n.loggerProvider = r?.loggerProvider),
        n
      );
    }
    return (
      (e.prototype.set = function (r, n) {
        var i;
        return S(this, void 0, void 0, function () {
          var o;
          return E(this, function (a) {
            switch (a.label) {
              case 0:
                return Array.isArray(n) && n.length > Tt
                  ? ((o = n.length - Tt),
                    [4, t.prototype.set.call(this, r, n.slice(0, Tt))])
                  : [3, 2];
              case 1:
                return (
                  a.sent(),
                  (i = this.loggerProvider) === null ||
                    i === void 0 ||
                    i.error(
                      "Failed to save "
                        .concat(o, " events because the queue length exceeded ")
                        .concat(Tt, "."),
                    ),
                  [3, 4]
                );
              case 2:
                return [4, t.prototype.set.call(this, r, n)];
              case 3:
                (a.sent(), (a.label = 4));
              case 4:
                return [2];
            }
          });
        });
      }),
      e
    );
  })(Jr),
  Eu = (function (t) {
    be(e, t);
    function e() {
      var r;
      return (
        t.call(
          this,
          (r = B()) === null || r === void 0 ? void 0 : r.sessionStorage,
        ) || this
      );
    }
    return e;
  })(Jr),
  Su = (function (t) {
    be(e, t);
    function e(r) {
      r === void 0 && (r = {});
      var n = t.call(this) || this;
      return ((n.state = { done: 4 }), (n.customHeaders = r), n);
    }
    return (
      (e.prototype.send = function (r, n) {
        return S(this, void 0, void 0, function () {
          var i = this;
          return E(this, function (o) {
            return [
              2,
              new Promise(function (a, s) {
                var u, c;
                typeof XMLHttpRequest > "u" &&
                  s(new Error("XHRTransport is not supported."));
                var l = new XMLHttpRequest();
                (l.open("POST", r, !0),
                  (l.onreadystatechange = function () {
                    if (l.readyState === i.state.done) {
                      var p = l.responseText;
                      try {
                        a(i.buildResponse(JSON.parse(p)));
                      } catch {
                        a(i.buildResponse({ code: l.status }));
                      }
                    }
                  }));
                var f = C(
                  { "Content-Type": "application/json", Accept: "*/*" },
                  i.customHeaders,
                );
                try {
                  for (
                    var d = x(Object.entries(f)), v = d.next();
                    !v.done;
                    v = d.next()
                  ) {
                    var h = L(v.value, 2),
                      m = h[0],
                      y = h[1];
                    l.setRequestHeader(m, y);
                  }
                } catch (p) {
                  u = { error: p };
                } finally {
                  try {
                    v && !v.done && (c = d.return) && c.call(d);
                  } finally {
                    if (u) throw u.error;
                  }
                }
                l.send(JSON.stringify(n));
              }),
            ];
          });
        });
      }),
      e
    );
  })(Qt),
  Tu = (function (t) {
    be(e, t);
    function e() {
      return (t !== null && t.apply(this, arguments)) || this;
    }
    return (
      (e.prototype.send = function (r, n) {
        return S(this, void 0, void 0, function () {
          var i = this;
          return E(this, function (o) {
            return [
              2,
              new Promise(function (a, s) {
                var u = B();
                if (!u?.navigator.sendBeacon)
                  throw new Error("SendBeaconTransport is not supported");
                try {
                  var c = JSON.stringify(n),
                    l = u.navigator.sendBeacon(r, JSON.stringify(n));
                  return a(
                    l
                      ? i.buildResponse({
                          code: 200,
                          events_ingested: n.events.length,
                          payload_size_bytes: c.length,
                          server_upload_time: Date.now(),
                        })
                      : i.buildResponse({ code: 500 }),
                  );
                } catch (f) {
                  s(f);
                }
              }),
            ];
          });
        });
      }),
      e
    );
  })(Qt),
  wu = function (t, e, r) {
    return (
      r === void 0 && (r = !0),
      S(void 0, void 0, void 0, function () {
        var n, i, o, a, s, u, c, l, f;
        return E(this, function (d) {
          switch (d.label) {
            case 0:
              return ((n = cs(t)), [4, e.getRaw(n)]);
            case 1:
              return (
                (i = d.sent()),
                i ? (r ? [4, e.remove(n)] : [3, 3]) : [2, { optOut: !1 }]
              );
            case 2:
              (d.sent(), (d.label = 3));
            case 3:
              return (
                (o = L(i.split("."), 6)),
                (a = o[0]),
                (s = o[1]),
                (u = o[2]),
                (c = o[3]),
                (l = o[4]),
                (f = o[5]),
                [
                  2,
                  {
                    deviceId: a,
                    userId: Iu(s),
                    sessionId: lr(c),
                    lastEventId: lr(f),
                    lastEventTime: lr(l),
                    optOut: !!u,
                  },
                ]
              );
          }
        });
      })
    );
  },
  lr = function (t) {
    var e = parseInt(t, 32);
    if (!isNaN(e)) return e;
  },
  Iu = function (t) {
    if (!(!atob || !escape || !t))
      try {
        return decodeURIComponent(escape(atob(t)));
      } catch {
        return;
      }
  },
  he = "[Amplitude]",
  Wn = "".concat(he, " Form Started"),
  _u = "".concat(he, " Form Submitted"),
  Pu = "".concat(he, " File Downloaded"),
  Kn = "session_start",
  zn = "session_end",
  Cu = "".concat(he, " File Extension"),
  Au = "".concat(he, " File Name"),
  ku = "".concat(he, " Link ID"),
  Ru = "".concat(he, " Link Text"),
  Ou = "".concat(he, " Link URL"),
  dr = "".concat(he, " Form ID"),
  fr = "".concat(he, " Form Name"),
  vr = "".concat(he, " Form Destination"),
  Wt = "cookie",
  Lu = "US",
  Du = (function (t) {
    be(e, t);
    function e(
      r,
      n,
      i,
      o,
      a,
      s,
      u,
      c,
      l,
      f,
      d,
      v,
      h,
      m,
      y,
      p,
      g,
      b,
      T,
      w,
      I,
      _,
      P,
      k,
      A,
      R,
      O,
      G,
      F,
      N,
      U,
      q,
      j,
      $,
      ne,
      Y,
      re,
      X,
      H,
      K,
    ) {
      (i === void 0 && (i = new Yr()),
        o === void 0 &&
          (o = {
            domain: "",
            expiration: 365,
            sameSite: "Lax",
            secure: !1,
            upgrade: !0,
          }),
        c === void 0 && (c = 1e3),
        l === void 0 && (l = 5),
        f === void 0 && (f = 30),
        d === void 0 && (d = Wt),
        p === void 0 && (p = new gt()),
        g === void 0 && (g = ae.Warn),
        T === void 0 && (T = !1),
        w === void 0 && (w = !1),
        P === void 0 && (P = ""),
        k === void 0 && (k = Lu),
        R === void 0 && (R = 1800 * 1e3),
        O === void 0 && (O = new po({ loggerProvider: p })),
        G === void 0 && (G = { ipAddress: !0, language: !0, platform: !0 }),
        F === void 0 && (F = "fetch"),
        N === void 0 && (N = !1),
        U === void 0 && (U = !0),
        re === void 0 && (re = !0),
        X === void 0 && (X = 0));
      var D =
        t.call(this, {
          apiKey: r,
          storageProvider: O,
          transportProvider: mo(F),
        }) || this;
      ((D.apiKey = r),
        (D.appVersion = n),
        (D.cookieOptions = o),
        (D.defaultTracking = a),
        (D.autocapture = s),
        (D.flushIntervalMillis = c),
        (D.flushMaxRetries = l),
        (D.flushQueueSize = f),
        (D.identityStorage = d),
        (D.ingestionMetadata = v),
        (D.instanceName = h),
        (D.loggerProvider = p),
        (D.logLevel = g),
        (D.minIdLength = b),
        (D.offline = T),
        (D.partnerId = I),
        (D.plan = _),
        (D.serverUrl = P),
        (D.serverZone = k),
        (D.sessionTimeout = R),
        (D.storageProvider = O),
        (D.trackingOptions = G),
        (D.transport = F),
        (D.useBatch = N),
        (D.fetchRemoteConfig = U),
        (D.networkTrackingOptions = ne),
        (D.identify = Y),
        (D.enableDiagnostics = re),
        (D.diagnosticsSampleRate = X),
        (D.diagnosticsClient = H),
        (D.remoteConfig = K),
        (D.version = sn),
        (D._optOut = !1),
        (D._cookieStorage = i),
        (D.deviceId = u),
        (D.lastEventId = m),
        (D.lastEventTime = y),
        (D.optOut = w),
        (D.sessionId = A),
        (D.pageCounter = j),
        (D.userId = q),
        (D.debugLogsEnabled = $),
        D.loggerProvider.enable($ ? ae.Debug : D.logLevel),
        (D.networkTrackingOptions = ne),
        (D.identify = Y),
        (D.enableDiagnostics = re),
        (D.diagnosticsSampleRate = X),
        (D.diagnosticsClient = H));
      var ue;
      return (
        K?.fetchRemoteConfig === !0
          ? (ue = !0)
          : K?.fetchRemoteConfig === !1 || U === !1
            ? (ue = !1)
            : (ue = !0),
        (D.remoteConfig = D.remoteConfig || {}),
        (D.remoteConfig.fetchRemoteConfig = ue),
        (D.fetchRemoteConfig = ue),
        D
      );
    }
    return (
      Object.defineProperty(e.prototype, "cookieStorage", {
        get: function () {
          return this._cookieStorage;
        },
        set: function (r) {
          this._cookieStorage !== r &&
            ((this._cookieStorage = r), this.updateStorage());
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "deviceId", {
        get: function () {
          return this._deviceId;
        },
        set: function (r) {
          this._deviceId !== r && ((this._deviceId = r), this.updateStorage());
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "userId", {
        get: function () {
          return this._userId;
        },
        set: function (r) {
          this._userId !== r && ((this._userId = r), this.updateStorage());
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "sessionId", {
        get: function () {
          return this._sessionId;
        },
        set: function (r) {
          this._sessionId !== r &&
            ((this._sessionId = r), this.updateStorage());
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "optOut", {
        get: function () {
          return this._optOut;
        },
        set: function (r) {
          this._optOut !== r && ((this._optOut = r), this.updateStorage());
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "lastEventTime", {
        get: function () {
          return this._lastEventTime;
        },
        set: function (r) {
          this._lastEventTime !== r &&
            ((this._lastEventTime = r), this.updateStorage());
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "lastEventId", {
        get: function () {
          return this._lastEventId;
        },
        set: function (r) {
          this._lastEventId !== r &&
            ((this._lastEventId = r), this.updateStorage());
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "pageCounter", {
        get: function () {
          return this._pageCounter;
        },
        set: function (r) {
          this._pageCounter !== r &&
            ((this._pageCounter = r), this.updateStorage());
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, "debugLogsEnabled", {
        set: function (r) {
          this._debugLogsEnabled !== r &&
            ((this._debugLogsEnabled = r), this.updateStorage());
        },
        enumerable: !1,
        configurable: !0,
      }),
      (e.prototype.updateStorage = function () {
        var r = {
          deviceId: this._deviceId,
          userId: this._userId,
          sessionId: this._sessionId,
          optOut: this._optOut,
          lastEventTime: this._lastEventTime,
          lastEventId: this._lastEventId,
          pageCounter: this._pageCounter,
          debugLogsEnabled: this._debugLogsEnabled,
        };
        this.cookieStorage.set(Ji(this.apiKey), r);
      }),
      e
    );
  })(zi),
  Nu = function (t, e, r) {
    return (
      e === void 0 && (e = {}),
      S(void 0, void 0, void 0, function () {
        var n,
          i,
          o,
          a,
          s,
          u,
          c,
          l,
          f,
          d,
          v,
          h,
          m,
          y,
          p,
          g,
          b,
          T,
          w,
          I,
          _,
          P,
          k,
          A,
          R,
          O,
          G,
          F,
          N,
          U,
          q,
          j,
          $,
          ne,
          Y,
          re,
          X,
          H,
          K,
          D,
          ue,
          Oe,
          Ye,
          Ue,
          Fe;
        return E(this, function (ge) {
          switch (ge.label) {
            case 0:
              return (
                (n = e.identityStorage || Wt),
                (_ = {}),
                n === Wt ? [3, 1] : ((o = ""), [3, 5])
              );
            case 1:
              return (k =
                (P = e.cookieOptions) === null || P === void 0
                  ? void 0
                  : P.domain) !== null && k !== void 0
                ? ((a = k), [3, 4])
                : [3, 2];
            case 2:
              return [4, xu()];
            case 3:
              ((a = ge.sent()), (ge.label = 4));
            case 4:
              ((o = a), (ge.label = 5));
            case 5:
              return (
                (i = C.apply(void 0, [
                  ((_.domain = o),
                  (_.expiration = 365),
                  (_.sameSite = "Lax"),
                  (_.secure = !1),
                  (_.upgrade = !0),
                  _),
                  e.cookieOptions,
                ])),
                (s = Mu(e.identityStorage, i)),
                [
                  4,
                  wu(
                    t,
                    s,
                    (R =
                      (A = e.cookieOptions) === null || A === void 0
                        ? void 0
                        : A.upgrade) !== null && R !== void 0
                      ? R
                      : !0,
                  ),
                ]
              );
            case 6:
              return ((u = ge.sent()), [4, s.get(Ji(t))]);
            case 7:
              return (
                (c = ge.sent()),
                (l = Vt()),
                (f = l.ampTimestamp ? Number(l.ampTimestamp) : void 0),
                (d = f ? Date.now() < f : !0),
                (v =
                  (U =
                    (N =
                      (F =
                        (O = e.deviceId) !== null && O !== void 0
                          ? O
                          : d
                            ? (G = l.ampDeviceId) !== null && G !== void 0
                              ? G
                              : l.deviceId
                            : void 0) !== null && F !== void 0
                        ? F
                        : c?.deviceId) !== null && N !== void 0
                      ? N
                      : u.deviceId) !== null && U !== void 0
                    ? U
                    : Re()),
                (h =
                  (q = c?.lastEventId) !== null && q !== void 0
                    ? q
                    : u.lastEventId),
                (m =
                  (j = c?.lastEventTime) !== null && j !== void 0
                    ? j
                    : u.lastEventTime),
                (y =
                  (ne =
                    ($ = e.optOut) !== null && $ !== void 0 ? $ : c?.optOut) !==
                    null && ne !== void 0
                    ? ne
                    : u.optOut),
                (p =
                  (Y = c?.sessionId) !== null && Y !== void 0
                    ? Y
                    : u.sessionId),
                (g =
                  (X =
                    (re = e.userId) !== null && re !== void 0
                      ? re
                      : c?.userId) !== null && X !== void 0
                    ? X
                    : u.userId),
                (r.previousSessionDeviceId =
                  (H = c?.deviceId) !== null && H !== void 0 ? H : u.deviceId),
                (r.previousSessionUserId =
                  (K = c?.userId) !== null && K !== void 0 ? K : u.userId),
                (b = {
                  ipAddress:
                    (ue =
                      (D = e.trackingOptions) === null || D === void 0
                        ? void 0
                        : D.ipAddress) !== null && ue !== void 0
                      ? ue
                      : !0,
                  language:
                    (Ye =
                      (Oe = e.trackingOptions) === null || Oe === void 0
                        ? void 0
                        : Oe.language) !== null && Ye !== void 0
                      ? Ye
                      : !0,
                  platform:
                    (Fe =
                      (Ue = e.trackingOptions) === null || Ue === void 0
                        ? void 0
                        : Ue.platform) !== null && Fe !== void 0
                      ? Fe
                      : !0,
                }),
                (T = c?.pageCounter),
                (w = c?.debugLogsEnabled),
                e.autocapture !== void 0 && (e.defaultTracking = e.autocapture),
                (I = new Du(
                  t,
                  e.appVersion,
                  s,
                  i,
                  e.defaultTracking,
                  e.autocapture,
                  v,
                  e.flushIntervalMillis,
                  e.flushMaxRetries,
                  e.flushQueueSize,
                  n,
                  e.ingestionMetadata,
                  e.instanceName,
                  h,
                  m,
                  e.loggerProvider,
                  e.logLevel,
                  e.minIdLength,
                  e.offline,
                  y,
                  e.partnerId,
                  e.plan,
                  e.serverUrl,
                  e.serverZone,
                  p,
                  e.sessionTimeout,
                  e.storageProvider,
                  b,
                  e.transport,
                  e.useBatch,
                  e.fetchRemoteConfig,
                  g,
                  T,
                  w,
                  e.networkTrackingOptions,
                  e.identify,
                  e.enableDiagnostics,
                  r._diagnosticsSampleRate,
                  void 0,
                  e.remoteConfig,
                )),
                [4, I.storageProvider.isEnabled()]
              );
            case 8:
              return (
                ge.sent() ||
                  (I.loggerProvider.warn(
                    "Storage provider ".concat(
                      I.storageProvider.constructor.name,
                      " is not enabled. Falling back to MemoryStorage.",
                    ),
                  ),
                  (I.storageProvider = new Yr())),
                [2, I]
              );
          }
        });
      })
    );
  },
  Mu = function (t, e) {
    switch ((t === void 0 && (t = Wt), e === void 0 && (e = {}), t)) {
      case "localStorage":
        return new po();
      case "sessionStorage":
        return new Eu();
      case "none":
        return new Yr();
      default:
        return new Ar(C(C({}, e), { expirationDays: e.expiration }));
    }
  },
  mo = function (t) {
    var e = typeof t == "object" ? t.type : t,
      r = typeof t == "object" ? t.headers : void 0;
    return e === "xhr" ? new Su(r) : e === "beacon" ? new Tu() : new Qi(r);
  },
  xu = function (t) {
    return S(void 0, void 0, void 0, function () {
      var e, r, n, i, o, o, a, s, u, c;
      return E(this, function (l) {
        switch (l.label) {
          case 0:
            return [4, new Ar().isEnabled()];
          case 1:
            if (!l.sent() || typeof location > "u" || !location.hostname)
              return [2, ""];
            for (
              e = location.hostname,
                r = e.split("."),
                n = [],
                i = "AMP_TLDTEST",
                o = r.length - 2;
              o >= 0;
              --o
            )
              n.push(r.slice(o).join("."));
            ((o = 0), (l.label = 2));
          case 2:
            return o < n.length
              ? ((a = n[o]),
                (s = { domain: "." + a }),
                (u = new Ar(s)),
                [4, u.set(i, 1)])
              : [3, 7];
          case 3:
            return (l.sent(), [4, u.get(i)]);
          case 4:
            return ((c = l.sent()), c ? [4, u.remove(i)] : [3, 6]);
          case 5:
            return (l.sent(), [2, "." + a]);
          case 6:
            return (o++, [3, 2]);
          case 7:
            return [2, ""];
        }
      });
    });
  },
  Uu = function (t) {
    var e = {};
    for (var r in t) {
      var n = t[r];
      n && (e[r] = n);
    }
    return e;
  },
  Fu = "[Amplitude] Page Viewed",
  qu = function (t) {
    t === void 0 && (t = {});
    var e,
      r = B(),
      n = void 0,
      i = !1,
      o,
      a = t.trackOn,
      s = t.trackHistoryChanges,
      u = t.eventType,
      c = u === void 0 ? Fu : u,
      l = function (p) {
        var g = p;
        try {
          g = decodeURI(p);
        } catch (b) {
          n?.error("Malformed URI sequence: ", b);
        }
        return g;
      },
      f = function () {
        return S(void 0, void 0, void 0, function () {
          var p, g, b;
          return E(this, function (T) {
            switch (T.label) {
              case 0:
                return (
                  (p = l((typeof location < "u" && location.href) || "")),
                  (b = { event_type: c }),
                  (g = [{}]),
                  [4, Bu()]
                );
              case 1:
                return [
                  2,
                  ((b.event_properties = C.apply(void 0, [
                    C.apply(void 0, g.concat([T.sent()])),
                    {
                      "[Amplitude] Page Domain":
                        (typeof location < "u" && location.hostname) || "",
                      "[Amplitude] Page Location": p,
                      "[Amplitude] Page Path":
                        (typeof location < "u" && l(location.pathname)) || "",
                      "[Amplitude] Page Title": en(Zr),
                      "[Amplitude] Page URL": p.split("?")[0],
                    },
                  ])),
                  b),
                ];
            }
          });
        });
      },
      d = function () {
        return typeof a > "u" || (typeof a == "function" && a());
      },
      v = typeof location < "u" ? location.href : null,
      h = function () {
        return S(void 0, void 0, void 0, function () {
          var p, g, b, T;
          return E(this, function (w) {
            switch (w.label) {
              case 0:
                return (
                  (p = location.href),
                  (g = ju(s, p, v || "") && d()),
                  (v = p),
                  g
                    ? (n?.log("Tracking page view event"),
                      e != null ? [3, 1] : [3, 3])
                    : [3, 4]
                );
              case 1:
                return ((T = (b = e).track), [4, f()]);
              case 2:
                (T.apply(b, [w.sent()]), (w.label = 3));
              case 3:
                w.label = 4;
              case 4:
                return [2];
            }
          });
        });
      },
      m = function () {
        h();
      },
      y = {
        name: "@amplitude/plugin-page-view-tracking-browser",
        type: "enrichment",
        setup: function (p, g) {
          return S(void 0, void 0, void 0, function () {
            var b, T;
            return E(this, function (w) {
              switch (w.label) {
                case 0:
                  return (
                    (e = g),
                    (o = p),
                    (n = p.loggerProvider),
                    n.log(
                      "Installing @amplitude/plugin-page-view-tracking-browser",
                    ),
                    (i = !0),
                    r &&
                      (r.addEventListener("popstate", m),
                      (r.history.pushState = new Proxy(r.history.pushState, {
                        apply: function (I, _, P) {
                          var k = L(P, 3),
                            A = k[0],
                            R = k[1],
                            O = k[2];
                          (I.apply(_, [A, R, O]), i && h());
                        },
                      }))),
                    d()
                      ? (n.log("Tracking page view event"),
                        (T = (b = e).track),
                        [4, f()])
                      : [3, 2]
                  );
                case 1:
                  (T.apply(b, [w.sent()]), (w.label = 2));
                case 2:
                  return [2];
              }
            });
          });
        },
        execute: function (p) {
          return S(void 0, void 0, void 0, function () {
            var g;
            return E(this, function (b) {
              switch (b.label) {
                case 0:
                  return a === "attribution" && Vu(p)
                    ? (n?.log(
                        "Enriching campaign event to page view event with campaign parameters",
                      ),
                      [4, f()])
                    : [3, 2];
                case 1:
                  ((g = b.sent()),
                    (p.event_type = g.event_type),
                    (p.event_properties = C(
                      C({}, p.event_properties),
                      g.event_properties,
                    )),
                    (b.label = 2));
                case 2:
                  return (
                    o &&
                      p.event_type === c &&
                      ((o.pageCounter = o.pageCounter ? o.pageCounter + 1 : 1),
                      (p.event_properties = C(C({}, p.event_properties), {
                        "[Amplitude] Page Counter": o.pageCounter,
                      }))),
                    [2, p]
                  );
              }
            });
          });
        },
        teardown: function () {
          return S(void 0, void 0, void 0, function () {
            return E(this, function (p) {
              return (
                r && (r.removeEventListener("popstate", m), (i = !1)),
                [2]
              );
            });
          });
        },
      };
    return y;
  },
  Bu = function () {
    return S(void 0, void 0, void 0, function () {
      var t;
      return E(this, function (e) {
        switch (e.label) {
          case 0:
            return ((t = Uu), [4, new oo().parse()]);
          case 1:
            return [2, t.apply(void 0, [e.sent()])];
        }
      });
    });
  },
  Vu = function (t) {
    if (t.event_type === "$identify" && t.user_properties) {
      var e = t.user_properties,
        r = e[Ce.SET] || {},
        n = e[Ce.UNSET] || {},
        i = V(V([], L(Object.keys(r)), !1), L(Object.keys(n)), !1);
      return Object.keys(Jt).every(function (o) {
        return i.includes(o);
      });
    }
    return !1;
  },
  ju = function (t, e, r) {
    switch (t) {
      case "pathOnly": {
        if (r == "") return !0;
        var n = new URL(e),
          i = new URL(r),
          o = n.origin + n.pathname,
          a = i.origin + i.pathname;
        return o !== a;
      }
      default:
        return e !== r;
    }
  },
  Gu = function () {
    var t,
      e = [],
      r = function (c, l, f) {
        (c.addEventListener(l, f), e.push({ element: c, type: l, handler: f }));
      },
      n = function () {
        (e.forEach(function (c) {
          var l = c.element,
            f = c.type,
            d = c.handler;
          l?.removeEventListener(f, d);
        }),
          (e = []));
      },
      i = "@amplitude/plugin-form-interaction-tracking-browser",
      o = "enrichment",
      a = function (c, l) {
        return S(void 0, void 0, void 0, function () {
          var f, d;
          return E(this, function (v) {
            return (
              (f = function () {
                if (!l) {
                  c.loggerProvider.warn(
                    "Form interaction tracking requires a later version of @amplitude/analytics-browser. Form interaction events are not tracked.",
                  );
                  return;
                }
                if (!(typeof document > "u")) {
                  var h = function (y) {
                      var p = !1;
                      (r(y, "change", function () {
                        var g,
                          b = $n(y);
                        (p ||
                          l.track(
                            Wn,
                            ((g = {}),
                            (g[dr] = qe(y.id)),
                            (g[fr] = qe(y.name)),
                            (g[vr] = b),
                            g),
                          ),
                          (p = !0));
                      }),
                        r(y, "submit", function () {
                          var g,
                            b,
                            T = $n(y);
                          (p ||
                            l.track(
                              Wn,
                              ((g = {}),
                              (g[dr] = qe(y.id)),
                              (g[fr] = qe(y.name)),
                              (g[vr] = T),
                              g),
                            ),
                            l.track(
                              _u,
                              ((b = {}),
                              (b[dr] = qe(y.id)),
                              (b[fr] = qe(y.name)),
                              (b[vr] = T),
                              b),
                            ),
                            (p = !1));
                        }));
                    },
                    m = Array.from(document.getElementsByTagName("form"));
                  (m.forEach(h),
                    typeof MutationObserver < "u" &&
                      ((t = new MutationObserver(function (y) {
                        y.forEach(function (p) {
                          p.addedNodes.forEach(function (g) {
                            (g.nodeName === "FORM" && h(g),
                              "querySelectorAll" in g &&
                                typeof g.querySelectorAll == "function" &&
                                Array.from(g.querySelectorAll("form")).map(h));
                          });
                        });
                      })),
                      t.observe(document.body, {
                        subtree: !0,
                        childList: !0,
                      })));
                }
              }),
              document.readyState === "complete"
                ? f()
                : ((d = B()),
                  d
                    ? d.addEventListener("load", f)
                    : c.loggerProvider.debug(
                        "Form interaction tracking is not installed because global is undefined.",
                      )),
              [2]
            );
          });
        });
      },
      s = function (c) {
        return S(void 0, void 0, void 0, function () {
          return E(this, function (l) {
            return [2, c];
          });
        });
      },
      u = function () {
        return S(void 0, void 0, void 0, function () {
          return E(this, function (c) {
            return (t?.disconnect(), n(), [2]);
          });
        });
      };
    return { name: i, type: o, setup: a, execute: s, teardown: u };
  },
  qe = function (t) {
    if (typeof t == "string") return t;
  },
  $n = function (t) {
    var e = t.getAttribute("action");
    try {
      e = new URL(encodeURI(e ?? ""), window.location.href).href;
    } catch {}
    return e;
  },
  Hu = function () {
    var t,
      e = [],
      r = function (c, l, f) {
        (c.addEventListener(l, f), e.push({ element: c, type: l, handler: f }));
      },
      n = function () {
        (e.forEach(function (c) {
          var l = c.element,
            f = c.type,
            d = c.handler;
          l?.removeEventListener(f, d);
        }),
          (e = []));
      },
      i = "@amplitude/plugin-file-download-tracking-browser",
      o = "enrichment",
      a = function (c, l) {
        return S(void 0, void 0, void 0, function () {
          var f, d;
          return E(this, function (v) {
            return (
              (f = function () {
                if (!l) {
                  c.loggerProvider.warn(
                    "File download tracking requires a later version of @amplitude/analytics-browser. File download events are not tracked.",
                  );
                  return;
                }
                if (!(typeof document > "u")) {
                  var h = function (p) {
                      var g;
                      try {
                        g = new URL(p.href, window.location.href);
                      } catch {
                        return;
                      }
                      var b = m.exec(g.href),
                        T = b?.[1];
                      T &&
                        r(p, "click", function () {
                          var w;
                          T &&
                            l.track(
                              Pu,
                              ((w = {}),
                              (w[Cu] = T),
                              (w[Au] = g.pathname),
                              (w[ku] = p.id),
                              (w[Ru] = p.text),
                              (w[Ou] = p.href),
                              w),
                            );
                        });
                    },
                    m =
                      /\.(pdf|xlsx?|docx?|txt|rtf|csv|exe|key|pp(s|t|tx)|7z|pkg|rar|gz|zip|avi|mov|mp4|mpe?g|wmv|midi?|mp3|wav|wma)(\?.+)?$/,
                    y = Array.from(document.getElementsByTagName("a"));
                  (y.forEach(h),
                    typeof MutationObserver < "u" &&
                      ((t = new MutationObserver(function (p) {
                        p.forEach(function (g) {
                          g.addedNodes.forEach(function (b) {
                            (b.nodeName === "A" && h(b),
                              "querySelectorAll" in b &&
                                typeof b.querySelectorAll == "function" &&
                                Array.from(b.querySelectorAll("a")).map(h));
                          });
                        });
                      })),
                      t.observe(document.body, {
                        subtree: !0,
                        childList: !0,
                      })));
                }
              }),
              document.readyState === "complete"
                ? f()
                : ((d = B()),
                  d
                    ? d.addEventListener("load", f)
                    : c.loggerProvider.debug(
                        "File download tracking is not installed because global is undefined.",
                      )),
              [2]
            );
          });
        });
      },
      s = function (c) {
        return S(void 0, void 0, void 0, function () {
          return E(this, function (l) {
            return [2, c];
          });
        });
      },
      u = function () {
        return S(void 0, void 0, void 0, function () {
          return E(this, function (c) {
            return (t?.disconnect(), n(), [2]);
          });
        });
      };
    return { name: i, type: o, setup: a, execute: s, teardown: u };
  },
  Xn = !1,
  Wu = function (t) {
    if (!(Xn || t.defaultTracking !== void 0)) {
      var e = `\`options.defaultTracking\` is set to undefined. This implicitly configures your Amplitude instance to track Page Views, Sessions, File Downloads, and Form Interactions. You can suppress this warning by explicitly setting a value to \`options.defaultTracking\`. The value must either be a boolean, to enable and disable all default events, or an object, for advanced configuration. For example:

amplitude.init(<YOUR_API_KEY>, {
  defaultTracking: true,
});

Visit https://www.docs.developers.amplitude.com/data/sdks/browser-2/#tracking-default-events for more details.`;
      (t.loggerProvider.warn(e), (Xn = !0));
    }
  },
  Ku = function () {
    var t = "@amplitude/plugin-network-checker-browser",
      e = "before",
      r = B(),
      n = [],
      i = function (u, c) {
        r?.addEventListener &&
          (r?.addEventListener(u, c), n.push({ type: u, handler: c }));
      },
      o = function () {
        (n.forEach(function (u) {
          var c = u.type,
            l = u.handler;
          r?.removeEventListener(c, l);
        }),
          (n = []));
      },
      a = function (u, c) {
        return S(void 0, void 0, void 0, function () {
          return E(this, function (l) {
            return typeof navigator > "u"
              ? (u.loggerProvider.debug(
                  "Network connectivity checker plugin is disabled because navigator is not available.",
                ),
                (u.offline = !1),
                [2])
              : ((u.offline = !navigator.onLine),
                i("online", function () {
                  (u.loggerProvider.debug(
                    "Network connectivity changed to online.",
                  ),
                    (u.offline = !1),
                    setTimeout(function () {
                      c.flush();
                    }, u.flushIntervalMillis));
                }),
                i("offline", function () {
                  (u.loggerProvider.debug(
                    "Network connectivity changed to offline.",
                  ),
                    (u.offline = !0));
                }),
                [2]);
          });
        });
      },
      s = function () {
        return S(void 0, void 0, void 0, function () {
          return E(this, function (u) {
            return (o(), [2]);
          });
        });
      };
    return { name: t, type: e, setup: a, teardown: s };
  };
function yo(t) {
  var e, r, n, i, o, a, s, u, c, l, f;
  if (!(typeof t != "object" || t === null) && !Array.isArray(t)) {
    var d = Object.keys(t);
    try {
      for (var v = x(d), h = v.next(); !h.done; h = v.next()) {
        var m = h.value;
        try {
          var y = t[m];
          (typeof y?.enabled == "boolean" &&
            (y.enabled
              ? (delete y.enabled, Object.keys(y).length === 0 && (t[m] = !0))
              : (t[m] = !1)),
            yo(y));
        } catch {}
      }
    } catch (R) {
      e = { error: R };
    } finally {
      try {
        h && !h.done && (r = v.return) && r.call(v);
      } finally {
        if (e) throw e.error;
      }
    }
    try {
      if (
        !(
          (c =
            (u =
              (s = t.autocapture) === null || s === void 0
                ? void 0
                : s.networkTracking) === null || u === void 0
              ? void 0
              : u.captureRules) === null || c === void 0
        ) &&
        c.length
      )
        try {
          for (
            var p = x(t.autocapture.networkTracking.captureRules), g = p.next();
            !g.done;
            g = p.next()
          ) {
            var b = g.value;
            try {
              for (
                var T =
                    ((o = void 0), x(["responseHeaders", "requestHeaders"])),
                  w = T.next();
                !w.done;
                w = T.next()
              ) {
                var I = w.value,
                  _ = (l = b[I]) !== null && l !== void 0 ? l : {},
                  P = _.captureSafeHeaders,
                  k = _.allowlist;
                if (!(!P && !k)) {
                  if (k !== void 0 && !Array.isArray(k)) {
                    delete b[I];
                    continue;
                  }
                  b[I] = V(V([], L(P ? Bt : []), !1), L(k ?? []), !1);
                }
              }
            } catch (R) {
              o = { error: R };
            } finally {
              try {
                w && !w.done && (a = T.return) && a.call(T);
              } finally {
                if (o) throw o.error;
              }
            }
          }
        } catch (R) {
          n = { error: R };
        } finally {
          try {
            g && !g.done && (i = p.return) && i.call(p);
          } finally {
            if (n) throw n.error;
          }
        }
    } catch {}
    var A =
      (f = t.autocapture) === null || f === void 0
        ? void 0
        : f.frustrationInteractions;
    A &&
      (A.rageClick && ((A.rageClicks = A.rageClick), delete A.rageClick),
      A.deadClick && ((A.deadClicks = A.deadClick), delete A.deadClick));
  }
}
function Yn(t, e, r) {
  var n,
    i,
    o = [];
  try {
    for (var a = x(e ?? []), s = a.next(); !s.done; s = a.next()) {
      var u = s.value;
      try {
        o.push(new RegExp(u));
      } catch (c) {
        r.loggerProvider.warn("Invalid regex pattern: ".concat(u), c);
      }
    }
  } catch (c) {
    n = { error: c };
  } finally {
    try {
      s && !s.done && (i = a.return) && i.call(a);
    } finally {
      if (n) throw n.error;
    }
  }
  return t.concat(o);
}
function zu(t, e) {
  var r, n, i, o, a, s, u;
  if (t) {
    yo(t);
    try {
      e.loggerProvider.debug(
        "Update browser config with remote configuration:",
        JSON.stringify(t),
      );
      var c = t;
      if (c && "autocapture" in c) {
        if (
          (typeof c.autocapture == "boolean" && (e.autocapture = c.autocapture),
          typeof c.autocapture == "object" && c.autocapture !== null)
        ) {
          var l = C({}, c.autocapture);
          if (
            (e.autocapture === void 0 && (e.autocapture = c.autocapture),
            typeof c.autocapture.elementInteractions == "object" &&
              c.autocapture.elementInteractions !== null &&
              !(
                (i =
                  c.autocapture.elementInteractions.pageUrlAllowlistRegex) ===
                  null || i === void 0
              ) &&
              i.length)
          ) {
            l.elementInteractions = C({}, c.autocapture.elementInteractions);
            var f = l.elementInteractions,
              d = (o = f.pageUrlAllowlist) !== null && o !== void 0 ? o : [],
              v = c.autocapture.elementInteractions.pageUrlAllowlistRegex;
            ((f.pageUrlAllowlist = Yn(d, v, e)),
              delete f.pageUrlAllowlistRegex);
          }
          if (
            typeof c.autocapture.networkTracking == "object" &&
            c.autocapture.networkTracking !== null &&
            !(
              (a = c.autocapture.networkTracking.captureRules) === null ||
              a === void 0
            ) &&
            a.length
          ) {
            l.networkTracking = C({}, c.autocapture.networkTracking);
            var h = l.networkTracking,
              m = (s = h.captureRules) !== null && s !== void 0 ? s : [];
            try {
              for (var y = x(m), p = y.next(); !p.done; p = y.next()) {
                var g = p.value;
                ((g.urls = Yn(
                  (u = g.urls) !== null && u !== void 0 ? u : [],
                  g.urlsRegex,
                  e,
                )),
                  delete g.urlsRegex);
              }
            } catch (b) {
              r = { error: b };
            } finally {
              try {
                p && !p.done && (n = y.return) && n.call(y);
              } finally {
                if (r) throw r.error;
              }
            }
          }
          (typeof e.autocapture == "boolean" &&
            (e.autocapture = C(
              {
                attribution: e.autocapture,
                fileDownloads: e.autocapture,
                formInteractions: e.autocapture,
                pageViews: e.autocapture,
                sessions: e.autocapture,
                elementInteractions: e.autocapture,
                webVitals: e.autocapture,
                frustrationInteractions: e.autocapture,
              },
              l,
            )),
            typeof e.autocapture == "object" &&
              (e.autocapture = C(C({}, e.autocapture), l)));
        }
        e.defaultTracking = e.autocapture;
      }
      e.loggerProvider.debug(
        "Browser config after remote config update:",
        JSON.stringify(e),
      );
    } catch (b) {
      e.loggerProvider.error(
        "Failed to apply remote configuration because of error: ",
        b,
      );
    }
  }
}
var bo = "1.18.3",
  $u = "@amplitude/plugin-autocapture-browser",
  Xu = "@amplitude/plugin-frustration-browser",
  Eo = "[Amplitude] Element Clicked",
  Yu = "[Amplitude] Dead Click",
  Ju = "[Amplitude] Rage Click",
  Qu = "[Amplitude] Element Changed",
  Zu = "[Amplitude] Element ID",
  ec = "[Amplitude] Element Class",
  Jn = "[Amplitude] Element Tag",
  Qn = "[Amplitude] Element Text",
  tc = "[Amplitude] Element Hierarchy",
  rc = "[Amplitude] Element Href",
  nc = "[Amplitude] Element Position Left",
  ic = "[Amplitude] Element Position Top",
  oc = "[Amplitude] Element Aria Label",
  ac = "[Amplitude] Element Attributes",
  sc = "[Amplitude] Element Parent Label",
  Zn = "[Amplitude] Page URL",
  uc = "[Amplitude] Page Title",
  cc = "[Amplitude] Viewport Height",
  lc = "[Amplitude] Viewport Width",
  Nt = "https://app.amplitude.com",
  dc = "https://app.eu.amplitude.com",
  fc = "https://apps.stag2.amplitude.com",
  vc = { US: Nt, EU: dc, STAGING: fc },
  hc =
    "https://cdn.amplitude.com/libs/visual-tagging-selector-1.0.0-alpha.js.gz",
  gc = "amp-visual-tagging-selector-highlight",
  So = "data-amp-mask-attributes",
  pc = 25,
  To = 128,
  mc = ["input", "select", "textarea"],
  wo = function (t, e) {
    var r,
      n =
        (r = window?.getComputedStyle) === null || r === void 0
          ? void 0
          : r.call(window, t);
    return n?.getPropertyValue("cursor") === "pointer" && e === "click";
  },
  ct = function (t, e, r) {
    return (
      r === void 0 && (r = !1),
      function (n, i) {
        var o,
          a,
          s = t.pageUrlAllowlist,
          u = t.pageUrlExcludelist,
          c = t.shouldTrackEventResolver,
          l =
            (a =
              (o = i?.tagName) === null || o === void 0
                ? void 0
                : o.toLowerCase) === null || a === void 0
              ? void 0
              : a.call(o);
        if (!l) return !1;
        if (c) return c(n, i);
        if (
          !Cr(window.location.href, s) ||
          (u && u.length > 0 && Cr(window.location.href, u))
        )
          return !1;
        var f = String(i?.getAttribute("type")) || "";
        if (typeof f == "string")
          switch (f.toLowerCase()) {
            case "hidden":
              return !1;
            case "password":
              return !1;
          }
        var d = wo(i, n);
        if (r && d) return !0;
        if (e) {
          var v = e.some(function (h) {
            var m;
            return !!(
              !((m = i?.matches) === null || m === void 0) && m.call(i, h)
            );
          });
          if (!v) return !1;
        }
        switch (l) {
          case "input":
          case "select":
          case "textarea":
            return n === "change" || n === "click";
          default:
            return d ? !0 : n === "click";
        }
      }
    );
  },
  yc = function (t) {
    var e,
      r,
      n,
      i =
        (r =
          (e = t?.tagName) === null || e === void 0
            ? void 0
            : e.toLowerCase) === null || r === void 0
          ? void 0
          : r.call(e),
      o =
        t instanceof HTMLElement
          ? ((n = t.getAttribute("contenteditable")) === null || n === void 0
              ? void 0
              : n.toLowerCase()) === "true"
          : !1;
    return !mc.includes(i) && !o;
  },
  bc = function (t) {
    return t
      ? t
          .split(",")
          .map(function (e) {
            return e.trim();
          })
          .filter(function (e) {
            return e.length > 0 && e !== "id" && e !== "class";
          })
      : [];
  },
  Ec = function (t, e) {
    return Object.entries(t).reduce(function (r, n) {
      var i = L(n, 2),
        o = i[0],
        a = i[1];
      if (o.startsWith(e)) {
        var s = o.replace(e, "");
        s && (r[s] = a || "");
      }
      return r;
    }, {});
  },
  Sc = function (t) {
    return (
      t == null ||
      (typeof t == "object" && Object.keys(t).length === 0) ||
      (typeof t == "string" && t.trim().length === 0)
    );
  },
  ei = function (t) {
    return Object.keys(t).reduce(function (e, r) {
      var n = t[r];
      return (Sc(n) || (e[r] = n), e);
    }, {});
  },
  un = function (t, e) {
    return t
      ? e.some(function (r) {
          var n;
          return (n = t?.matches) === null || n === void 0
            ? void 0
            : n.call(t, r);
        })
        ? t
        : un(t?.parentElement, e)
      : null;
  },
  Tc = function (t) {
    return new Promise(function (e, r) {
      var n;
      try {
        var i = document.createElement("script");
        ((i.type = "text/javascript"),
          (i.async = !0),
          (i.src = t),
          i.addEventListener(
            "load",
            function () {
              e({ status: !0 });
            },
            { once: !0 },
          ),
          i.addEventListener("error", function () {
            r({ status: !1, message: "Failed to load the script ".concat(t) });
          }),
          (n = document.head) === null || n === void 0 || n.appendChild(i));
      } catch (o) {
        r(o);
      }
    });
  };
function wc() {
  return ""
    .concat(Date.now(), "-")
    .concat(Math.random().toString(36).substr(2, 9));
}
var er = function (t) {
  return !(t.event.target === null || !t.closestTrackedAncestor);
};
function Ic(t) {
  return t.type === "click" || t.type === "change";
}
var _c = new Set([
    "id",
    "class",
    "style",
    "value",
    "onclick",
    "onchange",
    "oninput",
    "onblur",
    "onsubmit",
    "onfocus",
    "onkeydown",
    "onkeyup",
    "onkeypress",
    "data-reactid",
    "data-react-checksum",
    "data-reactroot",
    So,
    ut,
  ]),
  Pc = ["type"],
  Cc = ["svg", "path", "g"],
  Ac = ["password", "hidden"];
function kc(t, e) {
  var r, n, i, o, a, s;
  if (t === null) return null;
  var u = String(t.tagName).toLowerCase(),
    c = { tag: u },
    l = Array.from(
      (o =
        (i = t.parentElement) === null || i === void 0
          ? void 0
          : i.children) !== null && o !== void 0
        ? o
        : [],
    );
  l.length &&
    ((c.index = l.indexOf(t)),
    (c.indexOfType = l
      .filter(function (w) {
        return w.tagName === t.tagName;
      })
      .indexOf(t)));
  var f =
    (s =
      (a = t.previousElementSibling) === null || a === void 0
        ? void 0
        : a.tagName) === null || s === void 0
      ? void 0
      : s.toLowerCase();
  f && (c.prevSib = String(f));
  var d = t.getAttribute("id");
  d && (c.id = String(d));
  var v = Array.from(t.classList);
  v.length && (c.classes = v);
  var h = {},
    m = Array.from(t.attributes),
    y = m.filter(function (w) {
      return !_c.has(w.name);
    }),
    p = !yc(t);
  if (!Ac.includes(String(t.getAttribute("type"))) && !Cc.includes(u))
    try {
      for (var g = x(y), b = g.next(); !b.done; b = g.next()) {
        var T = b.value;
        if (!(p && !Pc.includes(T.name))) {
          if (e.has(T.name)) {
            h[T.name] = ke;
            continue;
          }
          h[T.name] = String(T.value).substring(0, To);
        }
      }
    } catch (w) {
      r = { error: w };
    } finally {
      try {
        b && !b.done && (n = g.return) && n.call(g);
      } finally {
        if (r) throw r.error;
      }
    }
  return (Object.keys(h).length && (c.attrs = h), c);
}
function Rc(t) {
  var e = [];
  if (!t) return e;
  e.push(t);
  for (var r = t.parentElement; r && r.tagName !== "HTML"; )
    (e.push(r), (r = r.parentElement));
  return e;
}
var Oc = function (t, e) {
    try {
      if (t.sourceType === "DOM_ELEMENT") {
        var r = document.documentElement;
        return (
          t.scope && e && (r = e.closest(t.scope)),
          r && t.selector ? r.querySelector(t.selector) : r
        );
      }
    } catch {
      return;
    }
  },
  Lc = function (t, e, r) {
    t.forEach(function (n) {
      if (typeof n != "string" && n.actionType === "ATTACH_EVENT_PROPERTY") {
        var i = r.extractDataFromDataSource(
          n.dataSource,
          e.closestTrackedAncestor,
        );
        e.targetElementProperties[n.destinationKey] = i;
      }
    });
  },
  cn = (function () {
    function t(e, r) {
      var n,
        i,
        o = this,
        a;
      ((this.replaceSensitiveString = function (d) {
        return Zr(d, o.additionalMaskTextPatterns);
      }),
        (this.getHierarchy = function (d) {
          var v,
            h,
            m,
            y,
            p = performance.now(),
            g = [];
          if (!d) return [];
          for (var b = Rc(d), T = new Map(), w = b.length - 1; w >= 0; w--) {
            var I = b[w];
            if (I) {
              var _ = bc(I.getAttribute(So)),
                P =
                  w === b.length - 1
                    ? []
                    : (m = T.get(b[w + 1])) !== null && m !== void 0
                      ? m
                      : new Set(),
                k = new Set(V(V([], L(P), !1), L(_), !1));
              T.set(I, k);
            }
          }
          g = b.map(function (N) {
            var U;
            return kc(
              N,
              (U = T.get(N)) !== null && U !== void 0 ? U : new Set(),
            );
          });
          var A = function (N) {
            N?.attrs &&
              Object.entries(N.attrs).forEach(function (U) {
                var q = L(U, 2),
                  j = q[0],
                  $ = q[1];
                N.attrs && (N.attrs[j] = o.replaceSensitiveString($));
              });
          };
          try {
            for (var R = x(g), O = R.next(); !O.done; O = R.next()) {
              var G = O.value;
              A(G);
            }
          } catch (N) {
            v = { error: N };
          } finally {
            try {
              O && !O.done && (h = R.return) && h.call(R);
            } finally {
              if (v) throw v.error;
            }
          }
          var F = performance.now();
          return (
            (y = o.diagnosticsClient) === null ||
              y === void 0 ||
              y.recordHistogram("autocapturePlugin.getHierarchy", F - p),
            g
          );
        }),
        (this.getNearestLabel = function (d) {
          var v = d.parentElement;
          if (!v) return "";
          var h;
          try {
            h = v.querySelector(":scope>span,h1,h2,h3,h4,h5,h6");
          } catch {
            h = null;
          }
          return h ? o.getText(h) : o.getNearestLabel(v);
        }),
        (this.getEventProperties = function (d, v, h) {
          var m,
            y,
            p,
            g,
            b =
              (p =
                (y = v?.tagName) === null || y === void 0
                  ? void 0
                  : y.toLowerCase) === null || p === void 0
                ? void 0
                : p.call(y),
            T =
              typeof v.getBoundingClientRect == "function"
                ? v.getBoundingClientRect()
                : { left: null, top: null },
            w = o.getHierarchy(v),
            I = (g = w[0]) === null || g === void 0 ? void 0 : g.attrs,
            _ = o.getNearestLabel(v),
            P = Ec(I ?? {}, h),
            k =
              ((m = {}),
              (m[tc] = w),
              (m[Jn] = b),
              (m[Qn] = o.getText(v)),
              (m[nc] = T.left == null ? null : Math.round(T.left)),
              (m[ic] = T.top == null ? null : Math.round(T.top)),
              (m[ac] = P),
              (m[sc] = _),
              (m[Zn] = Ae(window.location.href.split("?")[0])),
              (m[uc] = en(o.replaceSensitiveString)),
              (m[cc] = window.innerHeight),
              (m[lc] = window.innerWidth),
              m);
          if (
            ((k[Zu] = v.getAttribute("id") || ""),
            (k[ec] = v.getAttribute("class")),
            (k[oc] = I?.["aria-label"]),
            b === "a" && d === "click" && v instanceof HTMLAnchorElement)
          ) {
            var A = v.href.substring(0, To);
            k[rc] = o.replaceSensitiveString(A);
          }
          return ei(k);
        }),
        (this.addAdditionalEventProperties = function (d, v, h, m, y) {
          y === void 0 && (y = !1);
          var p = { event: d, timestamp: Date.now(), type: v };
          if (Ic(p) && p.event.target !== null) {
            if (y) {
              var g = wo(p.event.target, p.type);
              if (g)
                return (
                  (p.closestTrackedAncestor = p.event.target),
                  (p.targetElementProperties = o.getEventProperties(
                    p.type,
                    p.closestTrackedAncestor,
                    m,
                  )),
                  p
                );
            }
            var b = un(p.event.target, h);
            return (
              b &&
                ((p.closestTrackedAncestor = b),
                (p.targetElementProperties = o.getEventProperties(
                  p.type,
                  b,
                  m,
                ))),
              p
            );
          }
          return p;
        }),
        (this.extractDataFromDataSource = function (d, v) {
          if (d.sourceType === "DOM_ELEMENT") {
            var h = Oc(d, v);
            return h
              ? d.elementExtractType === "TEXT"
                ? o.getText(h)
                : d.elementExtractType === "ATTRIBUTE" && d.attribute
                  ? h.getAttribute(d.attribute)
                  : void 0
              : void 0;
          }
        }),
        (this.getText = function (d) {
          var v = d.closest("[".concat(ut, "]")) !== null;
          if (v) return ke;
          var h = "";
          if (!d.querySelector("[".concat(ut, "], [contenteditable]")))
            h = d.innerText || "";
          else {
            var m = d.cloneNode(!0);
            (m
              .querySelectorAll("[".concat(ut, "], [contenteditable]"))
              .forEach(function (y) {
                y.innerText = ke;
              }),
              (h = m.innerText || ""));
          }
          return o
            .replaceSensitiveString(h.substring(0, 255))
            .replace(/\s+/g, " ")
            .trim();
        }),
        (this.getEventTagProps = function (d) {
          var v, h, m;
          if (!d) return {};
          var y =
              (m =
                (h = d?.tagName) === null || h === void 0
                  ? void 0
                  : h.toLowerCase) === null || m === void 0
                ? void 0
                : m.call(h),
            p =
              ((v = {}),
              (v[Jn] = y),
              (v[Qn] = o.getText(d)),
              (v[Zn] = window.location.href.split("?")[0]),
              v);
          return ei(p);
        }),
        (this.diagnosticsClient = r?.diagnosticsClient));
      var s = (a = e.maskTextRegex) !== null && a !== void 0 ? a : [],
        u = [];
      try {
        for (var c = x(s), l = c.next(); !l.done; l = c.next()) {
          var f = l.value;
          if (u.length >= pc) break;
          if (f instanceof RegExp) u.push(f);
          else if ("pattern" in f && typeof f.pattern == "string")
            try {
              u.push(new RegExp(f.pattern, "i"));
            } catch {}
        }
      } catch (d) {
        n = { error: d };
      } finally {
        try {
          l && !l.done && (i = c.return) && i.call(c);
        } finally {
          if (n) throw n.error;
        }
      }
      this.additionalMaskTextPatterns = u;
    }
    return t;
  })(),
  Dc = (function () {
    function t(e) {
      var r = e === void 0 ? {} : e,
        n = r.origin,
        i = n === void 0 ? Nt : n,
        o = this;
      ((this.endpoint = Nt),
        (this.requestCallbacks = {}),
        (this.onSelect = function (a) {
          o.notify({ action: "element-selected", data: a });
        }),
        (this.onTrack = function (a, s) {
          a === "selector-mode-changed"
            ? o.notify({ action: "track-selector-mode-changed", data: s })
            : a === "selector-moved" &&
              o.notify({ action: "track-selector-moved", data: s });
        }),
        (this.endpoint = i));
    }
    return (
      (t.prototype.notify = function (e) {
        var r, n, i, o;
        ((n = (r = this.logger) === null || r === void 0 ? void 0 : r.debug) ===
          null ||
          n === void 0 ||
          n.call(r, "Message sent: ", JSON.stringify(e)),
          (o =
            (i = window.opener) === null || i === void 0
              ? void 0
              : i.postMessage) === null ||
            o === void 0 ||
            o.call(i, e, this.endpoint));
      }),
      (t.prototype.sendRequest = function (e, r, n) {
        var i = this;
        n === void 0 && (n = { timeout: 15e3 });
        var o = wc(),
          a = { id: o, action: e, args: r },
          s = new Promise(function (u, c) {
            ((i.requestCallbacks[o] = { resolve: u, reject: c }),
              i.notify(a),
              n?.timeout > 0 &&
                setTimeout(function () {
                  (c(
                    new Error("".concat(e, " timed out (id: ").concat(o, ")")),
                  ),
                    delete i.requestCallbacks[o]);
                }, n.timeout));
          });
        return s;
      }),
      (t.prototype.handleResponse = function (e) {
        var r;
        if (!this.requestCallbacks[e.id]) {
          (r = this.logger) === null ||
            r === void 0 ||
            r.warn("No callback found for request id: ".concat(e.id));
          return;
        }
        (this.requestCallbacks[e.id].resolve(e.responseData),
          delete this.requestCallbacks[e.id]);
      }),
      (t.prototype.setup = function (e) {
        var r = this,
          n = e === void 0 ? { dataExtractor: new cn({}) } : e,
          i = n.logger,
          o = n.endpoint,
          a = n.isElementSelectable,
          s = n.cssSelectorAllowlist,
          u = n.actionClickAllowlist,
          c = n.dataExtractor;
        ((this.logger = i), o && this.endpoint === Nt && (this.endpoint = o));
        var l = null;
        (window.addEventListener("message", function (f) {
          var d, v, h, m, y;
          if (
            ((v =
              (d = r.logger) === null || d === void 0 ? void 0 : d.debug) ===
              null ||
              v === void 0 ||
              v.call(d, "Message received: ", JSON.stringify(f)),
            r.endpoint === f.origin)
          ) {
            var p = f?.data,
              g = p?.action;
            if (g)
              if ("id" in p)
                ((m =
                  (h = r.logger) === null || h === void 0
                    ? void 0
                    : h.debug) === null ||
                  m === void 0 ||
                  m.call(
                    h,
                    "Received Response to previous request: ",
                    JSON.stringify(f),
                  ),
                  r.handleResponse(p));
              else if (g === "ping") r.notify({ action: "pong" });
              else if (g === "initialize-visual-tagging-selector") {
                var b = p?.data;
                Tc(hc)
                  .then(function () {
                    var T;
                    ((l =
                      (T = window?.amplitudeVisualTaggingSelector) === null ||
                      T === void 0
                        ? void 0
                        : T.call(window, {
                            getEventTagProps: c.getEventTagProps,
                            isElementSelectable: function (w) {
                              return a ? a(b?.actionType || "click", w) : !0;
                            },
                            onTrack: r.onTrack,
                            onSelect: r.onSelect,
                            visualHighlightClass: gc,
                            messenger: r,
                            cssSelectorAllowlist: s,
                            actionClickAllowlist: u,
                            extractDataFromDataSource:
                              c.extractDataFromDataSource,
                            dataExtractor: c,
                            diagnostics: { autocapture: { version: bo } },
                          })),
                      r.notify({ action: "selector-loaded" }));
                  })
                  .catch(function () {
                    var T;
                    (T = r.logger) === null ||
                      T === void 0 ||
                      T.warn("Failed to initialize visual tagging selector");
                  });
              } else
                g === "close-visual-tagging-selector" &&
                  ((y = l?.close) === null || y === void 0 || y.call(l));
          }
        }),
          this.notify({ action: "page-loaded" }));
      }),
      t
    );
  })();
function Nc(t) {
  var e = t.amplitude,
    r = t.allObservables,
    n = t.shouldTrackEvent,
    i = t.evaluateTriggers,
    o = r.clickObservable,
    a = o
      .filter(er)
      .filter(function (u) {
        return n("click", u.closestTrackedAncestor);
      })
      .map(function (u) {
        return i(u);
      }),
    s = a;
  return s.subscribe(function (u) {
    e?.track(Eo, u.targetElementProperties);
  });
}
function Mc(t) {
  var e = t.amplitude,
    r = t.allObservables,
    n = t.getEventProperties,
    i = t.shouldTrackEvent,
    o = t.evaluateTriggers,
    a = r.changeObservable,
    s = a
      .filter(er)
      .filter(function (u) {
        return i("change", u.closestTrackedAncestor);
      })
      .map(function (u) {
        return o(u);
      });
  return s.subscribe(function (u) {
    e?.track(Qu, n("change", u.closestTrackedAncestor));
  });
}
function xc(t) {
  var e = t.amplitude,
    r = t.allObservables,
    n = t.options,
    i = t.getEventProperties,
    o = t.shouldTrackEvent,
    a = t.shouldTrackActionClick,
    s = r.clickObservable,
    u = r.mutationObservable,
    c = r.navigateObservable,
    l = s
      .filter(function (y) {
        return !o("click", y.closestTrackedAncestor);
      })
      .map(function (y) {
        var p = un(y.event.target, n.actionClickAllowlist);
        return (
          (y.closestTrackedAncestor = p),
          y.closestTrackedAncestor !== null &&
            (y.targetElementProperties = i(y.type, y.closestTrackedAncestor)),
          y
        );
      })
      .filter(er)
      .filter(function (y) {
        return a("click", y.closestTrackedAncestor);
      }),
    f = c ? Ht(u, c) : u,
    d = Ht(l, f),
    v = null,
    h = null,
    m = an(d, function (y) {
      if ((v && (clearTimeout(v), (v = null)), y.type === "click"))
        return (
          (h = y),
          (v = setTimeout(function () {
            ((v = null), (h = null));
          }, 500)),
          Promise.resolve(null)
        );
      if (h) {
        var p = h;
        return ((h = null), Promise.resolve(p));
      }
      return Promise.resolve(null);
    });
  return m.subscribe(function (y) {
    y && e?.track(Eo, i("click", y.closestTrackedAncestor));
  });
}
var Io = function () {
    return new de(function (t) {
      var e = new MutationObserver(function (r) {
        t.next(r);
      });
      return (
        document.body &&
          e.observe(document.body, {
            childList: !0,
            attributes: !0,
            characterData: !0,
            subtree: !0,
          }),
        function () {
          return e.disconnect();
        }
      );
    });
  },
  _o = function (t) {
    return (
      t === void 0 && (t = "click"),
      new de(function (e) {
        var r,
          n = function (i) {
            e.next(i);
          };
        return (
          (r = B()) === null ||
            r === void 0 ||
            r.document.addEventListener(t, n, { capture: !0 }),
          function () {
            var i;
            (i = B()) === null ||
              i === void 0 ||
              i.document.removeEventListener(t, n, { capture: !0 });
          }
        );
      })
    );
  },
  Uc = function (t, e) {
    try {
      if (e.subprop_key === "[Amplitude] Element Text")
        return (
          e.subprop_op === "is" &&
          e.subprop_value.includes(
            t.targetElementProperties["[Amplitude] Element Text"],
          )
        );
      if (e.subprop_key === "[Amplitude] Element Hierarchy")
        return (
          e.subprop_op === "autotrack css match" &&
          !!t.closestTrackedAncestor.closest(e.subprop_value.toString())
        );
    } catch (r) {
      return (console.error("Error matching event to filter", r), !1);
    }
    return !1;
  },
  Lr = {
    "[Amplitude] Element Clicked": "click",
    "[Amplitude] Element Changed": "change",
  },
  ti = function (t) {
    var e,
      r,
      n,
      i,
      o = Object.values(Lr).reduce(function (v, h) {
        return ((v[h] = new Set()), v);
      }, {});
    if (!t) return o;
    try {
      for (var a = x(t), s = a.next(); !s.done; s = a.next()) {
        var u = s.value;
        try {
          try {
            for (
              var c = ((n = void 0), x(u.definition)), l = c.next();
              !l.done;
              l = c.next()
            ) {
              var f = l.value,
                d = Lr[f.event_type];
              d && o[d].add(u.id);
            }
          } catch (v) {
            n = { error: v };
          } finally {
            try {
              l && !l.done && (i = c.return) && i.call(c);
            } finally {
              if (n) throw n.error;
            }
          }
        } catch (v) {
          console.warn(
            "Skipping Labeled Event due to malformed definition",
            u?.id,
            v,
          );
        }
      }
    } catch (v) {
      e = { error: v };
    } finally {
      try {
        s && !s.done && (r = a.return) && r.call(a);
      } finally {
        if (e) throw e.error;
      }
    }
    return o;
  },
  ri = function (t) {
    var e,
      r,
      n,
      i,
      o = new Map();
    try {
      for (var a = x(t), s = a.next(); !s.done; s = a.next()) {
        var u = s.value;
        try {
          for (
            var c = ((n = void 0), x(u.conditions)), l = c.next();
            !l.done;
            l = c.next()
          ) {
            var f = l.value;
            if (f.type === "LABELED_EVENT") {
              var d = f.match.eventId,
                v = o.get(d);
              (v || ((v = []), o.set(d, v)), v.push(u));
            }
          }
        } catch (h) {
          n = { error: h };
        } finally {
          try {
            l && !l.done && (i = c.return) && i.call(c);
          } finally {
            if (n) throw n.error;
          }
        }
      }
    } catch (h) {
      e = { error: h };
    } finally {
      try {
        s && !s.done && (r = a.return) && r.call(a);
      } finally {
        if (e) throw e.error;
      }
    }
    return o;
  },
  Fc = function (t, e) {
    return e.filter(function (r) {
      return r.definition.some(function (n) {
        return (
          Lr[n.event_type] === t.type &&
          n.filters.every(function (i) {
            return Uc(t, i);
          })
        );
      });
    });
  },
  qc = function (t, e) {
    var r,
      n,
      i,
      o,
      a = new Set();
    try {
      for (var s = x(t), u = s.next(); !u.done; u = s.next()) {
        var c = u.value,
          l = e.get(c.id);
        if (l)
          try {
            for (
              var f = ((i = void 0), x(l)), d = f.next();
              !d.done;
              d = f.next()
            ) {
              var v = d.value;
              a.add(v);
            }
          } catch (h) {
            i = { error: h };
          } finally {
            try {
              d && !d.done && (o = f.return) && o.call(f);
            } finally {
              if (i) throw i.error;
            }
          }
      }
    } catch (h) {
      r = { error: h };
    } finally {
      try {
        u && !u.done && (n = s.return) && n.call(s);
      } finally {
        if (r) throw r.error;
      }
    }
    return Array.from(a);
  },
  Bc = (function () {
    function t(e, r, n, i) {
      ((this.groupedLabeledEvents = e),
        (this.labeledEventToTriggerMap = r),
        (this.dataExtractor = n),
        (this.options = i));
    }
    return (
      (t.prototype.evaluate = function (e) {
        var r,
          n,
          i = this.options.pageActions;
        if (!i) return e;
        var o = Fc(
            e,
            Array.from(this.groupedLabeledEvents[e.type]).map(function (l) {
              return i.labeledEvents[l];
            }),
          ),
          a = qc(o, this.labeledEventToTriggerMap);
        try {
          for (var s = x(a), u = s.next(); !u.done; u = s.next()) {
            var c = u.value;
            Lc(c.actions, e, this.dataExtractor);
          }
        } catch (l) {
          r = { error: l };
        } finally {
          try {
            u && !u.done && (n = s.return) && n.call(s);
          } finally {
            if (r) throw r.error;
          }
        }
        return e;
      }),
      (t.prototype.update = function (e, r, n) {
        ((this.groupedLabeledEvents = e),
          (this.labeledEventToTriggerMap = r),
          (this.options = n));
      }),
      t
    );
  })(),
  Vc = function (t, e, r, n) {
    return new Bc(t, e, r, n);
  },
  Se;
(function (t) {
  ((t.ClickObservable = "clickObservable"),
    (t.ChangeObservable = "changeObservable"),
    (t.NavigateObservable = "navigateObservable"),
    (t.MutationObservable = "mutationObservable"));
})(Se || (Se = {}));
var jc = function (t, e) {
    var r, n, i, o, a, s, u, c;
    (t === void 0 && (t = {}),
      e?.diagnosticsClient.setTag("plugin.autocapture.version", bo));
    var l = t.dataAttributePrefix,
      f = l === void 0 ? eo : l,
      d = t.visualTaggingOptions,
      v = d === void 0 ? { enabled: !0, messenger: new Dc() } : d;
    ((t.cssSelectorAllowlist =
      (r = t.cssSelectorAllowlist) !== null && r !== void 0 ? r : Ns),
      (t.actionClickAllowlist =
        (n = t.actionClickAllowlist) !== null && n !== void 0 ? n : Ms),
      (t.debounceTime = (i = t.debounceTime) !== null && i !== void 0 ? i : 0),
      (t.pageUrlExcludelist =
        (o = t.pageUrlExcludelist) === null || o === void 0
          ? void 0
          : o.reduce(function (A, R) {
              if (
                (typeof R == "string" && A.push(R),
                R instanceof RegExp && A.push(R),
                typeof R == "object" && R !== null && "pattern" in R)
              )
                try {
                  A.push(new RegExp(R.pattern));
                } catch (O) {
                  return (
                    console.warn(
                      "Invalid regex pattern: ".concat(R.pattern),
                      O,
                    ),
                    A
                  );
                }
              return A;
            }, [])));
    var h = $u,
      m = "enrichment",
      y = [],
      p = new cn(t, e),
      g = function () {
        var A,
          R = De(
            _o().map(function (N) {
              return p.addAdditionalEventProperties(
                N,
                "click",
                t.cssSelectorAllowlist,
                f,
              );
            }),
          ),
          O = De(
            new de(function (N) {
              var U,
                q = function (j) {
                  var $ = p.addAdditionalEventProperties(
                    j,
                    "change",
                    t.cssSelectorAllowlist,
                    f,
                  );
                  N.next($);
                };
              return (
                (U = B()) === null ||
                  U === void 0 ||
                  U.document.addEventListener("change", q, { capture: !0 }),
                function () {
                  var j;
                  return (j = B()) === null || j === void 0
                    ? void 0
                    : j.document.removeEventListener("change", q);
                }
              );
            }),
          ),
          G;
        window.navigation &&
          (G = De(
            new de(function (N) {
              var U = function (q) {
                var j = p.addAdditionalEventProperties(
                  q,
                  "navigate",
                  t.cssSelectorAllowlist,
                  f,
                );
                N.next(j);
              };
              return (
                window.navigation.addEventListener("navigate", U),
                function () {
                  window.navigation.removeEventListener("navigate", U);
                }
              );
            }),
          ));
        var F = De(
          Io().map(function (N) {
            return p.addAdditionalEventProperties(
              N,
              "mutation",
              t.cssSelectorAllowlist,
              f,
            );
          }),
        );
        return (
          (A = {}),
          (A[Se.ChangeObservable] = O),
          (A[Se.ClickObservable] = R),
          (A[Se.MutationObservable] = F),
          (A[Se.NavigateObservable] = G),
          A
        );
      },
      b = ti(
        Object.values(
          (s =
            (a = t.pageActions) === null || a === void 0
              ? void 0
              : a.labeledEvents) !== null && s !== void 0
            ? s
            : {},
        ),
      ),
      T = ri(
        (c =
          (u = t.pageActions) === null || u === void 0
            ? void 0
            : u.triggers) !== null && c !== void 0
          ? c
          : [],
      ),
      w = Vc(b, T, p, t),
      I = function (A) {
        var R, O;
        A &&
          ((t.pageActions = C(C({}, t.pageActions), A)),
          (b = ti(
            Object.values(
              (R = t.pageActions.labeledEvents) !== null && R !== void 0
                ? R
                : {},
            ),
          )),
          (T = ri(
            (O = t.pageActions.triggers) !== null && O !== void 0 ? O : [],
          )),
          w.update(b, T, t));
      },
      _ = function (A, R) {
        return S(void 0, void 0, void 0, function () {
          var O, G, F, N, U, q, j, $, ne, Y;
          return E(this, function (re) {
            return typeof document > "u"
              ? [2]
              : (A.fetchRemoteConfig &&
                  (A.remoteConfigClient
                    ? A.remoteConfigClient.subscribe(
                        "analyticsSDK.pageActions",
                        "all",
                        function (X) {
                          I(X);
                        },
                      )
                    : A.loggerProvider.debug(
                        "Remote config client is not provided, skipping remote config fetch",
                      )),
                (O = ct(t, t.cssSelectorAllowlist)),
                (G = ct(t, t.actionClickAllowlist)),
                (F = g()),
                (N = Nc({
                  allObservables: F,
                  amplitude: R,
                  shouldTrackEvent: O,
                  evaluateTriggers: w.evaluate.bind(w),
                })),
                y.push(N),
                (U = Mc({
                  allObservables: F,
                  getEventProperties: function () {
                    for (var X = [], H = 0; H < arguments.length; H++)
                      X[H] = arguments[H];
                    return p.getEventProperties.apply(
                      p,
                      V(V([], L(X), !1), [f], !1),
                    );
                  },
                  amplitude: R,
                  shouldTrackEvent: O,
                  evaluateTriggers: w.evaluate.bind(w),
                })),
                y.push(U),
                (q = xc({
                  allObservables: F,
                  options: t,
                  getEventProperties: function () {
                    for (var X = [], H = 0; H < arguments.length; H++)
                      X[H] = arguments[H];
                    return p.getEventProperties.apply(
                      p,
                      V(V([], L(X), !1), [f], !1),
                    );
                  },
                  amplitude: R,
                  shouldTrackEvent: O,
                  shouldTrackActionClick: G,
                })),
                q && y.push(q),
                (ne = A?.loggerProvider) === null ||
                  ne === void 0 ||
                  ne.log("".concat(h, " has been successfully added.")),
                window.opener &&
                  v.enabled &&
                  ((j = t.cssSelectorAllowlist),
                  ($ = t.actionClickAllowlist),
                  (Y = v.messenger) === null ||
                    Y === void 0 ||
                    Y.setup(
                      C(
                        C(
                          { dataExtractor: p, logger: A?.loggerProvider },
                          A?.serverZone && { endpoint: vc[A.serverZone] },
                        ),
                        {
                          isElementSelectable: ct(
                            t,
                            V(V([], L(j), !1), L($), !1),
                          ),
                          cssSelectorAllowlist: j,
                          actionClickAllowlist: $,
                        },
                      ),
                    )),
                [2]);
          });
        });
      },
      P = function (A) {
        return S(void 0, void 0, void 0, function () {
          return E(this, function (R) {
            return [2, A];
          });
        });
      },
      k = function () {
        return S(void 0, void 0, void 0, function () {
          var A, R, O, G, F;
          return E(this, function (N) {
            try {
              for (A = x(y), R = A.next(); !R.done; R = A.next())
                ((O = R.value), O.unsubscribe());
            } catch (U) {
              G = { error: U };
            } finally {
              try {
                R && !R.done && (F = A.return) && F.call(A);
              } finally {
                if (G) throw G.error;
              }
            }
            return [2];
          });
        });
      };
    return { name: h, type: m, setup: _, execute: P, teardown: k };
  },
  Gc = 3e3,
  Hc = ["mutation", "navigate"];
function Wc(t) {
  var e = t.amplitude,
    r = t.allObservables,
    n = t.getEventProperties,
    i = t.shouldTrackDeadClick,
    o = r.clickObservable,
    a = r.mutationObservable,
    s = r.navigateObservable,
    u = o.filter(function (v) {
      return (
        er(v) &&
        i("click", v.closestTrackedAncestor) &&
        v.event.target instanceof Element &&
        v.event.target.closest('a[target="_blank"]') === null
      );
    }),
    c = s ? Ht(a, s) : a,
    l = Ht(u, c),
    f = null,
    d = an(l, function (v) {
      return f && Hc.includes(v.type)
        ? (clearTimeout(f), (f = null), Promise.resolve(null))
        : v.type === "click"
          ? f
            ? Promise.resolve(null)
            : new Promise(function (h) {
                f = setTimeout(function () {
                  (h(v), (f = null));
                }, Gc);
              })
          : Promise.resolve(null);
    });
  return d.subscribe(function (v) {
    if (v) {
      var h = {
        "[Amplitude] X": v.event.clientX,
        "[Amplitude] Y": v.event.clientY,
      };
      e.track(Yu, C(C({}, n("click", v.closestTrackedAncestor)), h), {
        time: v.timestamp,
      });
    }
  });
}
var Po = Bs,
  Co = qs,
  ni = Vs;
function ii(t, e) {
  var r,
    n,
    i,
    o,
    a = e.event,
    s = a.clientX,
    u = a.clientY;
  ((t.yMin = Math.min((r = t.yMin) !== null && r !== void 0 ? r : u, u)),
    (t.yMax = Math.max((n = t.yMax) !== null && n !== void 0 ? n : u, u)),
    (t.xMin = Math.min((i = t.xMin) !== null && i !== void 0 ? i : s, s)),
    (t.xMax = Math.max((o = t.xMax) !== null && o !== void 0 ? o : s, s)),
    (t.isOutOfBounds = t.yMax - t.yMin > ni || t.xMax - t.xMin > ni));
}
function oi(t) {
  if (t.length === 0) return null;
  var e = t[0],
    r = t[t.length - 1],
    n = C(
      {
        "[Amplitude] Begin Time": new Date(e.timestamp).toISOString(),
        "[Amplitude] End Time": new Date(r.timestamp).toISOString(),
        "[Amplitude] Duration": r.timestamp - e.timestamp,
        "[Amplitude] Clicks": t.map(function (i) {
          return { X: i.event.clientX, Y: i.event.clientY, Time: i.timestamp };
        }),
        "[Amplitude] Click Count": t.length,
      },
      e.targetElementProperties,
    );
  return { rageClickEvent: n, time: e.timestamp };
}
function Kc(t, e) {
  var r = Math.max(0, t.length - Po + 1),
    n = t[r];
  return e.timestamp - n.timestamp >= Co;
}
function zc(t, e) {
  return (
    t.length > 0 &&
    t[t.length - 1].closestTrackedAncestor !== e.closestTrackedAncestor
  );
}
function $c(t) {
  var e = this,
    r = t.amplitude,
    n = t.allObservables,
    i = t.shouldTrackRageClick,
    o = n.clickObservable,
    a = [],
    s = {},
    u = null;
  function c(f) {
    ((a = []), (s = {}), f && (ii(s, f), a.push(f)));
  }
  var l = an(
    o.filter(function (f) {
      return i("click", f.closestTrackedAncestor);
    }),
    function (f) {
      return S(e, void 0, void 0, function () {
        var d;
        return E(this, function (v) {
          return (
            ii(s, f),
            (d = null),
            a.length === 0 || zc(a, f) || Kc(a, f) || s.isOutOfBounds
              ? (u && (d = oi(a)), c(f))
              : a.push(f),
            u && (clearTimeout(u.timerId), u.resolve(d), (u = null)),
            a.length >= Po
              ? [
                  2,
                  new Promise(function (h) {
                    u = {
                      resolve: h,
                      timerId: setTimeout(function () {
                        h(oi(a));
                      }, Co),
                    };
                  }),
                ]
              : [2, null]
          );
        });
      });
    },
  );
  return l.subscribe(function (f) {
    f !== null && r.track(Ju, f.rageClickEvent, { time: f.time });
  });
}
var Xc = function (t) {
    var e, r, n, i, o;
    t === void 0 && (t = {});
    var a = Xu,
      s = "enrichment",
      u = [],
      c =
        (r =
          (e = t.rageClicks) === null || e === void 0
            ? void 0
            : e.cssSelectorAllowlist) !== null && r !== void 0
          ? r
          : Fs,
      l =
        (i =
          (n = t.deadClicks) === null || n === void 0
            ? void 0
            : n.cssSelectorAllowlist) !== null && i !== void 0
          ? i
          : Us,
      f = (o = t.dataAttributePrefix) !== null && o !== void 0 ? o : eo,
      d = new cn(t),
      v = V([], L(new Set(V(V([], L(c), !1), L(l), !1))), !1),
      h = function () {
        var g,
          b = De(
            _o("pointerdown").map(function (_) {
              return d.addAdditionalEventProperties(_, "click", v, f, !0);
            }),
          ),
          T = De(
            Io().map(function (_) {
              return d.addAdditionalEventProperties(_, "mutation", v, f);
            }),
          ),
          w;
        if (window.navigation) {
          var I = new de(function (_) {
            var P = function (k) {
              _.next(C(C({}, k), { type: "navigate" }));
            };
            return (
              window.navigation.addEventListener("navigate", P),
              function () {
                window.navigation.removeEventListener("navigate", P);
              }
            );
          });
          w = De(
            I.map(function (_) {
              return d.addAdditionalEventProperties(_, "navigate", v, f);
            }),
          );
        }
        return (
          (g = {}),
          (g[Se.ClickObservable] = b),
          (g[Se.MutationObservable] = T),
          (g[Se.NavigateObservable] = w),
          g
        );
      },
      m = function (g, b) {
        return S(void 0, void 0, void 0, function () {
          var T, w, I, _, P, k;
          return E(this, function (A) {
            return typeof document > "u"
              ? [2]
              : ((T = ct(t, c)),
                (w = ct(t, l)),
                (I = h()),
                (_ = $c({
                  allObservables: I,
                  amplitude: b,
                  shouldTrackRageClick: T,
                })),
                u.push(_),
                (P = Wc({
                  amplitude: b,
                  allObservables: I,
                  getEventProperties: function (R, O) {
                    return d.getEventProperties(R, O, f);
                  },
                  shouldTrackDeadClick: w,
                })),
                u.push(P),
                (k = g?.loggerProvider) === null ||
                  k === void 0 ||
                  k.log("".concat(a, " has been successfully added.")),
                [2]);
          });
        });
      },
      y = function (g) {
        return S(void 0, void 0, void 0, function () {
          return E(this, function (b) {
            return [2, g];
          });
        });
      },
      p = function () {
        return S(void 0, void 0, void 0, function () {
          var g, b, T, w, I;
          return E(this, function (_) {
            try {
              for (g = x(u), b = g.next(); !b.done; b = g.next())
                ((T = b.value), T.unsubscribe());
            } catch (P) {
              w = { error: P };
            } finally {
              try {
                b && !b.done && (I = g.return) && I.call(g);
              } finally {
                if (w) throw w.error;
              }
            }
            return [2];
          });
        });
      };
    return { name: a, type: s, setup: m, execute: y, teardown: p };
  },
  Yc = "@amplitude/plugin-network-capture-browser",
  Ao = "[Amplitude] Network Request",
  ko = "500-599";
function Mt(t, e) {
  var r = e.replace(/[-[\]{}()+?.,\\^$|#\s]/g, "\\$&"),
    n = "^" + r.replace(/\*/g, ".*") + "$",
    i = new RegExp(n);
  return i.test(t);
}
function Ro(t, e) {
  var r,
    n,
    i = e.split(",");
  try {
    for (var o = x(i), a = o.next(); !a.done; a = o.next()) {
      var s = a.value,
        u = L(s.split("-").map(Number), 2),
        c = u[0],
        l = u[1];
      if ((t === c && l === void 0) || (t >= c && t <= l)) return !0;
    }
  } catch (f) {
    r = { error: f };
  } finally {
    try {
      a && !a.done && (n = o.return) && n.call(o);
    } finally {
      if (r) throw r.error;
    }
  }
  return !1;
}
function Jc(t, e, r, n, i) {
  if (
    !(
      t.hosts &&
      !t.hosts.find(function (a) {
        return Mt(e, a);
      })
    ) &&
    !(n && t.urls && !Cr(n, t.urls)) &&
    !(
      i &&
      t.methods &&
      !t.methods.find(function (a) {
        return i.toLowerCase() === a.toLowerCase() || a === "*";
      })
    )
  ) {
    if (r || r === 0) {
      var o = t.statusCodeRange || ko;
      if (!Ro(r, o)) return !1;
    }
    return !0;
  }
}
function Oo(t) {
  var e;
  if (t)
    try {
      var r = (e = B()) === null || e === void 0 ? void 0 : e.location.href,
        n = new URL(t, r),
        i = n.searchParams.toString(),
        o = n.hash.replace("#", ""),
        a = n.href,
        s = n.host;
      ((n.hash = ""), (n.search = ""));
      var u = n.href;
      return {
        query: i,
        fragment: o,
        href: a,
        hrefWithoutQueryOrHash: u,
        host: s,
      };
    } catch {
      return;
    }
}
function Qc(t, e) {
  if (t.includes("amplitude.com"))
    try {
      var r = e.body;
      if (typeof r != "string") return !1;
      var n = JSON.parse(r),
        i = n.events;
      if (
        i.find(function (o) {
          return o.event_type === Ao;
        })
      )
        return !0;
    } catch {}
  return !1;
}
function ai(t) {
  if (typeof t != "object" || t === null) {
    if (t) return V([], L(Bt), !1);
    if (t === void 0) {
      var e = void 0;
      return e;
    }
    return;
  }
  if (t.length !== 0) return t;
}
function si(t) {
  var e, r;
  return (
    !(!((e = t?.allowlist) === null || e === void 0) && e.length) &&
    !(!((r = t?.blocklist) === null || r === void 0) && r.length)
  );
}
function Zc(t, e) {
  var r;
  e === void 0 && (e = {});
  var n = Oo(t.url);
  if (!n) return !1;
  var i = n.host;
  if (
    (e.ignoreAmplitudeRequests !== !1 &&
      (Mt(i, "*.amplitude.com") || Mt(i, "amplitude.com"))) ||
    (!((r = e.ignoreHosts) === null || r === void 0) &&
      r.find(function (a) {
        return Mt(i, a);
      })) ||
    (!e.captureRules && t.status !== void 0 && !Ro(t.status, ko))
  )
    return !1;
  if (e.captureRules) {
    var o;
    if (
      (V([], L(e.captureRules), !1)
        .reverse()
        .find(function (a) {
          if (((o = Jc(a, i, t.status, t.url, t.method)), o)) {
            var s = ai(a.responseHeaders);
            if (t.responseWrapper && s) {
              var u = t.responseWrapper.headers(s);
              u && (t.responseHeaders = u);
            }
            var c = ai(a.requestHeaders);
            if (t.requestWrapper && c) {
              var l = t.requestWrapper.headers(c);
              l && (t.requestHeaders = l);
            }
            (t.responseWrapper &&
              a.responseBody &&
              !si(a.responseBody) &&
              (t.responseBodyJson = t.responseWrapper.json(
                a.responseBody.allowlist,
                a.responseBody.blocklist,
              )),
              t.requestWrapper &&
                a.requestBody &&
                !si(a.requestBody) &&
                (t.requestBodyJson = t.requestWrapper.json(
                  a.requestBody.allowlist,
                  a.requestBody.blocklist,
                )));
          }
          return o !== void 0;
        }),
      !o)
    )
      return !1;
  }
  return !(t.requestWrapper && Qc(i, t.requestWrapper));
}
function el(t, e, r, n) {
  return S(this, void 0, void 0, function () {
    var i, o, a;
    return E(this, function (s) {
      switch (s.label) {
        case 0:
          return e.requestBodyJson || e.responseBodyJson
            ? [4, Promise.all([e.requestBodyJson, e.responseBodyJson])]
            : [3, 2];
        case 1:
          if (((i = L.apply(void 0, [s.sent(), 2])), (o = i[0]), (a = i[1]), o))
            try {
              t["[Amplitude] Request Body"] = JSON.stringify(o);
            } catch (u) {
              n?.debug("Failed to stringify request body", u);
            }
          if (a)
            try {
              t["[Amplitude] Response Body"] = JSON.stringify(a);
            } catch {
              n?.debug("Failed to stringify response body");
            }
          s.label = 2;
        case 2:
          return (r?.track(Ao, t), [2]);
      }
    });
  });
}
function tl(t) {
  var e = t.allObservables,
    r = t.networkTrackingOptions,
    n = t.amplitude,
    i = t.loggerProvider,
    o = e.networkObservable,
    a = o.filter(function (s) {
      return Zc(s.event, r);
    });
  return a.subscribe(function (s) {
    var u,
      c,
      l,
      f = s.event,
      d = Oo(f.url);
    if (d) {
      var v =
          (c = f.responseWrapper) === null || c === void 0
            ? void 0
            : c.bodySize,
        h =
          (l = f.requestWrapper) === null || l === void 0 ? void 0 : l.bodySize,
        m =
          ((u = {}),
          (u["[Amplitude] URL"] = d.hrefWithoutQueryOrHash),
          (u["[Amplitude] URL Query"] = d.query),
          (u["[Amplitude] URL Fragment"] = d.fragment),
          (u["[Amplitude] Request Method"] = f.method),
          (u["[Amplitude] Status Code"] = f.status),
          (u["[Amplitude] Start Time"] = f.startTime),
          (u["[Amplitude] Completion Time"] = f.endTime),
          (u["[Amplitude] Duration"] = f.duration),
          (u["[Amplitude] Request Body Size"] = h),
          (u["[Amplitude] Response Body Size"] = v),
          (u["[Amplitude] Request Type"] = f.type),
          (u["[Amplitude] Request Headers"] = f.requestHeaders),
          (u["[Amplitude] Response Headers"] = f.responseHeaders),
          u);
      el(m, f, n, i);
    }
  });
}
var Dr;
(function (t) {
  t.NetworkObservable = "networkObservable";
})(Dr || (Dr = {}));
var ui,
  rl = function (t) {
    t === void 0 && (t = {});
    var e = Yc,
      r = "enrichment",
      n,
      i = function (c, l) {
        var f = { event: c, timestamp: Date.now(), type: l };
        return f;
      },
      o = function () {
        var c,
          l = new de(function (f) {
            var d = new Ys(function (v) {
              var h = i(v, "network");
              f.next(h);
            });
            return (
              Vn.subscribe(d, n),
              function () {
                Vn.unsubscribe(d);
              }
            );
          });
        return ((c = {}), (c[Dr.NetworkObservable] = l), c);
      },
      a = function (c, l) {
        return S(void 0, void 0, void 0, function () {
          var f;
          return E(this, function (d) {
            return typeof document > "u"
              ? [2]
              : ((f = o()),
                (n = c?.loggerProvider),
                (ui = tl({
                  allObservables: f,
                  networkTrackingOptions: t,
                  amplitude: l,
                  loggerProvider: n,
                })),
                n?.log("".concat(e, " has been successfully added.")),
                [2]);
          });
        });
      },
      s = function (c) {
        return S(void 0, void 0, void 0, function () {
          return E(this, function (l) {
            return [2, c];
          });
        });
      },
      u = function () {
        return S(void 0, void 0, void 0, function () {
          return E(this, function (c) {
            return (ui.unsubscribe(), [2]);
          });
        });
      };
    return { name: e, type: r, setup: a, execute: s, teardown: u };
  },
  nl = "web-vitals-browser",
  il = "[Amplitude] Web Vitals";
let Lo = -1;
const $e = (t) => {
    addEventListener(
      "pageshow",
      (e) => {
        e.persisted && ((Lo = e.timeStamp), t(e));
      },
      !0,
    );
  },
  me = (t, e, r, n) => {
    let i, o;
    return (a) => {
      e.value >= 0 &&
        (a || n) &&
        ((o = e.value - (i ?? 0)),
        (o || i === void 0) &&
          ((i = e.value),
          (e.delta = o),
          (e.rating = ((s, u) =>
            s > u[1] ? "poor" : s > u[0] ? "needs-improvement" : "good")(
            e.value,
            r,
          )),
          t(e)));
    };
  },
  ln = (t) => {
    requestAnimationFrame(() => requestAnimationFrame(() => t()));
  },
  dn = () => {
    const t = performance.getEntriesByType("navigation")[0];
    if (t && t.responseStart > 0 && t.responseStart < performance.now())
      return t;
  },
  yt = () => dn()?.activationStart ?? 0,
  ye = (t, e = -1) => {
    const r = dn();
    let n = "navigate";
    return (
      Lo >= 0
        ? (n = "back-forward-cache")
        : r &&
          (document.prerendering || yt() > 0
            ? (n = "prerender")
            : document.wasDiscarded
              ? (n = "restore")
              : r.type && (n = r.type.replace(/_/g, "-"))),
      {
        name: t,
        value: e,
        rating: "good",
        delta: 0,
        entries: [],
        id: `v5-${Date.now()}-${Math.floor(8999999999999 * Math.random()) + 1e12}`,
        navigationType: n,
      }
    );
  },
  hr = new WeakMap();
function fn(t, e) {
  return (hr.get(t) || hr.set(t, new e()), hr.get(t));
}
class ol {
  t;
  i = 0;
  o = [];
  h(e) {
    if (e.hadRecentInput) return;
    const r = this.o[0],
      n = this.o.at(-1);
    (this.i &&
    r &&
    n &&
    e.startTime - n.startTime < 1e3 &&
    e.startTime - r.startTime < 5e3
      ? ((this.i += e.value), this.o.push(e))
      : ((this.i = e.value), (this.o = [e])),
      this.t?.(e));
  }
}
const bt = (t, e, r = {}) => {
    try {
      if (PerformanceObserver.supportedEntryTypes.includes(t)) {
        const n = new PerformanceObserver((i) => {
          Promise.resolve().then(() => {
            e(i.getEntries());
          });
        });
        return (n.observe({ type: t, buffered: !0, ...r }), n);
      }
    } catch {}
  },
  vn = (t) => {
    let e = !1;
    return () => {
      e || (t(), (e = !0));
    };
  };
let je = -1;
const ci = () =>
    document.visibilityState !== "hidden" || document.prerendering ? 1 / 0 : 0,
  Kt = (t) => {
    document.visibilityState === "hidden" &&
      je > -1 &&
      ((je = t.type === "visibilitychange" ? t.timeStamp : 0), al());
  },
  li = () => {
    (addEventListener("visibilitychange", Kt, !0),
      addEventListener("prerenderingchange", Kt, !0));
  },
  al = () => {
    (removeEventListener("visibilitychange", Kt, !0),
      removeEventListener("prerenderingchange", Kt, !0));
  },
  Do = () => {
    if (je < 0) {
      const t = yt();
      ((je =
        (document.prerendering
          ? void 0
          : globalThis.performance
              .getEntriesByType("visibility-state")
              .filter((r) => r.name === "hidden" && r.startTime > t)[0]
              ?.startTime) ?? ci()),
        li(),
        $e(() => {
          setTimeout(() => {
            ((je = ci()), li());
          });
        }));
    }
    return {
      get firstHiddenTime() {
        return je;
      },
    };
  },
  tr = (t) => {
    document.prerendering
      ? addEventListener("prerenderingchange", () => t(), !0)
      : t();
  },
  di = [1800, 3e3],
  No = (t, e = {}) => {
    tr(() => {
      const r = Do();
      let n,
        i = ye("FCP");
      const o = bt("paint", (a) => {
        for (const s of a)
          s.name === "first-contentful-paint" &&
            (o.disconnect(),
            s.startTime < r.firstHiddenTime &&
              ((i.value = Math.max(s.startTime - yt(), 0)),
              i.entries.push(s),
              n(!0)));
      });
      o &&
        ((n = me(t, i, di, e.reportAllChanges)),
        $e((a) => {
          ((i = ye("FCP")),
            (n = me(t, i, di, e.reportAllChanges)),
            ln(() => {
              ((i.value = performance.now() - a.timeStamp), n(!0));
            }));
        }));
    });
  },
  fi = [0.1, 0.25],
  sl = (t, e = {}) => {
    No(
      vn(() => {
        let r,
          n = ye("CLS", 0);
        const i = fn(e, ol),
          o = (s) => {
            for (const u of s) i.h(u);
            i.i > n.value && ((n.value = i.i), (n.entries = i.o), r());
          },
          a = bt("layout-shift", o);
        a &&
          ((r = me(t, n, fi, e.reportAllChanges)),
          document.addEventListener("visibilitychange", () => {
            document.visibilityState === "hidden" &&
              (o(a.takeRecords()), r(!0));
          }),
          $e(() => {
            ((i.i = 0),
              (n = ye("CLS", 0)),
              (r = me(t, n, fi, e.reportAllChanges)),
              ln(() => r()));
          }),
          setTimeout(r));
      }),
    );
  };
let Mo = 0,
  gr = 1 / 0,
  wt = 0;
const ul = (t) => {
  for (const e of t)
    e.interactionId &&
      ((gr = Math.min(gr, e.interactionId)),
      (wt = Math.max(wt, e.interactionId)),
      (Mo = wt ? (wt - gr) / 7 + 1 : 0));
};
let Nr;
const vi = () => (Nr ? Mo : (performance.interactionCount ?? 0)),
  cl = () => {
    "interactionCount" in performance ||
      Nr ||
      (Nr = bt("event", ul, {
        type: "event",
        buffered: !0,
        durationThreshold: 0,
      }));
  };
let hi = 0;
class ll {
  u = [];
  l = new Map();
  m;
  p;
  v() {
    ((hi = vi()), (this.u.length = 0), this.l.clear());
  }
  P() {
    const e = Math.min(this.u.length - 1, Math.floor((vi() - hi) / 50));
    return this.u[e];
  }
  h(e) {
    if ((this.m?.(e), !e.interactionId && e.entryType !== "first-input"))
      return;
    const r = this.u.at(-1);
    let n = this.l.get(e.interactionId);
    if (n || this.u.length < 10 || e.duration > r.T) {
      if (
        (n
          ? e.duration > n.T
            ? ((n.entries = [e]), (n.T = e.duration))
            : e.duration === n.T &&
              e.startTime === n.entries[0].startTime &&
              n.entries.push(e)
          : ((n = { id: e.interactionId, entries: [e], T: e.duration }),
            this.l.set(n.id, n),
            this.u.push(n)),
        this.u.sort((i, o) => o.T - i.T),
        this.u.length > 10)
      ) {
        const i = this.u.splice(10);
        for (const o of i) this.l.delete(o.id);
      }
      this.p?.(n);
    }
  }
}
const xo = (t) => {
    const e = globalThis.requestIdleCallback || setTimeout;
    document.visibilityState === "hidden"
      ? t()
      : (e((t = vn(t))),
        document.addEventListener("visibilitychange", t, { once: !0 }));
  },
  gi = [200, 500],
  dl = (t, e = {}) => {
    globalThis.PerformanceEventTiming &&
      "interactionId" in PerformanceEventTiming.prototype &&
      tr(() => {
        cl();
        let r,
          n = ye("INP");
        const i = fn(e, ll),
          o = (s) => {
            xo(() => {
              for (const c of s) i.h(c);
              const u = i.P();
              u &&
                u.T !== n.value &&
                ((n.value = u.T), (n.entries = u.entries), r());
            });
          },
          a = bt("event", o, { durationThreshold: e.durationThreshold ?? 40 });
        ((r = me(t, n, gi, e.reportAllChanges)),
          a &&
            (a.observe({ type: "first-input", buffered: !0 }),
            document.addEventListener("visibilitychange", () => {
              document.visibilityState === "hidden" &&
                (o(a.takeRecords()), r(!0));
            }),
            $e(() => {
              (i.v(), (n = ye("INP")), (r = me(t, n, gi, e.reportAllChanges)));
            })));
      });
  };
class fl {
  m;
  h(e) {
    this.m?.(e);
  }
}
const pi = [2500, 4e3],
  vl = (t, e = {}) => {
    tr(() => {
      const r = Do();
      let n,
        i = ye("LCP");
      const o = fn(e, fl),
        a = (u) => {
          e.reportAllChanges || (u = u.slice(-1));
          for (const c of u)
            (o.h(c),
              c.startTime < r.firstHiddenTime &&
                ((i.value = Math.max(c.startTime - yt(), 0)),
                (i.entries = [c]),
                n()));
        },
        s = bt("largest-contentful-paint", a);
      if (s) {
        n = me(t, i, pi, e.reportAllChanges);
        const u = vn(() => {
          (a(s.takeRecords()), s.disconnect(), n(!0));
        });
        for (const c of ["keydown", "click", "visibilitychange"])
          addEventListener(c, () => xo(u), { capture: !0, once: !0 });
        $e((c) => {
          ((i = ye("LCP")),
            (n = me(t, i, pi, e.reportAllChanges)),
            ln(() => {
              ((i.value = performance.now() - c.timeStamp), n(!0));
            }));
        });
      }
    });
  },
  mi = [800, 1800],
  Mr = (t) => {
    document.prerendering
      ? tr(() => Mr(t))
      : document.readyState !== "complete"
        ? addEventListener("load", () => Mr(t), !0)
        : setTimeout(t);
  },
  hl = (t, e = {}) => {
    let r = ye("TTFB"),
      n = me(t, r, mi, e.reportAllChanges);
    Mr(() => {
      const i = dn();
      i &&
        ((r.value = Math.max(i.responseStart - yt(), 0)),
        (r.entries = [i]),
        n(!0),
        $e(() => {
          ((r = ye("TTFB", 0)), (n = me(t, r, mi, e.reportAllChanges)), n(!0));
        }));
    });
  };
function gl(t) {
  var e,
    r =
      ((e = t.entries[0]) === null || e === void 0 ? void 0 : e.startTime) || 0;
  return performance.timeOrigin + r;
}
function et(t) {
  return {
    value: t.value,
    rating: t.rating,
    delta: t.delta,
    navigationType: t.navigationType,
    id: t.id,
    timestamp: Math.floor(gl(t)),
    navigationStart: Math.floor(performance.timeOrigin),
  };
}
var pl = function () {
    var t = null,
      e = B(),
      r = e?.document,
      n = e?.location,
      i = function (s, u) {
        return S(void 0, void 0, void 0, function () {
          var c, l;
          return E(this, function (f) {
            return r === void 0
              ? [2]
              : ((c = Ae(n?.href || "", s.loggerProvider)),
                (l = {
                  "[Amplitude] Page Domain": n?.hostname || "",
                  "[Amplitude] Page Location": c,
                  "[Amplitude] Page Path": Ae(
                    n?.pathname || "",
                    s.loggerProvider,
                  ),
                  "[Amplitude] Page Title":
                    (typeof document < "u" && document.title) || "",
                  "[Amplitude] Page URL": Ae(c.split("?")[0], s.loggerProvider),
                }),
                vl(function (d) {
                  l["[Amplitude] LCP"] = et(d);
                }),
                No(function (d) {
                  l["[Amplitude] FCP"] = et(d);
                }),
                dl(function (d) {
                  l["[Amplitude] INP"] = et(d);
                }),
                sl(function (d) {
                  l["[Amplitude] CLS"] = et(d);
                }),
                hl(function (d) {
                  l["[Amplitude] TTFB"] = et(d);
                }),
                (t = function () {
                  r.visibilityState === "hidden" &&
                    t &&
                    (u.track(il, l),
                    r.removeEventListener("visibilitychange", t),
                    (t = null));
                }),
                r.addEventListener("visibilitychange", t),
                [2]);
          });
        });
      },
      o = function (s) {
        return S(void 0, void 0, void 0, function () {
          return E(this, function (u) {
            return [2, s];
          });
        });
      },
      a = function () {
        return S(void 0, void 0, void 0, function () {
          return E(this, function (s) {
            return (t && r?.removeEventListener("visibilitychange", t), [2]);
          });
        });
      };
    return { name: nl, type: "enrichment", setup: i, execute: o, teardown: a };
  },
  yi = function (t) {
    var e = t.split(".");
    return e.length <= 2 ? t : e.slice(e.length - 2, e.length).join(".");
  },
  ml = function (t) {
    return Object.values(t).every(function (e) {
      return !e;
    });
  },
  yl = function (t, e, r, n, i) {
    (i === void 0 && (i = !0), t.referrer);
    var o = t.referring_domain,
      a = Ut(t, ["referrer", "referring_domain"]),
      s = e || {};
    s.referrer;
    var u = s.referring_domain,
      c = Ut(s, ["referrer", "referring_domain"]);
    if (bl(r.excludeReferrers, t.referring_domain))
      return (
        n.debug(
          "This is not a new campaign because ".concat(
            t.referring_domain,
            " is in the exclude referrer list.",
          ),
        ),
        !1
      );
    if (!i && ml(t) && e)
      return (
        n.debug(
          "This is not a new campaign because this is a direct traffic in the same session.",
        ),
        !1
      );
    var l = JSON.stringify(a) !== JSON.stringify(c),
      f = yi(o || "") !== yi(u || ""),
      d = !e || l || f;
    return (
      d
        ? n.debug("This is a new campaign. An $identify event will be sent.")
        : n.debug(
            "This is not a new campaign because it's the same as the previous one.",
          ),
      d
    );
  },
  bl = function (t, e) {
    return (
      t === void 0 && (t = []),
      e === void 0 && (e = ""),
      t.some(function (r) {
        return r instanceof RegExp ? r.test(e) : r === e;
      })
    );
  },
  El = function (t, e) {
    var r = C(C({}, Jt), t),
      n = Object.entries(r).reduce(function (i, o) {
        var a,
          s = L(o, 2),
          u = s[0],
          c = s[1];
        return (
          i.setOnce(
            "initial_".concat(u),
            (a = c ?? e.initialEmptyValue) !== null && a !== void 0
              ? a
              : "EMPTY",
          ),
          c ? i.set(u, c) : i.unset(u)
        );
      }, new He());
    return Xr(n);
  },
  Sl = function (t) {
    var e = t;
    return e
      ? (e.startsWith(".") && (e = e.substring(1)),
        [new RegExp("".concat(e.replace(".", "\\."), "$"))])
      : [];
  },
  Tl = (function () {
    function t(e, r) {
      var n;
      ((this.shouldTrackNewCampaign = !1),
        (this.options = C(
          {
            initialEmptyValue: "EMPTY",
            resetSessionOnNewCampaign: !1,
            excludeReferrers: Sl(
              (n = r.cookieOptions) === null || n === void 0
                ? void 0
                : n.domain,
            ),
          },
          e,
        )),
        (this.storage = r.cookieStorage),
        (this.storageKey = Nn(r.apiKey, "MKTG")),
        (this.webExpStorageKey = Nn(r.apiKey, "MKTG_ORIGINAL")),
        (this.currentCampaign = Jt),
        (this.sessionTimeout = r.sessionTimeout),
        (this.lastEventTime = r.lastEventTime),
        (this.logger = r.loggerProvider),
        r.loggerProvider.log("Installing web attribution tracking."));
    }
    return (
      (t.prototype.init = function () {
        return S(this, void 0, void 0, function () {
          var e, r;
          return E(this, function (n) {
            switch (n.label) {
              case 0:
                return [4, this.fetchCampaign()];
              case 1:
                return (
                  (r = L.apply(void 0, [n.sent(), 2])),
                  (this.currentCampaign = r[0]),
                  (this.previousCampaign = r[1]),
                  (e = this.lastEventTime
                    ? Yi(this.sessionTimeout, this.lastEventTime)
                    : !0),
                  yl(
                    this.currentCampaign,
                    this.previousCampaign,
                    this.options,
                    this.logger,
                    e,
                  )
                    ? ((this.shouldTrackNewCampaign = !0),
                      [
                        4,
                        this.storage.set(this.storageKey, this.currentCampaign),
                      ])
                    : [3, 3]
                );
              case 2:
                (n.sent(), (n.label = 3));
              case 3:
                return [2];
            }
          });
        });
      }),
      (t.prototype.fetchCampaign = function () {
        return S(this, void 0, void 0, function () {
          var e;
          return E(this, function (r) {
            switch (r.label) {
              case 0:
                return [4, this.storage.get(this.webExpStorageKey)];
              case 1:
                return (
                  (e = r.sent()),
                  e ? [4, this.storage.remove(this.webExpStorageKey)] : [3, 3]
                );
              case 2:
                (r.sent(), (r.label = 3));
              case 3:
                return [
                  4,
                  Promise.all([
                    e || new oo().parse(),
                    this.storage.get(this.storageKey),
                  ]),
                ];
              case 4:
                return [2, r.sent()];
            }
          });
        });
      }),
      (t.prototype.generateCampaignEvent = function (e) {
        this.shouldTrackNewCampaign = !1;
        var r = El(this.currentCampaign, this.options);
        return (e && (r.event_id = e), r);
      }),
      (t.prototype.shouldSetSessionIdOnNewCampaign = function () {
        return (
          this.shouldTrackNewCampaign &&
          !!this.options.resetSessionOnNewCampaign
        );
      }),
      t
    );
  })(),
  It = "AMP_CURRENT_PAGE",
  _t = "AMP_PREVIOUS_PAGE",
  Be = "AMP_URL_INFO",
  lt;
(function (t) {
  ((t.Direct = "direct"), (t.Internal = "internal"), (t.External = "external"));
})(lt || (lt = {}));
var wl = new Set([se.IDENTIFY, se.GROUP_IDENTIFY, se.REVENUE]),
  Il = function (t) {
    var e = {},
      r = e.internalDomains,
      n = r === void 0 ? [] : r,
      i = B(),
      o = void 0,
      a = !1,
      s = void 0,
      u = !1,
      c = !1,
      l = function (m) {
        var y;
        try {
          var p = Ae(m, s);
          y = new URL(p).hostname;
        } catch (g) {
          s?.error("Could not parse URL: ", g);
        }
        return y;
      },
      f = function (m) {
        var y = (typeof location < "u" && location.hostname) || "",
          p = m ? l(m) : void 0;
        if (!p) return lt.Direct;
        var g = n.some(function (T) {
            return y.indexOf(T) !== -1;
          }),
          b = n.some(function (T) {
            return p.indexOf(T) !== -1;
          });
        return y === p || (b && g) ? lt.Internal : lt.External;
      },
      d = function () {
        return S(void 0, void 0, void 0, function () {
          var m, y, p, g, b;
          return E(this, function (T) {
            switch (T.label) {
              case 0:
                return o && a ? [4, o.get(Be)] : [3, 3];
              case 1:
                return (
                  (m = T.sent()),
                  (y = Ae((typeof location < "u" && location.href) || "")),
                  (p = m?.[It] || ""),
                  (g = void 0),
                  y === p
                    ? (g = m?.[_t] || "")
                    : p
                      ? (g = p)
                      : (g = document.referrer || ""),
                  [4, o.set(Be, ((b = {}), (b[It] = y), (b[_t] = g), b))]
                );
              case 2:
                (T.sent(), (T.label = 3));
              case 3:
                return [2];
            }
          });
        });
      },
      v = function () {
        d();
      },
      h = {
        name: "@amplitude/plugin-page-url-enrichment-browser",
        type: "enrichment",
        setup: function (m, y) {
          return S(void 0, void 0, void 0, function () {
            return E(this, function (p) {
              switch (p.label) {
                case 0:
                  return (
                    (s = m.loggerProvider),
                    s.log(
                      "Installing @amplitude/plugin-page-url-enrichment-browser",
                    ),
                    (c = !0),
                    i
                      ? ((o = new Jr(i.sessionStorage)), [4, o.isEnabled()])
                      : [3, 2]
                  );
                case 1:
                  ((a = p.sent()),
                    i.addEventListener("popstate", v),
                    u ||
                      ((i.history.pushState = new Proxy(i.history.pushState, {
                        apply: function (g, b, T) {
                          var w = L(T, 3),
                            I = w[0],
                            _ = w[1],
                            P = w[2];
                          (g.apply(b, [I, _, P]), c && v());
                        },
                      })),
                      (i.history.replaceState = new Proxy(
                        i.history.replaceState,
                        {
                          apply: function (g, b, T) {
                            var w = L(T, 3),
                              I = w[0],
                              _ = w[1],
                              P = w[2];
                            (g.apply(b, [I, _, P]), c && v());
                          },
                        },
                      )),
                      (u = !0)),
                    (p.label = 2));
                case 2:
                  return [2];
              }
            });
          });
        },
        execute: function (m) {
          return S(void 0, void 0, void 0, function () {
            var y, p, g, b, T;
            return E(this, function (w) {
              switch (w.label) {
                case 0:
                  return (
                    (y = Ae((typeof location < "u" && location.href) || "")),
                    o && a ? [4, o.get(Be)] : [3, 5]
                  );
                case 1:
                  return (
                    (p = w.sent()),
                    p?.[It]
                      ? [3, 3]
                      : [
                          4,
                          o.set(
                            Be,
                            ((T = {}),
                            (T[It] = y),
                            (T[_t] = document.referrer || ""),
                            T),
                          ),
                        ]
                  );
                case 2:
                  (w.sent(), (w.label = 3));
                case 3:
                  return [4, o.get(Be)];
                case 4:
                  if (
                    ((g = w.sent()),
                    (b = ""),
                    g && (b = g[_t] || ""),
                    wl.has(m.event_type))
                  )
                    return [2, m];
                  ((m.event_properties = C(C({}, m.event_properties || {}), {
                    "[Amplitude] Page Domain": tt(
                      m,
                      "[Amplitude] Page Domain",
                      (typeof location < "u" && location.hostname) || "",
                    ),
                    "[Amplitude] Page Location": tt(
                      m,
                      "[Amplitude] Page Location",
                      y,
                    ),
                    "[Amplitude] Page Path": tt(
                      m,
                      "[Amplitude] Page Path",
                      (typeof location < "u" && Ae(location.pathname)) || "",
                    ),
                    "[Amplitude] Page Title": tt(
                      m,
                      "[Amplitude] Page Title",
                      en(Zr),
                    ),
                    "[Amplitude] Page URL": tt(
                      m,
                      "[Amplitude] Page URL",
                      y.split("?")[0],
                    ),
                    "[Amplitude] Previous Page Location": b,
                    "[Amplitude] Previous Page Type": f(b),
                  })),
                    (w.label = 5));
                case 5:
                  return [2, m];
              }
            });
          });
        },
        teardown: function () {
          return S(void 0, void 0, void 0, function () {
            return E(this, function (m) {
              switch (m.label) {
                case 0:
                  return (
                    i && (i.removeEventListener("popstate", v), (c = !1)),
                    o && a ? [4, o.set(Be, {})] : [3, 2]
                  );
                case 1:
                  (m.sent(), (m.label = 2));
                case 2:
                  return [2];
              }
            });
          });
        },
      };
    return h;
  };
function tt(t, e, r) {
  return (
    t.event_properties || (t.event_properties = {}),
    t.event_properties[e] === void 0 ? r : t.event_properties[e]
  );
}
var _l = (function (t) {
    be(e, t);
    function e() {
      var r = (t !== null && t.apply(this, arguments)) || this;
      return ((r._diagnosticsSampleRate = 0), r);
    }
    return (
      (e.prototype.init = function (r, n, i) {
        r === void 0 && (r = "");
        var o, a;
        return (
          arguments.length > 2
            ? ((o = n), (a = i))
            : typeof n == "string"
              ? ((o = n), (a = void 0))
              : ((o = n?.userId), (a = n)),
          ie(this._init(C(C({}, a), { userId: o, apiKey: r })))
        );
      }),
      (e.prototype._init = function (r) {
        var n, i, o, a;
        return S(this, void 0, void 0, function () {
          var s,
            u,
            c,
            l,
            f,
            d,
            v,
            h,
            m,
            y,
            p = this;
          return E(this, function (g) {
            switch (g.label) {
              case 0:
                return this.initializing
                  ? [2]
                  : ((this.initializing = !0), [4, Nu(r.apiKey, r, this)]);
              case 1:
                return (
                  (s = g.sent()),
                  (c = s.remoteConfig && s.remoteConfig.fetchRemoteConfig),
                  c
                    ? ((u = new Zi(
                        s.apiKey,
                        s.loggerProvider,
                        s.serverZone,
                        (n = s.remoteConfig) === null || n === void 0
                          ? void 0
                          : n.serverUrl,
                      )),
                      [
                        4,
                        new Promise(function (b) {
                          u?.subscribe(
                            "configs.analyticsSDK.browserSDK",
                            "all",
                            function (T, w, I) {
                              (s.loggerProvider.debug(
                                "Remote configuration received:",
                                JSON.stringify(
                                  { remoteConfig: T, source: w, lastFetch: I },
                                  null,
                                  2,
                                ),
                              ),
                                T && zu(T, s),
                                b());
                            },
                          );
                        }),
                      ])
                    : [3, 4]
                );
              case 2:
                return (
                  g.sent(),
                  [
                    4,
                    new Promise(function (b) {
                      u?.subscribe(
                        "configs.diagnostics.browserSDK",
                        "all",
                        function (T, w, I) {
                          if (
                            (s.loggerProvider.debug(
                              "Diagnostics remote configuration received:",
                              JSON.stringify(
                                { remoteConfig: T, source: w, lastFetch: I },
                                null,
                                2,
                              ),
                            ),
                            T)
                          ) {
                            var _ = T.sampleRate;
                            typeof _ == "number" &&
                              !isNaN(_) &&
                              (s.diagnosticsSampleRate = _);
                            var P = T.enabled;
                            typeof P == "boolean" && (s.enableDiagnostics = P);
                          }
                          b();
                        },
                      );
                    }),
                  ]
                );
              case 3:
                (g.sent(), (g.label = 4));
              case 4:
                return (
                  (l = new Ps(s.apiKey, s.loggerProvider, s.serverZone, {
                    enabled: s.enableDiagnostics,
                    sampleRate: s.diagnosticsSampleRate,
                  })),
                  l.setTag("library", "".concat(go, "/").concat(sn)),
                  l.setTag("user_agent", navigator.userAgent),
                  [4, t.prototype._init.call(this, s)]
                );
              case 5:
                return (
                  g.sent(),
                  this.logBrowserOptions(s),
                  (this.config.diagnosticsClient = l),
                  (this.config.remoteConfigClient = u),
                  co(this.config.defaultTracking)
                    ? ((f = pu(this.config)),
                      (this.webAttribution = new Tl(f, this.config)),
                      [4, this.webAttribution.init()])
                    : [3, 7]
                );
              case 6:
                (g.sent(), (g.label = 7));
              case 7:
                return (
                  (d = Vt()),
                  (v = d.ampTimestamp ? Number(d.ampTimestamp) : void 0),
                  (h = v ? Date.now() < v : !0),
                  (m =
                    h && !Number.isNaN(Number(d.ampSessionId))
                      ? Number(d.ampSessionId)
                      : void 0),
                  this.setSessionId(
                    (a =
                      (o =
                        (i = r.sessionId) !== null && i !== void 0 ? i : m) !==
                        null && o !== void 0
                        ? o
                        : this.config.sessionId) !== null && a !== void 0
                      ? a
                      : Date.now(),
                  ),
                  (y = We(r.instanceName)),
                  y.identityStore.setIdentity({
                    userId: this.config.userId,
                    deviceId: this.config.deviceId,
                  }),
                  this.config.offline === Ds
                    ? [3, 9]
                    : [4, this.add(Ku()).promise]
                );
              case 8:
                (g.sent(), (g.label = 9));
              case 9:
                return [4, this.add(new Qa({ diagnosticsClient: l })).promise];
              case 10:
                return (g.sent(), [4, this.add(new bu()).promise]);
              case 11:
                return (g.sent(), [4, this.add(new us()).promise]);
              case 12:
                return (
                  g.sent(),
                  Wu(this.config),
                  uu(this.config.defaultTracking)
                    ? (this.config.loggerProvider.debug(
                        "Adding file download tracking plugin",
                      ),
                      [4, this.add(Hu()).promise])
                    : [3, 14]
                );
              case 13:
                (g.sent(), (g.label = 14));
              case 14:
                return cu(this.config.defaultTracking)
                  ? (this.config.loggerProvider.debug(
                      "Adding form interaction plugin",
                    ),
                    [4, this.add(Gu()).promise])
                  : [3, 16];
              case 15:
                (g.sent(), (g.label = 16));
              case 16:
                return lo(this.config.defaultTracking)
                  ? (this.config.loggerProvider.debug(
                      "Adding page view tracking plugin",
                    ),
                    [4, this.add(qu(gu(this.config))).promise])
                  : [3, 18];
              case 17:
                (g.sent(), (g.label = 18));
              case 18:
                return vo(this.config.autocapture)
                  ? (this.config.loggerProvider.debug(
                      "Adding user interactions plugin (autocapture plugin)",
                    ),
                    [
                      4,
                      this.add(jc(fu(this.config), { diagnosticsClient: l }))
                        .promise,
                    ])
                  : [3, 20];
              case 19:
                (g.sent(), (g.label = 20));
              case 20:
                return ho(this.config.autocapture)
                  ? (this.config.loggerProvider.debug(
                      "Adding frustration interactions plugin",
                    ),
                    [4, this.add(Xc(vu(this.config))).promise])
                  : [3, 22];
              case 21:
                (g.sent(), (g.label = 22));
              case 22:
                return fo(this.config.autocapture)
                  ? (this.config.loggerProvider.debug(
                      "Adding network tracking plugin",
                    ),
                    [4, this.add(rl(hu(this.config))).promise])
                  : [3, 24];
              case 23:
                (g.sent(), (g.label = 24));
              case 24:
                return du(this.config.autocapture)
                  ? (this.config.loggerProvider.debug(
                      "Adding web vitals plugin",
                    ),
                    [4, this.add(pl()).promise])
                  : [3, 26];
              case 25:
                (g.sent(), (g.label = 26));
              case 26:
                return lu(this.config.autocapture)
                  ? (this.config.loggerProvider.debug(
                      "Adding referrer page url plugin",
                    ),
                    [4, this.add(Il()).promise])
                  : [3, 28];
              case 27:
                (g.sent(), (g.label = 28));
              case 28:
                return (
                  (this.initializing = !1),
                  [4, this.runQueuedFunctions("dispatchQ")]
                );
              case 29:
                return (
                  g.sent(),
                  y.eventBridge.setEventReceiver(function (b) {
                    var T = b.eventProperties || {},
                      w = T.time,
                      I = Ut(T, ["time"]),
                      _ = typeof w == "number" ? { time: w } : void 0;
                    p.track(b.eventType, I, _);
                  }),
                  [2]
                );
            }
          });
        });
      }),
      (e.prototype.getUserId = function () {
        var r;
        return (r = this.config) === null || r === void 0 ? void 0 : r.userId;
      }),
      (e.prototype.setUserId = function (r) {
        if (!this.config) {
          this.q.push(this.setUserId.bind(this, r));
          return;
        }
        (this.config.loggerProvider.debug("function setUserId: ", r),
          (r !== this.config.userId || r === void 0) &&
            ((this.config.userId = r),
            this.timeline.onIdentityChanged({ userId: r }),
            as(r, this.config.instanceName)));
      }),
      (e.prototype.getDeviceId = function () {
        var r;
        return (r = this.config) === null || r === void 0 ? void 0 : r.deviceId;
      }),
      (e.prototype.setDeviceId = function (r) {
        if (!this.config) {
          this.q.push(this.setDeviceId.bind(this, r));
          return;
        }
        (this.config.loggerProvider.debug("function setDeviceId: ", r),
          r !== this.config.deviceId &&
            ((this.config.deviceId = r),
            this.timeline.onIdentityChanged({ deviceId: r }),
            ss(r, this.config.instanceName)));
      }),
      (e.prototype.reset = function () {
        (this.setDeviceId(Re()),
          this.setUserId(void 0),
          this.timeline.onReset());
      }),
      (e.prototype.getIdentity = function () {
        var r, n;
        return {
          deviceId:
            (r = this.config) === null || r === void 0 ? void 0 : r.deviceId,
          userId:
            (n = this.config) === null || n === void 0 ? void 0 : n.userId,
          userProperties: this.userProperties,
        };
      }),
      (e.prototype.getOptOut = function () {
        var r;
        return (r = this.config) === null || r === void 0 ? void 0 : r.optOut;
      }),
      (e.prototype.getSessionId = function () {
        var r;
        return (r = this.config) === null || r === void 0
          ? void 0
          : r.sessionId;
      }),
      (e.prototype.setSessionId = function (r) {
        var n,
          i = [];
        if (!this.config)
          return (
            this.q.push(this.setSessionId.bind(this, r)),
            ie(Promise.resolve())
          );
        if (r === this.config.sessionId) return ie(Promise.resolve());
        this.config.loggerProvider.debug("function setSessionId: ", r);
        var o = this.getSessionId();
        o !== r && this.timeline.onSessionIdChanged(r);
        var a = this.config.lastEventTime,
          s = (n = this.config.lastEventId) !== null && n !== void 0 ? n : -1;
        ((this.config.sessionId = r),
          (this.config.lastEventTime = void 0),
          (this.config.pageCounter = 0),
          Hn(this.config.defaultTracking) &&
            (o &&
              a &&
              i.push(
                this.track(zn, void 0, {
                  device_id: this.previousSessionDeviceId,
                  event_id: ++s,
                  session_id: o,
                  time: a + 1,
                  user_id: this.previousSessionUserId,
                }).promise,
              ),
            (this.config.lastEventTime = this.config.sessionId)));
        var u = this.trackCampaignEventIfNeeded(++s, i);
        return (
          this.config.identify &&
            i.push(this.track(Xr(this.config.identify)).promise),
          Hn(this.config.defaultTracking) &&
            i.push(
              this.track(Kn, void 0, {
                event_id: u ? ++s : s,
                session_id: this.config.sessionId,
                time: this.config.lastEventTime,
              }).promise,
            ),
          (this.previousSessionDeviceId = this.config.deviceId),
          (this.previousSessionUserId = this.config.userId),
          ie(Promise.all(i))
        );
      }),
      (e.prototype.extendSession = function () {
        if (!this.config) {
          this.q.push(this.extendSession.bind(this));
          return;
        }
        this.config.lastEventTime = Date.now();
      }),
      (e.prototype.setTransport = function (r) {
        if (!this.config) {
          this.q.push(this.setTransport.bind(this, r));
          return;
        }
        this.config.transportProvider = mo(r);
      }),
      (e.prototype.identify = function (r, n) {
        if (cr(r)) {
          var i = r._q;
          ((r._q = []), (r = ur(new He(), i)));
        }
        return (
          n?.user_id && this.setUserId(n.user_id),
          n?.device_id && this.setDeviceId(n.device_id),
          t.prototype.identify.call(this, r, n)
        );
      }),
      (e.prototype.groupIdentify = function (r, n, i, o) {
        if (cr(i)) {
          var a = i._q;
          ((i._q = []), (i = ur(new He(), a)));
        }
        return t.prototype.groupIdentify.call(this, r, n, i, o);
      }),
      (e.prototype.revenue = function (r, n) {
        if (cr(r)) {
          var i = r._q;
          ((r._q = []), (r = ur(new Ka(), i)));
        }
        return t.prototype.revenue.call(this, r, n);
      }),
      (e.prototype.trackCampaignEventIfNeeded = function (r, n) {
        if (!this.webAttribution || !this.webAttribution.shouldTrackNewCampaign)
          return !1;
        var i = this.webAttribution.generateCampaignEvent(r);
        return (
          n ? n.push(this.track(i).promise) : this.track(i),
          this.config.loggerProvider.log("Tracking attribution."),
          !0
        );
      }),
      (e.prototype.process = function (r) {
        return S(this, void 0, void 0, function () {
          var n, i, o;
          return E(this, function (a) {
            return (
              (n = Date.now()),
              (i = Yi(this.config.sessionTimeout, this.config.lastEventTime)),
              (o =
                this.webAttribution &&
                this.webAttribution.shouldSetSessionIdOnNewCampaign()),
              r.event_type !== Kn &&
                r.event_type !== zn &&
                (!r.session_id || r.session_id === this.getSessionId()) &&
                (i || o
                  ? (this.setSessionId(n),
                    o &&
                      this.config.loggerProvider.log(
                        "Created a new session for new campaign.",
                      ))
                  : i || this.trackCampaignEventIfNeeded()),
              r.event_type === se.IDENTIFY &&
                r.user_properties &&
                (this.userProperties = this.getOperationAppliedUserProperties(
                  r.user_properties,
                )),
              [2, t.prototype.process.call(this, r)]
            );
          });
        });
      }),
      (e.prototype.logBrowserOptions = function (r) {
        try {
          var n = C(C({}, r), {
            apiKey: r.apiKey.substring(0, 10) + "********",
          });
          this.config.loggerProvider.debug(
            "Initialized Amplitude with BrowserConfig:",
            JSON.stringify(n),
          );
        } catch (i) {
          this.config.loggerProvider.error("Error logging browser config", i);
        }
      }),
      (e.prototype._setDiagnosticsSampleRate = function (r) {
        if (!(r > 1 || r < 0) && !this.config) {
          this._diagnosticsSampleRate = r;
          return;
        }
      }),
      e
    );
  })(Wa),
  Pl = function () {
    var t = new _l();
    return {
      init: z(t.init.bind(t), "init", Z(t), ee(t, ["config"])),
      add: z(
        t.add.bind(t),
        "add",
        Z(t),
        ee(t, ["config.apiKey", "timeline.plugins"]),
      ),
      remove: z(
        t.remove.bind(t),
        "remove",
        Z(t),
        ee(t, ["config.apiKey", "timeline.plugins"]),
      ),
      track: z(
        t.track.bind(t),
        "track",
        Z(t),
        ee(t, ["config.apiKey", "timeline.queue.length"]),
      ),
      logEvent: z(
        t.logEvent.bind(t),
        "logEvent",
        Z(t),
        ee(t, ["config.apiKey", "timeline.queue.length"]),
      ),
      identify: z(
        t.identify.bind(t),
        "identify",
        Z(t),
        ee(t, ["config.apiKey", "timeline.queue.length"]),
      ),
      groupIdentify: z(
        t.groupIdentify.bind(t),
        "groupIdentify",
        Z(t),
        ee(t, ["config.apiKey", "timeline.queue.length"]),
      ),
      setGroup: z(
        t.setGroup.bind(t),
        "setGroup",
        Z(t),
        ee(t, ["config.apiKey", "timeline.queue.length"]),
      ),
      revenue: z(
        t.revenue.bind(t),
        "revenue",
        Z(t),
        ee(t, ["config.apiKey", "timeline.queue.length"]),
      ),
      flush: z(
        t.flush.bind(t),
        "flush",
        Z(t),
        ee(t, ["config.apiKey", "timeline.queue.length"]),
      ),
      getUserId: z(
        t.getUserId.bind(t),
        "getUserId",
        Z(t),
        ee(t, ["config", "config.userId"]),
      ),
      setUserId: z(
        t.setUserId.bind(t),
        "setUserId",
        Z(t),
        ee(t, ["config", "config.userId"]),
      ),
      getDeviceId: z(
        t.getDeviceId.bind(t),
        "getDeviceId",
        Z(t),
        ee(t, ["config", "config.deviceId"]),
      ),
      setDeviceId: z(
        t.setDeviceId.bind(t),
        "setDeviceId",
        Z(t),
        ee(t, ["config", "config.deviceId"]),
      ),
      reset: z(
        t.reset.bind(t),
        "reset",
        Z(t),
        ee(t, ["config", "config.userId", "config.deviceId"]),
      ),
      getSessionId: z(
        t.getSessionId.bind(t),
        "getSessionId",
        Z(t),
        ee(t, ["config"]),
      ),
      setSessionId: z(
        t.setSessionId.bind(t),
        "setSessionId",
        Z(t),
        ee(t, ["config"]),
      ),
      extendSession: z(
        t.extendSession.bind(t),
        "extendSession",
        Z(t),
        ee(t, ["config"]),
      ),
      setOptOut: z(t.setOptOut.bind(t), "setOptOut", Z(t), ee(t, ["config"])),
      setTransport: z(
        t.setTransport.bind(t),
        "setTransport",
        Z(t),
        ee(t, ["config"]),
      ),
      getIdentity: z(
        t.getIdentity.bind(t),
        "getIdentity",
        Z(t),
        ee(t, ["config"]),
      ),
      getOptOut: z(t.getOptOut.bind(t), "getOptOut", Z(t), ee(t, ["config"])),
      _setDiagnosticsSampleRate: z(
        t._setDiagnosticsSampleRate.bind(t),
        "_setDiagnosticsSampleRate",
        Z(t),
        ee(t, ["config"]),
      ),
    };
  };
const ve = Pl();
var xt = ve.add,
  Cl = ve.getDeviceId,
  Uo = ve.getSessionId,
  Fo = ve.identify,
  Al = ve.init,
  qo = ve.remove,
  kl = ve.setDeviceId,
  bi = ve.setGroup,
  Rl = ve.setOptOut,
  Ol = ve.setSessionId,
  Bo = ve.setUserId,
  Vo = ve.track,
  jo = "[Amplitude]",
  Ll = "".concat(jo, " Session Replay ID"),
  Dl = 0,
  Nl = pt.US,
  Ml = { enabled: !0 },
  Go = 1e3,
  xl = "".concat(jo, " Session Replay Debug"),
  Ul = "amp-block",
  Ho = "amp-mask",
  Fl = "amp-unmask",
  ql = "https://api-sr.amplitude.com/sessions/v2/track",
  Bl = "https://api-sr.eu.amplitude.com/sessions/v2/track",
  Vl = "https://api-sr.stag2.amplitude.com/sessions/v2/track",
  jl = 1 * 1e6,
  Gl = 3e4,
  Hl = 6e4,
  Wl = 500,
  Kl = 10 * 1e3,
  Wo = 1024,
  zl = 1e3,
  _e;
(function (t) {
  ((t.GET_SR_PROPS = "get-sr-props"),
    (t.DEBUG_INFO = "debug-info"),
    (t.FETCH_REQUEST = "fetch-request"),
    (t.METADATA = "metadata"),
    (t.TARGETING_DECISION = "targeting-decision"));
})(_e || (_e = {}));
var xr = (function () {
    function t(e) {
      ((this.logger = e),
        (this.log = this.getSafeMethod("log")),
        (this.warn = this.getSafeMethod("warn")),
        (this.error = this.getSafeMethod("error")),
        (this.debug = this.getSafeMethod("debug")));
    }
    return (
      (t.prototype.getSafeMethod = function (e) {
        var r;
        if (!this.logger) return function () {};
        var n = this.logger[e];
        if (typeof n == "function") {
          var i = (r = n.__rrweb_original__) !== null && r !== void 0 ? r : n;
          return i.bind(this.logger);
        }
        return function () {};
      }),
      (t.prototype.enable = function (e) {
        this.logger.enable(e);
      }),
      (t.prototype.disable = function () {
        this.logger.disable();
      }),
      t
    );
  })(),
  Ur = "medium";
function $l(t) {
  return t.toLowerCase();
}
function Xl(t) {
  var e = t.type;
  return t.hasAttribute("data-rr-is-password") ? "password" : e ? $l(e) : null;
}
var Ko = function (t, e, r) {
    switch (e) {
      case "light": {
        if (t !== "input") return !0;
        var n = r ? Xl(r) : "";
        return n
          ? !!(
              ["password", "hidden", "email", "tel"].includes(n) ||
              r.autocomplete.startsWith("cc-")
            )
          : !1;
      }
      case "medium":
      case "conservative":
        return !0;
      default:
        return Ko(t, Ur, r);
    }
  },
  Yl = function (t, e, r) {
    var n, i, o;
    if ((e === void 0 && (e = { defaultMaskLevel: Ur }), r)) {
      if (r.closest("." + Ho)) return !0;
      var a = ((n = e.maskSelector) !== null && n !== void 0 ? n : []).some(
        function (u) {
          return r.closest(u);
        },
      );
      if (a) return !0;
      if (r.closest("." + Fl)) return !1;
      var s = ((i = e.unmaskSelector) !== null && i !== void 0 ? i : []).some(
        function (u) {
          return r.closest(u);
        },
      );
      if (s) return !1;
    }
    return Ko(t, (o = e.defaultMaskLevel) !== null && o !== void 0 ? o : Ur, r);
  },
  Ei = function (t, e) {
    return function (r, n) {
      return Yl(t, e, n) ? r.replace(/[^\s]/g, "*") : r;
    };
  },
  Jl = function () {
    var t = B();
    return t?.location ? t.location.href : "";
  },
  Ql = function (t, e) {
    return "".concat(e, "/").concat(t);
  },
  zo = function (t, e) {
    return e || (t === pt.STAGING ? Vl : t === pt.EU ? Bl : ql);
  },
  Zl = function (t) {
    if (typeof t != "string" || t.trim() === "") return !1;
    var e = /^\/|^https?:\/\/[^\s]+$/;
    return !!e.test(t);
  },
  ed = function (t) {
    var e = t
      .replace(/[.+^${}()|[\]\\]/g, "\\$&")
      .replace(/\*/g, ".*")
      .replace(/\?/g, ".");
    return new RegExp("^".concat(e, "$"));
  },
  td = function (t) {
    if (
      !t.every(function (e) {
        return (
          typeof e.selector == "string" && typeof e.replacement == "string"
        );
      })
    )
      throw new Error(
        "ugcFilterRules must be an array of objects with selector and replacement properties",
      );
    if (
      !t.every(function (e) {
        return Zl(e.selector);
      })
    )
      throw new Error(
        "ugcFilterRules must be an array of objects with valid globs",
      );
  },
  rr = function (t, e) {
    var r, n;
    try {
      for (var i = x(e), o = i.next(); !o.done; o = i.next()) {
        var a = o.value,
          s = ed(a.selector);
        if (s.test(t)) return t.replace(s, a.replacement);
      }
    } catch (u) {
      r = { error: u };
    } finally {
      try {
        o && !o.done && (n = i.return) && n.call(i);
      } finally {
        if (r) throw r.error;
      }
    }
    return t;
  },
  $o = function () {
    return S(void 0, void 0, void 0, function () {
      var t, e, r, n, i, o, a;
      return E(this, function (s) {
        switch (s.label) {
          case 0:
            return (
              s.trys.push([0, 3, , 4]),
              (t = B()),
              t ? [4, t.navigator.storage.estimate()] : [3, 2]
            );
          case 1:
            return (
              (e = s.sent()),
              (r = e.usage),
              (n = e.quota),
              (i = e.usageDetails),
              (o = r ? Math.round(r / Wo) : 0),
              (a =
                r && n ? Math.round((r / n + Number.EPSILON) * 1e3) / 1e3 : 0),
              [
                2,
                {
                  totalStorageSize: o,
                  percentOfQuota: a,
                  usageDetails: JSON.stringify(i),
                },
              ]
            );
          case 2:
            return [3, 4];
          case 3:
            return (s.sent(), [3, 4]);
          case 4:
            return [
              2,
              { totalStorageSize: 0, percentOfQuota: 0, usageDetails: "" },
            ];
        }
      });
    });
  },
  Xo = function (t) {
    var e = C({}, t),
      r = e.apiKey;
    return ((e.apiKey = "****".concat(r.substring(r.length - 4))), e);
  },
  Yo = function () {
    return {
      flushMaxRetries: 2,
      logLevel: ae.Warn,
      loggerProvider: new gt(),
      transportProvider: new Qi(),
    };
  },
  rd = (function (t) {
    be(e, t);
    function e(r, n) {
      var i = this,
        o,
        a,
        s,
        u,
        c,
        l,
        f = Yo();
      if (
        ((i =
          t.call(
            this,
            C(
              C(
                {
                  transportProvider: f.transportProvider,
                  loggerProvider: new xr(n.loggerProvider || f.loggerProvider),
                },
                n,
              ),
              { apiKey: r },
            ),
          ) || this),
        (i.flushMaxRetries =
          n.flushMaxRetries !== void 0 && n.flushMaxRetries <= f.flushMaxRetries
            ? n.flushMaxRetries
            : f.flushMaxRetries),
        (i.apiKey = r),
        (i.sampleRate = n.sampleRate || Dl),
        (i.serverZone = n.serverZone || Nl),
        (i.configServerUrl = n.configServerUrl),
        (i.trackServerUrl = n.trackServerUrl),
        (i.shouldInlineStylesheet = n.shouldInlineStylesheet),
        (i.version = n.version),
        (i.performanceConfig = n.performanceConfig || Ml),
        (i.storeType = (o = n.storeType) !== null && o !== void 0 ? o : "idb"),
        (i.applyBackgroundColorToBlockedElements =
          (a = n.applyBackgroundColorToBlockedElements) !== null && a !== void 0
            ? a
            : !1),
        (i.enableUrlChangePolling =
          (s = n.enableUrlChangePolling) !== null && s !== void 0 ? s : !1),
        (i.urlChangePollingInterval =
          (u = n.urlChangePollingInterval) !== null && u !== void 0 ? u : Go),
        (i.captureDocumentTitle =
          (c = n.captureDocumentTitle) !== null && c !== void 0 ? c : !1),
        n.privacyConfig && (i.privacyConfig = n.privacyConfig),
        n.interactionConfig &&
          ((i.interactionConfig = n.interactionConfig),
          i.interactionConfig.ugcFilterRules &&
            td(i.interactionConfig.ugcFilterRules)),
        n.debugMode && (i.debugMode = n.debugMode),
        n.useWebWorker !== void 0)
      )
        i.useWebWorker = n.useWebWorker;
      else {
        var d = n;
        ((l = d.experimental) === null || l === void 0
          ? void 0
          : l.useWebWorker) !== void 0 &&
          (i.useWebWorker = d.experimental.useWebWorker);
      }
      return (n.omitElementTags && (i.omitElementTags = n.omitElementTags), i);
    }
    return e;
  })(zi),
  Jo = ((t) => (
    (t[(t.DomContentLoaded = 0)] = "DomContentLoaded"),
    (t[(t.Load = 1)] = "Load"),
    (t[(t.FullSnapshot = 2)] = "FullSnapshot"),
    (t[(t.IncrementalSnapshot = 3)] = "IncrementalSnapshot"),
    (t[(t.Meta = 4)] = "Meta"),
    (t[(t.Custom = 5)] = "Custom"),
    (t[(t.Plugin = 6)] = "Plugin"),
    t
  ))(Jo || {}),
  Qo = ((t) => (
    (t[(t.MouseUp = 0)] = "MouseUp"),
    (t[(t.MouseDown = 1)] = "MouseDown"),
    (t[(t.Click = 2)] = "Click"),
    (t[(t.ContextMenu = 3)] = "ContextMenu"),
    (t[(t.DblClick = 4)] = "DblClick"),
    (t[(t.Focus = 5)] = "Focus"),
    (t[(t.Blur = 6)] = "Blur"),
    (t[(t.TouchStart = 7)] = "TouchStart"),
    (t[(t.TouchMove_Departed = 8)] = "TouchMove_Departed"),
    (t[(t.TouchEnd = 9)] = "TouchEnd"),
    (t[(t.TouchCancel = 10)] = "TouchCancel"),
    t
  ))(Qo || {}),
  nd = function (t, e) {
    var r = document.createDocumentFragment(),
      n = function (i) {
        if (
          (i === void 0 && (i = []),
          typeof i == "string" && (i = [i]),
          (i = i.filter(function (o) {
            try {
              r.querySelector(o);
            } catch {
              return (
                e.warn(
                  '[session-replay-browser] omitting selector "'.concat(
                    o,
                    '" because it is invalid',
                  ),
                ),
                !1
              );
            }
            return !0;
          })),
          i.length !== 0)
        )
          return i;
      };
    return (
      (t.blockSelector = n(t.blockSelector)),
      (t.maskSelector = n(t.maskSelector)),
      (t.unmaskSelector = n(t.unmaskSelector)),
      t
    );
  },
  id = (function () {
    function t(e, r) {
      ((this.localConfig = r), (this.remoteConfigClient = e));
    }
    return (
      (t.prototype.generateJoinedConfig = function () {
        var e, r, n;
        return S(this, void 0, void 0, function () {
          var i,
            o,
            a,
            s,
            u,
            c,
            l,
            f,
            d,
            v,
            h,
            m,
            y,
            p,
            g,
            b,
            T,
            w = this;
          return E(this, function (I) {
            switch (I.label) {
              case 0:
                ((i = C({}, this.localConfig)),
                  (i.optOut = this.localConfig.optOut),
                  (i.captureEnabled = !0),
                  (I.label = 1));
              case 1:
                return (
                  I.trys.push([1, 3, , 4]),
                  [
                    4,
                    new Promise(function (_, P) {
                      w.remoteConfigClient.subscribe(
                        "configs.sessionReplay",
                        "all",
                        function (k, A) {
                          var R;
                          if (
                            (w.localConfig.loggerProvider.debug(
                              "Session Replay remote configuration received from ".concat(
                                A,
                                ":",
                              ),
                              JSON.stringify(k, null, 2),
                            ),
                            !k)
                          ) {
                            P(new Error("No remote config received"));
                            return;
                          }
                          var O = k,
                            G = O.sr_sampling_config,
                            F = O.sr_privacy_config,
                            N = O.sr_targeting_config,
                            U =
                              (R = i.interactionConfig) === null || R === void 0
                                ? void 0
                                : R.ugcFilterRules;
                          ((i.interactionConfig = O.sr_interaction_config),
                            i.interactionConfig &&
                              U &&
                              (i.interactionConfig.ugcFilterRules = U),
                            (i.loggingConfig = O.sr_logging_config),
                            (G || F || N) &&
                              ((o = {}),
                              G && (o.sr_sampling_config = G),
                              F && (o.sr_privacy_config = F),
                              N && (o.sr_targeting_config = N)),
                            _());
                        },
                      );
                    }),
                  ]
                );
              case 2:
                return (I.sent(), [3, 4]);
              case 3:
                return (
                  (a = I.sent()),
                  this.localConfig.loggerProvider.error(
                    "Failed to generate joined config: ",
                    a,
                  ),
                  (i.captureEnabled = !1),
                  [
                    2,
                    {
                      localConfig: this.localConfig,
                      joinedConfig: i,
                      remoteConfig: void 0,
                    },
                  ]
                );
              case 4:
                if (!o)
                  return [
                    2,
                    {
                      localConfig: this.localConfig,
                      joinedConfig: i,
                      remoteConfig: o,
                    },
                  ];
                if (
                  ((s = o.sr_sampling_config),
                  (u = o.sr_privacy_config),
                  (c = o.sr_targeting_config),
                  s && Object.keys(s).length > 0
                    ? (Object.prototype.hasOwnProperty.call(
                        s,
                        "capture_enabled",
                      )
                        ? (i.captureEnabled = s.capture_enabled)
                        : (i.captureEnabled = !1),
                      Object.prototype.hasOwnProperty.call(s, "sample_rate") &&
                        (i.sampleRate = s.sample_rate))
                    : ((i.captureEnabled = !0),
                      this.localConfig.loggerProvider.debug(
                        "Remote config successfully fetched, but no values set for project, Session Replay capture enabled.",
                      )),
                  u)
                ) {
                  ((l =
                    (e = i.privacyConfig) !== null && e !== void 0 ? e : {}),
                    (f = {
                      defaultMaskLevel:
                        (n =
                          (r = u.defaultMaskLevel) !== null && r !== void 0
                            ? r
                            : l.defaultMaskLevel) !== null && n !== void 0
                          ? n
                          : "medium",
                      blockSelector: [],
                      maskSelector: [],
                      unmaskSelector: [],
                    }),
                    (d = function (_) {
                      var P,
                        k,
                        A,
                        R,
                        O,
                        G,
                        F,
                        N,
                        U,
                        q = {};
                      typeof _.blockSelector == "string" &&
                        (_.blockSelector = [_.blockSelector]);
                      try {
                        for (
                          var j = x(
                              (F = _.blockSelector) !== null && F !== void 0
                                ? F
                                : [],
                            ),
                            $ = j.next();
                          !$.done;
                          $ = j.next()
                        ) {
                          var ne = $.value;
                          q[ne] = "block";
                        }
                      } catch (K) {
                        P = { error: K };
                      } finally {
                        try {
                          $ && !$.done && (k = j.return) && k.call(j);
                        } finally {
                          if (P) throw P.error;
                        }
                      }
                      try {
                        for (
                          var Y = x(
                              (N = _.maskSelector) !== null && N !== void 0
                                ? N
                                : [],
                            ),
                            re = Y.next();
                          !re.done;
                          re = Y.next()
                        ) {
                          var ne = re.value;
                          q[ne] = "mask";
                        }
                      } catch (K) {
                        A = { error: K };
                      } finally {
                        try {
                          re && !re.done && (R = Y.return) && R.call(Y);
                        } finally {
                          if (A) throw A.error;
                        }
                      }
                      try {
                        for (
                          var X = x(
                              (U = _.unmaskSelector) !== null && U !== void 0
                                ? U
                                : [],
                            ),
                            H = X.next();
                          !H.done;
                          H = X.next()
                        ) {
                          var ne = H.value;
                          q[ne] = "unmask";
                        }
                      } catch (K) {
                        O = { error: K };
                      } finally {
                        try {
                          H && !H.done && (G = X.return) && G.call(X);
                        } finally {
                          if (O) throw O.error;
                        }
                      }
                      return q;
                    }),
                    (v = C(C({}, d(l)), d(u))));
                  try {
                    for (
                      h = x(Object.entries(v)), m = h.next();
                      !m.done;
                      m = h.next()
                    )
                      ((y = L(m.value, 2)),
                        (p = y[0]),
                        (g = y[1]),
                        g === "mask"
                          ? f.maskSelector.push(p)
                          : g === "block"
                            ? f.blockSelector.push(p)
                            : g === "unmask" && f.unmaskSelector.push(p));
                  } catch (_) {
                    b = { error: _ };
                  } finally {
                    try {
                      m && !m.done && (T = h.return) && T.call(h);
                    } finally {
                      if (b) throw b.error;
                    }
                  }
                  i.privacyConfig = nd(f, this.localConfig.loggerProvider);
                }
                return (
                  c && Object.keys(c).length > 0 && (i.targetingConfig = c),
                  this.localConfig.loggerProvider.debug(
                    JSON.stringify(
                      { name: "session replay joined config", config: Xo(i) },
                      null,
                      2,
                    ),
                  ),
                  [
                    2,
                    {
                      localConfig: this.localConfig,
                      joinedConfig: i,
                      remoteConfig: o,
                    },
                  ]
                );
            }
          });
        });
      }),
      t
    );
  })(),
  od = function (t, e) {
    return S(void 0, void 0, void 0, function () {
      var r, n;
      return E(this, function (i) {
        return (
          (r = new rd(t, e)),
          (n = new Zi(t, r.loggerProvider, r.serverZone, e.configServerUrl)),
          [2, new id(n, r)]
        );
      });
    });
  },
  ce = Uint8Array,
  oe = Uint16Array,
  mt = Uint32Array,
  hn = new ce([
    0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5,
    5, 5, 5, 0, 0, 0, 0,
  ]),
  gn = new ce([
    0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10,
    11, 11, 12, 12, 13, 13, 0, 0,
  ]),
  Si = new ce([
    16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15,
  ]),
  Zo = function (t, e) {
    for (var r = new oe(31), n = 0; n < 31; ++n) r[n] = e += 1 << t[n - 1];
    for (var i = new mt(r[30]), n = 1; n < 30; ++n)
      for (var o = r[n]; o < r[n + 1]; ++o) i[o] = ((o - r[n]) << 5) | n;
    return [r, i];
  },
  ea = Zo(hn, 2),
  ad = ea[0],
  Fr = ea[1];
((ad[28] = 258), (Fr[258] = 28));
var sd = Zo(gn, 0),
  Ti = sd[1],
  qr = new oe(32768);
for (var Q = 0; Q < 32768; ++Q) {
  var we = ((Q & 43690) >>> 1) | ((Q & 21845) << 1);
  ((we = ((we & 52428) >>> 2) | ((we & 13107) << 2)),
    (we = ((we & 61680) >>> 4) | ((we & 3855) << 4)),
    (qr[Q] = (((we & 65280) >>> 8) | ((we & 255) << 8)) >>> 1));
}
var dt = function (t, e, r) {
    for (var n = t.length, i = 0, o = new oe(e); i < n; ++i) ++o[t[i] - 1];
    var a = new oe(e);
    for (i = 0; i < e; ++i) a[i] = (a[i - 1] + o[i - 1]) << 1;
    var s;
    if (r) {
      s = new oe(1 << e);
      var u = 15 - e;
      for (i = 0; i < n; ++i)
        if (t[i])
          for (
            var c = (i << 4) | t[i],
              l = e - t[i],
              f = a[t[i] - 1]++ << l,
              d = f | ((1 << l) - 1);
            f <= d;
            ++f
          )
            s[qr[f] >>> u] = c;
    } else
      for (s = new oe(n), i = 0; i < n; ++i)
        s[i] = qr[a[t[i] - 1]++] >>> (15 - t[i]);
    return s;
  },
  Me = new ce(288);
for (var Q = 0; Q < 144; ++Q) Me[Q] = 8;
for (var Q = 144; Q < 256; ++Q) Me[Q] = 9;
for (var Q = 256; Q < 280; ++Q) Me[Q] = 7;
for (var Q = 280; Q < 288; ++Q) Me[Q] = 8;
var zt = new ce(32);
for (var Q = 0; Q < 32; ++Q) zt[Q] = 5;
var ud = dt(Me, 9, 0),
  cd = dt(zt, 5, 0),
  ta = function (t) {
    return ((t / 8) >> 0) + (t & 7 && 1);
  },
  ra = function (t, e, r) {
    (r == null || r > t.length) && (r = t.length);
    var n = new (t instanceof oe ? oe : t instanceof mt ? mt : ce)(r - e);
    return (n.set(t.subarray(e, r)), n);
  },
  Ee = function (t, e, r) {
    r <<= e & 7;
    var n = (e / 8) >> 0;
    ((t[n] |= r), (t[n + 1] |= r >>> 8));
  },
  rt = function (t, e, r) {
    r <<= e & 7;
    var n = (e / 8) >> 0;
    ((t[n] |= r), (t[n + 1] |= r >>> 8), (t[n + 2] |= r >>> 16));
  },
  pr = function (t, e) {
    for (var r = [], n = 0; n < t.length; ++n)
      t[n] && r.push({ s: n, f: t[n] });
    var i = r.length,
      o = r.slice();
    if (!i) return [new ce(0), 0];
    if (i == 1) {
      var a = new ce(r[0].s + 1);
      return ((a[r[0].s] = 1), [a, 1]);
    }
    (r.sort(function (w, I) {
      return w.f - I.f;
    }),
      r.push({ s: -1, f: 25001 }));
    var s = r[0],
      u = r[1],
      c = 0,
      l = 1,
      f = 2;
    for (r[0] = { s: -1, f: s.f + u.f, l: s, r: u }; l != i - 1; )
      ((s = r[r[c].f < r[f].f ? c++ : f++]),
        (u = r[c != l && r[c].f < r[f].f ? c++ : f++]),
        (r[l++] = { s: -1, f: s.f + u.f, l: s, r: u }));
    for (var d = o[0].s, n = 1; n < i; ++n) o[n].s > d && (d = o[n].s);
    var v = new oe(d + 1),
      h = Br(r[l - 1], v, 0);
    if (h > e) {
      var n = 0,
        m = 0,
        y = h - e,
        p = 1 << y;
      for (
        o.sort(function (I, _) {
          return v[_.s] - v[I.s] || I.f - _.f;
        });
        n < i;
        ++n
      ) {
        var g = o[n].s;
        if (v[g] > e) ((m += p - (1 << (h - v[g]))), (v[g] = e));
        else break;
      }
      for (m >>>= y; m > 0; ) {
        var b = o[n].s;
        v[b] < e ? (m -= 1 << (e - v[b]++ - 1)) : ++n;
      }
      for (; n >= 0 && m; --n) {
        var T = o[n].s;
        v[T] == e && (--v[T], ++m);
      }
      h = e;
    }
    return [new ce(v), h];
  },
  Br = function (t, e, r) {
    return t.s == -1
      ? Math.max(Br(t.l, e, r + 1), Br(t.r, e, r + 1))
      : (e[t.s] = r);
  },
  wi = function (t) {
    for (var e = t.length; e && !t[--e]; );
    for (
      var r = new oe(++e),
        n = 0,
        i = t[0],
        o = 1,
        a = function (u) {
          r[n++] = u;
        },
        s = 1;
      s <= e;
      ++s
    )
      if (t[s] == i && s != e) ++o;
      else {
        if (!i && o > 2) {
          for (; o > 138; o -= 138) a(32754);
          o > 2 &&
            (a(o > 10 ? ((o - 11) << 5) | 28690 : ((o - 3) << 5) | 12305),
            (o = 0));
        } else if (o > 3) {
          for (a(i), --o; o > 6; o -= 6) a(8304);
          o > 2 && (a(((o - 3) << 5) | 8208), (o = 0));
        }
        for (; o--; ) a(i);
        ((o = 1), (i = t[s]));
      }
    return [r.subarray(0, n), e];
  },
  nt = function (t, e) {
    for (var r = 0, n = 0; n < e.length; ++n) r += t[n] * e[n];
    return r;
  },
  Vr = function (t, e, r) {
    var n = r.length,
      i = ta(e + 2);
    ((t[i] = n & 255),
      (t[i + 1] = n >>> 8),
      (t[i + 2] = t[i] ^ 255),
      (t[i + 3] = t[i + 1] ^ 255));
    for (var o = 0; o < n; ++o) t[i + o + 4] = r[o];
    return (i + 4 + n) * 8;
  },
  Ii = function (t, e, r, n, i, o, a, s, u, c, l) {
    (Ee(e, l++, r), ++i[256]);
    for (
      var f = pr(i, 15),
        d = f[0],
        v = f[1],
        h = pr(o, 15),
        m = h[0],
        y = h[1],
        p = wi(d),
        g = p[0],
        b = p[1],
        T = wi(m),
        w = T[0],
        I = T[1],
        _ = new oe(19),
        P = 0;
      P < g.length;
      ++P
    )
      _[g[P] & 31]++;
    for (var P = 0; P < w.length; ++P) _[w[P] & 31]++;
    for (
      var k = pr(_, 7), A = k[0], R = k[1], O = 19;
      O > 4 && !A[Si[O - 1]];
      --O
    );
    var G = (c + 5) << 3,
      F = nt(i, Me) + nt(o, zt) + a,
      N =
        nt(i, d) +
        nt(o, m) +
        a +
        14 +
        3 * O +
        nt(_, A) +
        (2 * _[16] + 3 * _[17] + 7 * _[18]);
    if (G <= F && G <= N) return Vr(e, l, t.subarray(u, u + c));
    var U, q, j, $;
    if ((Ee(e, l, 1 + (N < F)), (l += 2), N < F)) {
      ((U = dt(d, v, 0)), (q = d), (j = dt(m, y, 0)), ($ = m));
      var ne = dt(A, R, 0);
      (Ee(e, l, b - 257), Ee(e, l + 5, I - 1), Ee(e, l + 10, O - 4), (l += 14));
      for (var P = 0; P < O; ++P) Ee(e, l + 3 * P, A[Si[P]]);
      l += 3 * O;
      for (var Y = [g, w], re = 0; re < 2; ++re)
        for (var X = Y[re], P = 0; P < X.length; ++P) {
          var H = X[P] & 31;
          (Ee(e, l, ne[H]),
            (l += A[H]),
            H > 15 && (Ee(e, l, (X[P] >>> 5) & 127), (l += X[P] >>> 12)));
        }
    } else ((U = ud), (q = Me), (j = cd), ($ = zt));
    for (var P = 0; P < s; ++P)
      if (n[P] > 255) {
        var H = (n[P] >>> 18) & 31;
        (rt(e, l, U[H + 257]),
          (l += q[H + 257]),
          H > 7 && (Ee(e, l, (n[P] >>> 23) & 31), (l += hn[H])));
        var K = n[P] & 31;
        (rt(e, l, j[K]),
          (l += $[K]),
          K > 3 && (rt(e, l, (n[P] >>> 5) & 8191), (l += gn[K])));
      } else (rt(e, l, U[n[P]]), (l += q[n[P]]));
    return (rt(e, l, U[256]), l + q[256]);
  },
  ld = new mt([
    65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632,
  ]),
  dd = function (t, e, r, n, i, o) {
    var a = t.length,
      s = new ce(n + a + 5 * (1 + Math.floor(a / 7e3)) + i),
      u = s.subarray(n, s.length - i),
      c = 0;
    if (!e || a < 8)
      for (var l = 0; l <= a; l += 65535) {
        var f = l + 65535;
        f < a
          ? (c = Vr(u, c, t.subarray(l, f)))
          : ((u[l] = o), (c = Vr(u, c, t.subarray(l, a))));
      }
    else {
      for (
        var d = ld[e - 1],
          v = d >>> 13,
          h = d & 8191,
          m = (1 << r) - 1,
          y = new oe(32768),
          p = new oe(m + 1),
          g = Math.ceil(r / 3),
          b = 2 * g,
          T = function (or) {
            return (t[or] ^ (t[or + 1] << g) ^ (t[or + 2] << b)) & m;
          },
          w = new mt(25e3),
          I = new oe(288),
          _ = new oe(32),
          P = 0,
          k = 0,
          l = 0,
          A = 0,
          R = 0,
          O = 0;
        l < a;
        ++l
      ) {
        var G = T(l),
          F = l & 32767,
          N = p[G];
        if (((y[F] = N), (p[G] = F), R <= l)) {
          var U = a - l;
          if ((P > 7e3 || A > 24576) && U > 423) {
            ((c = Ii(t, u, 0, w, I, _, k, A, O, l - O, c)),
              (A = P = k = 0),
              (O = l));
            for (var q = 0; q < 286; ++q) I[q] = 0;
            for (var q = 0; q < 30; ++q) _[q] = 0;
          }
          var j = 2,
            $ = 0,
            ne = h,
            Y = (F - N) & 32767;
          if (U > 2 && G == T(l - Y))
            for (
              var re = Math.min(v, U) - 1,
                X = Math.min(32767, l),
                H = Math.min(258, U);
              Y <= X && --ne && F != N;
            ) {
              if (t[l + j] == t[l + j - Y]) {
                for (var K = 0; K < H && t[l + K] == t[l + K - Y]; ++K);
                if (K > j) {
                  if (((j = K), ($ = Y), K > re)) break;
                  for (var D = Math.min(Y, K - 2), ue = 0, q = 0; q < D; ++q) {
                    var Oe = (l - Y + q + 32768) & 32767,
                      Ye = y[Oe],
                      Ue = (Oe - Ye + 32768) & 32767;
                    Ue > ue && ((ue = Ue), (N = Oe));
                  }
                }
              }
              ((F = N), (N = y[F]), (Y += (F - N + 32768) & 32767));
            }
          if ($) {
            w[A++] = 268435456 | (Fr[j] << 18) | Ti[$];
            var Fe = Fr[j] & 31,
              ge = Ti[$] & 31;
            ((k += hn[Fe] + gn[ge]), ++I[257 + Fe], ++_[ge], (R = l + j), ++P);
          } else ((w[A++] = t[l]), ++I[t[l]]);
        }
      }
      c = Ii(t, u, o, w, I, _, k, A, O, l - O, c);
    }
    return ra(s, 0, n + ta(c) + i);
  },
  fd = function () {
    var t = 1,
      e = 0;
    return {
      p: function (r) {
        for (var n = t, i = e, o = r.length, a = 0; a != o; ) {
          for (var s = Math.min(a + 5552, o); a < s; ++a)
            ((n += r[a]), (i += n));
          ((n %= 65521), (i %= 65521));
        }
        ((t = n), (e = i));
      },
      d: function () {
        return (
          (((t >>> 8) << 16) | ((e & 255) << 8) | (e >>> 8)) +
          ((t & 255) << 23) * 2
        );
      },
    };
  },
  vd = function (t, e, r, n, i) {
    return dd(
      t,
      e.level == null ? 6 : e.level,
      e.mem == null
        ? Math.ceil(Math.max(8, Math.min(13, Math.log(t.length))) * 1.5)
        : 12 + e.mem,
      r,
      n,
      !0,
    );
  },
  hd = function (t, e, r) {
    for (; r; ++e) ((t[e] = r), (r >>>= 8));
  },
  gd = function (t, e) {
    var r = e.level,
      n = r == 0 ? 0 : r < 6 ? 1 : r == 9 ? 3 : 2;
    ((t[0] = 120), (t[1] = (n << 6) | (n ? 32 - 2 * n : 1)));
  };
function pd(t, e) {
  e === void 0 && (e = {});
  var r = fd();
  r.p(t);
  var n = vd(t, e, 2, 4);
  return (gd(n, e), hd(n, n.length - 4, r.d()), n);
}
function md(t, e) {
  var r = t.length;
  if (typeof TextEncoder < "u") return new TextEncoder().encode(t);
  for (
    var n = new ce(t.length + (t.length >>> 1)),
      i = 0,
      o = function (c) {
        n[i++] = c;
      },
      a = 0;
    a < r;
    ++a
  ) {
    if (i + 5 > n.length) {
      var s = new ce(i + 8 + ((r - a) << 1));
      (s.set(n), (n = s));
    }
    var u = t.charCodeAt(a);
    u < 128 || e
      ? o(u)
      : u < 2048
        ? (o(192 | (u >>> 6)), o(128 | (u & 63)))
        : u > 55295 && u < 57344
          ? ((u = (65536 + (u & 1047552)) | (t.charCodeAt(++a) & 1023)),
            o(240 | (u >>> 18)),
            o(128 | ((u >>> 12) & 63)),
            o(128 | ((u >>> 6) & 63)),
            o(128 | (u & 63)))
          : (o(224 | (u >>> 12)), o(128 | ((u >>> 6) & 63)), o(128 | (u & 63)));
  }
  return ra(n, 0, i);
}
function yd(t, e) {
  for (var r = "", n = 0; n < t.length; ) {
    var i = t[n++];
    r += String.fromCharCode(i);
  }
  return r;
}
const bd = "v1",
  Ed = (t) => {
    const e = { ...t, v: bd };
    return yd(pd(md(JSON.stringify(e))));
  };
var Sd = 2e3,
  Td = (function () {
    function t(e, r, n, i) {
      var o = this,
        a;
      ((this.taskQueue = []),
        (this.isProcessing = !1),
        (this.compressEvent = function (c) {
          var l = Ed(c);
          return JSON.stringify(l);
        }),
        (this.addCompressedEventToManager = function (c, l) {
          o.eventsManager &&
            o.deviceId &&
            o.eventsManager.addEvent({
              event: { type: "replay", data: c },
              sessionId: l,
              deviceId: o.deviceId,
            });
        }),
        (this.addCompressedEvent = function (c, l) {
          if (o.worker)
            try {
              o.worker.postMessage({ event: c, sessionId: l });
            } catch (d) {
              d.name === "DataCloneError"
                ? o.worker.postMessage(
                    JSON.stringify({ event: c, sessionId: l }),
                  )
                : o.config.loggerProvider.warn(
                    "Unexpected error while posting message to worker:",
                    d,
                  );
            }
          else {
            var f = o.compressEvent(c);
            o.addCompressedEventToManager(f, l);
          }
        }),
        (this.terminate = function () {
          var c;
          (c = o.worker) === null || c === void 0 || c.terminate();
        }));
      var s = B();
      if (
        ((this.canUseIdleCallback = s && "requestIdleCallback" in s),
        (this.eventsManager = e),
        (this.config = r),
        (this.deviceId = n),
        (this.timeout =
          ((a = r.performanceConfig) === null || a === void 0
            ? void 0
            : a.timeout) || Sd),
        i)
      ) {
        r.loggerProvider.log("Enabling web worker for compression");
        var u = new Worker(
          URL.createObjectURL(
            new Blob([i], { type: "application/javascript" }),
          ),
        );
        ((u.onerror = function (c) {
          r.loggerProvider.error(c);
        }),
          (u.onmessage = function (c) {
            var l = c.data,
              f = l.compressedEvent,
              d = l.sessionId;
            o.addCompressedEventToManager(f, d);
          }),
          (this.worker = u));
      }
    }
    return (
      (t.prototype.scheduleIdleProcessing = function () {
        var e = this;
        this.isProcessing ||
          ((this.isProcessing = !0),
          requestIdleCallback(
            function (r) {
              e.processQueue(r);
            },
            { timeout: this.timeout },
          ));
      }),
      (t.prototype.enqueueEvent = function (e, r) {
        var n;
        this.canUseIdleCallback &&
        !((n = this.config.performanceConfig) === null || n === void 0) &&
        n.enabled
          ? (this.config.loggerProvider.debug(
              "Enqueuing event for processing during idle time.",
            ),
            this.taskQueue.push({ event: e, sessionId: r }),
            this.scheduleIdleProcessing())
          : (this.config.loggerProvider.debug(
              "Processing event without idle callback.",
            ),
            this.addCompressedEvent(e, r));
      }),
      (t.prototype.processQueue = function (e) {
        for (
          var r = this;
          this.taskQueue.length > 0 && (e.timeRemaining() > 0 || e.didTimeout);
        ) {
          var n = this.taskQueue.shift();
          if (n) {
            var i = n.event,
              o = n.sessionId;
            this.addCompressedEvent(i, o);
          }
        }
        this.taskQueue.length > 0
          ? requestIdleCallback(
              function (a) {
                r.processQueue(a);
              },
              { timeout: this.timeout },
            )
          : (this.isProcessing = !1);
      }),
      t
    );
  })(),
  wd = "Unexpected error occurred",
  Id = "Network error occurred, event batch rejected",
  _d = "Session replay event batch rejected due to exceeded retry count",
  Ve = "Failed to store session replay events in IndexedDB",
  Pd = "Session replay event batch not sent due to missing device ID",
  Cd = "Session replay event batch not sent due to missing api key",
  jr = "1.30.4",
  Ad = (function () {
    function t(e) {
      var r = e.trackServerUrl,
        n = e.loggerProvider,
        i = e.payloadBatcher;
      ((this.storageKey = ""),
        (this.retryTimeout = 1e3),
        (this.scheduled = null),
        (this.queue = []),
        (this.loggerProvider = n),
        (this.payloadBatcher =
          i ||
          function (o) {
            return o;
          }),
        (this.trackServerUrl = r));
    }
    return (
      (t.prototype.sendEventsList = function (e) {
        this.addToQueue(C(C({}, e), { attempts: 0, timeout: 0 }));
      }),
      (t.prototype.addToQueue = function () {
        for (var e = this, r = [], n = 0; n < arguments.length; n++)
          r[n] = arguments[n];
        var i = r.filter(function (o) {
          return o.attempts < (o.flushMaxRetries || 0)
            ? ((o.attempts += 1), !0)
            : (e.completeRequest({ context: o, err: _d }), !1);
        });
        i.forEach(function (o) {
          if (((e.queue = e.queue.concat(o)), o.timeout === 0)) {
            e.schedule(0);
            return;
          }
          setTimeout(function () {
            ((o.timeout = 0), e.schedule(0));
          }, o.timeout);
        });
      }),
      (t.prototype.schedule = function (e) {
        var r = this;
        this.scheduled ||
          (this.scheduled = setTimeout(function () {
            r.flush(!0).then(function () {
              r.queue.length > 0 && r.schedule(e);
            });
          }, e));
      }),
      (t.prototype.flush = function (e) {
        return (
          e === void 0 && (e = !1),
          S(this, void 0, void 0, function () {
            var r,
              n,
              i = this;
            return E(this, function (o) {
              switch (o.label) {
                case 0:
                  return (
                    (r = []),
                    (n = []),
                    this.queue.forEach(function (a) {
                      return a.timeout === 0 ? r.push(a) : n.push(a);
                    }),
                    (this.queue = n),
                    this.scheduled &&
                      (clearTimeout(this.scheduled), (this.scheduled = null)),
                    [
                      4,
                      Promise.all(
                        r.map(function (a) {
                          return i.send(a, e);
                        }),
                      ),
                    ]
                  );
                case 1:
                  return (o.sent(), [2]);
              }
            });
          })
        );
      }),
      (t.prototype.send = function (e, r) {
        var n, i;
        return (
          r === void 0 && (r = !0),
          S(this, void 0, void 0, function () {
            var o, a, s, u, c, l, f, d, v, h, m, y, p;
            return E(this, function (g) {
              switch (g.label) {
                case 0:
                  if (((o = e.apiKey), !o))
                    return [2, this.completeRequest({ context: e, err: Cd })];
                  if (((a = e.deviceId), !a))
                    return [2, this.completeRequest({ context: e, err: Pd })];
                  if (
                    ((s = Jl()),
                    (u = jr),
                    (c = e.sampleRate),
                    (l = new URLSearchParams({
                      device_id: a,
                      session_id: "".concat(e.sessionId),
                      type: "".concat(e.type),
                    })),
                    (f = ""
                      .concat(
                        ((n = e.version) === null || n === void 0
                          ? void 0
                          : n.type) || "standalone",
                        "/",
                      )
                      .concat(
                        ((i = e.version) === null || i === void 0
                          ? void 0
                          : i.version) || u,
                      )),
                    (d = this.payloadBatcher({ version: 1, events: e.events })),
                    d.events.length === 0)
                  )
                    return (this.completeRequest({ context: e }), [2]);
                  g.label = 1;
                case 1:
                  return (
                    g.trys.push([1, 3, , 4]),
                    (v = {
                      headers: {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                        Authorization: "Bearer ".concat(o),
                        "X-Client-Version": u,
                        "X-Client-Library": f,
                        "X-Client-Url": s.substring(0, zl),
                        "X-Client-Sample-Rate": "".concat(c),
                      },
                      body: JSON.stringify(d),
                      method: "POST",
                    }),
                    (h = ""
                      .concat(zo(e.serverZone, this.trackServerUrl), "?")
                      .concat(l.toString())),
                    [4, fetch(h, v)]
                  );
                case 2:
                  if (((m = g.sent()), m === null))
                    return (this.completeRequest({ context: e, err: wd }), [2]);
                  if (r) this.handleReponse(m.status, e);
                  else {
                    y = "";
                    try {
                      y = JSON.stringify(m.body, null, 2);
                    } catch {}
                    this.completeRequest({
                      context: e,
                      success: "".concat(m.status, ": ").concat(y),
                    });
                  }
                  return [3, 4];
                case 3:
                  return (
                    (p = g.sent()),
                    this.completeRequest({ context: e, err: p }),
                    [3, 4]
                  );
                case 4:
                  return [2];
              }
            });
          })
        );
      }),
      (t.prototype.handleReponse = function (e, r) {
        var n = new Qt().buildStatus(e);
        switch (n) {
          case te.Success:
            this.handleSuccessResponse(r);
            break;
          case te.Failed:
            this.handleOtherResponse(r);
            break;
          default:
            this.completeRequest({ context: r, err: Id });
        }
      }),
      (t.prototype.handleSuccessResponse = function (e) {
        var r = Math.round(new Blob(e.events).size / Wo);
        this.completeRequest({
          context: e,
          success:
            "Session replay event batch tracked successfully for session id "
              .concat(e.sessionId, ", size of events: ")
              .concat(r, " KB"),
        });
      }),
      (t.prototype.handleOtherResponse = function (e) {
        this.addToQueue(
          C(C({}, e), { timeout: e.attempts * this.retryTimeout }),
        );
      }),
      (t.prototype.completeRequest = function (e) {
        var r = e.context,
          n = e.err,
          i = e.success;
        (r.onComplete(),
          n ? this.loggerProvider.warn(n) : i && this.loggerProvider.log(i));
      }),
      t
    );
  })();
const Gr = (t, e) => e.some((r) => t instanceof r);
let _i, Pi;
function kd() {
  return (
    _i ||
    (_i = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction])
  );
}
function Rd() {
  return (
    Pi ||
    (Pi = [
      IDBCursor.prototype.advance,
      IDBCursor.prototype.continue,
      IDBCursor.prototype.continuePrimaryKey,
    ])
  );
}
const Hr = new WeakMap(),
  mr = new WeakMap(),
  nr = new WeakMap();
function Od(t) {
  const e = new Promise((r, n) => {
    const i = () => {
        (t.removeEventListener("success", o),
          t.removeEventListener("error", a));
      },
      o = () => {
        (r(Ne(t.result)), i());
      },
      a = () => {
        (n(t.error), i());
      };
    (t.addEventListener("success", o), t.addEventListener("error", a));
  });
  return (nr.set(e, t), e);
}
function Ld(t) {
  if (Hr.has(t)) return;
  const e = new Promise((r, n) => {
    const i = () => {
        (t.removeEventListener("complete", o),
          t.removeEventListener("error", a),
          t.removeEventListener("abort", a));
      },
      o = () => {
        (r(), i());
      },
      a = () => {
        (n(t.error || new DOMException("AbortError", "AbortError")), i());
      };
    (t.addEventListener("complete", o),
      t.addEventListener("error", a),
      t.addEventListener("abort", a));
  });
  Hr.set(t, e);
}
let Wr = {
  get(t, e, r) {
    if (t instanceof IDBTransaction) {
      if (e === "done") return Hr.get(t);
      if (e === "store")
        return r.objectStoreNames[1]
          ? void 0
          : r.objectStore(r.objectStoreNames[0]);
    }
    return Ne(t[e]);
  },
  set(t, e, r) {
    return ((t[e] = r), !0);
  },
  has(t, e) {
    return t instanceof IDBTransaction && (e === "done" || e === "store")
      ? !0
      : e in t;
  },
};
function na(t) {
  Wr = t(Wr);
}
function Dd(t) {
  return Rd().includes(t)
    ? function (...e) {
        return (t.apply(Kr(this), e), Ne(this.request));
      }
    : function (...e) {
        return Ne(t.apply(Kr(this), e));
      };
}
function Nd(t) {
  return typeof t == "function"
    ? Dd(t)
    : (t instanceof IDBTransaction && Ld(t),
      Gr(t, kd()) ? new Proxy(t, Wr) : t);
}
function Ne(t) {
  if (t instanceof IDBRequest) return Od(t);
  if (mr.has(t)) return mr.get(t);
  const e = Nd(t);
  return (e !== t && (mr.set(t, e), nr.set(e, t)), e);
}
const Kr = (t) => nr.get(t);
function ia(t, e, { blocked: r, upgrade: n, blocking: i, terminated: o } = {}) {
  const a = indexedDB.open(t, e),
    s = Ne(a);
  return (
    n &&
      a.addEventListener("upgradeneeded", (u) => {
        n(Ne(a.result), u.oldVersion, u.newVersion, Ne(a.transaction), u);
      }),
    r && a.addEventListener("blocked", (u) => r(u.oldVersion, u.newVersion, u)),
    s
      .then((u) => {
        (o && u.addEventListener("close", () => o()),
          i &&
            u.addEventListener("versionchange", (c) =>
              i(c.oldVersion, c.newVersion, c),
            ));
      })
      .catch(() => {}),
    s
  );
}
const Md = ["get", "getKey", "getAll", "getAllKeys", "count"],
  xd = ["put", "add", "delete", "clear"],
  yr = new Map();
function Ci(t, e) {
  if (!(t instanceof IDBDatabase && !(e in t) && typeof e == "string")) return;
  if (yr.get(e)) return yr.get(e);
  const r = e.replace(/FromIndex$/, ""),
    n = e !== r,
    i = xd.includes(r);
  if (
    !(r in (n ? IDBIndex : IDBObjectStore).prototype) ||
    !(i || Md.includes(r))
  )
    return;
  const o = async function (a, ...s) {
    const u = this.transaction(a, i ? "readwrite" : "readonly");
    let c = u.store;
    return (
      n && (c = c.index(s.shift())),
      (await Promise.all([c[r](...s), i && u.done]))[0]
    );
  };
  return (yr.set(e, o), o);
}
na((t) => ({
  ...t,
  get: (e, r, n) => Ci(e, r) || t.get(e, r, n),
  has: (e, r) => !!Ci(e, r) || t.has(e, r),
}));
const Ud = ["continue", "continuePrimaryKey", "advance"],
  Ai = {},
  zr = new WeakMap(),
  oa = new WeakMap(),
  Fd = {
    get(t, e) {
      if (!Ud.includes(e)) return t[e];
      let r = Ai[e];
      return (
        r ||
          (r = Ai[e] =
            function (...n) {
              zr.set(this, oa.get(this)[e](...n));
            }),
        r
      );
    },
  };
async function* qd(...t) {
  let e = this;
  if ((e instanceof IDBCursor || (e = await e.openCursor(...t)), !e)) return;
  e = e;
  const r = new Proxy(e, Fd);
  for (oa.set(r, e), nr.set(r, Kr(e)); e; )
    (yield r, (e = await (zr.get(r) || e.continue())), zr.delete(r));
}
function ki(t, e) {
  return (
    (e === Symbol.asyncIterator &&
      Gr(t, [IDBIndex, IDBObjectStore, IDBCursor])) ||
    (e === "iterate" && Gr(t, [IDBIndex, IDBObjectStore]))
  );
}
na((t) => ({
  ...t,
  get(e, r, n) {
    return ki(e, r) ? qd : t.get(e, r, n);
  },
  has(e, r) {
    return ki(e, r) || t.has(e, r);
  },
}));
var aa = (function () {
    function t(e) {
      var r = this,
        n,
        i,
        o;
      ((this.minInterval = Wl),
        (this.maxInterval = Kl),
        (this.maxPersistedEventsSize = jl),
        (this.interval = this.minInterval),
        (this._timeAtLastSplit = Date.now()),
        (this.shouldSplitEventsList = function (a, s) {
          var u = r.getStringSize(s),
            c = r.getEventsArraySize(a);
          return c + u >= r.maxPersistedEventsSize
            ? !0
            : Date.now() - r.timeAtLastSplit > r.interval && a.length
              ? ((r.interval = Math.min(
                  r.maxInterval,
                  r.interval + r.minInterval,
                )),
                (r._timeAtLastSplit = Date.now()),
                !0)
              : !1;
        }),
        (this.loggerProvider = e.loggerProvider),
        (this.minInterval =
          (n = e.minInterval) !== null && n !== void 0 ? n : this.minInterval),
        (this.maxInterval =
          (i = e.maxInterval) !== null && i !== void 0 ? i : this.maxInterval),
        (this.maxPersistedEventsSize =
          (o = e.maxPersistedEventsSize) !== null && o !== void 0
            ? o
            : this.maxPersistedEventsSize));
    }
    return (
      Object.defineProperty(t.prototype, "timeAtLastSplit", {
        get: function () {
          return this._timeAtLastSplit;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.prototype.getStringSize = function (e) {
        return e.length;
      }),
      (t.prototype.getEventsArraySize = function (e) {
        var r,
          n,
          i = 0;
        try {
          for (var o = x(e), a = o.next(); !a.done; a = o.next()) {
            var s = a.value;
            i += this.getStringSize(s);
          }
        } catch (c) {
          r = { error: c };
        } finally {
          try {
            a && !a.done && (n = o.return) && n.call(o);
          } finally {
            if (r) throw r.error;
          }
        }
        var u = 2 + Math.max(0, e.length - 1) + e.length * 2;
        return i + u;
      }),
      t
    );
  })(),
  $t;
(function (t) {
  ((t.RECORDING = "recording"), (t.SENT = "sent"));
})($t || ($t = {}));
var ft = "sessionCurrentSequence",
  vt = "sequencesToSend",
  Bd = function () {
    var t = B();
    return new Promise(function (e, r) {
      if (!t) return r(new Error("Global scope not found"));
      if (!t.indexedDB)
        return r(new Error("Session Replay: cannot find indexedDB"));
      try {
        var n = t.indexedDB.open("keyval-store"),
          i = !1;
        ((n.onupgradeneeded = function () {
          n.result.version === 1 && (i = !0);
        }),
          (n.onsuccess = function () {
            if (i) {
              try {
                n.result.close();
              } catch {}
              try {
                t.indexedDB.deleteDatabase("keyval-store");
              } catch {}
              e();
              return;
            }
            e(n.result);
          }),
          (n.onerror = function (o) {
            var a;
            if (
              ((a = n.error) === null || a === void 0 ? void 0 : a.name) ===
              "AbortError"
            ) {
              (o.preventDefault(), e());
              return;
            }
            r(n.error);
          }));
      } catch (o) {
        r(o);
      }
    });
  },
  Ri = function (t) {
    return S(void 0, void 0, void 0, function () {
      var e, r;
      return E(this, function (n) {
        switch (n.label) {
          case 0:
            return t.length > 0
              ? ((e = 10), (r = t.splice(0, e)), [4, Promise.all(r)])
              : [3, 2];
          case 1:
            return (n.sent(), [3, 0]);
          case 2:
            return [2];
        }
      });
    });
  },
  Vd = function (t) {
    var e, r;
    return (
      t.objectStoreNames.contains(ft) ||
        (r = t.createObjectStore(ft, { keyPath: "sessionId" })),
      t.objectStoreNames.contains(vt) ||
        ((e = t.createObjectStore(vt, {
          keyPath: "sequenceId",
          autoIncrement: !0,
        })),
        e.createIndex("sessionId", "sessionId")),
      { sequencesStore: e, currentSequenceStore: r }
    );
  },
  jd = function (t) {
    return S(void 0, void 0, void 0, function () {
      return E(this, function (e) {
        switch (e.label) {
          case 0:
            return [4, ia(t, 1, { upgrade: Vd })];
          case 1:
            return [2, e.sent()];
        }
      });
    });
  },
  Gd = (function (t) {
    be(e, t);
    function e(r) {
      var n = t.call(this, r) || this;
      return (
        (n.getSequencesToSend = function () {
          return S(n, void 0, void 0, function () {
            var i, o, a, s, u, c;
            return E(this, function (l) {
              switch (l.label) {
                case 0:
                  return (
                    l.trys.push([0, 5, , 6]),
                    (i = []),
                    [
                      4,
                      this.db.transaction("sequencesToSend").store.openCursor(),
                    ]
                  );
                case 1:
                  ((o = l.sent()), (l.label = 2));
                case 2:
                  return o
                    ? ((a = o.value),
                      (s = a.sessionId),
                      (u = a.events),
                      i.push({ events: u, sequenceId: o.key, sessionId: s }),
                      [4, o.continue()])
                    : [3, 4];
                case 3:
                  return ((o = l.sent()), [3, 2]);
                case 4:
                  return [2, i];
                case 5:
                  return (
                    (c = l.sent()),
                    this.loggerProvider.warn("".concat(Ve, ": ").concat(c)),
                    [3, 6]
                  );
                case 6:
                  return [2, void 0];
              }
            });
          });
        }),
        (n.storeCurrentSequence = function (i) {
          return S(n, void 0, void 0, function () {
            var o, a, s;
            return E(this, function (u) {
              switch (u.label) {
                case 0:
                  return (u.trys.push([0, 4, , 5]), [4, this.db.get(ft, i)]);
                case 1:
                  return (
                    (o = u.sent()),
                    o
                      ? [4, this.db.put(vt, { sessionId: i, events: o.events })]
                      : [2, void 0]
                  );
                case 2:
                  return (
                    (a = u.sent()),
                    [4, this.db.put(ft, { sessionId: i, events: [] })]
                  );
                case 3:
                  return (
                    u.sent(),
                    [2, C(C({}, o), { sessionId: i, sequenceId: a })]
                  );
                case 4:
                  return (
                    (s = u.sent()),
                    this.loggerProvider.warn("".concat(Ve, ": ").concat(s)),
                    [3, 5]
                  );
                case 5:
                  return [2, void 0];
              }
            });
          });
        }),
        (n.addEventToCurrentSequence = function (i, o) {
          return S(n, void 0, void 0, function () {
            var a, s, u, c, l, f;
            return E(this, function (d) {
              switch (d.label) {
                case 0:
                  return (
                    d.trys.push([0, 10, , 11]),
                    (a = this.db.transaction(ft, "readwrite")),
                    [4, a.store.get(i)]
                  );
                case 1:
                  return (
                    (s = d.sent()),
                    s ? [3, 3] : [4, a.store.put({ sessionId: i, events: [o] })]
                  );
                case 2:
                  return (d.sent(), [2]);
                case 3:
                  return (
                    (u = void 0),
                    this.shouldSplitEventsList(s.events, o)
                      ? ((u = s.events),
                        [4, a.store.put({ sessionId: i, events: [o] })])
                      : [3, 5]
                  );
                case 4:
                  return (d.sent(), [3, 7]);
                case 5:
                  return (
                    (c = s.events.concat(o)),
                    [4, a.store.put({ sessionId: i, events: c })]
                  );
                case 6:
                  (d.sent(), (d.label = 7));
                case 7:
                  return [4, a.done];
                case 8:
                  return (
                    d.sent(),
                    u ? [4, this.storeSendingEvents(i, u)] : [2, void 0]
                  );
                case 9:
                  return (
                    (l = d.sent()),
                    l
                      ? [2, { events: u, sessionId: i, sequenceId: l }]
                      : [2, void 0]
                  );
                case 10:
                  return (
                    (f = d.sent()),
                    this.loggerProvider.warn("".concat(Ve, ": ").concat(f)),
                    [3, 11]
                  );
                case 11:
                  return [2, void 0];
              }
            });
          });
        }),
        (n.storeSendingEvents = function (i, o) {
          return S(n, void 0, void 0, function () {
            var a, s;
            return E(this, function (u) {
              switch (u.label) {
                case 0:
                  return (
                    u.trys.push([0, 2, , 3]),
                    [4, this.db.put(vt, { sessionId: i, events: o })]
                  );
                case 1:
                  return ((a = u.sent()), [2, a]);
                case 2:
                  return (
                    (s = u.sent()),
                    this.loggerProvider.warn("".concat(Ve, ": ").concat(s)),
                    [3, 3]
                  );
                case 3:
                  return [2, void 0];
              }
            });
          });
        }),
        (n.cleanUpSessionEventsStore = function (i, o) {
          return S(n, void 0, void 0, function () {
            var a;
            return E(this, function (s) {
              switch (s.label) {
                case 0:
                  if (!o) return [2];
                  s.label = 1;
                case 1:
                  return (s.trys.push([1, 3, , 4]), [4, this.db.delete(vt, o)]);
                case 2:
                  return (s.sent(), [3, 4]);
                case 3:
                  return (
                    (a = s.sent()),
                    this.loggerProvider.warn("".concat(Ve, ": ").concat(a)),
                    [3, 4]
                  );
                case 4:
                  return [2];
              }
            });
          });
        }),
        (n.transitionFromKeyValStore = function (i) {
          return S(n, void 0, void 0, function () {
            var o,
              a,
              s,
              u,
              c,
              l,
              f,
              d,
              v = this;
            return E(this, function (h) {
              switch (h.label) {
                case 0:
                  return (h.trys.push([0, 6, , 7]), [4, Bd()]);
                case 1:
                  if (((o = h.sent()), !o)) return [2];
                  ((a = function (m, y) {
                    return S(v, void 0, void 0, function () {
                      var p,
                        g,
                        b = this;
                      return E(this, function (T) {
                        switch (T.label) {
                          case 0:
                            return (
                              (p = y.sessionSequences),
                              (g = []),
                              Object.keys(p).forEach(function (w) {
                                var I = parseInt(w, 10),
                                  _ = p[I];
                                if (I === y.currentSequenceId) {
                                  var P = _.events.map(function (k) {
                                    return S(b, void 0, void 0, function () {
                                      return E(this, function (A) {
                                        return [
                                          2,
                                          this.addEventToCurrentSequence(m, k),
                                        ];
                                      });
                                    });
                                  });
                                  g.push.apply(g, V([], L(P), !1));
                                } else
                                  _.status !== $t.SENT &&
                                    g.push(b.storeSendingEvents(m, _.events));
                              }),
                              [4, Ri(g)]
                            );
                          case 1:
                            return (T.sent(), [2]);
                        }
                      });
                    });
                  }),
                    (s = ""
                      .concat(Gi, "_")
                      .concat(this.apiKey.substring(0, 10))),
                    (h.label = 2));
                case 2:
                  return (
                    h.trys.push([2, 4, , 5]),
                    (u = o
                      .transaction("keyval")
                      .objectStore("keyval")
                      .getAll(s)),
                    (c = new Promise(function (m) {
                      u.onsuccess = function (y) {
                        return S(v, void 0, void 0, function () {
                          var p,
                            g,
                            b,
                            T = this;
                          return E(this, function (w) {
                            switch (w.label) {
                              case 0:
                                return (
                                  (p = y && y.target.result),
                                  (g = p && p[0]),
                                  g
                                    ? ((b = []),
                                      Object.keys(g).forEach(function (I) {
                                        var _ = parseInt(I, 10),
                                          P = g[_];
                                        if (i === _) b.push(a(_, P));
                                        else {
                                          var k = P.sessionSequences;
                                          Object.keys(k).forEach(function (A) {
                                            var R = parseInt(A, 10);
                                            k[R].status !== $t.SENT &&
                                              b.push(
                                                T.storeSendingEvents(
                                                  _,
                                                  k[R].events,
                                                ),
                                              );
                                          });
                                        }
                                      }),
                                      [4, Ri(b)])
                                    : [3, 2]
                                );
                              case 1:
                                (w.sent(), (w.label = 2));
                              case 2:
                                return (m(), [2]);
                            }
                          });
                        });
                      };
                    })),
                    [4, c]
                  );
                case 3:
                  return (
                    h.sent(),
                    (l = B()),
                    l && l.indexedDB.deleteDatabase("keyval-store"),
                    [3, 5]
                  );
                case 4:
                  return (
                    (f = h.sent()),
                    this.loggerProvider.warn(
                      "Failed to transition session replay events from keyval to new store: ".concat(
                        f,
                      ),
                    ),
                    [3, 5]
                  );
                case 5:
                  return [3, 7];
                case 6:
                  return (
                    (d = h.sent()),
                    this.loggerProvider.warn(
                      "Failed to access keyval store: ".concat(
                        d,
                        ". For more information, visit: https://www.docs.developers.amplitude.com/session-replay/sdks/standalone/#indexeddb-best-practices",
                      ),
                    ),
                    [3, 7]
                  );
                case 7:
                  return [2];
              }
            });
          });
        }),
        (n.apiKey = r.apiKey),
        (n.db = r.db),
        n
      );
    }
    return (
      (e.new = function (r, n, i) {
        return S(this, void 0, void 0, function () {
          var o, a, s, u, c;
          return E(this, function (l) {
            switch (l.label) {
              case 0:
                return (
                  l.trys.push([0, 3, , 4]),
                  (o = r === "replay" ? "" : "_".concat(r)),
                  (a = ""
                    .concat(
                      n.apiKey.substring(0, 10),
                      "_amp_session_replay_events",
                    )
                    .concat(o)),
                  [4, jd(a)]
                );
              case 1:
                return (
                  (s = l.sent()),
                  (u = new e(C(C({}, n), { db: s }))),
                  [4, u.transitionFromKeyValStore(i)]
                );
              case 2:
                return (l.sent(), [2, u]);
              case 3:
                return (
                  (c = l.sent()),
                  n.loggerProvider.warn("".concat(Ve, ": ").concat(c)),
                  [3, 4]
                );
              case 4:
                return [2];
            }
          });
        });
      }),
      (e.prototype.getCurrentSequenceEvents = function (r) {
        return S(this, void 0, void 0, function () {
          var a, n, i, o, a, s, u, c;
          return E(this, function (l) {
            switch (l.label) {
              case 0:
                return r
                  ? [4, this.db.get("sessionCurrentSequence", r)]
                  : [3, 2];
              case 1:
                return ((a = l.sent()), a ? [2, [a]] : [2, void 0]);
              case 2:
                ((n = []), (l.label = 3));
              case 3:
                return (
                  l.trys.push([3, 8, 9, 10]),
                  [4, this.db.getAll("sessionCurrentSequence")]
                );
              case 4:
                ((i = x.apply(void 0, [l.sent()])),
                  (o = i.next()),
                  (l.label = 5));
              case 5:
                if (o.done) return [3, 7];
                ((a = o.value), n.push(a), (l.label = 6));
              case 6:
                return ((o = i.next()), [3, 5]);
              case 7:
                return [3, 10];
              case 8:
                return ((s = l.sent()), (u = { error: s }), [3, 10]);
              case 9:
                try {
                  o && !o.done && (c = i.return) && c.call(i);
                } finally {
                  if (u) throw u.error;
                }
                return [7];
              case 10:
                return [2, n];
            }
          });
        });
      }),
      e
    );
  })(aa),
  Hd = (function (t) {
    be(e, t);
    function e() {
      var r = (t !== null && t.apply(this, arguments)) || this;
      return (
        (r.finalizedSequences = {}),
        (r.sequences = {}),
        (r.sequenceId = 0),
        r
      );
    }
    return (
      (e.prototype.resetCurrentSequence = function (r) {
        this.sequences[r] = [];
      }),
      (e.prototype.addSequence = function (r) {
        var n = this.sequenceId++,
          i = V([], L(this.sequences[r]), !1);
        return (
          (this.finalizedSequences[n] = { sessionId: r, events: i }),
          this.resetCurrentSequence(r),
          { sequenceId: n, events: i, sessionId: r }
        );
      }),
      (e.prototype.getSequencesToSend = function () {
        return S(this, void 0, void 0, function () {
          return E(this, function (r) {
            return [
              2,
              Object.entries(this.finalizedSequences).map(function (n) {
                var i = L(n, 2),
                  o = i[0],
                  a = i[1],
                  s = a.sessionId,
                  u = a.events;
                return { sequenceId: Number(o), sessionId: s, events: u };
              }),
            ];
          });
        });
      }),
      (e.prototype.storeCurrentSequence = function (r) {
        return S(this, void 0, void 0, function () {
          return E(this, function (n) {
            return this.sequences[r] ? [2, this.addSequence(r)] : [2, void 0];
          });
        });
      }),
      (e.prototype.addEventToCurrentSequence = function (r, n) {
        return S(this, void 0, void 0, function () {
          var i;
          return E(this, function (o) {
            return (
              this.sequences[r] || this.resetCurrentSequence(r),
              this.shouldSplitEventsList(this.sequences[r], n) &&
                (i = this.addSequence(r)),
              this.sequences[r].push(n),
              [2, i]
            );
          });
        });
      }),
      (e.prototype.storeSendingEvents = function (r, n) {
        return S(this, void 0, void 0, function () {
          return E(this, function (i) {
            return (
              (this.finalizedSequences[this.sequenceId] = {
                sessionId: r,
                events: n,
              }),
              [2, this.sequenceId++]
            );
          });
        });
      }),
      (e.prototype.cleanUpSessionEventsStore = function (r, n) {
        return S(this, void 0, void 0, function () {
          return E(this, function (i) {
            return (n !== void 0 && delete this.finalizedSequences[n], [2]);
          });
        });
      }),
      e
    );
  })(aa),
  Oi = function (t) {
    var e = t.config,
      r = t.sessionId,
      n = t.minInterval,
      i = t.maxInterval,
      o = t.type,
      a = t.payloadBatcher,
      s = t.storeType;
    return S(void 0, void 0, void 0, function () {
      function u(g) {
        return (
          g === void 0 && (g = !1),
          S(this, void 0, void 0, function () {
            return E(this, function (b) {
              return [2, c.flush(g)];
            });
          })
        );
      }
      var c, l, f, d, v, h, m, y, p;
      return E(this, function (g) {
        switch (g.label) {
          case 0:
            return (
              (c = new Ad(
                C(C({}, e), {
                  loggerProvider: e.loggerProvider,
                  payloadBatcher: a,
                }),
              )),
              (l = function () {
                return new Hd({
                  loggerProvider: e.loggerProvider,
                  maxInterval: i,
                  minInterval: n,
                });
              }),
              (f = function () {
                return S(void 0, void 0, void 0, function () {
                  var b;
                  return E(this, function (T) {
                    switch (T.label) {
                      case 0:
                        return [
                          4,
                          Gd.new(
                            o,
                            {
                              loggerProvider: e.loggerProvider,
                              minInterval: n,
                              maxInterval: i,
                              apiKey: e.apiKey,
                            },
                            r,
                          ),
                        ];
                      case 1:
                        return (
                          (b = T.sent()),
                          e.loggerProvider.log(
                            "Failed to initialize idb store, falling back to memory store.",
                          ),
                          [2, b ?? l()]
                        );
                    }
                  });
                });
              }),
              s !== "idb" ? [3, 2] : [4, f()]
            );
          case 1:
            return ((v = g.sent()), [3, 3]);
          case 2:
            ((v = l()), (g.label = 3));
          case 3:
            return (
              (d = v),
              (h = function (b) {
                var T = b.events,
                  w = b.sessionId,
                  I = b.deviceId,
                  _ = b.sequenceId;
                (e.debugMode &&
                  $o()
                    .then(function (P) {
                      var k = P.totalStorageSize,
                        A = P.percentOfQuota,
                        R = P.usageDetails;
                      e.loggerProvider.debug(
                        "Total storage size: "
                          .concat(k, " KB, percentage of quota: ")
                          .concat(A, "%, usage details: ")
                          .concat(R),
                      );
                    })
                    .catch(function () {}),
                  c.sendEventsList({
                    events: T,
                    sessionId: w,
                    flushMaxRetries: e.flushMaxRetries,
                    apiKey: e.apiKey,
                    deviceId: I,
                    sampleRate: e.sampleRate,
                    serverZone: e.serverZone,
                    version: e.version,
                    type: o,
                    onComplete: function () {
                      return S(void 0, void 0, void 0, function () {
                        return E(this, function (P) {
                          switch (P.label) {
                            case 0:
                              return [4, d.cleanUpSessionEventsStore(w, _)];
                            case 1:
                              return (P.sent(), [2]);
                          }
                        });
                      });
                    },
                  }));
              }),
              (m = function (b) {
                var T = b.sessionId,
                  w = b.deviceId;
                d.storeCurrentSequence(T)
                  .then(function (I) {
                    I &&
                      h({
                        sequenceId: I.sequenceId,
                        events: I.events,
                        sessionId: I.sessionId,
                        deviceId: w,
                      });
                  })
                  .catch(function (I) {
                    e.loggerProvider.warn(
                      "Failed to get current sequence of session replay events for session:",
                      I,
                    );
                  });
              }),
              (y = function (b) {
                var T = b.deviceId;
                return S(void 0, void 0, void 0, function () {
                  var w;
                  return E(this, function (I) {
                    switch (I.label) {
                      case 0:
                        return [4, d.getSequencesToSend()];
                      case 1:
                        return (
                          (w = I.sent()),
                          w &&
                            w.forEach(function (_) {
                              h({
                                sequenceId: _.sequenceId,
                                events: _.events,
                                sessionId: _.sessionId,
                                deviceId: T,
                              });
                            }),
                          [2]
                        );
                    }
                  });
                });
              }),
              (p = function (b) {
                var T = b.event,
                  w = b.sessionId,
                  I = b.deviceId;
                d.addEventToCurrentSequence(w, T.data)
                  .then(function (_) {
                    return (
                      _ &&
                      h({
                        sequenceId: _.sequenceId,
                        events: _.events,
                        sessionId: _.sessionId,
                        deviceId: I,
                      })
                    );
                  })
                  .catch(function (_) {
                    e.loggerProvider.warn(
                      "Failed to add event to session replay capture:",
                      _,
                    );
                  });
              }),
              [
                2,
                {
                  sendCurrentSequenceEvents: m,
                  addEvent: p,
                  sendStoredEvents: y,
                  flush: u,
                },
              ]
            );
        }
      });
    });
  },
  Li = (function () {
    function t() {
      for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
      var n = new Map();
      (e.forEach(function (i) {
        n.set(i.name, i.manager);
      }),
        (this.managers = n));
    }
    return (
      (t.prototype.sendStoredEvents = function (e) {
        return S(this, void 0, void 0, function () {
          var r;
          return E(this, function (n) {
            switch (n.label) {
              case 0:
                return (
                  (r = []),
                  this.managers.forEach(function (i) {
                    r.push(i.sendStoredEvents(e));
                  }),
                  [4, Promise.all(r)]
                );
              case 1:
                return (n.sent(), [2]);
            }
          });
        });
      }),
      (t.prototype.addEvent = function (e) {
        var r,
          n = e.sessionId,
          i = e.event,
          o = e.deviceId;
        (r = this.managers.get(i.type)) === null ||
          r === void 0 ||
          r.addEvent({ sessionId: n, event: i, deviceId: o });
      }),
      (t.prototype.sendCurrentSequenceEvents = function (e) {
        var r = e.sessionId,
          n = e.deviceId;
        this.managers.forEach(function (i) {
          i.sendCurrentSequenceEvents({ sessionId: r, deviceId: n });
        });
      }),
      (t.prototype.flush = function (e) {
        return S(this, void 0, void 0, function () {
          var r;
          return E(this, function (n) {
            switch (n.label) {
              case 0:
                return (
                  (r = []),
                  this.managers.forEach(function (i) {
                    r.push(i.flush(e));
                  }),
                  [4, Promise.all(r)]
                );
              case 1:
                return (n.sent(), [2]);
            }
          });
        });
      }),
      t
    );
  })(),
  le,
  pn,
  sa;
function Wd(t, e) {
  if (((sa = new Date()), t.nodeType !== Node.ELEMENT_NODE))
    throw new Error("Can't generate CSS selector for non-element node type.");
  if (t.tagName.toLowerCase() === "html") return "html";
  var r = {
    root: document.body,
    idName: function (o) {
      return !0;
    },
    className: function (o) {
      return !0;
    },
    tagName: function (o) {
      return !0;
    },
    attr: function (o, a) {
      return !1;
    },
    seedMinLength: 1,
    optimizedMinLength: 2,
    threshold: 1e3,
    maxNumberOfTries: 1e4,
    timeoutMs: void 0,
  };
  ((le = C(C({}, r), e)), (pn = Kd(le.root, r)));
  var n = Pt(t, "all", function () {
    return Pt(t, "two", function () {
      return Pt(t, "one", function () {
        return Pt(t, "none");
      });
    });
  });
  if (n) {
    var i = la(da(n, t));
    return (i.length > 0 && (n = i[0]), ir(n));
  } else throw new Error("Selector was not found.");
}
function Kd(t, e) {
  return t.nodeType === Node.DOCUMENT_NODE
    ? t
    : t === e.root
      ? t.ownerDocument
      : t;
}
function Pt(t, e, r) {
  for (
    var n = null,
      i = [],
      o = t,
      a = 0,
      s = function () {
        var c,
          l,
          f = new Date().getTime() - sa.getTime();
        if (le.timeoutMs !== void 0 && f > le.timeoutMs)
          throw new Error(
            "Timeout: Can't find a unique selector after ".concat(f, "ms"),
          );
        var d = At(zd(o)) ||
            At.apply(void 0, V([], L($d(o)), !1)) ||
            At.apply(void 0, V([], L(Xd(o)), !1)) ||
            At(Yd(o)) || [Mi()],
          v = Jd(o);
        if (e == "all")
          v &&
            (d = d.concat(
              d.filter(br).map(function (g) {
                return Ct(g, v);
              }),
            ));
        else if (e == "two")
          ((d = d.slice(0, 1)),
            v &&
              (d = d.concat(
                d.filter(br).map(function (g) {
                  return Ct(g, v);
                }),
              )));
        else if (e == "one") {
          var h = L((d = d.slice(0, 1)), 1),
            m = h[0];
          v && br(m) && (d = [Ct(m, v)]);
        } else e == "none" && ((d = [Mi()]), v && (d = [Ct(d[0], v)]));
        try {
          for (
            var y = ((c = void 0), x(d)), p = y.next();
            !p.done;
            p = y.next()
          ) {
            var m = p.value;
            m.level = a;
          }
        } catch (g) {
          c = { error: g };
        } finally {
          try {
            p && !p.done && (l = y.return) && l.call(y);
          } finally {
            if (c) throw c.error;
          }
        }
        if ((i.push(d), i.length >= le.seedMinLength && ((n = Di(i, r)), n)))
          return "break";
        ((o = o.parentElement), a++);
      };
    o;
  ) {
    var u = s();
    if (u === "break") break;
  }
  return (n || (n = Di(i, r)), !n && r ? r() : n);
}
function Di(t, e) {
  var r,
    n,
    i = la(ca(t));
  if (i.length > le.threshold) return e ? e() : null;
  try {
    for (var o = x(i), a = o.next(); !a.done; a = o.next()) {
      var s = a.value;
      if (ua(s)) return s;
    }
  } catch (u) {
    r = { error: u };
  } finally {
    try {
      a && !a.done && (n = o.return) && n.call(o);
    } finally {
      if (r) throw r.error;
    }
  }
  return null;
}
function ir(t) {
  for (var e = t[0], r = e.name, n = 1; n < t.length; n++) {
    var i = t[n].level || 0;
    (e.level === i - 1
      ? (r = "".concat(t[n].name, " > ").concat(r))
      : (r = "".concat(t[n].name, " ").concat(r)),
      (e = t[n]));
  }
  return r;
}
function Ni(t) {
  return t
    .map(function (e) {
      return e.penalty;
    })
    .reduce(function (e, r) {
      return e + r;
    }, 0);
}
function ua(t) {
  var e = ir(t);
  switch (pn.querySelectorAll(e).length) {
    case 0:
      throw new Error("Can't select any node with this selector: ".concat(e));
    case 1:
      return !0;
    default:
      return !1;
  }
}
function zd(t) {
  var e = t.getAttribute("id");
  return e && le.idName(e) ? { name: "#" + CSS.escape(e), penalty: 0 } : null;
}
function $d(t) {
  var e = Array.from(t.attributes).filter(function (r) {
    return le.attr(r.name, r.value);
  });
  return e.map(function (r) {
    return {
      name: "["
        .concat(CSS.escape(r.name), '="')
        .concat(CSS.escape(r.value), '"]'),
      penalty: 0.5,
    };
  });
}
function Xd(t) {
  var e = Array.from(t.classList).filter(le.className);
  return e.map(function (r) {
    return { name: "." + CSS.escape(r), penalty: 1 };
  });
}
function Yd(t) {
  var e = t.tagName.toLowerCase();
  return le.tagName(e) ? { name: e, penalty: 2 } : null;
}
function Mi() {
  return { name: "*", penalty: 3 };
}
function Jd(t) {
  var e = t.parentNode;
  if (!e) return null;
  var r = e.firstChild;
  if (!r) return null;
  for (var n = 0; r && (r.nodeType === Node.ELEMENT_NODE && n++, r !== t); )
    r = r.nextSibling;
  return n;
}
function Ct(t, e) {
  return {
    name: t.name + ":nth-child(".concat(e, ")"),
    penalty: t.penalty + 1,
  };
}
function br(t) {
  return t.name !== "html" && !t.name.startsWith("#");
}
function At() {
  for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
  var r = t.filter(Qd);
  return r.length > 0 ? r : null;
}
function Qd(t) {
  return t != null;
}
function ca(t, e) {
  var r, n, i, o, a, s;
  return (
    e === void 0 && (e = []),
    E(this, function (u) {
      switch (u.label) {
        case 0:
          if (!(t.length > 0)) return [3, 9];
          u.label = 1;
        case 1:
          (u.trys.push([1, 6, 7, 8]),
            (r = x(t[0])),
            (n = r.next()),
            (u.label = 2));
        case 2:
          return n.done
            ? [3, 5]
            : ((i = n.value), [5, x(ca(t.slice(1, t.length), e.concat(i)))]);
        case 3:
          (u.sent(), (u.label = 4));
        case 4:
          return ((n = r.next()), [3, 2]);
        case 5:
          return [3, 8];
        case 6:
          return ((o = u.sent()), (a = { error: o }), [3, 8]);
        case 7:
          try {
            n && !n.done && (s = r.return) && s.call(r);
          } finally {
            if (a) throw a.error;
          }
          return [7];
        case 8:
          return [3, 11];
        case 9:
          return [4, e];
        case 10:
          (u.sent(), (u.label = 11));
        case 11:
          return [2];
      }
    })
  );
}
function la(t) {
  return V([], L(t), !1).sort(function (e, r) {
    return Ni(e) - Ni(r);
  });
}
function da(t, e, r) {
  var n, i, o;
  return (
    r === void 0 && (r = { counter: 0, visited: new Map() }),
    E(this, function (a) {
      switch (a.label) {
        case 0:
          if (!(t.length > 2 && t.length > le.optimizedMinLength))
            return [3, 5];
          ((n = 1), (a.label = 1));
        case 1:
          return n < t.length - 1
            ? r.counter > le.maxNumberOfTries
              ? [2]
              : ((r.counter += 1),
                (i = V([], L(t), !1)),
                i.splice(n, 1),
                (o = ir(i)),
                r.visited.has(o) ? [2] : ua(i) && Zd(i, e) ? [4, i] : [3, 4])
            : [3, 5];
        case 2:
          return (a.sent(), r.visited.set(o, !0), [5, x(da(i, e, r))]);
        case 3:
          (a.sent(), (a.label = 4));
        case 4:
          return (n++, [3, 1]);
        case 5:
          return [2];
      }
    })
  );
}
function Zd(t, e) {
  return pn.querySelector(ir(t)) === e;
}
var ef = 36e5,
  tf = function (t) {
    var e = t.version,
      r = t.events,
      n = [];
    return (
      r.forEach(function (i) {
        var o = JSON.parse(i);
        ((o.count = 1), o.type === "click" && n.push(o));
      }),
      { version: e, events: n }
    );
  },
  rf = function (t) {
    var e = t.version,
      r = t.events,
      n = [];
    r.forEach(function (o) {
      var a = JSON.parse(o);
      a.type === "click" && n.push(a);
    });
    var i = n.reduce(function (o, a) {
      var s = a.x,
        u = a.y,
        c = a.selector,
        l = a.timestamp,
        f = l - (l % ef),
        d = ""
          .concat(s, ":")
          .concat(u, ":")
          .concat(c ?? "", ":")
          .concat(f);
      return (
        o[d]
          ? (o[d].count += 1)
          : (o[d] = C(C({}, a), { timestamp: f, count: 1 })),
        o
      );
    }, {});
    return { version: e, events: Object.values(i) };
  },
  nf = (function () {
    function t(e, r) {
      var n = this;
      ((this.createHook = function (i) {
        var o = i.eventsManager,
          a = i.sessionId,
          s = i.deviceIdFn,
          u = i.mirror,
          c = i.ugcFilterRules,
          l = i.performanceOptions;
        return function (f) {
          if (f.type === Qo.Click) {
            var d = B();
            if (d) {
              var v = d.location,
                h = d.innerHeight,
                m = d.innerWidth;
              if (v) {
                var y = f.x,
                  p = f.y;
                if (!(y === void 0 || p === void 0)) {
                  var g = u.getNode(f.id),
                    b;
                  if (g)
                    try {
                      b = Wd(g, l);
                    } catch {
                      n.logger.debug("error resolving selector from finder");
                    }
                  var T = rr(v.href, c),
                    w = {
                      x: y + n.scrollWatcher.currentScrollX,
                      y: p + n.scrollWatcher.currentScrollY,
                      selector: b,
                      viewportHeight: h,
                      viewportWidth: m,
                      pageUrl: T,
                      timestamp: Date.now(),
                      type: "click",
                    },
                    I = s();
                  I &&
                    o.addEvent({
                      sessionId: a,
                      event: { type: "interaction", data: JSON.stringify(w) },
                      deviceId: I,
                    });
                }
              }
            }
          }
        };
      }),
        (this.logger = e),
        (this.scrollWatcher = r));
    }
    return t;
  })();
function Er() {
  var t = B();
  return (
    t?.innerHeight ||
    (document.documentElement && document.documentElement.clientHeight) ||
    (document.body && document.body.clientHeight) ||
    0
  );
}
function Sr() {
  var t = B();
  return (
    t?.innerWidth ||
    (document.documentElement && document.documentElement.clientWidth) ||
    (document.body && document.body.clientWidth) ||
    0
  );
}
var of = (function () {
    function t(e, r) {
      var n = B();
      (n && n.navigator && typeof n.navigator.sendBeacon == "function"
        ? (this.sendBeacon = function (i, o) {
            try {
              if (n.navigator.sendBeacon(i, JSON.stringify(o))) return !0;
            } catch {}
            return !1;
          })
        : (this.sendBeacon = function () {
            return !1;
          }),
        (this.sendXhr = function (i, o) {
          var a = new XMLHttpRequest();
          return (
            a.open("POST", i, !0),
            a.setRequestHeader("Accept", "*/*"),
            a.send(JSON.stringify(o)),
            !0
          );
        }),
        (this.basePageUrl = zo(r.serverZone, r.trackServerUrl)),
        (this.apiKey = r.apiKey),
        (this.context = e));
    }
    return (
      (t.prototype.send = function (e, r) {
        var n = this.context,
          i = n.sessionId,
          o = n.type,
          a = new URLSearchParams({
            device_id: e,
            session_id: String(i),
            type: String(o),
            api_key: this.apiKey,
          }),
          s = "".concat(this.basePageUrl, "?").concat(a.toString());
        this.sendBeacon(s, r) || this.sendXhr(s, r);
      }),
      t
    );
  })(),
  af = (function () {
    function t(e, r) {
      var n = this;
      ((this.timestamp = Date.now()),
        (this.hook = function (i) {
          n.update(i);
        }),
        (this.send = function (i) {
          return function (o) {
            var a,
              s,
              u = i(),
              c = B();
            c &&
              u &&
              n.transport.send(u, {
                version: 1,
                events: [
                  {
                    maxScrollX: n._maxScrollX,
                    maxScrollY: n._maxScrollY,
                    maxScrollWidth: n._maxScrollWidth,
                    maxScrollHeight: n._maxScrollHeight,
                    viewportHeight: Er(),
                    viewportWidth: Sr(),
                    pageUrl: rr(
                      c.location.href,
                      (s =
                        (a = n.config.interactionConfig) === null ||
                        a === void 0
                          ? void 0
                          : a.ugcFilterRules) !== null && s !== void 0
                        ? s
                        : [],
                    ),
                    timestamp: n.timestamp,
                    type: "scroll",
                  },
                ],
              });
          };
        }),
        (this._maxScrollX = 0),
        (this._maxScrollY = 0),
        (this._currentScrollX = 0),
        (this._currentScrollY = 0),
        (this._maxScrollWidth = Sr()),
        (this._maxScrollHeight = Er()),
        (this.config = r),
        (this.transport = e));
    }
    return (
      (t.default = function (e, r) {
        return new t(new of(e, r), r);
      }),
      Object.defineProperty(t.prototype, "maxScrollX", {
        get: function () {
          return this._maxScrollX;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "maxScrollY", {
        get: function () {
          return this._maxScrollY;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "maxScrollWidth", {
        get: function () {
          return this._maxScrollWidth;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "maxScrollHeight", {
        get: function () {
          return this._maxScrollHeight;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "currentScrollX", {
        get: function () {
          return this._currentScrollX;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, "currentScrollY", {
        get: function () {
          return this._currentScrollY;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.prototype.update = function (e) {
        var r = Date.now();
        if (
          ((this._currentScrollX = e.x),
          (this._currentScrollY = e.y),
          e.x > this._maxScrollX)
        ) {
          var n = Sr();
          this._maxScrollX = e.x;
          var i = e.x + n;
          (i > this._maxScrollWidth && (this._maxScrollWidth = i),
            (this.timestamp = r));
        }
        if (e.y > this._maxScrollY) {
          var o = Er();
          this._maxScrollY = e.y;
          var a = e.y + o;
          (a > this._maxScrollHeight && (this._maxScrollHeight = a),
            (this.timestamp = r));
        }
      }),
      t
    );
  })(),
  xi = (function () {
    function t(e) {
      var r = e.sessionId,
        n = e.deviceId;
      ((this.deviceId = n),
        (this.sessionId = r),
        r && n && (this.sessionReplayId = Ql(r, n)));
    }
    return t;
  })(),
  sf = 1e3 * 60 * 60 * 24 * 2,
  uf = (function () {
    function t() {
      var e = this;
      ((this.dbs = {}),
        (this.createStore = function (r) {
          return S(e, void 0, void 0, function () {
            return E(this, function (n) {
              switch (n.label) {
                case 0:
                  return [
                    4,
                    ia(r, 1, {
                      upgrade: function (i) {
                        i.objectStoreNames.contains("sessionTargetingMatch") ||
                          i.createObjectStore("sessionTargetingMatch", {
                            keyPath: "sessionId",
                          });
                      },
                    }),
                  ];
                case 1:
                  return [2, n.sent()];
              }
            });
          });
        }),
        (this.openOrCreateDB = function (r) {
          return S(e, void 0, void 0, function () {
            var n, i;
            return E(this, function (o) {
              switch (o.label) {
                case 0:
                  return this.dbs && this.dbs[r]
                    ? [2, this.dbs[r]]
                    : ((n = "".concat(
                        r.substring(0, 10),
                        "_amp_session_replay_targeting",
                      )),
                      [4, this.createStore(n)]);
                case 1:
                  return ((i = o.sent()), (this.dbs[r] = i), [2, i]);
              }
            });
          });
        }),
        (this.getTargetingMatchForSession = function (r) {
          var n = r.loggerProvider,
            i = r.apiKey,
            o = r.sessionId;
          return S(e, void 0, void 0, function () {
            var a, s, u, c;
            return E(this, function (l) {
              switch (l.label) {
                case 0:
                  return (
                    l.trys.push([0, 3, , 4]),
                    [4, this.openOrCreateDB(i)]
                  );
                case 1:
                  return (
                    (a = l.sent()),
                    (s = String(o)),
                    [4, a.get("sessionTargetingMatch", s)]
                  );
                case 2:
                  return ((u = l.sent()), [2, u?.targetingMatch]);
                case 3:
                  return (
                    (c = l.sent()),
                    n.warn(
                      "Failed to get targeting match for session id "
                        .concat(o, ": ")
                        .concat(c),
                    ),
                    [3, 4]
                  );
                case 4:
                  return [2, void 0];
              }
            });
          });
        }),
        (this.storeTargetingMatchForSession = function (r) {
          var n = r.loggerProvider,
            i = r.apiKey,
            o = r.sessionId,
            a = r.targetingMatch;
          return S(e, void 0, void 0, function () {
            var s, u, c, l;
            return E(this, function (f) {
              switch (f.label) {
                case 0:
                  return (
                    f.trys.push([0, 3, , 4]),
                    [4, this.openOrCreateDB(i)]
                  );
                case 1:
                  return (
                    (s = f.sent()),
                    (u = String(o)),
                    [
                      4,
                      s.put("sessionTargetingMatch", {
                        targetingMatch: a,
                        sessionId: u,
                        lastUpdated: Date.now(),
                      }),
                    ]
                  );
                case 2:
                  return ((c = f.sent()), [2, c]);
                case 3:
                  return (
                    (l = f.sent()),
                    n.warn(
                      "Failed to store targeting match for session id "
                        .concat(o, ": ")
                        .concat(l),
                    ),
                    [3, 4]
                  );
                case 4:
                  return [2, void 0];
              }
            });
          });
        }),
        (this.clearStoreOfOldSessions = function (r) {
          var n = r.loggerProvider,
            i = r.apiKey,
            o = r.currentSessionId;
          return S(e, void 0, void 0, function () {
            var a, s, u, c, l, f, d, v;
            return E(this, function (h) {
              switch (h.label) {
                case 0:
                  return (
                    h.trys.push([0, 8, , 9]),
                    [4, this.openOrCreateDB(i)]
                  );
                case 1:
                  return (
                    (a = h.sent()),
                    (s = String(o)),
                    (u = a.transaction("sessionTargetingMatch", "readwrite")),
                    [4, u.store.getAll()]
                  );
                case 2:
                  ((c = h.sent()), (l = 0), (h.label = 3));
                case 3:
                  return l < c.length
                    ? ((f = c[l]),
                      (d = Date.now() - f.lastUpdated),
                      f.sessionId !== s && d > sf
                        ? [4, u.store.delete(f.sessionId)]
                        : [3, 5])
                    : [3, 6];
                case 4:
                  (h.sent(), (h.label = 5));
                case 5:
                  return (l++, [3, 3]);
                case 6:
                  return [4, u.done];
                case 7:
                  return (h.sent(), [3, 9]);
                case 8:
                  return (
                    (v = h.sent()),
                    n.warn(
                      "Failed to clear old targeting matches for sessions: ".concat(
                        v,
                      ),
                    ),
                    [3, 9]
                  );
                case 9:
                  return [2];
              }
            });
          });
        }));
    }
    return t;
  })(),
  Tr = new uf(),
  cf = function (t) {
    var e = t.sessionId,
      r = t.targetingConfig,
      n = t.loggerProvider,
      i = t.apiKey,
      o = t.targetingParams;
    return S(void 0, void 0, void 0, function () {
      var a, s, u, c, l, f;
      return E(this, function (d) {
        switch (d.label) {
          case 0:
            return [
              4,
              Tr.clearStoreOfOldSessions({
                loggerProvider: n,
                apiKey: i,
                currentSessionId: e,
              }),
            ];
          case 1:
            return (
              d.sent(),
              [
                4,
                Tr.getTargetingMatchForSession({
                  loggerProvider: n,
                  apiKey: i,
                  sessionId: e,
                }),
              ]
            );
          case 2:
            if (((a = d.sent()), a === !0)) return [2, !0];
            ((s = !0), (d.label = 3));
          case 3:
            return (
              d.trys.push([3, 6, , 7]),
              [
                4,
                it(
                  () => import("./index-CHx3lakx.js"),
                  __vite__mapDeps([0, 1, 2, 3, 4, 5]),
                  import.meta.url,
                ),
              ]
            );
          case 4:
            return (
              (u = d.sent().evaluateTargeting),
              [
                4,
                u(
                  C(C({}, o), {
                    flag: r,
                    sessionId: e,
                    apiKey: i,
                    loggerProvider: n,
                  }),
                ),
              ]
            );
          case 5:
            return (
              (c = d.sent()),
              c &&
                c.sr_targeting_config &&
                (s = c.sr_targeting_config.key === "on"),
              Tr.storeTargetingMatchForSession({
                loggerProvider: n,
                apiKey: i,
                sessionId: e,
                targetingMatch: s,
              }),
              [3, 7]
            );
          case 6:
            return ((l = d.sent()), (f = l), n.warn(f.message), [3, 7]);
          case 7:
            return [2, s];
        }
      });
    });
  };
function fa(t) {
  return (
    t === void 0 && (t = {}),
    {
      name: "amplitude/url-tracking@1",
      observer: function (e, r, n) {
        var i,
          o,
          a,
          s = C(C({}, t), n),
          u = s.ugcFilterRules || [],
          c = (i = s.enablePolling) !== null && i !== void 0 ? i : !1,
          l = (o = s.pollingInterval) !== null && o !== void 0 ? o : Go,
          f = (a = s.captureDocumentTitle) !== null && a !== void 0 ? a : !1;
        if (!r) return function () {};
        var d = void 0,
          v = "__amplitude_url_tracking_patched__",
          h = "__amplitude_url_tracking_reset__",
          m = function () {
            return (r.location && r.location.href) || "";
          },
          y = function () {
            var P = r.innerHeight,
              k = r.innerWidth,
              A = r.document,
              R = m(),
              O = "";
            f && (O = A?.title || "");
            var G = u.length > 0 ? rr(R, u) : R;
            return {
              href: G,
              title: O,
              viewportHeight: P,
              viewportWidth: k,
              type: "url-change-event",
            };
          },
          p = function () {
            var P = m();
            if (d === void 0 || P !== d) {
              d = P;
              var k = y();
              e(k);
            }
          },
          g = function (P) {
            var k = function () {
              for (var A = [], R = 0; R < arguments.length; R++)
                A[R] = arguments[R];
              var O = P.apply(this, A);
              return (r[h] || p(), O);
            };
            return ((k[v] = !0), k);
          },
          b = function () {
            p();
          };
        if (c) {
          var T = r.setInterval(function () {
            p();
          }, l);
          return (
            p(),
            function () {
              T && r.clearInterval(T);
            }
          );
        }
        if (r.history) {
          var w = r.history.pushState.bind(r.history),
            I = r.history.replaceState.bind(r.history),
            _ = function () {
              r.history.pushState[v] ||
                ((r.history.pushState = g(w)), (r.history.replaceState = g(I)));
            };
          return (
            _(),
            r.addEventListener("popstate", p),
            r.addEventListener("hashchange", b),
            p(),
            function () {
              ((r[h] = !0),
                r.removeEventListener("popstate", p),
                r.removeEventListener("hashchange", b));
            }
          );
        }
        return (
          r.addEventListener("hashchange", b),
          p(),
          function () {
            r.removeEventListener("hashchange", b);
          }
        );
      },
      options: t,
    }
  );
}
fa();
var lf = (function () {
    function t() {
      var e = this;
      ((this.name = "@amplitude/session-replay-browser"),
        (this.recordCancelCallback = null),
        (this.eventCount = 0),
        (this.sessionTargetingMatch = !1),
        (this.pageLeaveFns = []),
        (this.recordFunction = null),
        (this.teardownEventListeners = function (r) {
          var n = B();
          n &&
            (n.removeEventListener("blur", e.blurListener),
            n.removeEventListener("focus", e.focusListener),
            !r && n.addEventListener("blur", e.blurListener),
            !r && n.addEventListener("focus", e.focusListener),
            n.self && "onpagehide" in n.self
              ? (n.removeEventListener("pagehide", e.pageLeaveListener),
                !r && n.addEventListener("pagehide", e.pageLeaveListener))
              : (n.removeEventListener("beforeunload", e.pageLeaveListener),
                !r && n.addEventListener("beforeunload", e.pageLeaveListener)));
        }),
        (this.blurListener = function () {
          e.sendEvents();
        }),
        (this.focusListener = function () {
          e.recordEvents(!1);
        }),
        (this.pageLeaveListener = function (r) {
          e.pageLeaveFns.forEach(function (n) {
            n(r);
          });
        }),
        (this.evaluateTargetingAndCapture = function (r, n, i) {
          return (
            n === void 0 && (n = !1),
            i === void 0 && (i = !1),
            S(e, void 0, void 0, function () {
              var o, a;
              return E(this, function (s) {
                switch (s.label) {
                  case 0:
                    if (
                      !this.identifiers ||
                      !this.identifiers.sessionId ||
                      !this.config
                    )
                      return (
                        this.identifiers && !this.identifiers.sessionId
                          ? this.loggerProvider.log(
                              "Session ID has not been set yet, cannot evaluate targeting for Session Replay.",
                            )
                          : this.loggerProvider.warn(
                              "Session replay init has not been called, cannot evaluate targeting.",
                            ),
                        [2]
                      );
                    if (!this.config.targetingConfig)
                      if (n)
                        this.loggerProvider.log(
                          "Targeting config has not been set yet, cannot evaluate targeting.",
                        );
                      else
                        return (
                          this.loggerProvider.log(
                            "No targeting config set, skipping initialization/recording for event.",
                          ),
                          [2]
                        );
                    return (
                      (this.lastTargetingParams = r),
                      this.config.targetingConfig && !this.sessionTargetingMatch
                        ? ((o = r.event),
                          o &&
                            Object.values(se).includes(o.event_type) &&
                            (o = void 0),
                          (a = this),
                          [
                            4,
                            cf({
                              sessionId: this.identifiers.sessionId,
                              targetingConfig: this.config.targetingConfig,
                              loggerProvider: this.loggerProvider,
                              apiKey: this.config.apiKey,
                              targetingParams: {
                                userProperties: r.userProperties,
                                event: o,
                              },
                            }),
                          ])
                        : [3, 2]
                    );
                  case 1:
                    ((a.sessionTargetingMatch = s.sent()),
                      this.loggerProvider.debug(
                        JSON.stringify(
                          {
                            name: "targeted replay capture config",
                            sessionTargetingMatch: this.sessionTargetingMatch,
                            event: o,
                            targetingParams: r,
                          },
                          null,
                          2,
                        ),
                      ),
                      (s.label = 2));
                  case 2:
                    return n ? (this.initialize(!0), [3, 5]) : [3, 3];
                  case 3:
                    return i || !this.recordCancelCallback
                      ? (this.loggerProvider.log(
                          "Recording events for session due to forceRestart or no ongoing recording.",
                        ),
                        [4, this.recordEvents()])
                      : [3, 5];
                  case 4:
                    (s.sent(), (s.label = 5));
                  case 5:
                    return [2];
                }
              });
            })
          );
        }),
        (this.addCustomRRWebEvent = function (r, n, i) {
          return (
            n === void 0 && (n = {}),
            i === void 0 && (i = !0),
            S(e, void 0, void 0, function () {
              var o, a, s, u;
              return E(this, function (c) {
                switch (c.label) {
                  case 0:
                    return (
                      c.trys.push([0, 3, , 4]),
                      (o = void 0),
                      (a = this.config),
                      a && r !== _e.METADATA
                        ? ((o = { config: Xo(a), version: jr }),
                          i ? [4, $o()] : [3, 2])
                        : [3, 2]
                    );
                  case 1:
                    ((s = c.sent()), (o = C(C({}, s), o)), (c.label = 2));
                  case 2:
                    return (
                      this.recordCancelCallback && this.recordFunction
                        ? this.recordFunction.addCustomEvent(r, C(C({}, n), o))
                        : this.loggerProvider.debug(
                            "Not able to add custom replay capture event ".concat(
                              r,
                              " due to no ongoing recording.",
                            ),
                          ),
                      [3, 4]
                    );
                  case 3:
                    return (
                      (u = c.sent()),
                      this.loggerProvider.debug(
                        "Error while adding custom replay capture event: ",
                        u,
                      ),
                      [3, 4]
                    );
                  case 4:
                    return [2];
                }
              });
            })
          );
        }),
        (this.stopRecordingEvents = function () {
          var r;
          try {
            (e.loggerProvider.log("Session Replay capture stopping."),
              e.recordCancelCallback && e.recordCancelCallback(),
              (e.recordCancelCallback = null),
              (r = e.networkObservers) === null || r === void 0 || r.stop());
          } catch (i) {
            var n = i;
            e.loggerProvider.warn(
              "Error occurred while stopping replay capture: ".concat(
                n.toString(),
              ),
            );
          }
        }),
        (this.loggerProvider = new xr(new gt())));
    }
    return (
      (t.prototype.init = function (e, r) {
        return ie(this._init(e, r));
      }),
      (t.prototype._init = function (e, r) {
        var n, i, o, a, s, u;
        return S(this, void 0, void 0, function () {
          var c, l, f, d, v, h, m, y, p, g, I, b, T, w, I, _, P, k;
          return E(this, function (A) {
            switch (A.label) {
              case 0:
                return (
                  (this.loggerProvider = new xr(r.loggerProvider || new gt())),
                  Object.prototype.hasOwnProperty.call(r, "logLevel") &&
                    this.loggerProvider.enable(r.logLevel),
                  (this.identifiers = new xi({
                    sessionId: r.sessionId,
                    deviceId: r.deviceId,
                  })),
                  (c = this),
                  [4, od(e, r)]
                );
              case 1:
                return (
                  (c.joinedConfigGenerator = A.sent()),
                  [4, this.joinedConfigGenerator.generateJoinedConfig()]
                );
              case 2:
                ((l = A.sent()),
                  (f = l.joinedConfig),
                  (d = l.localConfig),
                  (v = l.remoteConfig),
                  (this.config = f),
                  this.setMetadata(
                    r.sessionId,
                    f,
                    d,
                    v,
                    (n = r.version) === null || n === void 0
                      ? void 0
                      : n.version,
                    jr,
                    (i = r.version) === null || i === void 0 ? void 0 : i.type,
                  ),
                  r.sessionId &&
                    !(
                      (o = this.config.interactionConfig) === null ||
                      o === void 0
                    ) &&
                    o.enabled &&
                    ((h = af.default(
                      { sessionId: r.sessionId, type: "interaction" },
                      this.config,
                    )),
                    (this.pageLeaveFns = [
                      h.send(this.getDeviceId.bind(this)).bind(h),
                    ]),
                    (this.scrollHook = h.hook.bind(h)),
                    (this.clickHandler = new nf(this.loggerProvider, h))),
                  (m = []),
                  (y = this.config.storeType),
                  y === "idb" &&
                    !(!((a = B()) === null || a === void 0) && a.indexedDB) &&
                    ((y = "memory"),
                    this.loggerProvider.warn(
                      "Could not use preferred indexedDB storage, reverting to in memory option.",
                    )),
                  this.loggerProvider.log(
                    "Using ".concat(y, " for event storage."),
                  ),
                  (A.label = 3));
              case 3:
                return (
                  A.trys.push([3, 5, , 6]),
                  [
                    4,
                    Oi({
                      config: this.config,
                      sessionId: this.identifiers.sessionId,
                      type: "replay",
                      storeType: y,
                    }),
                  ]
                );
              case 4:
                return (
                  (p = A.sent()),
                  m.push({ name: "replay", manager: p }),
                  [3, 6]
                );
              case 5:
                return (
                  (g = A.sent()),
                  (I = g),
                  this.loggerProvider.warn(
                    "Error occurred while creating replay events manager: ".concat(
                      I.toString(),
                    ),
                  ),
                  [3, 6]
                );
              case 6:
                if (
                  !(
                    !(
                      (s = this.config.interactionConfig) === null ||
                      s === void 0
                    ) && s.enabled
                  )
                )
                  return [3, 10];
                ((b = this.config.interactionConfig.batch ? rf : tf),
                  (A.label = 7));
              case 7:
                return (
                  A.trys.push([7, 9, , 10]),
                  [
                    4,
                    Oi({
                      config: this.config,
                      sessionId: this.identifiers.sessionId,
                      type: "interaction",
                      minInterval:
                        (u = this.config.interactionConfig.trackEveryNms) !==
                          null && u !== void 0
                          ? u
                          : Gl,
                      maxInterval: Hl,
                      payloadBatcher: b,
                      storeType: y,
                    }),
                  ]
                );
              case 8:
                return (
                  (T = A.sent()),
                  m.push({ name: "interaction", manager: T }),
                  [3, 10]
                );
              case 9:
                return (
                  (w = A.sent()),
                  (I = w),
                  this.loggerProvider.warn(
                    "Error occurred while creating interaction events manager: ".concat(
                      I.toString(),
                    ),
                  ),
                  [3, 10]
                );
              case 10:
                return (
                  (this.eventsManager = new (Li.bind.apply(
                    Li,
                    V([void 0], L(m), !1),
                  ))()),
                  this.eventCompressor && this.eventCompressor.terminate(),
                  (_ = void 0),
                  (P = B()),
                  this.config.useWebWorker && P && P.Worker
                    ? [
                        4,
                        it(
                          () => import("./index-Sv27Ykxs.js"),
                          [],
                          import.meta.url,
                        ),
                      ]
                    : [3, 12]
                );
              case 11:
                ((k = A.sent().compressionScript), (_ = k), (A.label = 12));
              case 12:
                return (
                  (this.eventCompressor = new Td(
                    this.eventsManager,
                    this.config,
                    this.getDeviceId(),
                    _,
                  )),
                  [4, this.initializeNetworkObservers()]
                );
              case 13:
                return (
                  A.sent(),
                  this.loggerProvider.log(
                    "Installing @amplitude/session-replay-browser.",
                  ),
                  this.teardownEventListeners(!1),
                  [
                    4,
                    this.evaluateTargetingAndCapture(
                      { userProperties: r.userProperties },
                      !0,
                    ),
                  ]
                );
              case 14:
                return (A.sent(), [2]);
            }
          });
        });
      }),
      (t.prototype.setSessionId = function (e, r) {
        return ie(this.asyncSetSessionId(e, r));
      }),
      (t.prototype.asyncSetSessionId = function (e, r, n) {
        var i;
        return S(this, void 0, void 0, function () {
          var o, a, s;
          return E(this, function (u) {
            switch (u.label) {
              case 0:
                return (
                  (this.sessionTargetingMatch = !1),
                  (this.lastShouldRecordDecision = void 0),
                  (o = this.identifiers && this.identifiers.sessionId),
                  o && this.sendEvents(o),
                  (a = r || this.getDeviceId()),
                  (this.identifiers = new xi({ sessionId: e, deviceId: a })),
                  this.joinedConfigGenerator && o
                    ? [4, this.joinedConfigGenerator.generateJoinedConfig()]
                    : [3, 2]
                );
              case 1:
                ((s = u.sent().joinedConfig), (this.config = s), (u.label = 2));
              case 2:
                return !((i = this.config) === null || i === void 0) &&
                  i.targetingConfig
                  ? [
                      4,
                      this.evaluateTargetingAndCapture(
                        { userProperties: n?.userProperties },
                        !1,
                        !0,
                      ),
                    ]
                  : [3, 4];
              case 3:
                return (u.sent(), [3, 6]);
              case 4:
                return [4, this.recordEvents()];
              case 5:
                (u.sent(), (u.label = 6));
              case 6:
                return [2];
            }
          });
        });
      }),
      (t.prototype.getSessionReplayProperties = function () {
        var e,
          r = this.config,
          n = this.identifiers;
        if (!r || !n)
          return (
            this.loggerProvider.warn(
              "Session replay init has not been called, cannot get session replay properties.",
            ),
            {}
          );
        var i = this.getShouldRecord(),
          o = {};
        return (
          i &&
            ((o =
              ((e = {}),
              (e[Ll] = n.sessionReplayId ? n.sessionReplayId : null),
              e)),
            r.debugMode &&
              (o[xl] = JSON.stringify({ appHash: jt(r.apiKey).toString() }))),
          this.addCustomRRWebEvent(
            _e.GET_SR_PROPS,
            { shouldRecord: i, eventProperties: o },
            this.eventCount === 10,
          ),
          this.eventCount === 10 && (this.eventCount = 0),
          this.eventCount++,
          o
        );
      }),
      (t.prototype.sendEvents = function (e) {
        var r,
          n =
            e ||
            ((r = this.identifiers) === null || r === void 0
              ? void 0
              : r.sessionId),
          i = this.getDeviceId();
        this.eventsManager &&
          n &&
          i &&
          this.eventsManager.sendCurrentSequenceEvents({
            sessionId: n,
            deviceId: i,
          });
      }),
      (t.prototype.initialize = function (e) {
        var r;
        return (
          e === void 0 && (e = !1),
          S(this, void 0, void 0, function () {
            var n;
            return E(this, function (i) {
              return !((r = this.identifiers) === null || r === void 0) &&
                r.sessionId
                ? ((n = this.getDeviceId()),
                  n
                    ? (this.eventsManager &&
                        e &&
                        this.eventsManager.sendStoredEvents({ deviceId: n }),
                      [2, this.recordEvents()])
                    : (this.loggerProvider.log(
                        "Session is not being recorded due to lack of device id.",
                      ),
                      [2, Promise.resolve()]))
                : (this.loggerProvider.log(
                    "Session is not being recorded due to lack of session id.",
                  ),
                  [2, Promise.resolve()]);
            });
          })
        );
      }),
      (t.prototype.shouldOptOut = function () {
        var e, r, n;
        if (!((e = this.config) === null || e === void 0) && e.instanceName) {
          var i = We(this.config.instanceName).identityStore;
          n = i.getIdentity().optOut;
        }
        return n !== void 0
          ? n
          : (r = this.config) === null || r === void 0
            ? void 0
            : r.optOut;
      }),
      (t.prototype.getShouldRecord = function () {
        if (!this.identifiers || !this.config || !this.identifiers.sessionId)
          return (
            this.loggerProvider.warn(
              "Session is not being recorded due to lack of config, please call sessionReplay.init.",
            ),
            !1
          );
        if (!this.config.captureEnabled)
          return (
            this.loggerProvider.log(
              "Session ".concat(
                this.identifiers.sessionId,
                " not being captured due to capture being disabled for project or because the remote config could not be fetched.",
              ),
            ),
            !1
          );
        if (this.shouldOptOut())
          return (
            this.loggerProvider.log(
              "Opting session ".concat(
                this.identifiers.sessionId,
                " out of recording due to optOut config.",
              ),
            ),
            !1
          );
        var e = !1,
          r = "",
          n = !1;
        if (this.config.targetingConfig)
          this.sessionTargetingMatch
            ? ((r = "Capturing replays for session ".concat(
                this.identifiers.sessionId,
                " due to matching targeting conditions.",
              )),
              this.loggerProvider.log(r),
              (e = !0),
              (n = !0))
            : ((r = "Not capturing replays for session ".concat(
                this.identifiers.sessionId,
                " due to not matching targeting conditions.",
              )),
              this.loggerProvider.log(r),
              (e = !1),
              (n = !1));
        else {
          var i = ds(this.identifiers.sessionId, this.config.sampleRate);
          i
            ? ((e = !0), (n = !0))
            : ((r = "Opting session ".concat(
                this.identifiers.sessionId,
                " out of recording due to sample rate.",
              )),
              this.loggerProvider.log(r),
              (e = !1),
              (n = !1));
        }
        return (
          this.lastShouldRecordDecision !== e &&
            this.config.targetingConfig &&
            (this.addCustomRRWebEvent(_e.TARGETING_DECISION, {
              message: r,
              sessionId: this.identifiers.sessionId,
              matched: n,
              targetingParams: this.lastTargetingParams,
            }),
            (this.lastShouldRecordDecision = e)),
          e
        );
      }),
      (t.prototype.getBlockSelectors = function () {
        var e,
          r,
          n,
          i =
            (n =
              (r =
                (e = this.config) === null || e === void 0
                  ? void 0
                  : e.privacyConfig) === null || r === void 0
                ? void 0
                : r.blockSelector) !== null && n !== void 0
              ? n
              : [];
        if (i.length !== 0) return i;
      }),
      (t.prototype.getMaskTextSelectors = function () {
        var e, r, n, i;
        if (
          ((r =
            (e = this.config) === null || e === void 0
              ? void 0
              : e.privacyConfig) === null || r === void 0
            ? void 0
            : r.defaultMaskLevel) === "conservative"
        )
          return "*";
        var o =
          (i =
            (n = this.config) === null || n === void 0
              ? void 0
              : n.privacyConfig) === null || i === void 0
            ? void 0
            : i.maskSelector;
        if (o) return o;
      }),
      (t.prototype.getRecordingPlugins = function (e) {
        var r, n, i, o, a, s;
        return S(this, void 0, void 0, function () {
          var u, c, l, f;
          return E(this, function (d) {
            switch (d.label) {
              case 0:
                u = [];
                try {
                  ((c = fa({
                    ugcFilterRules:
                      ((n =
                        (r = this.config) === null || r === void 0
                          ? void 0
                          : r.interactionConfig) === null || n === void 0
                        ? void 0
                        : n.ugcFilterRules) || [],
                    enablePolling:
                      ((i = this.config) === null || i === void 0
                        ? void 0
                        : i.enableUrlChangePolling) || !1,
                    pollingInterval:
                      (o = this.config) === null || o === void 0
                        ? void 0
                        : o.urlChangePollingInterval,
                    captureDocumentTitle:
                      (a = this.config) === null || a === void 0
                        ? void 0
                        : a.captureDocumentTitle,
                  })),
                    u.push(c));
                } catch (v) {
                  this.loggerProvider.warn(
                    "Failed to create URL tracking plugin:",
                    v,
                  );
                }
                if (
                  !(!((s = e?.console) === null || s === void 0) && s.enabled)
                )
                  return [3, 4];
                d.label = 1;
              case 1:
                return (
                  d.trys.push([1, 3, , 4]),
                  [
                    4,
                    it(
                      () => import("./rrweb-plugin-console-record-B9UBSauH.js"),
                      [],
                      import.meta.url,
                    ),
                  ]
                );
              case 2:
                return (
                  (l = d.sent().getRecordConsolePlugin),
                  u.push(l({ level: e.console.levels })),
                  [3, 4]
                );
              case 3:
                return (
                  (f = d.sent()),
                  this.loggerProvider.warn("Failed to load console plugin:", f),
                  [3, 4]
                );
              case 4:
                return [2, u.length > 0 ? u : void 0];
            }
          });
        });
      }),
      (t.prototype.getRecordFunction = function () {
        return S(this, void 0, void 0, function () {
          var e, r;
          return E(this, function (n) {
            switch (n.label) {
              case 0:
                if (this.recordFunction) return [2, this.recordFunction];
                n.label = 1;
              case 1:
                return (
                  n.trys.push([1, 3, , 4]),
                  [
                    4,
                    it(
                      () => import("./rrweb-record-J7IjRQDE.js"),
                      [],
                      import.meta.url,
                    ),
                  ]
                );
              case 2:
                return (
                  (e = n.sent().record),
                  (this.recordFunction = e),
                  [2, e]
                );
              case 3:
                return (
                  (r = n.sent()),
                  this.loggerProvider.warn(
                    "Failed to load rrweb-record module:",
                    r,
                  ),
                  [2, null]
                );
              case 4:
                return [2];
            }
          });
        });
      }),
      (t.prototype.recordEvents = function (e) {
        var r, n, i, o, a, s, u;
        return (
          e === void 0 && (e = !0),
          S(this, void 0, void 0, function () {
            var c,
              l,
              f,
              d,
              v,
              h,
              m,
              y,
              p,
              g,
              b,
              T,
              w,
              I = this;
            return E(this, function (_) {
              switch (_.label) {
                case 0:
                  return (
                    (c = this.config),
                    (l = this.getShouldRecord()),
                    (f =
                      (r = this.identifiers) === null || r === void 0
                        ? void 0
                        : r.sessionId),
                    !l || !f || !c
                      ? [2]
                      : (this.stopRecordingEvents(),
                        [4, this.getRecordFunction()])
                  );
                case 1:
                  return (
                    (d = _.sent()),
                    d ? [4, this.initializeNetworkObservers()] : [2]
                  );
                case 2:
                  (_.sent(),
                    (n = this.networkObservers) === null ||
                      n === void 0 ||
                      n.start(function (P) {
                        I.addCustomRRWebEvent(_e.FETCH_REQUEST, P);
                      }),
                    (v = c.privacyConfig),
                    (h = c.interactionConfig),
                    (m = c.loggingConfig),
                    (y = h?.enabled
                      ? {
                          mouseInteraction:
                            this.eventsManager &&
                            ((i = this.clickHandler) === null || i === void 0
                              ? void 0
                              : i.createHook({
                                  eventsManager: this.eventsManager,
                                  sessionId: f,
                                  deviceIdFn: this.getDeviceId.bind(this),
                                  mirror: d.mirror,
                                  ugcFilterRules:
                                    (o = h.ugcFilterRules) !== null &&
                                    o !== void 0
                                      ? o
                                      : [],
                                  performanceOptions:
                                    (a = c.performanceConfig) === null ||
                                    a === void 0
                                      ? void 0
                                      : a.interaction,
                                })),
                          scroll: this.scrollHook,
                        }
                      : {}),
                    (p =
                      h?.enabled && h.ugcFilterRules ? h.ugcFilterRules : []),
                    this.loggerProvider.log(
                      "Session Replay capture beginning for ".concat(f, "."),
                    ),
                    (_.label = 3));
                case 3:
                  return (
                    _.trys.push([3, 5, , 6]),
                    (g = this),
                    (b = d),
                    (w = {
                      emit: function (P) {
                        if (I.shouldOptOut()) {
                          (I.loggerProvider.log(
                            "Opting session ".concat(
                              f,
                              " out of recording due to optOut config.",
                            ),
                          ),
                            I.stopRecordingEvents(),
                            I.sendEvents());
                          return;
                        }
                        (P.type === Jo.Meta &&
                          (P.data.href = rr(P.data.href, p)),
                          I.eventCompressor &&
                            I.eventCompressor.enqueueEvent(P, f));
                      },
                      inlineStylesheet: c.shouldInlineStylesheet,
                      hooks: y,
                      maskAllInputs: !0,
                      maskTextClass: Ho,
                      blockClass: Ul,
                      blockSelector: this.getBlockSelectors(),
                      applyBackgroundColorToBlockedElements:
                        c.applyBackgroundColorToBlockedElements,
                      maskInputFn: Ei("input", v),
                      maskTextFn: Ei("text", v),
                      maskTextSelector: this.getMaskTextSelectors(),
                      recordCanvas: !1,
                      slimDOMOptions: {
                        script:
                          (s = c.omitElementTags) === null || s === void 0
                            ? void 0
                            : s.script,
                        comment:
                          (u = c.omitElementTags) === null || u === void 0
                            ? void 0
                            : u.comment,
                      },
                      errorHandler: function (P) {
                        var k = P;
                        if (
                          (k.message.includes("insertRule") &&
                            k.message.includes("CSSStyleSheet")) ||
                          k._external_
                        )
                          throw k;
                        return (
                          I.loggerProvider.warn(
                            "Error while capturing replay: ",
                            k.toString(),
                          ),
                          !0
                        );
                      },
                    }),
                    [4, this.getRecordingPlugins(m)]
                  );
                case 4:
                  return (
                    (g.recordCancelCallback = b.apply(void 0, [
                      ((w.plugins = _.sent()), w),
                    ])),
                    this.addCustomRRWebEvent(_e.DEBUG_INFO),
                    e && this.addCustomRRWebEvent(_e.METADATA, this.metadata),
                    [3, 6]
                  );
                case 5:
                  return (
                    (T = _.sent()),
                    this.loggerProvider.warn(
                      "Failed to initialize session replay:",
                      T,
                    ),
                    [3, 6]
                  );
                case 6:
                  return [2];
              }
            });
          })
        );
      }),
      (t.prototype.getDeviceId = function () {
        var e;
        return (e = this.identifiers) === null || e === void 0
          ? void 0
          : e.deviceId;
      }),
      (t.prototype.getSessionId = function () {
        var e;
        return (e = this.identifiers) === null || e === void 0
          ? void 0
          : e.sessionId;
      }),
      (t.prototype.flush = function (e) {
        var r;
        return (
          e === void 0 && (e = !1),
          S(this, void 0, void 0, function () {
            return E(this, function (n) {
              return [
                2,
                (r = this.eventsManager) === null || r === void 0
                  ? void 0
                  : r.flush(e),
              ];
            });
          })
        );
      }),
      (t.prototype.shutdown = function () {
        (this.teardownEventListeners(!0),
          this.stopRecordingEvents(),
          this.sendEvents());
      }),
      (t.prototype.mapSDKType = function (e) {
        return e === "plugin"
          ? "@amplitude/plugin-session-replay-browser"
          : e === "segment"
            ? "@amplitude/segment-session-replay-plugin"
            : null;
      }),
      (t.prototype.setMetadata = function (e, r, n, i, o, a, s) {
        var u = e?.toString() ? jt(e.toString()) : void 0;
        this.metadata = {
          joinedConfig: r,
          localConfig: n,
          remoteConfig: i,
          sessionId: e,
          hashValue: u,
          sampleRate: r.sampleRate,
          replaySDKType: this.mapSDKType(s),
          replaySDKVersion: o,
          standaloneSDKType: "@amplitude/session-replay-browser",
          standaloneSDKVersion: a,
        };
      }),
      (t.prototype.initializeNetworkObservers = function () {
        var e, r, n;
        return S(this, void 0, void 0, function () {
          var i, o;
          return E(this, function (a) {
            switch (a.label) {
              case 0:
                if (
                  !(
                    !(
                      (n =
                        (r =
                          (e = this.config) === null || e === void 0
                            ? void 0
                            : e.loggingConfig) === null || r === void 0
                          ? void 0
                          : r.network) === null || n === void 0
                    ) &&
                    n.enabled &&
                    !this.networkObservers
                  )
                )
                  return [3, 4];
                a.label = 1;
              case 1:
                return (
                  a.trys.push([1, 3, , 4]),
                  [
                    4,
                    it(
                      () => import("./observers-DohMzB7_.js"),
                      __vite__mapDeps([6, 1, 2, 3, 4, 5]),
                      import.meta.url,
                    ),
                  ]
                );
              case 2:
                return (
                  (i = a.sent().NetworkObservers),
                  (this.networkObservers = new i()),
                  [3, 4]
                );
              case 3:
                return (
                  (o = a.sent()),
                  this.loggerProvider.warn(
                    "Failed to import or instantiate NetworkObservers:",
                    o,
                  ),
                  [3, 4]
                );
              case 4:
                return [2];
            }
          });
        });
      }),
      t
    );
  })(),
  Le = function (t) {
    return function () {
      var e = t.config,
        r = e || Yo(),
        n = r.loggerProvider,
        i = r.logLevel;
      return { logger: n, logLevel: i };
    };
  },
  df = function () {
    var t = new lf();
    return {
      init: z(t.init.bind(t), "init", Le(t)),
      evaluateTargetingAndCapture: z(
        t.evaluateTargetingAndCapture.bind(t),
        "evaluateTargetingAndRecord",
        Le(t),
      ),
      setSessionId: z(t.setSessionId.bind(t), "setSessionId", Le(t)),
      getSessionId: z(t.getSessionId.bind(t), "getSessionId", Le(t)),
      getSessionReplayProperties: z(
        t.getSessionReplayProperties.bind(t),
        "getSessionReplayProperties",
        Le(t),
      ),
      flush: z(t.flush.bind(t), "flush", Le(t)),
      shutdown: z(t.shutdown.bind(t), "shutdown", Le(t)),
    };
  };
const xe = df();
var ff = xe.init,
  vf = xe.setSessionId,
  hf = xe.getSessionId,
  gf = xe.getSessionReplayProperties,
  pf = xe.flush,
  mf = xe.shutdown,
  yf = xe.evaluateTargetingAndCapture,
  bf = function (t) {
    return (t === void 0 && (t = "$default_instance"), Xi.getInstance(t));
  },
  Pe;
(function (t) {
  ((t.SET = "$set"),
    (t.SET_ONCE = "$setOnce"),
    (t.ADD = "$add"),
    (t.APPEND = "$append"),
    (t.PREPEND = "$prepend"),
    (t.REMOVE = "$remove"),
    (t.PREINSERT = "$preInsert"),
    (t.POSTINSERT = "$postInsert"),
    (t.UNSET = "$unset"),
    (t.CLEAR_ALL = "$clearAll"));
})(Pe || (Pe = {}));
var Ui;
(function (t) {
  ((t.REVENUE_PRODUCT_ID = "$productId"),
    (t.REVENUE_QUANTITY = "$quantity"),
    (t.REVENUE_PRICE = "$price"),
    (t.REVENUE_TYPE = "$revenueType"),
    (t.REVENUE_CURRENCY = "$currency"),
    (t.REVENUE = "$revenue"));
})(Ui || (Ui = {}));
var Fi;
(function (t) {
  ((t.IDENTIFY = "$identify"),
    (t.GROUP_IDENTIFY = "$groupidentify"),
    (t.REVENUE = "revenue_amount"));
})(Fi || (Fi = {}));
var Ef = [Pe.SET, Pe.SET_ONCE, Pe.ADD, Pe.APPEND, Pe.PREPEND, Pe.POSTINSERT],
  Sf = function (t) {
    if (t.user_properties) {
      var e = {},
        r = Object.keys(t.user_properties);
      return (
        r.forEach(function (n) {
          if (Ef.includes(n)) {
            var i = t.user_properties && t.user_properties[n];
            e = C(C({}, e), i);
          }
        }),
        e
      );
    }
  },
  qi = "1.25.4",
  Tf = "[Amplitude]",
  wf = "".concat(Tf, " Session Replay ID"),
  If = (function () {
    function t(e) {
      ((this.name = t.pluginName),
        (this.type = "enrichment"),
        (this.config = null),
        (this.sessionReplay = {
          flush: pf,
          getSessionId: hf,
          getSessionReplayProperties: gf,
          init: ff,
          setSessionId: vf,
          shutdown: mf,
          evaluateTargetingAndCapture: yf,
        }),
        (this.options = C({ forceSessionTracking: !1 }, e)),
        (this.srInitOptions = this.options));
    }
    return (
      (t.prototype.setup = function (e, r) {
        var n, i, o, a, s, u, c, l;
        return S(this, void 0, void 0, function () {
          var f, d, v;
          return E(this, function (h) {
            switch (h.label) {
              case 0:
                return (
                  h.trys.push([0, 2, , 3]),
                  e?.loggerProvider.log(
                    "Installing @amplitude/plugin-session-replay, version ".concat(
                      qi,
                      ".",
                    ),
                  ),
                  (this.config = e),
                  this.options.forceSessionTracking &&
                    (typeof e.defaultTracking == "boolean"
                      ? e.defaultTracking === !1 &&
                        (e.defaultTracking = {
                          pageViews: !1,
                          formInteractions: !1,
                          fileDownloads: !1,
                          sessions: !0,
                        })
                      : (e.defaultTracking = C(C({}, e.defaultTracking), {
                          sessions: !0,
                        }))),
                  (f = bf(this.config.instanceName).identityStore),
                  (d = f.getIdentity().userProperties),
                  (this.srInitOptions = {
                    instanceName: this.config.instanceName,
                    deviceId:
                      (n = this.options.deviceId) !== null && n !== void 0
                        ? n
                        : this.config.deviceId,
                    optOut: this.config.optOut,
                    sessionId: this.options.customSessionId
                      ? void 0
                      : this.config.sessionId,
                    loggerProvider: this.config.loggerProvider,
                    logLevel: this.config.logLevel,
                    flushMaxRetries: this.config.flushMaxRetries,
                    serverZone: this.config.serverZone,
                    configServerUrl:
                      this.options.configServerUrl ||
                      ((i = this.config.remoteConfig) === null || i === void 0
                        ? void 0
                        : i.serverUrl),
                    trackServerUrl: this.options.trackServerUrl,
                    sampleRate: this.options.sampleRate,
                    privacyConfig: {
                      blockSelector:
                        (o = this.options.privacyConfig) === null ||
                        o === void 0
                          ? void 0
                          : o.blockSelector,
                      maskSelector:
                        (a = this.options.privacyConfig) === null ||
                        a === void 0
                          ? void 0
                          : a.maskSelector,
                      unmaskSelector:
                        (s = this.options.privacyConfig) === null ||
                        s === void 0
                          ? void 0
                          : s.unmaskSelector,
                      defaultMaskLevel:
                        (u = this.options.privacyConfig) === null ||
                        u === void 0
                          ? void 0
                          : u.defaultMaskLevel,
                    },
                    debugMode: this.options.debugMode,
                    shouldInlineStylesheet: this.options.shouldInlineStylesheet,
                    version: { type: "plugin", version: qi },
                    performanceConfig: this.options.performanceConfig,
                    storeType: this.options.storeType,
                    useWebWorker:
                      (c = this.options.useWebWorker) !== null && c !== void 0
                        ? c
                        : (l = this.options.experimental) === null ||
                            l === void 0
                          ? void 0
                          : l.useWebWorker,
                    userProperties: d,
                    omitElementTags: this.options.omitElementTags,
                    applyBackgroundColorToBlockedElements:
                      this.options.applyBackgroundColorToBlockedElements,
                    interactionConfig: this.options.interactionConfig,
                    captureDocumentTitle: this.options.captureDocumentTitle,
                    enableUrlChangePolling: this.options.enableUrlChangePolling,
                    urlChangePollingInterval:
                      this.options.urlChangePollingInterval,
                  }),
                  [
                    4,
                    this.sessionReplay.init(e.apiKey, this.srInitOptions)
                      .promise,
                  ]
                );
              case 1:
                return (h.sent(), [3, 3]);
              case 2:
                return (
                  (v = h.sent()),
                  e?.loggerProvider.error(
                    "Session Replay: Failed to initialize due to ".concat(
                      v.message,
                    ),
                  ),
                  [3, 3]
                );
              case 3:
                return [2];
            }
          });
        });
      }),
      (t.prototype.onSessionIdChanged = function (e) {
        var r;
        return S(this, void 0, void 0, function () {
          return E(this, function (n) {
            switch (n.label) {
              case 0:
                return (
                  (r = this.config) === null ||
                    r === void 0 ||
                    r.loggerProvider.debug(
                      "Analytics session id is changed to "
                        .concat(e, ", SR session id is ")
                        .concat(String(this.sessionReplay.getSessionId()), "."),
                    ),
                  [4, this.sessionReplay.setSessionId(e).promise]
                );
              case 1:
                return (n.sent(), [2]);
            }
          });
        });
      }),
      (t.prototype.onOptOutChanged = function (e) {
        var r;
        return S(this, void 0, void 0, function () {
          var n;
          return E(this, function (i) {
            switch (i.label) {
              case 0:
                return (
                  (r = this.config) === null ||
                    r === void 0 ||
                    r.loggerProvider.debug(
                      "optOut is changed to "
                        .concat(String(e), ", calling ")
                        .concat(
                          e
                            ? "sessionReplay.shutdown()"
                            : "sessionReplay.init()",
                          ".",
                        ),
                    ),
                  e ? (this.sessionReplay.shutdown(), [3, 4]) : [3, 1]
                );
              case 1:
                return (
                  (n = this.config != null),
                  n
                    ? [
                        4,
                        this.sessionReplay.init(
                          this.config.apiKey,
                          this.srInitOptions,
                        ).promise,
                      ]
                    : [3, 3]
                );
              case 2:
                ((n = i.sent()), (i.label = 3));
              case 3:
                i.label = 4;
              case 4:
                return [2];
            }
          });
        });
      }),
      (t.prototype.execute = function (e) {
        var r, n;
        return S(this, void 0, void 0, function () {
          var i, a, i, o, a, s;
          return E(this, function (u) {
            switch (u.label) {
              case 0:
                return (
                  u.trys.push([0, 9, , 10]),
                  this.options.customSessionId
                    ? ((i = this.options.customSessionId(e)),
                      i
                        ? i === this.sessionReplay.getSessionId()
                          ? [3, 2]
                          : [4, this.sessionReplay.setSessionId(i).promise]
                        : [3, 3])
                    : [3, 4]
                );
              case 1:
                (u.sent(), (u.label = 2));
              case 2:
                ((a = this.sessionReplay.getSessionReplayProperties()),
                  (e.event_properties = C(C({}, e.event_properties), a)),
                  (u.label = 3));
              case 3:
                return [3, 8];
              case 4:
                return (
                  (i =
                    (r = this.config) === null || r === void 0
                      ? void 0
                      : r.sessionId),
                  i && i !== this.sessionReplay.getSessionId()
                    ? [4, this.sessionReplay.setSessionId(i).promise]
                    : [3, 6]
                );
              case 5:
                (u.sent(), (u.label = 6));
              case 6:
                return i && i === e.session_id
                  ? ((o = void 0),
                    e.event_type === se.IDENTIFY && (o = Sf(e)),
                    [
                      4,
                      this.sessionReplay.evaluateTargetingAndCapture({
                        event: e,
                        userProperties: o,
                      }),
                    ])
                  : [3, 8];
              case 7:
                (u.sent(),
                  (a = this.sessionReplay.getSessionReplayProperties()),
                  (e.event_properties = C(C({}, e.event_properties), a)),
                  (u.label = 8));
              case 8:
                return (
                  e.event_type === se.IDENTIFY &&
                    e.event_properties &&
                    delete e.event_properties[wf],
                  [2, Promise.resolve(e)]
                );
              case 9:
                return (
                  (s = u.sent()),
                  (n = this.config) === null ||
                    n === void 0 ||
                    n.loggerProvider.error(
                      "Session Replay: Failed to enrich event due to ".concat(
                        s.message,
                      ),
                    ),
                  [2, Promise.resolve(e)]
                );
              case 10:
                return [2];
            }
          });
        });
      }),
      (t.prototype.teardown = function () {
        var e;
        return S(this, void 0, void 0, function () {
          return E(this, function (r) {
            try {
              (this.sessionReplay.shutdown(), (this.config = null));
            } catch (n) {
              (e = this.config) === null ||
                e === void 0 ||
                e.loggerProvider.error(
                  "Session Replay: teardown failed due to ".concat(n.message),
                );
            }
            return [2];
          });
        });
      }),
      (t.prototype.getSessionReplayProperties = function () {
        return this.sessionReplay.getSessionReplayProperties();
      }),
      (t.pluginName = "@amplitude/plugin-session-replay-browser"),
      t
    );
  })(),
  _f = function (t) {
    return new If(t);
  };
const M = {
  initialized: !1,
  initPromise: null,
  sessionReplay: { plugin: null },
  cache: { deviceId: void 0, osVersion: void 0 },
  pending: { events: [], identifies: [] },
  deviceIdTracking: {
    currentDeviceId: void 0,
    previousDeviceIds: new Set(),
    currentUserId: void 0,
  },
};
function Te() {
  return (
    typeof window < "u" &&
    typeof window.electron < "u" &&
    typeof window.electron.platform == "string"
  );
}
function fe() {
  try {
    return pa("amplitude_disabled", !1);
  } catch {
    return !1;
  }
}
function mn() {
  if (Te()) {
    const t = window.electron.platform;
    return t === "darwin"
      ? "macOS"
      : t === "win32"
        ? "Windows"
        : (t ?? "unknown");
  }
  return wr ? "web-notes" : "unknown";
}
function Pf() {
  if (!Te()) return;
  const t = window.electron.platform;
  if (t === "darwin") return "Darwin";
  if (t === "win32") return "Windows_NT";
}
async function Cf() {
  if (!Te()) return null;
  if (M.cache.deviceId !== void 0) return M.cache.deviceId;
  try {
    const e = (await Ir("get-download-session"))?.amplitude_marketing_id,
      r = await Ir("get-device-id");
    M.cache.deviceId = e ?? r;
  } catch (t) {
    (console.error("Failed to resolve device id for Amplitude", t),
      (M.cache.deviceId = null));
  }
  return M.cache.deviceId;
}
async function Af() {
  if (Te()) {
    if (M.cache.osVersion) return M.cache.osVersion;
    try {
      M.cache.osVersion = await Ir("get-os-version");
    } catch (t) {
      console.error("Failed to resolve OS version for Amplitude", t);
    }
    return M.cache.osVersion;
  }
}
function kf() {
  const t = M.cache.osVersion,
    e = Pf(),
    r = mn(),
    n = ot.PACKAGE_VERSION;
  return {
    name: "granola-platform-enrichment",
    type: "enrichment",
    setup: async () => {},
    execute: async (i) => (
      (i.platform = r),
      e && (i.os_name = e),
      t && (i.os_version = t),
      n && (i.app_version = n),
      i
    ),
  };
}
function Rf(t) {
  if (!(!t || typeof t != "string"))
    try {
      if (t.startsWith("file://")) {
        const e = t.indexOf("#"),
          r = t.indexOf("?");
        if (r === -1 && e === -1) return t;
        const n = r !== -1 ? r : t.length;
        let i = t.substring(0, n);
        if (e !== -1 && e > n) {
          let o = t.substring(e);
          const a = o.indexOf("?");
          (a !== -1 && (o = o.substring(0, a)), (i += o));
        }
        return i;
      } else {
        const e = new URL(t);
        let r = e.hash || "";
        if (r) {
          const i = r.indexOf("?");
          i !== -1 && (r = r.substring(0, i));
        }
        return e.origin + e.pathname + r;
      }
    } catch (e) {
      console.warn("Failed to sanitize URL for Amplitude", {
        url: t,
        error: e,
      });
      return;
    }
}
function Of() {
  return {
    name: "granola-url-sanitization",
    type: "enrichment",
    setup: async () => {},
    execute: async (t) => {
      if (t.event_properties) {
        const e = [
            "[Amplitude] Page Location",
            "page_url",
            "url",
            "pageUrl",
            "pageLocation",
          ],
          r = t.event_properties;
        for (const n of e) {
          const i = r[n];
          if (i && typeof i == "string") {
            const o = Rf(i);
            o !== void 0 ? (r[n] = o) : delete r[n];
          }
        }
      }
      return t;
    },
  };
}
function Xt(t) {
  if (fe()) return;
  const e = new He();
  for (const [r, n] of Object.entries(t))
    n != null &&
      ((typeof n == "object" &&
        (Array.isArray(n) ? n.length === 0 : Object.keys(n).length === 0)) ||
        e.set(r, n));
  Fo(e);
}
const Lf = 5,
  Df = 10;
function va(t) {
  if (fe()) return;
  let e = Df;
  const r = Object.entries(t).slice(0, Lf);
  for (const [n, i] of r) {
    if (e <= 0) break;
    if (i != null) {
      if (typeof i == "string") (bi(n, i), e--);
      else if (Array.isArray(i) && i.length > 0) {
        const o = i.slice(0, e);
        (bi(n, o), (e -= o.length));
      }
    }
  }
}
async function $r(t, e) {
  if (!fe()) {
    if (!M.initialized) {
      console.warn("Cannot identify device: Amplitude not initialized");
      return;
    }
    if (!t || !e) {
      console.warn("Cannot identify device: missing userId or deviceId");
      return;
    }
    try {
      const r = new He();
      (await Fo(r, { user_id: t, device_id: e }).promise,
        console.log(
          `Identified device ${e.slice(0, 8)}... with user ${t.slice(0, 8)}...`,
        ));
    } catch (r) {
      (console.error("Failed to identify device with user", r),
        Ft("error", "amplitude-identify-device-failed", {
          error: r,
          userId: t.slice(0, 8),
          deviceId: e.slice(0, 8),
        }));
    }
  }
}
async function Kf(t) {
  if (fe()) return;
  const e = M.deviceIdTracking.currentDeviceId || Cl();
  if (e === t) return;
  (e && e !== t && M.deviceIdTracking.previousDeviceIds.add(e),
    (M.deviceIdTracking.currentDeviceId = t),
    kl(t));
  const r = M.deviceIdTracking.currentUserId;
  r && M.initialized && (await $r(r, t));
}
async function Xe(t) {
  typeof window > "u" ||
    fe() ||
    M.initialized ||
    (M.initPromise ||
      (M.initPromise = (async () => {
        let e;
        ot.PROD ? (e = ma) : (e = ya);
        const r = await Af();
        (xt(Of()), Te() && xt(kf()));
        const n = await Cf();
        if (
          (n && (M.deviceIdTracking.currentDeviceId = n),
          await Al(e, {
            defaultTracking: !0,
            flushQueueSize: 10,
            flushIntervalMillis: 5e3,
            serverUrl: "https://amp.granola.ai/2/httpapi",
            sessionTimeout: 864e5,
            deviceId: M.deviceIdTracking.currentDeviceId,
            optOut: fe(),
          }).promise,
          Te() && t?.sessionReplay)
        ) {
          const s = t.sessionReplay.enabled ?? !1;
          try {
            ((M.sessionReplay.plugin = _f({
              sampleRate: 1,
              forceSessionTracking: !0,
              privacyConfig: { defaultMaskLevel: "light" },
            })),
              s && (xt(M.sessionReplay.plugin), ht({ isRecording: !0 })),
              ht({ ready: !0 }));
          } catch (u) {
            (console.error("Failed to configure session replay", u),
              Ft("error", "amplitude-session-replay-configuration-failed", {
                error: u,
              }));
          }
        }
        const i = { source_platform: mn() };
        if (
          (ot.PACKAGE_VERSION && (i.app_version = ot.PACKAGE_VERSION),
          r && (i.os_version = r),
          n && (i.device_id = n),
          Xt(i),
          (M.initialized = !0),
          Te())
        ) {
          const s = Uo();
          s && qt("set-amplitude-session-id", s);
        }
        const o = M.pending.identifies;
        M.pending.identifies = [];
        for (const { userId: s, userProperties: u, groups: c } of o)
          (s !== void 0 && Bo(s ?? void 0),
            u && Object.keys(u).length > 0 && Xt(u),
            c && Object.keys(c).length > 0 && va(c));
        const a = M.pending.events;
        M.pending.events = [];
        for (const { event: s, properties: u } of a) Vo(s, u);
      })().catch((e) => {
        (console.error("Failed to initialize Amplitude", e),
          Ft("error", "amplitude-initialization-failed", { error: e }),
          (M.initPromise = null));
      })),
    await M.initPromise);
}
async function zf(t) {
  await Xe(t);
}
async function $f(t, e, r) {
  if (typeof window > "u" || fe()) return;
  if (!M.initialized) {
    const a = {};
    (t !== void 0 && (a.userId = t),
      e && (a.userProperties = e),
      r && (a.groups = r),
      M.pending.identifies.push(a),
      await Xe());
    return;
  }
  const n = M.deviceIdTracking.currentUserId,
    i = !n && t,
    o = n && !t;
  if (((M.deviceIdTracking.currentUserId = t), i && t)) {
    console.log(
      `User authenticating: identifying ${M.deviceIdTracking.previousDeviceIds.size} previous device IDs`,
    );
    const a = [];
    for (const u of M.deviceIdTracking.previousDeviceIds) a.push($r(t, u));
    const s = M.deviceIdTracking.currentDeviceId;
    (s && a.push($r(t, s)),
      Promise.all(a).catch((u) => {
        console.error("Failed to identify some device IDs", u);
      }),
      M.deviceIdTracking.previousDeviceIds.clear());
  }
  if (o) {
    if (
      (console.log(
        "User logging out: clearing device ID tracking state and resetting Amplitude session",
      ),
      M.deviceIdTracking.previousDeviceIds.clear(),
      M.sessionReplay.plugin?.name)
    )
      try {
        (qo(M.sessionReplay.plugin.name),
          ht({ isRecording: !1, currentComponentId: null }));
      } catch (a) {
        console.error("Failed to stop session replay on logout", a);
      }
    try {
      const a = Date.now();
      (Ol(a),
        qt("set-amplitude-session-id", a),
        console.log("Started new Amplitude session after logout"));
    } catch (a) {
      console.error("Failed to reset Amplitude session on logout", a);
    }
  }
  (t !== void 0 && Bo(t ?? void 0),
    e && Object.keys(e).length > 0 && Xt(e),
    r && Object.keys(r).length > 0 && va(r));
}
async function Bi(t) {
  if (!(typeof window > "u" || Object.keys(t).length === 0) && !fe()) {
    if (!M.initialized) {
      (M.pending.identifies.push({ userProperties: t }), await Xe());
      return;
    }
    Xt(t);
  }
}
function Nf() {
  return M.initialized;
}
function Xf() {
  return Uo();
}
function Yf() {
  if (!(typeof window > "u"))
    try {
      Rl(fe());
    } catch {}
}
function Vi(t, e) {
  if (typeof window > "u" || fe()) return;
  const r = { source_platform: mn(), app_version: ot.PACKAGE_VERSION, ...e };
  if (!M.initialized) {
    (M.pending.events.push({ event: t, properties: r }), Xe());
    return;
  }
  Vo(t, r);
}
async function Jf(t) {
  if (Te() && !fe()) {
    if ((await Xe(), !M.sessionReplay.plugin)) {
      console.error("Amplitude session replay plugin not initialized");
      return;
    }
    try {
      (await xt(M.sessionReplay.plugin).promise,
        ht({ isRecording: !0, currentComponentId: t ?? null }),
        console.log(
          `Started Amplitude session recording${t ? ` for ${t}` : ""}`,
        ));
    } catch (e) {
      console.error("Failed to start Amplitude session replay", e);
    }
  }
}
async function Qf() {
  if (Te() && !fe()) {
    if ((await Xe(), !M.sessionReplay.plugin)) {
      console.error("Amplitude session replay plugin not initialized");
      return;
    }
    try {
      (M.sessionReplay.plugin.name && qo(M.sessionReplay.plugin.name),
        ht({ isRecording: !1, currentComponentId: null }),
        console.log("Stopped Amplitude session recording"));
    } catch (t) {
      console.error("Failed to stop Amplitude session replay", t);
    }
  }
}
function Zf(t, e, r) {
  Ft("info", "analytics-event", { event: t, payload: e, source: "window" });
  const n = wr ? `web_${t}` : t,
    i = r !== void 0 && Object.keys(r).length > 0,
    o = e || i ? { ...(e ?? {}), ...(i ? r : {}) } : void 0;
  if (wr) (i && Bi(r), Vi(n, o));
  else if (!Nf()) qt("track-amplitude-event", t, e, r);
  else {
    i && Bi(r);
    try {
      Vi(n, o);
    } catch (a) {
      (console.error(
        "Failed to send event to Amplitude in renderer, falling back to IPC",
        a,
      ),
        qt("track-amplitude-event", t, e, r));
    }
  }
}
const Mf = (t) => t.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
  xf = (t) =>
    t.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, r, n) =>
      n ? n.toUpperCase() : r.toLowerCase(),
    ),
  ji = (t) => {
    const e = xf(t);
    return e.charAt(0).toUpperCase() + e.slice(1);
  },
  ha = (...t) =>
    t
      .filter((e, r, n) => !!e && e.trim() !== "" && n.indexOf(e) === r)
      .join(" ")
      .trim(),
  Uf = (t) => {
    for (const e in t)
      if (e.startsWith("aria-") || e === "role" || e === "title") return !0;
  };
var Ff = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
const qf = at.forwardRef(
  (
    {
      color: t = "currentColor",
      size: e = 24,
      strokeWidth: r = 2,
      absoluteStrokeWidth: n,
      className: i = "",
      children: o,
      iconNode: a,
      ...s
    },
    u,
  ) =>
    at.createElement(
      "svg",
      {
        ref: u,
        ...Ff,
        width: e,
        height: e,
        stroke: t,
        strokeWidth: n ? (Number(r) * 24) / Number(e) : r,
        className: ha("lucide", i),
        ...(!o && !Uf(s) && { "aria-hidden": "true" }),
        ...s,
      },
      [
        ...a.map(([c, l]) => at.createElement(c, l)),
        ...(Array.isArray(o) ? o : [o]),
      ],
    ),
);
const Bf = (t, e) => {
  const r = at.forwardRef(({ className: n, ...i }, o) =>
    at.createElement(qf, {
      ref: o,
      iconNode: e,
      className: ha(`lucide-${Mf(ji(t))}`, `lucide-${t}`, n),
      ...i,
    }),
  );
  return ((r.displayName = ji(t)), r);
};
const Vf = [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }],
  ],
  ev = Bf("x", Vf);
function tv({ className: t = "" }) {
  return ga.jsx("span", {
    "data-testid": "spinner",
    className: ba(
      "box-border size-4 shrink-0 animate-spin rounded-full border-2 border-current border-b-transparent",
      t,
    ),
  });
}
export {
  tv as S,
  ev as X,
  Jf as a,
  $f as b,
  Bf as c,
  Kf as d,
  Bi as e,
  B as f,
  Xf as g,
  zf as i,
  Zf as l,
  ia as o,
  Qf as s,
  Vi as t,
  Yf as u,
};
//# sourceMappingURL=Spinner-y5NAgbbf.js.map
