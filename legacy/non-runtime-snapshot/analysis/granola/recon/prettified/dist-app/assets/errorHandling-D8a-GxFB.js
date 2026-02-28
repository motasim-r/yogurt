import { r as i, l as c, u } from "./index-Cnk1amp1.js";
import "./client-Bbb5Wbb6.js";
import { ch as f } from "./cacheStore-fi4qkUF1.js";
try {
  let r =
      typeof window < "u"
        ? window
        : typeof global < "u"
          ? global
          : typeof globalThis < "u"
            ? globalThis
            : typeof self < "u"
              ? self
              : {},
    e = new r.Error().stack;
  e &&
    ((r._sentryDebugIds = r._sentryDebugIds || {}),
    (r._sentryDebugIds[e] = "02b252c5-dd73-4f96-9a1f-ef225c810ba1"),
    (r._sentryDebugIdIdentifier =
      "sentry-dbid-02b252c5-dd73-4f96-9a1f-ef225c810ba1"));
} catch {}
const m = i.createContext(null),
  l = { didCatch: !1, error: null };
class b extends i.Component {
  constructor(e) {
    (super(e),
      (this.resetErrorBoundary = this.resetErrorBoundary.bind(this)),
      (this.state = l));
  }
  static getDerivedStateFromError(e) {
    return { didCatch: !0, error: e };
  }
  resetErrorBoundary() {
    const { error: e } = this.state;
    if (e !== null) {
      for (var n, t, o = arguments.length, a = new Array(o), s = 0; s < o; s++)
        a[s] = arguments[s];
      ((n = (t = this.props).onReset) === null ||
        n === void 0 ||
        n.call(t, { args: a, reason: "imperative-api" }),
        this.setState(l));
    }
  }
  componentDidCatch(e, n) {
    var t, o;
    (t = (o = this.props).onError) === null || t === void 0 || t.call(o, e, n);
  }
  componentDidUpdate(e, n) {
    const { didCatch: t } = this.state,
      { resetKeys: o } = this.props;
    if (t && n.error !== null && p(e.resetKeys, o)) {
      var a, s;
      ((a = (s = this.props).onReset) === null ||
        a === void 0 ||
        a.call(s, { next: o, prev: e.resetKeys, reason: "keys" }),
        this.setState(l));
    }
  }
  render() {
    const {
        children: e,
        fallbackRender: n,
        FallbackComponent: t,
        fallback: o,
      } = this.props,
      { didCatch: a, error: s } = this.state;
    let d = e;
    if (a) {
      const h = { error: s, resetErrorBoundary: this.resetErrorBoundary };
      if (i.isValidElement(o)) d = o;
      else if (typeof n == "function") d = n(h);
      else if (t) d = i.createElement(t, h);
      else throw s;
    }
    return i.createElement(
      m.Provider,
      {
        value: {
          didCatch: a,
          error: s,
          resetErrorBoundary: this.resetErrorBoundary,
        },
      },
      d,
    );
  }
}
function p() {
  let r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [],
    e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
  return r.length !== e.length || r.some((n, t) => !Object.is(n, e[t]));
}
function v(r, e) {
  (c("error", "react-error", { componentStack: e.componentStack, error: f(r) }),
    u(r, { extra: { componentStack: e.componentStack } }));
}
function w() {
  (window.addEventListener("error", (r) => {
    const { message: e, filename: n, lineno: t, colno: o, error: a } = r;
    (c("error", "window-error", {
      message: e,
      filename: n,
      lineno: t,
      colno: o,
      error: f(a),
    }),
      u(a ?? new Error(e)));
  }),
    window.addEventListener("unhandledrejection", (r) => {
      const e = r.reason;
      (c("error", "unhandled-promise-rejection", { error: f(e) }),
        u(e ?? new Error("Unhandled promise rejection")));
    }));
}
export { b as E, w as i, v as l };
//# sourceMappingURL=errorHandling-D8a-GxFB.js.map
