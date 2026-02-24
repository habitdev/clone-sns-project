import { useOpenPostEditorModal } from "@/store/post-editor-modal";
import { PlusCircleIcon } from "lucide-react";

export default function CreatePostButton() {
  const openPostEditiorModal = useOpenPostEditorModal();

  return (
    <button
      onClick={openPostEditiorModal}
      className="bg-muted text-muted-foreground cursor-pointer rounded-xl px-6 py-4"
    >
      <span className="flex items-center justify-between">
        <span>나누고 싶은 이야기가 있나요?</span>
        <PlusCircleIcon className="h-5 w-5" />
      </span>
    </button>
  );
}
