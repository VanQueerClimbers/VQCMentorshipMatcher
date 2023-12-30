'use client';
import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar } from '@fortawesome/free-solid-svg-icons';
import { useDrop } from "react-dnd";
import * as _ from 'lodash'
import { Team, Person, Mentor } from '../lib/models'
import PersonView from './personview'
import Tag from './tag'
import Modal from './modal'

interface TeamProps {
  team: Team;
}

const TeamView = ( { team }: TeamProps ) => {
  const [mentors, setLocalMentors] = useState([...team.mentors]);
  const [mentees, setLocalMentees] = useState([...team.mentees]);
  const [openModal, setOpenModal] = useState(false);
  const [mentorShadow, setMentorShadow] = useState<Person | null>(null);
  const [menteeShadow, setMenteeShadow] = useState<Person | null>(null);

  const openTeamDetails = () => { setOpenModal(true); };
  const closeTeamDetails = () => { setOpenModal(false); };


  const updateMentors = (newMentors: Mentor[]) => {
    team.mentors = [...newMentors];
    setLocalMentors(newMentors);
  };

  const updateMentees = (newMentees: Person[]) => {
    team.mentees = [...newMentees];
    setLocalMentees(newMentees);
  };

  const onMentorMoved = (person: Mentor) => {
    updateMentors(team.mentors.filter( (m) => m.uniqueId != person.uniqueId ));
  };
  const onMenteeMoved = (person: Person) => {
    updateMentees(team.mentees.filter( (m) => m.uniqueId != person.uniqueId ));
  };

  const [{isOverMentor, draggedMentor}, mentorDrop] = useDrop({
    accept: "Mentor",
    hover(item: {person: Mentor, team: Team, onMoved: ()=>void}) {
      if (item.team === team) { 
        return;
      }
      setMentorShadow(item.person);
    },
    drop(item, monitor) {
      if (item.team === team) {
        return;
      }
      updateMentors(team.mentors.concat(item.person));
      item.onMoved();
      return item;
    },
    collect: (monitor) => ({
      isOverMentor: monitor.isOver(),
      draggedMentor: monitor.getItem(),
    }),
  });
  if (!isOverMentor && mentorShadow) setMentorShadow(null);

  const [{isOverMentee, draggedMentee}, menteeDrop] = useDrop({
    accept: "Person",
    hover(item: {person: Person, team: Team, onMoved: ()=>void}) {
      if (item.team === team) { 
        return;
      }
      setMenteeShadow(item.person);
    },
    drop(item, monitor) {
      if (item.team === team) {
        return;
      }
      updateMentees(team.mentees.concat(item.person));
      item.onMoved();
      return item;
    },
    collect: (monitor) => ({
      isOverMentee: monitor.isOver(),
      draggedMentee: monitor.getItem(),
    }),
  });
  if (!isOverMentee && menteeShadow) setMenteeShadow(null);

  let color = "#818cf8";
  const draggedPerson = draggedMentee ? draggedMentee : draggedMentor;
  if (draggedPerson) {
    if (team.compatible(draggedPerson.person)) {
      color = "#4ade80";
    } else {
      color = "#f87171";
    }
  }

  return (
    <div>
      <div
        className="border-solid border-4 rounded-md bg-white divide-y divide-indigo-400 bg-slate-100 m-2 p-2"
        style={ { borderColor: color } }>
        <div ref={mentorDrop}>
          <div className="font-bold">Mentors</div>
          <div className="flex flex-wrap">
            { mentors.map( (p) => (
              <PersonView key={"mentor"+p.uniqueId} person={p} team={team} onMoved={()=>onMentorMoved(p)}/>
            ))}
            { mentorShadow != null ? (<PersonView ghost={true} person={mentorShadow} team={team}/>) : (<></>) }
          </div>
        </div>
        <div ref={menteeDrop}>
          <div className="font-bold">Mentees</div>
          <div className="flex flex-wrap">
            { mentees.map( (p, index) => (
              <PersonView key={"mentee"+p.uniqueId} person={p} team={team} onMoved={()=>onMenteeMoved(p)}/>
            ))}
            { menteeShadow != null ? (<PersonView ghost={true} person={menteeShadow} team={team}/>) : (<></>) }
          </div>
        </div>
        <div className="divide-2 divide-indigo-400 divide-y text-sm">
          <div className="p-1">
            <div className="font-bold text-center">Climbing Styles</div>
            <div className="flex flex-wrap">
              { team.styles().map( (s) => (
                <Tag key={s+team.uniqueId()} text={s}/>
              ))}
            </div>
          </div>
          <div className="p-1">
            <div className="font-bold text-center">Gyms</div>
            <div className="flex flex-wrap">
              { team.nonCarpoolGyms().map( (s,i) => (
                <Tag key={s+team.uniqueId()} text={s}/>
              ))}
              { team.carpoolGyms().map( (s) => (
                <Tag key={s+team.uniqueId()} text={s}>
                  <FontAwesomeIcon className="mr-2" icon={faCar}/>
                </Tag>
              ))}
            </div>
          </div>
          <div className="p-1">
            <div className="font-bold text-center">Availability</div>
            <div className="flex flex-wrap">
              { team.availability().map( (s) => (
                <Tag key={s+team.uniqueId()} text={s}/>
              ))}
            </div>
          </div>
        </div>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={openTeamDetails}>
          Details
        </button>
      </div>
      <Modal
        isOpen={openModal}
        onClose={closeTeamDetails}
        >
        <div className="flex flex-wrap p-4">
          <h3 className="flex-none font-bold mr-2">Emails:</h3>
          <p className="flex-auto">{ team.people().map(p => p.email).join(", ") }</p>
        </div>
        <div className="flex flex-wrap p-4">
          <h3 className="flex-none font-bold mr-2">Climbing Styles:</h3>
          <p className="flex-auto">{ team.styles().join(", ") }</p>
        </div>
        <div className="flex flex-wrap p-4">
          <h3 className="flex-none font-bold mr-2">Availability:</h3>
          <p className="flex-auto">{ team.availability().join(", ") }</p>
        </div>
        <div className="flex flex-wrap p-4">
          <h3 className="flex-none font-bold mr-2">Compatible Gyms:</h3>
          <p className="flex-auto">{ team.commutableGyms().join(", ") }</p>
        </div>
        <div className="flex flex-wrap p-4">
          <h3 className="flex-none font-bold mr-2">Carpool Required Gyms:</h3>
          <p className="flex-auto">{ team.carpoolGyms().join(", ") }</p>
        </div>
        <div className="flex flex-wrap p-4">
          <h3 className="flex-none font-bold mr-2">No Carpool Gyms:</h3>
          <p className="flex-auto">{ team.nonCarpoolGyms().join(", ") }</p>
        </div>
        <div className="flex flex-wrap p-4">
          <h3 className="flex-none font-bold mr-2">Carpool Drivers:</h3>
          <p className="flex-auto">{ team.carpoolGroup().filter((p) => p.isDriver()).map((p) => p.name).join(", ") }</p>
        </div>
        <div className="flex flex-wrap p-4">
          <h3 className="flex-none font-bold mr-2">Carpool Passengers:</h3>
          <p className="flex-auto">{ team.carpoolGroup().filter((p) => p.isPassenger()).map((p) => p.name).join(", ") }</p>
        </div>
      </Modal>
    </div>
  );
};

export default TeamView;

