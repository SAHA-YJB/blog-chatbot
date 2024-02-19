// 제네릭을 이용해서 컴포넌트의 타입 추론하기
import { cn } from '@/utils/style';
import { ComponentPropsWithoutRef, ElementType, createElement } from 'react';
import { IconType } from 'react-icons';

// 제네릭을 사용하여 컴포넌트의 타입을 받는 IconButtonProps를 정의
type IconButtonProps<Component extends ElementType> =
  ComponentPropsWithoutRef<Component> & {
    Icon: IconType;
    iconClassName?: string;
    className?: string;
    component?: Component;
    handleReset?: () => void;
  };

const IconButton = <Component extends ElementType = 'button'>({
  component,
  className,
  iconClassName,
  Icon,
  handleReset,
  // 컴포넌트 타입이 추론되면 나머지 props 타입을 추론할 수 있게 된다.ex) Link라면 href, target 등등
  ...props
}: IconButtonProps<Component>) => {
  // createElement를 사용하여 주어진 component를 생성
  // component가 없는 경우 기본값으로 'button'을 사용
  // 이 컴포넌트에는 className과 사용자가 전달한 나머지 props를 전달
  // 이 컴포넌트의 자식으로는 Icon 컴포넌트를 배치
  // createElement(엘리먼트, props, children)
  return createElement(
    component ?? 'button',
    {
      className: cn('p-1.5 lg:p-2', className),
      ...props,
    },
    <Icon
      className={cn('h-5 w-5 transition-all lg:h-6 lg:w-6', iconClassName)}
      onClick={handleReset}
    />,
  );
};

export default IconButton;
