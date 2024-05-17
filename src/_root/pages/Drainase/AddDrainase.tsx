import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
// import MapSearch from "@/components/shared/Maps.tsx";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
// import { LatLngTuple } from "leaflet";
// import MultipleUpload from "@/components/shared/MultipleUpload.tsx";

// interface Corridors {

const formSchema = z.object({
  nama_ruas: z
    .string()
    .min(2, { message: "Nama Ruas Wajib diisi, minimal 2 karakkter" }),
  panjang: z.string().transform((val) => Number(val)),
  desa_id: z
    .string()
    .transform((val) => Number(val))
    .optional(),
});

interface Desa {
  id: number;
  nama: string;
}

const AddDrainase = () => {
  // const [corridors, setCorridors] = useState<Corridors[]>([]);
  const [villages, setVillages] = useState<Desa[]>([]);
  // const [latLong, setLatLong] = useState<LatLngTuple | null>(null);
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState(""); // State for search input

  const filteredOptions = villages.filter((village) =>
    village.nama.toLowerCase().includes(searchInput.toLowerCase()),
  );

  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const dataDesa = "master_desa";
  const createDrainase = "drainase";
  const token = Cookies.get("adsxcl");

  // const handleLatLongChange = (lat: number, long: number) => {
  //   setLatLong([lat, long]);
  // };

  useEffect(() => {
    document.title = "Tambah Ruas Jalan - SIPPP";

    // axios
    //   .get(`${apiUrl}/${corridor}`, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //   .then((response) => {
    //     // Setel daftar koridor ke dalam state
    //     setCorridors(response.data.data);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching corridors:", error);
    //     console.log(error);
    //   });

    axios
      .get(`${apiUrl}/${dataDesa}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data.data;
        setVillages(data);
      })
      .catch((error) => {
        console.error("Error fetching corridors:", error);
        console.log(error);
      });
  }, []);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = {
      nama_ruas: values.nama_ruas,
      panjang_ruas: values.panjang,
      desa_id: values.desa_id,
    };

    axios
      .post(`${apiUrl}/${createDrainase}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data.message;
        toast(data);
        navigate("/drainase");
      })
      .catch((error) => {
        toast(error.message);
        console.log(error);
      });
    console.log(values);
  }

  return (
    <section className="bg-abu-2 w-screen h-screen md:h-[1500px] py-10 overflow-scroll md:overflow-hidden">
      <div className="sm:ml-64 flex flex-col gap-5">
        <div className="container mx-auto">
          <h1 className="text-xl text-gray-400 font-medium">Tambah Drainase</h1>
          <div className="w-full bg-white rounded-lg mt-10">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 flex flex-col"
              >
                <div className="flex md:flex-row flex-col md:justify-between gap-0 md:gap-20 px-10 md:px-20 py-10">
                  <div className="flex flex-col w-full">
                    <div className="flex md:flex-row flex-col items-end gap-10">
                      <FormField
                        control={form.control}
                        name="nama_ruas"
                        render={({ field }) => (
                          <FormItem className="w-full mt-10 md:mx-5 mx-0">
                            <FormLabel>Nama Ruas</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-b-2 rounded-none"
                                placeholder="Nama Ruas"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="panjang"
                      render={({ field }) => (
                        <FormItem className="mt-10 md:mx-5 mx-0">
                          <FormLabel>Panjang</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-b-2 rounded-none"
                              placeholder="Panjang"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="desa_id"
                      render={({ field }) => (
                        <FormItem className="mt-10">
                          <FormLabel className="md:mx-5 mx-0">Desa</FormLabel>
                          <Select
                            value={field.value?.toString()}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger className="w-[230px] md:w-full xl:w-[1140px] border-b-2 md:ml-5 md:mr-5 mx-0 rounded-none mt-10">
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
                              {filteredOptions.map((desa) => (
                                <SelectItem
                                  key={desa.id}
                                  value={desa.id.toString()}
                                >
                                  {desa.nama}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="md:px-16 px-2">
                      {/*<MapSearch*/}
                      {/*  defaultLat={latLong ? latLong?.[0] : -5.39714}*/}
                      {/*  defaultLng={latLong ? latLong?.[1] : 105.26679}*/}
                      {/*  onLatLongChange={handleLatLongChange}*/}
                      {/*/>*/}
                      <div className="flex gap-4 md:mx-5 mx-0 mt-10 justify-center md:justify-end my-10">
                        <div className="flex gap-3">
                          <Button
                            type="submit"
                            className="rounded-full bg-biru w-full hover:bg-biru-2 text-xl font-light px-10"
                          >
                            simpan
                          </Button>
                          <Button
                            className="rounded-full bg-pink w-full hover:bg-pink-2 text-xl font-light px-10"
                            onClick={() => navigate("/drainase")}
                          >
                            batal
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddDrainase;
