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
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import MapSearch from "@/components/shared/Maps.tsx";
import { LatLngTuple } from "leaflet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
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
  lhr: z.string().optional(),
  keterangan: z.string().optional(),
  corridor: z.string().transform((val) => Number(val)),
});

interface DataById {
  ruas_jalan_id: any;
  rigit: any;
  hotmix: any;
  lapen: any;
  telford: any;
  tanah: any;
  baik: never;
  sedang: never;
  rusak_ringan: never;
  rusak_berat: never;
  lhr: string;
  keterangan: string;
}

interface RoadSectionDetails {
  no_ruas: string;
  panjang_ruas: number;
  name_koridor: string;
}

interface RoadSections {
  id: number;
  no_ruas: string;
  nama: string;
  kabupaten: string;
  panjang_ruas: number;
  corridor: number;
}

const CreatePageTypeOfPavement = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [getTypeOfPavement, setGetTypeOfPavement] = useState<DataById | null>(
    null,
  );
  const [roadSections, setRoadSections] = useState<RoadSections[]>([]);
  const [roadSectionDetail, setRoadSectionDetail] = useState<
    RoadSectionDetails[]
  >([]);
  const [searchInput, setSearchInput] = useState(""); // State for search input
  const [latLong, setLatLong] = useState<LatLngTuple | null>(null);
  const filteredOptions = roadSections.filter((roadSection) =>
    roadSection.nama.toLowerCase().includes(searchInput.toLowerCase()),
  );
  const currentPage = searchParams.get("page");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const updateSurvey = "survey/jenis_perkerasan";
  const getById = "survey/jenis_perkerasan";
  const getByNoRuas = "ruas_jalan/listbyid";
  const roadSection = "ruas_jalan/list";
  const token = Cookies.get("adsxcl");

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleLatLongChange = (lat: number, long: number) => {
    setLatLong([lat, long]);
  };

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
    axios
      .get(`${apiUrl}/${getById}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const data = response.data.data;
        setGetTypeOfPavement(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

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
          console.log(data[0].latitude);
          setLatLong([
            parseFloat(data[0].latitude),
            parseFloat(data[0].longitude),
          ]);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [form.getValues("corridor")]);

  console.log(getTypeOfPavement);

  useEffect(() => {
    if (getTypeOfPavement) {
      form.reset({
        corridor: getTypeOfPavement.ruas_jalan_id?.toString(),
        rigit: getTypeOfPavement.rigit?.toString() || "",
        hotmix: getTypeOfPavement.hotmix?.toString() || "",
        lapen: getTypeOfPavement.lapen?.toString() || "",
        telford: getTypeOfPavement.telford?.toString() || "",
        tanah: getTypeOfPavement.tanah?.toString() || "",
        baik: getTypeOfPavement.baik || "",
        sedang: getTypeOfPavement.sedang || "",
        rusak_ringan: getTypeOfPavement.rusak_ringan || "",
        rusak_berat: getTypeOfPavement.rusak_berat || "",
        lhr: getTypeOfPavement.lhr || "",
        keterangan: getTypeOfPavement.keterangan || "",
      });
    }
  }, [getTypeOfPavement]);

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
      .put(`${apiUrl}/${updateSurvey}/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast(response.data.message);
        navigate(`/road-survey?page=${currentPage}`);
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
            Ubah Survey Jenis Perkerasan
          </h1>
          <div className="w-full bg-white rounded-lg mt-10">
            <div className="p-10">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
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
                            value={field.value?.toString()}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger
                                name="corridor"
                                className="md:w-[180px] w-[150px] border-b-2 rounded-none"
                              >
                                <SelectValue placeholder="Ruas Jalan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <div className="top-0 fixed px-2 flex items-center bg-white justify-between z-10 w-full py-2">
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
                                  <h2 className="font-semibold">
                                    {roadSection.nama}
                                  </h2>
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
                  <div className="flex gap-5">
                    <div className="flex w-full flex-col gap-3">
                      <FormField
                        control={form.control}
                        name="rigit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rigit</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="rigit"
                                {...field}
                                className="border-b-2 rounded-none"
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
                          <FormItem>
                            <FormLabel>Hotmix</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="hotmix"
                                {...field}
                                className="border-b-2 rounded-none"
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
                          <FormItem>
                            <FormLabel>Lapen</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="lapen"
                                {...field}
                                className="border-b-2 rounded-none"
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
                          <FormItem>
                            <FormLabel>Baik</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="baik"
                                {...field}
                                className="border-b-2 rounded-none"
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
                          <FormItem>
                            <FormLabel>Sedang</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="sedang"
                                {...field}
                                className="border-b-2 rounded-none"
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
                          <FormItem className="w-full">
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
                    <div className="flex w-full flex-col gap-3">
                      <FormField
                        control={form.control}
                        name="telford"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telford</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="telford"
                                {...field}
                                className="border-b-2 rounded-none"
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
                          <FormItem>
                            <FormLabel>Tanah</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="tanah"
                                {...field}
                                className="border-b-2 rounded-none"
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
                          <FormItem>
                            <FormLabel>Rusak Ringan</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="rusak_ringan"
                                {...field}
                                className="border-b-2 rounded-none"
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
                          <FormItem>
                            <FormLabel>Rusak Berat</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="rusak_berat"
                                {...field}
                                className="border-b-2 rounded-none"
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
                          <FormItem className="w-full">
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
                  <MapSearch
                    defaultLat={latLong ? latLong?.[0] : undefined}
                    defaultLng={latLong ? latLong?.[1] : undefined}
                    onLatLongChange={handleLatLongChange}
                    type="survey"
                  />
                  <div className="flex gap-3 justify-end">
                    <Button
                      type="submit"
                      className="bg-biru rounded-full hover:bg-biru-2"
                    >
                      Ubah Survey
                    </Button>
                    <Button
                      className="rounded-full bg-pink hover:bg-pink-2 text-xl font-light "
                      onClick={() =>
                        navigate(`/road-survey?page=${currentPage}`)
                      }
                    >
                      Batal
                    </Button>
                  </div>
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
