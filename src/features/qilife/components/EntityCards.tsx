import type { QiEntityDefinition, QiRecord } from "../types";
import { formatValue, getRecordValue, recordTitleForEntity } from "../utils/recordValues";

interface EntityCardsProps {
  entity: QiEntityDefinition;
  records: QiRecord[];
  onEdit: (record: QiRecord) => void;
  onArchive: (record: QiRecord) => void;
}

export function EntityCards({ entity, records, onEdit, onArchive }: EntityCardsProps) {
  return (
    <div className="qilife-card-grid">
      {records.map((record) => (
        <article 
          key={record.id} 
          className="qilife-card entity-card"
          onClick={() => onEdit(record)}
          style={{ cursor: "pointer" }}
        >
          <div className="qilife-card-icon">{entity.icon}</div>
          <div className="qilife-card-title">{recordTitleForEntity(record, entity)}</div>

          <dl className="qilife-card-fields">
            {entity.columns
              .filter((column) => column !== entity.titleField)
              .slice(0, 4)
              .map((column) => {
                const field = entity.fields.find((candidate) => candidate.key === column);
                return (
                  <div key={column}>
                    <dt>{field?.label || column}</dt>
                    <dd>{formatValue(getRecordValue(record, column), field)}</dd>
                  </div>
                );
              })}
          </dl>

          <div className="qilife-card-actions">
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
          </div>
        </article>
      ))}
    </div>
  );
}
