import { logoutApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useRedirectStore } from "@/store/redirectStore";

export async function performLogout() {

  // 로그아웃 시도시에는 5가지 처리 필요
  // 1. 서버 로그아웃
  // 2. 쿠키 제거
  // 3. 로컬스토리지 제거
  // 4. Zustand 상태 초기화
  // 5. 로그인 페이지로 리다이렉트

  //로그아웃 api 호출
  try {
    // 성공시 서버에서 httpOnly 쿠키(refreshToken) 삭제 + 서버에서도 쿠키 만료
    await logoutApi();
  } catch (e) {
    // 실패시에는 도 아래 코드에서 넥스트 API 통해서 쿠키를 삭제하기떄문에  어쨋던 클라이언트에서는 쿠키가 삭제됨
    console.warn("서버 로그아웃 실패. 어쨌든 클라이언트 상태는 초기화",e);

    //refreshToken 쿠키 삭제(위에 로그아웃 api 실패시를 대비)
    await fetch("/api/set-cookie", {
      method: "POST",
      credentials: "include", //httpOnly 쿠키 를 제어하려면 필요
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "refreshToken",
        action: "delete",
      }),
    });

  }

  // HttpOnly 쿠키 제거 요청 (Next.js API route)
  //accessToken 쿠키 삭제
  await fetch("/api/set-cookie", {
    method: "POST",
    credentials: "include", //httpOnly 쿠키 를 제어하려면 필요
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        name: "accessToken",
        action: "delete",
    }),
  });



  //##### 스토어 초기화(Zustand) 시작#####
  //##### 스토어 초기화(Zustand) 시작#####

  // //##useWordStore##
  // useWordStore.getState().reset(); //localStorage + 메모리 상태 초기화

  // //##useLevelStore##
  // useLevelStore.getState().reset(); //localStorage + 메모리 상태 초기화

  //##useAuthStore##
  useAuthStore.getState().reset(); //localStorage + 메모리 상태 초기화

  useRedirectStore.getState().setLinkName('/login'); // 로그인 페이지로 리다이렉트(.ts에서는 router를 사용못하므로 해결책으로 사용)

  //##### 스토어 초기화(Zustand) 끝#####
  //##### 스토어 초기화(Zustand) 끝#####
  
}


// 억세스토큰을 새로 받은경우 쿠키와 로컬스토리지에 저장
export async function updateAccessToken(jwt: string) {

    await fetch("/api/set-cookie", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "accessToken",
            value: jwt,
            action: "set",
        }),
    });

    useAuthStore.setState({ accessToken: jwt });
  }
  




  