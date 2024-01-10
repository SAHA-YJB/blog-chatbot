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

##### NextJS / ESlint-Prettier / TailwindCSS / Supabase

### 1. 페이지 / 레이아웃 구현

###### - NextJS라우팅 / 테일윈드 반응형 레이아웃

###### - Sidebar / Dynamic Route

###### - common IconButton Component
