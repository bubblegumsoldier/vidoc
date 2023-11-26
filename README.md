<!-- TOC start (generated with https://github.com/derlin/bitdowntoc) -->

- [ViDoc: An Interactive Documentation Extension for Visual Studio Code](#vidoc-an-interactive-documentation-extension-for-visual-studio-code)
   * [Vision Statement](#vision-statement)
   * [When to use Vidoc](#when-to-use-vidoc)
   * [Simple introduction video](#simple-introduction-video)
      + [Storing video recordings within the repository](#storing-video-recordings-within-the-repository)
      + [Setting up Vidoc.Cloud](#setting-up-vidoccloud)
      + [Setting up Vidoc with AWS (advanced configurations)](#setting-up-vidoc-with-aws-advanced-configurations)
      + [Prerequisites](#prerequisites)
      + [Configuration Files](#configuration-files)
         - [.vidocconf.json](#vidocconfjson)
         - [.vidocsecrets](#vidocsecrets)
         - [Configuration Options](#configuration-options)
         - [Removing unused videos](#removing-unused-videos)
   * [Tipps and Tricks](#tipps-and-tricks)
      + [Pause Videos often](#pause-videos-often)
      + [Usage of Whiteboards](#usage-of-whiteboards)
      + [Overlay your browser or other windows](#overlay-your-browser-or-other-windows)
      + [Build Onboarding Guides using markdown](#build-onboarding-guides-using-markdown)
   * [Contribution Guidelines](#contribution-guidelines)
   * [Introduction Vidoc Code](#introduction-vidoc-code)
   * [License](#license)

<!-- TOC end -->

<!-- TOC --><a name="vidoc-an-interactive-documentation-extension-for-visual-studio-code"></a>
# ViDoc: An Interactive Documentation Extension for Visual Studio Code

![2](https://github.com/bubblegumsoldier/vidoc/assets/3788628/5dc2060b-fc22-4fd3-88d9-f7037faff674)

<!-- TOC --><a name="vision-statement"></a>
## Vision Statement

In modern software development, clear and comprehensive documentation is key. ViDoc is a VS Code extension that aims to revolutionize how documentation is done by incorporating audio-visual elements directly into your code. The extension enables users to record their screen, providing real-time context and commentary on their actions. The result? Documentation that feels like a pair-programming session.

ViDoc aims to promote collaboration, enhance code comprehension, and simplify the documentation process by providing an intuitive, engaging and interactive way to explain complex code snippets. Rather than just reading about how a piece of code works, ViDoc allows you to show, tell, and share in a more dynamic way.

<!-- TOC --><a name="when-to-use-vidoc"></a>
## When to use Vidoc

Video's are a bit like voice-messages. People love to send them but don't like to receive them. It is a sender-friendly medium not a receiver-friendly medium. This gives some hints on when we think it should be used:

**Do's:**

- Do use Vidocs for very complex classes that have interdependencies with other classes
- Do use Vidoc when you want to explain how different parts of the software relate to one another
- Do use Vidoc if it is easier for you than writing long paragraphs and the alternative would be no documentation at all
- Do use Vidoc as an additional alternative to text (some people prefer video tutorials, some text)

**Don'ts:**

- Don't use Vidocs for very frequently accessed documentation like public documentation for a library, people tend to skim rather than having to watch a video
- Don't use Vidocs for simple documentation where a text suffices
- Don't record Vidocs longer than 10 Minutes - you're not shooting a movie here

<!-- TOC --><a name="simple-introduction-video"></a>
## Simple introduction video

<!-- TOC --><a name="storing-video-recordings-within-the-repository"></a>
### Storing video recordings within the repository

https://github.com/bubblegumsoldier/vidoc/assets/3788628/7dc62d0a-b92e-4404-905e-ea946da3a70f

The easiest way to try out the extension is to store the files locally inside the repository. No configuration file is needed in order to achieve that behaviour. However, this is not recommended for larger projects as it can substantially increase the repository size and pushing videos as well as pulling videos can be a pain.

<!-- TOC --><a name="setting-up-vidoccloud"></a>
### Setting up Vidoc.Cloud

https://github.com/bubblegumsoldier/vidoc/assets/3788628/bc755396-4757-40b7-a7e1-a49bebcd8a29

Vidoc.Cloud is a streamlined, open-source hosting platform under the domain `vidoc.cloud`. It simplifies video storage, text transcription, and access management for contributors. Essentially, it's Vidoc as a Service. Create projects and invite collaborators without the hassle of sharing `.vidocsecrets` files. Only approved developers can contribute. Initially free, upgrade options are available for extended use, so that we can continue running.

In order to configure Vidoc to use vidoc.cloud follow these steps:

1. Head to [vidoc.cloud](https://vidoc-cloud.vercel.app/) and create an account.
2. Create a project for the repository you want to connect with vidoc.cloud
3. Copy the `.vidocconf.json` as specified under the section `Setup`.

When you are recording your first Vidoc you will be asked to log into your account. From then on your vscode user is synced with your `vidoc.cloud` user. If you want other contributors to be able to seamlessly record Vidocs just let them register and add them as a collaborator to your project.

<!-- TOC --><a name="setting-up-vidoc-with-aws-advanced-configurations"></a>
### Setting up Vidoc with AWS (advanced configurations)

https://github.com/bubblegumsoldier/vidoc/assets/3788628/19a3ce1b-db8f-461f-a7cd-76a68bf50147

This guide walks you through setting up AWS S3 video upload for your VSCode extension. You can also configure it to work with other S3-compatible providers like DigitalOcean.

<!-- TOC --><a name="prerequisites"></a>
### Prerequisites

- AWS Account with access to S3 services.
- VSCode extension installed.

<!-- TOC --><a name="configuration-files"></a>
### Configuration Files

You need to create two files in the root directory of your project:

1. `.vidocconf.json`
2. `.vidocsecrets`

**Important**: Make sure to add `.vidocsecrets` to your `.gitignore` file as it will contain sensitive information that can be used to upload data to your AWS S3 buckets (if provided). You can share that file with other contributors via a different channel if necessary, so that every contributor can upload documentation videos, but it is not recommended to ever commit the file for security reasons.

<!-- TOC --><a name="vidocconfjson"></a>
#### .vidocconf.json

This file contains the configuration details for saving videos and performing post-processing operations.

Example `.vidocconf.json`:

```json
{
    "savingStrategy": {
        "type": "remote",
        "s3": {
            "bucketName": "${AWS_BUCKET}",
            "region": "${AWS_REGION}",
            "accessKeyId": "${ACCESS_KEY_AWS}",
            "secretAccessKey": "${SECRET_KEY_AWS}",
            "alternativeRootPath": "https://some-other-provider-than-s3.com"
        }
    },
    "recordingOptions": {
        "postProcessingOptions": {
            "speechToText": {
                "enabled": true,
                "type": "aws-transcribe",
                "awsTranscribe": {
                    "bucketName": "${AWS_BUCKET}",
                    "region": "${AWS_REGION}",
                    "accessKeyId": "${ACCESS_KEY_AWS}",
                    "secretAccessKey": "${SECRET_KEY_AWS}"
                }
            }
        }
    }
}

```

<!-- TOC --><a name="vidocsecrets"></a>
#### .vidocsecrets

This file will store your AWS secret information. Replace the placeholders with your actual AWS information. The placeholders correspond to the variables you have referenced in your `vidocconf.json`.

Example .vidocsecrets:

```
ACCESS_KEY_AWS=<Your access key>
SECRET_KEY_AWS=<Your secret key>
AWS_BUCKET=<Your bucket name>
AWS_REGION=eu-central-1
```

<!-- TOC --><a name="configuration-options"></a>
#### Configuration Options

Here's a brief overview of what each field in the configuration means:

 * `savingStrategy`: Determines whether to save files locally or remotely.
    * `type`: Either "local" or "remote".
    * `folder`: Where to store the files. Default is .vidoc.
 * `recordingOptions`: Various recording settings.
   * `postProcessingOptions`: Allows enabling speech-to-text conversion.
     * `speechToText`: Further settings for speech-to-text.
       * `enabled`: Whether to enable the feature or not.
       * `type`: Currently only supports "aws-transcribe".
       * `awsTranscribe`: Can be used to configure aws transcribe in your projects


<!-- TOC --><a name="removing-unused-videos"></a>
#### Removing unused videos

Let's say you have just pressed record and recorded a video that was not on the standard of quality you would like. So you remove the newly generated vidoc metadata file. But the file has already been uploaded. This can happen frequently and your S3 Bucket fills up over time with unreferenced videos. To "garbage-collect" these files you can run the command `[Vidoc] Remove unreferenced Remote Files`. You will need to have an S3 user with rights to list and delete files in order to perform this command. If you don't want to reuse the normal uploading credentials you can enter an `s3Administration` key into `savingStrategy` next to your existing `s3` key and fill in the same values just for the administration account. That way you can provide others with only the upload credentials and not with the administration credentials.

The command will find in the bucket all files for which there is no vidoc metadata file in this repository under `./.vidoc`. It will then ask you if you want to delete these files. 

**Caution!** If you are using the same bucket for another repository then it would remove the videos that are referenced there. Create a new bucket for each repository!

**Caution 2!** Remember that Vidoc can only see what Vidocs are on your branch. If a colleague has added a Vidoc in another branch you might just be removing it for him.

<!-- TOC --><a name="tipps-and-tricks"></a>
## Tipps and Tricks

<!-- TOC --><a name="pause-videos-often"></a>
### Pause Videos often

Oftentimes you might find yourself stumbling over words or trying to formulate the same idea in different ways. Sometimes it makes sense to **pause** the video, think about the best formulation and **resume** once you have settled on the easiest formulation to bring your point accross.

<!-- TOC --><a name="usage-of-whiteboards"></a>
### Usage of Whiteboards

You can simply install an extension such as [tldraw](https://marketplace.visualstudio.com/items?itemName=tldraw-org.tldraw-vscode) or [Excalidraw](https://marketplace.visualstudio.com/items?itemName=pomdtr.excalidraw-editor) to share a whiteboard while recording. There are three ways to incorporate whiteboards and diagrams into your videos:

1. Pre-Draw diagrams and whiteboards before recording
2. Pause the video when you get the idea to draw a diagram, then draw the diagram, then resume the recording and explain it.
3. Draw live while recording.

All three will greatly improve the quality of your videos.

<!-- TOC --><a name="overlay-your-browser-or-other-windows"></a>
### Overlay your browser or other windows

When you start recording a Vidoc, the area of your VSCode window on the screen will be fetched. **The area** on your screen is recorded. Different to sharing a specific window in Google Hangouts, Zoom or Teams, **any overlay over the window will also be captured**. You can use this feature to

1. Drag your UI or browser into the viewport and explain frontend code while showcasing the output live.
2. Explain processes, resources, CI/CD pipelines etc by dragging your browser into the viewport.
3. Start "Loom" without recording, drag your webcam preview circle on top of your IDE and record your camera and IDE at the same time without needing to pay for Loom Premium Plans.

<!-- TOC --><a name="build-onboarding-guides-using-markdown"></a>
### Build Onboarding Guides using markdown

Vidoc was specifically optimized to work in Markdown files. This allows you to build great Onboarding guides for new developers by incorporating a mix of text + videos while keeping the footprint of these files as minimal as possible.

<!-- TOC --><a name="contribution-guidelines"></a>
## Contribution Guidelines

We welcome contributions from the open-source community. To contribute:

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your Pull Request adheres to the following guidelines:

- Write clear and meaningful Git commit messages.
- If the changes are substantial, make sure you've discussed them and received approval in an issue first.
- Make sure your PR passes all our automated tests and if it doesn't, provide a clear explanation of why.

Thank you for your interest in improving ViDoc!

<!-- TOC --><a name="introduction-vidoc-code"></a>
## Introduction Vidoc Code

![:vidoc 014151df-545b-4ff5-a305-12de6c036c16.mp4](https://vidoc.s3.eu-central-1.amazonaws.com/014151df-545b-4ff5-a305-12de6c036c16.mp4)

<!-- TOC --><a name="license"></a>
## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

