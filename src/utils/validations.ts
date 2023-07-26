export const validateEmail = (value: string) => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi;

  return re.test(String(value).toLowerCase());
};

export const validatePassword = (value: string | undefined) => {
  if (!!!value) return false;
  const lengthIsValid = value.length >= 8;
  const hasUpperCase = value.length && value.toLowerCase() !== value;
  const hasNumber = /\d/.test(value);
  const hasSpecialSymbol = /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/.test(value);
  const passwordIsValid =
    lengthIsValid && hasUpperCase && hasNumber && hasSpecialSymbol;
  return !!passwordIsValid;
};
