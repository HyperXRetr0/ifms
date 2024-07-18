import { createContext, ReactNode, useContext } from "react";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";

type AppContext = {
  isLoggedIn: boolean;
  currentUser: any;
  isUserLoading: boolean;
};

const AppContext = createContext<AppContext | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const { isError } = useQuery("validateToken", apiClient.validateToken, {
    retry: false,
  });
  const { data: currentUser, isLoading: userLoading } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser
  );
  return (
    <AppContext.Provider
      value={{
        isLoggedIn: !isError,
        currentUser: currentUser,
        isUserLoading: userLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context as AppContext;
};
