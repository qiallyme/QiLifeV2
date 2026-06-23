import type { QiEntityDefinition, QiRecord } from "../types";
import { formatValue, getRecordValue } from "../utils/recordValues";

interface EntityTableProps {
  entity: QiEntityDefinition;
  records: QiRecord[];
  onEdit: (record: QiRecord) => void;
  onArchive: (record: QiRecord) => void;
}

export function EntityTable({ entity, records, onEdit, onArchive }: EntityTableProps) {
  return (
    <div className="qilife-table-wrap">
      <table className="qilife-table">
        <thead>
          <tr>
            {entity.columns.map((column) => (
              <th key={column}>{entity.fields.find((field) => field.key === column)?.label || column}</th>
            ))}
            <th className="qilife-action-col">Actions</th>
          </tr>
        </thead>

        <tbody>
          {records.map((record) => (
            <tr 
              key={record.id} 
              onClick={() => onEdit(record)} 
              style={{ cursor: "pointer" }}
            >
              {entity.columns.map((column, index) => {
                const field = entity.fields.find((candidate) => candidate.key === column);
                const value = getRecordValue(record, column);
                return (
                  <td key={column} className={index === 0 ? "qilife-primary-cell" : ""}>
                    {formatValue(value, field)}
                  </td>
                );
              })}

              <td className="qilife-row-actions">
                <button 
                  className="qilife-mini-btn" 
                  type="button" 
                  onClick={(e) => { e.stopPropagation(); onEdit(record); }}
                >
                  Edit
                </button>
                <button 
                  className="qilife-mini-btn danger" 
                  type="button" 
                  onClick={(e) => { e.stopPropagation(); onArchive(record); }}
                >
                  Archive
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
