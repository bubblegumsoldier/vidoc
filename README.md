# ViDoc: An Interactive Documentation Extension for Visual Studio Code

![1](https://github.com/bubblegumsoldier/vidoc/assets/3788628/2bf5674a-5b1b-4422-b6a7-af4f2be6a30b)

![2](https://github.com/bubblegumsoldier/vidoc/assets/3788628/5dc2060b-fc22-4fd3-88d9-f7037faff674)

![3](https://github.com/bubblegumsoldier/vidoc/assets/3788628/7793dd69-d2d4-49aa-b683-67793033b30b)


## Disclaimer

**UNTIL NOW RECORDING VIDOCS WILL ONLY WORK ON WINDOWS!**
**WATCHING VIDOCS OF OTHER DEVELOPERS IS POSSIBLE ON ALL DEVICES!**
**MAC SUPPORT WILL FOLLOW SHORTLY!**

**FEEL FREE TO OPEN A MERGE REQUEST IF YOU WANT TO ADD MAC OR LINUX SUPPORT**

## Simple introduction video

[CLICK HERE for Vidoc Example Usage in Loom](https://www.loom.com/share/ecb3abd8e7dc4b77b224b96b1e8e56e8?sid=ea4755ac-b948-4562-9876-0170f77c4427)

[CLICK HERE for Vidoc Advanced Configuration in Loom](https://www.loom.com/share/ee831812754c487bbac3d072dd8c14fe?sid=73af1439-9825-4be0-bc0b-5349bc5972c5)

## Vision Statement

In modern software development, clear and comprehensive documentation is key. ViDoc is a VS Code extension that aims to revolutionize how documentation is done by incorporating audio-visual elements directly into your code. The extension enables users to record their screen, providing real-time context and commentary on their actions. The result? Documentation that feels like a pair-programming session.

ViDoc aims to promote collaboration, enhance code comprehension, and simplify the documentation process by providing an intuitive, engaging and interactive way to explain complex code snippets. Rather than just reading about how a piece of code works, ViDoc allows you to show, tell, and share in a more dynamic way.

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

## Storing video recordings within the repository

The easiest way to try out the extension is to store the files locally inside the repository. No configuration file is needed in order to achieve that behaviour. However, this is not recommended for larger projects as it can substantially increase the repository size and pushing videos as well as pulling videos can be a pain.

## Enabling AWS Video Upload for Your VSCode Extension

This guide walks you through setting up AWS S3 video upload for your VSCode extension. You can also configure it to work with other S3-compatible providers like DigitalOcean.

### Prerequisites

- AWS Account with access to S3 services.
- VSCode extension installed.

### Configuration Files

You need to create two files in the root directory of your project:

1. `.vidocconf.json`
2. `.vidocsecrets`

**Important**: Make sure to add `.vidocsecrets` to your `.gitignore` file as it will contain sensitive information that can be used to upload data to your AWS S3 buckets (if provided). You can share that file with other contributors via a different channel if necessary, so that every contributor can upload documentation videos, but it is not recommended to ever commit the file for security reasons.

#### .vidocconf.json

This file contains the configuration details for saving videos and performing post-processing operations.

Example `.vidocconf.json`:

```json
{
    "$schema": "https://raw.githubusercontent.com/bubblegumsoldier/vidoc/main/config-schema.json",
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

#### .vidocsecrets

This file will store your AWS secret information. Replace the placeholders with your actual AWS information. The placeholders correspond to the variables you have referenced in your `vidocconf.json`.

Example .vidocsecrets:

```
ACCESS_KEY_AWS=<Your access key>
SECRET_KEY_AWS=<Your secret key>
AWS_BUCKET=<Your bucket name>
AWS_REGION=eu-central-1
```

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


#### Removing unused videos

Let's say you have just pressed record and recorded a video that was not on the standard of quality you would like. So you remove the newly generated vidoc metadata file. But the file has already been uploaded. This can happen frequently and your S3 Bucket fills up over time with unreferenced videos. To "garbage-collect" these files you can run the command `[Vidoc] Remove unreferenced Remote Files`. You will need to have an S3 user with rights to list and delete files in order to perform this command. If you don't want to reuse the normal uploading credentials you can enter an `s3Administration` key into `savingStrategy` next to your existing `s3` key and fill in the same values just for the administration account. That way you can provide others with only the upload credentials and not with the administration credentials.

The command will find in the bucket all files for which there is no vidoc metadata file in this repository under `./.vidoc`. It will then ask you if you want to delete these files. 

**Caution!** If you are using the same bucket for another repository then it would remove the videos that are referenced there. Create a new bucket for each repository!

**Caution 2!** Remember that Vidoc can only see what Vidocs are on your branch. If a colleague has added a Vidoc in another branch you might just be removing it for him.

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

## Introduction Vidoc Code

![:vidoc 014151df-545b-4ff5-a305-12de6c036c16.mp4](https://vidoc.s3.eu-central-1.amazonaws.com/014151df-545b-4ff5-a305-12de6c036c16.mp4)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
