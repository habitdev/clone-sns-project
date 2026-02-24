import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdatePassword } from "@/hooks/mutations/auth/use-update-password";
import { generateErrorMassage } from "@/lib/error";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { mutate: updatePassword, isPending: isUpdatePasswordPending } =
    useUpdatePassword({
      onSuccess: () => {
        toast.info("비밀번호가 변경되었습니다", {
          position: "top-center",
        });
        navigate("/");
      },
      onError: (error) => {
        const message = generateErrorMassage(error);
        toast.error(message, {
          position: "top-center",
        });
        setPassword("");
      },
    });

  const handleUpdatePasswordClick = () => {
    if (password.trim() === "") return;
    updatePassword({ password });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold">비밀번호 재설정하기</h2>
        <p className="text-muted-foreground">새로운 비밀번호를 입력하세요</p>
      </div>

      <Input
        className="py-6"
        value={password}
        disabled={isUpdatePasswordPending}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="password"
      />
      <Button
        className="w-full"
        disabled={isUpdatePasswordPending}
        onClick={handleUpdatePasswordClick}
      >
        비밀번호 변경하기
      </Button>
    </div>
  );
}
