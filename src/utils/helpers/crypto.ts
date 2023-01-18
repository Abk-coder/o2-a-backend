import { createCipheriv, createDecipheriv, createHash } from 'crypto';

export async function encrypt(text: string): Promise<string> {
  const passwordHash = await getCryptoHash();
  const iv = Buffer.alloc(16);
  const cipher = createCipheriv(process.env.CRYPT_ALGORITHM, passwordHash, iv);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

export async function decrypt(text) {
  const iv = Buffer.alloc(16);
  const key = await getCryptoHash();
  const decipher = createDecipheriv(process.env.CRYPT_ALGORITHM, key, iv);
  let decryptedText = decipher.update(text, 'hex', 'utf8');
  decryptedText += decipher.final('utf8');
  return decryptedText;
}

async function getCryptoHash() {
  return createHash('md5')
    .update(process.env.CRYPT_PASSWORD, 'utf-8')
    .digest('hex')
    .toUpperCase();
}

export async function cryptUserData(user: any) {
  user.firstname =
    user.firstname && user.firstname.trim() !== ''
      ? await encrypt(user.firstname.trim())
      : user.firstname;
  user.lastname =
    user.lastname && user.lastname.trim() !== ''
      ? await encrypt(user.lastname.trim())
      : user.lastname;
  user.email =
    user.email && user.email.trim() !== ''
      ? await encrypt(user.email.trim())
      : user.email;
  if (user.phoneNumber) user.phoneNumber = await encrypt(user.phoneNumber);
  return user;
}

export async function decryptUserData(user: any) {
  user.email =
    user.email && user.email.trim() !== ''
      ? await decrypt(user.email)
      : user.email;
  user.firstname =
    user.firstname && user.firstname.trim() !== ''
      ? await decrypt(user.firstname)
      : user.firstname;
  user.lastname =
    user.lastname && user.lastname.trim() !== ''
      ? await decrypt(user.lastname)
      : user.lastname;
  user.phoneNumber = user.phoneNumber
    ? await decrypt(user.phoneNumber)
    : user.phoneNumber;
  return user;
}
