import { Database } from './supabase';

// Post 타입: Database['public']['Tables']['Post']['Row']
// 타입에서 tags 프로퍼티를 제외한 모든 프로퍼티를 가짐
// 추가로 tags 프로퍼티는 문자열 배열 타입
// Post 타입은 블로그 포스트의 모든 데이터를 표현
// tags 프로퍼티는 별도로 문자열 배열로 처리되어 있어, 태그를 여러 개 가짐
export type Post = Omit<Database['public']['Tables']['Post']['Row'], 'tags'> & {
  tags: string[];
};

// PostRequest 타입: Database['public']['Tables']['Post']['Insert']
// 새로운 블로그 포스트를 데이터베이스에 삽입하는 데 필요한 데이터의 형태를 표현
// Database라는 별도의 타입을 기반으로 정의
export type PostRequest = Database['public']['Tables']['Post']['Insert'];
