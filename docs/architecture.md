# Frontend Architecture

## 1. 목적

이 문서는 프론트엔드 프로젝트의 폴더 구조와 개발 규칙을 정의한다.

본 프로젝트는 다음 기준으로 구성한다.

- 페이지 단위 라우팅은 `pages`에서 관리한다.
- 재사용 가능한 UI는 `components`에 둔다.
- 도메인별 기능 단위 코드는 `features`에 둔다.
- API 요청 코드는 `apis`에 둔다.
- 전역 상태는 `stores`에 둔다.
- 타입 정의는 `types`에 둔다.
- 공통 유틸 함수는 `utils`에 둔다.
- 앱 초기 설정은 `app`에서 관리한다.
- 스타일링은 Tailwind CSS utility class를 기본으로 사용한다.

---

## 2. 전체 폴더 구조

```text
src
├── apis
├── app
├── components
├── features
├── hooks
├── pages
├── stores
├── types
└── utils
````

---

## 3. 폴더별 역할

## 3.0 스타일링

본 프로젝트의 UI 스타일링은 Tailwind CSS를 기준으로 작성한다.

### 역할

* 컴포넌트 단위 스타일 작성
* 반응형 레이아웃 작성
* hover, active, disabled 같은 UI 상태 표현
* 디자인 시스템 토큰을 utility class로 매핑

### 규칙

* 새로운 CSS-in-JS, CSS Module, 별도 스타일 라이브러리를 임의로 추가하지 않는다.
* Tailwind arbitrary value는 Figma 구현에 꼭 필요한 경우에만 사용한다.
* 색상, 여백, radius, typography 값은 `docs/design-system.md`에 정의된 기준을 우선한다.
* 공통으로 반복되는 조합은 `components`의 재사용 컴포넌트로 분리한다.

---

## 3.1 `apis`

서버 API 요청을 담당하는 폴더다.

백엔드와 통신하는 코드는 이곳에 작성한다.

```text
src/apis
├── client.ts
├── index.ts
└── {domain}
    ├── get.ts
    ├── post.ts
    ├── patch.ts
    ├── delete.ts
    └── index.ts
```

### 역할

* Axios 인스턴스 생성
* API 요청 함수 작성
* 요청/응답 타입 연결
* 토큰 인터셉터 관리
* 에러 응답 처리

### 예시

```ts
// src/apis/space/get.ts

import { apiClient } from "@/apis/client";

export const getSpaces = async () => {
  const response = await apiClient.get("/spaces");
  return response.data;
};
```

### 규칙

* 컴포넌트 안에서 직접 `axios.get()`을 호출하지 않는다.
* 모든 API 요청은 `apis` 폴더의 함수로 분리한다.
* API 함수명은 동사 기반으로 작성한다.
* API는 도메인 디렉터리 아래에서 HTTP method 파일로 분리한다.
* 존재하지 않는 HTTP method 파일은 만들지 않는다.
* 도메인 `index.ts`에서 공개 API를 재export한다.
* 루트 `src/apis/index.ts`는 도메인 API를 namespace로 집계한다.

```ts
getSpaces()
getSpaceDetail()
createReservation()
deleteReservation()
```

---

## 3.2 `app`

앱의 최상위 설정을 관리하는 폴더다.

라우터, Provider, 전역 스타일, 앱 초기화 코드를 둔다.

```text
src/app
├── App.tsx
├── Router.tsx
├── providers.tsx
└── layout.tsx
```

### 역할

* 앱 진입점 구성
* 라우터 설정
* 전역 Provider 설정
* 전역 레이아웃 관리

### 예시

```tsx
// src/app/Router.tsx

import { createBrowserRouter } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import SpaceListPage from "@/pages/SpaceListPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/spaces",
    element: <SpaceListPage />,
  },
]);
```

### 규칙

* 페이지 컴포넌트 자체는 `pages`에 둔다.
* `app`에는 앱 전체 설정만 둔다.
* 비즈니스 로직을 `app`에 작성하지 않는다.

---

## 3.3 `components`

공통 UI 컴포넌트를 관리하는 폴더다.

여러 페이지나 기능에서 재사용되는 컴포넌트만 이곳에 둔다.

```text
src/components
├── common
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Modal.tsx
├── layout
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Sidebar.tsx
└── ui
    ├── Card.tsx
    └── Badge.tsx
```

### 역할

* 버튼, 입력창, 모달 등 공통 UI 관리
* Header, Footer, Sidebar 같은 레이아웃 컴포넌트 관리
* 특정 도메인에 종속되지 않는 컴포넌트 관리

### 예시

```tsx
// src/components/common/Button.tsx

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function Button({ children, onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}
```

### 규칙

* 특정 기능에만 쓰이는 컴포넌트는 `features` 안에 둔다.
* `components`에는 최대한 순수 UI 컴포넌트를 둔다.
* API 호출 코드는 작성하지 않는다.

---

## 3.4 `features`

도메인별 기능 단위 코드를 관리하는 폴더다.

하나의 기능과 관련된 컴포넌트, 훅, 타입, 로직을 한곳에 모은다.

```text
src/features
├── auth
│   ├── components
│   ├── hooks
│   ├── types.ts
│   └── utils.ts
├── space
│   ├── components
│   ├── hooks
│   ├── types.ts
│   └── utils.ts
└── reservation
    ├── components
    ├── hooks
    ├── types.ts
    └── utils.ts
```

### 역할

* 로그인, 회원가입
* 공간 목록, 공간 상세
* 예약 생성, 예약 확인
* 마이페이지 기능
* 도메인별 UI와 로직 관리

### 예시

```text
src/features/space
├── components
│   ├── SpaceCard.tsx
│   └── SpaceFilter.tsx
├── hooks
│   └── useSpaces.ts
├── types.ts
└── utils.ts
```

### 규칙

* 특정 도메인에만 쓰이는 코드는 `features` 안에 둔다.
* 공통으로 재사용될 가능성이 높은 경우에만 `components`, `hooks`, `utils`로 이동한다.
* 기능별 응집도를 우선한다.

---

## 3.5 `hooks`

공통 커스텀 훅을 관리하는 폴더다.

여러 기능에서 재사용되는 훅만 이곳에 둔다.

```text
src/hooks
├── useDebounce.ts
├── useModal.ts
├── usePagination.ts
└── useOutsideClick.ts
```

### 역할

* 공통 상태 로직 관리
* UI 동작 로직 재사용
* 반복되는 React 로직 분리

### 예시

```ts
// src/hooks/useModal.ts

import { useState } from "react";

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return { isOpen, open, close };
}
```

### 규칙

* 특정 기능 전용 훅은 `features/{domain}/hooks`에 둔다.
* 공통 훅만 `src/hooks`에 둔다.
* 훅 이름은 반드시 `use`로 시작한다.

---

## 3.6 `pages`

라우트에 연결되는 페이지 컴포넌트를 관리하는 폴더다.

각 파일은 하나의 화면을 의미한다.

```text
src/pages
├── HomePage.tsx
├── LoginPage.tsx
├── SignupPage.tsx
├── SpaceListPage.tsx
├── SpaceDetailPage.tsx
├── ReservationPage.tsx
└── MyPage.tsx
```

### 역할

* 라우터와 직접 연결되는 화면 관리
* 페이지 레이아웃 조립
* `features`와 `components`를 조합하여 화면 구성

### 예시

```tsx
// src/pages/SpaceListPage.tsx

import SpaceList from "@/features/space/components/SpaceList";

export default function SpaceListPage() {
  return (
    <main>
      <SpaceList />
    </main>
  );
}
```

### 규칙

* 페이지에는 복잡한 비즈니스 로직을 많이 넣지 않는다.
* 실제 기능 로직은 `features`로 분리한다.
* 페이지는 화면 조립 역할에 집중한다.

---

## 3.7 `stores`

전역 상태 관리를 담당하는 폴더다.

로그인 사용자 정보, 인증 토큰, 전역 UI 상태 등을 관리한다.

```text
src/stores
├── auth.store.ts
├── user.store.ts
└── ui.store.ts
```

### 역할

* 로그인 상태 관리
* 사용자 정보 관리
* 전역 모달, 토스트 등 UI 상태 관리
* 여러 페이지에서 공유되는 상태 관리

### 예시

```ts
// src/stores/auth.store.ts

import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
  clearAccessToken: () => set({ accessToken: null }),
}));
```

### 규칙

* 단일 페이지 안에서만 쓰는 상태는 `useState`를 사용한다.
* 여러 페이지에서 공유해야 하는 상태만 store로 올린다.
* 서버 데이터 캐싱 용도로 store를 남용하지 않는다.

---

## 3.8 `types`

전역 타입을 관리하는 폴더다.

여러 기능에서 공통으로 사용하는 타입을 둔다.

```text
src/types
├── common
│   ├── request
│   ├── response
│   └── index.ts
└── {domain}
    ├── request
    ├── response
    └── index.ts
```

### 역할

* API 요청 및 응답 타입 정의
* 도메인 간 공통 스키마 정의
* 도메인별 타입의 barrel export 관리

### 예시

```ts
// src/types/common/response/apiResponse.ts

export type ApiResponse<T> = {
  message: string;
  data: T;
};
```

### 규칙

* API 계약 타입은 `types/{domain}/request`, `types/{domain}/response`에 둔다.
* `types/common`은 여러 도메인에서 재사용하는 타입만 관리하며 공통 함수는 두지 않는다.
* 각 도메인의 `index.ts`에서 외부에 공개할 타입을 재export한다.
* enum 및 union 타입은 해당 도메인 파일에 두고 도메인 `index.ts`에서 재export한다.
* 타입명은 명확하게 작성한다.

---

## 3.9 `utils`

공통 유틸 함수를 관리하는 폴더다.

React에 의존하지 않는 순수 함수를 둔다.

```text
src/utils
├── formatDate.ts
├── formatPrice.ts
├── validation.ts
└── storage.ts
```

### 역할

* 날짜 포맷 변환
* 가격 포맷 변환
* 문자열 처리
* 로컬 스토리지 처리
* 검증 함수 관리

### 예시

```ts
// src/utils/formatPrice.ts

export function formatPrice(price: number) {
  return price.toLocaleString("ko-KR") + "원";
}
```

### 규칙

* React Hook은 `utils`에 두지 않는다.
* API 요청 함수는 `apis`에 둔다.
* 도메인 전용 유틸은 `features/{domain}/utils.ts`에 둔다.

---

## 4. 코드 작성 흐름

새로운 기능을 개발할 때는 아래 순서로 작성한다.

```text
1. 페이지 생성
2. 필요한 feature 폴더 생성
3. API 함수 작성
4. feature 내부 컴포넌트 작성
5. 필요한 타입 정의
6. 페이지에서 조립
7. 라우터에 등록
```

예를 들어 공간 목록 기능을 만든다면 다음과 같이 작성한다.

```text
src/apis/space/get.ts
src/apis/space/index.ts
src/types/space/request/spaceListSearchParams.ts
src/types/space/response/spaceListSearchResponse.ts
src/types/space/index.ts
src/features/space/components/SpaceList.tsx
src/features/space/components/SpaceCard.tsx
src/features/space/hooks/useSpaces.ts
src/features/space/types.ts
src/pages/SpaceListPage.tsx
src/app/Router.tsx
```

---

## 5. Import 규칙

절대 경로 alias를 사용한다.

```ts
import Button from "@/components/common/Button";
import { getSpaces } from "@/apis/space";
import type { SpaceListSearchResponse } from "@/types/space";
import { useAuthStore } from "@/stores/auth.store";
```

`@/*` alias는 `src/*`를 가리킨다. 같은 디렉터리 내부의 짧은 상대경로를 제외하고,
도메인 간 import는 절대경로 alias를 사용한다.

상대 경로가 너무 깊어지는 import는 피한다.

```ts
// 지양
import Button from "../../../components/common/Button";

// 권장
import Button from "@/components/common/Button";
```

---

## 6. 네이밍 규칙

## 6.1 파일명

| 대상    | 규칙                         | 예시              |
| ----- | -------------------------- | --------------- |
| 페이지   | PascalCase + Page          | `HomePage.tsx`  |
| 컴포넌트  | PascalCase                 | `SpaceCard.tsx` |
| 훅     | camelCase, use 접두사         | `useModal.ts`   |
| API 디렉터리 | domain + HTTP method | `space/get.ts` |
| 타입 디렉터리 | domain/request 또는 response | `space/request/spaceCreateRequest.ts` |
| Store | domain.store.ts            | `auth.store.ts` |
| 유틸    | camelCase                  | `formatDate.ts` |

---

## 6.2 함수명

| 대상         | 규칙           | 예시                                |
| ---------- | ------------ | --------------------------------- |
| API 조회     | get          | `getSpaces`                       |
| API 생성     | create       | `createReservation`               |
| API 수정     | update       | `updateUser`                      |
| API 삭제     | delete       | `deleteReservation`               |
| 이벤트 핸들러    | handle       | `handleSubmit`                    |
| boolean 변수 | is, has, can | `isOpen`, `hasToken`, `canSubmit` |

---

## 7. 데이터 흐름

기본 데이터 흐름은 다음과 같다.

```text
Page
 → Feature Component
 → Feature Hook
 → API Function
 → Backend Server
```

예시:

```text
SpaceListPage
 → SpaceList
 → useSpaces
 → getSpaces
 → GET /spaces
```

### 원칙

* 페이지는 화면을 조립한다.
* 컴포넌트는 UI를 표현한다.
* 훅은 상태와 로직을 관리한다.
* API 함수는 서버 통신을 담당한다.
* Store는 전역 상태만 관리한다.

---

## 8. API 연동 규칙

API 연동 시 다음 구조를 따른다.

```text
apis
├── client.ts
├── index.ts
└── {domain}
    ├── get.ts
    ├── post.ts
    ├── patch.ts
    ├── delete.ts
    └── index.ts
```

### `client.ts`

```ts
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
```

브라우저에서는 `NEXT_PUBLIC_API_BASE_URL=/api`를 사용하고, Next.js rewrite가
`API_BASE_URL`에 설정된 백엔드 주소로 요청을 프록시한다. 이미지 업로드처럼
별도 서버를 사용하는 API는 `NEXT_PUBLIC_IMAGE_API_BASE_URL=/image-api`와
`IMAGE_API_BASE_URL` rewrite를 사용한다. 이를 통해 로컬 개발과 배포 환경에서
동일 출처 정책을 유지한다.

### 도메인 API 파일

```ts
import { apiClient } from "@/apis/client";
import type { ApiResponse } from "@/types/common";
import type { SpaceListSearchResponse } from "@/types/space";

export const getSpaces = async (): Promise<
  ApiResponse<{ spaces: SpaceListSearchResponse[] }>
> => {
  const response = await apiClient.get<
    ApiResponse<{ spaces: SpaceListSearchResponse[] }>
  >("/spaces");
  return response.data;
};
```

### 규칙

* API URL은 컴포넌트에 직접 작성하지 않는다.
* `baseURL`은 환경 변수로 관리한다.
* API 응답 타입은 가능한 한 명시한다.
* 인증 토큰이 필요한 경우 interceptor에서 처리한다.
* 사용처는 `@/apis/{domain}`에서 함수를 import하거나 namespace import를 사용한다.

### Google OAuth 흐름

Google OAuth는 프런트엔드 callback 방식을 사용한다.

```text
LoginForm
 → GET /api/auth/oauth/google
 → Google 인증
 → /auth/oauth/google/callback?code=...[&state=...]
 → GET /api/auth/oauth/google/callback?code=...[&state=...]
 → access/refresh token 저장
 → /main
```

* 프런트엔드 callback은 Google이 전달한 `code`를 백엔드 callback API에 전달한다.
* `state`가 함께 전달된 경우에는 백엔드 callback API에 그대로 전달한다.
* 백엔드가 반환한 access/refresh token은 현재 인증 정책에 따라 `localStorage`에 저장한다.
* Google Console과 백엔드의 redirect URI는 프런트엔드 `/auth/oauth/google/callback`과 완전히 일치해야 한다.

### 실시간 통신 (WebSocket/STOMP)

채팅처럼 실시간 송수신이 필요한 기능은 REST 대신 STOMP over WebSocket을 사용한다.

```text
연결 endpoint: /ws/chat
Client SEND prefix: /app
Broker subscribe prefix: /topic, /queue
```

* 방/기록 조회·생성처럼 상태를 변경하지 않는 조회성 데이터는 기존 REST(`apis/{domain}`)로 가져온다.
* 실시간 송신/수신만 `@stomp/stompjs` 클라이언트로 처리하며, 관련 코드는 `features/{domain}/hooks`에 훅으로 캡슐화한다(예: `features/chat/hooks/useChatSocket.ts`).
* STOMP CONNECT 시 native header에 `Authorization: Bearer {access_token}`을 담아 인증한다.
* WebSocket 연결 주소는 `NEXT_PUBLIC_WS_BASE_URL` 환경 변수로 관리하며, REST의 `/api` rewrite 프록시와 달리 브라우저가 백엔드 origin에 직접 연결한다(Next.js rewrite는 WebSocket upgrade를 프록시하지 않기 때문).

---

## 9. 상태 관리 기준

## 9.1 `useState`를 쓰는 경우

* 하나의 컴포넌트 안에서만 쓰는 상태
* input 값
* 모달 열림 여부
* 체크박스 상태
* 탭 상태

## 9.2 `stores`를 쓰는 경우

* 로그인 상태
* 사용자 정보
* 여러 페이지에서 공유되는 값
* 전역 UI 상태

## 9.3 서버 상태 관리

서버에서 가져온 데이터는 가능하면 React Query 사용을 고려한다.

예시:

* 공간 목록
* 예약 내역
* 사용자 정보 조회
* 랭킹 데이터

전역 store에 서버 데이터를 무조건 저장하지 않는다.

---

## 10. 컴포넌트 분리 기준

컴포넌트가 다음 조건 중 하나에 해당하면 분리한다.

* 코드가 너무 길어진다.
* 같은 UI가 반복된다.
* 특정 영역의 역할이 명확하다.
* 재사용 가능성이 있다.
* 조건부 렌더링이 복잡하다.

예시:

```text
SpaceDetailPage
├── SpaceImageGallery
├── SpaceInfo
├── SpaceLocation
├── ReservationBox
└── ReviewList
```

---

## 11. Feature 구조 예시

```text
src/features/space
├── components
│   ├── SpaceCard.tsx
│   ├── SpaceList.tsx
│   ├── SpaceFilter.tsx
│   └── SpaceSearchBar.tsx
├── hooks
│   ├── useSpaces.ts
│   └── useSpaceFilter.ts
├── types.ts
└── utils.ts
```

```text
src/features/auth
├── components
│   ├── LoginForm.tsx
│   └── SignupForm.tsx
├── hooks
│   └── useLogin.ts
├── types.ts
└── utils.ts
```

---

## 12. 권장 개발 방식

처음부터 구조를 너무 복잡하게 만들지 않는다.

기본 원칙은 다음과 같다.

```text
작게 만든다.
중복되면 분리한다.
여러 곳에서 쓰이면 공통화한다.
기능 단위로 묶는다.
페이지는 조립만 한다.
```

처음 개발할 때는 아래 정도만 지켜도 충분하다.

```text
pages      → 화면
features   → 기능별 컴포넌트와 로직
apis       → 백엔드 통신
components → 공통 UI
stores     → 전역 상태
types      → 공통 타입
utils      → 공통 함수
```

---

## 13. 금지 사항

다음 방식은 지양한다.

```text
- 페이지 파일 하나에 모든 코드를 몰아넣기
- 컴포넌트 안에서 직접 API 호출하기
- 모든 상태를 전역 store에 넣기
- 모든 컴포넌트를 components 폴더에 넣기
- 도메인 전용 코드를 공통 폴더에 넣기
- 타입을 any로 대충 처리하기
- API URL을 여러 파일에 하드코딩하기
```

---

## 14. 최종 기준

이 프로젝트의 프론트엔드 구조는 다음 기준을 따른다.

```text
src/apis        서버 통신
src/app         앱 설정
src/components  공통 UI
src/features    기능 단위 코드
src/hooks       공통 훅
src/pages       라우트 페이지
src/stores      전역 상태
src/types       공통 타입
src/utils       공통 함수
```

폴더를 선택할 때는 아래 질문을 기준으로 판단한다.

```text
이 코드는 서버 통신인가? → apis
이 코드는 라우트 화면인가? → pages
이 코드는 여러 곳에서 쓰는 UI인가? → components
이 코드는 특정 기능에만 속하는가? → features
이 코드는 여러 곳에서 쓰는 훅인가? → hooks
이 코드는 전역 상태인가? → stores
이 코드는 공통 타입인가? → types
이 코드는 공통 함수인가? → utils
```
