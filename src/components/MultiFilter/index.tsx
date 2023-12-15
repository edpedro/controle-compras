import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { addDays, format, startOfDay } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ptBR } from "date-fns/locale";
import { useInvoice } from "@/contexts/hooks/Invoice";
import TableInvoice from "../TableInvoice";

interface UIData {
  id: string;
  date: string;
  name: string;
  obs: string;
  tranches: number;
  value: number;
  card: string;
}

export default function MultiFilter() {
  const { invoiceData } = useInvoice();

  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfDay(new Date()),
    to: startOfDay(addDays(new Date(), 20)),
  });
  const [selectCad, setSelectCard] = useState("Todos");
  const [selectName, setSelectName] = useState("Todos");
  const [price, setPrice] = useState(0);
  const [newDate, setNewDate] = useState<UIData[]>();
  const [uniqueData, setUniqueData] = useState<string[]>();

  useEffect(() => {
    if (date?.from && date?.to && invoiceData) {
      const names = invoiceData.map((value) => value.name);
      const arraySemDuplicatas = [...new Set(names)];
      arraySemDuplicatas.push("Todos");

      setUniqueData(arraySemDuplicatas);

      const filterDate = filterByDateRange(date?.from, date?.to, invoiceData);

      const filterCard = filterDate.filter((card) =>
        selectCad !== "Todos" ? card.card === selectCad : filterDate
      );

      const filterName = filterCard.filter((card) =>
        selectName !== "Todos" ? card.name === selectName : filterCard
      );

      const filterPrice = filterName.reduce(
        (acc, curr) => {
          return { totalAmount: acc.totalAmount + curr.value };
        },
        { totalAmount: 0 }
      );

      filterName.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        return dateB - dateA;
      });

      setPrice(filterPrice.totalAmount);
      setNewDate(filterName);
    }
  }, [date, invoiceData, selectCad, selectName, setDate]);

  function filterByDateRange(from: Date, to: Date, data: UIData[]) {
    return data.filter((date) => {
      const dateValeu = new Date(date.date);

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
                {uniqueData &&
                  uniqueData.map((name) => (
                    <SelectItem value={name} key={name}>
                      {name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <TableInvoice data={newDate} price={price} />
      </div>
    </>
  );
}
