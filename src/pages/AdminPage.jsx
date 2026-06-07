import { useState } from 'react'
import Calendar from '../components/Calendar'
import { useSchedule, STATUS, STATUS_LABEL } from '../hooks/useSchedule'
import styles from './AdminPage.module.css'

const STATUS_OPTIONS = [
  { value: STATUS.AVAILABLE, label: '◎ 空きあり' },
  { value: STATUS.PARTIAL,   label: '△ 午後のみ / 要相談' },
  { value: STATUS.FULL,      label: '× 予約済み' },
]

function formatDisplay(dateKey) {
  if (!dateKey) return ''
  return new Date(dateKey + 'T00:00:00').toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
  })
}

function EditPanel({ dateKey, entry, onSave, onClear }) {
  const [status, setStatus] = useState(entry?.status ?? STATUS.AVAILABLE)
  const [memo, setMemo] = useState(entry?.memo ?? '')
  const [saved, setSaved] = useState(false)

  // entryが変わったら（別の日付を選んだら）フォームをリセット
  const entryKey = dateKey + (entry?.status ?? '') + (entry?.memo ?? '')

  function handleSave() {
    onSave(dateKey, status, memo)
    setSaved(true)
  }

  function handleClear() {
    onClear(dateKey)
  }

  return (
    <div className={styles.panel} key={entryKey}>
      <p className={styles.panelDate}>{formatDisplay(dateKey)}</p>

      <div className={styles.field}>
        <label className={styles.label}>ステータス</label>
        <div className={styles.statusGroup}>
          {STATUS_OPTIONS.map(opt => (
            <label
              key={opt.value}
              className={`${styles.radio} ${status === opt.value ? styles.radioActive : ''}`}
            >
              <input
                type="radio"
                name={`status-${dateKey}`}
                value={opt.value}
                checked={status === opt.value}
                onChange={() => { setStatus(opt.value); setSaved(false) }}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={`memo-${dateKey}`}>
          メモ（お客様に表示）
        </label>
        <textarea
          id={`memo-${dateKey}`}
          className={styles.textarea}
          value={memo}
          onChange={e => { setMemo(e.target.value); setSaved(false) }}
          placeholder="例：午後14時以降は相談可"
          rows={2}
        />
      </div>

      <div className={styles.actions}>
        <button className={styles.btnSave} onClick={handleSave}>
          {saved ? '保存しました ✓' : '保存する'}
        </button>
        <button className={styles.btnClear} onClick={handleClear}>
          クリア
        </button>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const { data, setDay, removeDay } = useSchedule()
  const [selectedKey, setSelectedKey] = useState(null)

  const now = new Date()
  const thisYear = now.getFullYear()
  const thisMonth = now.getMonth()

  const months = []
  for (let m = thisMonth; m <= 11; m++) {
    months.push({ year: thisYear, month: m })
  }

  function handleDayClick(key, _day, entry) {
    setSelectedKey(prev => prev === key ? null : key)
  }

  // 選択中の日付がどの月に属するか
  const selectedMonth = selectedKey
    ? parseInt(selectedKey.slice(5, 7)) - 1
    : null

  return (
    <main className={styles.main}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>スケジュール管理</h1>
        <p className={styles.sub}>日付をタップして編集</p>
      </div>

      <div className={styles.monthList}>
        {months.map(({ year, month }) => {
          const showPanel = selectedKey !== null && selectedMonth === month
          return (
            <div key={`${year}-${month}`} className={styles.monthBlock}>
              {/* PC: カレンダーと編集パネルを横並び / スマホ: 縦並び */}
              <div className={`${styles.monthRow} ${showPanel ? styles.monthRowActive : ''}`}>
                <div className={styles.calendarCol}>
                  <Calendar
                    year={year}
                    month={month}
                    scheduleData={data}
                    onDayClick={handleDayClick}
                    selectedKey={selectedKey}
                  />
                </div>
                {showPanel && (
                  <div className={styles.panelCol}>
                    <EditPanel
                      key={selectedKey}
                      dateKey={selectedKey}
                      entry={data[selectedKey]}
                      onSave={(key, status, memo) => setDay(key, status, memo)}
                      onClear={(key) => { removeDay(key); setSelectedKey(null) }}
                    />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
