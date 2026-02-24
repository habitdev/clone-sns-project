import GlobalLoader from "@/components/global-loader";
import { useProfileData } from "@/hooks/queries/use-profile-data";
import supabase from "@/lib/supabase";
import { useIsSessionLoaded, useSession, useSetSession } from "@/store/session";
import { useEffect, type ReactNode } from "react";

export default function SessionProvider({ children }: { children: ReactNode }) {
  const session = useSession();
  const setSession = useSetSession();
  const isSessionLoaded = useIsSessionLoaded();

  // isLoading이 아니라 Pending을 사용하면 값이 없으면 무조건 true가 돼어 계속 로딩화면이다
  const { data: profile, isLoading: isProfileLoading } = useProfileData(
    session?.user.id,
  );

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });
  }, []);

  if (!isSessionLoaded) {
    return <GlobalLoader />;
  }

  if (isProfileLoading) {
    return <GlobalLoader />;
  }

  return <>{children}</>;
}
