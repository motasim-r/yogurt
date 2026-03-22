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

function formatConnectionLabel(status: CodexAIStatus | null): string {
  if (!status) {
    return 'Unknown';
  }
  if (status.connected) {
    return 'Connected';
  }
  return status.state === 'error' ? 'Needs attention' : 'Disconnected';
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
        <section className="ai-settings-shell workspace-body" aria-label="AI settings">
          <header className="ai-settings-header">
            <div className="ai-settings-header__copy">
              <p className="ai-settings-header__eyebrow">Global AI</p>
              <h1>AI</h1>
              <p>Use one Codex CLI login across task briefs, doc rewrites, chat summaries, and future Yogurt AI actions.</p>
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

          <section className="ai-settings-summary" aria-label="AI connection summary">
            <article className="ai-settings-summary-card">
              <span className="ai-settings-summary-card__label">Status</span>
              <strong>{formatConnectionLabel(status)}</strong>
              <small>{status?.gatewayState === 'connected' ? 'Gateway ready' : 'Gateway inactive'}</small>
            </article>
            <article className="ai-settings-summary-card">
              <span className="ai-settings-summary-card__label">Model surface</span>
              <strong>{status?.modelLabel ?? 'Codex / Auto'}</strong>
              <small>{status?.profile ?? 'ironclaw'}</small>
            </article>
            <article className="ai-settings-summary-card">
              <span className="ai-settings-summary-card__label">OAuth profile</span>
              <strong>{status?.profileId ?? 'Not connected'}</strong>
              <small>Shared with IronClaw/OpenClaw</small>
            </article>
          </section>

          <div className="ai-settings-grid">
            <section className="ai-settings-card">
              <header className="ai-settings-card__header">
                <span className="ai-settings-card__icon">
                  <SparkleIcon className="glyph-16" />
                </span>
                <div>
                  <h2>Connection</h2>
                  <p>Reusable model access for product-level AI features without extra keys in the app.</p>
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
                <span className="ai-settings-card__icon">
                  <LinkIcon className="glyph-16" />
                </span>
                <div>
                  <h2>Routing</h2>
                  <p>This connection stays global while each feature decides how to use it.</p>
                </div>
              </header>

              <ul className="ai-settings-card__bullets">
                <li>Task briefs and summaries can use the same Codex auth already active in IronClaw/OpenClaw.</li>
                <li>Future docs and chat features can reuse this layer without extra setup in Yogurt.</li>
                <li>Disconnecting here removes access globally until you reconnect.</li>
              </ul>

              <div className="ai-settings-card__rows">
                <div>
                  <span>Gateway URL</span>
                  <strong className="ai-settings-card__value ai-settings-card__value--wrap">{status?.gatewayUrl ?? 'Unavailable'}</strong>
                </div>
                <div>
                  <span>Dashboard URL</span>
                  <strong className="ai-settings-card__value ai-settings-card__value--wrap">{status?.dashboardUrl ?? 'Unavailable'}</strong>
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
