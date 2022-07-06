import crypto from "crypto";
const algorithm = "aes-256-cbc";
const password = "your_key_here";
const iv = "your_iv_here";

const text = "your_text_here";

export function encrypt(text: string) {
  var cipher = crypto.createCipher(algorithm, password);
  var crypted = cipher.update(text, "utf8", "base64");
  crypted += cipher.final("base64");
  return base64ToText(crypted);
}

export function decrypt(text: string) {
  var decipher = crypto.createDecipher(algorithm, password);
  var dec = decipher.update(textToBase64(text), "base64", "utf8");
  dec += decipher.final("utf8");
  return dec;
}

export function base64ToText(base64: string) {
  return base64.replace(/\//g, "-");
}

export function textToBase64(text: string) {
  return text.replace(/-/g, "/");
}

const crypted = encrypt(text);
const decrypted = decrypt(text);
console.log(crypted, decrypted);