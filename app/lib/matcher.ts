import { Mentor, Person, CoMentorStyle, Team, Group } from "./models";
import { cloneDeep } from "lodash";

export function buildTeams(group: Group): Team[] {
  let mentors = cloneDeep(group.mentors);
  let mentees = cloneDeep(group.mentees);

  let teams = makeTeamsFromMentors(mentors);

  assignMenteesToTeams(mentees, teams);

  if (mentees.length > 0)
    teams.push(new Team(mentees, []));

  return teams;
}

function makeTeamsFromMentors(mentors: Mentor[]) {
  mentors = sortMentors(mentors);

  let teams: Team[] = [];

  let groupMentors: Mentor[] = [];

  mentors.forEach((mentor) => {
    if (mentor.isSoloMentor()) {
      teams.push(new Team([],[mentor]));
    } else {
      groupMentors.push(mentor);
    }
  });

  while (groupMentors.length > 0) {
    let singleMentor = groupMentors[0];

    let found = false;
    for (let i = 1; i < groupMentors.length; i++) {
      const mentor = groupMentors[i];
      if (mentor.compatible(singleMentor)) {
        teams.push(new Team([], [singleMentor, mentor]));
        groupMentors.splice(i, 1);
        groupMentors.splice(0, 1);
        found = true;
        break;
      }
    }

    if (!found) {
      // couldn't find a comentor. tough luck. you're going solo
      teams.push(new Team([], [singleMentor]));
      groupMentors.splice(0, 1);
    }
  }

  return teams;
}

function sortMentors(mentors: Mentor[]): Mentor[] {
  let mentorOrderScore = (mentor: Mentor): number => {
    let comentorStyle = 0;
    if (mentor.wantCoMentor == CoMentorStyle.COMENTOR) {
      comentorStyle = 1;
    }
    if (mentor.wantCoMentor == CoMentorStyle.EITHER) {
      comentorStyle = 2;
    }

    let pickFactor = Math.min(
      mentor.climbingStyles.length,
      mentor.commutableGyms.length,
      mentor.availability.length
    );

    return comentorStyle * 1000000 + pickFactor * 1000;
  };

  return mentors.sort((a,b) => {
    if (mentorOrderScore(a) > mentorOrderScore(b)) return 1;
    return -1;
  });
}

function assignMenteesToTeams(mentees: Person[], teams: Team[]) {
  let sortedMentees = sortMentees(mentees);
  teams.forEach((team) => {

    for (let i = 0; i < sortedMentees.length; i++) {
      let mentee = sortedMentees[i];
      if (team.compatible(mentee)) {
        team.mentees.push(mentee);
        sortedMentees.splice(i, 1);
        i--;
      }
      if (team.openSlots() <= 0) break;
    }
  });
}


function sortMentees(mentees: Person[]): Person[] {
  let menteeOrderScore = (mentor: Person): number => {
    let pickFactor = Math.min(
      mentor.climbingStyles.length,
      mentor.commutableGyms.length,
      mentor.availability.length
    );

    return pickFactor * 1000;
  };

  return mentees.sort((a,b) => {
    if (menteeOrderScore(a) > menteeOrderScore(b)) return 1;
    return -1;
  });
}
