import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

type CreateMode = {
  isOpen: true;
  type: "CREATE";
};

type EditMode = {
  isOpen: true;
  type: "EDIT";
  postId: number;
  content: string;
  imageUrls: string[] | null;
};

type CloseState = {
  isOpen: false;
};

type OpenState = CreateMode | EditMode;
type State = CloseState | OpenState;

const initialState = {
  isOpen: false,
} as State;

const usePostEdiorModalStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        openCreate: () => {
          set({ isOpen: true, type: "CREATE" });
        },
        openEdit: (param: Omit<EditMode, "isOpen" | "type">) => {
          set({ isOpen: true, type: "EDIT", ...param });
        },
        close: () => {
          set({ isOpen: false });
        },
      },
    })),
    { name: "postEditorModalStore" },
  ),
);

export const useOpenCreatePostModal = () => {
  const openCreate = usePostEdiorModalStore(
    (state) => state.actions.openCreate,
  );
  return openCreate;
};

export const useOpenEditPostModal = () => {
  const openEdit = usePostEdiorModalStore((store) => store.actions.openEdit);
  return openEdit;
};

export const usePostEditorModal = () => {
  const store = usePostEdiorModalStore();
  return store as typeof store & State;
};
