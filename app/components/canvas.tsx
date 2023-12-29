'use client';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { React, useState } from 'react';
import { Team, Person, Mentor, OtherResponse, CarpoolStyle } from '../lib/models'
import TeamView from './teamview.tsx'

const Canvas = ( { isLoading, teams } ) => {
  const renderTeams = (teams: Team[]): JSX.Element[] => {
    return (
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
        { teams.map( (team) => (<TeamView key={team.uniqueId()} team={team}/>)) }
      </div>
    )
  };

  let children = (
      <p>Upload mentor and mentee CSVs and press Match, or load a previously saved file.</p>
  );

  if (isLoading) {
    children = (
      <p>Loading...</p>
    );
  } else if (teams.length > 0) {
    children = renderTeams(teams);
  }

  return (
    <DndProvider backend={HTML5Backend}>
        {children}
    </DndProvider>
  );
};

export default Canvas;
