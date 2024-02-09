import { cn } from '@/utils/style';
import React, { ComponentPropsWithoutRef, FC } from 'react';

// ComponentPropsWithoutRef<'button'>을 사용하여
// HTMLButtonElement의 모든 속성들을 포함하는 타입을 정의
type ButtonProps = ComponentPropsWithoutRef<'button'>;

const Button: FC<ButtonProps> = ({ className, children, ...rest }) => {
  return (
    // button 요소를 반환 / className과 children을 전달
    <button
      className={cn(
        'w-full rounded-md bg-gray-800 py-2 text-white transition-all hover:bg-gray-900',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
