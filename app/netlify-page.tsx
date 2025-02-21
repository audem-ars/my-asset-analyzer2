"use client"
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const AssetAnalyzer = dynamic(() => import('../components/AssetAnalyzer'), {
  ssr: false,
})

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <AssetAnalyzer />
      </Suspense>
    </main>
  )
}