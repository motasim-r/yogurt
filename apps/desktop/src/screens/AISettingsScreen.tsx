import type { ReactNode } from 'react';
import { LinkIcon, SparkleIcon } from '../design-system/icons';
import type { CodexAIStatus } from '../shared/types';

type AISettingsScreenProps = {
  sidebar: ReactNode;
  status: CodexAIStatus | null;
  error: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  isConnecting: boolean;
  isDisconnecting: boolean;
};

function formatDateTimeLabel(value: string | null): string {
  if (!value) {
    return 'Not available';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) {
    return value;
  }
  return parsed.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function AISettingsScreen({
  sidebar,
  status,
  error,
  onConnect,
  onDisconnect,
  isConnecting,
  isDisconnecting,
}: AISettingsScreenProps) {
  return (
    <div className="granola-frame">
      {sidebar}

      <main className="granola-main granola-main--ai">
        <section className="ai-settings-shell" aria-label="AI settings">
          <header className="ai-settings-header">
            <div>
              <p className="ai-settings-header__eyebrow">Global AI</p>
              <h1>AI Settings</h1>
              <p>Yogurt uses your Codex CLI login through the same `openai-codex` OAuth profile used by IronClaw/OpenClaw.</p>
            </div>
            <div className="ai-settings-header__actions">
              <button type="button" className="tasks-primary-button" onClick={onConnect} disabled={isConnecting}>
                {isConnecting ? 'Opening Terminal...' : 'Reconnect Codex'}
              </button>
              <button type="button" className="tasks-soft-button" onClick={onDisconnect} disabled={isDisconnecting}>
                {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
              </button>
            </div>
          </header>

          {error ? <p className="tasks-error">{error}</p> : null}

          <div className="ai-settings-grid">
            <section className="ai-settings-card">
              <header className="ai-settings-card__header">
                <SparkleIcon className="glyph-18" />
                <div>
                  <h2>Connection</h2>
                  <p>Reusable model access for tasks, docs, chat summaries, and future AI actions.</p>
                </div>
              </header>

              <div className="ai-settings-card__rows">
                <div>
                  <span>State</span>
                  <strong>{status?.connected ? 'Connected' : status?.state ?? 'Unknown'}</strong>
                </div>
                <div>
                  <span>Profile</span>
                  <strong>{status?.profile ?? 'ironclaw'}</strong>
                </div>
                <div>
                  <span>OAuth profile</span>
                  <strong>{status?.profileId ?? 'Not connected'}</strong>
                </div>
                <div>
                  <span>Model surface</span>
                  <strong>{status?.modelLabel ?? 'Codex / Auto'}</strong>
                </div>
                <div>
                  <span>Gateway</span>
                  <strong>{status?.gatewayState ?? 'unknown'}</strong>
                </div>
                <div>
                  <span>Last checked</span>
                  <strong>{formatDateTimeLabel(status?.lastCheckedAt ?? null)}</strong>
                </div>
              </div>

              {status?.reason ? <p className="ai-settings-card__reason">{status.reason}</p> : null}
            </section>

            <section className="ai-settings-card">
              <header className="ai-settings-card__header">
                <LinkIcon className="glyph-18" />
                <div>
                  <h2>Why this exists</h2>
                  <p>One login path for all future Yogurt AI work, without separate API keys in the app.</p>
                </div>
              </header>

              <ul className="ai-settings-card__bullets">
                <li>Task briefs and summaries can run through the same Codex auth used in your other IronClaw/OpenClaw tools.</li>
                <li>Future doc rewriting, chat summarization, and context synthesis can all reuse this service layer.</li>
                <li>The connection stays global while specific features stay product-scoped.</li>
              </ul>

              <div className="ai-settings-card__rows">
                <div>
                  <span>Gateway URL</span>
                  <strong>{status?.gatewayUrl ?? 'Unavailable'}</strong>
                </div>
                <div>
                  <span>Dashboard URL</span>
                  <strong>{status?.dashboardUrl ?? 'Unavailable'}</strong>
                </div>
                <div>
                  <span>Expires</span>
                  <strong>{formatDateTimeLabel(status?.expiresAt ?? null)}</strong>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
