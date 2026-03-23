import type { ReactNode } from 'react';

function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

type ButtonProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  variant?: 'neutral' | 'primary';
  size?: 'default' | 'compact';
  icon?: ReactNode;
  ariaLabel?: string;
};

export function Button({
  children,
  className,
  onClick,
  disabled = false,
  active = false,
  variant = 'neutral',
  size = 'default',
  icon,
  ariaLabel,
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active || undefined}
      aria-label={ariaLabel}
      className={cx(
        'ds-button',
        variant === 'primary' && 'ds-button--primary',
        size === 'compact' && 'ds-button--compact',
        active && 'is-active',
        className,
      )}
    >
      {icon ? (
        <span className="ds-button__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="ds-button__label">{children}</span>
    </button>
  );
}

type IconButtonProps = {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  outline?: boolean;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
};

export function IconButton({
  ariaLabel,
  children,
  className,
  outline = false,
  onClick,
  active = false,
  disabled = false,
}: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
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
  disabled?: boolean;
  variant?: 'neutral' | 'primary';
  size?: 'default' | 'compact';
};

export function ActionPill({
  icon,
  label,
  className,
  onClick,
  disabled = false,
  variant = 'neutral',
  size = 'default',
}: ActionPillProps) {
  return (
    <Button className={cx('ds-action-pill', className)} onClick={onClick} disabled={disabled} variant={variant} size={size} icon={icon}>
      {label}
    </Button>
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
