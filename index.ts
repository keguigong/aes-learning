import { promisify } from "util";
import { exec as childExec } from "child_process";
import fs from "fs";
import { encrypt, decrypt } from "./crypto";

const exec = promisify(childExec);
const key = "your_key_here";

const inDir = "your_input_directory";
const outDir = "your_output_directory";

async function opensslEncrypt(inPath: string, outPath: string) {
  const { stdout, stderr } = await exec(
    `openssl enc -e -aes-256-cbc -k "${key}" -in "${inPath}" -out "${outPath}"`
  );
  return stdout;
}

async function openssldecrypt(inPath: string, outPath: string) {
  const { stdout, stderr } = await exec(
    `openssl enc -aes-256-cbc -d -md md5 -k "${key}" -in "${inPath}" -out "${outPath}"`
  );
  return stdout;
}

function walkSync(
  dir: string,
  callback: (
    dir: string,
    file: any,
    isDecrypt?: boolean,
    modifiedName?: string
  ) => void,
  isDecrypt = false
) {
  const files = fs.readdirSync(dir);
  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];
    const filePath = dir + "/" + fileName;
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      callback(dir, fileName, isDecrypt);
    } else if (stat.isDirectory()) {
      // walkSync(filePath, callback);
    }
  }
}

async function encryptFile(
  path: string,
  fileName: string,
  isDecrypt: boolean = false,
  modifiedName: string = ""
) {
  const oldPath = path + "/" + fileName;

  let newFileName;
  if (isDecrypt) newFileName = decrypt(modifiedName ? modifiedName : fileName);
  else newFileName = encrypt(modifiedName ? modifiedName : fileName);

  const newPath = outDir + "/" + newFileName;
  if (isDecrypt) await openssldecrypt(oldPath, newPath);
  else await opensslEncrypt(oldPath, newPath);

  console.log(oldPath, newPath);
}

walkSync(inDir, encryptFile, true);