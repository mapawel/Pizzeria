import { Table } from '../Table/Table';
import { TableDTO } from './Table.dto';

export class TableDTOMapper {
  public static mapToDTO(table: Table): TableDTO {
    return {
      id: table.id,
      name: table.name,
      sits: table.sits,
      sitsAvailable: table.sitsAvailable,
      isAvailable: table.isAvailable,
    };
  }
}
