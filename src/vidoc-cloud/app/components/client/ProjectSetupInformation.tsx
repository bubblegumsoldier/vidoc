"use client";

export default function ProjectSetupInformation({ project }) {
  const code = `
    <div style="color: #dcdcaa;">{</div>
    <div style="margin-left: 20px;">
        <span style="color: #ce9178;">"savingStrategy"</span><span style="color: #bbbbbb;">: {</span>
        <div style="margin-left: 20px;">
            <span style="color: #ce9178;">"type"</span><span style="color: #bbbbbb;">: </span><span style="color: #9cdcfe;">"vidoc.cloud"</span><span style="color: #bbbbbb;">,</span><br>
            <span style="color: #ce9178;">"projectId"</span><span style="color: #bbbbbb;">: </span><span style="color: #a0faef;">"<i>${project.id}</i>"</span>
        </div>
        <span style="color: #bbbbbb;">}</span>
    </div>
    <div style="color: #dcdcaa;">}</div>
  `;

  return (
    <>
      <h1 className="font-bold text-black text-xl">Getting Started</h1>
      <p className="text-gray-600 mt-2 mb-4">
        In order to activate this project in your local environment, you will
        need to adapt your <code>.vidocconf</code> file. It should look
        something like the following code snippet:
      </p>
      <div className="mt-4 lg:w-6/12 bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
        <div id="header-buttons" className="py-3 px-4 flex">
          <div className="text-sm font-mono text-gray-400">.vidocconf.json</div>
        </div>
        <div
          id="code-area"
          className="py-2 px-4 text-white text-medium font-mono"
        >
          <div dangerouslySetInnerHTML={{ __html: code }}></div>
        </div>
      </div>
      <h1 className="font-bold text-black text-xl mt-8">First recording</h1>
      <p className="text-gray-600 mt-2 mb-4">
        The first time you run a recording, you will be asked to authenticate
        with your Vidoc Cloud account. This will allow you to record and upload
        your recording to the Vidoc Cloud.
      </p>
    </>
  );
}
