import { Inter } from "next/font/google";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import LandingPageNavigation from "./components/client/LandingPageNavigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Vidoc Cloud",
    description: "Vidoc Cloud",
};

export default function RootLayout({ children }) {
    return (
        <>
            <html lang="en">
                <UserProvider>
                    <body className={inter.className}>
                        {children}
                    </body>
                </UserProvider>
            </html>
        </>
    );
}
