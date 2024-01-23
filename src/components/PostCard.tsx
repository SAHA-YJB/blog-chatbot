import { Post } from '@/types';
import { cn } from '@/utils/style';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

// Omit은 특정 타입에서 몇 개의 속성을 제외하고 싶을 때 사용
type PostCardProps = Omit<Post, 'tags'> & {
  className?: string;
};

const PostCard: FC<PostCardProps> = ({
  id,
  title,
  content,
  preview_image_url,
  className,
}) => {
  return (
    <Link href={`/posts/${id}`} className={cn('bg-white', className)}>
      {/* aspext = 가로 세로 비율 */}
      <div className="relative aspect-[1.8/1]">
        {/* fill속성 추가시 상위 요소에 맞춰 자동 정렬 */}
        <Image
          src={preview_image_url ?? '/next.png'}
          alt={title}
          sizes="360px"
          fill
          className="object-cover"
        />
      </div>
      <div className="p-2">
        <h2 className="text-lg font-medium">{title}</h2>
        <p className="line-clamp-3 text-sm text-gray-500">{content}</p>
      </div>
    </Link>
  );
};

export default PostCard;
