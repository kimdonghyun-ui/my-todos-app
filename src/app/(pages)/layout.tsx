import Header from "@/components/layout/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header showBackButton />
      <div className="flex pt-16 min-h-screen">
        <div className="flex-1 w-full">
          {children}
        </div>
      </div>
    </>
  );
}
