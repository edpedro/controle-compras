import { ReactNode } from "react";
import { InvoiceProvider } from "./hooks/Invoice";
import { LoadingProvider } from "./hooks/Loanding";

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <LoadingProvider>
      <InvoiceProvider>{children}</InvoiceProvider>
    </LoadingProvider>
  );
};

export default AppProvider;
