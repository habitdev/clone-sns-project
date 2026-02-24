import GlobalLayout from "@/components/layout/global-layout";
import GuestOnlyLayout from "@/components/layout/guest-only-layout";
import MemberOnlyLayout from "@/components/layout/member-only-layour";
import ForgetPasswordPage from "@/pages/forget-password-page";
import IndexPage from "@/pages/index-page";
import PostDetailPage from "@/pages/post-detail-page";
import ProfileDetailPage from "@/pages/profile-detail-page";
import ResetPasswordPage from "@/pages/reset-password-page";
import SignInpage from "@/pages/sign-in-page";
import SignUpPage from "@/pages/sign-up-page";
import { Navigate, Route, Routes } from "react-router";

export default function RootRoute() {
  return (
    <Routes>
      <Route element={<GlobalLayout />}>
        <Route element={<GuestOnlyLayout />}>
          <Route path="/sign-in" element={<SignInpage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/forget-password" element={<ForgetPasswordPage />} />
        </Route>

        <Route element={<MemberOnlyLayout />}>
          <Route path="/" element={<IndexPage />} />
          <Route path="/post/:postId" element={<PostDetailPage />} />
          <Route path="/profile/:postId" element={<ProfileDetailPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Route>
    </Routes>
  );
}
