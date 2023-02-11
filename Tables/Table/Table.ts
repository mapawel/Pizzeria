import { notGreaterThan } from '../../general-validators/not-greater-than.validator';
import { isPlusOrZero } from '../../general-validators/plus-or-zero.validator';
import { isPlus } from '../../general-validators/plus.validator';
import { v4 as uuidv4 } from 'uuid';

export class Table {
  readonly id: string;
  readonly name: string;
  readonly sits: number;
  readonly sitsAvailable: number;
  public constructor(
    name: string,
    sits: number,
    sitsAvailable: number,
    readonly isAvailable: boolean
  ) {
    isPlus(sits, 'Sits');
    isPlusOrZero(sitsAvailable, 'SitsAvailable');
    notGreaterThan(sitsAvailable, sits, 'SitsAvailable');
    this.id = uuidv4();
    this.name = name.trim().toLowerCase();
    this.sits = sits;
    this.sitsAvailable = sitsAvailable;
  }
}
