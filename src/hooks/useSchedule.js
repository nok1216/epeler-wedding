import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'epeler_schedule_v1'

// ステータス定義 — ここを変えるだけでGoogleカレンダー連携に差し替え可能
export const STATUS = {
  AVAILABLE: 'available',   // ◎ 空きあり
  PARTIAL: 'partial',       // △ 午後のみ / 要相談
  FULL: 'full',             // × 予約済み
}

export const STATUS_LABEL = {
  [STATUS.AVAILABLE]: '◎ 空きあり',
  [STATUS.PARTIAL]: '△ 要相談',
  [STATUS.FULL]: '× 予約済み',
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveToStorage(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

/**
 * スケジュールデータの読み書きフック。
 * data: { 'YYYY-MM-DD': { status: STATUS, memo: string } }
 *
 * TODO: Googleカレンダー連携時はここの load/save を
 *       API呼び出しに差し替える。
 */
export function useSchedule() {
  const [data, setData] = useState(loadFromStorage)

  useEffect(() => {
    saveToStorage(data)
  }, [data])

  const setDay = useCallback((dateKey, status, memo = '') => {
    setData(prev => ({
      ...prev,
      [dateKey]: { status, memo },
    }))
  }, [])

  const removeDay = useCallback((dateKey) => {
    setData(prev => {
      const next = { ...prev }
      delete next[dateKey]
      return next
    })
  }, [])

  return { data, setDay, removeDay }
}
