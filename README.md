# ViDoc: An Interactive Documentation Extension for Visual Studio Code

![ViDoc](https://github.com/bubblegumsoldier/vidoc/raw/main/vidoc.png "ViDoc")

## Simple introduction video

<img src="https://github.com/bubblegumsoldier/vidoc/assets/3788628/27280d02-a6ea-4180-99ec-f7b174d4ec6f" alt="CLICK HERE for Vidoc Example Usage in Loom" />

[CLICK HERE for Vidoc Example Usage in Loom](https://www.loom.com/share/ecb3abd8e7dc4b77b224b96b1e8e56e8?sid=ea4755ac-b948-4562-9876-0170f77c4427)

<img src="[https://github.com/bubblegumsoldier/vidoc/assets/3788628/27280d02-a6ea-4180-99ec-f7b174d4ec6f](https://github.com/bubblegumsoldier/vidoc/assets/3788628/2e55a1a0-f892-409e-a250-e6e1938bb7ea)" alt="CLICK HERE for Vidoc Example Usage in Loom" />

[CLICK HERE for Vidoc Advanced Configuration in Loom](https://www.loom.com/share/ee831812754c487bbac3d072dd8c14fe?sid=73af1439-9825-4be0-bc0b-5349bc5972c5)

## Vision Statement

In modern software development, clear and comprehensive documentation is key. ViDoc is a VS Code extension that aims to revolutionize how documentation is done by incorporating audio-visual elements directly into your code. The extension enables users to record their screen, providing real-time context and commentary on their actions. The result? Documentation that feels like a pair-programming session.

ViDoc aims to promote collaboration, enhance code comprehension, and simplify the documentation process by providing an intuitive, engaging and interactive way to explain complex code snippets. Rather than just reading about how a piece of code works, ViDoc allows you to show, tell, and share in a more dynamic way.

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
    "savingStrategy": {
        "type": "remote",
        "s3": {
            "bucketName": "${AWS_BUCKET}",
            "region": "${AWS_REGION}",
            "accessKeyId": "${ACCESS_KEY_AWS}",
            "secretAccessKey": "${SECRET_KEY_AWS}"
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

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
