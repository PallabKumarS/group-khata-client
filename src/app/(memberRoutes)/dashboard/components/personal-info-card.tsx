import { useFormContext } from "react-hook-form";
import { Mail, User, Phone, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProfileInput } from "./dashboard-schemas";
import { useAppContext } from "@/providers/ContextProvider";

export function PersonalInfoCard() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProfileInput>();
  
  const { user } = useAppContext();

  return (
    <Card className="border-border/40 bg-card/40 backdrop-blur-xl shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className="bg-muted/20 border-b border-border/20 pb-4">
        <CardTitle className="text-lg bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          Personal Information
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Update your contact details and name.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        <div className="grid gap-2">
          <Label htmlFor="email" className="flex items-center gap-2 text-foreground/80">
            <Mail className="w-4 h-4 text-violet-500" />
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={user?.email || ""}
            disabled
            className="bg-muted/50 cursor-not-allowed border-border/50"
          />
          <p className="text-xs text-muted-foreground">
            Your email address cannot be changed.
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="name" className="flex items-center gap-2 text-foreground/80">
            <User className="w-4 h-4 text-violet-500" />
            Full Name
          </Label>
          <Input
            id="name"
            placeholder="Enter your full name"
            {...register("name")}
            className="bg-background/50 focus-visible:ring-violet-500/50"
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone" className="flex items-center gap-2 text-foreground/80">
            <Phone className="w-4 h-4 text-violet-500" />
            Phone Number
          </Label>
          <Input
            id="phone"
            placeholder="Enter your phone number"
            {...register("phone")}
            className="bg-background/50 focus-visible:ring-violet-500/50"
          />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="address" className="flex items-center gap-2 text-foreground/80">
            <MapPin className="w-4 h-4 text-violet-500" />
            Address
          </Label>
          <Input
            id="address"
            placeholder="Enter your address"
            {...register("address")}
            className="bg-background/50 focus-visible:ring-violet-500/50"
          />
          {errors.address && (
            <p className="text-xs text-destructive">{errors.address.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
