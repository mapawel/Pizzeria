import { ValidatorError } from './Validator.exception';

export const isPlus = (
  number: number,
  validatedNumberName: string
): boolean => {
  if (number <= 0)
    throw new ValidatorError(
      `${validatedNumberName} has to be grater than zero.`,
      {
        number,
      }
    );
  return true;
};
