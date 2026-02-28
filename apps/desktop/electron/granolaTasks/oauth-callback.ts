import http from 'node:http';

export interface OAuthCallbackServerOptions {
  host: string;
  preferredPort: number;
  maxPort: number;
  callbackPath: string;
}

export interface OAuthCallbackPayload {
  code: string | null;
  error: string | null;
  errorDescription: string | null;
}

export interface OAuthCallbackOutcome {
  ok: boolean;
  statusCode?: number;
  title?: string;
  message?: string;
}

export class OAuthCallbackServer {
  private server: http.Server | null = null;

  private activePort: number | null = null;

  constructor(private readonly options: OAuthCallbackServerOptions) {}

  get redirectUrl(): string {
    if (!this.activePort) {
      throw new Error('OAuth callback server is not running.');
    }
    return `http://${this.options.host}:${this.activePort}${this.options.callbackPath}`;
  }

  async start(onCallback: (payload: OAuthCallbackPayload) => Promise<OAuthCallbackOutcome | void>): Promise<string> {
    if (this.server && this.activePort) {
      return this.redirectUrl;
    }

    const { host, preferredPort, maxPort, callbackPath } = this.options;

    for (let port = preferredPort; port <= maxPort; port += 1) {
      const started = await new Promise<boolean>((resolve) => {
        const server = http.createServer(async (req, res) => {
          if (!req.url) {
            res.statusCode = 400;
            res.end('Missing URL.');
            return;
          }

          const requestUrl = new URL(req.url, `http://${host}:${port}`);
          if (requestUrl.pathname !== callbackPath) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end('Not found');
            return;
          }

          const payload: OAuthCallbackPayload = {
            code: requestUrl.searchParams.get('code'),
            error: requestUrl.searchParams.get('error'),
            errorDescription: requestUrl.searchParams.get('error_description'),
          };

          if (!payload.code && !payload.error) {
            renderHtml(res, 400, 'Missing authorization data', 'Please close this tab and try again.');
            return;
          }

          try {
            const outcome = (await onCallback(payload)) ?? {
              ok: true,
            };

            if (outcome.ok) {
              renderHtml(
                res,
                outcome.statusCode ?? 200,
                outcome.title ?? 'Granola connected',
                outcome.message ?? 'You can return to the app.',
              );
              return;
            }

            renderHtml(
              res,
              outcome.statusCode ?? 400,
              outcome.title ?? 'Authorization failed',
              outcome.message ?? 'Please return to the app and try connecting again.',
            );
          } catch (error) {
            const message =
              error instanceof Error && error.message ? error.message : 'Unable to complete authorization.';
            renderHtml(res, 500, 'Authorization failed', message);
          }
        });

        server.once('error', () => {
          server.close(() => resolve(false));
        });

        server.listen(port, host, () => {
          this.server = server;
          this.activePort = port;
          resolve(true);
        });
      });

      if (started) {
        return this.redirectUrl;
      }
    }

    throw new Error(`Unable to start OAuth callback server on ${host}:${preferredPort}-${maxPort}.`);
  }

  async close(): Promise<void> {
    const target = this.server;
    this.server = null;
    this.activePort = null;

    if (!target) {
      return;
    }

    await new Promise<void>((resolve) => {
      target.close(() => resolve());
    });
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderHtml(res: http.ServerResponse, statusCode: number, title: string, message: string): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(`<h1>${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p>`);
}
