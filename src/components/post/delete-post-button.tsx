import { Button } from "@/components/ui/button";
import { useDeletePost } from "@/hooks/mutations/post/use-delete-post";
import { useOpenAlertModal } from "@/store/alert-modal";
import { toast } from "sonner";

export default function DeletePostButton({ id }: { id: number }) {
  const openAlertModal = useOpenAlertModal();
  const { mutate: deletePost, isPending: isDeletePending } = useDeletePost({
    onError: (error) => {
      toast.error("포스트 삭제에 실패했습니다.");
    },
  });

  const handleDeleteClick = () => {
    openAlertModal({
      title: "포스트 삭제",
      description: "삭제된 포스트는 되돌릴 수 없습니다. 정말 삭제하시겠습니까?",
      onPositive: () => {
        // 포스트 삭제 요청
        deletePost(id);
      },
    });
  };

  return (
    <Button
      className="cursor-pointer"
      variant={"ghost"}
      onClick={handleDeleteClick}
      disabled={isDeletePending}
    >
      삭제
    </Button>
  );
}
