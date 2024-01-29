# Blog-ChatBot Flow-Chart

```mermaid
flowchart LR
  Home[메인화면]
  Sidebar(사이드바)
  Header(헤더)
  Footer(푸터)
  List(글 목록)

  Home --- Header
  Home --- Footer
  Home --- Sidebar
  Home --- List

  Create[글 작성 화면]
  Admin[관리자 페이지]
  Chatbot[챗봇 화면]
  ChatResult(챗봇 답변)
  Detail[글 상세 화면]

  Authorize{인증 여부}

  TagList[태그 목록 화면]
  Tag(태그별 글 목록)
  Category(카테고리별 글 목록)

  Header -.-> Chatbot -.-> ChatResult -.-> Detail
  Sidebar -.-> TagList -.-> Tag -.-> Detail
  Sidebar -.-> Category -.-> Detail
  Footer -.-> Authorize -.-> |Yes|Create -.-> Detail
  Authorize -.-> |No|Admin
  Footer -.-> Admin -.-> Create
  List -.-> Detail
```

### 개발 환경

##### NextJS / ESlint-Prettier / TailwindCSS / Supabase / Tanstack-Query

### 1. 페이지 / 레이아웃 구현

###### - NextJS라우팅 / 테일윈드 반응형 레이아웃

###### - Sidebar / Dynamic Route

###### - common IconButton Component

##

### 2. write / detail page

###### - 카테고리 및 태그 입력창(react-select) / 글 내용 작성(react-md-editor) / 글 작성 요청((pagesRouter용이)formidable) / 글 디테일 페이지(date-fns / react-markdown-preview)

###### - supabase connect / Post (table, column 생성)

### 2. List page

###### - 서버 상태관리를 위한 Tanstack-Query 사용

###### - getServerSideProps => useQuery 변경

###### - pageRouter dynamic route Category/Tag page

###### - Tanstack-Query infinity-scroll / react-intersection-observer를 이용한 무한 스크롤 구현
