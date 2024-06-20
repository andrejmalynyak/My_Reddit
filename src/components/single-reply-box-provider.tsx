import { createContext, useContext, useState } from "react";

type ReplyingState = {
  parentId?: string;
  setParentId: (parentId?: string) => void;
};

const initialState: ReplyingState = {
  parentId: undefined,
  setParentId: () => null,
};

const ReplyingContext = createContext<ReplyingState>(initialState);

export function ReplyingProvider({
  children,
  ...props
}: React.PropsWithChildren<{}>) {
  const [parentId, setParentId] = useState<string | undefined>(undefined);

  const value = {
    parentId,
    setParentId,
  };

  return (
    <ReplyingContext.Provider {...props} value={value}>
      {children}
    </ReplyingContext.Provider>
  );
}

export function useReplying() {
  return useContext(ReplyingContext);
}
