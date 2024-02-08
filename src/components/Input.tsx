import { cn } from '@/utils/style';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

// ComponentPropsWithoutRef<'input'>을 통해 HTMLInputElement의 모든 속성들을 포함하는 타입을 정의
type InputProps = ComponentPropsWithoutRef<'input'>;

// forwardRef를 사용하여 ref를 전달받을 수 있는 Input 컴포넌트를 정의
// 이 컴포넌트는 InputProps 타입의 props를 받음
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...rest }, ref) => {
    return (
      <input
        ref={ref} //ref를 전달함
        className={cn(
          'rounded-md border border-gray-300 p-2 transition-all hover:border-gray-400',
          className, // 사용자가 추가로 전달한 className이 있으면 추가
        )}
        {...rest} // 사용자가 전달한 나머지 props를 모두 전달함
      />
    );
  },
);

export default Input;

Input.displayName = 'Input';
