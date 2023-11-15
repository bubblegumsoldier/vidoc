"use client";

import {
    CloudArrowUpIcon,
    FolderIcon,
    ServerIcon,
} from "@heroicons/react/20/solid";
import { useEffect, useRef, useState } from "react";

const configurationTypes = [
    {
        name: "Store on Vidoc.Cloud.",
        description:
            "Vidocs can be stored inside the Vidoc.Cloud platform. This is the easiest way to get started if you don't want to deal with S3 buckets or you are working in a team.",
        icon: CloudArrowUpIcon,
        id: "store-on-vidoc-cloud",
        code: `
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
      `,
    },
    {
        name: "Store in Repo.",
        description:
            "By default vidoc works also without a config file. In that case, the videos will be stored in the repository itself. This is the easiest way to get started.",
        icon: FolderIcon,
        id: "store-in-repo",
        code: `
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
      `,
    },
    {
        name: "Store in S3.",
        description:
            "If you want to store the videos in an S3 bucket, you can configure the extension to do so. Credentials can be shared using a gitignored .vidocsecrets file.",
        icon: ServerIcon,
        id: "store-in-s3",
        code: `
        <div style="color: #dcdcaa;">{</div>
        <div style="margin-left: 20px;">
            <span style="color: #ce9178;">"type"</span><span style="color: #bbbbbb;">: </span><span style="color: #9cdcfe;">"remote"</span><span style="color: #bbbbbb;">,</span><br>
            <span style="color: #ce9178;">"savingStrategy"</span><span style="color: #bbbbbb;">: {</span>
            <div style="margin-left: 20px;">
                <span style="color: #ce9178;">"s3"</span><span style="color: #c1b5c1;">: {</span><br>
                <div style="margin-left: 20px;">
                  <span style="color: #ce9178;">"bucketName"</span><span style="color: #bbbbbb;">: </span><span style="color: #9cdcfe;">"vidoc"</span><span style="color: #bbbbbb;">,</span><br>
                  <span style="color: #ce9178;">"region"</span><span style="color: #bbbbbb;">: </span><span style="color: #9cdcfe;">"eu-central-1"</span><span style="color: #bbbbbb;">,</span><br>
                  <span style="color: #ce9178;">"accessKeyId"</span><span style="color: #bbbbbb;">: </span><span style="color: #9cdcfe;">"\${ACCESS_KEY_AWS}"</span><span style="color: #bbbbbb;">,</span><span style="margin-left: 5px; color: #9ca3afaa; user-select: none;">(.vidocsecrets)</span> <br>
                  <span style="color: #ce9178;">"secretAccessKey"</span><span style="color: #bbbbbb;">: </span><span style="color: #9cdcfe;">"\${SECRET_KEY_AWS}"</span><span style="margin-left: 5px; color: #9ca3afaa; user-select: none;">(.vidocsecrets)</span><br>
                  </div>
                <span style="color: #c1b5c1;">}</span>
            </div>
            <span style="color: #bbbbbb;">}</span>
        </div>
        <div style="color: #dcdcaa;">}</div>
        <div style="color: #dcdcaa;"></div>
      `,
    }
];

export default function HowToConfigureVidoc() {
    const [selected, setSelected] = useState("store-on-vidoc-cloud");
    const bgDivRef = useRef(null);
    const bgDivRefCode = useRef(null);
    const itemRefs = useRef({});
    const itemRefsCode = useRef({});
    const [bgStyle, setBgStyle] = useState({ top: 0, height: 0, opacity: 0 });
    const [bgStyleCode, setBgStyleCode] = useState({
        top: 0,
        height: 0,
        opacity: 0,
    });

    const calculateAndSetBgStyle = (itemId) => {
        if (itemId && itemRefs.current[itemId]) {
            const target = itemRefs.current[itemId];
            const targetTop = target.offsetTop;
            const targetHeight = target.offsetHeight;
            const additionalYOffset = 0;
            setBgStyle({
                top: targetTop - additionalYOffset / 2,
                height: targetHeight + additionalYOffset,
                opacity: 1,
            });
        } else {
            setBgStyle({ top: 0, height: 0, opacity: 0 });
        }
    };

    const calculateAndSetBgStyleCode = (itemId) => {
        if (itemId && itemRefsCode.current[itemId]) {
            const target = itemRefsCode.current[itemId];
            const targetTop = target.offsetTop;
            const targetHeight = target.offsetHeight;
            const additionalYOffset = 0;
            setBgStyleCode({
                top: targetTop - additionalYOffset / 2,
                height: targetHeight + additionalYOffset,
                opacity: 0.1,
            });
        } else {
            setBgStyleCode({ top: 0, height: 0, opacity: 0 });
        }
    };

    useEffect(() => {
        calculateAndSetBgStyle(selected);
        calculateAndSetBgStyleCode(selected);
        if (!selected) {
            setSelected("store-on-vidoc-cloud");
        }
    }, [selected]);

    const handleMouseEnter = (featureId) => {
        setSelected(featureId);
    };

    return (
        <>
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                <div className="relative lg:pr-8 lg:pt-4">
                    <div className="lg:max-w-lg">
                        <h2 className="text-base font-semibold leading-7 text-blue-600">
                            How to configure Vidoc
                        </h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Data Storage Autonomy
                        </p>
                        <p className="mt-6 leading-8 text-gray-600">
                            You can configure by adding a{" "}
                            <code>.vidocconf.json</code> file at the root of
                            your repository. The following configurations are
                            supported:
                        </p>
                        <div className="relative">
                            <div
                                ref={bgDivRef}
                                className="absolute left-0 w-full bg-gray-200 rounded lg:opacity-100 opacity-0"
                                style={{
                                    top: bgStyle.top,
                                    height: bgStyle.height,
                                    transition: "all 0.3s ease",
                                }}
                            />
                            <dl className="relative pl-2 mt-4 max-w-xl text-base leading-7 text-gray-600 lg:max-w-none cursor-pointer">
                                {configurationTypes.map((feature) => (
                                    <div
                                        key={feature.id}
                                        className="relative pl-9 py-4"
                                        id={feature.id}
                                        ref={(el) =>
                                            (itemRefs.current[feature.id] = el)
                                        }
                                        onMouseEnter={() =>
                                            handleMouseEnter(feature.id)
                                        }
                                        onMouseLeave={() => setSelected(null)}
                                    >
                                        <dt className="inline font-semibold text-gray-900">
                                            <feature.icon
                                                className="absolute left-1 top-5 h-5 w-5 text-blue-600"
                                                aria-hidden="true"
                                            />
                                            {feature.name}
                                        </dt>{" "}
                                        <dd className="inline">
                                            {feature.description}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                </div>
                <div className="pt-8">
                    <div className="relative mt-4 bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
                        <div
                            ref={bgDivRefCode}
                            className="absolute left-0 w-full bg-blue-300 rounded border border-gray-600 bg-opacity-10 lg:opacity-100 opacity-0"
                            style={{
                                top: bgStyleCode.top,
                                height: bgStyleCode.height,
                                transition: "all 0.3s ease",
                            }}
                        />
                        <div className="relative z-10">
                            {configurationTypes.map((feature) => (
                                <div
                                    key={feature.id}
                                    ref={(el) =>
                                        (itemRefsCode.current[feature.id] = el)
                                    }
                                    onMouseEnter={() =>
                                        handleMouseEnter(feature.id)
                                    }
                                    onMouseLeave={() => setSelected(null)}
                                    className="cursor-pointer"
                                >
                                    <div
                                        id="header-buttons"
                                        className="pt-3 px-4 flex"
                                    >
                                        <div className="text-sm font-mono text-gray-400 select-none">
                                            {feature.name}
                                        </div>
                                    </div>
                                    <div
                                        id="code-area"
                                        className="pb-2 px-4 text-white text-sm font-mono"
                                    >
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: feature.code,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
