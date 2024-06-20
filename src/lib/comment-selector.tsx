import { createContext, ReactNode, useContext } from "react";

export const CommentSelectorContext = createContext<{
  selectedCommentId: string | null;
}>({
  selectedCommentId: null,
});

export const CommentSelectorProvider = ({
  children,
  commentId,
}: {
  children: ReactNode;
  commentId: string;
}) => {
  return (
    <CommentSelectorContext.Provider value={{ selectedCommentId: commentId }}>
      {children}
    </CommentSelectorContext.Provider>
  );
};

export const useCommentSelector = () => {
  const { selectedCommentId } = useContext(CommentSelectorContext);
  return selectedCommentId;
};
