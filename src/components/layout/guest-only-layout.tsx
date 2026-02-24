import { useSession } from "@/store/session";
import { Navigate, Outlet } from "react-router";

export default function GuestOnlyLayout() {
  const session = useSession();

  if (session) {
    return <Navigate to={"/"} replace={true} />;
    // replace={true} : 현재 페이지를 브라우저 히스토리에서 제거(뒤로가기 방지)
  }

  return <Outlet />;
}
