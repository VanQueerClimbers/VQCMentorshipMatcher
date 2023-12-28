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

  compatible(person: Person): boolean {
    const carpoolCompatible = !this.isSolo() && !person.isSolo() && (
      person.isDriver() || this.isDriver() );
    const matchingStyles = findMatching(this.climbingStyles, person.climbingStyles).length > 0;
    const matchingGyms = findMatching(this.commutableGyms, person.commutableGyms).length > 0;
    const matchingAvail = findMatching(this.availability, person.availability).length > 0;
    const differentEmail = this.email != person.email;

    return matchingStyles && matchingAvail && ( matchingGyms || carpoolCompatible) && differentEmail;
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

  isSoloMentor(): boolean {
    return this.wantCoMentor == CoMentorStyle.SOLO;
  }

  compatible(mentor: Mentor): boolean {
    return super.compatible(mentor) && !this.isSoloMentor() && !mentor.isSoloMentor();
  }
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
    let people = this.people();

    if (people.length == 1) return people[0].climbingStyles;

    people.forEach((m) => {
      lists.push(m.climbingStyles);
    });

    if (lists.length > 1) return findMatching(...lists);
    else return [];
  }

  commutableGyms(): string[] {
    let lists: string[][] = [];

    let people = this.people();

    if (people.length == 1) return people[0].commutableGyms;

    let drivers = people.filter( p => p.isDriver() );

    people.forEach((m) => {
      let gyms = m.commutableGyms;
      if (!m.isSolo()) {
        drivers.forEach( (d) => {
          gyms = gyms.concat(d.commutableGyms);
        });
      }
      lists.push(gyms);
    });

    if (lists.length > 1) return findMatching(...lists);
    else return [];
  }

  carpoolGroup(): Person[] {
    let result: Person[] = [];
    this.people().forEach((m) => {
      if (!m.isSolo()) {
        result.push(m);
      }
    });
    return result;
  }

  availability(): string[] {
    let lists: string[][] = [];
    let people = this.people();
    if (people.length == 1) return people[0].availability;
    people.forEach((m) => {
      lists.push(m.availability);
    });

    if (lists.length > 1) return findMatching(...lists);
    else return [];
  }

  openSlots(): number {
    let slots = 100;
    this.mentors.forEach((mentor) => {
      slots = Math.min(slots, mentor.groupSize);
    });
    this.mentees.forEach((mentee) => {
      slots = Math.min(slots, mentee.groupSize);
    });

    return slots - this.mentees.length;
  }

  compatible(person: Person): boolean {
    const carpoolCompatible = !person.isSolo() && this.people().filter(p => p.isDriver()).length > 0;
    const matchingStyles = findMatching(this.styles(), person.climbingStyles).length > 0;
    const matchingGyms = findMatching(this.commutableGyms(), person.commutableGyms).length > 0;
    const matchingAvail = findMatching(this.availability(), person.availability).length > 0;
    const groupSizeMatch = this.openSlots() > 0 && person.groupSize > this.mentees.length;

    const uniqueEmails = this.people().filter(p => p.email == person.email).length == 0;


    return matchingStyles && groupSizeMatch && matchingAvail && ( matchingGyms || carpoolCompatible ) && uniqueEmails;
  }
}
