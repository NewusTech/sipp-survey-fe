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
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { LatLngTuple } from "leaflet";
import MapSearch from "@/components/shared/Maps.tsx";

const formSchema = z.object({
  panjang_drainase: z
    .string()
    .transform((val) => Number(val))
    .optional(),
  letak_drainase: z.string().optional(),
  lebar_atas: z
    .string()
    .transform((val) => Number(val))
    .optional(),
  lebar_bawah: z
    .string()
    .transform((val) => Number(val))
    .optional(),
  tinggi: z
    .string()
    .transform((val) => Number(val))
    .optional(),
  kondisi: z.string().optional(),
});

interface DetailById {
  panjang_drainase: any;
  letak_drainase: string;
  lebar_atas: number;
  lebar_bawah: number;
  tinggi: number;
  kondisi: string;
}

const CreatePageTypeOfPavement = () => {
  const { id } = useParams();
  const [drainaseById, setDrainaseById] = useState<DetailById | null>(null);
  const [latLong, setLatLong] = useState<LatLngTuple | null>(null);

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const updateSurvey = "detail_survey_drainase";
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
      .get(`${apiUrl}/${updateSurvey}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const data = response.data.data;
        setDrainaseById(data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (drainaseById) {
      form.reset({
        letak_drainase: drainaseById.letak_drainase,
        panjang_drainase: drainaseById.panjang_drainase?.toString(),
        lebar_atas: drainaseById.lebar_atas,
        lebar_bawah: drainaseById.lebar_bawah,
        tinggi: drainaseById.tinggi,
        kondisi: drainaseById.kondisi,
      });
    }
  }, [drainaseById]);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = {
      letak_drainase: values.letak_drainase,
      panjang_drainase: values.panjang_drainase,
      lebar_atas: values.lebar_atas,
      lebar_bawah: values.lebar_bawah,
      tinggi: values.tinggi,
      kondisi: values.kondisi,
      latitude: latLong?.[0],
      longitude: latLong?.[1],
    };

    axios
      .put(`${apiUrl}/${updateSurvey}/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast(response.data.message);
        navigate("/survey-drainase");
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
            Ubah Survey Drainase
          </h1>
          <div className="w-full bg-white rounded-lg mt-10">
            <div className="p-10">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8 flex flex-col"
                >
                  {/*<div className="flex gap-2 items-center justify-around">*/}
                  {/*  <p>{drainaseDetail?.panjang_ruas}</p>*/}
                  {/*  <FormField*/}
                  {/*    control={form.control}*/}
                  {/*    name="ruas_drainase_id"*/}
                  {/*    render={({ field }) => (*/}
                  {/*      <FormItem>*/}
                  {/*        <FormLabel>Ruas Drainase</FormLabel>*/}
                  {/*        <Select*/}
                  {/*          onValueChange={field.onChange}*/}
                  {/*          defaultValue={field.value?.toString()}*/}
                  {/*        >*/}
                  {/*          <FormControl>*/}
                  {/*            <SelectTrigger*/}
                  {/*              name="ruas_drainase"*/}
                  {/*              className="md:w-[180px] w-[150px] border-b-2 rounded-none"*/}
                  {/*            >*/}
                  {/*              <SelectValue placeholder="Ruas Drainase" />*/}
                  {/*            </SelectTrigger>*/}
                  {/*          </FormControl>*/}
                  {/*          <SelectContent>*/}
                  {/*            <div className="px-2 flex items-center justify-between">*/}
                  {/*              <Search className="text-slate-400" />*/}
                  {/*              <Input*/}
                  {/*                className="border-b"*/}
                  {/*                placeholder="Search..."*/}
                  {/*                value={searchInput}*/}
                  {/*                onChange={(event) =>*/}
                  {/*                  setSearchInput(event.target.value)*/}
                  {/*                }*/}
                  {/*              />*/}
                  {/*            </div>*/}
                  {/*            {filteredOptions.map((drainase) => (*/}
                  {/*              <SelectItem*/}
                  {/*                key={drainase.id}*/}
                  {/*                value={drainase.id.toString()}*/}
                  {/*              >*/}
                  {/*                <div className="py-1 border-b">*/}
                  {/*                  <h2 className="font-semibold">*/}
                  {/*                    {drainase.nama_ruas}*/}
                  {/*                  </h2>*/}
                  {/*                  <p className="font-light">*/}
                  {/*                    {drainase.nama_desa}*/}
                  {/*                  </p>*/}
                  {/*                </div>*/}
                  {/*              </SelectItem>*/}
                  {/*            ))}*/}
                  {/*          </SelectContent>*/}
                  {/*        </Select>*/}
                  {/*        <FormMessage />*/}
                  {/*      </FormItem>*/}
                  {/*    )}*/}
                  {/*  />*/}
                  {/*  <p>{drainaseDetail?.nama_desa}</p>*/}
                  {/*  <p>{drainaseDetail?.nama_kecamatan}</p>*/}
                  {/*</div>*/}
                  <div className="flex gap-4 justify-around">
                    <div className="w-full">
                      <FormField
                        control={form.control}
                        name="panjang_drainase"
                        render={({ field }) => (
                          <FormItem className="w-full mt-10">
                            <FormLabel>Panjang Drainase</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-b-2 rounded-none"
                                placeholder="Panjang Drainase"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="letak_drainase"
                        render={({ field }) => (
                          <FormItem className="w-full mt-10">
                            <FormLabel>Letak Drainase</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-b-2 rounded-none"
                                placeholder="letak_drainase"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lebar_atas"
                        render={({ field }) => (
                          <FormItem className="w-full mt-10">
                            <FormLabel>Lebar Atas</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-b-2 rounded-none"
                                placeholder="lebar_atas"
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
                        name="lebar_bawah"
                        render={({ field }) => (
                          <FormItem className="w-full mt-10">
                            <FormLabel>Lebar Bawah</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-b-2 rounded-none"
                                placeholder="lebar_bawah"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="tinggi"
                        render={({ field }) => (
                          <FormItem className="w-full mt-10">
                            <FormLabel>Tinggi</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-b-2 rounded-none"
                                placeholder="tinggi"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="kondisi"
                        render={({ field }) => (
                          <FormItem className="mt-10">
                            <FormLabel>Kondisi</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger className=" md:w-full w-[150px] border-b-2 rounded-none">
                                  <SelectValue placeholder="Pilih kondisi" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="baik">Baik</SelectItem>
                                <SelectItem value="sedang">Sedang</SelectItem>
                                <SelectItem value="rusak">Rusak</SelectItem>
                                <SelectItem value="tanah">Tanah</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <MapSearch
                    defaultLat={latLong ? latLong?.[0] : -4.43242555}
                    defaultLng={latLong ? latLong?.[1] : 105.16826426180435}
                    onLatLongChange={handleLatLongChange}
                  />
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
