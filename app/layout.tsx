'use client';
import { useState, ReactNode } from 'react'
import './globals.css'

export default function RootLayout( { children, }: { children: ReactNode } )  {
  return (
    <html lang="en">
      <head>
        <title>VQC Mentorship Matching</title>
      </head>
      {children}
    </html>
  )
}
