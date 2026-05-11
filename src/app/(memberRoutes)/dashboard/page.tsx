/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, User, Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { useAppContext } from "@/providers/ContextProvider";
import { updateUser } from "@/services/userService";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DragNDropUploader } from "@/components/shared/DragNDropUploader";
import { PageLoader } from "@/components/shared/Loaders";
import Container from "@/components/shared/Container";
import Image from "next/image";
import { getFromLocalStorage } from "@/lib/localStorage";
import { TUser } from "@/types/user.type";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  address: z.string().optional(),
  profileImg: z.string().optional(),
});

type ProfileInput = z.infer<typeof profileSchema>;

export default function DashboardPage() {
  const { user, setUser } = useAppContext();
  const [loading, setLoading] = useState(true);

  const methods = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      profileImg: user?.profileImg || "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = methods;

  const profileImgUrl = watch("profileImg");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = getFromLocalStorage("user") as TUser;
        if (user) {
          setUser(user);
          reset({
            name: user?.name || "",
            phone: user?.phone || "",
            address: user?.address || "",
            profileImg: user?.profileImg || "",
          });
        }
      } catch (error: any) {
        toast.error(error?.message || "Failed to fetch user profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [setUser, reset]);

  const onSubmit = async (data: ProfileInput) => {
    if (!user?._id) return;

    try {
      const res = await updateUser(user._id, data);
      if (res?.success) {
        toast.success("Profile updated successfully");
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        reset(data); // reset form with new values so isDirty becomes false
      } else {
        toast.error(res?.message || "Failed to update profile");
      }
    } catch (error: any) {
      toast.error(error?.message || "An error occurred while updating profile");
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <Container className="py-10 max-w-4xl text-left">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal information and profile picture.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card className="border-border/60 bg-card shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/40 pb-4">
              <CardTitle className="text-lg">Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-lg mb-6 bg-muted">
                {profileImgUrl ? (
                  <Image
                    src={profileImgUrl}
                    alt="Profile"
                    fill
                    priority
                    className="object-cover"
                    sizes="128px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                    <User className="w-12 h-12" />
                  </div>
                )}
              </div>

              <FormProvider {...methods}>
                <div className="w-full">
                  <DragNDropUploader
                    name="profileImg"
                    folder="group-khata/profile"
                  />
                </div>
              </FormProvider>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="border-border/60 bg-card shadow-sm rounded-2xl">
            <CardHeader className="bg-muted/30 border-b border-border/40 pb-4">
              <CardTitle className="text-lg">Personal Information</CardTitle>
              <CardDescription>
                Update your contact details and name.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-muted/50 cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your email address cannot be changed.
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    placeholder="Enter your phone number"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    Address
                  </Label>
                  <Input
                    id="address"
                    placeholder="Enter your address"
                    {...register("address")}
                  />
                  {errors.address && (
                    <p className="text-xs text-destructive">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <Button
                    type="submit"
                    disabled={!isDirty || isSubmitting}
                    className="bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md transition-all"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                  {!isDirty && (
                    <span className="text-sm text-muted-foreground">
                      No changes to save.
                    </span>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
