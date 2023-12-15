import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "@/services/api";
import { toast } from "react-toastify";
import { useLoading } from "./Loanding";

type Props = {
  children?: ReactNode;
};

type UIData = {
  id: string;
  date: string;
  name: string;
  obs: string;
  tranches: number;
  value: number;
  card: string;
};

type UIDataRegister = {
  date: string;
  name: string;
  obs: string;
  tranches: number;
  value: number;
  card: string;
};
interface InvoiceContextData {
  invoiceData?: UIData[];
  ListInvoice: () => void;
  DeleteInvoice: (id: string) => void;
  ListInvoiceId: (id: string) => void;
  listDataId?: UIData;
  RegisterInvoice: (data: UIDataRegister) => void;
  UpdateInvoice: (data: UIDataRegister, id: string) => void;
  update: boolean;
}

const InvoiceContext = createContext<InvoiceContextData>(
  {} as InvoiceContextData
);

export const InvoiceProvider = ({ children }: Props) => {
  const [invoiceData, setInvoiceData] = useState<UIData[]>();
  const [listDataId, setListDataId] = useState<UIData>();
  const [update, setUpdate] = useState(false);

  const { setLoadingFetch } = useLoading();

  useEffect(() => {
    ListInvoice();

    setUpdate(false);
  }, [update]);

  async function ListInvoice() {
    setLoadingFetch(true);
    const { data } = await api.get("/invoice");

    setInvoiceData(data);

    setLoadingFetch(false);
  }

  async function ListInvoiceId(id: string) {
    setLoadingFetch(true);
    const { data } = await api.get(`/invoice/${id}`);

    setListDataId(data);
    setLoadingFetch(false);
  }

  async function RegisterInvoice(data: UIDataRegister) {
    try {
      setLoadingFetch(true);
      await api.post("/invoice/register", data);

      toast.success("Cadastro realizado com sucesso", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setUpdate(true);
      setLoadingFetch(false);
    } catch (error) {
      toast.error("Compra não cadastrada", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  async function UpdateInvoice(data: UIDataRegister, id: string) {
    try {
      setLoadingFetch(true);
      await api.patch(`/invoice/edit/${id}`, data);

      toast.success("Dados atualizado com sucesso", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setUpdate(true);
      setLoadingFetch(false);
    } catch (error) {
      toast.error("Compra não atualizado", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  async function DeleteInvoice(id: string) {
    try {
      setLoadingFetch(true);
      await api.delete(`/invoice/delete/${id}`);

      toast.success("Compra deletada com sucesso", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setUpdate(true);
      setLoadingFetch(false);
    } catch (error) {
      toast.error("Compra não deletada", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  return (
    <InvoiceContext.Provider
      value={{
        invoiceData,
        ListInvoice,
        DeleteInvoice,
        ListInvoiceId,
        listDataId,
        RegisterInvoice,
        UpdateInvoice,
        update,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export function useInvoice(): InvoiceContextData {
  const context = useContext(InvoiceContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
