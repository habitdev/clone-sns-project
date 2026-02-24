import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRequestPasswordResetEmail } from "@/hooks/mutations/auth/user-request-password-reset-email";
import { generateErrorMassage } from "@/lib/error";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const {
    mutate: requestPasswordResetEmail,
    isPending: isRequestPasswordResetEmailPending,
  } = useRequestPasswordResetEmail({
    onSuccess: () => {
      toast.info("인증메일이 잘 발송 되었습니다", {
        position: "top-center",
      });
      setEmail("");
    },
    onError: (error) => {
      const message = generateErrorMassage(error);
      toast.error(message, {
        position: "top-center",
      });
      setEmail("");
    },
  });

  const handleSendEmailClick = () => {
    if (email.trim() === "") return;
    requestPasswordResetEmail(email);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold">비밀번호를 잊으셨나요?</h2>
        <p className="text-muted-foreground">
          이메일로 비밀번호를 재설정할 수 있는 링크를 보내드립니다
        </p>
      </div>

      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isRequestPasswordResetEmailPending}
        className="py-6"
        placeholder="example@abc.com"
      />
      <Button
        className="w-full"
        disabled={isRequestPasswordResetEmailPending}
        onClick={handleSendEmailClick}
      >
        인증메일 요청하기
      </Button>
    </div>
  );
}
