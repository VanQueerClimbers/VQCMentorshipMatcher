'use client';
import { Inter } from 'next/font/google'
import MenuBar from './components/menu.tsx'
import Canvas from './components/canvas.tsx'
import { useState } from 'react'
import './globals.css'

import { Group } from './lib/models'
import { Deserializer } from './lib/deserializer'
import { buildTeams } from './lib/matcher'

export default function RootLayout( { children, }: { children: ReactNode } )  {
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);

  const csvDataReceived = (menteeData: string, mentorData:string) => {
    setLoading(true);

    let deserializer = new Deserializer();
    let group = new Group(
      deserializer.readMentees(menteeData),
      deserializer.readMentors(mentorData)
    );
    let teams = buildTeams(group);
    setLoading(false);
    setTeams(teams);
  }

  return (
    <html lang="en">
      <head>
        <title>VQC Mentorship Matching</title>
      </head>
      <body className="font-sans">
        <MenuBar submitCallback={csvDataReceived}/>
        <div className="h-screen w-screen">
          <Canvas isLoading={loading} teams={teams}/>
        </div>
      </body>
    </html>
  )
}
