'use client';
import { Person } from '../lib/models'
import Modal from './modal.tsx'
import Tag from './tag.tsx'
import { useState } from 'react'

interface ChildProps {
  person: Person;
}

const PersonView: React.FC<ChildProps> = ( { person } ) => {
  const [openModal, setOpenModal] = useState(false);


  const openPersonDetails = () => {
    setOpenModal(true);
  };

  const closePersonDetails = () => {
    setOpenModal(false);
  };

  return (
    <div>
      <div
        className="bg-purple-400 border-2 border-purple-900 border-solid rounded-lg flex flex-wrap text-sm m-1 divide-purple-900 divide-x divide-solid hover:bg-purple-600 hover:cursor-pointer hover:text-white"
        onClick={openPersonDetails}
        >
        <Tag text={person.pronouns} className="flex-none"/>
        <h2 className="flex-auto p-1">{person.name}</h2>
      </div>
      <Modal
        isOpen={openModal}
        onClose={closePersonDetails}
        >
        <div className="flex flex-wrap p-4">
          <h1 className="mr-2 font-bold">{person.name}</h1>
          <Tag text={person.pronouns} className="flex-none"/>
        </div>
        <p className="p-4">{person.email}</p>
        <div className="flex flex-wrap p-4">
          {person.climbingStyles.map((s,i) => (
            <Tag key={i} text={s} className="flex-none"/>
          ))}
        </div>
        <div className="flex flex-wrap p-4">
          {person.commutableGyms.map((s,i) => (
            <Tag key={i} text={s} className="flex-none"/>
          ))}
        </div>
        <div className="flex flex-wrap p-4">
          <h3 className="flex-none font-bold mr-2">Carpool Choice:</h3>
          <p className="flex-auto">{person.carpoolStyle}</p>
        </div>
        <div className="flex flex-wrap p-4">
          {person.availability.map((s,i) => (
            <Tag key={i} text={s} className="flex-none"/>
          ))}
        </div>
        <div className="flex flex-wrap p-4">
          <h3 className="flex-none font-bold mr-2">Group Size:</h3>
          <p className="flex-auto">{person.groupSize}</p>
        </div>
        <div className="p-4">
          {person.otherResponses.map((r,i) => (
            <div key={i} className="py-1">
              <p className="font-bold text-sm">{r.question}</p>
              <p className="text-sm">{r.answer}</p>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
};

export default PersonView;
