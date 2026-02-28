import { bs as I, bt as T } from "./index-Cnk1amp1.js";
try {
  let p =
      typeof window < "u"
        ? window
        : typeof global < "u"
          ? global
          : typeof globalThis < "u"
            ? globalThis
            : typeof self < "u"
              ? self
              : {},
    r = new p.Error().stack;
  r &&
    ((p._sentryDebugIds = p._sentryDebugIds || {}),
    (p._sentryDebugIds[r] = "e99073e2-fe4e-4513-9640-9826d5cebebd"),
    (p._sentryDebugIdIdentifier =
      "sentry-dbid-e99073e2-fe4e-4513-9640-9826d5cebebd"));
} catch {}
class x {
  marshaller;
  serializer;
  deserializer;
  serdeContext;
  defaultContentType;
  constructor({
    marshaller: r,
    serializer: a,
    deserializer: o,
    serdeContext: d,
    defaultContentType: y,
  }) {
    ((this.marshaller = r),
      (this.serializer = a),
      (this.deserializer = o),
      (this.serdeContext = d),
      (this.defaultContentType = y));
  }
  async serializeEventStream({
    eventStream: r,
    requestSchema: a,
    initialRequest: o,
  }) {
    const d = this.marshaller,
      y = a.getEventStreamMember(),
      S = a.getMemberSchema(y),
      m = this.serializer,
      u = this.defaultContentType,
      h = Symbol("initialRequestMarker"),
      b = {
        async *[Symbol.asyncIterator]() {
          if (o) {
            const s = {
              ":event-type": { type: "string", value: "initial-request" },
              ":message-type": { type: "string", value: "event" },
              ":content-type": { type: "string", value: u },
            };
            m.write(a, o);
            const t = m.flush();
            yield { [h]: !0, headers: s, body: t };
          }
          for await (const s of r) yield s;
        },
      };
    return d.serialize(b, (s) => {
      if (s[h]) return { headers: s.headers, body: s.body };
      const t = Object.keys(s).find((i) => i !== "__type") ?? "",
        {
          additionalHeaders: e,
          body: n,
          eventType: l,
          explicitPayloadContentType: c,
        } = this.writeEventBody(t, S, s);
      return {
        headers: {
          ":event-type": { type: "string", value: l },
          ":message-type": { type: "string", value: "event" },
          ":content-type": { type: "string", value: c ?? u },
          ...e,
        },
        body: n,
      };
    });
  }
  async deserializeEventStream({
    response: r,
    responseSchema: a,
    initialResponseContainer: o,
  }) {
    const d = this.marshaller,
      y = a.getEventStreamMember(),
      m = a.getMemberSchema(y).getMemberSchemas(),
      u = Symbol("initialResponseMarker"),
      h = d.deserialize(r.body, async (t) => {
        const e = Object.keys(t).find((l) => l !== "__type") ?? "",
          n = t[e].body;
        if (e === "initial-response") {
          const l = await this.deserializer.read(a, n);
          return (delete l[y], { [u]: !0, ...l });
        } else if (e in m) {
          const l = m[e];
          if (l.isStructSchema()) {
            const c = {};
            let f = !1;
            for (const [i, v] of l.structIterator()) {
              const { eventHeader: w, eventPayload: z } = v.getMergedTraits();
              if (((f = f || !!(w || z)), z))
                v.isBlobSchema()
                  ? (c[i] = n)
                  : v.isStringSchema()
                    ? (c[i] = (this.serdeContext?.utf8Encoder ?? I)(n))
                    : v.isStructSchema() &&
                      (c[i] = await this.deserializer.read(v, n));
              else if (w) {
                const g = t[e].headers[i]?.value;
                g != null &&
                  (v.isNumericSchema()
                    ? g && typeof g == "object" && "bytes" in g
                      ? (c[i] = BigInt(g.toString()))
                      : (c[i] = Number(g))
                    : (c[i] = g));
              }
            }
            if (f) return { [e]: c };
            if (n.byteLength === 0) return { [e]: {} };
          }
          return { [e]: await this.deserializer.read(l, n) };
        } else return { $unknown: t };
      }),
      b = h[Symbol.asyncIterator](),
      s = await b.next();
    if (s.done) return h;
    if (s.value?.[u]) {
      if (!a)
        throw new Error(
          "@smithy::core/protocols - initial-response event encountered in event stream but no response schema given.",
        );
      for (const [t, e] of Object.entries(s.value)) o[t] = e;
    }
    return {
      async *[Symbol.asyncIterator]() {
        for (s?.value?.[u] || (yield s.value); ; ) {
          const { done: t, value: e } = await b.next();
          if (t) break;
          yield e;
        }
      },
    };
  }
  writeEventBody(r, a, o) {
    const d = this.serializer;
    let y = r,
      S = null,
      m;
    const u = a.getSchema()[4].includes(r),
      h = {};
    if (u) {
      const t = a.getMemberSchema(r);
      if (t.isStructSchema()) {
        for (const [e, n] of t.structIterator()) {
          const { eventHeader: l, eventPayload: c } = n.getMergedTraits();
          if (c) S = e;
          else if (l) {
            const f = o[r][e];
            let i = "binary";
            (n.isNumericSchema()
              ? (-2) ** 31 <= f && f <= 2 ** 31 - 1
                ? (i = "integer")
                : (i = "long")
              : n.isTimestampSchema()
                ? (i = "timestamp")
                : n.isStringSchema()
                  ? (i = "string")
                  : n.isBooleanSchema() && (i = "boolean"),
              f != null && ((h[e] = { type: i, value: f }), delete o[r][e]));
          }
        }
        if (S !== null) {
          const e = t.getMemberSchema(S);
          (e.isBlobSchema()
            ? (m = "application/octet-stream")
            : e.isStringSchema() && (m = "text/plain"),
            d.write(e, o[r][S]));
        } else d.write(t, o[r]);
      } else
        throw new Error(
          "@smithy/core/event-streams - non-struct member not supported in event stream union.",
        );
    } else {
      const [t, e] = o[r];
      ((y = t), d.write(15, e));
    }
    const b = d.flush();
    return {
      body: typeof b == "string" ? (this.serdeContext?.utf8Decoder ?? T)(b) : b,
      eventType: y,
      explicitPayloadContentType: m,
      additionalHeaders: h,
    };
  }
}
export { x as EventStreamSerde };
//# sourceMappingURL=index-BzuXsCFS.js.map
