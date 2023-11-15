import Image from "next/image";
import Link from "next/link";
import {
    ArrowTopRightOnSquareIcon,
    ArrowUpIcon,
    CloudArrowUpIcon,
    FolderIcon,
    ServerIcon,
} from "@heroicons/react/20/solid";
import LandingPageNavigation from "./components/client/LandingPageNavigation";
import { ArrowUpLeftIcon } from "@heroicons/react/24/outline";
import HowToConfigureVidoc from "./components/client/HowToConfigureVidoc";


export default function Home() {
    

    return (
        <>
            <div className="bg-white">
                <div className="relative isolate px-6 pt-14 lg:px-8 bg-gradient-to-tl from-[#ddeeff] to-[#fffcfc]">
                    <div className="mx-auto max-w-2xl pt-16 sm:pt-32 lg:pt-32">
                        <div className="text-center">
                            <h1 className="flex justify-center flex-col">
                                <span className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                    <div className="w-6 h-6 sm:w-10 sm:h-10 mr-2 sm:mr-4 bg-red-600 rounded-full animate-pulse-fast inline-block"></div>
                                    <span>Record your screen</span>
                                </span>
                                <span className="text-4xl font-bold tracking-tight text-gray-500">
                                    to
                                </span>
                                <span className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                    Document your code
                                </span>
                            </h1>
                            <p className="mt-6 text-sm sm:text-lg leading-8 text-gray-600">
                                ViDoc is an IDE extension designed to improve your
                                your documentation workflow. It allows you to
                                effortlessly record your screen and voice into your editor,
                                providing context and insightful commentary
                                to your code. This video commentary is then
                                embedded directly into the code itself for
                                for others to see.
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <Link
                                    href="https://marketplace.visualstudio.com/items?itemName=HMDevConsulting.vidoc"
                                    target="_blank"
                                    className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                >
                                    Download Now
                                </Link>
                                <a
                                    href="#getting-started"
                                    className="text-sm font-semibold leading-6 text-gray-900"
                                >
                                    Learn more <span aria-hidden="true">→</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="max-w-fit mx-auto py-16 sm:py-16 lg:py-16">
                        <Image
                            priority
                            src="/vidoc-screenshot.png"
                            width={1127}
                            height={417}
                            alt="Screenshot"
                            className="shadow-xl rounded-lg"
                        />
                    </div>
                </div>
                <div
                    className="bg-gray-800 bg-opacity-100"
                    id="getting-started"
                >
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="">
                            <div className="mx-auto max-w-2xl pt-16 sm:pt-16 lg:pt-16">
                                <h2 className="flex justify-center flex-col">
                                    <span className="text-4xl font-bold tracking-tight text-white sm:text-5xl text-center">
                                        Getting Started
                                    </span>
                                </h2>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-8 mt-12">
                                <div className="flex flex-col items-center p-6 rounded-lg flex-1">
                                    <div className="text-6xl font-bold text-white">
                                        1
                                    </div>
                                    {/* <div className="mt-4 mb-2">
                    <SquaresPlusIcon className="h-14 w-14" aria-hidden="true" />
                  </div> */}
                                    <h3 className="text-lg font-semibold text-white">
                                        Install Extension
                                    </h3>
                                    <p className="text-sm text-gray-200 mt-4">
                                        Go to the VSCode Extension Marketplace
                                        and download the ViDoc extension. It's
                                        free so why not give it a try?
                                    </p>
                                    <Link
                                        href="https://marketplace.visualstudio.com/items?itemName=HMDevConsulting.vidoc"
                                        target="_blank"
                                        className="rounded-md text-center mt-4 bg-white text-blue-900 px-3.5 py-2.5 text-sm font-semibold shadow-sm transition hover:scale-105 hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                                    >
                                        Download VSCode Extension
                                    </Link>
                                </div>
                                <div className="flex flex-col items-center p-6 rounded-lg flex-1">
                                    <div className="text-6xl font-bold text-gray-200">
                                        2
                                    </div>
                                    {/* <div className="mt-4 mb-2">
                    <i className="your-icon-class">
                      <AdjustmentsHorizontalIcon className="h-14 w-14"></AdjustmentsHorizontalIcon>
                    </i>
                  </div> */}
                                    <h3 className="text-lg font-semibold text-gray-200">
                                        Adjust Config
                                    </h3>
                                    <p className="text-sm text-gray-300 mt-4">
                                        Setup the extension to your liking. You
                                        can choose to record into the Vidoc
                                        Cloud for free, or use your existing S3
                                        bucket. You can also start by storing
                                        the videos in the repository itself.
                                    </p>
                                </div>
                                <div className="flex flex-col items-center p-6 rounded-lg flex-1">
                                    <div className="text-6xl font-bold text-white">
                                        3
                                    </div>
                                    {/* <div className="mt-4 mb-2">
                    <i className="your-icon-class">
                      <VideoCameraIcon className="h-14 w-14"></VideoCameraIcon>
                    </i>
                  </div> */}
                                    <h3 className="text-lg font-semibold text-white">
                                        Record
                                    </h3>
                                    <p className="text-sm text-gray-200 mt-4">
                                        Explain your code as you would to a
                                        colleague. Your file will automatically
                                        be annotated with your recording.{" "}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-hidden py-24 bg-white mt-16 sm:py-32">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <HowToConfigureVidoc />
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800" id="contribute">
                    <div className="overflow-hidden py-24 mt-16 sm:py-32">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                                <div className="pt-8">
                                    <Link
                                        href="https://github.com/bubblegumsoldier/vidoc"
                                        target="_blank"
                                    >
                                        <Image
                                            alt="Github Repo Preview"
                                            src="/vidoc-repo-preview.png"
                                            className="rounded-lg shadow-xl transition hover:scale-105 hover:opacity-50"
                                            width={927}
                                            height={704}
                                        />
                                    </Link>
                                </div>
                                <div className="lg:pr-8 lg:pt-4">
                                    <div className="lg:max-w-lg">
                                        <h2 className="text-base font-semibold leading-7 text-blue-300">
                                            How to contribute
                                        </h2>
                                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
                                            Open Source First!
                                        </p>
                                        <p className="mt-6 text-lg leading-8 text-gray-100">
                                            Vidoc is open source at its core,
                                            promising unrestricted access to
                                            every user. While cloud services are
                                            available, they're optional - Vidoc
                                            is committed to providing an
                                            exceptional, community-driven user
                                            experience right out of the box.
                                        </p>
                                        <iframe
                                            src="https://ghbtns.com/github-btn.html?user=bubblegumsoldier&repo=vidoc&type=star&count=true&size=large"
                                            scrolling="0"
                                            width="180"
                                            height="40"
                                            title="GitHub"
                                            className="mt-4"
                                        ></iframe>
                                        <p>
                                            <span className="text-gray-200 text-sm">
                                                You see this?{" "}
                                                <ArrowUpIcon className="h-4 w-4 inline-block text-white" />{" "}
                                                We gotta change this!
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <footer className="bg-gray-900 text-white">
                    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-3">
                        <div className="md:justify-start">
                            <p className="text-lg">Vidoc</p>
                            <p className="text-sm text-gray-300">
                                &#169; Henry Müssemann
                            </p>
                            <p className="text-sm text-gray-300">
                                (HM Dev Consulting)
                            </p>
                        </div>
                        <div className="flex justify-center my-4 md:my-0 text-gray-300 text-sm">
                            <nav>
                                <ul>
                                    <li className="mb-2">
                                        <Link
                                            href="/impressum"
                                            className="hover:underline"
                                        >
                                            Legal Notice
                                        </Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link
                                            href="/gdpr"
                                            className="hover:underline"
                                        >
                                            Website Privacy
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                        <div className="hidden md:flex justify-end text-gray-300 text-sm">
                            <nav>
                                <ul>
                                    <li className="mb-2">
                                        <Link
                                            href="https://github.com/bubblegumsoldier/vidoc"
                                            target="_blank"
                                            className="hover:underline flex items-center gap-x-1"
                                        >
                                            <ArrowTopRightOnSquareIcon className="w-4 h-4" />{" "}
                                            Find us on Github
                                        </Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link
                                            href="https://www.linkedin.com/in/henry-muessemann/"
                                            target="_blank"
                                            className="hover:underline flex items-center gap-x-1"
                                        >
                                            <ArrowTopRightOnSquareIcon className="w-4 h-4" />{" "}
                                            Find Henry on LinkedIn
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
