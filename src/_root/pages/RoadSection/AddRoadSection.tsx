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
import MapSearch from "@/components/shared/Maps.tsx";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { LatLngTuple } from "leaflet";

const formSchema = z.object({
  no_ruas: z
    .string()
    .min(2, { message: "No Ruas Wajib diisi, minimal 2 karakkter" })
    .max(50),
  name: z
    .string()
    .min(2, { message: "Nama Ruas Wajib diisi, minimal 2 karakkter" }),
  panjang: z.string().transform((val) => Number(val)),
  access: z.string().optional(),
  province: z.string().optional(),
  city: z.string().optional(),
  kecamatan_id: z
    .string()
    .transform((val) => Number(val))
    .optional(),
  lebar: z.string().optional(),
  desa: z.string().optional(),
  // file: z.custom<File[]>().optional(),
});

// interface Corridors {
//   id: number;
//   name: string;
// }

interface Kecamatan {
  id: number;
  name: string;
}

const AddRoadSection = () => {
  // const [corridors, setCorridors] = useState<Corridors[]>([]);
  const [kecamatans, setKecamatans] = useState<Kecamatan[]>([]);
  const [latLong, setLatLong] = useState<LatLngTuple | null>(null);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_APP_API_URL;
  // const corridor = "koridor/list";
  const kecamatanData = "kecamatan";
  const createRoadSection = "ruas_jalan/master_ruas_jalan";
  const token = Cookies.get("adsxcl");

  const handleLatLongChange = (lat: number, long: number) => {
    setLatLong([lat, long]);
  };

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
      .get(`${apiUrl}/${kecamatanData}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data.data;
        setKecamatans(data);
      })
      .catch((error) => {
        console.error("Error fetching corridors:", error);
        console.log(error);
      });
  }, []);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      no_ruas: "",
      name: "",
      access: "",
      province: "",
      city: "",
      desa: "",
      lebar: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = {
      no_ruas: values.no_ruas,
      nama: values.name,
      panjang_ruas: values.panjang,
      akses: values.access,
      // provinsi: values.province,
      // kabupaten: values.city,
      kecamatan_id: values.kecamatan_id,
      desa: values.desa,
      lebar: values.lebar,
      latitude: latLong?.[0],
      longitude: latLong?.[1],
      // images: [] as File[],
    };

    // const files = values.file || [];
    //
    // files.forEach((file: File) => {
    //   formData.images.push(file);
    // });

    axios
      .post(`${apiUrl}/${createRoadSection}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data.message;
        toast(data);
        navigate("/road-section");
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
          <h1 className="text-xl text-gray-400 font-medium">
            Tambah Ruas Jalan
          </h1>
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
                        name="no_ruas"
                        render={({ field }) => (
                          <FormItem className="w-full mt-10 md:mx-5 mx-0">
                            <FormLabel>No Ruas</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-b-2 rounded-none"
                                placeholder="No Ruas"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/*<FormField*/}
                      {/*  control={form.control}*/}
                      {/*  name="corridor"*/}
                      {/*  render={({ field }) => (*/}
                      {/*    <FormItem>*/}
                      {/*      <Select*/}
                      {/*        value={field.value?.toString()}*/}
                      {/*        onValueChange={field.onChange}*/}
                      {/*      >*/}
                      {/*        <SelectTrigger className="w-[230px] md:w-[180px] border-b-2 rounded-none">*/}
                      {/*          <SelectValue placeholder="Koridor" />*/}
                      {/*        </SelectTrigger>*/}
                      {/*        <SelectContent>*/}
                      {/*          {corridors.map((corridor) => (*/}
                      {/*            <SelectItem*/}
                      {/*              key={corridor.id}*/}
                      {/*              value={corridor.id.toString()}*/}
                      {/*            >*/}
                      {/*              {corridor.name}*/}
                      {/*            </SelectItem>*/}
                      {/*          ))}*/}
                      {/*        </SelectContent>*/}
                      {/*      </Select>*/}
                      {/*      <FormMessage />*/}
                      {/*    </FormItem>*/}
                      {/*  )}*/}
                      {/*/>*/}
                    </div>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="mt-10 md:mx-5 mx-0">
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
                    <FormField
                      control={form.control}
                      name="panjang"
                      render={({ field }) => (
                        <FormItem className="mt-10 md:mx-5 mx-0">
                          <FormLabel>Panjang Ruas</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-b-2 rounded-none"
                              placeholder="177.991"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lebar"
                      render={({ field }) => (
                        <FormItem className="mt-10 md:mx-5 mx-0">
                          <FormLabel>Lebar Ruas</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-b-2 rounded-none"
                              placeholder="Lebar Ruas"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <FormField
                      control={form.control}
                      name="access"
                      render={({ field }) => (
                        <FormItem className="mt-10 md:mx-5 mx-0">
                          <FormLabel>Akses</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-b-2 rounded-none"
                              placeholder="Akses"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/*<FormField*/}
                    {/*  control={form.control}*/}
                    {/*  name="province"*/}
                    {/*  render={({ field }) => (*/}
                    {/*    <FormItem className="mt-10 md:mx-5 mx-0">*/}
                    {/*      <FormLabel>Provinsi</FormLabel>*/}
                    {/*      <FormControl>*/}
                    {/*        <Input*/}
                    {/*          {...field}*/}
                    {/*          className="border-b-2 rounded-none"*/}
                    {/*          placeholder="Porvinsi"*/}
                    {/*        />*/}
                    {/*      </FormControl>*/}
                    {/*      <FormMessage />*/}
                    {/*    </FormItem>*/}
                    {/*  )}*/}
                    {/*/>*/}
                    {/*<FormField*/}
                    {/*  control={form.control}*/}
                    {/*  name="city"*/}
                    {/*  render={({ field }) => (*/}
                    {/*    <FormItem className="mt-10 md:mx-5 mx-0">*/}
                    {/*      <FormLabel>Kota/Kabupaten</FormLabel>*/}
                    {/*      <FormControl>*/}
                    {/*        <Input*/}
                    {/*          {...field}*/}
                    {/*          className="border-b-2 rounded-none"*/}
                    {/*          placeholder="Kabupaten/Kota"*/}
                    {/*        />*/}
                    {/*      </FormControl>*/}
                    {/*      <FormMessage />*/}
                    {/*    </FormItem>*/}
                    {/*  )}*/}
                    {/*/>*/}
                    <FormField
                      control={form.control}
                      name="kecamatan_id"
                      render={({ field }) => (
                        <FormItem className="mt-10">
                          <FormLabel className="md:mx-5 mx-0">
                            Kecamatan
                          </FormLabel>
                          <Select
                            value={field.value?.toString()}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-[230px] md:w-[350px] border-b-2 md:mx-5 mx-0 rounded-none mt-10">
                              <SelectValue placeholder="Kecamatan" />
                            </SelectTrigger>
                            <SelectContent>
                              {kecamatans.map((kecamatan) => (
                                <SelectItem
                                  key={kecamatan.id}
                                  value={kecamatan.id.toString()}
                                >
                                  {kecamatan.name}
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
                      name="desa"
                      render={({ field }) => (
                        <FormItem className="mt-10 md:mx-5 mx-0">
                          <FormLabel>Desa/Kelurahan</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-b-2 rounded-none"
                              placeholder="Desa/Kelurahan"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="container mx-auto">
                  {/*<FormField*/}
                  {/*  control={form.control}*/}
                  {/*  name="file"*/}
                  {/*  render={({ field }) => (*/}
                  {/*    <FormItem className="md:mx-5 mx-0 -mt-5 mb-5">*/}
                  {/*      <FormControl>*/}
                  {/*        <MultipleUpload fileChange={field.onChange} />*/}
                  {/*      </FormControl>*/}
                  {/*      <FormMessage />*/}
                  {/*    </FormItem>*/}
                  {/*  )}*/}
                  {/*/>*/}
                  <div className="md:px-16 px-2">
                    <MapSearch
                      defaultLat={latLong ? latLong?.[0] : -4.43242555}
                      defaultLng={latLong ? latLong?.[1] : 105.16826426180435}
                      onLatLongChange={handleLatLongChange}
                    />
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
                          onClick={() => navigate("/road-section")}
                        >
                          batal
                        </Button>
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

export default AddRoadSection;
