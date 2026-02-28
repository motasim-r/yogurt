import {
  i as d,
  a as c,
  b as l,
  j as t,
  A as m,
  m as f,
  R as h,
} from "./client-Bbb5Wbb6.js";
import { r as o } from "./index-Cnk1amp1.js";
import { F as x } from "./Square2StackIcon-B5bIQcwb.js";
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
    s = new e.Error().stack;
  s &&
    ((e._sentryDebugIds = e._sentryDebugIds || {}),
    (e._sentryDebugIds[s] = "ac854feb-f44f-494e-b855-b947dec55062"),
    (e._sentryDebugIdIdentifier =
      "sentry-dbid-ac854feb-f44f-494e-b855-b947dec55062"));
} catch {}
function g() {
  const [e, s] = o.useState(null),
    [r, p] = o.useState(""),
    u = o.useCallback(() => {
      e === null && d("nub:banner_exit_complete");
    }, [e]);
  o.useEffect(() => {
    const n = (y, i) => {
        (s(i.phase), p(i.message));
      },
      a = () => {
        s(null);
      };
    return (
      c("nub-banner:update", n),
      c("nub-banner:hide", a),
      () => {
        (l("nub-banner:update", n), l("nub-banner:hide", a));
      }
    );
  }, []);
  const b = async (n) => {
    if ((n.stopPropagation(), n.preventDefault(), !!r))
      try {
        (await navigator.clipboard.writeText(r), d("nub:banner_copied"));
      } catch (a) {
        console.error("Failed to copy consent message", a);
      }
  };
  return t.jsx("div", {
    className: "flex h-screen w-screen items-center justify-end pr-2",
    children: t.jsx(m, {
      mode: "wait",
      onExitComplete: u,
      children:
        e &&
        t.jsxs(
          f.div,
          {
            initial: { opacity: 0, scale: 0.9, x: 20 },
            animate: { opacity: 1, scale: 1, x: 0 },
            exit: { opacity: 0, scale: 0.9, x: 20 },
            transition: { type: "spring", stiffness: 300, damping: 25 },
            className:
              "flex items-center gap-2 rounded-full border border-oats-neutral-600/50 bg-oats-neutral-800/95 px-2 py-2 pl-3 shadow-lg backdrop-blur-sm",
            children: [
              e === "prompt_to_copy" &&
                t.jsxs(t.Fragment, {
                  children: [
                    t.jsx("span", {
                      className: "text-xs text-white/70",
                      children: "Let people know you're using Granola",
                    }),
                    t.jsx("button", {
                      onClick: (n) => b(n),
                      className:
                        "rounded-full bg-white/10 p-1.5 text-white/80 transition-all hover:bg-white/20 hover:text-white",
                      children: t.jsx(x, { className: "h-4 w-4" }),
                    }),
                  ],
                }),
              e === "prompt_to_paste" &&
                t.jsx("span", {
                  className: "px-1 text-xs text-white/90",
                  children: "Notice copied! Now paste into the meeting chat.",
                }),
            ],
          },
          e,
        ),
    }),
  });
}
function N() {
  (document.body.classList.remove("bg-background-window"),
    document.body.classList.add("overflow-hidden"),
    (document.title = "Nub Banner"),
    h.createRoot(document.getElementById("root")).render(t.jsx(g, {})));
}
export { N as mountNubBannerWindow };
//# sourceMappingURL=nub-banner-DZwYCmmF.js.map
