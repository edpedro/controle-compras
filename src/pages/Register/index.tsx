import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ptBR } from "date-fns/locale";
import { useForm, SubmitHandler } from "react-hook-form";
import { BiDetail } from "react-icons/bi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useInvoice } from "@/contexts/hooks/Invoice";

interface UIData {
  date: string;
  name: string;
  obs: string;
  tranches: number;
  value: number;
  card: string;
}

export default function Register() {
  const { listDataId, RegisterInvoice, UpdateInvoice, update } = useInvoice();
  const [dateCalend, setDateCalend] = useState<Date>();
  const [selected, setSelected] = useState("");

  const { state } = useLocation();
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, reset } = useForm<UIData>();

  useEffect(() => {
    reset(listDataId);
    setDateCalend(listDataId ? new Date(listDataId.date) : undefined);
    setSelected(listDataId?.card || "");

    if (update) {
      reset();
      setDateCalend(undefined);
      setSelected("");
    }
  }, [listDataId, reset, update]);

  const handleSelect = (value: string) => {
    setValue("card", value);
    setSelected(value);
  };

  const onSubmit: SubmitHandler<UIData> = async (data: UIData) => {
    const formattedData = {
      ...data,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      tranches: Number(data.tranches),
      value: Number(data.value),
      date: dateCalend ? new Date(dateCalend).toISOString() : "",
    };

    if (listDataId) {
      UpdateInvoice(formattedData, state);
      navigate("/");
    } else {
      RegisterInvoice(formattedData);
      reset();
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsContent value="account">
            <div className="relative">
              <Link to="/">
                <BiDetail className="absolute top-3 right-10 h-8 w-8" />
              </Link>
            </div>
            <Card>
              <CardHeader className="flex items-center">
                <CardTitle>Adicionar Compras</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" {...register("name")} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="card">Cartão</Label>
                  <Select
                    {...register("card")}
                    value={selected}
                    onValueChange={handleSelect}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Santander">Santander</SelectItem>
                      <SelectItem value="Nubank">Nubank</SelectItem>
                      <SelectItem value="Itau">Itau</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tranches">Parcelas</Label>
                  <Input
                    type="number"
                    id="tranches"
                    {...register("tranches")}
                  />
                </div>
                <div className="space-y-1 grid gap-1 grid-cols-1 grid-rows-1">
                  <Label htmlFor="date">Data</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[325px] justify-start text-left font-normal",
                          !dateCalend && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateCalend ? (
                          format(dateCalend, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione a data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        id="date"
                        mode="single"
                        selected={dateCalend}
                        onSelect={setDateCalend}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="value">Valor</Label>
                  <Input
                    id="value"
                    type="text"
                    {...register("value", {
                      validate: {
                        validNumber: (value) =>
                          !isNaN(Number(value)) || "Invalid number",
                      },
                    })}
                    placeholder="Ex.: 1000.75"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="obs">Observação</Label>
                  <Textarea {...register("obs")} />
                </div>
              </CardContent>
              <CardFooter className="space-y-1">
                <Button type="submit">
                  {listDataId ? "Atualizar" : "Salvar"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
