import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignInWithPassword } from "@/hooks/mutations/use-sign-in-password";

import { useState } from "react";
import { Link } from "react-router";

import githubLogo from "@/assets/github-mark.svg";
import { useSignInWithOAuth } from "@/hooks/mutations/use-sign-in-with-oauth";
import { generateErrorMassage } from "@/lib/error";
import { toast } from "sonner";

export default function SignInpage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: signInWithPassword, isPending: isSignInWithPasswordPending } =
    useSignInWithPassword({
      onError: (error) => {
        const message = generateErrorMassage(error);

        toast.error(message, {
          position: "top-center",
        });

        setPassword("");
      },
    });

  // 어떤 비동기 요청에 결과에 대한 ui적인 변화가 필요하다면 컴포넌트 안에서 진행한다

  const { mutate: signInWithOAuth, isPending: isSignInWithOAuthPending } =
    useSignInWithOAuth({
      onError: (error) => {
        const message = generateErrorMassage(error);
        toast.error(message, {
          position: "top-center",
        });
      },
    });

  const handleSignInWithPasswordClick = () => {
    if (email.trim() === "") return;
    if (password.trim() === "") return;

    signInWithPassword({
      email,
      password,
    });
  };

  const handleSignInWithGithubClick = () => {
    signInWithOAuth("github");
  };

  const isPending = isSignInWithPasswordPending || isSignInWithOAuthPending;

  return (
    <div className="flex flex-col gap-8">
      <div className="text-xl font-bold">로그인</div>
      <div className="flex flex-col gap-2">
        <Input
          disabled={isPending}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="py-6"
          type="email"
          placeholder="example@gmail.com"
        />
        <Input
          disabled={isPending}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="py-6"
          type="password"
          placeholder="password"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Button
          className="w-full"
          disabled={isPending}
          onClick={handleSignInWithPasswordClick}
        >
          로그인
        </Button>
        <Button
          className="w-full"
          variant={"outline"}
          onClick={handleSignInWithGithubClick}
        >
          <img src={githubLogo} alt="github logo" className="h-4 w-4" />
          Github 계정으로 로그인
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <Link className="text-muted-foreground hover:underline" to={`/sign-up`}>
          계정이 없으시다면? 회원가입
        </Link>
        <Link
          className="text-muted-foreground hover:underline"
          to={`/forget-password`}
        >
          비밀번호를 잊으셨나요?
        </Link>
      </div>
    </div>
  );
}
