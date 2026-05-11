import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Group Khata",
  description: "App for managing loans of a group of people",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Navbar />
      <div className="">{children}</div>
      <Footer />
    </main>
  );
}
