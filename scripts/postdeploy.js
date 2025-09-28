// 🔽 모듈 import 방식을 ESM으로 변경
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

// 🔽 ESM에서 __dirname을 사용하기 위한 코드
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🧹 Starting postdeploy cleanup script...");

// --- 경로 설정 ---
const rootPath = path.resolve(__dirname, "..");
const functionsPath = path.join(rootPath, "apps", "functions");
const functionsPackageJsonPath = path.join(functionsPath, "package.json");

try {
  // 1. @lymo/functions의 package.json을 원래대로 복구합니다.
  const packageJson = JSON.parse(
    fs.readFileSync(functionsPackageJsonPath, "utf8")
  );

  if (packageJson.originalDependencies) {
    packageJson.dependencies = packageJson.originalDependencies;
    delete packageJson.originalDependencies;
    fs.writeFileSync(
      functionsPackageJsonPath,
      JSON.stringify(packageJson, null, 2)
    );
    console.log(`✅ Restored dependencies in ${functionsPackageJsonPath}`);
  } else {
    console.log("No originalDependencies found, trying to restore with git...");
    execSync(`git restore ${functionsPackageJsonPath}`);
    console.log(`✅ Restored ${functionsPackageJsonPath} using git.`);
  }

  // 2. @lymo/functions 폴더에 생성되었던 .tgz 파일을 삭제합니다.
  const files = fs.readdirSync(functionsPath);
  const tgzFile = files.find(
    (file) => file.startsWith("lymo-schemas-") && file.endsWith(".tgz")
  );

  if (tgzFile) {
    fs.unlinkSync(path.join(functionsPath, tgzFile));
    console.log(`🗑️  Deleted temporary package file: ${tgzFile}`);
  }

  console.log("✨ Postdeploy cleanup finished successfully!");
} catch (error) {
  console.error("🔥 An error occurred during the postdeploy script:");
  console.error(error);
}
