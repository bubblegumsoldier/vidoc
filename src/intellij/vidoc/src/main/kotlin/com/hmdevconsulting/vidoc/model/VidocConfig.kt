package com.hmdevconsulting.vidoc.model

typealias AllowedFileFormats = String

data class Config(
    val savingStrategy: SavingStrategy,
    val recordingOptions: RecordingOptions
)

data class SavingStrategy(
    val type: String = "local",
    val folder: String? = ".vidoc",
    val s3: SavingInformationAWSS3? = null,
    val s3Administration: SavingInformationAWSS3? = null,
)

data class RecordingOptions(
    val fileFormat: AllowedFileFormats? = null,
    val postProcessingOptions: PostprocessingOptions? = null
)

data class PostprocessingOptions(
    val speechToText: SpeechToTextOptions? = null
)

data class SpeechToTextOptions(
    var enabled: Boolean = false,
    var type: String = "aws-transcribe",
    val awsTranscribe: AWSTranscribeSpeechToTextOptions? = null
)

data class AWSTranscribeSpeechToTextOptions(
    val accessKeyId: String,
    val secretAccessKey: String,
    val region: String,
    val bucketName: String
)

data class SavingInformationAWSS3(
    val bucketName: String,
    val region: String,
    val accessKeyId: String,
    val secretAccessKey: String,
    val endpoint: String? = null,
    val s3ForcePathStyle: Boolean? = null,
    val alternativeRootPath: String? = null
)
