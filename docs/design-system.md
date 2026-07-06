# MomentLit Common Design System

Version 1.0

## Header Filter Chip

Header 검색 필터는 `FilterChip` `compact` 변형을 사용한다.

* 높이: `36px`
* 좌우 여백: `14px`
* 배경: `#EDEDED`
* 텍스트: `12px`, `#5E687E`
* radius: `12px`

이 문서는 MomentLit 프로젝트의 모든 웹 UI에서 공통으로 지켜야 하는 디자인 기준이다.

새로운 페이지나 레이아웃을 만들 때는 이 문서를 기준으로 작업한다.
새로운 색상, 폰트, 여백, radius, 레이아웃 규칙을 임의로 만들지 않는다.

스타일링은 Tailwind CSS utility class를 기본으로 사용한다.
Tailwind를 사용하더라도 색상, 폰트, 여백, radius, 레이아웃 값은 이 문서의 디자인 토큰을 기준으로 한다.
Figma 구현에 필요한 세부 치수가 이 문서에 없는 경우에는 가장 가까운 토큰을 우선 사용하고, 1:1 구현에 꼭 필요한 값만 arbitrary value로 제한적으로 작성한다.

---

# 1. Project Overview

## Project Name

MomentLit

## Service Description

MomentLit은 상인들이 보유한 가게의 유휴 공간을 필요한 사람에게 판매하거나 공유하여, 비어 있던 공간을 가치 있는 공간으로 바꾸는 플랫폼이다.

사용자는 단순히 공간을 예약하는 것이 아니라, 새로운 장소와 경험을 발견한다.

상인은 사용하지 않던 공간을 수익화할 수 있고, 사용자는 필요한 목적에 맞는 공간을 쉽게 찾을 수 있다.

## Target User

### Main Target

* 유휴 공간을 가진 상인
* 단기 공간이 필요한 사용자
* 팝업스토어, 모임, 촬영, 클래스, 소규모 이벤트 공간을 찾는 사람

### User Impression

사용자가 MomentLit을 보았을 때 다음 느낌을 받아야 한다.

* 친근하다
* 깨끗하다
* 신뢰할 수 있다
* 어렵지 않다
* 지역 기반 서비스처럼 현실적이다
* 공간을 쉽게 둘러보고 싶어진다

---

# 2. Brand Philosophy

MomentLit의 디자인은 공간을 돋보이게 하는 것을 최우선으로 한다.

서비스 자체가 과하게 화려하면 안 된다.
사용자가 집중해야 하는 것은 UI 장식이 아니라 공간 이미지, 위치, 날짜, 예약 정보이다.

디자인은 따뜻하고 친근해야 하지만, 너무 귀엽거나 장난스러워서는 안 된다.
상인과 사용자가 실제 거래를 하는 플랫폼이므로 기본적인 신뢰감이 필요하다.

## Design Direction

MomentLit은 다음 방향을 따른다.

* Simple
* Friendly
* Clean
* Bright
* Trustworthy
* Approachable
* Local
* Useful

## Avoid Direction

MomentLit은 다음 방향을 피한다.

* Luxury
* Cyber
* Futuristic
* Heavy
* Corporate SaaS
* Complex Dashboard
* Over-designed Landing Page
* Glassmorphism
* Neon Style

---

# 3. Visual Identity

MomentLit의 핵심 시각 언어는 다음과 같다.

## Core Identity

* 청록색을 메인 컬러로 사용한다.
* 밝은 회색 배경 위에 흰색 표면 영역과 청록색 포인트를 배치한다.
* 주요 UI 요소는 둥근 모서리를 사용한다.
* 그림자는 거의 사용하지 않는다.
* 정보보다 공간 이미지가 먼저 보이게 한다.
* 여백을 충분히 사용한다.
* 전체적으로 부드럽고 가벼운 인상을 유지한다.

## Visual Keywords

* 밝은 회색 배경
* 흰색 표면 영역
* 둥근 모서리
* 청록색 포인트
* 짙은 남색 계열 텍스트
* 부드러운 회색 보조 텍스트
* 단순한 아이콘
* 넓은 이미지 영역

---

# 4. Color System

AI는 아래 색상만 사용한다.
새로운 Primary Color를 임의로 만들지 않는다.

## Primary Color

### Main Color 500

`#00ADB5`

사용 위치:

* 주요 CTA
* 활성 상태
* 검색 액션
* 로고 포인트
* 중요한 강조 요소

### Main Color 600

`#00979E`

사용 위치:

* Hover 상태
* 강조 상태
* 눌림 전환 상태

### Main Color 700

`#007E84`

사용 위치:

* 강한 강조
* Active 상태
* 어두운 배경 위의 포인트

### Main Color 900

`#003F42`

사용 위치:

* 어두운 청록색 강조 영역
* 깊이감이 필요한 강조 요소

## Neutral Color

### Background

`#EEEEEE`

사용 위치:

* 전체 페이지 배경
* 섹션 배경
* 리스트 배경

### Surface

`#FFFFFF`

사용 위치:

* 주요 콘텐츠 영역
* 입력 영역
* 상단 영역
* 모달
* 드롭다운

### Text Primary

`#222831`

사용 위치:

* 제목
* 중요한 본문
* 주요 정보

### Text Secondary

`#67728A`

사용 위치:

* 날짜
* 주소
* 설명
* Footer 텍스트
* 비활성에 가까운 보조 텍스트

### Border

`#D0D3DB`

사용 위치:

* 입력 영역 경계선
* 검색 영역 경계선
* 구분선
* 보조 경계선

## State Color

### Danger

`#DA294A`

사용 위치:

* 삭제
* 위험 안내
* 중요한 경고
* 강한 주의가 필요한 활성 상태

주의: Danger 색상은 강조력이 강하므로 남발하지 않는다.

---

# 5. Typography

## Font Family

기본 폰트는 다음을 사용한다.

```text
Pretendard
```

## Font Rule

MomentLit은 둥글고 친근한 로고를 가지고 있지만, 본문 UI까지 과하게 귀여운 폰트를 사용하지 않는다.

본문과 UI 텍스트는 읽기 쉬운 Pretendard를 사용한다.

## Font Sizes

### Display

`80px`

사용 위치:

* 메인 랜딩의 가장 큰 문구
* 서비스 핵심 슬로건

사용 주의:

* 일반 페이지에서는 사용하지 않는다.
* 한 페이지에 1회 이하로 사용한다.

### Heading 1

`48px`

사용 위치:

* 랜딩 섹션 제목
* 주요 페이지 타이틀

### Heading 2

`36px`

사용 위치:

* 섹션 제목
* 페이지 내부 큰 제목

### Heading 3

`32px`

사용 위치:

* 주요 콘텐츠 그룹 제목
* 큰 영역 제목

### Title

`24px`

사용 위치:

* 콘텐츠 제목
* 중요 문장

### Body

`16px`

사용 위치:

* 일반 본문
* 기본 UI 텍스트
* 네비게이션
* 입력창

### Caption

`12px`

사용 위치:

* 작은 보조 설명
* 라벨
* 메타 정보

---

# 6. Font Weight

## Black

사용 위치:

* 메인 랜딩 문구

## ExtraBold

사용 위치:

* 큰 제목

## Bold

사용 위치:

* 일반 제목

## SemiBold

사용 위치:

* 섹션 제목
* 중요한 문장

## Medium

사용 위치:

* 강조 본문
* 활성 상태 텍스트
* 주요 액션 텍스트

## Regular

사용 위치:

* 일반 본문
* 기본 UI 텍스트

## Light

사용 위치:

* 보조 설명
* Footer 정보
* 부가 텍스트

---

# 7. Spacing System

MomentLit은 4px 기반 간격 시스템을 사용한다.

AI는 임의의 숫자를 사용하지 말고 아래 값만 사용한다.

## Allowed Spacing

* 4px
* 8px
* 12px
* 16px
* 24px
* 32px
* 48px
* 64px
* 80px

## Spacing Rule

* 콘텐츠 내부 여백은 최소 16px 이상 사용한다.
* 페이지 좌우 여백은 모바일 16px, 데스크톱 32px 이상 사용한다.
* 섹션 사이 간격은 48px 이상 사용한다.
* 주요 액션과 입력 영역 사이에는 12px 또는 16px를 사용한다.
* 리스트형 콘텐츠 사이 간격은 24px 또는 32px를 사용한다.

---

# 8. Border Radius

MomentLit은 둥근 모서리를 적극적으로 사용한다.

## Radius Scale

### Small

`8px`

사용 위치:

* 작은 UI 요소
* 태그
* 작은 입력 요소

### Medium

`12px`

사용 위치:

* 기본 UI 요소
* 입력창
* 검색창

### Large

`24px`

사용 위치:

* 이미지 영역
* 큰 콘텐츠 박스
* 주요 시각 영역

### Extra Large

`32px`

사용 위치:

* 메인 비주얼 영역
* 큰 배너
* 특별 섹션

## Radius Rule

* 공간 이미지는 반드시 둥근 모서리를 가진다.
* 주요 UI 요소는 각진 사각형으로 만들지 않는다.
* 요소 간 radius가 서로 충돌하지 않게 한다.
* 너무 과한 pill 형태는 검색창 외에는 남발하지 않는다.

---

# 9. Icon & Logo Style

아이콘과 로고는 단순해야 한다.

## Icon Rule

* Line Icon 또는 Flat Icon을 사용한다.
* Stroke는 너무 두껍지 않게 한다.
* 기본 아이콘 색상은 `#67728A`를 사용한다.
* 활성 아이콘 색상은 `#00ADB5`를 사용한다.
* 위험 상태에는 `#DA294A`만 사용한다.

## Interaction Cursor

* 링크, 활성 버튼, 선택 가능한 컨트롤 등 클릭 가능한 요소는 `cursor-pointer`를 사용한다.
* 비활성화된 버튼과 컨트롤은 `cursor-not-allowed`를 사용한다.

## Logo Rule

* 로고 색상은 청록 계열을 유지한다.
* 어두운 배경에서는 밝은 청록색 버전을 사용한다.
* 로고 주변에 충분한 여백을 둔다.
* 로고를 임의로 변형하지 않는다.
* 로고에 그림자, 테두리, 그라데이션을 추가하지 않는다.

---

# 10. Page Layout

## Desktop Layout

* Max Width: 1200px ~ 1280px
* Page Padding: 32px
* Section Gap: 64px
* Content Gap: 24px 또는 32px

## Mobile Layout

* Page Padding: 16px
* 주요 콘텐츠는 1열 배치
* 상단 영역은 간소화
* Footer는 세로 정렬
* 터치 가능한 요소는 충분히 큰 영역을 확보한다.

## Layout Rule

* 한 화면에 너무 많은 요소를 배치하지 않는다.
* 리스트형 콘텐츠는 충분한 간격을 둔다.
* 사용자가 스크롤하면서 자연스럽게 공간을 탐색할 수 있게 한다.
* 페이지마다 배경색과 시각 규칙이 달라지면 안 된다.
* UI 장식보다 공간 이미지와 예약 정보가 먼저 보이게 한다.

---

# 11. AI Prompt Rule

AI에게 페이지 제작을 요청할 때는 항상 다음 문장을 포함한다.

```text
MomentLit Common Design System을 반드시 준수해.
새로운 색상, 폰트, 여백, radius, 레이아웃 규칙을 임의로 만들지 마.
MomentLit은 친근하고 실용적인 공간 공유 플랫폼이며, 과한 SaaS 랜딩페이지처럼 만들지 마.
공간 이미지, 위치, 날짜, 예약 정보가 UI 장식보다 먼저 보이게 해.
```

---

# 12. Forbidden Design

AI는 다음 디자인을 절대 만들지 않는다.

* 보라색 중심 디자인
* 네온 디자인
* Cyberpunk 스타일
* Glassmorphism
* 과한 Gradient
* 강한 Drop Shadow
* 3D 효과
* 과한 애니메이션
* 복잡한 Dashboard UI
* Apple 스타일의 지나친 프리미엄 감성
* Linear 스타일의 차가운 SaaS 감성
* Airbnb를 그대로 따라한 디자인
* 의미 없는 AI 로봇 일러스트
* 배경에 거대한 추상 도형 남발
* 페이지마다 다른 시각 규칙
* 무작위 컬러 추가
* 무작위 폰트 추가

---

# 13. Final Rule

MomentLit 디자인의 핵심은 다음 한 문장으로 정리된다.

비어 있는 공간을 따뜻하고 쉽게 발견하게 만드는, 밝고 친근한 공간 공유 플랫폼.

AI는 모든 디자인을 생성할 때 이 문장을 기준으로 판단한다.
