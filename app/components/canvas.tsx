'use client';
import TeamView from './teamview.tsx'
import { React, useState } from 'react';
import { Team, Person, Mentor, OtherResponse, CarpoolStyle } from '../lib/models'

interface ChildProps {
  isLoading: boolean;
  teams: Team[];
}

const Canvas: React.FC<ChildProps> = ( { isLoading, teams } ) => {

  const renderTeams = (teams: Team[]): JSX.Element[] => {
    return teams.map( (team, index) => (<TeamView key={index} team={team}/>));
  };

  let children = (
      <p>Upload mentor and mentee CSVs and press Match.</p>
  );

  if (isLoading) {
    children = (
      <p>Loading...</p>
    );
  } else if (teams.length > 0) {
    children = renderTeams(teams);
  }

  if (!isLoading && teams.length == 0) {
    children = renderTeams([
      new Team(
        [
          new Person(
            "Mentee Venessa",
            "venessa@venessa.com",
            "she/her",
            ["bouldering", "lead climbing", "top rope"],
            ["hive north shore", "climbbase 5", "progression"],
            CarpoolStyle.SOLO,
            ["saturday", "monday", "tuesday"],
            2,
            [
              new OtherResponse("question1?", "answer1"),
              new OtherResponse("question2?", "answer2"),
              new OtherResponse("question3?", "answer3"),
            ]
          ),
          new Person(
            "Mentee Morgan",
            "morgan@morgan.com",
            "they/he",
            ["bouldering", "trad climbing", "top rope"],
            ["hive north shore", "progression"],
            CarpoolStyle.SOLO,
            ["saturday", "thursday", "tuesday"],
            2,
            [
              new OtherResponse("question1?", "answer1"),
              new OtherResponse("question2?", "answer2"),
              new OtherResponse("question3?", "answer3"),
            ]
          ),
        ],
        [
          new Mentor(
            "Mentor Michal",
            "michal@michal.com",
            "they/them",
            ["bouldering", "trad climbing", "top rope"],
            ["hive north shore", "progression"],
            CarpoolStyle.SOLO,
            ["saturday", "thursday", "tuesday"],
            2,
            [
              new OtherResponse("question1?", "answer1"),
              new OtherResponse("question2?", "answer2"),
              new OtherResponse("question3?", "answer3"),
            ]
          ),
          new Mentor(
            "Mentor Juniper",
            "juni@juni.com",
            "she/her",
            ["bouldering", "trad climbing", "top rope"],
            ["hive north shore", "progression"],
            CarpoolStyle.SOLO,
            ["saturday", "thursday", "tuesday"],
            2,
            [
              new OtherResponse("question1?", "answer1"),
              new OtherResponse("question2?", "answer2"),
              new OtherResponse("question3?", "answer3"),
            ]
          ),
        ],
      ),
      new Team(
        [
          new Person("Mentee Jess", "jess@jess.com", "she/her"),
        ],
        [
          new Mentor("Mentor Cherry", "cherry@cherry.com", "she/her"),
        ],
      ),
    ]);
  }

  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
      {children}
    </div>
  );
};

export default Canvas;
