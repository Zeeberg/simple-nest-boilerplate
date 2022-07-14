import type { PipeTransform } from '@nestjs/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { set } from 'lodash';
// eslint-disable-next-line import/no-namespace
import * as Yup from 'yup';

export type ValidationError = Record<string, string>;

export const yupToValidationErrors = (
  yupError: Yup.ValidationError,
): ValidationError => {
  let errors = {};

  if (yupError?.inner?.length === 0 && yupError?.path) {
    return set(errors, yupError.path, yupError.message);
  }

  for (const error of yupError.inner) {
    if (error.path) {
      if ((errors as Error[])[error.path]) {
        continue;
      }

      errors = set(errors, error.path, error.message);
    }
  }

  return errors;
};

@Injectable()
export class YupValidationPipe<T> implements PipeTransform {
  constructor(private readonly schema: Yup.SchemaOf<T>) {}

  async transform(value: unknown): Promise<unknown> {
    try {
      return await this.schema.validate(value);
    } catch (error) {
      const validationErrors = yupToValidationErrors(
        error as Yup.ValidationError,
      );

      throw new BadRequestException({ validationErrors }, 'Validation failed');
    }
  }
}
