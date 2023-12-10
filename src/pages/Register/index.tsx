import { FormEvent, useState } from "react";
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
import { format, formatISO, parse } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ptBR } from "date-fns/locale";

export default function Register() {
  const [date, setDate] = useState<Date>();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name");
    const card = data.get("card");
    const tranches = data.get("tranches");
    const value = data.get("value");
    const obs = data.get("obs");

    let newDate = "";
    if (date) {
      const dateString = format(date, "dd/MM/yyyy");
      const dataObj = parse(dateString, "dd/MM/yyyy", new Date());

      newDate = formatISO(dataObj);
    }

    console.log(name, card, tranches, value, obs, newDate);
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={submit}>
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsContent value="account">
            <Card>
              <CardHeader className="flex items-center">
                <CardTitle>Adicionar Compras</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" name="name" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="card">Cartão</Label>
                  <Select name="card">
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
                  <Input type="number" id="tranches" name="tranches" />
                </div>
                <div className="space-y-1 grid gap-1 grid-cols-1 grid-rows-1">
                  <Label htmlFor="date">Data</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[325px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? (
                          format(date, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione a data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="value">Valor</Label>
                  <Input
                    type="number"
                    id="value"
                    name="value"
                    defaultValue="Ex.: 1000"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="obs">Observação</Label>
                  <Textarea name="obs" />
                </div>
              </CardContent>
              <CardFooter className="space-y-1">
                <Button type="submit">Salvar</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
