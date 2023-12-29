'use client';
import { Inter } from 'next/font/google'
import MenuBar from './components/menu.tsx'
import Canvas from './components/canvas.tsx'
import { useState } from 'react'
import './globals.css'

import { Group, Team, Person, Mentor, OtherResponse, CarpoolStyle } from './lib/models'
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

  const saveState = () => {
    const jsonString = JSON.stringify(teams, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "VQCMatcherState.vqc"
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const loadState = (state: string) => {
    const newTeams: Team[] = JSON.parse(state).map((s) => {
      return new Team(
        s["mentees"].map((p) => Object.assign(new Person(), p)),
        s["mentors"].map((p) => Object.assign(new Mentor(), p)),
      );
    });
    setTeams(newTeams);
  };

  return (
    <html lang="en">
      <head>
        <title>VQC Mentorship Matching</title>
      </head>
      <body className="font-sans">
        <MenuBar
          submitCallback={csvDataReceived}
          loadCallback={loadState}
          saveCallback={saveState}/>
        <div className="h-screen w-screen">
          <Canvas isLoading={loading} teams={teams}/>
        </div>
      </body>
    </html>
  )
}
