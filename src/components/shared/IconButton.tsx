import { cloneElement, CSSProperties, ReactElement } from 'react';
import { Button } from '../ui/button';

type IconButtonProps = {
  icon: React.ReactNode;
  title?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
};
const IconButton = ({
  icon,
  title,
  onClick,
  style,
  size = 'md',
}: IconButtonProps) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
    '2xl': 'w-14 h-14',
  };
  const roundedMap = {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    '2xl': 'rounded-2xl',
  };
  const iconSizeMap = {
    sm: '12px',
    md: '16px',
    lg: '18px',
    xl: '24px',
    '2xl': '24px',
  };
  return (
    <div className="flex flex-col items-center justify-center ">
      <Button
        variant="outline"
        className={`${roundedMap[size]} ${sizeMap[size]} cursor-pointer`}
        onClick={onClick}
        style={style}
      >
        {cloneElement(
          icon as ReactElement,
          {
            style: {
              width: iconSizeMap[size],
              height: iconSizeMap[size],
            },
          } as CSSProperties
        )}
      </Button>
      {title && <span className="text-[10px] mb-1 mt-1">{title}</span>}
    </div>
  );
};

export default IconButton;
