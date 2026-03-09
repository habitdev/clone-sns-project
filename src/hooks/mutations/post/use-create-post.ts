import { createPostWithImages } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import type { UseMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreatePost(callbacks?: UseMutationCallback) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPostWithImages,
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
      // 목록 새로 불러오기
      // 1. 캐시 아예 초기화 (=> 지금의 경우에 가장 적절함)
      // 2. 캐시 데이터에 완성된 포스트만 추가
      // 3. 낙관적 업데이트 방식(onMutate이용)

      // queryClient.invalidateQueries
      // 사용자가 스크롤을 최하단까지 내렸다가 다시 상단으로 올라와서 포스트를 등록하는 경우
      // 성능 상 문제가 발생할 수 있다
      // 대신 피드 자체를 초기화한다

      queryClient.resetQueries({
        queryKey: QUERY_KEYS.post.list,
      });
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
