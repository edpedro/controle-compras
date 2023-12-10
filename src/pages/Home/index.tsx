import { useEffect, useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { addDays, format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { ptBR } from "date-fns/locale";
import { MdOutlineMoreVert } from "react-icons/md";
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

const invoices = [
  {
    id: 1,
    invoice: "2023-12-08T22:23:31.743Z",
    paymentStatus: "Juliana",
    totalAmount: 250.0,
    paymentMethod: "Nubank",
  },
  {
    id: 2,
    invoice: "2023-12-09T22:23:31.743Z",
    paymentStatus: "Juliana",
    totalAmount: 250.0,
    paymentMethod: "Santander",
  },
  {
    id: 3,
    invoice: "2023-12-15T22:23:31.743Z",
    paymentStatus: "Juliana",
    totalAmount: 270.0,
    paymentMethod: "Nubank",
  },
  {
    id: 4,
    invoice: "2023-11-15T22:23:31.743Z",
    paymentStatus: "Juiana",
    totalAmount: 300.0,
    paymentMethod: "Nubank",
  },
  {
    id: 5,
    invoice: "2023-12-10T00:23:31.743Z",
    paymentStatus: "Eduardo",
    totalAmount: 300.0,
    paymentMethod: "Nubank",
  },
  {
    id: 6,
    invoice: "2023-12-10T22:23:31.743Z",
    paymentStatus: "Eduardo",
    totalAmount: 370.0,
    paymentMethod: "Santander",
  },
  {
    id: 7,
    invoice: "2024-01-25T22:23:31.743Z",
    paymentStatus: "Eduardo",
    totalAmount: 350.0,
    paymentMethod: "Santander",
  },
];

interface UIData {
  id: number;
  invoice: string;
  paymentStatus: string;
  totalAmount: number;
  paymentMethod: string;
}

export default function Home() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 20),
  });
  const [selectCad, setSelectCard] = useState("Todos");
  const [selectName, setSelectName] = useState("Todos");
  const [price, setPrice] = useState(0);
  const [newDate, setNewDate] = useState<UIData[]>();

  useEffect(() => {
    if (date?.from && date?.to) {
      const filterDate = filterByDateRange(date?.from, date?.to);

      const filterCard = filterDate.filter((card) =>
        selectCad !== "Todos" ? card.paymentMethod === selectCad : filterDate
      );

      const filterName = filterCard.filter((card) =>
        selectName !== "Todos" ? card.paymentStatus === selectName : filterCard
      );

      const filterPrice = filterName.reduce(
        (acc, curr) => {
          return { totalAmount: acc.totalAmount + curr.totalAmount };
        },
        { totalAmount: 0 }
      );
      setPrice(filterPrice.totalAmount);
      setNewDate(filterName);
    }
  }, [date, selectCad, selectName]);

  function filterByDateRange(from: Date, to: Date) {
    return invoices.filter((date) => {
      const dateValeu = new Date(date.invoice);

      return dateValeu >= from && dateValeu <= to;
    });
  }

  const handleChangeCard = (value: string) => {
    setSelectCard(value);
  };

  const handleChangeName = (value: string) => {
    setSelectName(value);
  };

  return (
    <>
      <div className="w-screen px-1 pt-5">
        <div className="grid grid-cols-1 gap-1 px-2 pb-7">
          <div className="space-y-1 grid gap-1 grid-cols-1 grid-rows-1">
            <Label htmlFor="username">Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLLL dd, Y", { locale: ptBR })} -{" "}
                        {format(date.to, "LLL dd, Y", { locale: ptBR })}
                      </>
                    ) : (
                      format(date.from, "LLL dd, Y", { locale: ptBR })
                    )
                  ) : (
                    <span>Selecione a data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto h-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-1 w-[300px]">
            <Label htmlFor="name">Cartão</Label>
            <Select onValueChange={handleChangeCard}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Santander">Santander</SelectItem>
                <SelectItem value="Nubank">Nubank</SelectItem>
                <SelectItem value="Itau">Itau</SelectItem>
                <SelectItem value="Todos">Todos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1 w-[300px]">
            <Label htmlFor="name">Nome</Label>
            <Select onValueChange={handleChangeName}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Juliana">Juliana</SelectItem>
                <SelectItem value="Eduardo">Eduardo</SelectItem>
                <SelectItem value="Fulano">Fulano</SelectItem>
                <SelectItem value="Todos">Todos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
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
            {newDate &&
              newDate.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    {format(new Date(invoice.invoice), "dd/MM", {
                      locale: ptBR,
                    })}
                  </TableCell>
                  <TableCell>{invoice.paymentStatus}</TableCell>
                  <TableCell>{invoice.paymentMethod}</TableCell>
                  <TableCell>
                    {invoice.totalAmount.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <MdOutlineMoreVert size={15} />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Detalhe</DialogTitle>
                      </DialogHeader>
                      <div className="flex items-center space-x-4">
                        <div>
                          <Label>Catão:</Label>
                          <span>Nubank</span>
                        </div>
                        <div>
                          <Label>Valor Total:</Label>
                          <span>1500</span>
                        </div>
                        <div>
                          <Label>Nome:</Label>
                          <span>Juliana</span>
                        </div>
                      </div>
                      <DialogFooter className="sm:justify-start">
                        <div className="flex items-center grid flex-1 gap-2">
                          <div className="flex items-center space-x-4">
                            <div>
                              <Label>Data:</Label>
                              <span>12/12/2023</span>
                            </div>
                            <div>
                              <Label>Valor:</Label>
                              <span>1500</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div>
                              <Label>Data:</Label>
                              <span>10/12/2023</span>
                            </div>
                            <div>
                              <Label>Valor:</Label>
                              <span>1500</span>
                            </div>
                          </div>
                        </div>
                      </DialogFooter>
                      <DialogDescription>
                        OBS: Anyone who has this link will be able to view this.
                      </DialogDescription>
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
      </div>
    </>
  );
}
