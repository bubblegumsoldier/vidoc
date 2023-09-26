plugins {
    id("java")
    id("org.jetbrains.kotlin.jvm") version "1.9.0"
    id("org.jetbrains.intellij") version "1.15.0"
}
dependencies {
    implementation("org.apache.commons:commons-text:1.9") // Add this line for Apache Commons Text library
    // Other dependencies can also be listed here
}

group = "com.hmdevconsulting"
version = "1.0"

repositories {
    mavenCentral()
}

fun properties(key: String) = project.findProperty(key).toString()
val depsPyVersion: String = properties("depsPyVersion")

// Configure Gradle IntelliJ Plugin
// Read more: https://plugins.jetbrains.com/docs/intellij/tools-gradle-intellij-plugin.html
intellij {
    pluginName.set("Vidoc")
    version.set("LATEST-EAP-SNAPSHOT")
    type.set("IU") // Target IDE Platform

    plugins.set(listOf(
    ))
}

tasks {
    // Set the JVM compatibility versions
    withType<JavaCompile> {
        sourceCompatibility = "17"
        targetCompatibility = "17"
    }
    withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
        kotlinOptions.jvmTarget = "17"
    }

    wrapper {
        gradleVersion = "8.2.1"
    }

    runPluginVerifier {
        ideVersions.set("2022.1, 2023.2".split(',').map { it.trim() }.toList())
    }

    patchPluginXml {
        sinceBuild.set("222")
        untilBuild.set("233.*")
    }

    signPlugin {
        certificateChain.set(System.getenv("INTELLIJ_CERTIFICATE_CHAIN"))
        privateKey.set(System.getenv("INTELLIJ_PRIVATE_KEY"))
        password.set(System.getenv("INTELLIJ_PRIVATE_KEY_PASSWORD"))
    }

    publishPlugin {
        token.set(System.getenv("PUBLISH_TOKEN"))
    }
}
