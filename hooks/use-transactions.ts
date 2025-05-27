"use client"

import { useState, useEffect } from "react"
import { getUserTransactions } from "@/app/actions/transaction-actions"
import type { Transaction } from "@/types"

interface UseTransactionsOptions {
  status?: string
  limit?: number
}

export function useTransactions(options: UseTransactionsOptions = {}) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)

  const fetchTransactions = async (reset = false) => {
    try {
      setIsLoading(true)
      setError(null)

      const newOffset = reset ? 0 : offset
      const result = await getUserTransactions({
        ...options,
        offset: newOffset,
      })

      if (reset) {
        setTransactions(result.transactions)
      } else {
        setTransactions((prev) => [...prev, ...result.transactions])
      }

      setTotal(result.total)
      setHasMore(result.hasMore)
      setOffset(reset ? options.limit || 10 : newOffset + (options.limit || 10))
    } catch (err) {
      setError("Failed to fetch transactions")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchTransactions()
    }
  }

  const refresh = () => {
    fetchTransactions(true)
  }

  useEffect(() => {
    fetchTransactions(true)
  }, [options.status, options.limit])

  return {
    transactions,
    isLoading,
    error,
    total,
    hasMore,
    loadMore,
    refresh,
  }
}
