'use client';

import { Person } from '../lib/models'

interface ChildProps {
  person: Person;
}

const PersonView: React.FC<ChildProps> = ( { person } ) => {
  return (
    <div className="bg-purple-400 border-2 border-purple-900 border-solid rounded-lg flex text-sm m-1 divide-purple-900 divide-x divide-solid">
      <span className="flex-none text-xs font-bold p-1">{person.pronouns}</span>
      <h2 className="flex-auto p-1">{person.name}</h2>
    </div>
  )
};

export default PersonView;
