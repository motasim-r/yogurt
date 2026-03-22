import type { ReactNode } from 'react';

function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

type IconButtonProps = {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  outline?: boolean;
  onClick?: () => void;
  active?: boolean;
};

export function IconButton({ ariaLabel, children, className, outline = false, onClick, active = false }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={ariaLabel}
      className={cx('ds-icon-button', outline && 'ds-icon-button--outline', active && 'is-active', className)}
    >
      {children}
    </button>
  );
}

type SidebarItemProps = {
  icon: ReactNode;
  label: string;
  active?: boolean;
  className?: string;
  onClick?: () => void;
};

export function SidebarItem({ icon, label, active = false, className, onClick }: SidebarItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx('ds-sidebar-item', active && 'is-active', className)}
    >
      <span className="ds-sidebar-item__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="ds-sidebar-item__label">{label}</span>
    </button>
  );
}

type ActionPillProps = {
  icon: ReactNode;
  label: string;
  className?: string;
  onClick?: () => void;
};

export function ActionPill({ icon, label, className, onClick }: ActionPillProps) {
  return (
    <button type="button" className={cx('ds-action-pill', className)} onClick={onClick}>
      <span className="ds-action-pill__icon" aria-hidden="true">
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}

type TimelineRowProps = {
  title: string;
  owner: string;
  time: string;
  leading: ReactNode;
  trailing: ReactNode;
  active?: boolean;
  onClick?: () => void;
};

export function TimelineRow({ title, owner, time, leading, trailing, active = false, onClick }: TimelineRowProps) {
  return (
    <button type="button" className={cx('ds-timeline-row', active && 'is-active')} onClick={onClick}>
      <span className="ds-timeline-row__leading" aria-hidden="true">
        {leading}
      </span>
      <span className="ds-timeline-row__copy">
        <span className="ds-timeline-row__title">{title}</span>
        <span className="ds-timeline-row__owner">{owner}</span>
      </span>
      <span className="ds-timeline-row__meta">
        {trailing}
        <span className="ds-timeline-row__time">{time}</span>
      </span>
    </button>
  );
}
