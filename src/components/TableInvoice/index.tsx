import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CardTitle } from "@/components/ui/card";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { Label } from "@/components/ui/label";
import { MdOutlineMoreVert } from "react-icons/md";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { format } from "date-fns";
import { useInvoice } from "@/contexts/hooks/Invoice";
import { useNavigate } from "react-router-dom";
import { useLoading } from "@/contexts/hooks/Loanding";
import Loading from "../loading";

interface UIData {
  id: string;
  date: string;
  name: string;
  obs: string;
  tranches: number;
  value: number;
  card: string;
}

interface UIPropsData {
  data?: UIData[];
  price: number;
}

export default function TableInvoice({ data, price }: UIPropsData) {
  const { DeleteInvoice, ListInvoiceId } = useInvoice();
  const [detail, setDetail] = useState<UIData>();

  const { isLoadingFetch } = useLoading();

  const navigate = useNavigate();

  const handleDetail = (id: string) => {
    const result = data?.find((invoice) => invoice.id === id);

    setDetail(result);
  };

  const handleEdit = (id: string) => {
    ListInvoiceId(id);

    navigate("/register", { state: id });
  };

  const handleRemove = (id: string) => {
    DeleteInvoice(id);
  };

  if (isLoadingFetch) {
    return <Loading />;
  }

  return (
    <>
      <div className="w-auto">
        <CardTitle className="px-5 pb-5">Controle Finaneiro</CardTitle>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Pacelas</TableHead>
            <TableHead>Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data &&
            data.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">
                  {format(new Date(invoice.date), "dd/MM", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell>{invoice.name}</TableCell>
                <TableCell>{invoice.card}</TableCell>
                <TableCell>
                  {invoice.value.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
                <Dialog>
                  <DialogTrigger
                    asChild
                    onClick={() => handleDetail(invoice.id)}
                  >
                    <MdOutlineMoreVert size={15} className="mt-4" />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Detalhe</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center space-x-4">
                      <div>
                        <Label>Catão:</Label>
                        <span className="pl-1">{detail?.card}</span>
                      </div>
                      <div>
                        <Label>Nome:</Label>
                        <span className="ml-1">{detail?.name}</span>
                      </div>
                    </div>
                    <DialogFooter className="sm:justify-start">
                      <div className="flex items-center grid flex-1 gap-2">
                        <div className="flex items-center space-x-4">
                          <div>
                            <Label>Data:</Label>
                            <span className="ml-1">
                              {format(
                                new Date(detail?.date ?? "1970-01-01"),
                                "dd/MM",
                                {
                                  locale: ptBR,
                                }
                              )}
                            </span>
                          </div>
                          <div>
                            <Label>Pacerlas:</Label>
                            <span className="ml-1">{detail?.tranches}</span>
                          </div>
                          <div>
                            <Label>Valor:</Label>
                            <span className="ml-1">
                              {detail?.value.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-2">
                          <div>
                            <Label>ValorTotal:</Label>
                            <span className="ml-1">
                              {detail &&
                                (
                                  detail?.tranches * detail?.value
                                ).toLocaleString("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                })}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-3">
                          <div>
                            <Button onClick={() => handleEdit(invoice.id)}>
                              <FaEdit className="mr-2 h-4 w-4" /> Alterar
                            </Button>
                          </div>
                          <div>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                  <MdDeleteForever
                                    className="mr-2 h-4 w-4"
                                    size={30}
                                  />
                                  Excluir
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Deseja exluir a compra
                                  </AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleRemove(invoice.id)}
                                  >
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    </DialogFooter>
                    <DialogDescription>OBS: {detail?.obs}</DialogDescription>
                  </DialogContent>
                </Dialog>
              </TableRow>
            ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell>
              {price.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}
