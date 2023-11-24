import { findMatching } from "./util";

export enum CarpoolStyle {
  DRIVER = "driver",
  PASSENGER = "passanger",
  SOLO = "don't carpool",
}

export enum CoMentorStyle {
  SOLO = "mentor solo",
  COMENTOR = "co mentor",
  EITHER = "either",
}

export class OtherResponse {
  constructor(public question: string, public answer: string) {}
}


export class Person {
  constructor(
    public name: string,
    public email: string,
    public pronouns: string = "they/them",
    public climbingStyles: string[] = [],
    public commutableGyms: string[] = [],
    public carpoolStyle: CarpoolStyle = CarpoolStyle.SOLO,
    public availability: string[] = [],
    public groupSize: number = 3,
    public otherResponses: OtherResponse[] = []
  ) {};

  isPassenger(): boolean {
    return this.carpoolStyle == CarpoolStyle.PASSENGER;
  }

  isDriver(): boolean {
    return this.carpoolStyle == CarpoolStyle.DRIVER;
  }

  isSolo(): boolean {
    return this.carpoolStyle == CarpoolStyle.SOLO;
  }
}


export class Mentor extends Person {
  constructor(
    name: string,
    email: string,
    pronouns: string = "they/them",
    climbingStyles: string[] = [],
    commutableGyms: string[] = [],
    carpoolStyle: CarpoolStyle = CarpoolStyle.SOLO,
    availability: string[] = [],
    groupSize: number = 3,
    public wantCoMentor: CoMentorStyle = CoMentorStyle.SOLO
  ) {
    super(
      name,
      email,
      pronouns,
      climbingStyles,
      commutableGyms,
      carpoolStyle,
      availability,
      groupSize
    );
  };
}


export class Group {
  constructor(
    public mentees: Person[] = [],
    public mentors: Mentor[] = [],
  ) {}
}

export class Team extends Group {

  people(): Person[] {
    return this.mentees.concat(this.mentors);
  }

  styles(): string[] {
    let lists: string[][] = [];

    this.people().forEach((m) => {
      lists.push(m.climbingStyles);
    });

    return findMatching(...lists);
  }

  commutableGyms(): string[] {
    let lists: string[][] = [];

    let people = this.people();

    let drivers = people.filter( p => p.isDriver() );

    this.people().forEach((m) => {
      let gyms = m.commutableGyms;
      if (!m.isSolo()) {
        drivers.forEach( (d) => {
          gyms = gyms.concat(d.commutableGyms);
        });
      }
      lists.push(gyms);
    });

    return findMatching(...lists);
  }

  carpoolGroup(): Person[] {
    let result: Person[] = [];
    this.people().forEach((m) => {
      if (m.carpoolStyle != CarpoolStyle.SOLO) {
        result.push(m);
      }
    });
    return result;
  }

  availability(): string[] {
    let lists: string[][] = [];

    this.people().forEach((m) => {
      lists.push(m.availability);
    });

    return findMatching(...lists);
  }
}
