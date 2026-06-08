import { useState, useEffect, useCallback } from 'react'
import {
  collection, doc, onSnapshot,
  setDoc, deleteDoc
} from 'firebase/firestore'
import { db } from '../lib/firebase'

// ステータス定義
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

/**
 * Firestoreからスケジュールデータをリアルタイム取得・更新するフック。
 * data: { 'YYYY-MM-DD': { status: STATUS, memo: string } }
 */
export function useSchedule() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Firestoreのscheduleコレクションをリアルタイム監視
    const unsub = onSnapshot(collection(db, 'schedule'), (snapshot) => {
      const next = {}
      snapshot.forEach(doc => {
        next[doc.id] = doc.data()
      })
      setData(next)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const setDay = useCallback(async (dateKey, status, memo = '') => {
    await setDoc(doc(db, 'schedule', dateKey), { status, memo })
  }, [])

  const removeDay = useCallback(async (dateKey) => {
    await deleteDoc(doc(db, 'schedule', dateKey))
  }, [])

  return { data, setDay, removeDay, loading }
}
