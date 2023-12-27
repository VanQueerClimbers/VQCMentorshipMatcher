'use client';
import { React, useState } from 'react'
import { Team } from '../lib/models'
import PersonView from './personview.tsx'

interface ChildProps {
  team: Team;
}

const TeamView: React.FC<ChildProps> = ( { team } ) => {
  return (
    <div className="border-solid border-4 rounded-md border-indigo-400 bg-white divide-y divide-indigo-400 bg-slate-100 m-2 p-2">
      <div>
        <div className="font-bold">Mentors</div>
        <div className="flex">
          { team.mentors.map( (p, index) => (
            <PersonView key={index} person={p} className="flex-auto"/>
          ))}
        </div>
      </div>
      <div>
        <div className="font-bold">Mentees</div>
        <div className="flex">
          { team.mentees.map( (p, index) => (
            <PersonView key={index} person={p} className="flex-auto"/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamView;

