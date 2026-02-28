"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const A = require("node:module"),
  k = require("node:path"),
  q = require("electron"),
  u = require("./index-nkjbuASL.js");
var w = typeof document < "u" ? document.currentScript : null;
const l = 400,
  p = 230,
  x = 2;
let e = null,
  r = null,
  a = !1,
  T = 0,
  f = null,
  m = null,
  h;
const H = A.createRequire(
  typeof document > "u"
    ? require("url").pathToFileURL(__filename).href
    : (w && w.tagName.toUpperCase() === "SCRIPT" && w.src) ||
        new URL("notch-N6TmLJMo.js", document.baseURI).href,
);
function U() {
  if (h !== void 0) return h;
  try {
    h = H("node-mac-notch");
  } catch {
    h = null;
  }
  return h;
}
function E(t) {
  const n = Math.max(0, t.workArea.y - t.bounds.y);
  T = n;
  const o = {
      x: Math.round(t.workArea.x + (t.workArea.width - l) / 2),
      y: t.bounds.y,
      width: l,
      height: p + n,
    },
    i = U();
  if (!i) return o;
  try {
    const s = i.auxiliaryTopLeftArea(t.id),
      b = i.auxiliaryTopRightArea(t.id),
      M = i.safeAreaInsets(t.id);
    if (
      s.width <= x ||
      b.width <= x ||
      s.height <= 0 ||
      b.height <= 0 ||
      M.top <= 0
    )
      return o;
    const g = Math.max(0, Math.round(M.top));
    T = g;
    const S = t.bounds.x + s.width,
      _ = t.bounds.x + t.bounds.width - b.width,
      B = (S + _) / 2,
      C = Math.round(B - l / 2),
      O = t.bounds.x + t.bounds.width - l;
    return {
      x: Math.min(Math.max(C, t.bounds.x), O),
      y: t.bounds.y,
      width: l,
      height: p + g,
    };
  } catch {
    return o;
  }
}
function R() {
  !e ||
    e.isDestroyed() ||
    (c(e, "notch:visible", a),
    c(e, "notch:document", r),
    c(e, "notch:brief", f));
}
async function W(t) {
  const n = r?.id ?? null;
  if (n && m === n) return;
  (n && (m = n), (a = !0));
  const o = E(t),
    i = o.x,
    s = o.y;
  !e || e.isDestroyed()
    ? ((e = new q.BrowserWindow({
        title: "Notch",
        show: !1,
        width: l,
        height: p,
        x: i,
        y: s,
        opacity: 1,
        resizable: !1,
        minimizable: !1,
        maximizable: !1,
        fullscreenable: !1,
        closable: !0,
        alwaysOnTop: !0,
        skipTaskbar: !0,
        focusable: !0,
        hiddenInMissionControl: !0,
        frame: !1,
        roundedCorners: !1,
        hasShadow: !1,
        type: "panel",
        transparent: !0,
        backgroundColor: "#00000000",
        webPreferences: {
          nodeIntegration: !1,
          contextIsolation: !0,
          devTools: !1,
          preload: k.join(__dirname, "..", "preload", "preload.js"),
        },
      })),
      e.setAlwaysOnTop(!0, "pop-up-menu"),
      e.setVisibleOnAllWorkspaces(!0, {
        visibleOnFullScreen: !0,
        skipTransformProcessType: !0,
      }),
      e.webContents.once("did-finish-load", () => {
        R();
      }),
      e.once("ready-to-show", () => {
        !e || e.isDestroyed() || (e.show(), c(e, "notch:visible", !0));
      }),
      e.on("blur", () => {
        N();
      }),
      e.on("closed", () => {
        ((e = null), (a = !1));
      }),
      u.devServerUrl
        ? await e.loadURL(`${u.devServerUrl}#!notch`)
        : await e.loadFile(u.asarIndexHtml, { hash: "!notch" }))
    : (e.setBounds(o),
      e.show(),
      c(e, "notch:visible", !0),
      c(e, "notch:document", r));
}
const j = 400;
let d = null;
function N() {
  ((a = !1),
    e &&
      !e.isDestroyed() &&
      (c(e, "notch:animate-out"), (d = setTimeout(I, j))));
}
function I() {
  (d && (clearTimeout(d), (d = null)),
    e && !e.isDestroyed() && (e.hide(), c(e, "notch:visible", !1)));
}
function F() {
  (e && !e.isDestroyed() && (e.destroy(), (e = null)),
    (a = !1),
    (r = null),
    (m = null));
}
function L() {
  return r;
}
function v(t) {
  (r?.id !== t?.id && (m = null),
    (r = t),
    e && !e.isDestroyed() && c(e, "notch:document", t),
    D());
}
function y(t) {
  ((f = t), e && !e.isDestroyed() && c(e, "notch:brief", t));
}
function D() {
  if (!r) {
    f !== null && y(null);
    return;
  }
  const t = r.googleCalendarEvent?.id ?? r.id,
    n = u.getCacheState(),
    o = n.preMeetingBriefs?.[t],
    i = n.preMeetingBriefsExperimental?.[t];
  let s = null;
  (i?.status === "complete" && i.content
    ? (s = i)
    : o?.status === "complete" && o.content && (s = o),
    s !== f && y(s));
}
u.ipcMainOn("nub:document", (t, n) => {
  v(n);
});
u.ipcMainOn("notch:hide", () => {
  d ? I() : N();
});
u.ipcMainHandle("notch:request_initial_state", async () => ({
  visible: a,
  document: r,
  topInset: T,
  brief: f,
}));
function c(t, n, ...o) {
  t.webContents.send(n, ...o);
}
exports.destroyNotch = F;
exports.getNotchDocument = L;
exports.hideNotch = N;
exports.resolveNotchBrief = D;
exports.setNotchDocument = v;
exports.showNotch = W;
//# sourceMappingURL=notch-N6TmLJMo.js.map
