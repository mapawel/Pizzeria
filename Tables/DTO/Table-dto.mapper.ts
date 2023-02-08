import { Table } from '../Table/Table';
import { TableWithIdDTO } from './Table-with-id.dto';

export class TableDTOMapper {
  public static mapToResDTO(table: Table): TableWithIdDTO {
    return {
      id: table.id,
      name: table.name,
      sits: table.sits,
      sitsAvailable: table.sitsAvailable,
      isAvailable: table.isAvailable,
    };
  }
}
