import { Table } from '../Table/Table';
import { TableDTO } from './Table.dto';

export class TableDTOMapper {
  public static mapToDTO(table: Table): TableDTO {
    return {
      nameId: table.nameId,
      sits: table.sits,
      sitsAvailable: table.sitsAvailable,
      isAvailable: table.isAvailable,
    };
  }
}
