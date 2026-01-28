/* eslint-disable @typescript-eslint/no-require-imports */
const { withAndroidManifest, withDangerousMod, AndroidConfig } = require("@expo/config-plugins");
const path = require("path");
const fs = require("fs");

const withMediaHeadlessTask = (config) => {
  // 1. AndroidManifest.xml에 서비스 등록
  config = withAndroidManifest(config, async (config) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);

    if (!mainApplication.service) {
      mainApplication.service = [];
    }

    const serviceExists = mainApplication.service.some(
      (service) => service.$?.["android:name"] === "com.parkcool.lymoapp.MediaHeadlessTaskService"
    );

    if (!serviceExists) {
      mainApplication.service.push({
        $: {
          "android:name": "com.parkcool.lymoapp.MediaHeadlessTaskService",
          "android:exported": "false",
        },
      });
    }

    return config;
  });

  // 2. Kotlin 파일 생성
  config = withDangerousMod(config, [
    "android",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const androidDir = path.join(
        projectRoot,
        "android",
        "app",
        "src",
        "main",
        "java",
        "com",
        "parkcool",
        "lymoapp"
      );

      // 템플릿 파일 읽기
      const templatePath = path.join(
        __dirname,
        "plugin",
        "templates",
        "MediaHeadlessTaskService.kt"
      );
      const templateContent = fs.readFileSync(templatePath, "utf-8");

      // 디렉토리 생성
      fs.mkdirSync(androidDir, { recursive: true });

      // Kotlin 파일 작성
      const filePath = path.join(androidDir, "MediaHeadlessTaskService.kt");
      fs.writeFileSync(filePath, templateContent);

      return config;
    },
  ]);

  return config;
};

module.exports = withMediaHeadlessTask;
