import {
  N as zn,
  O as qn,
  f as Yn,
  k as Xn,
  j as i,
  A as Qn,
  m as Jn,
} from "./client-Bbb5Wbb6.js";
import { r as a, q as ne, R as er } from "./index-Cnk1amp1.js";
import { c as tr, S as nr } from "./Spinner-y5NAgbbf.js";
import {
  c as Q,
  T as rr,
  h as be,
  u as J,
  c4 as De,
  k as W,
  g as z,
  j as N,
  q as Ae,
  bp as Oe,
  bJ as mt,
  bK as ht,
  bL as or,
  aU as fe,
  bM as xt,
  c5 as yt,
  c6 as ae,
  c7 as wt,
  c8 as Ct,
  c9 as bt,
  aD as Et,
  bN as ar,
  ca as sr,
  bO as ir,
  cb as lr,
  aV as cr,
} from "./LinkPreviewCard-DtO4M86I.js";
import { v as ur } from "./cacheStore-fi4qkUF1.js";
try {
  let e =
      typeof window < "u"
        ? window
        : typeof global < "u"
          ? global
          : typeof globalThis < "u"
            ? globalThis
            : typeof self < "u"
              ? self
              : {},
    n = new e.Error().stack;
  n &&
    ((e._sentryDebugIds = e._sentryDebugIds || {}),
    (e._sentryDebugIds[n] = "9fc10af3-2e84-4724-a9af-eda2ded746b6"),
    (e._sentryDebugIdIdentifier =
      "sentry-dbid-9fc10af3-2e84-4724-a9af-eda2ded746b6"));
} catch {}
function dr(e) {
  e.values.forEach((n) => n.stop());
}
function fr() {
  const e = new Set(),
    n = {
      subscribe(t) {
        return (
          e.add(t),
          () => {
            e.delete(t);
          }
        );
      },
      start(t, r) {
        const o = [];
        return (
          e.forEach((s) => {
            o.push(qn(s, t, { transitionOverride: r }));
          }),
          Promise.all(o)
        );
      },
      set(t) {
        return e.forEach((r) => {
          zn(r, t);
        });
      },
      stop() {
        e.forEach((t) => {
          dr(t);
        });
      },
      mount() {
        return () => {
          n.stop();
        };
      },
    };
  return n;
}
function pr() {
  const e = Yn(fr);
  return (Xn(e.mount, []), e);
}
const ps = pr;
function gr({ title: e, titleId: n, ...t }, r) {
  return a.createElement(
    "svg",
    Object.assign(
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
        ref: r,
        "aria-labelledby": n,
      },
      t,
    ),
    e ? a.createElement("title", { id: n }, e) : null,
    a.createElement("path", {
      d: "M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z",
    }),
  );
}
const gs = a.forwardRef(gr);
function he(e, n) {
  if (e == null) return {};
  var t = {},
    r = Object.keys(e),
    o,
    s;
  for (s = 0; s < r.length; s++)
    ((o = r[s]), !(n.indexOf(o) >= 0) && (t[o] = e[o]));
  return t;
}
var vr = ["color"],
  vs = a.forwardRef(function (e, n) {
    var t = e.color,
      r = t === void 0 ? "currentColor" : t,
      o = he(e, vr);
    return a.createElement(
      "svg",
      Object.assign(
        {
          width: "15",
          height: "15",
          viewBox: "0 0 15 15",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
        },
        o,
        { ref: n },
      ),
      a.createElement("path", {
        d: "M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z",
        fill: r,
        fillRule: "evenodd",
        clipRule: "evenodd",
      }),
    );
  }),
  mr = ["color"],
  ms = a.forwardRef(function (e, n) {
    var t = e.color,
      r = t === void 0 ? "currentColor" : t,
      o = he(e, mr);
    return a.createElement(
      "svg",
      Object.assign(
        {
          width: "15",
          height: "15",
          viewBox: "0 0 15 15",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
        },
        o,
        { ref: n },
      ),
      a.createElement("path", {
        d: "M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z",
        fill: r,
        fillRule: "evenodd",
        clipRule: "evenodd",
      }),
    );
  }),
  hr = ["color"],
  hs = a.forwardRef(function (e, n) {
    var t = e.color,
      r = t === void 0 ? "currentColor" : t,
      o = he(e, hr);
    return a.createElement(
      "svg",
      Object.assign(
        {
          width: "15",
          height: "15",
          viewBox: "0 0 15 15",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
        },
        o,
        { ref: n },
      ),
      a.createElement("path", {
        d: "M9.875 7.5C9.875 8.81168 8.81168 9.875 7.5 9.875C6.18832 9.875 5.125 8.81168 5.125 7.5C5.125 6.18832 6.18832 5.125 7.5 5.125C8.81168 5.125 9.875 6.18832 9.875 7.5Z",
        fill: r,
      }),
    );
  }),
  xr = ["color"],
  xs = a.forwardRef(function (e, n) {
    var t = e.color,
      r = t === void 0 ? "currentColor" : t,
      o = he(e, xr);
    return a.createElement(
      "svg",
      Object.assign(
        {
          width: "15",
          height: "15",
          viewBox: "0 0 15 15",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
        },
        o,
        { ref: n },
      ),
      a.createElement("path", {
        d: "M7.50005 1.04999C7.74858 1.04999 7.95005 1.25146 7.95005 1.49999V8.41359L10.1819 6.18179C10.3576 6.00605 10.6425 6.00605 10.8182 6.18179C10.994 6.35753 10.994 6.64245 10.8182 6.81819L7.81825 9.81819C7.64251 9.99392 7.35759 9.99392 7.18185 9.81819L4.18185 6.81819C4.00611 6.64245 4.00611 6.35753 4.18185 6.18179C4.35759 6.00605 4.64251 6.00605 4.81825 6.18179L7.05005 8.41359V1.49999C7.05005 1.25146 7.25152 1.04999 7.50005 1.04999ZM2.5 10C2.77614 10 3 10.2239 3 10.5V12C3 12.5539 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2239 12.2239 10 12.5 10C12.7761 10 13 10.2239 13 10.5V12C13 13.1041 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2239 2.22386 10 2.5 10Z",
        fill: r,
        fillRule: "evenodd",
        clipRule: "evenodd",
      }),
    );
  }),
  yr = ["color"],
  ys = a.forwardRef(function (e, n) {
    var t = e.color,
      r = t === void 0 ? "currentColor" : t,
      o = he(e, yr);
    return a.createElement(
      "svg",
      Object.assign(
        {
          width: "15",
          height: "15",
          viewBox: "0 0 15 15",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
        },
        o,
        { ref: n },
      ),
      a.createElement("path", {
        d: "M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM8.24992 4.49999C8.24992 4.9142 7.91413 5.24999 7.49992 5.24999C7.08571 5.24999 6.74992 4.9142 6.74992 4.49999C6.74992 4.08577 7.08571 3.74999 7.49992 3.74999C7.91413 3.74999 8.24992 4.08577 8.24992 4.49999ZM6.00003 5.99999H6.50003H7.50003C7.77618 5.99999 8.00003 6.22384 8.00003 6.49999V9.99999H8.50003H9.00003V11H8.50003H7.50003H6.50003H6.00003V9.99999H6.50003H7.00003V6.99999H6.50003H6.00003V5.99999Z",
        fill: r,
        fillRule: "evenodd",
        clipRule: "evenodd",
      }),
    );
  }),
  wr = ["color"],
  ws = a.forwardRef(function (e, n) {
    var t = e.color,
      r = t === void 0 ? "currentColor" : t,
      o = he(e, wr);
    return a.createElement(
      "svg",
      Object.assign(
        {
          width: "15",
          height: "15",
          viewBox: "0 0 15 15",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
        },
        o,
        { ref: n },
      ),
      a.createElement("path", {
        d: "M8.69667 0.0403541C8.90859 0.131038 9.03106 0.354857 8.99316 0.582235L8.0902 6.00001H12.5C12.6893 6.00001 12.8625 6.10701 12.9472 6.27641C13.0319 6.4458 13.0136 6.6485 12.8999 6.80001L6.89997 14.8C6.76167 14.9844 6.51521 15.0503 6.30328 14.9597C6.09135 14.869 5.96888 14.6452 6.00678 14.4178L6.90974 9H2.49999C2.31061 9 2.13748 8.893 2.05278 8.72361C1.96809 8.55422 1.98636 8.35151 2.09999 8.2L8.09997 0.200038C8.23828 0.0156255 8.48474 -0.0503301 8.69667 0.0403541ZM3.49999 8.00001H7.49997C7.64695 8.00001 7.78648 8.06467 7.88148 8.17682C7.97648 8.28896 8.01733 8.43723 7.99317 8.5822L7.33027 12.5596L11.5 7.00001H7.49997C7.353 7.00001 7.21347 6.93534 7.11846 6.8232C7.02346 6.71105 6.98261 6.56279 7.00678 6.41781L7.66968 2.44042L3.49999 8.00001Z",
        fill: r,
        fillRule: "evenodd",
        clipRule: "evenodd",
      }),
    );
  });
const Cr = [
    [
      "rect",
      {
        width: "14",
        height: "14",
        x: "8",
        y: "8",
        rx: "2",
        ry: "2",
        key: "17jyea",
      },
    ],
    [
      "path",
      {
        d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
        key: "zix9uf",
      },
    ],
  ],
  Cs = tr("copy", Cr);
function We() {
  return (
    (We = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var n = 1; n < arguments.length; n++) {
            var t = arguments[n];
            for (var r in t) ({}).hasOwnProperty.call(t, r) && (e[r] = t[r]);
          }
          return e;
        }),
    We.apply(null, arguments)
  );
}
var Rt = ["shift", "alt", "meta", "mod", "ctrl"],
  br = {
    esc: "escape",
    return: "enter",
    ".": "period",
    ",": "comma",
    "-": "slash",
    " ": "space",
    "`": "backquote",
    "#": "backslash",
    "+": "bracketright",
    ShiftLeft: "shift",
    ShiftRight: "shift",
    AltLeft: "alt",
    AltRight: "alt",
    MetaLeft: "meta",
    MetaRight: "meta",
    OSLeft: "meta",
    OSRight: "meta",
    ControlLeft: "ctrl",
    ControlRight: "ctrl",
  };
function re(e) {
  return ((e && br[e]) || e || "")
    .trim()
    .toLowerCase()
    .replace(/key|digit|numpad|arrow/, "");
}
function Er(e) {
  return Rt.includes(e);
}
function Ke(e, n) {
  return (n === void 0 && (n = ","), e.split(n));
}
function Ge(e, n, t) {
  n === void 0 && (n = "+");
  var r = e
      .toLocaleLowerCase()
      .split(n)
      .map(function (l) {
        return re(l);
      }),
    o = {
      alt: r.includes("alt"),
      ctrl: r.includes("ctrl") || r.includes("control"),
      shift: r.includes("shift"),
      meta: r.includes("meta"),
      mod: r.includes("mod"),
    },
    s = r.filter(function (l) {
      return !Rt.includes(l);
    });
  return We({}, o, { keys: s, description: t, hotkey: e });
}
(function () {
  (typeof document < "u" &&
    (document.addEventListener("keydown", function (e) {
      e.key !== void 0 && Mt([re(e.key), re(e.code)]);
    }),
    document.addEventListener("keyup", function (e) {
      e.key !== void 0 && _t([re(e.key), re(e.code)]);
    })),
    typeof window < "u" &&
      window.addEventListener("blur", function () {
        oe.clear();
      }));
})();
var oe = new Set();
function Qe(e) {
  return Array.isArray(e);
}
function Rr(e, n) {
  n === void 0 && (n = ",");
  var t = Qe(e) ? e : e.split(n);
  return t.every(function (r) {
    return oe.has(r.trim().toLowerCase());
  });
}
function Mt(e) {
  var n = Array.isArray(e) ? e : [e];
  (oe.has("meta") &&
    oe.forEach(function (t) {
      return !Er(t) && oe.delete(t.toLowerCase());
    }),
    n.forEach(function (t) {
      return oe.add(t.toLowerCase());
    }));
}
function _t(e) {
  var n = Array.isArray(e) ? e : [e];
  e === "meta"
    ? oe.clear()
    : n.forEach(function (t) {
        return oe.delete(t.toLowerCase());
      });
}
function Mr(e, n, t) {
  ((typeof t == "function" && t(e, n)) || t === !0) && e.preventDefault();
}
function _r(e, n, t) {
  return typeof t == "function" ? t(e, n) : t === !0 || t === void 0;
}
function Ir(e) {
  return It(e, ["input", "textarea", "select"]);
}
function It(e, n) {
  n === void 0 && (n = !1);
  var t = e.target,
    r = e.composed,
    o = null;
  return (
    Sr(t) && r
      ? (o = e.composedPath()[0] && e.composedPath()[0].tagName)
      : (o = t && t.tagName),
    Qe(n)
      ? !!(
          o &&
          n &&
          n.some(function (s) {
            var l;
            return (
              s.toLowerCase() === ((l = o) == null ? void 0 : l.toLowerCase())
            );
          })
        )
      : !!(o && n && n)
  );
}
function Sr(e) {
  return !!e.tagName && !e.tagName.startsWith("-") && e.tagName.includes("-");
}
function Dr(e, n) {
  return e.length === 0 && n
    ? (console.warn(
        'A hotkey has the "scopes" option set, however no active scopes were found. If you want to use the global scopes feature, you need to wrap your app in a <HotkeysProvider>',
      ),
      !0)
    : n
      ? e.some(function (t) {
          return n.includes(t);
        }) || e.includes("*")
      : !0;
}
var jr = function (n, t, r) {
    r === void 0 && (r = !1);
    var o = t.alt,
      s = t.meta,
      l = t.mod,
      c = t.shift,
      f = t.ctrl,
      u = t.keys,
      g = n.key,
      p = n.code,
      y = n.ctrlKey,
      m = n.metaKey,
      E = n.shiftKey,
      k = n.altKey,
      h = re(p),
      R = g.toLowerCase();
    if (
      !(u != null && u.includes(h)) &&
      !(u != null && u.includes(R)) &&
      !["ctrl", "control", "unknown", "meta", "alt", "shift", "os"].includes(h)
    )
      return !1;
    if (!r) {
      if ((o === !k && R !== "alt") || (c === !E && R !== "shift")) return !1;
      if (l) {
        if (!m && !y) return !1;
      } else if (
        (s === !m && R !== "meta" && R !== "os") ||
        (f === !y && R !== "ctrl" && R !== "control")
      )
        return !1;
    }
    return u && u.length === 1 && (u.includes(R) || u.includes(h))
      ? !0
      : u
        ? Rr(u)
        : !u;
  },
  Nr = a.createContext(void 0),
  kr = function () {
    return a.useContext(Nr);
  };
function St(e, n) {
  return e && n && typeof e == "object" && typeof n == "object"
    ? Object.keys(e).length === Object.keys(n).length &&
        Object.keys(e).reduce(function (t, r) {
          return t && St(e[r], n[r]);
        }, !0)
    : e === n;
}
var Pr = a.createContext({
    hotkeys: [],
    enabledScopes: [],
    toggleScope: function () {},
    enableScope: function () {},
    disableScope: function () {},
  }),
  Ar = function () {
    return a.useContext(Pr);
  };
function Or(e) {
  var n = a.useRef(void 0);
  return (St(n.current, e) || (n.current = e), n.current);
}
var dt = function (n) {
    (n.stopPropagation(), n.preventDefault(), n.stopImmediatePropagation());
  },
  Tr = typeof window < "u" ? a.useLayoutEffect : a.useEffect;
function Lr(e, n, t, r) {
  var o = a.useState(null),
    s = o[0],
    l = o[1],
    c = a.useRef(!1),
    f = t instanceof Array ? (r instanceof Array ? void 0 : r) : t,
    u = Qe(e) ? e.join(f?.splitKey) : e,
    g = t instanceof Array ? t : r instanceof Array ? r : void 0,
    p = a.useCallback(n, g ?? []),
    y = a.useRef(p);
  g ? (y.current = p) : (y.current = n);
  var m = Or(f),
    E = Ar(),
    k = E.enabledScopes,
    h = kr();
  return (
    Tr(
      function () {
        if (!(m?.enabled === !1 || !Dr(k, m?.scopes))) {
          var R = function (C, j) {
              var A;
              if (
                (j === void 0 && (j = !1),
                !(Ir(C) && !It(C, m?.enableOnFormTags)))
              ) {
                if (s !== null) {
                  var K = s.getRootNode();
                  if (
                    (K instanceof Document || K instanceof ShadowRoot) &&
                    K.activeElement !== s &&
                    !s.contains(K.activeElement)
                  ) {
                    dt(C);
                    return;
                  }
                }
                ((A = C.target) != null &&
                  A.isContentEditable &&
                  !(m != null && m.enableOnContentEditable)) ||
                  Ke(u, m?.splitKey).forEach(function (V) {
                    var $,
                      F = Ge(V, m?.combinationKey);
                    if (
                      jr(C, F, m?.ignoreModifiers) ||
                      (($ = F.keys) != null && $.includes("*"))
                    ) {
                      if (
                        (m != null &&
                          m.ignoreEventWhen != null &&
                          m.ignoreEventWhen(C)) ||
                        (j && c.current)
                      )
                        return;
                      if (
                        (Mr(C, F, m?.preventDefault), !_r(C, F, m?.enabled))
                      ) {
                        dt(C);
                        return;
                      }
                      (y.current(C, F), j || (c.current = !0));
                    }
                  });
              }
            },
            O = function (C) {
              C.key !== void 0 &&
                (Mt(re(C.code)),
                ((m?.keydown === void 0 && m?.keyup !== !0) ||
                  (m != null && m.keydown)) &&
                  R(C));
            },
            P = function (C) {
              C.key !== void 0 &&
                (_t(re(C.code)),
                (c.current = !1),
                m != null && m.keyup && R(C, !0));
            },
            S = s || f?.document || document;
          return (
            S.addEventListener("keyup", P),
            S.addEventListener("keydown", O),
            h &&
              Ke(u, m?.splitKey).forEach(function (T) {
                return h.addHotkey(Ge(T, m?.combinationKey, m?.description));
              }),
            function () {
              (S.removeEventListener("keyup", P),
                S.removeEventListener("keydown", O),
                h &&
                  Ke(u, m?.splitKey).forEach(function (T) {
                    return h.removeHotkey(
                      Ge(T, m?.combinationKey, m?.description),
                    );
                  }));
            }
          );
        }
      },
      [s, u, m, k],
    ),
    l
  );
}
const Fr = a.forwardRef(
  (
    {
      children: e,
      className: n = "",
      variant: t = "secondary",
      isLoading: r = !1,
      loadingText: o = "Loading...",
      icon: s = "none",
      size: l = "medium",
      shape: c = "rounded",
      title: f = "",
      isActive: u = !1,
      confirmText: g = null,
      tooltip: p,
      delayTooltip: y = !0,
      tooltipSide: m = "top",
      onClick: E,
      onMouseUp: k,
      disabled: h = !1,
      href: R,
      keyboardShortcuts: O,
      type: P = "button",
      tabIndex: S = -1,
      as: T = "button",
      ...C
    },
    j,
  ) => {
    const [A, K] = a.useState(!1),
      V = () => {
        const w = [];
        return (
          l === "xLarge" &&
            (s === "iconOnly"
              ? w.push("py-3 px-3")
              : s === "leading"
                ? w.push("py-3 pl-4 pr-6")
                : s === "trailing"
                  ? w.push("py-3 pl-6 pr-4")
                  : w.push("py-3 px-6"),
            w.push("gap-2"),
            w.push(c === "pill" ? "rounded-full" : "rounded-lg")),
          l === "large" &&
            (s === "iconOnly"
              ? w.push("py-2 px-2")
              : s === "leading"
                ? w.push("py-2 pl-3 pr-4")
                : s === "trailing"
                  ? w.push("py-2 pl-4 pr-3")
                  : w.push("py-2 px-4"),
            w.push("gap-2 text-sm"),
            w.push(c === "pill" ? "rounded-full" : "rounded-lg")),
          l === "medium" &&
            (s === "iconOnly"
              ? w.push("h-7 px-1.5")
              : s === "leading"
                ? w.push("h-7 pl-3 pr-4")
                : s === "trailing"
                  ? w.push("h-7 pl-4 pr-3")
                  : w.push("h-7 px-3"),
            w.push("gap-1.5 text-sm"),
            w.push(c === "pill" ? "rounded-full" : "rounded-lg")),
          l === "small" &&
            (s === "iconOnly"
              ? w.push("py-1 px-1")
              : s === "leading"
                ? w.push("py-1 pl-2 pr-3")
                : s === "trailing"
                  ? w.push("py-1 pl-2 pr-2")
                  : w.push("py-1 px-2"),
            w.push("gap-1.5  text-sm"),
            w.push(c === "pill" ? "rounded-full" : "rounded")),
          l === "xSmall" &&
            (s === "iconOnly"
              ? w.push("py-0.5 px-0.5")
              : s === "leading"
                ? w.push("py-0.5 pl-2 pr-3")
                : s === "trailing"
                  ? w.push("py-0.5 pl-2 pr-2")
                  : w.push("py-0.5 px-2"),
            w.push("gap-1.5 text-xs"),
            w.push(c === "pill" ? "rounded-full" : "rounded")),
          w.join(" ")
        );
      };
    function $(w) {
      if (!h && typeof E == "function") {
        if (g && !A) {
          (K(!0),
            setTimeout(() => {
              K(!1);
            }, 2e3));
          return;
        }
        (g && A && K(!1), E(w));
        return;
      }
    }
    const F = Q(
      V(),
      "font-book no-drag select-none focus:outline-none flex justify-center items-center truncate focus:ring-opacity-75 group flex-shrink-0 tracking-[0.0125em]",
      {
        "cursor-default": !h,
        "text-inverted bg-primary dark:bg-oats-neutral-100 hover:bg-secondary-strong dark:hover:bg-oats-neutral-200 focus:ring-2 focus:ring-oats-green-400/20 focus:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.20)] focus:border-ink-accent":
          t === "primary" && !h,
        "text-tertiary bg-highlight": t === "primary" && h,
        "text-white bg-accent hover:bg-accent-strong focus:ring-2 focus:ring-oats-green-400/20 focus:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.20)] focus:border-ink-accent":
          t === "accent" && !h,
        "text-oats-neutral-400 bg-background-secondary opacity-50":
          t === "accent" && h,
        "text-ink-primary bg-fill-soft hover:bg-fill-soft-hover":
          t === "secondary" && !h,
        "text-ink-tertiary bg-fill-soft": t === "secondary" && h,
        "text-inverted bg-highlight-inverted hover:bg-highlight-inverted-secondary focus:bg-highlight-inverted-secondary":
          t === "inverted",
        "text-inverted bg-transparent hover:bg-highlight-inverted focus:bg-highlight-inverted":
          t === "invertedTertiary",
        "text-secondary hover:bg-highlight-primary": t === "tertiary" && !h,
        "text-tertiary": t === "tertiary" && h,
        "shadow transition-colors rounded-lg bg-background-elevated-secondary hover:bg-highlight-faint dark:hover:bg-highlight-secondary border-border-strong border":
          t === "elevated",
        "bg-transparent text-tertiary shadow-none hover:bg-transparent dark:hover:bg-transparent":
          t === "elevated" && h,
        "bg-highlight-secondary": u && !h,
        "bg-highlight-secondary text-tertiary": u && h,
        "bg-red-600 text-white focus:bg-red-600 hover:bg-red-500 dark:text-white":
          A,
        "bg-red-200 text-red-700 dark:text-red-400 dark:bg-red-500/20 dark:hover:bg-red-500/30 hover:bg-red-300":
          t === "danger",
        "bg-transparent border focus:ring-2 focus:ring-oats-green-400/20 focus:border-ink-accent":
          t === "outline",
        "text-primary border hover:bg-highlight-faint active:bg-highlight":
          t === "outline" && !h,
        "text-tertiary border": t === "outline" && h,
        "bg-[rgba(97,221,196,0.25)] text-accent": t === "highlighted",
      },
      n,
    );
    if (O && O.some((w) => w.length === 0))
      throw new Error("Keyboard shortcut cannot be empty");
    Lr(
      O ?? "__disabled__",
      (w) => {
        (w?.preventDefault && w.preventDefault(),
          w?.stopPropagation && w.stopPropagation(),
          E && E(null));
      },
      { enableOnFormTags: !0, enabled: !!O },
    );
    const U = r
      ? i.jsxs(i.Fragment, {
          children: [i.jsx(nr, {}), o && i.jsx("span", { children: o })],
        })
      : A
        ? i.jsx("span", { children: g })
        : s === "iconOnly"
          ? i.jsx("span", { className: "transition-none", children: e })
          : i.jsx(i.Fragment, { children: e });
    return i.jsx(rr, {
      text: p || null,
      delay: y ? 500 : 0,
      side: m,
      children: R
        ? i.jsx("a", {
            ref: j,
            className: F,
            href: R,
            title: f,
            target: R.includes("mailto:") ? "_blank" : "_self  ",
            ...C,
            tabIndex: S,
            rel: "noreferrer",
            onClick: E ? $ : void 0,
            onMouseUp: h ? void 0 : k,
            children: U,
          })
        : T === "div"
          ? i.jsx("div", {
              ref: j,
              className: F,
              title: f,
              ...C,
              tabIndex: S,
              onClick: E ? $ : void 0,
              onMouseUp: h ? void 0 : k,
              role: "button",
              "aria-disabled": h,
              children: U,
            })
          : E === void 0
            ? i.jsx("button", {
                ref: j,
                className: F,
                title: f,
                type: P,
                disabled: h,
                ...C,
                tabIndex: S,
                onMouseUp: h ? void 0 : k,
                children: U,
              })
            : i.jsx("button", {
                ref: j,
                className: F,
                onMouseUp: h ? void 0 : k,
                onClick: $,
                title: f,
                type: P,
                disabled: h,
                ...C,
                tabIndex: S,
                children: U,
              }),
    });
  },
);
Fr.displayName = "Button";
function Dt(e) {
  const n = e + "CollectionProvider",
    [t, r] = be(n),
    [o, s] = t(n, { collectionRef: { current: null }, itemMap: new Map() }),
    l = (k) => {
      const { scope: h, children: R } = k,
        O = ne.useRef(null),
        P = ne.useRef(new Map()).current;
      return i.jsx(o, { scope: h, itemMap: P, collectionRef: O, children: R });
    };
  l.displayName = n;
  const c = e + "CollectionSlot",
    f = De(c),
    u = ne.forwardRef((k, h) => {
      const { scope: R, children: O } = k,
        P = s(c, R),
        S = J(h, P.collectionRef);
      return i.jsx(f, { ref: S, children: O });
    });
  u.displayName = c;
  const g = e + "CollectionItemSlot",
    p = "data-radix-collection-item",
    y = De(g),
    m = ne.forwardRef((k, h) => {
      const { scope: R, children: O, ...P } = k,
        S = ne.useRef(null),
        T = J(h, S),
        C = s(g, R);
      return (
        ne.useEffect(
          () => (
            C.itemMap.set(S, { ref: S, ...P }),
            () => {
              C.itemMap.delete(S);
            }
          ),
        ),
        i.jsx(y, { [p]: "", ref: T, children: O })
      );
    });
  m.displayName = g;
  function E(k) {
    const h = s(e + "CollectionConsumer", k);
    return ne.useCallback(() => {
      const O = h.collectionRef.current;
      if (!O) return [];
      const P = Array.from(O.querySelectorAll(`[${p}]`));
      return Array.from(h.itemMap.values()).sort(
        (C, j) => P.indexOf(C.ref.current) - P.indexOf(j.ref.current),
      );
    }, [h.collectionRef, h.itemMap]);
  }
  return [{ Provider: l, Slot: u, ItemSlot: m }, E, r];
}
var $r = a.createContext(void 0);
function jt(e) {
  const n = a.useContext($r);
  return e || n || "ltr";
}
var He = "rovingFocusGroup.onEntryFocus",
  Kr = { bubbles: !1, cancelable: !0 },
  Ee = "RovingFocusGroup",
  [Ze, Nt, Gr] = Dt(Ee),
  [Hr, kt] = be(Ee, [Gr]),
  [Vr, Br] = Hr(Ee),
  Pt = a.forwardRef((e, n) =>
    i.jsx(Ze.Provider, {
      scope: e.__scopeRovingFocusGroup,
      children: i.jsx(Ze.Slot, {
        scope: e.__scopeRovingFocusGroup,
        children: i.jsx(Ur, { ...e, ref: n }),
      }),
    }),
  );
Pt.displayName = Ee;
var Ur = a.forwardRef((e, n) => {
    const {
        __scopeRovingFocusGroup: t,
        orientation: r,
        loop: o = !1,
        dir: s,
        currentTabStopId: l,
        defaultCurrentTabStopId: c,
        onCurrentTabStopIdChange: f,
        onEntryFocus: u,
        preventScrollOnEntryFocus: g = !1,
        ...p
      } = e,
      y = a.useRef(null),
      m = J(n, y),
      E = jt(s),
      [k, h] = Ae({ prop: l, defaultProp: c ?? null, onChange: f, caller: Ee }),
      [R, O] = a.useState(!1),
      P = Oe(u),
      S = Nt(t),
      T = a.useRef(!1),
      [C, j] = a.useState(0);
    return (
      a.useEffect(() => {
        const A = y.current;
        if (A)
          return (
            A.addEventListener(He, P),
            () => A.removeEventListener(He, P)
          );
      }, [P]),
      i.jsx(Vr, {
        scope: t,
        orientation: r,
        dir: E,
        loop: o,
        currentTabStopId: k,
        onItemFocus: a.useCallback((A) => h(A), [h]),
        onItemShiftTab: a.useCallback(() => O(!0), []),
        onFocusableItemAdd: a.useCallback(() => j((A) => A + 1), []),
        onFocusableItemRemove: a.useCallback(() => j((A) => A - 1), []),
        children: i.jsx(z.div, {
          tabIndex: R || C === 0 ? -1 : 0,
          "data-orientation": r,
          ...p,
          ref: m,
          style: { outline: "none", ...e.style },
          onMouseDown: N(e.onMouseDown, () => {
            T.current = !0;
          }),
          onFocus: N(e.onFocus, (A) => {
            const K = !T.current;
            if (A.target === A.currentTarget && K && !R) {
              const V = new CustomEvent(He, Kr);
              if ((A.currentTarget.dispatchEvent(V), !V.defaultPrevented)) {
                const $ = S().filter((H) => H.focusable),
                  F = $.find((H) => H.active),
                  U = $.find((H) => H.id === k),
                  q = [F, U, ...$].filter(Boolean).map((H) => H.ref.current);
                Tt(q, g);
              }
            }
            T.current = !1;
          }),
          onBlur: N(e.onBlur, () => O(!1)),
        }),
      })
    );
  }),
  At = "RovingFocusGroupItem",
  Ot = a.forwardRef((e, n) => {
    const {
        __scopeRovingFocusGroup: t,
        focusable: r = !0,
        active: o = !1,
        tabStopId: s,
        children: l,
        ...c
      } = e,
      f = W(),
      u = s || f,
      g = Br(At, t),
      p = g.currentTabStopId === u,
      y = Nt(t),
      {
        onFocusableItemAdd: m,
        onFocusableItemRemove: E,
        currentTabStopId: k,
      } = g;
    return (
      a.useEffect(() => {
        if (r) return (m(), () => E());
      }, [r, m, E]),
      i.jsx(Ze.ItemSlot, {
        scope: t,
        id: u,
        focusable: r,
        active: o,
        children: i.jsx(z.span, {
          tabIndex: p ? 0 : -1,
          "data-orientation": g.orientation,
          ...c,
          ref: n,
          onMouseDown: N(e.onMouseDown, (h) => {
            r ? g.onItemFocus(u) : h.preventDefault();
          }),
          onFocus: N(e.onFocus, () => g.onItemFocus(u)),
          onKeyDown: N(e.onKeyDown, (h) => {
            if (h.key === "Tab" && h.shiftKey) {
              g.onItemShiftTab();
              return;
            }
            if (h.target !== h.currentTarget) return;
            const R = zr(h, g.orientation, g.dir);
            if (R !== void 0) {
              if (h.metaKey || h.ctrlKey || h.altKey || h.shiftKey) return;
              h.preventDefault();
              let P = y()
                .filter((S) => S.focusable)
                .map((S) => S.ref.current);
              if (R === "last") P.reverse();
              else if (R === "prev" || R === "next") {
                R === "prev" && P.reverse();
                const S = P.indexOf(h.currentTarget);
                P = g.loop ? qr(P, S + 1) : P.slice(S + 1);
              }
              setTimeout(() => Tt(P));
            }
          }),
          children:
            typeof l == "function"
              ? l({ isCurrentTabStop: p, hasTabStop: k != null })
              : l,
        }),
      })
    );
  });
Ot.displayName = At;
var Wr = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last",
};
function Zr(e, n) {
  return n !== "rtl"
    ? e
    : e === "ArrowLeft"
      ? "ArrowRight"
      : e === "ArrowRight"
        ? "ArrowLeft"
        : e;
}
function zr(e, n, t) {
  const r = Zr(e.key, t);
  if (
    !(n === "vertical" && ["ArrowLeft", "ArrowRight"].includes(r)) &&
    !(n === "horizontal" && ["ArrowUp", "ArrowDown"].includes(r))
  )
    return Wr[r];
}
function Tt(e, n = !1) {
  const t = document.activeElement;
  for (const r of e)
    if (
      r === t ||
      (r.focus({ preventScroll: n }), document.activeElement !== t)
    )
      return;
}
function qr(e, n) {
  return e.map((t, r) => e[(n + r) % e.length]);
}
var Yr = Pt,
  Xr = Ot,
  ze = ["Enter", " "],
  Qr = ["ArrowDown", "PageUp", "Home"],
  Lt = ["ArrowUp", "PageDown", "End"],
  Jr = [...Qr, ...Lt],
  eo = { ltr: [...ze, "ArrowRight"], rtl: [...ze, "ArrowLeft"] },
  to = { ltr: ["ArrowLeft"], rtl: ["ArrowRight"] },
  Re = "Menu",
  [we, no, ro] = Dt(Re),
  [pe, Ft] = be(Re, [ro, mt, kt]),
  Me = mt(),
  $t = kt(),
  [Kt, ie] = pe(Re),
  [oo, _e] = pe(Re),
  Gt = (e) => {
    const {
        __scopeMenu: n,
        open: t = !1,
        children: r,
        dir: o,
        onOpenChange: s,
        modal: l = !0,
      } = e,
      c = Me(n),
      [f, u] = a.useState(null),
      g = a.useRef(!1),
      p = Oe(s),
      y = jt(o);
    return (
      a.useEffect(() => {
        const m = () => {
            ((g.current = !0),
              document.addEventListener("pointerdown", E, {
                capture: !0,
                once: !0,
              }),
              document.addEventListener("pointermove", E, {
                capture: !0,
                once: !0,
              }));
          },
          E = () => (g.current = !1);
        return (
          document.addEventListener("keydown", m, { capture: !0 }),
          () => {
            (document.removeEventListener("keydown", m, { capture: !0 }),
              document.removeEventListener("pointerdown", E, { capture: !0 }),
              document.removeEventListener("pointermove", E, { capture: !0 }));
          }
        );
      }, []),
      i.jsx(ht, {
        ...c,
        children: i.jsx(Kt, {
          scope: n,
          open: t,
          onOpenChange: p,
          content: f,
          onContentChange: u,
          children: i.jsx(oo, {
            scope: n,
            onClose: a.useCallback(() => p(!1), [p]),
            isUsingKeyboardRef: g,
            dir: y,
            modal: l,
            children: r,
          }),
        }),
      })
    );
  };
Gt.displayName = Re;
var ao = "MenuAnchor",
  Je = a.forwardRef((e, n) => {
    const { __scopeMenu: t, ...r } = e,
      o = Me(t);
    return i.jsx(or, { ...o, ...r, ref: n });
  });
Je.displayName = ao;
var et = "MenuPortal",
  [so, Ht] = pe(et, { forceMount: void 0 }),
  Vt = (e) => {
    const { __scopeMenu: n, forceMount: t, children: r, container: o } = e,
      s = ie(et, n);
    return i.jsx(so, {
      scope: n,
      forceMount: t,
      children: i.jsx(fe, {
        present: t || s.open,
        children: i.jsx(xt, { asChild: !0, container: o, children: r }),
      }),
    });
  };
Vt.displayName = et;
var Y = "MenuContent",
  [io, tt] = pe(Y),
  Bt = a.forwardRef((e, n) => {
    const t = Ht(Y, e.__scopeMenu),
      { forceMount: r = t.forceMount, ...o } = e,
      s = ie(Y, e.__scopeMenu),
      l = _e(Y, e.__scopeMenu);
    return i.jsx(we.Provider, {
      scope: e.__scopeMenu,
      children: i.jsx(fe, {
        present: r || s.open,
        children: i.jsx(we.Slot, {
          scope: e.__scopeMenu,
          children: l.modal
            ? i.jsx(lo, { ...o, ref: n })
            : i.jsx(co, { ...o, ref: n }),
        }),
      }),
    });
  }),
  lo = a.forwardRef((e, n) => {
    const t = ie(Y, e.__scopeMenu),
      r = a.useRef(null),
      o = J(n, r);
    return (
      a.useEffect(() => {
        const s = r.current;
        if (s) return yt(s);
      }, []),
      i.jsx(nt, {
        ...e,
        ref: o,
        trapFocus: t.open,
        disableOutsidePointerEvents: t.open,
        disableOutsideScroll: !0,
        onFocusOutside: N(e.onFocusOutside, (s) => s.preventDefault(), {
          checkForDefaultPrevented: !1,
        }),
        onDismiss: () => t.onOpenChange(!1),
      })
    );
  }),
  co = a.forwardRef((e, n) => {
    const t = ie(Y, e.__scopeMenu);
    return i.jsx(nt, {
      ...e,
      ref: n,
      trapFocus: !1,
      disableOutsidePointerEvents: !1,
      disableOutsideScroll: !1,
      onDismiss: () => t.onOpenChange(!1),
    });
  }),
  uo = De("MenuContent.ScrollLock"),
  nt = a.forwardRef((e, n) => {
    const {
        __scopeMenu: t,
        loop: r = !1,
        trapFocus: o,
        onOpenAutoFocus: s,
        onCloseAutoFocus: l,
        disableOutsidePointerEvents: c,
        onEntryFocus: f,
        onEscapeKeyDown: u,
        onPointerDownOutside: g,
        onFocusOutside: p,
        onInteractOutside: y,
        onDismiss: m,
        disableOutsideScroll: E,
        ...k
      } = e,
      h = ie(Y, t),
      R = _e(Y, t),
      O = Me(t),
      P = $t(t),
      S = no(t),
      [T, C] = a.useState(null),
      j = a.useRef(null),
      A = J(n, j, h.onContentChange),
      K = a.useRef(0),
      V = a.useRef(""),
      $ = a.useRef(0),
      F = a.useRef(null),
      U = a.useRef("right"),
      w = a.useRef(0),
      q = E ? Ct : a.Fragment,
      H = E ? { as: uo, allowPinchZoom: !0 } : void 0,
      ce = (_) => {
        const G = V.current + _,
          Z = S().filter((x) => !x.disabled),
          d = document.activeElement,
          M = Z.find((x) => x.ref.current === d)?.textValue,
          D = Z.map((x) => x.textValue),
          b = Eo(D, G, M),
          v = Z.find((x) => x.textValue === b)?.ref.current;
        ((function x(I) {
          ((V.current = I),
            window.clearTimeout(K.current),
            I !== "" && (K.current = window.setTimeout(() => x(""), 1e3)));
        })(G),
          v && setTimeout(() => v.focus()));
      };
    (a.useEffect(() => () => window.clearTimeout(K.current), []), wt());
    const X = a.useCallback(
      (_) => U.current === F.current?.side && Mo(_, F.current?.area),
      [],
    );
    return i.jsx(io, {
      scope: t,
      searchRef: V,
      onItemEnter: a.useCallback(
        (_) => {
          X(_) && _.preventDefault();
        },
        [X],
      ),
      onItemLeave: a.useCallback(
        (_) => {
          X(_) || (j.current?.focus(), C(null));
        },
        [X],
      ),
      onTriggerLeave: a.useCallback(
        (_) => {
          X(_) && _.preventDefault();
        },
        [X],
      ),
      pointerGraceTimerRef: $,
      onPointerGraceIntentChange: a.useCallback((_) => {
        F.current = _;
      }, []),
      children: i.jsx(q, {
        ...H,
        children: i.jsx(bt, {
          asChild: !0,
          trapped: o,
          onMountAutoFocus: N(s, (_) => {
            (_.preventDefault(), j.current?.focus({ preventScroll: !0 }));
          }),
          onUnmountAutoFocus: l,
          children: i.jsx(Et, {
            asChild: !0,
            disableOutsidePointerEvents: c,
            onEscapeKeyDown: u,
            onPointerDownOutside: g,
            onFocusOutside: p,
            onInteractOutside: y,
            onDismiss: m,
            children: i.jsx(Yr, {
              asChild: !0,
              ...P,
              dir: R.dir,
              orientation: "vertical",
              loop: r,
              currentTabStopId: T,
              onCurrentTabStopIdChange: C,
              onEntryFocus: N(f, (_) => {
                R.isUsingKeyboardRef.current || _.preventDefault();
              }),
              preventScrollOnEntryFocus: !0,
              children: i.jsx(ar, {
                role: "menu",
                "aria-orientation": "vertical",
                "data-state": ln(h.open),
                "data-radix-menu-content": "",
                dir: R.dir,
                ...O,
                ...k,
                ref: A,
                style: { outline: "none", ...k.style },
                onKeyDown: N(k.onKeyDown, (_) => {
                  const Z =
                      _.target.closest("[data-radix-menu-content]") ===
                      _.currentTarget,
                    d = _.ctrlKey || _.altKey || _.metaKey,
                    M = _.key.length === 1;
                  Z &&
                    (_.key === "Tab" && _.preventDefault(),
                    !d && M && ce(_.key));
                  const D = j.current;
                  if (_.target !== D || !Jr.includes(_.key)) return;
                  _.preventDefault();
                  const v = S()
                    .filter((x) => !x.disabled)
                    .map((x) => x.ref.current);
                  (Lt.includes(_.key) && v.reverse(), Co(v));
                }),
                onBlur: N(e.onBlur, (_) => {
                  _.currentTarget.contains(_.target) ||
                    (window.clearTimeout(K.current), (V.current = ""));
                }),
                onPointerMove: N(
                  e.onPointerMove,
                  Ce((_) => {
                    const G = _.target,
                      Z = w.current !== _.clientX;
                    if (_.currentTarget.contains(G) && Z) {
                      const d = _.clientX > w.current ? "right" : "left";
                      ((U.current = d), (w.current = _.clientX));
                    }
                  }),
                ),
              }),
            }),
          }),
        }),
      }),
    });
  });
Bt.displayName = Y;
var fo = "MenuGroup",
  rt = a.forwardRef((e, n) => {
    const { __scopeMenu: t, ...r } = e;
    return i.jsx(z.div, { role: "group", ...r, ref: n });
  });
rt.displayName = fo;
var po = "MenuLabel",
  Ut = a.forwardRef((e, n) => {
    const { __scopeMenu: t, ...r } = e;
    return i.jsx(z.div, { ...r, ref: n });
  });
Ut.displayName = po;
var je = "MenuItem",
  ft = "menu.itemSelect",
  Te = a.forwardRef((e, n) => {
    const { disabled: t = !1, onSelect: r, ...o } = e,
      s = a.useRef(null),
      l = _e(je, e.__scopeMenu),
      c = tt(je, e.__scopeMenu),
      f = J(n, s),
      u = a.useRef(!1),
      g = () => {
        const p = s.current;
        if (!t && p) {
          const y = new CustomEvent(ft, { bubbles: !0, cancelable: !0 });
          (p.addEventListener(ft, (m) => r?.(m), { once: !0 }),
            sr(p, y),
            y.defaultPrevented ? (u.current = !1) : l.onClose());
        }
      };
    return i.jsx(Wt, {
      ...o,
      ref: f,
      disabled: t,
      onClick: N(e.onClick, g),
      onPointerDown: (p) => {
        (e.onPointerDown?.(p), (u.current = !0));
      },
      onPointerUp: N(e.onPointerUp, (p) => {
        u.current || p.currentTarget?.click();
      }),
      onKeyDown: N(e.onKeyDown, (p) => {
        const y = c.searchRef.current !== "";
        t ||
          (y && p.key === " ") ||
          (ze.includes(p.key) && (p.currentTarget.click(), p.preventDefault()));
      }),
    });
  });
Te.displayName = je;
var Wt = a.forwardRef((e, n) => {
    const { __scopeMenu: t, disabled: r = !1, textValue: o, ...s } = e,
      l = tt(je, t),
      c = $t(t),
      f = a.useRef(null),
      u = J(n, f),
      [g, p] = a.useState(!1),
      [y, m] = a.useState("");
    return (
      a.useEffect(() => {
        const E = f.current;
        E && m((E.textContent ?? "").trim());
      }, [s.children]),
      i.jsx(we.ItemSlot, {
        scope: t,
        disabled: r,
        textValue: o ?? y,
        children: i.jsx(Xr, {
          asChild: !0,
          ...c,
          focusable: !r,
          children: i.jsx(z.div, {
            role: "menuitem",
            "data-highlighted": g ? "" : void 0,
            "aria-disabled": r || void 0,
            "data-disabled": r ? "" : void 0,
            ...s,
            ref: u,
            onPointerMove: N(
              e.onPointerMove,
              Ce((E) => {
                r
                  ? l.onItemLeave(E)
                  : (l.onItemEnter(E),
                    E.defaultPrevented ||
                      E.currentTarget.focus({ preventScroll: !0 }));
              }),
            ),
            onPointerLeave: N(
              e.onPointerLeave,
              Ce((E) => l.onItemLeave(E)),
            ),
            onFocus: N(e.onFocus, () => p(!0)),
            onBlur: N(e.onBlur, () => p(!1)),
          }),
        }),
      })
    );
  }),
  go = "MenuCheckboxItem",
  Zt = a.forwardRef((e, n) => {
    const { checked: t = !1, onCheckedChange: r, ...o } = e;
    return i.jsx(Qt, {
      scope: e.__scopeMenu,
      checked: t,
      children: i.jsx(Te, {
        role: "menuitemcheckbox",
        "aria-checked": Ne(t) ? "mixed" : t,
        ...o,
        ref: n,
        "data-state": st(t),
        onSelect: N(o.onSelect, () => r?.(Ne(t) ? !0 : !t), {
          checkForDefaultPrevented: !1,
        }),
      }),
    });
  });
Zt.displayName = go;
var zt = "MenuRadioGroup",
  [vo, mo] = pe(zt, { value: void 0, onValueChange: () => {} }),
  qt = a.forwardRef((e, n) => {
    const { value: t, onValueChange: r, ...o } = e,
      s = Oe(r);
    return i.jsx(vo, {
      scope: e.__scopeMenu,
      value: t,
      onValueChange: s,
      children: i.jsx(rt, { ...o, ref: n }),
    });
  });
qt.displayName = zt;
var Yt = "MenuRadioItem",
  Xt = a.forwardRef((e, n) => {
    const { value: t, ...r } = e,
      o = mo(Yt, e.__scopeMenu),
      s = t === o.value;
    return i.jsx(Qt, {
      scope: e.__scopeMenu,
      checked: s,
      children: i.jsx(Te, {
        role: "menuitemradio",
        "aria-checked": s,
        ...r,
        ref: n,
        "data-state": st(s),
        onSelect: N(r.onSelect, () => o.onValueChange?.(t), {
          checkForDefaultPrevented: !1,
        }),
      }),
    });
  });
Xt.displayName = Yt;
var ot = "MenuItemIndicator",
  [Qt, ho] = pe(ot, { checked: !1 }),
  Jt = a.forwardRef((e, n) => {
    const { __scopeMenu: t, forceMount: r, ...o } = e,
      s = ho(ot, t);
    return i.jsx(fe, {
      present: r || Ne(s.checked) || s.checked === !0,
      children: i.jsx(z.span, { ...o, ref: n, "data-state": st(s.checked) }),
    });
  });
Jt.displayName = ot;
var xo = "MenuSeparator",
  en = a.forwardRef((e, n) => {
    const { __scopeMenu: t, ...r } = e;
    return i.jsx(z.div, {
      role: "separator",
      "aria-orientation": "horizontal",
      ...r,
      ref: n,
    });
  });
en.displayName = xo;
var yo = "MenuArrow",
  tn = a.forwardRef((e, n) => {
    const { __scopeMenu: t, ...r } = e,
      o = Me(t);
    return i.jsx(ir, { ...o, ...r, ref: n });
  });
tn.displayName = yo;
var at = "MenuSub",
  [wo, nn] = pe(at),
  rn = (e) => {
    const { __scopeMenu: n, children: t, open: r = !1, onOpenChange: o } = e,
      s = ie(at, n),
      l = Me(n),
      [c, f] = a.useState(null),
      [u, g] = a.useState(null),
      p = Oe(o);
    return (
      a.useEffect(() => (s.open === !1 && p(!1), () => p(!1)), [s.open, p]),
      i.jsx(ht, {
        ...l,
        children: i.jsx(Kt, {
          scope: n,
          open: r,
          onOpenChange: p,
          content: u,
          onContentChange: g,
          children: i.jsx(wo, {
            scope: n,
            contentId: W(),
            triggerId: W(),
            trigger: c,
            onTriggerChange: f,
            children: t,
          }),
        }),
      })
    );
  };
rn.displayName = at;
var ye = "MenuSubTrigger",
  on = a.forwardRef((e, n) => {
    const t = ie(ye, e.__scopeMenu),
      r = _e(ye, e.__scopeMenu),
      o = nn(ye, e.__scopeMenu),
      s = tt(ye, e.__scopeMenu),
      l = a.useRef(null),
      { pointerGraceTimerRef: c, onPointerGraceIntentChange: f } = s,
      u = { __scopeMenu: e.__scopeMenu },
      g = a.useCallback(() => {
        (l.current && window.clearTimeout(l.current), (l.current = null));
      }, []);
    return (
      a.useEffect(() => g, [g]),
      a.useEffect(() => {
        const p = c.current;
        return () => {
          (window.clearTimeout(p), f(null));
        };
      }, [c, f]),
      i.jsx(Je, {
        asChild: !0,
        ...u,
        children: i.jsx(Wt, {
          id: o.triggerId,
          "aria-haspopup": "menu",
          "aria-expanded": t.open,
          "aria-controls": o.contentId,
          "data-state": ln(t.open),
          ...e,
          ref: ae(n, o.onTriggerChange),
          onClick: (p) => {
            (e.onClick?.(p),
              !(e.disabled || p.defaultPrevented) &&
                (p.currentTarget.focus(), t.open || t.onOpenChange(!0)));
          },
          onPointerMove: N(
            e.onPointerMove,
            Ce((p) => {
              (s.onItemEnter(p),
                !p.defaultPrevented &&
                  !e.disabled &&
                  !t.open &&
                  !l.current &&
                  (s.onPointerGraceIntentChange(null),
                  (l.current = window.setTimeout(() => {
                    (t.onOpenChange(!0), g());
                  }, 100))));
            }),
          ),
          onPointerLeave: N(
            e.onPointerLeave,
            Ce((p) => {
              g();
              const y = t.content?.getBoundingClientRect();
              if (y) {
                const m = t.content?.dataset.side,
                  E = m === "right",
                  k = E ? -5 : 5,
                  h = y[E ? "left" : "right"],
                  R = y[E ? "right" : "left"];
                (s.onPointerGraceIntentChange({
                  area: [
                    { x: p.clientX + k, y: p.clientY },
                    { x: h, y: y.top },
                    { x: R, y: y.top },
                    { x: R, y: y.bottom },
                    { x: h, y: y.bottom },
                  ],
                  side: m,
                }),
                  window.clearTimeout(c.current),
                  (c.current = window.setTimeout(
                    () => s.onPointerGraceIntentChange(null),
                    300,
                  )));
              } else {
                if ((s.onTriggerLeave(p), p.defaultPrevented)) return;
                s.onPointerGraceIntentChange(null);
              }
            }),
          ),
          onKeyDown: N(e.onKeyDown, (p) => {
            const y = s.searchRef.current !== "";
            e.disabled ||
              (y && p.key === " ") ||
              (eo[r.dir].includes(p.key) &&
                (t.onOpenChange(!0), t.content?.focus(), p.preventDefault()));
          }),
        }),
      })
    );
  });
on.displayName = ye;
var an = "MenuSubContent",
  sn = a.forwardRef((e, n) => {
    const t = Ht(Y, e.__scopeMenu),
      { forceMount: r = t.forceMount, ...o } = e,
      s = ie(Y, e.__scopeMenu),
      l = _e(Y, e.__scopeMenu),
      c = nn(an, e.__scopeMenu),
      f = a.useRef(null),
      u = J(n, f);
    return i.jsx(we.Provider, {
      scope: e.__scopeMenu,
      children: i.jsx(fe, {
        present: r || s.open,
        children: i.jsx(we.Slot, {
          scope: e.__scopeMenu,
          children: i.jsx(nt, {
            id: c.contentId,
            "aria-labelledby": c.triggerId,
            ...o,
            ref: u,
            align: "start",
            side: l.dir === "rtl" ? "left" : "right",
            disableOutsidePointerEvents: !1,
            disableOutsideScroll: !1,
            trapFocus: !1,
            onOpenAutoFocus: (g) => {
              (l.isUsingKeyboardRef.current && f.current?.focus(),
                g.preventDefault());
            },
            onCloseAutoFocus: (g) => g.preventDefault(),
            onFocusOutside: N(e.onFocusOutside, (g) => {
              g.target !== c.trigger && s.onOpenChange(!1);
            }),
            onEscapeKeyDown: N(e.onEscapeKeyDown, (g) => {
              (l.onClose(), g.preventDefault());
            }),
            onKeyDown: N(e.onKeyDown, (g) => {
              const p = g.currentTarget.contains(g.target),
                y = to[l.dir].includes(g.key);
              p &&
                y &&
                (s.onOpenChange(!1), c.trigger?.focus(), g.preventDefault());
            }),
          }),
        }),
      }),
    });
  });
sn.displayName = an;
function ln(e) {
  return e ? "open" : "closed";
}
function Ne(e) {
  return e === "indeterminate";
}
function st(e) {
  return Ne(e) ? "indeterminate" : e ? "checked" : "unchecked";
}
function Co(e) {
  const n = document.activeElement;
  for (const t of e)
    if (t === n || (t.focus(), document.activeElement !== n)) return;
}
function bo(e, n) {
  return e.map((t, r) => e[(n + r) % e.length]);
}
function Eo(e, n, t) {
  const o = n.length > 1 && Array.from(n).every((u) => u === n[0]) ? n[0] : n,
    s = t ? e.indexOf(t) : -1;
  let l = bo(e, Math.max(s, 0));
  o.length === 1 && (l = l.filter((u) => u !== t));
  const f = l.find((u) => u.toLowerCase().startsWith(o.toLowerCase()));
  return f !== t ? f : void 0;
}
function Ro(e, n) {
  const { x: t, y: r } = e;
  let o = !1;
  for (let s = 0, l = n.length - 1; s < n.length; l = s++) {
    const c = n[s],
      f = n[l],
      u = c.x,
      g = c.y,
      p = f.x,
      y = f.y;
    g > r != y > r && t < ((p - u) * (r - g)) / (y - g) + u && (o = !o);
  }
  return o;
}
function Mo(e, n) {
  if (!n) return !1;
  const t = { x: e.clientX, y: e.clientY };
  return Ro(t, n);
}
function Ce(e) {
  return (n) => (n.pointerType === "mouse" ? e(n) : void 0);
}
var _o = Gt,
  Io = Je,
  So = Vt,
  Do = Bt,
  jo = rt,
  No = Ut,
  ko = Te,
  Po = Zt,
  Ao = qt,
  Oo = Xt,
  To = Jt,
  Lo = en,
  Fo = tn,
  $o = rn,
  Ko = on,
  Go = sn,
  Le = "DropdownMenu",
  [Ho] = be(Le, [Ft]),
  B = Ft(),
  [Vo, cn] = Ho(Le),
  un = (e) => {
    const {
        __scopeDropdownMenu: n,
        children: t,
        dir: r,
        open: o,
        defaultOpen: s,
        onOpenChange: l,
        modal: c = !0,
      } = e,
      f = B(n),
      u = a.useRef(null),
      [g, p] = Ae({ prop: o, defaultProp: s ?? !1, onChange: l, caller: Le });
    return i.jsx(Vo, {
      scope: n,
      triggerId: W(),
      triggerRef: u,
      contentId: W(),
      open: g,
      onOpenChange: p,
      onOpenToggle: a.useCallback(() => p((y) => !y), [p]),
      modal: c,
      children: i.jsx(_o, {
        ...f,
        open: g,
        onOpenChange: p,
        dir: r,
        modal: c,
        children: t,
      }),
    });
  };
un.displayName = Le;
var dn = "DropdownMenuTrigger",
  fn = a.forwardRef((e, n) => {
    const { __scopeDropdownMenu: t, disabled: r = !1, ...o } = e,
      s = cn(dn, t),
      l = B(t);
    return i.jsx(Io, {
      asChild: !0,
      ...l,
      children: i.jsx(z.button, {
        type: "button",
        id: s.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": s.open,
        "aria-controls": s.open ? s.contentId : void 0,
        "data-state": s.open ? "open" : "closed",
        "data-disabled": r ? "" : void 0,
        disabled: r,
        ...o,
        ref: ae(n, s.triggerRef),
        onPointerDown: N(e.onPointerDown, (c) => {
          !r &&
            c.button === 0 &&
            c.ctrlKey === !1 &&
            (s.onOpenToggle(), s.open || c.preventDefault());
        }),
        onKeyDown: N(e.onKeyDown, (c) => {
          r ||
            (["Enter", " "].includes(c.key) && s.onOpenToggle(),
            c.key === "ArrowDown" && s.onOpenChange(!0),
            ["Enter", " ", "ArrowDown"].includes(c.key) && c.preventDefault());
        }),
      }),
    });
  });
fn.displayName = dn;
var Bo = "DropdownMenuPortal",
  pn = (e) => {
    const { __scopeDropdownMenu: n, ...t } = e,
      r = B(n);
    return i.jsx(So, { ...r, ...t });
  };
pn.displayName = Bo;
var gn = "DropdownMenuContent",
  vn = a.forwardRef((e, n) => {
    const { __scopeDropdownMenu: t, ...r } = e,
      o = cn(gn, t),
      s = B(t),
      l = a.useRef(!1);
    return i.jsx(Do, {
      id: o.contentId,
      "aria-labelledby": o.triggerId,
      ...s,
      ...r,
      ref: n,
      onCloseAutoFocus: N(e.onCloseAutoFocus, (c) => {
        (l.current || o.triggerRef.current?.focus(),
          (l.current = !1),
          c.preventDefault());
      }),
      onInteractOutside: N(e.onInteractOutside, (c) => {
        const f = c.detail.originalEvent,
          u = f.button === 0 && f.ctrlKey === !0,
          g = f.button === 2 || u;
        (!o.modal || g) && (l.current = !0);
      }),
      style: {
        ...e.style,
        "--radix-dropdown-menu-content-transform-origin":
          "var(--radix-popper-transform-origin)",
        "--radix-dropdown-menu-content-available-width":
          "var(--radix-popper-available-width)",
        "--radix-dropdown-menu-content-available-height":
          "var(--radix-popper-available-height)",
        "--radix-dropdown-menu-trigger-width":
          "var(--radix-popper-anchor-width)",
        "--radix-dropdown-menu-trigger-height":
          "var(--radix-popper-anchor-height)",
      },
    });
  });
vn.displayName = gn;
var Uo = "DropdownMenuGroup",
  Wo = a.forwardRef((e, n) => {
    const { __scopeDropdownMenu: t, ...r } = e,
      o = B(t);
    return i.jsx(jo, { ...o, ...r, ref: n });
  });
Wo.displayName = Uo;
var Zo = "DropdownMenuLabel",
  mn = a.forwardRef((e, n) => {
    const { __scopeDropdownMenu: t, ...r } = e,
      o = B(t);
    return i.jsx(No, { ...o, ...r, ref: n });
  });
mn.displayName = Zo;
var zo = "DropdownMenuItem",
  hn = a.forwardRef((e, n) => {
    const { __scopeDropdownMenu: t, ...r } = e,
      o = B(t);
    return i.jsx(ko, { ...o, ...r, ref: n });
  });
hn.displayName = zo;
var qo = "DropdownMenuCheckboxItem",
  Yo = a.forwardRef((e, n) => {
    const { __scopeDropdownMenu: t, ...r } = e,
      o = B(t);
    return i.jsx(Po, { ...o, ...r, ref: n });
  });
Yo.displayName = qo;
var Xo = "DropdownMenuRadioGroup",
  Qo = a.forwardRef((e, n) => {
    const { __scopeDropdownMenu: t, ...r } = e,
      o = B(t);
    return i.jsx(Ao, { ...o, ...r, ref: n });
  });
Qo.displayName = Xo;
var Jo = "DropdownMenuRadioItem",
  ea = a.forwardRef((e, n) => {
    const { __scopeDropdownMenu: t, ...r } = e,
      o = B(t);
    return i.jsx(Oo, { ...o, ...r, ref: n });
  });
ea.displayName = Jo;
var ta = "DropdownMenuItemIndicator",
  na = a.forwardRef((e, n) => {
    const { __scopeDropdownMenu: t, ...r } = e,
      o = B(t);
    return i.jsx(To, { ...o, ...r, ref: n });
  });
na.displayName = ta;
var ra = "DropdownMenuSeparator",
  xn = a.forwardRef((e, n) => {
    const { __scopeDropdownMenu: t, ...r } = e,
      o = B(t);
    return i.jsx(Lo, { ...o, ...r, ref: n });
  });
xn.displayName = ra;
var oa = "DropdownMenuArrow",
  aa = a.forwardRef((e, n) => {
    const { __scopeDropdownMenu: t, ...r } = e,
      o = B(t);
    return i.jsx(Fo, { ...o, ...r, ref: n });
  });
aa.displayName = oa;
var sa = (e) => {
    const {
        __scopeDropdownMenu: n,
        children: t,
        open: r,
        onOpenChange: o,
        defaultOpen: s,
      } = e,
      l = B(n),
      [c, f] = Ae({
        prop: r,
        defaultProp: s ?? !1,
        onChange: o,
        caller: "DropdownMenuSub",
      });
    return i.jsx($o, { ...l, open: c, onOpenChange: f, children: t });
  },
  ia = "DropdownMenuSubTrigger",
  yn = a.forwardRef((e, n) => {
    const { __scopeDropdownMenu: t, ...r } = e,
      o = B(t);
    return i.jsx(Ko, { ...o, ...r, ref: n });
  });
yn.displayName = ia;
var la = "DropdownMenuSubContent",
  wn = a.forwardRef((e, n) => {
    const { __scopeDropdownMenu: t, ...r } = e,
      o = B(t);
    return i.jsx(Go, {
      ...o,
      ...r,
      ref: n,
      style: {
        ...e.style,
        "--radix-dropdown-menu-content-transform-origin":
          "var(--radix-popper-transform-origin)",
        "--radix-dropdown-menu-content-available-width":
          "var(--radix-popper-available-width)",
        "--radix-dropdown-menu-content-available-height":
          "var(--radix-popper-available-height)",
        "--radix-dropdown-menu-trigger-width":
          "var(--radix-popper-anchor-width)",
        "--radix-dropdown-menu-trigger-height":
          "var(--radix-popper-anchor-height)",
      },
    });
  });
wn.displayName = la;
var ca = un,
  ua = fn,
  Cn = pn,
  da = vn,
  fa = mn,
  pa = hn,
  Se = xn,
  ga = sa,
  va = yn,
  ma = wn,
  pt = 1,
  ha = 0.9,
  xa = 0.8,
  ya = 0.17,
  Ve = 0.1,
  Be = 0.999,
  wa = 0.9999,
  Ca = 0.99,
  ba = /[\\\/_+.#"@\[\(\{&]/,
  Ea = /[\\\/_+.#"@\[\(\{&]/g,
  Ra = /[\s-]/,
  bn = /[\s-]/g;
function qe(e, n, t, r, o, s, l) {
  if (s === n.length) return o === e.length ? pt : Ca;
  var c = `${o},${s}`;
  if (l[c] !== void 0) return l[c];
  for (var f = r.charAt(s), u = t.indexOf(f, o), g = 0, p, y, m, E; u >= 0; )
    ((p = qe(e, n, t, r, u + 1, s + 1, l)),
      p > g &&
        (u === o
          ? (p *= pt)
          : ba.test(e.charAt(u - 1))
            ? ((p *= xa),
              (m = e.slice(o, u - 1).match(Ea)),
              m && o > 0 && (p *= Math.pow(Be, m.length)))
            : Ra.test(e.charAt(u - 1))
              ? ((p *= ha),
                (E = e.slice(o, u - 1).match(bn)),
                E && o > 0 && (p *= Math.pow(Be, E.length)))
              : ((p *= ya), o > 0 && (p *= Math.pow(Be, u - o))),
        e.charAt(u) !== n.charAt(s) && (p *= wa)),
      ((p < Ve && t.charAt(u - 1) === r.charAt(s + 1)) ||
        (r.charAt(s + 1) === r.charAt(s) && t.charAt(u - 1) !== r.charAt(s))) &&
        ((y = qe(e, n, t, r, u + 1, s + 2, l)), y * Ve > p && (p = y * Ve)),
      p > g && (g = p),
      (u = t.indexOf(f, u + 1)));
  return ((l[c] = g), g);
}
function gt(e) {
  return e.toLowerCase().replace(bn, " ");
}
function Ma(e, n, t) {
  return (
    (e = t && t.length > 0 ? `${e + " " + t.join(" ")}` : e),
    qe(e, n, gt(e), gt(n), 0, 0, {})
  );
}
var Fe = "Dialog",
  [En] = be(Fe),
  [_a, ee] = En(Fe),
  Rn = (e) => {
    const {
        __scopeDialog: n,
        children: t,
        open: r,
        defaultOpen: o,
        onOpenChange: s,
        modal: l = !0,
      } = e,
      c = a.useRef(null),
      f = a.useRef(null),
      [u, g] = Ae({ prop: r, defaultProp: o ?? !1, onChange: s, caller: Fe });
    return i.jsx(_a, {
      scope: n,
      triggerRef: c,
      contentRef: f,
      contentId: W(),
      titleId: W(),
      descriptionId: W(),
      open: u,
      onOpenChange: g,
      onOpenToggle: a.useCallback(() => g((p) => !p), [g]),
      modal: l,
      children: t,
    });
  };
Rn.displayName = Fe;
var Mn = "DialogTrigger",
  _n = a.forwardRef((e, n) => {
    const { __scopeDialog: t, ...r } = e,
      o = ee(Mn, t),
      s = J(n, o.triggerRef);
    return i.jsx(z.button, {
      type: "button",
      "aria-haspopup": "dialog",
      "aria-expanded": o.open,
      "aria-controls": o.contentId,
      "data-state": ct(o.open),
      ...r,
      ref: s,
      onClick: N(e.onClick, o.onOpenToggle),
    });
  });
_n.displayName = Mn;
var it = "DialogPortal",
  [Ia, In] = En(it, { forceMount: void 0 }),
  Sn = (e) => {
    const { __scopeDialog: n, forceMount: t, children: r, container: o } = e,
      s = ee(it, n);
    return i.jsx(Ia, {
      scope: n,
      forceMount: t,
      children: a.Children.map(r, (l) =>
        i.jsx(fe, {
          present: t || s.open,
          children: i.jsx(xt, { asChild: !0, container: o, children: l }),
        }),
      ),
    });
  };
Sn.displayName = it;
var ke = "DialogOverlay",
  Dn = a.forwardRef((e, n) => {
    const t = In(ke, e.__scopeDialog),
      { forceMount: r = t.forceMount, ...o } = e,
      s = ee(ke, e.__scopeDialog);
    return s.modal
      ? i.jsx(fe, {
          present: r || s.open,
          children: i.jsx(Da, { ...o, ref: n }),
        })
      : null;
  });
Dn.displayName = ke;
var Sa = De("DialogOverlay.RemoveScroll"),
  Da = a.forwardRef((e, n) => {
    const { __scopeDialog: t, ...r } = e,
      o = ee(ke, t);
    return i.jsx(Ct, {
      as: Sa,
      allowPinchZoom: !0,
      shards: [o.contentRef],
      children: i.jsx(z.div, {
        "data-state": ct(o.open),
        ...r,
        ref: n,
        style: { pointerEvents: "auto", ...r.style },
      }),
    });
  }),
  ue = "DialogContent",
  jn = a.forwardRef((e, n) => {
    const t = In(ue, e.__scopeDialog),
      { forceMount: r = t.forceMount, ...o } = e,
      s = ee(ue, e.__scopeDialog);
    return i.jsx(fe, {
      present: r || s.open,
      children: s.modal
        ? i.jsx(ja, { ...o, ref: n })
        : i.jsx(Na, { ...o, ref: n }),
    });
  });
jn.displayName = ue;
var ja = a.forwardRef((e, n) => {
    const t = ee(ue, e.__scopeDialog),
      r = a.useRef(null),
      o = J(n, t.contentRef, r);
    return (
      a.useEffect(() => {
        const s = r.current;
        if (s) return yt(s);
      }, []),
      i.jsx(Nn, {
        ...e,
        ref: o,
        trapFocus: t.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: N(e.onCloseAutoFocus, (s) => {
          (s.preventDefault(), t.triggerRef.current?.focus());
        }),
        onPointerDownOutside: N(e.onPointerDownOutside, (s) => {
          const l = s.detail.originalEvent,
            c = l.button === 0 && l.ctrlKey === !0;
          (l.button === 2 || c) && s.preventDefault();
        }),
        onFocusOutside: N(e.onFocusOutside, (s) => s.preventDefault()),
      })
    );
  }),
  Na = a.forwardRef((e, n) => {
    const t = ee(ue, e.__scopeDialog),
      r = a.useRef(!1),
      o = a.useRef(!1);
    return i.jsx(Nn, {
      ...e,
      ref: n,
      trapFocus: !1,
      disableOutsidePointerEvents: !1,
      onCloseAutoFocus: (s) => {
        (e.onCloseAutoFocus?.(s),
          s.defaultPrevented ||
            (r.current || t.triggerRef.current?.focus(), s.preventDefault()),
          (r.current = !1),
          (o.current = !1));
      },
      onInteractOutside: (s) => {
        (e.onInteractOutside?.(s),
          s.defaultPrevented ||
            ((r.current = !0),
            s.detail.originalEvent.type === "pointerdown" && (o.current = !0)));
        const l = s.target;
        (t.triggerRef.current?.contains(l) && s.preventDefault(),
          s.detail.originalEvent.type === "focusin" &&
            o.current &&
            s.preventDefault());
      },
    });
  }),
  Nn = a.forwardRef((e, n) => {
    const {
        __scopeDialog: t,
        trapFocus: r,
        onOpenAutoFocus: o,
        onCloseAutoFocus: s,
        ...l
      } = e,
      c = ee(ue, t),
      f = a.useRef(null),
      u = J(n, f);
    return (
      wt(),
      i.jsxs(i.Fragment, {
        children: [
          i.jsx(bt, {
            asChild: !0,
            loop: !0,
            trapped: r,
            onMountAutoFocus: o,
            onUnmountAutoFocus: s,
            children: i.jsx(Et, {
              role: "dialog",
              id: c.contentId,
              "aria-describedby": c.descriptionId,
              "aria-labelledby": c.titleId,
              "data-state": ct(c.open),
              ...l,
              ref: u,
              onDismiss: () => c.onOpenChange(!1),
            }),
          }),
          i.jsxs(i.Fragment, {
            children: [
              i.jsx(ka, { titleId: c.titleId }),
              i.jsx(Aa, { contentRef: f, descriptionId: c.descriptionId }),
            ],
          }),
        ],
      })
    );
  }),
  lt = "DialogTitle",
  kn = a.forwardRef((e, n) => {
    const { __scopeDialog: t, ...r } = e,
      o = ee(lt, t);
    return i.jsx(z.h2, { id: o.titleId, ...r, ref: n });
  });
kn.displayName = lt;
var Pn = "DialogDescription",
  An = a.forwardRef((e, n) => {
    const { __scopeDialog: t, ...r } = e,
      o = ee(Pn, t);
    return i.jsx(z.p, { id: o.descriptionId, ...r, ref: n });
  });
An.displayName = Pn;
var On = "DialogClose",
  Tn = a.forwardRef((e, n) => {
    const { __scopeDialog: t, ...r } = e,
      o = ee(On, t);
    return i.jsx(z.button, {
      type: "button",
      ...r,
      ref: n,
      onClick: N(e.onClick, () => o.onOpenChange(!1)),
    });
  });
Tn.displayName = On;
function ct(e) {
  return e ? "open" : "closed";
}
var Ln = "DialogTitleWarning",
  [bs, Fn] = lr(Ln, { contentName: ue, titleName: lt, docsSlug: "dialog" }),
  ka = ({ titleId: e }) => {
    const n = Fn(Ln),
      t = `\`${n.contentName}\` requires a \`${n.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${n.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${n.docsSlug}`;
    return (
      a.useEffect(() => {
        e && (document.getElementById(e) || console.error(t));
      }, [t, e]),
      null
    );
  },
  Pa = "DialogDescriptionWarning",
  Aa = ({ contentRef: e, descriptionId: n }) => {
    const r = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${Fn(Pa).contentName}}.`;
    return (
      a.useEffect(() => {
        const o = e.current?.getAttribute("aria-describedby");
        n && o && (document.getElementById(n) || console.warn(r));
      }, [r, e, n]),
      null
    );
  },
  Oa = Rn,
  Es = _n,
  Ta = Sn,
  La = Dn,
  Fa = jn,
  Rs = kn,
  Ms = An,
  _s = Tn,
  $a = Symbol.for("react.lazy"),
  Pe = er[" use ".trim().toString()];
function Ka(e) {
  return typeof e == "object" && e !== null && "then" in e;
}
function $n(e) {
  return (
    e != null &&
    typeof e == "object" &&
    "$$typeof" in e &&
    e.$$typeof === $a &&
    "_payload" in e &&
    Ka(e._payload)
  );
}
function Kn(e) {
  const n = Ga(e),
    t = a.forwardRef((r, o) => {
      let { children: s, ...l } = r;
      $n(s) && typeof Pe == "function" && (s = Pe(s._payload));
      const c = a.Children.toArray(s),
        f = c.find(Va);
      if (f) {
        const u = f.props.children,
          g = c.map((p) =>
            p === f
              ? a.Children.count(u) > 1
                ? a.Children.only(null)
                : a.isValidElement(u)
                  ? u.props.children
                  : null
              : p,
          );
        return i.jsx(n, {
          ...l,
          ref: o,
          children: a.isValidElement(u) ? a.cloneElement(u, void 0, g) : null,
        });
      }
      return i.jsx(n, { ...l, ref: o, children: s });
    });
  return ((t.displayName = `${e}.Slot`), t);
}
var Is = Kn("Slot");
function Ga(e) {
  const n = a.forwardRef((t, r) => {
    let { children: o, ...s } = t;
    if (
      ($n(o) && typeof Pe == "function" && (o = Pe(o._payload)),
      a.isValidElement(o))
    ) {
      const l = Ua(o),
        c = Ba(s, o.props);
      return (
        o.type !== a.Fragment && (c.ref = r ? ae(r, l) : l),
        a.cloneElement(o, c)
      );
    }
    return a.Children.count(o) > 1 ? a.Children.only(null) : null;
  });
  return ((n.displayName = `${e}.SlotClone`), n);
}
var Ha = Symbol("radix.slottable");
function Va(e) {
  return (
    a.isValidElement(e) &&
    typeof e.type == "function" &&
    "__radixId" in e.type &&
    e.type.__radixId === Ha
  );
}
function Ba(e, n) {
  const t = { ...n };
  for (const r in n) {
    const o = e[r],
      s = n[r];
    /^on[A-Z]/.test(r)
      ? o && s
        ? (t[r] = (...c) => {
            const f = s(...c);
            return (o(...c), f);
          })
        : o && (t[r] = o)
      : r === "style"
        ? (t[r] = { ...o, ...s })
        : r === "className" && (t[r] = [o, s].filter(Boolean).join(" "));
  }
  return { ...e, ...t };
}
function Ua(e) {
  let n = Object.getOwnPropertyDescriptor(e.props, "ref")?.get,
    t = n && "isReactWarning" in n && n.isReactWarning;
  return t
    ? e.ref
    : ((n = Object.getOwnPropertyDescriptor(e, "ref")?.get),
      (t = n && "isReactWarning" in n && n.isReactWarning),
      t ? e.props.ref : e.props.ref || e.ref);
}
var Wa = [
    "a",
    "button",
    "div",
    "form",
    "h2",
    "h3",
    "img",
    "input",
    "label",
    "li",
    "nav",
    "ol",
    "p",
    "select",
    "span",
    "svg",
    "ul",
  ],
  le = Wa.reduce((e, n) => {
    const t = Kn(`Primitive.${n}`),
      r = a.forwardRef((o, s) => {
        const { asChild: l, ...c } = o,
          f = l ? t : n;
        return (
          typeof window < "u" && (window[Symbol.for("radix-ui")] = !0),
          i.jsx(f, { ...c, ref: s })
        );
      });
    return ((r.displayName = `Primitive.${n}`), { ...e, [n]: r });
  }, {}),
  xe = '[cmdk-group=""]',
  Ue = '[cmdk-group-items=""]',
  Za = '[cmdk-group-heading=""]',
  Gn = '[cmdk-item=""]',
  vt = `${Gn}:not([aria-disabled="true"])`,
  Ye = "cmdk-item-select",
  ve = "data-value",
  za = (e, n, t) => Ma(e, n, t),
  Hn = a.createContext(void 0),
  Ie = () => a.useContext(Hn),
  Vn = a.createContext(void 0),
  ut = () => a.useContext(Vn),
  Bn = a.createContext(void 0),
  Un = a.forwardRef((e, n) => {
    let t = me(() => {
        var d, M;
        return {
          search: "",
          value:
            (M = (d = e.value) != null ? d : e.defaultValue) != null ? M : "",
          selectedItemId: void 0,
          filtered: { count: 0, items: new Map(), groups: new Set() },
        };
      }),
      r = me(() => new Set()),
      o = me(() => new Map()),
      s = me(() => new Map()),
      l = me(() => new Set()),
      c = Wn(e),
      {
        label: f,
        children: u,
        value: g,
        onValueChange: p,
        filter: y,
        shouldFilter: m,
        loop: E,
        disablePointerSelection: k = !1,
        vimBindings: h = !0,
        ...R
      } = e,
      O = W(),
      P = W(),
      S = W(),
      T = a.useRef(null),
      C = as();
    (de(() => {
      if (g !== void 0) {
        let d = g.trim();
        ((t.current.value = d), j.emit());
      }
    }, [g]),
      de(() => {
        C(6, U);
      }, []));
    let j = a.useMemo(
        () => ({
          subscribe: (d) => (l.current.add(d), () => l.current.delete(d)),
          snapshot: () => t.current,
          setState: (d, M, D) => {
            var b, v, x, I;
            if (!Object.is(t.current[d], M)) {
              if (((t.current[d] = M), d === "search")) (F(), V(), C(1, $));
              else if (d === "value") {
                if (
                  document.activeElement.hasAttribute("cmdk-input") ||
                  document.activeElement.hasAttribute("cmdk-root")
                ) {
                  let L = document.getElementById(S);
                  L
                    ? L.focus()
                    : (b = document.getElementById(O)) == null || b.focus();
                }
                if (
                  (C(7, () => {
                    var L;
                    ((t.current.selectedItemId =
                      (L = w()) == null ? void 0 : L.id),
                      j.emit());
                  }),
                  D || C(5, U),
                  ((v = c.current) == null ? void 0 : v.value) !== void 0)
                ) {
                  let L = M ?? "";
                  (I = (x = c.current).onValueChange) == null || I.call(x, L);
                  return;
                }
              }
              j.emit();
            }
          },
          emit: () => {
            l.current.forEach((d) => d());
          },
        }),
        [],
      ),
      A = a.useMemo(
        () => ({
          value: (d, M, D) => {
            var b;
            M !== ((b = s.current.get(d)) == null ? void 0 : b.value) &&
              (s.current.set(d, { value: M, keywords: D }),
              t.current.filtered.items.set(d, K(M, D)),
              C(2, () => {
                (V(), j.emit());
              }));
          },
          item: (d, M) => (
            r.current.add(d),
            M &&
              (o.current.has(M)
                ? o.current.get(M).add(d)
                : o.current.set(M, new Set([d]))),
            C(3, () => {
              (F(), V(), t.current.value || $(), j.emit());
            }),
            () => {
              (s.current.delete(d),
                r.current.delete(d),
                t.current.filtered.items.delete(d));
              let D = w();
              C(4, () => {
                (F(), D?.getAttribute("id") === d && $(), j.emit());
              });
            }
          ),
          group: (d) => (
            o.current.has(d) || o.current.set(d, new Set()),
            () => {
              (s.current.delete(d), o.current.delete(d));
            }
          ),
          filter: () => c.current.shouldFilter,
          label: f || e["aria-label"],
          getDisablePointerSelection: () => c.current.disablePointerSelection,
          listId: O,
          inputId: S,
          labelId: P,
          listInnerRef: T,
        }),
        [],
      );
    function K(d, M) {
      var D, b;
      let v =
        (b = (D = c.current) == null ? void 0 : D.filter) != null ? b : za;
      return d ? v(d, t.current.search, M) : 0;
    }
    function V() {
      if (!t.current.search || c.current.shouldFilter === !1) return;
      let d = t.current.filtered.items,
        M = [];
      t.current.filtered.groups.forEach((b) => {
        let v = o.current.get(b),
          x = 0;
        (v.forEach((I) => {
          let L = d.get(I);
          x = Math.max(L, x);
        }),
          M.push([b, x]));
      });
      let D = T.current;
      (q()
        .sort((b, v) => {
          var x, I;
          let L = b.getAttribute("id"),
            te = v.getAttribute("id");
          return (
            ((x = d.get(te)) != null ? x : 0) - ((I = d.get(L)) != null ? I : 0)
          );
        })
        .forEach((b) => {
          let v = b.closest(Ue);
          v
            ? v.appendChild(b.parentElement === v ? b : b.closest(`${Ue} > *`))
            : D.appendChild(b.parentElement === D ? b : b.closest(`${Ue} > *`));
        }),
        M.sort((b, v) => v[1] - b[1]).forEach((b) => {
          var v;
          let x =
            (v = T.current) == null
              ? void 0
              : v.querySelector(`${xe}[${ve}="${encodeURIComponent(b[0])}"]`);
          x?.parentElement.appendChild(x);
        }));
    }
    function $() {
      let d = q().find((D) => D.getAttribute("aria-disabled") !== "true"),
        M = d?.getAttribute(ve);
      j.setState("value", M || void 0);
    }
    function F() {
      var d, M, D, b;
      if (!t.current.search || c.current.shouldFilter === !1) {
        t.current.filtered.count = r.current.size;
        return;
      }
      t.current.filtered.groups = new Set();
      let v = 0;
      for (let x of r.current) {
        let I =
            (M = (d = s.current.get(x)) == null ? void 0 : d.value) != null
              ? M
              : "",
          L =
            (b = (D = s.current.get(x)) == null ? void 0 : D.keywords) != null
              ? b
              : [],
          te = K(I, L);
        (t.current.filtered.items.set(x, te), te > 0 && v++);
      }
      for (let [x, I] of o.current)
        for (let L of I)
          if (t.current.filtered.items.get(L) > 0) {
            t.current.filtered.groups.add(x);
            break;
          }
      t.current.filtered.count = v;
    }
    function U() {
      var d, M, D;
      let b = w();
      b &&
        (((d = b.parentElement) == null ? void 0 : d.firstChild) === b &&
          ((D = (M = b.closest(xe)) == null ? void 0 : M.querySelector(Za)) ==
            null ||
            D.scrollIntoView({ block: "nearest" })),
        b.scrollIntoView({ block: "nearest" }));
    }
    function w() {
      var d;
      return (d = T.current) == null
        ? void 0
        : d.querySelector(`${Gn}[aria-selected="true"]`);
    }
    function q() {
      var d;
      return Array.from(
        ((d = T.current) == null ? void 0 : d.querySelectorAll(vt)) || [],
      );
    }
    function H(d) {
      let M = q()[d];
      M && j.setState("value", M.getAttribute(ve));
    }
    function ce(d) {
      var M;
      let D = w(),
        b = q(),
        v = b.findIndex((I) => I === D),
        x = b[v + d];
      ((M = c.current) != null &&
        M.loop &&
        (x =
          v + d < 0 ? b[b.length - 1] : v + d === b.length ? b[0] : b[v + d]),
        x && j.setState("value", x.getAttribute(ve)));
    }
    function X(d) {
      let M = w(),
        D = M?.closest(xe),
        b;
      for (; D && !b; )
        ((D = d > 0 ? rs(D, xe) : os(D, xe)), (b = D?.querySelector(vt)));
      b ? j.setState("value", b.getAttribute(ve)) : ce(d);
    }
    let _ = () => H(q().length - 1),
      G = (d) => {
        (d.preventDefault(), d.metaKey ? _() : d.altKey ? X(1) : ce(1));
      },
      Z = (d) => {
        (d.preventDefault(), d.metaKey ? H(0) : d.altKey ? X(-1) : ce(-1));
      };
    return a.createElement(
      le.div,
      {
        ref: n,
        tabIndex: -1,
        ...R,
        "cmdk-root": "",
        onKeyDown: (d) => {
          var M;
          (M = R.onKeyDown) == null || M.call(R, d);
          let D = d.nativeEvent.isComposing || d.keyCode === 229;
          if (!(d.defaultPrevented || D))
            switch (d.key) {
              case "n":
              case "j": {
                h && d.ctrlKey && G(d);
                break;
              }
              case "ArrowDown": {
                G(d);
                break;
              }
              case "p":
              case "k": {
                h && d.ctrlKey && Z(d);
                break;
              }
              case "ArrowUp": {
                Z(d);
                break;
              }
              case "Home": {
                (d.preventDefault(), H(0));
                break;
              }
              case "End": {
                (d.preventDefault(), _());
                break;
              }
              case "Enter": {
                d.preventDefault();
                let b = w();
                if (b) {
                  let v = new Event(Ye);
                  b.dispatchEvent(v);
                }
              }
            }
        },
      },
      a.createElement(
        "label",
        { "cmdk-label": "", htmlFor: A.inputId, id: A.labelId, style: is },
        f,
      ),
      $e(e, (d) =>
        a.createElement(
          Vn.Provider,
          { value: j },
          a.createElement(Hn.Provider, { value: A }, d),
        ),
      ),
    );
  }),
  qa = a.forwardRef((e, n) => {
    var t, r;
    let o = W(),
      s = a.useRef(null),
      l = a.useContext(Bn),
      c = Ie(),
      f = Wn(e),
      u =
        (r = (t = f.current) == null ? void 0 : t.forceMount) != null
          ? r
          : l?.forceMount;
    de(() => {
      if (!u) return c.item(o, l?.id);
    }, [u]);
    let g = Zn(o, s, [e.value, e.children, s], e.keywords),
      p = ut(),
      y = se((C) => C.value && C.value === g.current),
      m = se((C) =>
        u || c.filter() === !1
          ? !0
          : C.search
            ? C.filtered.items.get(o) > 0
            : !0,
      );
    a.useEffect(() => {
      let C = s.current;
      if (!(!C || e.disabled))
        return (C.addEventListener(Ye, E), () => C.removeEventListener(Ye, E));
    }, [m, e.onSelect, e.disabled]);
    function E() {
      var C, j;
      (k(), (j = (C = f.current).onSelect) == null || j.call(C, g.current));
    }
    function k() {
      p.setState("value", g.current, !0);
    }
    if (!m) return null;
    let {
      disabled: h,
      value: R,
      onSelect: O,
      forceMount: P,
      keywords: S,
      ...T
    } = e;
    return a.createElement(
      le.div,
      {
        ref: ae(s, n),
        ...T,
        id: o,
        "cmdk-item": "",
        role: "option",
        "aria-disabled": !!h,
        "aria-selected": !!y,
        "data-disabled": !!h,
        "data-selected": !!y,
        onPointerMove: h || c.getDisablePointerSelection() ? void 0 : k,
        onClick: h ? void 0 : E,
      },
      e.children,
    );
  }),
  Ya = a.forwardRef((e, n) => {
    let { heading: t, children: r, forceMount: o, ...s } = e,
      l = W(),
      c = a.useRef(null),
      f = a.useRef(null),
      u = W(),
      g = Ie(),
      p = se((m) =>
        o || g.filter() === !1 ? !0 : m.search ? m.filtered.groups.has(l) : !0,
      );
    (de(() => g.group(l), []), Zn(l, c, [e.value, e.heading, f]));
    let y = a.useMemo(() => ({ id: l, forceMount: o }), [o]);
    return a.createElement(
      le.div,
      {
        ref: ae(c, n),
        ...s,
        "cmdk-group": "",
        role: "presentation",
        hidden: p ? void 0 : !0,
      },
      t &&
        a.createElement(
          "div",
          { ref: f, "cmdk-group-heading": "", "aria-hidden": !0, id: u },
          t,
        ),
      $e(e, (m) =>
        a.createElement(
          "div",
          {
            "cmdk-group-items": "",
            role: "group",
            "aria-labelledby": t ? u : void 0,
          },
          a.createElement(Bn.Provider, { value: y }, m),
        ),
      ),
    );
  }),
  Xa = a.forwardRef((e, n) => {
    let { alwaysRender: t, ...r } = e,
      o = a.useRef(null),
      s = se((l) => !l.search);
    return !t && !s
      ? null
      : a.createElement(le.div, {
          ref: ae(o, n),
          ...r,
          "cmdk-separator": "",
          role: "separator",
        });
  }),
  Qa = a.forwardRef((e, n) => {
    let { onValueChange: t, ...r } = e,
      o = e.value != null,
      s = ut(),
      l = se((u) => u.search),
      c = se((u) => u.selectedItemId),
      f = Ie();
    return (
      a.useEffect(() => {
        e.value != null && s.setState("search", e.value);
      }, [e.value]),
      a.createElement(le.input, {
        ref: n,
        ...r,
        "cmdk-input": "",
        autoComplete: "off",
        autoCorrect: "off",
        spellCheck: !1,
        "aria-autocomplete": "list",
        role: "combobox",
        "aria-expanded": !0,
        "aria-controls": f.listId,
        "aria-labelledby": f.labelId,
        "aria-activedescendant": c,
        id: f.inputId,
        type: "text",
        value: o ? e.value : l,
        onChange: (u) => {
          (o || s.setState("search", u.target.value), t?.(u.target.value));
        },
      })
    );
  }),
  Ja = a.forwardRef((e, n) => {
    let { children: t, label: r = "Suggestions", ...o } = e,
      s = a.useRef(null),
      l = a.useRef(null),
      c = se((u) => u.selectedItemId),
      f = Ie();
    return (
      a.useEffect(() => {
        if (l.current && s.current) {
          let u = l.current,
            g = s.current,
            p,
            y = new ResizeObserver(() => {
              p = requestAnimationFrame(() => {
                let m = u.offsetHeight;
                g.style.setProperty("--cmdk-list-height", m.toFixed(1) + "px");
              });
            });
          return (
            y.observe(u),
            () => {
              (cancelAnimationFrame(p), y.unobserve(u));
            }
          );
        }
      }, []),
      a.createElement(
        le.div,
        {
          ref: ae(s, n),
          ...o,
          "cmdk-list": "",
          role: "listbox",
          tabIndex: -1,
          "aria-activedescendant": c,
          "aria-label": r,
          id: f.listId,
        },
        $e(e, (u) =>
          a.createElement(
            "div",
            { ref: ae(l, f.listInnerRef), "cmdk-list-sizer": "" },
            u,
          ),
        ),
      )
    );
  }),
  es = a.forwardRef((e, n) => {
    let {
      open: t,
      onOpenChange: r,
      overlayClassName: o,
      contentClassName: s,
      container: l,
      ...c
    } = e;
    return a.createElement(
      Oa,
      { open: t, onOpenChange: r },
      a.createElement(
        Ta,
        { container: l },
        a.createElement(La, { "cmdk-overlay": "", className: o }),
        a.createElement(
          Fa,
          { "aria-label": e.label, "cmdk-dialog": "", className: s },
          a.createElement(Un, { ref: n, ...c }),
        ),
      ),
    );
  }),
  ts = a.forwardRef((e, n) =>
    se((t) => t.filtered.count === 0)
      ? a.createElement(le.div, {
          ref: n,
          ...e,
          "cmdk-empty": "",
          role: "presentation",
        })
      : null,
  ),
  ns = a.forwardRef((e, n) => {
    let { progress: t, children: r, label: o = "Loading...", ...s } = e;
    return a.createElement(
      le.div,
      {
        ref: n,
        ...s,
        "cmdk-loading": "",
        role: "progressbar",
        "aria-valuenow": t,
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-label": o,
      },
      $e(e, (l) => a.createElement("div", { "aria-hidden": !0 }, l)),
    );
  }),
  ge = Object.assign(Un, {
    List: Ja,
    Item: qa,
    Input: Qa,
    Group: Ya,
    Separator: Xa,
    Dialog: es,
    Empty: ts,
    Loading: ns,
  });
function rs(e, n) {
  let t = e.nextElementSibling;
  for (; t; ) {
    if (t.matches(n)) return t;
    t = t.nextElementSibling;
  }
}
function os(e, n) {
  let t = e.previousElementSibling;
  for (; t; ) {
    if (t.matches(n)) return t;
    t = t.previousElementSibling;
  }
}
function Wn(e) {
  let n = a.useRef(e);
  return (
    de(() => {
      n.current = e;
    }),
    n
  );
}
var de = typeof window > "u" ? a.useEffect : a.useLayoutEffect;
function me(e) {
  let n = a.useRef();
  return (n.current === void 0 && (n.current = e()), n);
}
function se(e) {
  let n = ut(),
    t = () => e(n.snapshot());
  return a.useSyncExternalStore(n.subscribe, t, t);
}
function Zn(e, n, t, r = []) {
  let o = a.useRef(),
    s = Ie();
  return (
    de(() => {
      var l;
      let c = (() => {
          var u;
          for (let g of t) {
            if (typeof g == "string") return g.trim();
            if (typeof g == "object" && "current" in g)
              return g.current
                ? (u = g.current.textContent) == null
                  ? void 0
                  : u.trim()
                : o.current;
          }
        })(),
        f = r.map((u) => u.trim());
      (s.value(e, c, f),
        (l = n.current) == null || l.setAttribute(ve, c),
        (o.current = c));
    }),
    o
  );
}
var as = () => {
  let [e, n] = a.useState(),
    t = me(() => new Map());
  return (
    de(() => {
      (t.current.forEach((r) => r()), (t.current = new Map()));
    }, [e]),
    (r, o) => {
      (t.current.set(r, o), n({}));
    }
  );
};
function ss(e) {
  let n = e.type;
  return typeof n == "function"
    ? n(e.props)
    : "render" in n
      ? n.render(e.props)
      : e;
}
function $e({ asChild: e, children: n }, t) {
  return e && a.isValidElement(n)
    ? a.cloneElement(ss(n), { ref: n.ref }, t(n.props.children))
    : t(n);
}
var is = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: "0",
};
function Ss({
  content: e,
  items: n,
  headerItems: t,
  headerText: r,
  trigger: o,
  isOpen: s,
  isEnabled: l = !0,
  setIsOpen: c,
  sideOffset: f,
  avoidCollisions: u = !0,
  asChild: g = !1,
  align: p = "end",
  side: y = "bottom",
  autoFocusOnClose: m = !0,
  contentClassName: E,
  itemContainerClassName: k,
  children: h,
  compact: R = !1,
  collisionPadding: O = 4,
  asPortal: P = !0,
  search: S = !1,
  onEmptySearchSubmit: T,
  emptySearchActionLabel: C,
  stopPropagation: j,
  className: A,
}) {
  const [K, V] = a.useState(!1),
    $ = a.useRef(null),
    [F, U] = a.useState(!1),
    [w, q] = typeof s == "boolean" && c ? [s, c] : [K, V],
    H = a.useCallback(
      (v) => {
        (q?.(v), ur(v));
      },
      [q],
    ),
    [ce, X] = a.useState(!1),
    _ = a.useCallback(() => {
      const v = $.current;
      if (v) {
        const x = v.scrollHeight - v.scrollTop - v.clientHeight <= 32;
        X(x);
      }
    }, []);
  (a.useEffect(() => {
    const v = $.current;
    return (
      v?.addEventListener("scroll", _),
      () => {
        v?.removeEventListener("scroll", _);
      }
    );
  }, [_]),
    a.useEffect(() => {
      const v = () => {
        const x = $.current;
        if (x) {
          const I = x.scrollHeight > x.clientHeight;
          U(I);
        }
      };
      return (
        v(),
        window.addEventListener("resize", v),
        () => window.removeEventListener("resize", v)
      );
    }, [h]));
  const [G, Z] = a.useState("");
  a.useEffect(() => {
    w && S && Z("");
  }, [w, S]);
  const d = a.useCallback((v, x = 0) => {
      if (x > 10) return "";
      if (typeof v == "string") return v;
      if (typeof v == "number") return String(v);
      if (v == null) return "";
      if (ne.isValidElement(v)) {
        const I = v.props?.children;
        if (I != null)
          return Array.isArray(I)
            ? I.map((L) => d(L, x + 1)).join("")
            : d(I, x + 1);
      }
      return Array.isArray(v) ? v.map((I) => d(I, x + 1)).join("") : "";
    }, []),
    M = a.useMemo(() => {
      if (!S || G.trim() === "") return n;
      const v = G.trim().toLowerCase(),
        x = (I) => {
          if (
            (I.type && I.type !== "item" && I.type !== "submenu") ||
            I.hide ||
            I.disabled
          )
            return !1;
          const L = [];
          return (
            L.push(d(I.content)),
            I.description && L.push(I.description),
            L.push(d(I.leadingContent)),
            L.push(d(I.trailingContent)),
            L.some((te) => te && te.toLowerCase().includes(v))
          );
        };
      return n
        .map((I) => {
          if (I.type === "submenu" && I.submenuItems) {
            const L = I.submenuItems.filter((te) => x(te));
            return L.length > 0 ? { ...I, submenuItems: L } : null;
          }
          return x(I) ? I : null;
        })
        .filter(Boolean);
    }, [n, S, G, d]),
    D = P ? Cn : ne.Fragment,
    b = t && t.length > 0;
  return l === !1
    ? i.jsx(i.Fragment, { children: o || h })
    : i.jsxs(ca, {
        modal: P,
        open: !!w,
        onOpenChange: H,
        children: [
          i.jsx(ua, {
            className: Q("no-drag focus:outline-none focus:ring-0", A),
            asChild: g,
            children: o || h,
          }),
          i.jsx(D, {
            children: i.jsxs(i.Fragment, {
              children: [
                w &&
                  i.jsx("div", {
                    "data-dropdown-menu-overlay": !0,
                    className: "pointer-events-auto fixed inset-0 z-40",
                    "aria-hidden": !0,
                    onClick: () => H(!1),
                  }),
                i.jsxs(da, {
                  onMouseDown: (v) => {
                    j && v.stopPropagation();
                  },
                  className: Q(
                    "no-drag z-50 max-h-[32rem] min-w-[220px] max-w-sm overflow-y-auto rounded-lg bg-background-elevated-secondary px-0.5 pb-0.5 pt-0.5 shadow-lg ring ring-hairline transition-all will-change-[opacity,transform] dark:ring-inset",
                    y === "bottom"
                      ? "animate-slideDownAndFade"
                      : "animate-slideUpAndFade",
                    R && "min-w-[160px]",
                    b && "pb-0",
                    E,
                  ),
                  onCloseAutoFocus: (v) => {
                    m || v.preventDefault();
                  },
                  sideOffset: f ?? 4,
                  ref: $,
                  align: p,
                  side: y,
                  avoidCollisions: u,
                  collisionPadding: O,
                  onKeyDown: (v) => {
                    [
                      "ArrowUp",
                      "ArrowDown",
                      "ArrowLeft",
                      "ArrowRight",
                      "Enter",
                    ].includes(v.key) && v.stopPropagation();
                  },
                  children: [
                    S &&
                      i.jsxs(ge, {
                        shouldFilter: !1,
                        label: "Dropdown search",
                        loop: !0,
                        className: "flex h-full flex-col",
                        children: [
                          i.jsx("div", {
                            className:
                              "sticky top-0 z-10 -translate-y-0.5 border-b bg-background-elevated-secondary",
                            children: i.jsx(ge.Input, {
                              value: G,
                              onValueChange: Z,
                              className:
                                "w-full bg-transparent p-2 px-2.5 text-sm placeholder:text-tertiary focus:outline-none",
                              placeholder: "Search",
                              autoFocus: !0,
                            }),
                          }),
                          i.jsxs(ge.List, {
                            className: "flex-1 overflow-y-auto",
                            children: [
                              (S ? M : n).map((v, x) =>
                                i.jsxs(
                                  ge.Item,
                                  {
                                    value: `${x}-${d(v.content)}`,
                                    onSelect: async () => {
                                      v.preventCloseOnClick ||
                                        (v.onItemSelect &&
                                          (await v.onItemSelect(
                                            new Event("select"),
                                          )) === !1) ||
                                        H(!1);
                                    },
                                    className: Q(
                                      "line-clamp-1 flex w-full select-none items-center gap-2 rounded-md px-2.5 py-1.5 text-sm",
                                      "data-[selected=true]:bg-highlight-primary data-[selected=true]:text-primary",
                                      {
                                        "gap-1 px-1.5 py-1 text-xs tracking-[0.01em]":
                                          R,
                                        "pointer-events-none text-tertiary":
                                          v.disabled,
                                        "text-primary hover:bg-highlight-primary hover:outline-0":
                                          !v.disabled,
                                        "text-oats-red-300 hover:bg-oats-red-300/5":
                                          v.isDestructive,
                                      },
                                    ),
                                    children: [
                                      v.icon
                                        ? i.jsxs("div", {
                                            className:
                                              "flex flex-row items-center gap-2",
                                            children: [
                                              v.icon &&
                                                i.jsx("div", {
                                                  className: "text-tertiary",
                                                  children: v.icon,
                                                }),
                                              v.leadingContent,
                                            ],
                                          })
                                        : v.leadingContent,
                                      i.jsx("div", {
                                        className:
                                          "line-clamp-1 flex w-full flex-1 items-center gap-2",
                                        children: v.description
                                          ? i.jsxs("div", {
                                              className: "flex flex-col",
                                              children: [
                                                i.jsx("span", {
                                                  children: v.content,
                                                }),
                                                i.jsx("span", {
                                                  className:
                                                    "max-w-48 text-xs text-secondary",
                                                  children: v.description,
                                                }),
                                              ],
                                            })
                                          : v.content,
                                      }),
                                      v.trailingContent &&
                                        i.jsx("div", {
                                          className: "text-secondary",
                                          children: v.trailingContent,
                                        }),
                                    ],
                                  },
                                  `${x}-${d(v.content)}`,
                                ),
                              ),
                              S &&
                                M.length === 0 &&
                                (G.trim() !== "" && T
                                  ? i.jsx(
                                      ge.Item,
                                      {
                                        value: `create-${G.trim()}`,
                                        onSelect: async () => {
                                          (await T(G.trim())) !== !1 && H(!1);
                                        },
                                        className: Q(
                                          "line-clamp-1 flex w-full select-none items-center gap-2 rounded-md px-2.5 py-1.5 text-sm",
                                          "text-accent data-[selected=true]:bg-highlight-primary data-[selected=true]:text-accent",
                                          {
                                            "gap-1 px-1.5 py-1 text-xs tracking-[0.01em]":
                                              R,
                                          },
                                        ),
                                        children: C
                                          ? C(G.trim())
                                          : i.jsxs("span", {
                                              children: [
                                                'Create "',
                                                i.jsx("span", {
                                                  className: "font-medium",
                                                  children: G.trim(),
                                                }),
                                                '"',
                                              ],
                                            }),
                                      },
                                      `create-${G.trim()}`,
                                    )
                                  : i.jsx(ge.Empty, {
                                      className:
                                        "py-6 text-center text-sm text-tertiary",
                                      children: "No results found",
                                    })),
                            ],
                          }),
                        ],
                      }),
                    e,
                    !S &&
                      i.jsxs(i.Fragment, {
                        children: [
                          t &&
                            t.length > 0 &&
                            t.map((v, x) =>
                              i.jsxs(
                                "div",
                                {
                                  className:
                                    "sticky bottom-0 bg-background-elevated pb-0.5",
                                  children: [
                                    i.jsx(Xe, { item: v, isOpen: !!w }, x),
                                    r &&
                                      i.jsx("div", {
                                        className:
                                          "ml-2 mt-2 text-xs font-medium uppercase text-secondary",
                                        children: r,
                                      }),
                                  ],
                                },
                                x,
                              ),
                            ),
                          b && i.jsx(Se, { className: "h-1" }),
                          n.map((v, x) =>
                            i.jsx(
                              Xe,
                              {
                                item: v,
                                isOpen: !!w,
                                className: k,
                                compact: R,
                                isSelected: v.isSelected ?? !1,
                              },
                              x,
                            ),
                          ),
                        ],
                      }),
                    i.jsx(Qn, {
                      children:
                        F &&
                        !ce &&
                        !S &&
                        i.jsx(Jn.div, {
                          initial: { opacity: 0 },
                          animate: { opacity: 1 },
                          exit: { opacity: 0 },
                          className:
                            "sticky -bottom-1 -mt-16 h-16 flex-none bg-gradient-to-t from-white to-transparent dark:from-background-elevated-secondary",
                        }),
                    }),
                  ],
                }),
              ],
            }),
          }),
        ],
      });
}
function Xe({
  item: e,
  isOpen: n,
  className: t,
  compact: r = !1,
  isSelected: o = !1,
}) {
  const s = Q(t, e.className);
  if (e.hide) return null;
  if (e.type === "spacer") return i.jsx(Se, { className: "h-4" });
  if (e.type === "separator")
    return i.jsx(Se, { className: "mx-2.5 my-1 h-px bg-border" });
  if (e.type === "header")
    return i.jsx("div", {
      className:
        "flex select-none items-center gap-2 px-2.5 pb-1 pt-2 text-xs font-normal text-secondary",
      children: i.jsx("span", { className: "flex-none", children: e.content }),
    });
  if (e.type === "submenu")
    return i.jsxs(ga, {
      children: [
        i.jsxs(va, {
          className: Q(
            "line-clamp-1 flex w-full select-none items-center gap-2 rounded-md px-2.5 py-1.5 text-sm",
            {
              "gap-1 px-1.5 py-1 text-xs tracking-[0.01em]": r,
              "pointer-events-none text-tertiary": e.disabled,
              "text-primary hover:bg-highlight-primary hover:outline-0 data-[state=open]:bg-highlight-primary":
                !e.disabled,
              "text-red-700 hover:bg-red-500/15 dark:text-red-400":
                e.isDestructive,
            },
            s,
          ),
          onClick: (f) => f.stopPropagation(),
          disabled: e.disabled || !1,
          children: [
            e.icon
              ? i.jsxs("div", {
                  className: "flex flex-row items-center gap-2",
                  children: [
                    e.icon &&
                      i.jsx("div", {
                        className: "text-tertiary",
                        children: e.icon,
                      }),
                    e.leadingContent,
                  ],
                })
              : e.leadingContent,
            i.jsx("div", {
              className: "line-clamp-1 flex w-full flex-1 items-center gap-2",
              children:
                n && e.openContent
                  ? e.openContent
                  : e.description
                    ? i.jsxs("div", {
                        className: "flex flex-col",
                        children: [
                          i.jsx("span", { children: e.content }),
                          i.jsx("span", {
                            className: "max-w-48 text-xs text-secondary",
                            children: e.description,
                          }),
                        ],
                      })
                    : e.content,
            }),
            e.trailingContent &&
              i.jsx("div", {
                className: "text-secondary",
                children: e.trailingContent,
              }),
          ],
        }),
        i.jsx(Cn, {
          children: i.jsxs(ma, {
            sideOffset: e.submenuSideOffset ?? 0,
            className:
              "no-drag animate-slideRightAndFade z-50 max-h-[32rem] min-w-[220px] overflow-y-auto rounded-lg bg-background-elevated-secondary p-0.5 shadow-lg ring ring-hairline transition-all will-change-[opacity,transform] dark:ring-inset",
            children: [
              e.submenuLabel &&
                i.jsxs(i.Fragment, {
                  children: [
                    i.jsx(fa, {
                      className:
                        "px-2.5 pb-1.5 pt-3 text-sm font-medium tracking-[0.02em] text-secondary",
                      children: e.submenuLabel,
                    }),
                    i.jsx(Se, { className: "mx-2.5 my-1 h-px bg-border" }),
                  ],
                }),
              e.submenuContent
                ? e.submenuContent
                : e.submenuItems?.map((f, u) =>
                    i.jsx(
                      Xe,
                      {
                        item: f,
                        isOpen: n,
                        className: t,
                        compact: r,
                        isSelected: f.isSelected ?? !1,
                      },
                      u,
                    ),
                  ),
            ],
          }),
        }),
      ],
    });
  const l = (f) => {
      e.preventFocusOnHover && f.preventDefault();
    },
    c = i.jsxs(pa, {
      disabled: e.disabled || !1,
      onSelect: async (f) => {
        if (
          (e.preventCloseOnClick && f.preventDefault(),
          e.onItemSelect && (await e.onItemSelect(f)) === !1)
        ) {
          f.preventDefault();
          return;
        }
      },
      onClick: (f) => f.stopPropagation(),
      ...(e.preventFocusOnHover ? { onPointerMove: l, onPointerLeave: l } : {}),
      className: Q(
        "group relative flex w-full select-none items-center gap-2 rounded-md py-1.5 pl-2.5 pr-2.5 text-sm",
        o && "pr-2",
        r && "gap-1 py-1 pl-1.5 pr-1.5 text-xs tracking-[0.01em]",
        e.disabled
          ? "cursor-not-allowed text-tertiary"
          : "text-primary hover:bg-highlight-primary hover:outline-0",
        e.isDestructive &&
          (e.disabled
            ? "text-oats-red-400/50"
            : "text-oats-red-300 hover:bg-oats-red-300/5"),
        s,
      ),
      children: [
        e.icon
          ? i.jsxs("div", {
              className: "flex flex-row items-center gap-2",
              children: [
                e.icon &&
                  i.jsx("div", {
                    className: "text-tertiary",
                    children: e.icon,
                  }),
                e.leadingContent,
              ],
            })
          : e.leadingContent,
        i.jsx("div", {
          className: Q(
            "flex w-full min-w-0 flex-1 items-center gap-2",
            e.disableLineClamp ? null : "line-clamp-1",
          ),
          children:
            n && e.openContent
              ? e.openContent
              : e.description
                ? i.jsxs("div", {
                    className: "flex flex-col",
                    children: [
                      i.jsx("span", { children: e.content }),
                      i.jsx("span", {
                        className: Q(
                          "max-w-44 text-xs",
                          e.disabled ? "text-tertiary" : "text-secondary",
                        ),
                        children: e.description,
                      }),
                    ],
                  })
                : e.content,
        }),
        e.trailingContent &&
          i.jsx("div", {
            className: "text-secondary",
            children: e.trailingContent,
          }),
        o &&
          i.jsx("span", {
            className: Q(
              "pointer-events-none z-10 flex w-5 items-center justify-center",
              e.trailingContent &&
                "group-focus-within:hidden group-hover:hidden",
            ),
            children: i.jsx(cr, { className: "size-5 text-accent" }),
          }),
      ],
    });
  return e.wrapper ? e.wrapper(c) : c;
}
function Ds(e) {
  return `https://img.logo.dev/${e}?token=pk_LPVRzrNdSRaQ0zikEGiRZg&retina=true`;
}
export {
  Io as A,
  Fr as B,
  vs as C,
  Ss as D,
  Ao as E,
  gs as F,
  jo as G,
  Oo as H,
  ko as I,
  To as J,
  Fo as K,
  No as L,
  Ko as M,
  Go as N,
  La as O,
  Ta as P,
  ws as Q,
  Oa as R,
  Is as S,
  Es as T,
  xs as U,
  Ja as V,
  ts as W,
  qa as X,
  ge as _,
  Cs as a,
  Fa as b,
  Rs as c,
  Ds as d,
  Ms as e,
  _s as f,
  ms as g,
  Lr as h,
  Do as i,
  _o as j,
  hs as k,
  ca as l,
  ua as m,
  Cn as n,
  da as o,
  jt as p,
  kt as q,
  Yr as r,
  Xr as s,
  pa as t,
  ps as u,
  ys as v,
  Ft as w,
  So as x,
  Lo as y,
  Po as z,
};
//# sourceMappingURL=domainToLogoURL-n_AxeaF6.js.map
