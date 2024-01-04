'use client';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useState, useEffect } from 'react';
import { Team, Person, Mentor, OtherResponse, CarpoolStyle } from '../lib/models'
import TeamView from './teamview'

interface CanvasProps {
  teams: Team[];
  deleteTeam: (uniqueId: string)=>void;
  createTeam: ()=>void;
}

const Canvas = ( { teams, deleteTeam, createTeam } : CanvasProps ) => {

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
        { teams.map( (team) => (<TeamView key={team.uniqueId} team={team} deleteMe={() => deleteTeam(team.uniqueId)} />)) }
        { teams.length > 0 ? (
          <div className="text-center">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={createTeam}
              >
              Add new team
            </button>
          </div>
        ): (<></>)}
      </div>
    </DndProvider>
  );
};

export default Canvas;
