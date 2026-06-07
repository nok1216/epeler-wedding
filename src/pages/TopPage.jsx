import { useState } from 'react'
import Calendar from '../components/Calendar'
import LineButton from '../components/LineButton'
import { useSchedule, STATUS_LABEL } from '../hooks/useSchedule'
import styles from './TopPage.module.css'

function getLegendItems() {
  return [
    { status: 'available', label: '◎ 空きあり', color: 'var(--color-available)' },
    { status: 'partial',   label: '△ 要相談',   color: 'var(--color-partial)' },
    { status: 'full',      label: '× 予約済み', color: 'var(--color-full)' },
  ]
}

export default function TopPage() {
  const { data } = useSchedule()
  const [selectedDate, setSelectedDate] = useState(null)

  const now = new Date()
  const thisYear = now.getFullYear()
  const thisMonth = now.getMonth()

  // 今月から12月までの月リストを生成
  const months = []
  for (let m = thisMonth; m <= 11; m++) {
    months.push({ year: thisYear, month: m })
  }

  function handleDayClick(key, day, entry) {
    if (!entry) return
    setSelectedDate(key)
  }

  const selectedEntry = selectedDate ? data[selectedDate] : null
  const selectedLabel = selectedDate
    ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('ja-JP', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
      })
    : null

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <p className={styles.heroSub}>availability calendar</p>
        <h1 className={styles.heroTitle}>空き日程のご確認</h1>
      </section>

      <section className={styles.legend}>
        {getLegendItems().map(item => (
          <div key={item.status} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ color: item.color }}>{item.label.slice(0,1)}</span>
            <span className={styles.legendText}>{item.label.slice(2)}</span>
          </div>
        ))}
      </section>

      <section className={styles.calendars}>
        {months.map(({ year, month }) => (
          <Calendar
            key={`${year}-${month}`}
            year={year}
            month={month}
            scheduleData={data}
            onDayClick={handleDayClick}
          />
        ))}
      </section>

      {selectedDate && selectedEntry && (
        <div className={styles.selectedCard}>
          <p className={styles.selectedLabel}>{selectedLabel}</p>
          <p className={styles.selectedStatus} data-status={selectedEntry.status}>
            {STATUS_LABEL[selectedEntry.status]}
          </p>
          {selectedEntry.memo && (
            <p className={styles.selectedMemo}>{selectedEntry.memo}</p>
          )}
        </div>
      )}

      <section className={styles.lineSection}>
        <p className={styles.lineNote}>
          空き日程は目安です。撮影内容・場所・ヘアメイクの有無によって
          ご案内可能時間が変わるため、正式な空き状況は
          LINEにてご確認ください。
        </p>
        <LineButton
          label="この日程で相談する"
          selectedDate={selectedLabel}
        />
      </section>
    </main>
  )
}
