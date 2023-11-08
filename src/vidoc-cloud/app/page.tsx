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


const configurationTypes = [
  {
    name: "Store in Repo.",
    description:
      "By default vidoc works also without a config file. In that case, the videos will be stored in the repository itself. This is the easiest way to get started.",
    icon: FolderIcon,
  },
  {
    name: "Store in S3.",
    description:
      "If you want to store the videos in an S3 bucket, you can configure the extension to do so. Credentials can be shared using a gitignored .vidocsecrets file.",
    icon: ServerIcon,
  },
  {
    name: "Store on Vidoc.Cloud.",
    description:
      "Vidocs can be stored inside the Vidoc.Cloud platform. This is the easiest way to get started if you don't want to deal with S3 buckets or you are working in a team.",
    icon: CloudArrowUpIcon,
  },
];

export default function Home() {
  const codeLocal = `
  <div style="color: #dcdcaa;">{</div>
  <div style="margin-left: 20px;">
      <span style="color: #ce9178;">"savingStrategy"</span><span style="color: #bbbbbb;">: {</span>
      <div style="margin-left: 20px;">
          <span style="color: #ce9178;">"type"</span><span style="color: #bbbbbb;">: </span><span style="color: #9cdcfe;">"local"</span><span style="color: #bbbbbb;">,</span><br>
      </div>
      <span style="color: #bbbbbb;">}</span>
  </div>
  <div style="color: #dcdcaa;">}</div>
  <div style="color: #dcdcaa;"></div>
`;
  const codeS3 = `
  <div style="color: #dcdcaa;">{</div>
  <div style="margin-left: 20px;">
      <span style="color: #ce9178;">"type"</span><span style="color: #bbbbbb;">: </span><span style="color: #9cdcfe;">"remote"</span><span style="color: #bbbbbb;">,</span><br>
      <span style="color: #ce9178;">"savingStrategy"</span><span style="color: #bbbbbb;">: {</span>
      <div style="margin-left: 20px;">
          <span style="color: #ce9178;">"s3"</span><span style="color: #c1b5c1;">: {</span><br>
          <div style="margin-left: 20px;">
            <span style="color: #ce9178;">"bucketName"</span><span style="color: #bbbbbb;">: </span><span style="color: #9cdcfe;">"vidoc"</span><span style="color: #bbbbbb;">,</span><br>
            <span style="color: #ce9178;">"region"</span><span style="color: #bbbbbb;">: </span><span style="color: #9cdcfe;">"eu-central-1"</span><span style="color: #bbbbbb;">,</span><br>
            <span style="color: #ce9178;">"accessKeyId"</span><span style="color: #bbbbbb;">: </span><span style="color: #9cdcfe;">"\${ACCESS_KEY_AWS}"</span><span style="color: #bbbbbb;">,</span><br>
            <span style="color: #ce9178;">"secretAccessKey"</span><span style="color: #bbbbbb;">: </span><span style="color: #9cdcfe;">"\${SECRET_KEY_AWS}"</span><br>
            </div>
          <span style="color: #c1b5c1;">}</span>
      </div>
      <span style="color: #bbbbbb;">}</span>
  </div>
  <div style="color: #dcdcaa;">}</div>
  <div style="color: #dcdcaa;"></div>
`;
  const codeVidocCloud = `
    <div style="color: #dcdcaa;">{</div>
    <div style="margin-left: 20px;">
        <span style="color: #ce9178;">"savingStrategy"</span><span style="color: #bbbbbb;">: {</span>
        <div style="margin-left: 20px;">
            <span style="color: #ce9178;">"type"</span><span style="color: #bbbbbb;">: </span><span style="color: #9cdcfe;">"vidoc.cloud"</span><span style="color: #bbbbbb;">,</span><br>
            <span style="color: #ce9178;">"projectId"</span><span style="color: #bbbbbb;">: </span><span style="color: #a0faef;">"<i>123</i>"</span>
        </div>
        <span style="color: #bbbbbb;">}</span>
    </div>
    <div style="color: #dcdcaa;">}</div>
    <div style="color: #dcdcaa;"></div>
  `;

  return (
    <>
      <div className="bg-white">
        <header className="inset-x-0 top-0 z-50 fixed bg-white bg-opacity-80 border-b border-gray-100">
          <LandingPageNavigation />
        </header>

        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div className="mx-auto max-w-2xl pt-16 sm:pt-32 lg:pt-32">
            {/* <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                Announcing our next round of funding.{" "}
                <a href="#" className="font-semibold text-blue-600">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Read more <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div> */}
            <div className="text-center">
              <h1 className="flex justify-center flex-col">
                <span className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl flex items-center justify-center gap-x-2">
                  <div className="w-10 h-10 bg-red-600 rounded-full animate-pulse-fast inline-block"></div>
                  <span>Record your screen</span>
                </span>
                <span className="text-4xl font-bold tracking-tight text-gray-500">
                  to
                </span>
                <span className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Document your code
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                ViDoc is an IDE extension designed to elevate your documentation
                workflow. It lets you effortlessly record your screen and voice,
                offering rich context and insightful commentary on your code.
                This video commentary is then directly embedded into the code
                itself for others to see.
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
        <div className="bg-gray-800 bg-opacity-100" id="getting-started">
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
                  <div className="text-6xl font-bold text-white">1</div>
                  {/* <div className="mt-4 mb-2">
                    <SquaresPlusIcon className="h-14 w-14" aria-hidden="true" />
                  </div> */}
                  <h3 className="text-lg font-semibold text-white">
                    Install Extension
                  </h3>
                  <p className="text-sm text-gray-200 mt-4">
                    Go to the VSCode Extension marketplace and download the
                    ViDoc extension. It's free so why not give it a try?
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
                  <div className="text-6xl font-bold text-gray-200">2</div>
                  {/* <div className="mt-4 mb-2">
                    <i className="your-icon-class">
                      <AdjustmentsHorizontalIcon className="h-14 w-14"></AdjustmentsHorizontalIcon>
                    </i>
                  </div> */}
                  <h3 className="text-lg font-semibold text-gray-200">
                    Adjust Config
                  </h3>
                  <p className="text-sm text-gray-300 mt-4">
                    Setup the extension to your liking. You can choose to record
                    into the Vidoc Cloud for free, or use your existing S3
                    bucket. You can also start by storing the videos in the
                    repository itself.
                  </p>
                </div>
                <div className="flex flex-col items-center p-6 rounded-lg flex-1">
                  <div className="text-6xl font-bold text-white">3</div>
                  {/* <div className="mt-4 mb-2">
                    <i className="your-icon-class">
                      <VideoCameraIcon className="h-14 w-14"></VideoCameraIcon>
                    </i>
                  </div> */}
                  <h3 className="text-lg font-semibold text-white">Record</h3>
                  <p className="text-sm text-gray-200 mt-4">
                    Explain your code like you would to a coworker. Your file
                    will be automatically annotated with your recording.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-hidden py-24 bg-white mt-16 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                <div className="lg:pr-8 lg:pt-4">
                  <div className="lg:max-w-lg">
                    <h2 className="text-base font-semibold leading-7 text-blue-600">
                      How to configure Vidoc
                    </h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                      Data Storage Autonomy
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                      You can configure by adding a <code>.vidocconf.json</code>{" "}
                      file at the root of your repository. The following
                      configurations are supported:
                    </p>
                    <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                      {configurationTypes.map((feature) => (
                        <div key={feature.name} className="relative pl-9">
                          <dt className="inline font-semibold text-gray-900">
                            <feature.icon
                              className="absolute left-1 top-1 h-5 w-5 text-blue-600"
                              aria-hidden="true"
                            />
                            {feature.name}
                          </dt>{" "}
                          <dd className="inline">{feature.description}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
                <div className="pt-8">
                  <div className="mt-4 bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
                    <div id="header-buttons" className="pt-3 px-4 flex">
                      <div className="text-sm font-mono text-gray-400">
                        Store in Repo
                      </div>
                    </div>
                    <div
                      id="code-area"
                      className="pb-2 px-4 text-white text-sm font-mono"
                    >
                      <div
                        dangerouslySetInnerHTML={{ __html: codeLocal }}
                      ></div>
                    </div>
                    <div id="header-buttons" className="pt-3 px-4 flex">
                      <div className="text-sm font-mono text-gray-400">
                        Store on S3
                      </div>
                    </div>
                    <div
                      id="code-area"
                      className="pb-2 px-4 text-white text-sm font-mono"
                    >
                      <div dangerouslySetInnerHTML={{ __html: codeS3 }}></div>
                    </div>
                    <div id="header-buttons" className="pt-3 px-4 flex">
                      <div className="text-sm font-mono text-gray-400">
                        Store in Vidoc.Cloud
                      </div>
                    </div>
                    <div
                      id="code-area"
                      className="pb-2 px-4 text-white text-sm font-mono"
                    >
                      <div
                        dangerouslySetInnerHTML={{ __html: codeVidocCloud }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
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
                      Vidoc is open source to its core, promising every user
                      unrestricted access to its comprehensive feature set.
                      While cloud services are available, they're merely
                      optional—Vidoc stands firm in providing an exceptional,
                      community-fueled user experience right out of the box.
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
                      <span className="text-gray-200 text-sm">You see this? <ArrowUpIcon className="h-4 w-4 inline-block text-white" /> We are just getting started!</span>
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
              <p className="text-sm text-gray-300">&#169; Henry Müssemann</p>
              <p className="text-sm text-gray-300">(HM Dev Consulting)</p>
            </div>
            <div className="flex justify-center my-4 md:my-0 text-gray-300 text-sm">
              <nav>
                <ul>
                  <li className="mb-2">
                    <Link href="/impressum" className="hover:underline">
                      Impressum
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link href="/gdpr" className="hover:underline">
                      GDPR Information
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms-and-conditions"
                      className="hover:underline"
                    >
                      Terms & Conditions
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
                      <ArrowTopRightOnSquareIcon className="w-4 h-4" /> Find us
                      on Github
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      href="https://www.linkedin.com/in/henry-muessemann/"
                      target="_blank"
                      className="hover:underline flex items-center gap-x-1"
                    >
                      <ArrowTopRightOnSquareIcon className="w-4 h-4" /> Find
                      Henry on LinkedIn
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
