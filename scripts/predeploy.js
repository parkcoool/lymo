// 🔽 모듈 import 방식을 ESM으로 변경
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 🔽 ESM에서 __dirname을 사용하기 위한 코드
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 Starting predeploy script for Firebase Functions...");

// --- 경로 설정 ---
const rootPath = path.resolve(__dirname, ".."); // 이제 이 코드가 정상 동작합니다.
const schemasPath = path.join(rootPath, "packages", "schemas");
const functionsPath = path.join(rootPath, "apps", "functions");
const functionsPackageJsonPath = path.join(functionsPath, "package.json");

try {
  // 1. @lymo/schemas 패키지를 .tgz 파일로 압축합니다.
  console.log(`📦 Packing @lymo/schemas at ${schemasPath}...`);
  const packedFileName = execSync("npm pack", { cwd: schemasPath })
    .toString()
    .trim();
  const packedFilePath = path.join(schemasPath, packedFileName);
  console.log(`✅ Packed successfully: ${packedFileName}`);

  // 2. 압축된 파일을 @lymo/functions 폴더로 이동합니다.
  const destPath = path.join(functionsPath, packedFileName);
  fs.renameSync(packedFilePath, destPath);
  console.log(`🚚 Moved ${packedFileName} to ${functionsPath}`);

  // 3. @lymo/functions의 package.json을 수정합니다.
  console.log(`✏️  Modifying ${functionsPackageJsonPath}...`);
  const packageJson = JSON.parse(
    fs.readFileSync(functionsPackageJsonPath, "utf8")
  );

  packageJson.originalDependencies = packageJson.originalDependencies || {
    ...packageJson.dependencies,
  };
  packageJson.dependencies["@lymo/schemas"] = `file:./${packedFileName}`;

  fs.writeFileSync(
    functionsPackageJsonPath,
    JSON.stringify(packageJson, null, 2)
  );
  console.log("✅ package.json modified for deployment.");
  console.log("✨ Predeploy script finished successfully!");
} catch (error) {
  console.error("🔥 An error occurred during the predeploy script:");
  console.error(error);
  process.exit(1);
}
