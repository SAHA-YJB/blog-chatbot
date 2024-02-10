import React from 'react';
// 404페이지는 사용자가 잘못된 경로로 접근했을 때 보여줄 페이지입
// 자동으로 보여주는 페이지가 아니라 직접 만들어야 함, 커터마이징 가능
const _404 = () => {
  return (
    <div className="flex flex-col items-center p-24 text-4xl">
      404!!!
      <p>찾을 수 없는 페이지입니다.</p>
    </div>
  );
};

export default _404;
