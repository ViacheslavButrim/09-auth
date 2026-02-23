import "./globals.css";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body>
        <TanStackProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}