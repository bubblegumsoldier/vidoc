import Link from "next/link";

export default function Impressum() {
    return (
        <>
            <div className="mx-auto py-6 max-w-5xl px-2 sm:px-6 lg:px-8 h-16">
                <div className="pt-32">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                        Legal Notice
                    </h1>
                    <h2 className="text-4xl font-bold tracking-tight text-gray-600 sm:text-3xl mt-6">
                        General
                    </h2>

                    <p className="mt-2 text-gray-800">
                        <strong className="text-gray-600">Owner:</strong> Henry
                        Müssemann
                        <br />
                        <strong className="text-gray-600">Address:</strong>{" "}
                        Weilburger Straße 12, 60326 Frankfurt am Main,
                        Deutschland
                        <br />
                        <strong className="text-gray-600">Phone:</strong> +49
                        1578 9723767
                        <br />
                        <strong className="text-gray-600">E-Mail:</strong>{" "}
                        <Link
                            href="mailto:hm@hm-dev-consulting.de"
                            className="text-blue-600"
                        >
                            hm@hm-dev-consulting.de
                        </Link>
                    </p>

                    <h2 className="text-4xl font-bold tracking-tight text-gray-600 sm:text-3xl mt-6">
                        Legal Notice
                    </h2>
                    <p className="mt-2">
                        This website is owned by Henry Müssemann. It offers a
                        free-to-use cloud implementation for Vidoc, a
                        free-to-install extension for various IDEs. The content
                        of our website has been compiled with meticulous care
                        and to the best of our knowledge. However, we cannot
                        assume any liability for the up-to-dateness,
                        completeness or accuracy of any of the pages.
                    </p>

                    <h2 className="text-4xl font-bold tracking-tight text-gray-600 sm:text-3xl mt-6">
                        Privacy Policy
                    </h2>
                    <p className="mt-2">
                        We are committed to safeguarding the privacy of our
                        website visitors.
                        <br />
                        <Link href="/gdpr" className="text-blue-600">
                            This policy
                        </Link>{" "}
                        sets out how we will treat your personal information.
                    </p>

                    <h2 className="text-4xl font-bold tracking-tight text-gray-600 sm:text-3xl mt-6">
                        Disclaimer
                    </h2>
                    <p className="mt-2">
                        Our website may contain links to external websites. As
                        the content of these external websites is not under our
                        control, we cannot assume any liability for such
                        external content. In all cases, the provider of
                        information of the linked websites is liable for the
                        content and accuracy of the information provided.
                    </p>
                </div>
            </div>
        </>
    );
}
