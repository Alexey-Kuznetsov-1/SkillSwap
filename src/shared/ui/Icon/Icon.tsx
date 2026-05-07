import React from 'react';

export type IconName =
  | 'add'
  | 'arrow-left'
  | 'arrow-square-left'
  | 'arrow-square-right'
  | 'book'
  | 'briefcase'
  | 'calendar'
  | 'checkbox-done'
  | 'checkbox-empty'
  | 'checkbox-remove'
  | 'chevron-down'
  | 'chevron-right'
  | 'chevron-up'
  | 'clock'
  | 'count'
  | 'cross'
  | 'done'
  | 'edit'
  | 'error-404'
  | 'error-500'
  | 'eye-slash'
  | 'eye'
  | 'filter-square'
  | 'gallery-add'
  | 'gallery-edit'
  | 'global'
  | 'home'
  | 'idea'
  | 'lifestyle'
  | 'light-bulb'
  | 'like'
  | 'like-active'
  | 'logo'
  | 'logout'
  | 'message-text'
  | 'moon'
  | 'more-square'
  | 'navigation'
  | 'notification'
  | 'palette'
  | 'plus-circle'
  | 'radiobutton-active'
  | 'radiobutton-empty'
  | 'request'
  | 'school-board'
  | 'scroll-1'
  | 'scroll'
  | 'search'
  | 'share'
  | 'sort'
  | 'sun'
  | 'toggle'
  | 'toggle-active'
  | 'user-info'
  | 'user-circle'
  | 'user';

interface IconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  name: IconName;
  size?: number | string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  alt = '',
  'aria-label': ariaLabel,
  ...props
}) => {
  const iconPath = `/icons/${name}.svg`;

  return (
    <img
      src={iconPath}
      width={size}
      height={size}
      alt={alt || ariaLabel || name}
      {...props}
    />
  );
};
