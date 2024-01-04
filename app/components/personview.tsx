'use client';
import { useState } from 'react'
import { useDrag } from "react-dnd";
import { Person, Mentor, Team } from '../lib/models'
import Modal from './modal'
import Tag from './tag'

interface PersonProps {
  person: Person;
  team: Team;
  onMoved?: ()=>void;
  ghost?: boolean;
}

const PersonView = ( { person, team, onMoved, ghost = false } : PersonProps ) => {
  const [openModal, setOpenModal] = useState(false);

  const openPersonDetails = () => { setOpenModal(true); };
  const closePersonDetails = () => { setOpenModal(false); };

  const isMentor = person instanceof Mentor;

  const [{ isDragging }, drag] = useDrag(() => ({
    type: isMentor ? "Mentor" : "Person",
    item: { person, team, onMoved },
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
  }));

  return (
    <div>
      <div
        className="border-2 border-black border-solid rounded-lg flex flex-wrap text-sm m-1 hover:bg-purple-600 hover:cursor-pointer hover:border-white"
        style={ {backgroundColor: isMentor ? "#fef08a" : "#d9f99d", opacity: ghost ? 0.3 : 1.0} }
        onClick={openPersonDetails}
        ref={ghost ? null : drag}
        >
        <Tag text={person.pronouns}/>
        <h2 className="flex-auto p-1">{person.name}</h2>
      </div>
      <Modal
        isOpen={openModal}
        onClose={closePersonDetails}
        >
        <div className="flex flex-wrap p-4">
          <h1 className="mr-2 font-bold">{person.name}</h1>
          <Tag text={person.pronouns}/>
        </div>
        <p className="p-4">{person.email}</p>
        <div className="flex flex-wrap p-4">
          {person.climbingStyles.map((s,i) => (
            <Tag key={i} text={s}/>
          ))}
        </div>
        <div className="flex flex-wrap p-4">
          {person.commutableGyms.map((s,i) => (
            <Tag key={i} text={s}/>
          ))}
        </div>
        { isMentor && (
        <div className="flex flex-wrap p-4">
          <h3 className="flex-none font-bold mr-2">Mentor Style:</h3>
          <p className="flex-auto">{(person as Mentor).wantCoMentor}</p>
        </div>
        ) }
        <div className="flex flex-wrap p-4">
          <h3 className="flex-none font-bold mr-2">Carpool Choice:</h3>
          <p className="flex-auto">{person.carpoolStyle}</p>
        </div>
        <div className="flex flex-wrap p-4">
          {person.availability.map((s,i) => (
            <Tag key={i} text={s}/>
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
