import {
  j as e,
  A,
  m as C,
  a as y,
  b as j,
  i as f,
  c as B,
  R as Z,
} from "./client-Bbb5Wbb6.js";
import {
  R as D,
  u as P,
  g as K,
  V as J,
  T as Q,
  F as ee,
  A as O,
  i as te,
  a as ne,
  b as se,
  c as re,
  d as ae,
  E as oe,
  S as ie,
  P as ce,
  e as le,
} from "./getAPIEndpointInWindow-DWaV4NYo.js";
import {
  I as V,
  M as ue,
  b as de,
  f as fe,
  i as be,
  P as me,
  L as pe,
  a as G,
  d as X,
} from "./LinkPreviewCard-DtO4M86I.js";
import { r as s, l as k, s as he } from "./index-Cnk1amp1.js";
import { S as z, l as I, X as xe } from "./Spinner-y5NAgbbf.js";
import { F as ge } from "./Square2StackIcon-B5bIQcwb.js";
import { u as q, i as _e, g as ve } from "./cacheStore-fi4qkUF1.js";
import { i as we, E as ye, l as je } from "./errorHandling-D8a-GxFB.js";
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
    a = new t.Error().stack;
  a &&
    ((t._sentryDebugIds = t._sentryDebugIds || {}),
    (t._sentryDebugIds[a] = "73afb220-0026-4367-91ca-8e8a277e9ffd"),
    (t._sentryDebugIdIdentifier =
      "sentry-dbid-73afb220-0026-4367-91ca-8e8a277e9ffd"));
} catch {}
function Ne({ children: t }) {
  return e.jsx("div", {
    className: "flex w-full flex-1 flex-col items-center",
    children: e.jsx("div", {
      className:
        "no-drag flex w-full flex-1 flex-col items-center justify-center gap-2 p-2 py-2 pt-2.5",
      children: t,
    }),
  });
}
function Se({ visible: t }) {
  return e.jsx(A, {
    children:
      t &&
      e.jsx(C.div, {
        initial: { opacity: 0, height: 0 },
        animate: { opacity: 1, height: 20 },
        exit: { opacity: 0, height: 0 },
        transition: { duration: 0.1 },
        className: "flex w-full",
        children: e.jsx("div", {
          className:
            "flex w-full flex-row items-center justify-center border-t border-oats-neutral-600/95 pb-2 pt-1.5",
          children: e.jsx("div", {
            className: "grid grid-cols-3 gap-[2px]",
            children: [0, 1, 2, 3, 4, 5].map((a) =>
              e.jsx(
                "div",
                { className: "size-[2px] rounded-full bg-oats-neutral-500" },
                a,
              ),
            ),
          }),
        }),
      }),
  });
}
function Ee() {
  return e.jsx(e.Fragment, {
    children: e.jsx(V, {
      size: 16,
      className: "mb-0.5 block text-white opacity-80",
    }),
  });
}
function Ce({ transcriptionState: t }) {
  return s.useMemo(() => {
    if (!t) return null;
    switch (t) {
      case "starting":
      case "error":
        return e.jsx("div", {
          className: "flex size-5 items-center justify-center",
          children: e.jsx(z, { className: "size-3 text-white opacity-40" }),
        });
      default:
        return e.jsx(D, {
          variant: "nub",
          barsClassName: "bg-background-dancing-bars w-0.5",
          containerClassName: "gap-[3px] w-[12px]",
        });
    }
  }, [t]);
}
function ke({ children: t, onClick: a, hasError: o = !1 }) {
  return e.jsx("div", {
    onClick: a,
    className: `relative flex cursor-pointer flex-col items-center justify-center gap-1 overflow-visible rounded-full border border-oats-neutral-600/95 p-0 shadow-[0_2px_4px_-1px_rgba(0,0,0,0.7)] ring-[0.75px] ring-black/80 ${o ? "bg-red-600/70" : "bg-oats-neutral-800/95"}`,
    children: t,
  });
}
function Te({ children: t }) {
  return e.jsx("div", {
    className: "relative flex h-screen w-screen items-center justify-end pr-1",
    children: t,
  });
}
function Ie({ onClick: t }) {
  return e.jsx(C.button, {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    onClick: (a) => {
      (a.stopPropagation(), t());
    },
    className:
      "no-drag mt-0.5 p-1 text-white/60 transition-all hover:text-white",
    children: e.jsx(ge, { className: "-ml-px h-4 w-4" }),
  });
}
const Re = 1e4,
  Me = 3e3;
function Be({ viewingDocument: t, visible: a }) {
  const [o, l] = s.useState("dismissed"),
    [n, d] = s.useState(!1),
    [i, m] = s.useState(null),
    [u, N] = s.useState(!1);
  (s.useEffect(() => {
    const r = () => {
        (f("nub:log", "consent_nub:banner_copied_received", {}),
          l("prompt_to_paste"),
          I("nub_consent_banner_copied", {}));
      },
      p = (w, b) => {
        b.source === "system" &&
          N(
            (h) => (
              h ||
                (f("nub:log", "consent_nub:other_participant_detected", {
                  chunk_id: b.id,
                }),
                I("nub_consent_other_participant_detected", {
                  document_id: b.document_id,
                })),
              !0
            ),
          );
      };
    return (
      y("nub:banner_copied", r),
      y("nub:transcript_chunk", p),
      () => {
        (j("nub:banner_copied", r), j("nub:transcript_chunk", p));
      }
    );
  }, []),
    s.useEffect(() => {
      const r = t?.id ?? null;
      r !== i &&
        (f("nub:log", "consent_nub:document_changed", { from: i, to: r }),
        m(r),
        d(!1),
        l("dismissed"),
        N(!1));
    }, [t?.id, i]),
    s.useEffect(() => {
      (f("nub:log", "consent_nub:check_show_banner", {
        transcriptionState: t?.transcriptionState,
        consentBannerEnabled: t?.consentBanner?.enabled,
        hasShownInitialPrompt: n,
        consentPhase: o,
        otherParticipantHasSpoken: u,
      }),
        (t?.transcriptionState === "starting" ||
          t?.transcriptionState === "active") &&
          t?.consentBanner?.enabled &&
          !n &&
          u &&
          (f("nub:log", "consent_nub:showing_prompt_to_copy", {
            reason: "all_conditions_met",
          }),
          l("prompt_to_copy"),
          d(!0),
          I("nub_consent_banner_shown", {
            trigger: "other_participant_spoke",
          })),
        t?.transcriptionState === "inactive" &&
          (f("nub:log", "consent_nub:transcription_inactive", {}),
          l(n ? "settled" : "dismissed"),
          d(!1)));
    }, [t?.transcriptionState, t?.consentBanner?.enabled, n, o, u]));
  const T = o === "prompt_to_copy" || o === "prompt_to_paste",
    S = t?.consentBanner?.message || "";
  (s.useEffect(() => {
    a && T && S ? f("nub:banner_shown", o, S) : f("nub:banner_hidden");
  }, [a, T, o, S]),
    s.useEffect(() => {
      if (!a) return;
      let r = null,
        p = null;
      if (
        (o === "prompt_to_copy" && ((r = "settled"), (p = Re)),
        o === "prompt_to_paste" && ((r = "settled"), (p = Me)),
        r && p)
      ) {
        const w = setTimeout(() => {
          (f("nub:log", "consent_nub:timeout_to_phase", { from: o, to: r }),
            l(r),
            I("nub_consent_banner_" + r, {}));
        }, p);
        return () => clearTimeout(w);
      }
    }, [o, a]));
  const x = s.useCallback(async () => {
    if (t?.consentBanner?.message)
      try {
        (await navigator.clipboard.writeText(t.consentBanner.message),
          l("prompt_to_paste"),
          I("nub_consent_banner_copied", {}),
          f("nub:log", "consent_banner_copied", {}));
      } catch (r) {
        console.error("Failed to copy consent message", r);
      }
  }, [t?.consentBanner?.message]);
  return {
    showCopyIcon:
      (o === "prompt_to_paste" || o === "settled") &&
      !!t?.consentBanner?.enabled &&
      i === t?.id,
    handleCopy: x,
  };
}
function Pe({ logPrefix: t }) {
  const [a, o] = s.useState(!1),
    [l, n] = s.useState(!1),
    [d, i] = s.useState(null);
  s.useEffect(() => {
    const u = (x, g) => {
        (f("nub:log", `${t}:document`, { "is document null": g === null }),
          i(g));
      },
      N = (x, g) => {
        (o(g), f("nub:log", `${t}:visible`, { visible: g }));
      },
      T = (x, g) => {
        n(g);
      },
      S = (x, g) => {
        n(g);
      };
    return (
      y("nub:document", u),
      y("nub:visible", N),
      y("nub:hover", T),
      y("nub:hover_state", S),
      B("nub:request_initial_state").then((x) => {
        (o(x.visible), i(x.document), n(x.isHovered ?? !1));
      }),
      () => {
        (j("nub:document", u),
          j("nub:visible", N),
          j("nub:hover", T),
          j("nub:hover_state", S));
      }
    );
  }, [t]);
  const m = s.useCallback(() => {
    d &&
      (I("nub_action", { action: "click" }),
      k("info", `nub-click-${t}`),
      f("nub:open_document", d.id));
  }, [d, t]);
  return { visible: a, hover: l, viewingDocument: d, handleNubClick: m };
}
const He = 200,
  Fe = 60;
function Oe({ viewingDocument: t, visible: a, hover: o, dragging: l }) {
  const n = P("pre_meeting_brief_in_meeting_surface", null) === "nub",
    d = P("pre_meeting_brief_enabled", !1),
    [i, m] = s.useState(!1),
    [u, N] = s.useState(!1),
    [T, S] = s.useState(!1),
    x = s.useRef(null),
    g = s.useRef(null),
    r = s.useRef(null),
    p = s.useRef(!1),
    w = s.useRef(!1),
    b = s.useCallback(() => {
      (N(!0),
        (x.current = setTimeout(() => {
          ((x.current = null), S(!0));
        }, Fe)));
    }, []),
    h = s.useCallback(() => {
      (x.current && (clearTimeout(x.current), (x.current = null)),
        S(!1),
        N(!1));
    }, []),
    _ = t?.googleCalendarEvent?.id ?? null,
    H = q((E) => {
      if (_) return E.preMeetingBriefs?.[_];
    }),
    F = n && d && H?.status === "complete" && H.content.length > 0,
    c = F && H ? { content: H.content, references: H.references ?? [] } : null,
    R = t?.id ?? null;
  (R !== g.current && ((g.current = R), m(!1), h(), (p.current = !1)),
    s.useEffect(() => {
      a &&
        F &&
        !p.current &&
        !i &&
        !l &&
        ((p.current = !0),
        (w.current = !1),
        b(),
        I("nub_brief_auto_shown", { calendar_event_id: _ }));
    }, [a, F, i, l, _, b]),
    s.useEffect(() => {
      l && u && h();
    }, [l, u, h]),
    s.useEffect(() => {
      if (!a || !F || l) {
        r.current && (clearTimeout(r.current), (r.current = null));
        return;
      }
      return (
        o && !u && !i && p.current
          ? (r.current = setTimeout(() => {
              ((r.current = null),
                (w.current = !0),
                b(),
                I("nub_brief_hover_shown", { calendar_event_id: _ }));
            }, He))
          : o ||
            (r.current && (clearTimeout(r.current), (r.current = null)),
            u && w.current && h(),
            i && m(!1)),
        () => {
          r.current && (clearTimeout(r.current), (r.current = null));
        }
      );
    }, [o, a, F, u, i, l, _, b, h]));
  const v = s.useCallback(() => {
    (h(), m(!0), I("nub_brief_dismissed", {}));
  }, [h]);
  return (
    s.useEffect(() => {
      f("nub:set_brief_expanded", u);
    }, [u]),
    s.useEffect(
      () => (
        y("nub:dismiss_brief", v),
        () => {
          j("nub:dismiss_brief", v);
        }
      ),
      [v],
    ),
    { briefVisible: T, briefData: c, handleDismiss: v }
  );
}
function ze() {
  const {
      visible: t,
      hover: a,
      viewingDocument: o,
      handleNubClick: l,
    } = Pe({ logPrefix: "consent_nub" }),
    { showCopyIcon: n, handleCopy: d } = Be({ viewingDocument: o, visible: t });
  return !t || !o
    ? null
    : e.jsx(Te, {
        children: e.jsxs(ke, {
          onClick: l,
          hasError: o.transcriptionState === "error",
          children: [
            e.jsxs(Ne, {
              children: [
                e.jsx(Ee, {}),
                n && e.jsx(Ie, { onClick: d }),
                e.jsx(Ce, { transcriptionState: o.transcriptionState }),
              ],
            }),
            e.jsx(Se, { visible: a }),
          ],
        }),
      });
}
const Le = s.memo(function ({ href: a, children: o, references: l }) {
  const [n, d] = s.useState(!1),
    i = fe(a, l),
    m = be(a) ? a : void 0,
    u = e.jsx("a", {
      href: m,
      target: "_blank",
      rel: "noopener noreferrer",
      className:
        "cursor-pointer text-white/85 underline decoration-white/30 underline-offset-2 transition-colors hover:text-white hover:decoration-white/50",
      children: o,
    });
  return i
    ? e.jsx(me, {
        isOpen: n,
        setIsOpen: d,
        triggerOnHover: !0,
        hoverDelay: 200,
        side: "bottom",
        align: "start",
        sideOffset: 4,
        avoidCollisions: !0,
        collisionPadding: 8,
        contentClassName: "w-auto max-w-xs",
        content: e.jsx(pe, { title: i.title, source: i.source, link: i.link }),
        children: u,
      })
    : u;
});
function Ae({ title: t, content: a, references: o, onDismiss: l }) {
  return e.jsxs(C.div, {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.2 },
    className:
      "no-drag relative mr-16 h-[300px] origin-bottom-right self-end overflow-hidden rounded-xl border border-white/15",
    children: [
      e.jsx("div", {
        className: "pointer-events-none absolute -inset-4 opacity-60",
        style: {
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(80,80,120,0.6), transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(60,60,90,0.5), transparent 60%), linear-gradient(135deg, rgba(40,40,60,0.8), rgba(20,20,30,0.9))",
          filter: "blur(40px)",
        },
      }),
      e.jsx("div", {
        className:
          "pointer-events-none absolute inset-0 rounded-xl bg-black/60",
      }),
      e.jsx("div", {
        className:
          "pointer-events-none absolute inset-0 rounded-xl opacity-[0.04] mix-blend-overlay",
        style: {
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        },
      }),
      e.jsx("div", {
        className:
          "pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.08] to-transparent",
      }),
      e.jsxs("div", {
        className: "relative flex h-full flex-col",
        children: [
          e.jsxs("div", {
            className: "flex items-start justify-between px-4 pb-2 pt-4",
            children: [
              t &&
                e.jsx("h3", {
                  className:
                    "pr-2 text-base font-semibold leading-tight text-white",
                  children: t,
                }),
              e.jsx("button", {
                onClick: l,
                className:
                  "ml-auto shrink-0 rounded-full bg-white/10 p-1.5 text-white/50 outline-none transition-colors hover:bg-white/20 hover:text-white",
                children: e.jsx(xe, { className: "size-3.5" }),
              }),
            ],
          }),
          e.jsxs("div", {
            className: "relative min-h-0 flex-1",
            children: [
              e.jsx("div", {
                className:
                  "h-full overflow-y-auto px-4 pb-6 antialiased [overflow-wrap:anywhere]",
                children: e.jsx(ue, {
                  urlTransform: de,
                  components: {
                    p: ({ children: n }) =>
                      e.jsx("p", {
                        className:
                          "mb-2 text-sm leading-normal text-white/85 last:mb-0",
                        children: n,
                      }),
                    ul: ({ children: n }) =>
                      e.jsx("ul", {
                        className:
                          "mb-2 list-disc space-y-1 pl-5 text-sm text-white/85 last:mb-0",
                        children: n,
                      }),
                    ol: ({ children: n }) =>
                      e.jsx("ol", {
                        className:
                          "mb-2 list-decimal space-y-1 pl-5 text-sm text-white/85 last:mb-0",
                        children: n,
                      }),
                    li: ({ children: n }) =>
                      e.jsx("li", { className: "leading-normal", children: n }),
                    strong: ({ children: n }) =>
                      e.jsx("strong", {
                        className: "font-semibold text-white",
                        children: n,
                      }),
                    a: ({ href: n, children: d }) =>
                      e.jsx(Le, { href: n, references: o, children: d }),
                  },
                  children: a,
                }),
              }),
              e.jsx("div", {
                className:
                  "pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/30 to-transparent",
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
const De = 50,
  Ve = [];
function Y({ documentId: t, transcriptionState: a }) {
  const [o, l] = s.useState(!0),
    n = s.useRef(null),
    d = q((m) => m.transcripts[t] ?? Ve),
    i = s.useMemo(() => K(d), [d]);
  return (
    s.useEffect(() => {
      o &&
        i.length > 0 &&
        n.current &&
        setTimeout(() => {
          n.current?.scrollToIndex({
            index: i.length - 1,
            behavior: "auto",
            align: "end",
          });
        }, 50);
    }, [o, i.length]),
    e.jsx("div", {
      className: "no-drag relative flex h-full flex-col pb-2",
      children: e.jsx("div", {
        className: "relative flex-1 overflow-hidden",
        children:
          d.length > 0
            ? e.jsxs(e.Fragment, {
                children: [
                  e.jsx(J, {
                    ref: n,
                    data: i,
                    followOutput: o ? "auto" : !1,
                    overscan: 200,
                    className: "h-full",
                    alignToBottom: !0,
                    initialTopMostItemIndex: i.length > 0 ? i.length - 1 : 0,
                    atBottomThreshold: De,
                    itemContent: (m, u) =>
                      e.jsx(
                        Q,
                        {
                          chunkGroup: u,
                          nextChunkGroup: i[m + 1],
                          previousChunkGroup: i[m - 1],
                          i: m,
                          isHighlighted: !1,
                          additionalSystemTextClass:
                            "bg-oats-neutral-500 text-white",
                          activeMatchIndex: 0,
                        },
                        u?.[0]?.id,
                      ),
                    atBottomStateChange: (m) => {
                      l(m);
                    },
                  }),
                  e.jsx(A, {
                    children:
                      !o &&
                      e.jsx(C.button, {
                        initial: { opacity: 0, scale: 0.8, y: 10 },
                        animate: { opacity: 1, scale: 1, y: 0 },
                        exit: { opacity: 0, scale: 0.8, y: 10 },
                        whileHover: { scale: 1.05 },
                        whileTap: { scale: 0.95 },
                        onClick: () => {
                          (l(!0),
                            n.current?.scrollToIndex({
                              index: i.length - 1,
                              behavior: "smooth",
                              align: "end",
                            }));
                        },
                        className:
                          "absolute bottom-4 right-4 z-50 rounded-full border border-oats-neutral-600/50 bg-oats-neutral-700/80 p-2 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-oats-neutral-600/80",
                        "aria-label": "Scroll to bottom",
                        children: e.jsx(ee, { className: "h-4 w-4" }),
                      }),
                  }),
                ],
              })
            : e.jsx("div", {
                className: "flex h-full flex-col items-center justify-center",
                children: e.jsx(C.div, {
                  initial: { opacity: 0, scale: 0.9 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { type: "spring", stiffness: 200, damping: 20 },
                  className: "flex flex-col items-center p-8 text-center",
                  children: e.jsxs(C.div, {
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 },
                    transition: { delay: 0.2 },
                    className: "text-sm text-oats-neutral-400",
                    children: [
                      a === "starting" && "Starting transcription...",
                      a === "active" && "Waiting for transcript...",
                      a === "error" && "Transcription error",
                      a === "inactive" && "No transcript available",
                    ],
                  }),
                }),
              }),
      }),
    })
  );
}
const W = 2e3;
function $e({ isCapturing: t, showSuccess: a }) {
  return t
    ? e.jsx(z, { className: "size-5" })
    : a
      ? e.jsx(C.div, {
          initial: { scale: 0, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          transition: { duration: 0.2, ease: "backOut" },
          children: e.jsx(G, { className: "size-5 text-oats-green-500" }),
        })
      : e.jsx(X, { className: "size-5" });
}
function We() {
  const [t, a] = s.useState(!1),
    [o, l] = s.useState(!1),
    [n, d] = s.useState(null),
    [i, m] = s.useState(!1),
    [u, N] = s.useState(!1),
    T = P("nub_show_transcript_on_hover", !1),
    S = P("nubsnap", !1),
    [x, g] = s.useState(!1),
    {
      briefVisible: r,
      briefData: p,
      handleDismiss: w,
    } = Oe({ viewingDocument: n, visible: o, hover: t, dragging: x }),
    b = s.useRef(null),
    h = 4,
    _ = s.useCallback(
      (c) => {
        if (c.button !== 0) return;
        b.current = { sx: c.screenX, sy: c.screenY, dragged: !1 };
        const R = (E) => {
            if (!b.current) return;
            const M = E.screenX - b.current.sx,
              $ = E.screenY - b.current.sy;
            (!b.current.dragged &&
              (Math.abs(M) > h || Math.abs($) > h) &&
              ((b.current.dragged = !0), g(!0)),
              b.current.dragged &&
                (f("nub:drag_move", M, $),
                (b.current.sx = E.screenX),
                (b.current.sy = E.screenY)));
          },
          v = () => {
            (document.removeEventListener("mousemove", R),
              document.removeEventListener("mouseup", v),
              b.current &&
                !b.current.dragged &&
                n &&
                (I("nub_action", { action: "click" }),
                k("info", "nub-v2-click"),
                f("nub:open_document", n.id)),
              (b.current = null),
              g(!1));
          };
        (document.addEventListener("mousemove", R),
          document.addEventListener("mouseup", v));
      },
      [n],
    ),
    H = s.useCallback(async () => {
      if (!(!n || i)) {
        m(!0);
        try {
          const c = await B("take-interactive-screenshot");
          if (!c || !c.success) {
            c?.error !== "Screenshot cancelled" &&
              (O.error("Failed to capture screenshot"),
              k("error", "nub-v2-screenshot-capture-failed", {
                error: c?.error,
                documentId: n.id,
              }));
            return;
          }
          if (!c.base64 || !c.mimeType || !c.width || !c.height) {
            (O.error("Failed to capture screenshot"),
              k("error", "nub-v2-screenshot-malformed-result", {
                error: "Malformed screenshot result: missing required fields",
                documentId: n.id,
                hasBase64: !!c.base64,
                hasMimeType: !!c.mimeType,
                hasWidth: !!c.width,
                hasHeight: !!c.height,
              }));
            return;
          }
          const R = `data:${c.mimeType};base64,${c.base64}`,
            v = await B("resize-image", R, W, W);
          (f("nub:add_screenshot_attachment", {
            documentId: n.id,
            base64: v.base64,
            mimeType: v.mimeType,
            width: v.width,
            height: v.height,
          }),
            N(!0),
            setTimeout(() => N(!1), 600));
        } catch (c) {
          (console.error("Screenshot capture error:", c),
            O.error("Failed to capture screenshot"),
            k("error", "nub-v2-screenshot-exception", {
              error: c,
              documentId: n.id,
            }));
        } finally {
          m(!1);
        }
      }
    }, [n, i]),
    F = s.useMemo(() => {
      if (n)
        switch (n.transcriptionState) {
          case "starting":
          case "error":
            return e.jsx("div", {
              className: "flex size-7 items-center justify-center",
              children: e.jsx(z, { className: "size-4 text-white opacity-40" }),
            });
          default:
            return e.jsx(D, {
              variant: "nub",
              barsClassName: "bg-background-dancing-bars w-[3px]",
              containerClassName: "gap-[4px] w-[18px]",
            });
        }
      return null;
    }, [n]);
  return (
    s.useEffect(() => {
      const c = (E, M) => {
          (f("nub:log", "nub:document", { "is document null": M === null }),
            d(M));
        },
        R = (E, M) => {
          (l(M), f("nub:log", "nub:visible", { visible: M }));
        },
        v = (E, M) => {
          a(M);
        };
      return (
        y("nub:document", c),
        y("nub:visible", R),
        y("nub:hover", v),
        y("nub:hover_state", v),
        B("nub:request_initial_state").then((E) => {
          (l(E.visible), d(E.document), a(E.isHovered ?? !1));
        }),
        () => {
          (j("nub:document", c),
            j("nub:visible", R),
            j("nub:hover", v),
            j("nub:hover_state", v));
        }
      );
    }, []),
    s.useEffect(() => {
      o && t && k("info", "nub-v2-hover");
    }, [t, o]),
    !o || !n
      ? null
      : e.jsxs("div", {
          className:
            "relative flex h-screen w-screen items-start justify-start gap-2 px-1 py-2",
          children: [
            r &&
              p &&
              e.jsx(Ae, {
                title: n.title,
                content: p.content,
                references: p.references,
                onDismiss: w,
              }),
            t &&
              T &&
              !r &&
              e.jsx(C.div, {
                initial: { opacity: 0, scale: 0.98 },
                animate: { opacity: 1, scale: 1 },
                transition: { duration: 0.2 },
                className:
                  "mr-10 flex-1 origin-bottom-right rounded-lg border border-oats-neutral-600/95 bg-oats-neutral-800/95 shadow-[0_2px_4px_-1px_rgba(0,0,0,0.7)] ring-[0.75px] ring-black/80",
                children: e.jsx(Y, {
                  documentId: n.id,
                  transcriptionState: n.transcriptionState,
                }),
              }),
            e.jsx(C.div, {
              onMouseDown: _,
              initial: !1,
              animate: {
                backgroundColor:
                  n.transcriptionState === "error"
                    ? "rgba(220, 38, 38, 0.7)"
                    : "rgba(38, 38, 38, 0.95)",
                scale: u ? 1.08 : 1,
              },
              transition: { duration: 0.2, ease: "easeOut" },
              className:
                "no-drag fixed bottom-1.5 right-1 flex w-max flex-col items-center justify-center gap-1.5 overflow-hidden rounded-full border border-oats-neutral-600/95 p-0 shadow-[0_2px_4px_-1px_rgba(0,0,0,0.7)] ring-[0.75px] ring-black/80",
              onMouseEnter: () => a(!0),
              onMouseLeave: (c) => {
                c.target === c.currentTarget && a(!1);
              },
              children: e.jsxs("div", {
                className: "flex w-full flex-1 flex-col items-center",
                children: [
                  e.jsxs("div", {
                    className:
                      "flex w-full flex-1 flex-col items-center justify-center gap-2 px-3 pb-3 pt-3.5 hover:bg-oats-neutral-100/10",
                    children: [
                      e.jsx(V, {
                        size: 24,
                        className: "mb-0.5 block text-white opacity-80",
                      }),
                      F,
                    ],
                  }),
                  S &&
                    window.electron.platform === "darwin" &&
                    e.jsx("button", {
                      onClick: (c) => {
                        (f("nub:log", "nub:screenshot_button_clicked", {}),
                          c.stopPropagation(),
                          H());
                      },
                      disabled: i || u,
                      className:
                        "no-drag flex w-full items-center justify-center border-t border-oats-neutral-600/95 py-2 text-oats-neutral-400 outline-none hover:bg-oats-neutral-100/10 hover:text-white focus:outline-none",
                      "aria-label": "Capture screenshot",
                      children: e.jsx($e, { isCapturing: i, showSuccess: u }),
                    }),
                ],
              }),
            }),
          ],
        })
  );
}
const U = 2e3;
function Ue({ isCapturing: t, showSuccess: a }) {
  return t
    ? e.jsx(z, { className: "size-3.5" })
    : a
      ? e.jsx(C.div, {
          initial: { scale: 0, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          transition: { duration: 0.2, ease: "backOut" },
          children: e.jsx(G, { className: "size-4 text-oats-green-500" }),
        })
      : e.jsx(X, { className: "size-3.5" });
}
function Ge() {
  const t = P("nub_consent_message_banner", !1),
    a = P("pre_meeting_brief_in_meeting_surface", null) === "nub";
  return t ? e.jsx(ze, {}) : a ? e.jsx(We, {}) : e.jsx(Xe, {});
}
function Xe() {
  const [t, a] = s.useState(!1),
    [o, l] = s.useState(!1),
    [n, d] = s.useState(null),
    [i, m] = s.useState(!1),
    [u, N] = s.useState(!1),
    T = P("nub_show_transcript_on_hover", !1),
    S = P("nubsnap", !1),
    x = s.useCallback(async () => {
      if (!(!n || i)) {
        m(!0);
        try {
          const r = await B("take-interactive-screenshot");
          if (!r || !r.success) {
            r?.error !== "Screenshot cancelled" &&
              (O.error("Failed to capture screenshot"),
              k("error", "nub-screenshot-capture-failed", {
                error: r?.error,
                documentId: n.id,
              }));
            return;
          }
          if (!r.base64 || !r.mimeType || !r.width || !r.height) {
            (O.error("Failed to capture screenshot"),
              k("error", "nub-screenshot-malformed-result", {
                error: "Malformed screenshot result: missing required fields",
                documentId: n.id,
                hasBase64: !!r.base64,
                hasMimeType: !!r.mimeType,
                hasWidth: !!r.width,
                hasHeight: !!r.height,
              }));
            return;
          }
          const p = `data:${r.mimeType};base64,${r.base64}`,
            w = await B("resize-image", p, U, U);
          (f("nub:add_screenshot_attachment", {
            documentId: n.id,
            base64: w.base64,
            mimeType: w.mimeType,
            width: w.width,
            height: w.height,
          }),
            N(!0),
            setTimeout(() => N(!1), 600));
        } catch (r) {
          (console.error("Screenshot capture error:", r),
            O.error("Failed to capture screenshot"),
            k("error", "nub-screenshot-exception", {
              error: r,
              documentId: n.id,
            }));
        } finally {
          m(!1);
        }
      }
    }, [n, i]),
    g = s.useMemo(() => {
      if (n)
        switch (n.transcriptionState) {
          case "starting":
          case "error":
            return e.jsx("div", {
              className: "flex size-5 items-center justify-center",
              children: e.jsx(z, { className: "size-3 text-white opacity-40" }),
            });
          default:
            return e.jsx(D, {
              variant: "nub",
              barsClassName: "bg-background-dancing-bars w-0.5",
              containerClassName: "gap-[3px] w-[12px]",
            });
        }
      return null;
    }, [n]);
  return (
    s.useEffect(() => {
      const r = (h, _) => {
          (f("nub:log", "nub:document", { "is document null": _ === null }),
            d(_));
        },
        p = (h, _) => {
          (l(_), f("nub:log", "nub:visible", { visible: _ }));
        },
        w = (h, _) => {
          a(_);
        },
        b = (h, _) => {
          a(_);
        };
      return (
        y("nub:document", r),
        y("nub:visible", p),
        y("nub:hover", w),
        y("nub:hover_state", b),
        B("nub:request_initial_state").then((h) => {
          (l(h.visible), d(h.document), a(h.isHovered ?? !1));
        }),
        () => {
          (j("nub:document", r),
            j("nub:visible", p),
            j("nub:hover", w),
            j("nub:hover_state", b));
        }
      );
    }, []),
    s.useEffect(() => {
      o && t && k("info", "nub-hover");
    }, [t, o]),
    !o || !n
      ? null
      : e.jsxs("div", {
          className:
            "relative flex h-screen w-screen items-start justify-start gap-2 px-1 py-2",
          children: [
            t &&
              T &&
              e.jsx(C.div, {
                initial: { opacity: 0, scale: 0.98 },
                animate: { opacity: 1, scale: 1 },
                transition: { duration: 0.2 },
                className:
                  "mr-10 flex-1 origin-bottom-right rounded-lg border border-oats-neutral-600/95 bg-oats-neutral-800/95 shadow-[0_2px_4px_-1px_rgba(0,0,0,0.7)] ring-[0.75px] ring-black/80",
                children: e.jsx(Y, {
                  documentId: n?.id,
                  transcriptionState: n?.transcriptionState,
                }),
              }),
            e.jsx(C.div, {
              onClick: () => {
                (I("nub_action", { action: "click" }),
                  k("info", "nub-click"),
                  f("nub:open_document", n.id));
              },
              initial: !1,
              animate: {
                backgroundColor:
                  n?.transcriptionState === "error"
                    ? "rgba(220, 38, 38, 0.7)"
                    : "rgba(38, 38, 38, 0.95)",
                scale: u ? 1.08 : 1,
              },
              transition: { duration: 0.2, ease: "easeOut" },
              className: `fixed right-1.5 flex w-max flex-col items-center justify-center gap-1 overflow-hidden rounded-full border border-oats-neutral-600/95 p-0 shadow-[0_2px_4px_-1px_rgba(0,0,0,0.7)] ring-[0.75px] ring-black/80 ${S && window.electron.platform === "darwin" ? "top-1.5" : "bottom-1.5"}`,
              onMouseEnter: () => a(!0),
              onMouseLeave: (r) => {
                r.target === r.currentTarget && a(!1);
              },
              children: e.jsxs("div", {
                className: "flex w-full flex-1 flex-col items-center",
                children: [
                  e.jsxs("div", {
                    className:
                      "no-drag flex w-full flex-1 flex-col items-center justify-center gap-1.5 p-2 py-2 pt-2.5 hover:bg-oats-neutral-100/10",
                    children: [
                      e.jsx(V, {
                        size: 16,
                        className: "mb-0.5 block text-white opacity-80",
                      }),
                      g,
                    ],
                  }),
                  S &&
                    window.electron.platform === "darwin" &&
                    e.jsx("button", {
                      onClick: (r) => {
                        (f("nub:log", "nub:screenshot_button_clicked", {}),
                          r.stopPropagation(),
                          x());
                      },
                      disabled: i || u,
                      className:
                        "no-drag flex w-full items-center justify-center border-t border-oats-neutral-600/95 py-1.5 text-oats-neutral-400 outline-none hover:bg-oats-neutral-100/10 hover:text-white focus:outline-none",
                      "aria-label": "Capture screenshot",
                      children: e.jsx(Ue, { isCapturing: i, showSuccess: u }),
                    }),
                  e.jsx(A, {
                    children:
                      t &&
                      e.jsx(C.div, {
                        initial: { opacity: 0, height: 0 },
                        animate: { opacity: 1, height: "auto" },
                        exit: { opacity: 0, height: 0 },
                        transition: { duration: 0.1 },
                        className: "flex w-full flex-col",
                        children: e.jsx("div", {
                          className:
                            "flex w-full flex-row items-center justify-center border-t border-oats-neutral-600/95 pb-2 pt-1.5",
                          children: e.jsx("div", {
                            className: "grid grid-cols-3 gap-[2px]",
                            children: new Array(6)
                              .fill(0)
                              .map((r, p) =>
                                e.jsx(
                                  "div",
                                  {
                                    className:
                                      "size-[2px] rounded-full bg-oats-neutral-500",
                                  },
                                  p,
                                ),
                              ),
                          }),
                        }),
                      }),
                  }),
                ],
              }),
            }),
          ],
        })
  );
}
let L;
const qe = () => (L || (L = B("get-device-id").catch(() => null)), L);
function st() {
  (_e(),
    te(),
    ne(),
    he(ve),
    se({
      logToBackend: k,
      fetch,
      getAPIEndpoint: le,
      platform: window.electron.platform,
      activeWorkspaceId: re.getState().activeWorkspaceId,
      getDeviceId: qe,
    }),
    we(),
    document.body.classList.remove("bg-background-window"),
    document.body.classList.add("overflow-hidden", "nub"),
    (document.title = "Nub"),
    Z.createRoot(document.getElementById("root")).render(
      e.jsx(ye, {
        fallback: null,
        onError: je,
        children: e.jsxs(ae, {
          children: [
            e.jsx(Ge, {}),
            e.jsx(oe, {}),
            e.jsx(ie, {}),
            e.jsx(ce, { windowType: "nub" }),
          ],
        }),
      }),
    ));
}
export { st as mountNubWindow };
//# sourceMappingURL=nub-D6AxGpnC.js.map
