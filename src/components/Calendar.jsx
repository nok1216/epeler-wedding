import styles from './Calendar.module.css'
import { STATUS, STATUS_LABEL } from '../hooks/useSchedule'

const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土']

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay()
}

function toKey(year, month, day) {
  const m = String(month + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${year}-${m}-${d}`
}

function StatusBadge({ status }) {
  if (!status) return null
  const cls = {
    [STATUS.AVAILABLE]: styles.available,
    [STATUS.PARTIAL]: styles.partial,
    [STATUS.FULL]: styles.full,
  }[status] ?? ''

  const short = {
    [STATUS.AVAILABLE]: '◎',
    [STATUS.PARTIAL]: '△',
    [STATUS.FULL]: '×',
  }[status] ?? ''

  return <span className={`${styles.badge} ${cls}`}>{short}</span>
}

export default function Calendar({ year, month, scheduleData, onDayClick, selectedKey }) {
  const daysInMonth = getDaysInMonth(year, month)
  const firstDow = getFirstDayOfWeek(year, month)
  const today = new Date()

  const cells = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const monthLabel = new Date(year, month).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <div className={styles.wrapper}>
      <div className={styles.monthLabel}>{monthLabel}</div>
      <div className={styles.grid}>
        {DAY_LABELS.map((l, i) => (
          <div key={l} className={`${styles.dayHeader} ${i === 0 ? styles.sun : i === 6 ? styles.sat : ''}`}>
            {l}
          </div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />
          const key = toKey(year, month, day)
          const entry = scheduleData[key]
          const dow = (firstDow + day - 1) % 7
          const isPast = new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate())

          return (
            <div
              key={key}
              className={`
                ${styles.cell}
                ${entry ? styles[entry.status] : ''}
                ${isPast ? styles.past : ''}
                ${onDayClick ? styles.clickable : ''}
                ${dow === 0 ? styles.sun : dow === 6 ? styles.sat : ''}
                ${selectedKey === key ? styles.selected : ''}
              `}
              onClick={() => onDayClick?.(key, day, entry)}
            >
              <span className={styles.dayNum}>{day}</span>
              {entry && <StatusBadge status={entry.status} />}
              {entry?.memo && <span className={styles.memo}>{entry.memo}</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
