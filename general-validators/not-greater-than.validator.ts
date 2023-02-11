import { ValidatorError } from './Validator.exception';

export const notGreaterThan = (
  toBeNotGreather: number,
  thanThisNumber: number,
  validatedNumberName: string
): boolean => {
  if (toBeNotGreather > thanThisNumber)
    throw new ValidatorError(`${validatedNumberName} has to be smaller.`, {
      number: toBeNotGreather,
    });
  return true;
};
