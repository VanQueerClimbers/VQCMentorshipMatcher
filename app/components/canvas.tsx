'use client';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { React, useState } from 'react';
import { Team, Person, Mentor, OtherResponse, CarpoolStyle } from '../lib/models'
import TeamView from './teamview.tsx'

const Canvas = ( { isLoading, teams } ) => {

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
            CarpoolStyle.DRIVER,
            ["saturday", "monday", "tuesday"],
            2,
            [
              new OtherResponse("question1?", "answer1"),
              new OtherResponse("question2?", "answer2"),
              new OtherResponse("question3?", "answer3"),
            ],
            0
          ),
          new Person(
            "Mentee Morgan",
            "morgan@morgan.com",
            "they/he",
            ["bouldering", "trad climbing", "top rope"],
            ["hive north shore", "progression"],
            CarpoolStyle.DRIVER,
            ["saturday", "thursday", "tuesday"],
            2,
            [
              new OtherResponse("question1?", "answer1"),
              new OtherResponse("question2?", "answer2"),
              new OtherResponse("question3?", "answer3"),
            ],
            1
          ),
        ],
        [
          new Mentor(
            "Mentor Michal",
            "michal@michal.com",
            "they/them",
            ["bouldering", "trad climbing", "top rope"],
            ["hive north shore", "climbbase 5", "progression"],
            CarpoolStyle.SOLO,
            ["saturday", "thursday", "tuesday"],
            2,
            [
              new OtherResponse("question1?", "answer1"),
              new OtherResponse("question2?", "answer2"),
              new OtherResponse("question3?", "answer3"),
            ],
            undefined,
            2
          ),
          new Mentor(
            "Mentor Juniper",
            "juni@juni.com",
            "she/her",
            ["bouldering", "trad climbing", "top rope"],
            ["hive north shore", "progression"],
            CarpoolStyle.PASSENGER,
            ["saturday", "thursday", "tuesday"],
            2,
            [
              new OtherResponse("question1?", "answer1"),
              new OtherResponse("question2?", "answer2"),
              new OtherResponse("question3?", "answer3"),
            ],
            undefined,
            3
          ),
        ],
      ),
      new Team(
        [
          new Person(
            "Mentee Jess",
            "jess@jess.com",
            "she/her",
            ["bouldering", "trad climbing", "top rope"],
            ["hive north shore", "progression"],
            CarpoolStyle.DRIVER,
            ["saturday", "thursday", "tuesday"],
            2,
            undefined,
            4,
          )
        ],
        [
          new Mentor(
            "Mentor Cherry",
            "cherry@cherry.com",
            "she/her",
            ["bouldering", "trad climbing", "top rope"],
            ["hive north shore", "progression"],
            CarpoolStyle.PASSENGER,
            ["saturday", "thursday", "tuesday"],
            2,
            undefined,
            undefined,
            5
          ),
        ],
      ),
    ]);
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
        {children}
      </div>
    </DndProvider>
  );
};

export default Canvas;
