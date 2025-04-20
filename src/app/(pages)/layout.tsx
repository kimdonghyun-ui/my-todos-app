
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="pt-16 h-screen overflow-hidden">
        <div className=" h-[calc(100vh-4rem)] overflow-auto">
          <div className="flex flex-col h-full">{children}</div>
        </div>
    </div>
  );
}
