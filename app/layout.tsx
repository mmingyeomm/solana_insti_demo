import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "솔라나 결제 인프라 쇼케이스",
  description: "토큰 익스텐션과 Private Channels를 시각자료, 시뮬레이션, 사례로 정리한 쇼케이스.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
