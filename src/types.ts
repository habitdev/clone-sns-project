import type { Database } from "@/database.types";

// 복잡한 타입을 쉽게 사용할 수 있도록 타입 별칭을 사용한다
export type PostEntity = Database["public"]["Tables"]["post"]["Row"];
export type ProfileEntity = Database["public"]["Tables"]["profile"]["Row"];

export type UseMutationCallback = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onMutate?: () => void;
  onSettled?: () => void;
};
