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

const formSchema = z.object({
  rigit: z
    .string()
    .transform((val) => Number(val))
    .optional(),
  hotmix: z
    .string()
    .transform((val) => Number(val))
    .optional(),
  lapen: z
    .string()
    .transform((val) => Number(val))
    .optional(),
  telford: z
    .string()
    .transform((val) => Number(val))
    .optional(),
  tanah: z
    .string()
    .transform((val) => Number(val))
    .optional(),
  baik: z
    .string()
    .transform((val) => Number(val))
    .optional(),
  sedang: z
    .string()
    .transform((val) => Number(val))
    .optional(),
  rusak_ringan: z
    .string()
    .transform((val) => Number(val))
    .optional(),
  rusak_berat: z
    .string()
    .transform((val) => Number(val))
    .optional(),
  corridor: z.string().transform((val) => Number(val)),
  lhr: z.string().optional(),
  keterangan: z.string().optional(),
});

interface RoadSections {
  id: number;
  no_ruas: string;
  nama: string;
  kabupaten: string;
  panjang_ruas: number;
  corridor: number;
}

interface RoadSectionDetails {
  no_ruas: string;
  panjang_ruas: number;
  name_koridor: string;
}

const CreatePageTypeOfPavement = () => {
  const [roadSections, setRoadSections] = useState<RoadSections[]>([]);
  const [roadSectionDetail, setRoadSectionDetail] = useState<
    RoadSectionDetails[]
  >([]);
  const [searchInput, setSearchInput] = useState(""); // State for search input

  const filteredOptions = roadSections.filter((roadSection) =>
    roadSection.nama.toLowerCase().includes(searchInput.toLowerCase()),
  );

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const roadSection = "ruas_jalan/list";
  const createSurvey = "survey/jenis_perkerasan";
  const getByNoRuas = "ruas_jalan/listbyid";
  const token = Cookies.get("adsxcl");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    axios
      .get(`${apiUrl}/${roadSection}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data.data;
        setRoadSections(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (form.getValues("corridor")) {
      axios
        .get(`${apiUrl}/${getByNoRuas}/${form.getValues("corridor")}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const data = response.data.data;
          setRoadSectionDetail(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [form.getValues("corridor")]);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = {
      ruas_jalan_id: values.corridor,
      rigit: values.rigit,
      hotmix: values.hotmix,
      lapen: values.lapen,
      telford: values.telford,
      tanah: values.tanah,
      baik: values.baik,
      sedang: values.sedang,
      rusak_ringan: values.rusak_ringan,
      rusak_berat: values.rusak_berat,
      lhr: values.lhr,
      keterangan: values.keterangan,
    };

    axios
      .post(`${apiUrl}/${createSurvey}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
        toast(response.data.message);
        navigate("/road-survey");
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(values);
  }

  return (
    <section className="bg-abu-2 w-screen h-screen md:h-[1300px] py-10 overflow-scroll md:overflow-hidden">
      <div className="sm:ml-64 flex flex-col gap-5">
        <div className="container mx-auto">
          <h1 className="text-xl text-gray-400 font-medium">
            Tambah Survey Jalan
          </h1>
          <div className="w-full bg-white rounded-lg mt-10">
            <div className="p-10">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8 flex flex-col"
                >
                  <div className="flex gap-2 items-center justify-around">
                    <p>{roadSectionDetail && roadSectionDetail[0]?.no_ruas}</p>
                    <FormField
                      control={form.control}
                      name="corridor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ruas Jalan</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger
                                name="corridor"
                                className="md:w-[180px] w-[150px] border-b-2 rounded-none"
                              >
                                <SelectValue
                                  placeholder="Ruas Jalan"
                                  defaultValue="Empty"
                                />
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
                              {filteredOptions.map((roadSection) => (
                                <SelectItem
                                  key={roadSection.id}
                                  value={roadSection.id.toString()}
                                >
                                  <div className="py-1 border-b">
                                    <h2 className="font-semibold">
                                      {roadSection.nama}
                                    </h2>
                                    <p className="font-light">
                                      {roadSection.kabupaten}
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
                    <p>
                      {roadSectionDetail && roadSectionDetail[0]?.panjang_ruas}
                    </p>
                  </div>
                  <div className="flex gap-4 justify-around">
                    <div className="w-full">
                      <FormField
                        control={form.control}
                        name="rigit"
                        render={({ field }) => (
                          <FormItem className="w-full mt-10">
                            <FormLabel>Rigit</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-b-2 rounded-none"
                                placeholder="rigit"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="hotmix"
                        render={({ field }) => (
                          <FormItem className="w-full mt-10">
                            <FormLabel>Hotmix</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-b-2 rounded-none"
                                placeholder="hotmix"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lapen"
                        render={({ field }) => (
                          <FormItem className="w-full mt-10">
                            <FormLabel>Lapen</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-b-2 rounded-none"
                                placeholder="lapen"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="baik"
                        render={({ field }) => (
                          <FormItem className="w-full mt-10">
                            <FormLabel>Baik</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-b-2 rounded-none"
                                placeholder="baik"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="sedang"
                        render={({ field }) => (
                          <FormItem className="w-full mt-10">
                            <FormLabel>Sedang</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-b-2 rounded-none"
                                placeholder="sedang"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="keterangan"
                        render={({ field }) => (
                          <FormItem className="w-full mt-10">
                            <FormLabel>Keterangan</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-b-2 rounded-none"
                                placeholder="Keterangan"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-full">
                      <FormField
                        control={form.control}
                        name="telford"
                        render={({ field }) => (
                          <FormItem className="w-full mt-10">
                            <FormLabel>Telford</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-b-2 rounded-none"
                                placeholder="telford"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="tanah"
                        render={({ field }) => (
                          <FormItem className="w-full mt-10">
                            <FormLabel>Tanah</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-b-2 rounded-none"
                                placeholder="tanah"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="rusak_ringan"
                        render={({ field }) => (
                          <FormItem className="w-full mt-10">
                            <FormLabel>Rusak Ringan</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-b-2 rounded-none"
                                placeholder="rusak_ringan"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="rusak_berat"
                        render={({ field }) => (
                          <FormItem className="w-full mt-10">
                            <FormLabel>Rusak Berat</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-b-2 rounded-none"
                                placeholder="rusak_berat"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lhr"
                        render={({ field }) => (
                          <FormItem className="w-full mt-10">
                            <FormLabel>LHR</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-b-2 rounded-none"
                                placeholder="LHR"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="bg-biru hover:bg-biru-2">
                    Tambah Survey
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

export default CreatePageTypeOfPavement;
