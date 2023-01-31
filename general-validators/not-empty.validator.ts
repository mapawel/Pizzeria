import { ValidatorError } from './Validator.exception';

export const notEmpty = <T>(
  toValidate: T | undefined,
  validatedParamName: string
): boolean | ValidatorError => {
  if (!toValidate)
    return new ValidatorError(`${validatedParamName} is required.`);
  return true;
};
