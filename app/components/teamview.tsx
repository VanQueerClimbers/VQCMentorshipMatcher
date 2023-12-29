'use client';
import { React, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar } from '@fortawesome/free-solid-svg-icons';
import { Team } from '../lib/models'
import PersonView from './personview.tsx'
import Tag from './tag.tsx'
import Modal from './modal.tsx'

interface ChildProps {
  team: Team;
}

const TeamView: React.FC<ChildProps> = ( { team } ) => {
  const [openModal, setOpenModal] = useState(false);

  const openTeamDetails = () => {
    setOpenModal(true);
  };

  const closeTeamDetails = () => {
    setOpenModal(false);
  };

  return (
    <div>
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
          <div className="p-1">
            <div className="font-bold text-center">Climbing Styles</div>
            <div className="flex flex-wrap">
              { team.styles().map( (s,i) => (
                <Tag key={i} text={s} className="flex-none"/>
              ))}
            </div>
          </div>
          <div className="p-1">
            <div className="font-bold text-center">Gyms</div>
            <div className="flex flex-wrap">
              { team.nonCarpoolGyms().map( (s,i) => (
                <Tag key={i} text={s} className="flex-none"/>
              ))}
              { team.carpoolGyms().map( (s,i) => (
                <Tag key={i} text={s} className="flex-none"><FontAwesomeIcon className="mr-2" icon={faCar}/></Tag>
              ))}
            </div>
          </div>
          <div className="p-1">
            <div className="font-bold text-center">Availability</div>
            <div className="flex flex-wrap">
              { team.availability().map( (s,i) => (
                <Tag key={i} text={s} className="flex-none"/>
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

