# ViDoc: An Interactive Documentation Extension for Visual Studio Code

![ViDoc](https://github.com/bubblegumsoldier/vidoc/raw/main/vidoc.png "ViDoc")

![:vidoc 0c8c60c6-bc0b-4841-aaa6-c0680be600d6.mp4](https://vidoc.s3.eu-central-1.amazonaws.com/0c8c60c6-bc0b-4841-aaa6-c0680be600d6.mp4)
[:vidoc 0c8c60c6-bc0b-4841-aaa6-c0680be600d6.mp4](https://vidoc.s3.eu-central-1.amazonaws.com/0c8c60c6-bc0b-4841-aaa6-c0680be600d6.mp4)

## Vision Statement

In modern software development, clear and comprehensive documentation is key. ViDoc is a VS Code extension that aims to revolutionize how documentation is done by incorporating audio-visual elements directly into your code. The extension enables users to record their screen, providing real-time context and commentary on their actions. The result? Documentation that feels like a pair-programming session.

ViDoc aims to promote collaboration, enhance code comprehension, and simplify the documentation process by providing an intuitive, engaging and interactive way to explain complex code snippets. Rather than just reading about how a piece of code works, ViDoc allows you to show, tell, and share in a more dynamic way.

## How to Use ViDoc

Using ViDoc is as easy as 1-2-3:

1. **Install the ffmpeg globally** - Please [install FFMPEG](https://ffmpeg.org/download.html) and make sure its on your path.
2. **Install the extension** - Find ViDoc in the VS Code extension marketplace and install it.
3. **Start Recording** - Once installed, you'll find a "Start Recording" button at the bottom right of your VS Code interface. Click on this button, select your preferred microphone, and the recording will begin immediately.

| :exclamation:  At the moment you are supposed to commit the generated files and comments!   |
|-----------------------------------------|


Each recording comment comes with a hover tooltip, enabling anyone with the ViDoc extension to instantly preview your video documentation.

## Next milestones

1. We want to fully support Mac
2. Release the vscode extension on the Extension Marketplace
3. Create an automated release pipeline for new versions
4. Refactor `vidoc/drivers/generate/screenRecording`
5. Introduce different file storage mechanisms like AWS.

## Contribution Guidelines

`:vidoc 55032cb8-c95a-4048-b1b9-8db61c4a9fb5.mp4`

https://github.com/bubblegumsoldier/vidoc/assets/3788628/3233b0f5-a669-4b6f-87f7-c12a47572132


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
