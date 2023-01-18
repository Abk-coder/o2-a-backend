import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string, salt: string) => {
  return bcrypt.hash(password, salt);
};

export const generateSalt = async () => {
  return await bcrypt.genSalt(10);
}
export const validatePassword = async (
  plainPassword: string,
  hashedPassword: string,
) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

