import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCreatePost } from "@/hooks/mutations/post/use-create-post";
import { useOpenAlertModal } from "@/store/alert-modal";
import { usePostEditorModal } from "@/store/post-editor-modal";
import { useSession } from "@/store/session";
import { ImageIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";

type Image = {
  file: File;
  previewUrl: string;
};

export default function PostEditorModal() {
  const session = useSession();
  const openAlertModal = useOpenAlertModal();
  const { isOpen, close } = usePostEditorModal();
  const { mutate: createPost, isPending: isCreatePostPending } = useCreatePost({
    onSuccess: () => {
      close();
    },
    onError: (error) => {
      toast.error("포스트 생성을 실패했습니다", {
        position: "top-center",
      });
    },
  });
  const [content, setContent] = useState("");
  const [images, setImages] = useState<Image[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  useEffect(() => {
    if (!isOpen) {
      // 메모리 누수 방지
      images.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });
      return;
    }
    textareaRef.current?.focus();
    setContent("");
    setImages([]);
  }, [isOpen]);

  const handleCloseModal = () => {
    if (content !== "" || images.length > 0) {
      openAlertModal({
        title: "게시글 작성이 마무리 되지 않았습니다",
        description: "이 화면에서 나가면 작성중이던 내용이 사라집니다.",
        onPositive: () => {
          close();
        },
      });

      return;
    }

    close();
  };

  const handleCreatePostClick = () => {
    if (content.trim() === "") return;
    createPost({
      content,
      images: images.map((image) => image.file),
      userId: session!.user.id,
    });
  };

  const handleSelectImgaes = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Array.from : 복사해서 동일한 요소들을 가진 새 배열을 만든다
      const files = Array.from(e.target.files);
      files.forEach((file) => {
        setImages((prev) => [
          ...prev,
          { file, previewUrl: URL.createObjectURL(file) },
          // URL.createObjectURL: 임시용 Url을 생성해서 반환해 줌
          // 브라우저의 메모리에 보관이 되므로 메모리 누수가 일어날 수 있다
          // 따라서 모달을 닫거나 이미지를 삭제할 때 메모리에서도 삭제하게 한다
        ]);
      });
    }

    e.target.value = "";
  };

  const handleDeleteImage = (image: Image) => {
    setImages((prevImages) =>
      prevImages.filter((item) => item.previewUrl !== image.previewUrl),
    );

    URL.revokeObjectURL(image.previewUrl);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="max-h-[90vh]">
        <DialogTitle>포스트 작성</DialogTitle>
        <textarea
          ref={textareaRef}
          name=""
          id=""
          className="max-h-125 min-h-25 focus:outline-none"
          placeholder="무슨 일이 있었나요?"
          value={content}
          disabled={isCreatePostPending}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleSelectImgaes}
        />

        {images.length > 0 && (
          <Carousel>
            <CarouselContent>
              {images.map((image) => (
                <CarouselItem className="basis-2/5" key={image.previewUrl}>
                  <div className="relative">
                    <img
                      src={image.previewUrl}
                      alt=""
                      className="h-full w-full rounded-sm object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 m-1 cursor-pointer rounded-full bg-black/50 p-1"
                      onClick={() => {
                        handleDeleteImage(image);
                      }}
                    >
                      <XIcon className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}

        <Button
          disabled={isCreatePostPending}
          variant={"outline"}
          className="cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon />
          이미지 추가
        </Button>
        <Button
          disabled={isCreatePostPending}
          onClick={handleCreatePostClick}
          className="cursor-pointer"
        >
          저장
        </Button>
      </DialogContent>
    </Dialog>
  );
}
