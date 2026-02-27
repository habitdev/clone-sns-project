import { uploadImage } from "@/api/image";
import supabase from "@/lib/supabase";
import type { PostEntity } from "@/types";

export async function fetchPosts() {
  const { data, error } = await supabase
    .from("post")
    .select("*, author: profile!author_id(*)")
    .order("created_at", { ascending: false }); // 내림차순

  if (error) throw error;

  return data;
}

export async function createPost(content: string) {
  const { data, error } = await supabase
    .from("post")
    .insert({
      content,
    })
    .select()
    .single();

  /*
      insert만 사용하면 추가만 된다
      insert 후 추가된 아이템을 사용하려면 
      .select().single();
      를 사용한다
  */

  if (error) throw error;
  return data;
}

export async function createPostWithImages({
  content,
  images,
  userId,
}: {
  content: string;
  images: File[];
  userId: string;
}) {
  // 1. 새로운 포스트 생성
  const post = await createPost(content);

  if (images.length === 0) return post;

  try {
    // 2. 스토리지에 이미지 업로드
    // 병렬로 비동기 업로드
    const imageUrls = await Promise.all(
      images.map((image) => {
        const fileExtension = image.name.split(".").pop() || "webp";
        const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
        const filePath = `${userId}/${post.id}/${fileName}`;

        return uploadImage({ file: image, filePath });
      }),
    );

    // 3. post 테이블 업데이트
    const updatedPost = updatePost({ id: post.id, image_urls: imageUrls });

    return updatedPost;
  } catch (error) {
    // 업로드나 업데이트 실패시 생성된 포스트를 삭제하고
    // 에러를 던진다
    await deletePost(post.id);

    throw error;
  }
}

export async function updatePost(post: Partial<PostEntity> & { id: number }) {
  //  id는 반드시 넘겨야 한다

  const { data, error } = await supabase
    .from("post")
    .update(post)
    .eq("id", post.id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deletePost(id: number) {
  const { data, error } = await supabase
    .from("post")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return error;
}
