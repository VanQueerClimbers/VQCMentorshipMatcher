'use client';
import { useState } from 'react'
import MenuBar from './components/menu'
import Canvas from './components/canvas'

import { Group, Team, Person, Mentor, OtherResponse, CarpoolStyle } from './lib/models'
import { Deserializer } from './lib/deserializer'
import { buildTeams } from './lib/matcher'

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);

  const csvDataReceived = (menteeData: string, mentorData:string) => {
    setLoading(true);

    let deserializer = new Deserializer();
    let group = new Group(
      deserializer.readMentees(menteeData),
      deserializer.readMentors(mentorData)
    );
    let teams = buildTeams(group);
    setTeams(teams);
    setLoading(false);
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
    setLoading(true);
    // we reset ids to avoid bugs with the Drag and Drop library state.
    let id = Math.floor(Math.random() * 100) + 1;
    const newTeams: Team[] = JSON.parse(state).map((s: any) => {
      return new Team(
        s["mentees"].map((p: any) => {
          let result = Object.assign(new Person("",""), p);
          result.uniqueId = id++;
          return result;
        }),
        s["mentors"].map((p: any) => {
          let result = Object.assign(new Mentor("",""), p);
          result.uniqueId = id++;
          return result;
        })
      );
    });
    setTeams(newTeams);
    setLoading(false);
  };

  return (
    <body className="font-sans">
      <MenuBar
        submitCallback={csvDataReceived}
        loadCallback={loadState}
        saveCallback={saveState}/>
      <div className="h-screen w-screen">
        { loading ? (
          <p>Loading...</p>
        ) : (<></>)}
        { teams.length == 0 ? (
          <p>Upload mentor and mentee CSVs and press Match, or load a previously saved file.</p>
        ) : (<></>)}
        <Canvas teams={teams}/>
      </div>
    </body>
  )
}
