'use client';
import { React, useState } from 'react'
import { Team } from '../lib/models'
import PersonView from './personview.tsx'
import Tag from './tag.tsx'

interface ChildProps {
  team: Team;
}

const TeamView: React.FC<ChildProps> = ( { team } ) => {
  return (
    <div className="border-solid border-4 rounded-md border-indigo-400 bg-white divide-y divide-indigo-400 bg-slate-100 m-2 p-2">
      <div>
        <div className="font-bold">Mentors</div>
        <div className="flex flex-wrap">
          { team.mentors.map( (p, index) => (
            <PersonView key={index} person={p} className="flex-auto"/>
          ))}
        </div>
      </div>
      <div>
        <div className="font-bold">Mentees</div>
        <div className="flex flex-wrap">
          { team.mentees.map( (p, index) => (
            <PersonView key={index} person={p} className="flex-auto"/>
          ))}
        </div>
      </div>
      <div className="grid md:grid-cols-3 sm:grid-cols-1 divide-2 divide-indigo-400 divide-x text-sm">
        <div>
          <div className="font-bold text-center">Climbing Styles</div>
          <div className="flex flex-wrap">
            { team.styles().map( (s,i) => (
              <Tag key={i} text={s} className="flex-none"/>
            ))}
          </div>
        </div>
        <div>
          <div className="font-bold text-center">Gyms</div>
          <div className="flex flex-wrap">
            { team.commutableGyms().map( (s,i) => (
              <Tag key={i} text={s} className="flex-none"/>
            ))}
          </div>
        </div>
        <div>
          <div className="font-bold text-center">Availability</div>
          <div className="flex flex-wrap">
            { team.availability().map( (s,i) => (
              <Tag key={i} text={s} className="flex-none"/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamView;

