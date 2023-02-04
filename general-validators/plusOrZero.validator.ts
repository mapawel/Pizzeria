import { ValidatorError } from './Validator.exception';

export const isPlusOrZero = (
  number: number,
  validatedNumberName: string
): boolean => {
  if (number < 0)
    throw new ValidatorError(
      `${validatedNumberName} has to be grater or equal zero.`,
      {
        number,
      }
    );
  return true;
};
