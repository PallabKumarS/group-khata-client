"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/providers/ContextProvider";
import { updateUser } from "@/services/userService";
import { profileSchema, type ProfileInput } from "./dashboard-schemas";
import { ProfilePictureCard } from "./profile-picture-card";
import { PersonalInfoCard } from "./personal-info-card";
import { PaymentMethodsCard } from "./payment-methods-card";
import { TUser } from "@/types/user.type";

interface DashboardFormProps {
  initialData: TUser;
}

export function DashboardForm({ initialData }: DashboardFormProps) {
  const { setUser } = useAppContext();

  const methods = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialData.name || "",
      phone: initialData.phone || "",
      address: initialData.address || "",
      profileImg: initialData.profileImg || "",
      paymentMethods: initialData.paymentMethods || [],
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = methods;

  const onSubmit = async (data: ProfileInput) => {
    if (!initialData._id) return;

    try {
      const res = await updateUser(initialData._id, data);
      if (res?.success) {
        toast.success("Profile updated successfully");
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        reset(data); // Reset form with new values so isDirty becomes false
      } else {
        toast.error(res?.message || "Failed to update profile");
      }
      // biome-ignore lint/suspicious/noExplicitAny: <>
    } catch (error: any) {
      toast.error(error?.message || "An error occurred while updating profile");
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <ProfilePictureCard />
          </div>

          <div className="md:col-span-2 space-y-8">
            <PersonalInfoCard />

            <PaymentMethodsCard />

            <div className="pt-6 flex items-center justify-end gap-4">
              {!isDirty && (
                <span className="text-sm text-muted-foreground/80">
                  No changes to save.
                </span>
              )}
              <Button
                type="submit"
                disabled={!isDirty || isSubmitting}
                className="bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-8"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
