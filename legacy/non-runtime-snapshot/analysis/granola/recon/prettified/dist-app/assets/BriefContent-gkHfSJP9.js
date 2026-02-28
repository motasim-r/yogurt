import { j as n } from "./client-Bbb5Wbb6.js";
import {
  bY as w,
  c as b,
  M as k,
  b as j,
  f as N,
  i as D,
  bZ as C,
  P as _,
  L as I,
} from "./LinkPreviewCard-DtO4M86I.js";
import { r as p } from "./index-Cnk1amp1.js";
try {
  let s =
      typeof window < "u"
        ? window
        : typeof global < "u"
          ? global
          : typeof globalThis < "u"
            ? globalThis
            : typeof self < "u"
              ? self
              : {},
    t = new s.Error().stack;
  t &&
    ((s._sentryDebugIds = s._sentryDebugIds || {}),
    (s._sentryDebugIds[t] = "8cf8f792-219f-4962-9b10-4afb547ae8bd"),
    (s._sentryDebugIdIdentifier =
      "sentry-dbid-8cf8f792-219f-4962-9b10-4afb547ae8bd"));
} catch {}
const h = p.memo(function ({
  href: t,
  children: m,
  references: g,
  onNavigate: o,
  className: c,
  skipUnderline: f,
  animatedUnderlineDelayMs: l,
  animatedTextDelayMs: r,
}) {
  const [y, d] = p.useState(!1),
    a = N(t, g),
    u = D(t) ? t : void 0,
    e = C(u),
    i = n.jsx("a", {
      href: e ? void 0 : u,
      target: "_blank",
      rel: "noreferrer",
      style:
        l != null || r != null
          ? { animationDelay: `${l ?? r ?? 0}ms` }
          : void 0,
      className: b(
        f
          ? "notch-animated-link cursor-pointer no-underline underline-offset-2 transition-colors"
          : "LinkUnderline",
        c,
      ),
      onClick: (x) => {
        e && o && (x.preventDefault(), o(`/meeting/${e}`));
      },
      children:
        f && r != null
          ? n.jsx("span", {
              className:
                "inline-block animate-gradient-text-slide gradient-text-light",
              style: { animationDelay: `${r}ms` },
              children: m,
            })
          : m,
    });
  return a
    ? n.jsx(_, {
        isOpen: y,
        setIsOpen: d,
        triggerOnHover: !0,
        hoverDelay: 200,
        side: "bottom",
        align: "start",
        sideOffset: 4,
        avoidCollisions: !0,
        collisionPadding: 8,
        contentClassName: "w-auto max-w-xs",
        content: n.jsx(I, {
          title: a.title,
          source: a.source,
          link: a.link,
          onNavigate: o,
        }),
        children: i,
      })
    : i;
});
function O({
  content: s,
  variant: t = "default",
  isStreaming: m = !1,
  className: g,
  onNavigate: o,
  references: c = [],
}) {
  const f = w(s),
    l = p.useRef(0);
  t === "notch" && (l.current = 0);
  const r = 120,
    y = 400;
  function d() {
    const e = y + l.current * r;
    return ((l.current += 1), e);
  }
  const a = p.useMemo(
      () => ({
        p: ({ children: e }) => {
          if (t === "notch") {
            const i = d();
            return n.jsx("p", {
              className: "mb-2 last:mb-0",
              children: n.jsx("span", {
                className:
                  "block animate-gradient-text-slide gradient-text-light",
                style: { animationDelay: `${i}ms` },
                children: e,
              }),
            });
          }
          return n.jsx("p", { className: "mb-2 last:mb-0", children: e });
        },
        ul: ({ children: e }) =>
          n.jsx("ul", {
            className: b(
              "mb-2 space-y-0.5 last:mb-0",
              t === "notch" ? "list-none pl-2" : "list-disc pl-4",
            ),
            children: e,
          }),
        li: ({ children: e }) => {
          if (t === "notch") {
            const i = d();
            return n.jsx("li", {
              children: n.jsx("span", {
                className:
                  "block animate-gradient-text-slide gradient-text-light before:mr-1 before:content-['•']",
                style: { animationDelay: `${i}ms` },
                children: e,
              }),
            });
          }
          return n.jsx("li", { children: e });
        },
        strong: ({ children: e }) =>
          n.jsx("strong", {
            className: b(
              "font-medium",
              t === "notch" ? "text-white" : "text-ink-primary",
            ),
            children: e,
          }),
        a: ({ href: e, children: i }) =>
          t === "notch"
            ? (() => {
                const x = d();
                return n.jsx(h, {
                  href: e,
                  references: c,
                  onNavigate: o,
                  skipUnderline: !0,
                  animatedUnderlineDelayMs: x,
                  animatedTextDelayMs: x,
                  className: "text-white/80 hover:text-white",
                  children: i,
                });
              })()
            : n.jsx(h, { href: e, references: c, onNavigate: o, children: i }),
      }),
      [c, o, t],
    ),
    u = b(
      "min-w-0 antialiased [overflow-wrap:anywhere]",
      t === "default" &&
        "text-base leading-[2] tracking-wider text-ink-secondary",
      t === "notification" && "text-xs text-oats-neutral-900",
      t === "notch" && "text-xs leading-relaxed text-white/90",
      g,
    );
  return n.jsxs("div", {
    className: u,
    children: [
      n.jsx(k, { urlTransform: j, components: a, children: f }),
      m &&
        n.jsx("span", {
          className: "bg-accent/60 ml-0.5 inline-block h-4 w-0.5 animate-pulse",
        }),
    ],
  });
}
export { O as B };
//# sourceMappingURL=BriefContent-gkHfSJP9.js.map
