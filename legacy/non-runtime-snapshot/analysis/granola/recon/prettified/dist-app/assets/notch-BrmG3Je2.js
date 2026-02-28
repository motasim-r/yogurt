import {
  i as u,
  a as l,
  c as E,
  b as d,
  j as t,
  A as N,
  m as j,
  R as k,
} from "./client-Bbb5Wbb6.js";
import { e as I } from "./LinkPreviewCard-DtO4M86I.js";
import { r as a } from "./index-Cnk1amp1.js";
import { L as _ } from "./LogoAnimated-CghPVPy7.js";
import { B as R } from "./BriefContent-gkHfSJP9.js";
import { i as C, E as L, l as B } from "./errorHandling-D8a-GxFB.js";
import "./cacheStore-fi4qkUF1.js";
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
    (e._sentryDebugIds[n] = "8dab6fe0-7dfa-48eb-b4cd-53b72f416133"),
    (e._sentryDebugIdIdentifier =
      "sentry-dbid-8dab6fe0-7dfa-48eb-b4cd-53b72f416133"));
} catch {}
function O() {
  const [e, n] = a.useState({
      visible: !1,
      document: null,
      topInset: 0,
      brief: null,
    }),
    [h, b] = a.useState(!1),
    f = a.useCallback(() => {
      u("notch:hide");
    }, []),
    x = a.useCallback((c) => {
      const i = c.match(/^\/meeting\/([^/?#]+)/);
      i?.[1] && u("nub:open_document", i[1]);
    }, []);
  a.useEffect(() => {
    const c = (o, s) => {
        n((r) => ({ ...r, document: s }));
      },
      i = (o, s) => {
        (s && b(!1), n((r) => ({ ...r, visible: s })));
      },
      p = (o, s) => {
        n((r) => ({ ...r, brief: s }));
      },
      y = () => {
        b(!0);
      },
      g = (o) => {
        o.key === "Escape" && f();
      };
    return (
      l("notch:document", c),
      l("notch:visible", i),
      l("notch:brief", p),
      l("notch:animate-out", y),
      window.addEventListener("keydown", g),
      E("notch:request_initial_state").then((o) => {
        n(o);
      }),
      () => {
        (d("notch:document", c),
          d("notch:visible", i),
          d("notch:brief", p),
          d("notch:animate-out", y),
          window.removeEventListener("keydown", g));
      }
    );
  }, [f]);
  const { document: w, brief: m } = e,
    v = e.visible && !!w && !!m && !h;
  return t.jsx(N, {
    onExitComplete: () => {
      h && u("notch:hide");
    },
    children:
      v &&
      t.jsxs(
        j.div,
        {
          initial: { scale: 0.9, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.9, opacity: 0 },
          transition: { type: "spring", stiffness: 400, damping: 30 },
          style: { transformOrigin: "top center" },
          className:
            "flex h-screen w-full flex-col overflow-hidden rounded-b-2xl bg-black",
          children: [
            e.topInset > 0 &&
              t.jsxs("div", {
                className: "flex shrink-0 items-center justify-between px-2",
                style: { height: e.topInset },
                children: [
                  t.jsx(_, {
                    className: "size-5",
                    logoClassName: "text-white",
                  }),
                  t.jsx("button", {
                    type: "button",
                    onClick: f,
                    className:
                      "grid size-7 place-items-center rounded-full text-white/40 transition-colors hover:text-white/80",
                    "aria-label": "Hide brief notch",
                    children: t.jsx(I, { className: "size-4" }),
                  }),
                ],
              }),
            t.jsx("div", {
              className: "min-h-0 flex-1 overflow-y-auto px-3 py-2",
              children: t.jsx(R, {
                content: m.content,
                variant: "notch",
                references: m.references ?? [],
                onNavigate: x,
              }),
            }),
          ],
        },
        "notch-content",
      ),
  });
}
function q() {
  (C(),
    document.body.classList.remove("bg-background-window"),
    document.body.classList.add("overflow-hidden", "notch"),
    (document.title = "Meeting Brief Notch"));
  const e = document.getElementById("root");
  if (!e) return;
  k.createRoot(e).render(
    t.jsx(L, { fallback: null, onError: B, children: t.jsx(O, {}) }),
  );
}
export { q as mountNotchWindow };
//# sourceMappingURL=notch-BrmG3Je2.js.map
