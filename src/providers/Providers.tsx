"use client";

import { Toaster } from "sonner";
import { ThemeProvider } from "./ThemeProvider";
import ContextProvider from "./ContextProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ContextProvider>
        <Toaster richColors position="top-right" closeButton dir="ltr" />
        {children}
      </ContextProvider>
    </ThemeProvider>
  );
};

export default Providers;
