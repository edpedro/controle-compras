import { ReactNode, createContext, useContext, useState } from "react";

type Props = {
  children?: ReactNode;
};

interface LoadingContextData {
  isLoadingFetch: boolean;
  setLoadingFetch: (isLoading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextData>(
  {} as LoadingContextData
);

export const LoadingProvider = ({ children }: Props) => {
  const [isLoadingFetch, setIsLoadingFetch] = useState(false);

  const setLoadingFetch = (newIsLoading: boolean) => {
    setIsLoadingFetch(newIsLoading);
  };

  return (
    <LoadingContext.Provider value={{ isLoadingFetch, setLoadingFetch }}>
      {children}
    </LoadingContext.Provider>
  );
};

export function useLoading(): LoadingContextData {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
