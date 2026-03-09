import { fetchPosts } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

const PAGE_SIZE = 5;

export function useInfinitePostsData() {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.post.list,
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * PAGE_SIZE;
      const to = pageParam + PAGE_SIZE - 1;

      const posts = await fetchPosts({ from, to });
      posts.forEach((post) => {
        queryClient.setQueryData(QUERY_KEYS.post.byId(post.id), post);
      });
      return posts.map((post) => post.id);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined; // 다음 페이지는 없다는 것을 알려준다
      return allPages.length; // 다음 페이지의 시작점
    },
    // staleTime: 0, //     불러오자마자 상함(데이터가 '신선'하다고 간주되는 시간이 0이라서, 이 시간 동안에는 캐시된 데이터를 그대로 사용하며, 네트워크 요청을 하지 않습니다)
    // gcTime: 5 * 60 * 1000, // 5분이 지나면 캐시 데이터가 아예 삭제됨 (가비지 컬렉션 시간),
    // refetchOnWindowFocus: true,
    staleTime: Infinity, // 데이터를 절대 상하지 않게 한다
    // 최신 데이터는 포스트를 수정, 삭제, 등록 시에 수동으로 가능하게 한다
  });
}
