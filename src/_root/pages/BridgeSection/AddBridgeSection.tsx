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
// import MultipleUpload from "@/components/shared/MultipleUpload.tsx";

const formSchema = z.object({
  no_ruas: z
    .string()
    .min(2, { message: "No Ruas Wajib diisi, minimal 2 karakkter" })
    .max(50),
  name: z
    .string()
    .min(2, { message: "Nama Ruas Wajib diisi, minimal 2 karakkter" }),
  no_jembatan: z.string().optional(),
  asal: z.string().optional(),
  nama_jembatan: z.string().optional(),
  kmpost: z.string().optional(),
  panjang: z.string().optional(),
  lebar: z.string().optional(),
  jml_bentang: z.string().optional(),
  tipe_ba: z.string().optional(),
  kondisi_ba: z.string().optional(),
  tipe_bb: z.string().optional(),
  kondisi_bb: z.string().optional(),
  tipe_fondasi: z.string().optional(),
  kondisi_fondasi: z.string().optional(),
  bahan: z.string().optional(),
  kondisi_lantai: z.string().optional(),
  kecamatan_id: z
    .string({
      required_error: "Pilih yg ada di formulir",
    })
    .transform((val) => Number(val)),
  // file: z.custom<File[]>().optional(),
});

interface Kecamatan {
  id: number;
  name: string;
}

const AddBridgeSection = () => {
  const [kecamatans, setKecamatans] = useState<Kecamatan[]>([]);
  const [latLong, setLatLong] = useState<LatLngTuple | null>(null);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const createBridgeSection = "jembatan";
  const kecamatanData = "kecamatan";
  const token = Cookies.get("adsxcl");

  const handleLatLongChange = (lat: number, long: number) => {
    setLatLong([lat, long]);
  };

  useEffect(() => {
    document.title = "Tambah Ruas Jembatan - SIPPP";

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
      no_jembatan: "",
      asal: "",
      nama_jembatan: "",
      kmpost: "",
      panjang: "",
      lebar: "",
      jml_bentang: "",
      tipe_ba: "",
      kondisi_ba: "",
      tipe_bb: "",
      kondisi_bb: "",
      tipe_fondasi: "",
      kondisi_fondasi: "",
      bahan: "",
      kondisi_lantai: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = {
      no_ruas: values.no_ruas,
      nama_ruas: values.name,
      no_jembatan: values.no_jembatan,
      asal: values.asal,
      nama_jembatan: values.nama_jembatan,
      kmpost: values.kmpost,
      panjang: values.panjang,
      lebar: values.lebar,
      jml_bentang: values.jml_bentang,
      tipe_ba: values.tipe_ba,
      kondisi_ba: values.kondisi_ba,
      tipe_bb: values.tipe_bb,
      kondisi_bb: values.kondisi_bb,
      tipe_fondasi: values.tipe_fondasi,
      kondisi_fondasi: values.kondisi_fondasi,
      bahan: values.bahan,
      kondisi_lantai: values.kondisi_lantai,
      kecamatan_id: values.kecamatan_id,
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
      .post(`${apiUrl}/${createBridgeSection}`, formData, {
        headers: {
          // "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data.message;
        toast(data);
        navigate("/bridge-survey");
      })
      .catch((error) => {
        toast(error.message);
        console.log(error);
      });
    console.log(values);
  }

  return (
    <section className="bg-abu-2 w-screen h-screen md:h-[1800px] py-10 overflow-scroll md:overflow-hidden">
      <div className="sm:ml-64 flex flex-col gap-5">
        <div className="container mx-auto">
          <h1 className="text-xl text-gray-400 font-medium">
            Tambah Ruas Jembatan
          </h1>
          <div className="w-full bg-white rounded-lg mt-10">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 flex flex-col"
              >
                <div className="flex md:flex-row flex-col md:justify-between gap-0 md:gap-20 px-10 md:px-20 py-10">
                  <div className="flex flex-col w-full">
                    <FormField
                      control={form.control}
                      name="no_ruas"
                      render={({ field }) => (
                        <FormItem className="mt-10 md:mx-5 mx-0">
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
                      name="asal"
                      render={({ field }) => (
                        <FormItem className="mt-10 md:mx-5 mx-0">
                          <FormLabel>Asal</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-b-2 rounded-none"
                              placeholder="Asal"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="kmpost"
                      render={({ field }) => (
                        <FormItem className="mt-10 md:mx-5 mx-0">
                          <FormLabel>KMPOST (Km)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-b-2 rounded-none"
                              placeholder="KMPOST (Km)"
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
                          <FormLabel>Lebar</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-b-2 rounded-none"
                              placeholder="Lebar"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tipe_ba"
                      render={({ field }) => (
                        <FormItem className="mt-10 md:mx-5 mx-0">
                          <FormLabel>Tipe BA</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-b-2 rounded-none"
                              placeholder="Tipe BA"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tipe_bb"
                      render={({ field }) => (
                        <FormItem className="mt-10 md:mx-5 mx-0">
                          <FormLabel>Tipe BB</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-b-2 rounded-none"
                              placeholder="Tipe BB"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tipe_fondasi"
                      render={({ field }) => (
                        <FormItem className="mt-10 md:mx-5 mx-0">
                          <FormLabel>Tipe Fondasi</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-b-2 rounded-none"
                              placeholder="Tipe Fondasi"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bahan"
                      render={({ field }) => (
                        <FormItem className="mt-10 md:mx-5 mx-0">
                          <FormLabel>Bahan</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-b-2 rounded-none"
                              placeholder="Bahan"
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
                      name="kecamatan_id"
                      render={({ field }) => (
                        <FormItem className="mt-10">
                          <FormLabel className="md:mx-5 mx-0 ">
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
                      name="no_jembatan"
                      render={({ field }) => (
                        <FormItem className="mt-10 md:mx-5 mx-0">
                          <FormLabel>Nomor Jembatan</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-b-2 rounded-none"
                              placeholder="Nomor Jembatan"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nama_jembatan"
                      render={({ field }) => (
                        <FormItem className="mt-10 md:mx-5 mx-0">
                          <FormLabel>Nama Jembatan</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-b-2 rounded-none"
                              placeholder="Nama Jembatan"
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
                      name="jml_bentang"
                      render={({ field }) => (
                        <FormItem className="mt-10 md:mx-5 mx-0">
                          <FormLabel>Jumlah Bentang</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-b-2 rounded-none"
                              placeholder="Jumlah Bentang"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="kondisi_ba"
                      render={({ field }) => (
                        <FormItem className="mt-10 md:mx-5 mx-0">
                          <FormLabel>Kondisi BA</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-b-2 rounded-none"
                              placeholder="Kondisi BA"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="kondisi_bb"
                      render={({ field }) => (
                        <FormItem className="mt-10 md:mx-5 mx-0">
                          <FormLabel>Kondisi BB</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-b-2 rounded-none"
                              placeholder="Kondisi BB"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="kondisi_fondasi"
                      render={({ field }) => (
                        <FormItem className="mt-10 md:mx-5 mx-0">
                          <FormLabel>Kondisi Fondasi</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-b-2 rounded-none"
                              placeholder="Kondisi Fondasi"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="kondisi_lantai"
                      render={({ field }) => (
                        <FormItem className="mt-10 md:mx-5 mx-0">
                          <FormLabel>Kondisi Lantai</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-b-2 rounded-none"
                              placeholder="Kondisi Lantai"
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
                      defaultLat={latLong ? latLong?.[0] : -5.39714}
                      defaultLng={latLong ? latLong?.[1] : 105.26679}
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
                          onClick={() => navigate("/bridge-survey")}
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

export default AddBridgeSection;
