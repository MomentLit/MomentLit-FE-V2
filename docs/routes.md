# Routes

| Path | Page | Description | API Required |
|---|---|---|---|
| /main | MainPage | 메인 페이지 | O |
| /popup/:popup_id | PopupDetailPage | 팝업 상세 페이지 | O |
| /spaces/:spaceId | SpaceDetailPage | 공간 상세 페이지 | O |
| /login | LoginPage | 로그인 페이지 | O |
| /auth/oauth/google/callback | GoogleOAuthCallbackPage | Google OAuth 인증 코드를 토큰으로 교환하고 로그인 상태를 저장 | O |
| /signup | SignupPage | 회원가입 페이지 | O |
| /my | MyPage | 정보 수정, 공간/팝업, 매칭, 관리자 승인 탭을 제공하는 마이페이지 | O |
| /search | SearchPage | 장소/팝업 검색 페이지 | O |
| /spaces/create | SpaceCreatePage | 장소 만들기 | O |
| /spaces/:spaceId/edit | SpaceEditPage | 내가 등록한 공간 수정 페이지 | O |
| /popups/create | PopupCreatePage | 승인된 매칭을 기반으로 팝업 등록 | O |
