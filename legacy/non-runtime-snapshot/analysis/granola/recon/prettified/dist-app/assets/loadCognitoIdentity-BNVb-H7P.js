import {
  bl as le,
  bm as J,
  bn as ge,
  bo as he,
  bp as ye,
  bq as me,
  br as fe,
  bs as Ee,
  bt as Ie,
  bu as ve,
  bv as Pe,
  bw as be,
  bx as Se,
  by as xe,
  bz as Ce,
  bA as Ae,
  bB as _e,
  bC as Re,
  bD as we,
  bE as De,
  bF as $e,
  bG as ke,
  bH as Fe,
  bI as Oe,
  bJ as Ue,
  bK as Ge,
  bL as Te,
  bM as He,
  bN as Me,
  bO as Le,
  bP as Ne,
  bQ as je,
  bR as ze,
  bS as qe,
  bT as Ke,
  bU as Be,
  bV as Ve,
  bW as We,
  bX as Je,
  bY as Xe,
  bZ as Ye,
  b_ as Qe,
  b$ as Ze,
  c0 as et,
  c1 as tt,
  c2 as nt,
  c3 as ot,
  c4 as st,
  c5 as rt,
  c6 as it,
  c7 as p,
  c8 as X,
  c9 as Y,
} from "./index-Cnk1amp1.js";
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
    t = new e.Error().stack;
  t &&
    ((e._sentryDebugIds = e._sentryDebugIds || {}),
    (e._sentryDebugIds[t] = "94269699-8be5-4efb-95eb-c361678c01a2"),
    (e._sentryDebugIdIdentifier =
      "sentry-dbid-94269699-8be5-4efb-95eb-c361678c01a2"));
} catch {}
class at {
  async sign(t, o, a) {
    return t;
  }
}
const ct = async (e, t, o) => ({
  operation: ge(t).operation,
  region:
    (await J(e.region)()) ||
    (() => {
      throw new Error(
        "expected `region` to be configured for `aws.auth#sigv4`",
      );
    })(),
});
function dt(e) {
  return {
    schemeId: "aws.auth#sigv4",
    signingProperties: { name: "cognito-identity", region: e.region },
    propertiesExtractor: (t, o) => ({
      signingProperties: { config: t, context: o },
    }),
  };
}
function S(e) {
  return { schemeId: "smithy.api#noAuth" };
}
const pt = (e) => {
    const t = [];
    switch (e.operation) {
      case "GetCredentialsForIdentity": {
        t.push(S());
        break;
      }
      case "GetId": {
        t.push(S());
        break;
      }
      case "GetOpenIdToken": {
        t.push(S());
        break;
      }
      case "UnlinkIdentity": {
        t.push(S());
        break;
      }
      default:
        t.push(dt(e));
    }
    return t;
  },
  ut = (e) => {
    const t = le(e);
    return Object.assign(t, {
      authSchemePreference: J(e.authSchemePreference ?? []),
    });
  },
  lt = (e) =>
    Object.assign(e, {
      useDualstackEndpoint: e.useDualstackEndpoint ?? !1,
      useFipsEndpoint: e.useFipsEndpoint ?? !1,
      defaultSigningName: "cognito-identity",
    }),
  Q = {
    UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
    Endpoint: { type: "builtInParams", name: "endpoint" },
    Region: { type: "builtInParams", name: "region" },
    UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
  },
  gt = "3.958.0",
  ht = { version: gt },
  Z = "required",
  r = "fn",
  i = "argv",
  E = "ref",
  M = !0,
  L = "isSet",
  P = "booleanEquals",
  f = "error",
  g = "endpoint",
  m = "tree",
  C = "PartitionResult",
  A = "getAttr",
  I = "stringEquals",
  N = { [Z]: !1, type: "string" },
  j = { [Z]: !0, default: !1, type: "boolean" },
  z = { [E]: "Endpoint" },
  ee = { [r]: P, [i]: [{ [E]: "UseFIPS" }, !0] },
  te = { [r]: P, [i]: [{ [E]: "UseDualStack" }, !0] },
  s = {},
  v = { [E]: "Region" },
  q = { [r]: A, [i]: [{ [E]: C }, "supportsFIPS"] },
  ne = { [E]: C },
  K = { [r]: P, [i]: [!0, { [r]: A, [i]: [ne, "supportsDualStack"] }] },
  B = [ee],
  V = [te],
  W = [v],
  yt = {
    parameters: { Region: N, UseDualStack: j, UseFIPS: j, Endpoint: N },
    rules: [
      {
        conditions: [{ [r]: L, [i]: [z] }],
        rules: [
          {
            conditions: B,
            error:
              "Invalid Configuration: FIPS and custom endpoint are not supported",
            type: f,
          },
          {
            conditions: V,
            error:
              "Invalid Configuration: Dualstack and custom endpoint are not supported",
            type: f,
          },
          { endpoint: { url: z, properties: s, headers: s }, type: g },
        ],
        type: m,
      },
      {
        conditions: [{ [r]: L, [i]: W }],
        rules: [
          {
            conditions: [{ [r]: "aws.partition", [i]: W, assign: C }],
            rules: [
              {
                conditions: [ee, te],
                rules: [
                  {
                    conditions: [{ [r]: P, [i]: [M, q] }, K],
                    rules: [
                      {
                        conditions: [{ [r]: I, [i]: [v, "us-east-1"] }],
                        endpoint: {
                          url: "https://cognito-identity-fips.us-east-1.amazonaws.com",
                          properties: s,
                          headers: s,
                        },
                        type: g,
                      },
                      {
                        conditions: [{ [r]: I, [i]: [v, "us-east-2"] }],
                        endpoint: {
                          url: "https://cognito-identity-fips.us-east-2.amazonaws.com",
                          properties: s,
                          headers: s,
                        },
                        type: g,
                      },
                      {
                        conditions: [{ [r]: I, [i]: [v, "us-west-1"] }],
                        endpoint: {
                          url: "https://cognito-identity-fips.us-west-1.amazonaws.com",
                          properties: s,
                          headers: s,
                        },
                        type: g,
                      },
                      {
                        conditions: [{ [r]: I, [i]: [v, "us-west-2"] }],
                        endpoint: {
                          url: "https://cognito-identity-fips.us-west-2.amazonaws.com",
                          properties: s,
                          headers: s,
                        },
                        type: g,
                      },
                      {
                        endpoint: {
                          url: "https://cognito-identity-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                          properties: s,
                          headers: s,
                        },
                        type: g,
                      },
                    ],
                    type: m,
                  },
                  {
                    error:
                      "FIPS and DualStack are enabled, but this partition does not support one or both",
                    type: f,
                  },
                ],
                type: m,
              },
              {
                conditions: B,
                rules: [
                  {
                    conditions: [{ [r]: P, [i]: [q, M] }],
                    rules: [
                      {
                        endpoint: {
                          url: "https://cognito-identity-fips.{Region}.{PartitionResult#dnsSuffix}",
                          properties: s,
                          headers: s,
                        },
                        type: g,
                      },
                    ],
                    type: m,
                  },
                  {
                    error:
                      "FIPS is enabled but this partition does not support FIPS",
                    type: f,
                  },
                ],
                type: m,
              },
              {
                conditions: V,
                rules: [
                  {
                    conditions: [K],
                    rules: [
                      {
                        conditions: [
                          {
                            [r]: I,
                            [i]: ["aws", { [r]: A, [i]: [ne, "name"] }],
                          },
                        ],
                        endpoint: {
                          url: "https://cognito-identity.{Region}.amazonaws.com",
                          properties: s,
                          headers: s,
                        },
                        type: g,
                      },
                      {
                        endpoint: {
                          url: "https://cognito-identity.{Region}.{PartitionResult#dualStackDnsSuffix}",
                          properties: s,
                          headers: s,
                        },
                        type: g,
                      },
                    ],
                    type: m,
                  },
                  {
                    error:
                      "DualStack is enabled but this partition does not support DualStack",
                    type: f,
                  },
                ],
                type: m,
              },
              {
                endpoint: {
                  url: "https://cognito-identity.{Region}.{PartitionResult#dnsSuffix}",
                  properties: s,
                  headers: s,
                },
                type: g,
              },
            ],
            type: m,
          },
        ],
        type: m,
      },
      { error: "Invalid Configuration: Missing Region", type: f },
    ],
  },
  mt = yt,
  ft = new he({
    size: 50,
    params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"],
  }),
  Et = (e, t = {}) =>
    ft.get(e, () => ye(mt, { endpointParams: e, logger: t.logger }));
fe.aws = me;
const It = (e) => ({
    apiVersion: "2014-06-30",
    base64Decoder: e?.base64Decoder ?? Ce,
    base64Encoder: e?.base64Encoder ?? xe,
    disableHostPrefix: e?.disableHostPrefix ?? !1,
    endpointProvider: e?.endpointProvider ?? Et,
    extensions: e?.extensions ?? [],
    httpAuthSchemeProvider: e?.httpAuthSchemeProvider ?? pt,
    httpAuthSchemes: e?.httpAuthSchemes ?? [
      {
        schemeId: "aws.auth#sigv4",
        identityProvider: (t) => t.getIdentityProvider("aws.auth#sigv4"),
        signer: new Se(),
      },
      {
        schemeId: "smithy.api#noAuth",
        identityProvider: (t) =>
          t.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
        signer: new at(),
      },
    ],
    logger: e?.logger ?? new be(),
    protocol: e?.protocol ?? Pe,
    protocolSettings: e?.protocolSettings ?? {
      defaultNamespace: "com.amazonaws.cognitoidentity",
      xmlNamespace: "http://cognito-identity.amazonaws.com/doc/2014-06-30/",
      version: "2014-06-30",
      serviceTarget: "AWSCognitoIdentityService",
    },
    serviceId: e?.serviceId ?? "Cognito Identity",
    urlParser: e?.urlParser ?? ve,
    utf8Decoder: e?.utf8Decoder ?? Ie,
    utf8Encoder: e?.utf8Encoder ?? Ee,
  }),
  vt = (e) => {
    const t = Ae(e),
      o = () => t().then(Te),
      a = It(e);
    return {
      ...a,
      ...e,
      runtime: "browser",
      defaultsMode: t,
      bodyLengthChecker: e?.bodyLengthChecker ?? Oe,
      credentialDefaultProvider:
        e?.credentialDefaultProvider ??
        ((d) => () => Promise.reject(new Error("Credential is missing"))),
      defaultUserAgentProvider:
        e?.defaultUserAgentProvider ??
        Fe({ serviceId: a.serviceId, clientVersion: ht.version }),
      maxAttempts: e?.maxAttempts ?? ke,
      region: e?.region ?? $e("Region is missing"),
      requestHandler: De.create(e?.requestHandler ?? o),
      retryMode: e?.retryMode ?? (async () => (await o()).retryMode || we),
      sha256: e?.sha256 ?? Re,
      streamCollector: e?.streamCollector ?? _e,
      useDualstackEndpoint:
        e?.useDualstackEndpoint ?? (() => Promise.resolve(Ge)),
      useFipsEndpoint: e?.useFipsEndpoint ?? (() => Promise.resolve(Ue)),
    };
  },
  Pt = (e) => {
    const t = e.httpAuthSchemes;
    let o = e.httpAuthSchemeProvider,
      a = e.credentials;
    return {
      setHttpAuthScheme(d) {
        const b = t.findIndex((x) => x.schemeId === d.schemeId);
        b === -1 ? t.push(d) : t.splice(b, 1, d);
      },
      httpAuthSchemes() {
        return t;
      },
      setHttpAuthSchemeProvider(d) {
        o = d;
      },
      httpAuthSchemeProvider() {
        return o;
      },
      setCredentials(d) {
        a = d;
      },
      credentials() {
        return a;
      },
    };
  },
  bt = (e) => ({
    httpAuthSchemes: e.httpAuthSchemes(),
    httpAuthSchemeProvider: e.httpAuthSchemeProvider(),
    credentials: e.credentials(),
  }),
  St = (e, t) => {
    const o = Object.assign(He(e), Me(e), Le(e), Pt(e));
    return (
      t.forEach((a) => a.configure(o)),
      Object.assign(e, Ne(o), je(o), ze(o), bt(o))
    );
  };
class Pn extends qe {
  config;
  constructor(...[t]) {
    const o = vt(t || {});
    (super(o), (this.initConfig = o));
    const a = lt(o),
      d = Ke(a),
      b = Be(d),
      x = Ve(b),
      ae = Je(x),
      ce = We(ae),
      de = ut(ce),
      pe = St(de, t?.extensions || []);
    ((this.config = pe),
      this.middlewareStack.use(Xe(this.config)),
      this.middlewareStack.use(Ye(this.config)),
      this.middlewareStack.use(Qe(this.config)),
      this.middlewareStack.use(Ze(this.config)),
      this.middlewareStack.use(et(this.config)),
      this.middlewareStack.use(tt(this.config)),
      this.middlewareStack.use(nt(this.config)),
      this.middlewareStack.use(
        ot(this.config, {
          httpAuthSchemeParametersProvider: ct,
          identityProviderConfigProvider: async (ue) =>
            new st({ "aws.auth#sigv4": ue.credentials }),
        }),
      ),
      this.middlewareStack.use(rt(this.config)));
  }
  destroy() {
    super.destroy();
  }
}
class c extends it {
  constructor(t) {
    (super(t), Object.setPrototypeOf(this, c.prototype));
  }
}
class _ extends c {
  name = "InternalErrorException";
  $fault = "server";
  constructor(t) {
    (super({ name: "InternalErrorException", $fault: "server", ...t }),
      Object.setPrototypeOf(this, _.prototype));
  }
}
class R extends c {
  name = "InvalidParameterException";
  $fault = "client";
  constructor(t) {
    (super({ name: "InvalidParameterException", $fault: "client", ...t }),
      Object.setPrototypeOf(this, R.prototype));
  }
}
class w extends c {
  name = "LimitExceededException";
  $fault = "client";
  constructor(t) {
    (super({ name: "LimitExceededException", $fault: "client", ...t }),
      Object.setPrototypeOf(this, w.prototype));
  }
}
class D extends c {
  name = "NotAuthorizedException";
  $fault = "client";
  constructor(t) {
    (super({ name: "NotAuthorizedException", $fault: "client", ...t }),
      Object.setPrototypeOf(this, D.prototype));
  }
}
class $ extends c {
  name = "ResourceConflictException";
  $fault = "client";
  constructor(t) {
    (super({ name: "ResourceConflictException", $fault: "client", ...t }),
      Object.setPrototypeOf(this, $.prototype));
  }
}
class k extends c {
  name = "TooManyRequestsException";
  $fault = "client";
  constructor(t) {
    (super({ name: "TooManyRequestsException", $fault: "client", ...t }),
      Object.setPrototypeOf(this, k.prototype));
  }
}
class F extends c {
  name = "ResourceNotFoundException";
  $fault = "client";
  constructor(t) {
    (super({ name: "ResourceNotFoundException", $fault: "client", ...t }),
      Object.setPrototypeOf(this, F.prototype));
  }
}
class O extends c {
  name = "ExternalServiceException";
  $fault = "client";
  constructor(t) {
    (super({ name: "ExternalServiceException", $fault: "client", ...t }),
      Object.setPrototypeOf(this, O.prototype));
  }
}
class U extends c {
  name = "InvalidIdentityPoolConfigurationException";
  $fault = "client";
  constructor(t) {
    (super({
      name: "InvalidIdentityPoolConfigurationException",
      $fault: "client",
      ...t,
    }),
      Object.setPrototypeOf(this, U.prototype));
  }
}
class G extends c {
  name = "DeveloperUserAlreadyRegisteredException";
  $fault = "client";
  constructor(t) {
    (super({
      name: "DeveloperUserAlreadyRegisteredException",
      $fault: "client",
      ...t,
    }),
      Object.setPrototypeOf(this, G.prototype));
  }
}
class T extends c {
  name = "ConcurrentModificationException";
  $fault = "client";
  constructor(t) {
    (super({ name: "ConcurrentModificationException", $fault: "client", ...t }),
      Object.setPrototypeOf(this, T.prototype));
  }
}
const xt = "AccountId",
  Ct = "AccessKeyId",
  oe = "Credentials",
  At = "ConcurrentModificationException",
  _t = "CustomRoleArn",
  Rt = "DeveloperUserAlreadyRegisteredException",
  wt = "Expiration",
  Dt = "ExternalServiceException",
  $t = "GetCredentialsForIdentity",
  kt = "GetCredentialsForIdentityInput",
  Ft = "GetCredentialsForIdentityResponse",
  Ot = "GetId",
  Ut = "GetIdInput",
  Gt = "GetIdResponse",
  Tt = "InternalErrorException",
  H = "IdentityId",
  Ht = "InvalidIdentityPoolConfigurationException",
  Mt = "InvalidParameterException",
  Lt = "IdentityPoolId",
  Nt = "IdentityProviderToken",
  se = "Logins",
  jt = "LimitExceededException",
  zt = "LoginsMap",
  qt = "NotAuthorizedException",
  Kt = "ResourceConflictException",
  Bt = "ResourceNotFoundException",
  Vt = "SecretKey",
  Wt = "SecretKeyString",
  Jt = "SessionToken",
  Xt = "TooManyRequestsException",
  h = "client",
  u = "error",
  y = "httpError",
  l = "message",
  Yt = "server",
  re = "smithy.ts.sdk.synthetic.com.amazonaws.cognitoidentity",
  n = "com.amazonaws.cognitoidentity";
var Qt = [0, n, Nt, 8, 0],
  Zt = [0, n, Wt, 8, 0],
  en = [-3, n, At, { [u]: h, [y]: 400 }, [l], [0]];
p.for(n).registerError(en, T);
var tn = [3, n, oe, 0, [Ct, Vt, Jt, wt], [0, [() => Zt, 0], 0, 4]],
  nn = [-3, n, Rt, { [u]: h, [y]: 400 }, [l], [0]];
p.for(n).registerError(nn, G);
var on = [-3, n, Dt, { [u]: h, [y]: 400 }, [l], [0]];
p.for(n).registerError(on, O);
var sn = [3, n, kt, 0, [H, se, _t], [0, [() => ie, 0], 0]],
  rn = [3, n, Ft, 0, [H, oe], [0, [() => tn, 0]]],
  an = [3, n, Ut, 0, [xt, Lt, se], [0, 0, [() => ie, 0]]],
  cn = [3, n, Gt, 0, [H], [0]],
  dn = [-3, n, Tt, { [u]: Yt }, [l], [0]];
p.for(n).registerError(dn, _);
var pn = [-3, n, Ht, { [u]: h, [y]: 400 }, [l], [0]];
p.for(n).registerError(pn, U);
var un = [-3, n, Mt, { [u]: h, [y]: 400 }, [l], [0]];
p.for(n).registerError(un, R);
var ln = [-3, n, jt, { [u]: h, [y]: 400 }, [l], [0]];
p.for(n).registerError(ln, w);
var gn = [-3, n, qt, { [u]: h, [y]: 403 }, [l], [0]];
p.for(n).registerError(gn, D);
var hn = [-3, n, Kt, { [u]: h, [y]: 409 }, [l], [0]];
p.for(n).registerError(hn, $);
var yn = [-3, n, Bt, { [u]: h, [y]: 404 }, [l], [0]];
p.for(n).registerError(yn, F);
var mn = [-3, n, Xt, { [u]: h, [y]: 429 }, [l], [0]];
p.for(n).registerError(mn, k);
var fn = [-3, re, "CognitoIdentityServiceException", 0, [], []];
p.for(re).registerError(fn, c);
var ie = [2, n, zt, 0, [0, 0], [() => Qt, 0]],
  En = [9, n, $t, 0, () => sn, () => rn],
  In = [9, n, Ot, 0, () => an, () => cn];
class bn extends X.classBuilder()
  .ep(Q)
  .m(function (t, o, a, d) {
    return [Y(a, t.getEndpointParameterInstructions())];
  })
  .s("AWSCognitoIdentityService", "GetCredentialsForIdentity", {})
  .n("CognitoIdentityClient", "GetCredentialsForIdentityCommand")
  .sc(En)
  .build() {}
class Sn extends X.classBuilder()
  .ep(Q)
  .m(function (t, o, a, d) {
    return [Y(a, t.getEndpointParameterInstructions())];
  })
  .s("AWSCognitoIdentityService", "GetId", {})
  .n("CognitoIdentityClient", "GetIdCommand")
  .sc(In)
  .build() {}
export {
  Pn as CognitoIdentityClient,
  bn as GetCredentialsForIdentityCommand,
  Sn as GetIdCommand,
};
//# sourceMappingURL=loadCognitoIdentity-BNVb-H7P.js.map
