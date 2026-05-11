import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { User } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DragNDropUploader } from "@/components/shared/DragNDropUploader";
import type { ProfileInput } from "./dashboard-schemas";

export function ProfilePictureCard() {
  const { watch } = useFormContext<ProfileInput>();
  const profileImgUrl = watch("profileImg");

  return (
    <Card className="border-border/40 bg-card/40 backdrop-blur-xl shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-muted/20 border-b border-border/20 pb-4">
        <CardTitle className="text-lg bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          Profile Picture
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex flex-col items-center">
        <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-background shadow-2xl mb-6 bg-muted ring-2 ring-violet-500/20 group">
          {profileImgUrl ? (
            <Image
              src={profileImgUrl}
              alt="Profile"
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="144px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
              <User className="w-14 h-14" />
            </div>
          )}
        </div>

        <div className="w-full">
          <DragNDropUploader name="profileImg" folder="group-khata/profile" />
        </div>
      </CardContent>
    </Card>
  );
}
