"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function DebugSupabase() {
  const [tableInfo, setTableInfo] = useState<{ data?: unknown; error?: unknown } | null>(null)

  useEffect(() => {
    async function checkTable() {
      try {
        // Try to get table schema
        const { data, error } = await supabase
          .from('contacts')
          .select('*')
          .limit(1)

        console.log('Table check:', { data, error })
        setTableInfo({ data, error })
      } catch (err) {
        console.log('Error checking table:', err)
        setTableInfo({ error: err })
      }
    }

    checkTable()
  }, [])

  return (
    <div className="p-4 border rounded bg-gray-100">
      <h3>Table Debug Info:</h3>
      <pre>{JSON.stringify(tableInfo, null, 2)}</pre>
    </div>
  )
}