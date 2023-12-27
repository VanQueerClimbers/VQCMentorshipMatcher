'use client';
import { Inter } from 'next/font/google'
import MenuBar from './menu.tsx'
import Canvas from './canvas.tsx'
import { useState } from 'react'
import './globals.css'

import { Group } from './lib/models'
import { Deserializer } from './lib/deserializer'
import { buildTeams } from './lib/matcher'

export default function RootLayout( { children, }: { children: ReactNode } )  {
  const [loading, setLoading] = useState(false);

  const csvDataReceived = (menteeData: string, mentorData:string) => {
    setLoading(true);

    let deserializer = new Deserializer();
    let group = new Group(
      deserializer.readMentees(menteeData),
      deserializer.readMentors(mentorData)
    );
    let teams = buildTeams(group);
    setLoading(false);
  }

  return (
    <html lang="en">
      <body className="font-sans">
        <MenuBar submitCallback={csvDataReceived}/>
        <Canvas isLoading={loading}/>
      </body>
    </html>
  )
}
