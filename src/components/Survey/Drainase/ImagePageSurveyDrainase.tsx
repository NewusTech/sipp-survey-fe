import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Button } from "@/components/ui/button.tsx";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { Search } from "lucide-react";
import FileUploader from "@/components/shared/FIleUploader.tsx";

const formSchema = z.object({
  photo: z.custom<File[]>(),
  desa_id: z.string().transform((val) => Number(val)),
});

interface Villages {
  id: number;
  nama: string;
  kecamatan_name: string;
}

const ImagePageSurveyDrainase = () => {
  const [villages, setVillages] = useState<Villages[]>([]);

  const [searchInput, setSearchInput] = useState(""); // State for search input

  const filteredOptions = villages?.filter((drainase) =>
    drainase.nama.toLowerCase().includes(searchInput.toLowerCase()),
  );

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const desa = "master_desa";
  const addImage = "survey_drainase/uplaod";
  const token = Cookies.get("adsxcl");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    axios
      .get(`${apiUrl}/${desa}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data.data;
        setVillages(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = {
      desa_id: values.desa_id,
      photo: values.photo[0],
    };

    console.log(values);

    axios
      .post(`${apiUrl}/${addImage}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        toast(response.data.message);
        navigate("/survey-drainase");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <section className="bg-abu-2 w-screen h-screen md:h-[1500px] py-10 overflow-scroll md:overflow-hidden">
      <div className="sm:ml-64 flex flex-col gap-5">
        <div className="container mx-auto">
          <h1 className="text-xl text-gray-400 font-medium">
            Tambah Survey Drainase
          </h1>
          <div className="w-full bg-white rounded-lg mt-10">
            <div className="p-10">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8 flex flex-col"
                >
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="desa_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Desa</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger
                                name="Desa"
                                className="w-full border-b-2 rounded-none"
                              >
                                <SelectValue placeholder="Desa" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <div className="px-2 flex items-center justify-between">
                                <Search className="text-slate-400" />
                                <Input
                                  className="border-b"
                                  placeholder="Search..."
                                  value={searchInput}
                                  onChange={(event) =>
                                    setSearchInput(event.target.value)
                                  }
                                />
                              </div>
                              {filteredOptions.map((drainase) => (
                                <SelectItem
                                  key={drainase.id}
                                  value={drainase.id.toString()}
                                >
                                  <div className="py-1 border-b w-full">
                                    <h2 className="font-semibold">
                                      {drainase.nama}
                                    </h2>
                                    <p className="font-light">
                                      {drainase.kecamatan_name}
                                    </p>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="photo"
                      render={({ field }) => (
                        <FormItem className="mt-5">
                          <FormControl>
                            <FileUploader fileChange={field.onChange} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="bg-biru hover:bg-biru-2">
                    Tambah Foto
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImagePageSurveyDrainase;
