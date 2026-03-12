export const metadata = {
  title: "CalcWise",
  description: "Simple calculators for smarter money decisions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif", background: "#f8fafc" }}>
        {children}
      </body>
    </html>
  );
}