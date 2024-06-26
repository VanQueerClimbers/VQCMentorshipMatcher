import { findMatching } from "./util";

export enum CarpoolStyle {
  DRIVER = "driver",
  PASSENGER = "passanger",
  SOLO = "no carpool",
}

export enum CoMentorStyle {
  SOLO = "solo",
  COMENTOR = "comentor",
  EITHER = "either",
}

const SKILL_HIERARCHY = ["advanced", "intermediate", "beginner", "novice"];

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
    public otherResponses: OtherResponse[] = [],
    public uniqueId: number = 0
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

  styles(): string[] {
    let styles: string[] = [];


    this.climbingStyles.forEach((s) => {
      styles.push(s);
      let matched = "";
      SKILL_HIERARCHY.forEach((level) => {
        if (matched != "") {
          styles.push(s.replace(matched, level));
        } else if (s.includes(level)) {
          matched = level;
        }
      });
    });
    return styles;
  }

  compatible(person: Person): boolean {
    const matchingGyms = findMatching(this.commutableGyms, person.commutableGyms).length > 0;
    const bothSolo = person.isSolo() && this.isSolo();
    const matchingStyles = findMatching(this.styles(), person.climbingStyles).length > 0;
    const matchingAvail = findMatching(this.availability, person.availability).length > 0;
    const differentEmail = this.email != person.email;

    return matchingStyles && matchingAvail && differentEmail && (!bothSolo || matchingGyms);
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
    otherResponses: OtherResponse[] = [],
    public wantCoMentor: CoMentorStyle = CoMentorStyle.SOLO,
    uniqueId: number = 0,
  ) {
    super(
      name,
      email,
      pronouns,
      climbingStyles,
      commutableGyms,
      carpoolStyle,
      availability,
      groupSize,
      otherResponses,
      uniqueId,
    );
  };

  isSoloMentor(): boolean {
    return this.wantCoMentor == CoMentorStyle.SOLO;
  }

  compatible(person: Person): boolean {
    const personCompatible = super.compatible(person);
    if (person instanceof Mentor) {
      const soloCompatible = !this.isSoloMentor() && !(person as
        Mentor).isSoloMentor();
      const groupSizeCompatible = this.groupSize > 1 && person.groupSize >
        1;
      return personCompatible && soloCompatible && groupSizeCompatible;
    } else return personCompatible;
  }

}


export class Group {
  constructor(
    public mentees: Person[] = [],
    public mentors: Mentor[] = [],
  ) {}
}


let teamIds = 0;

export class Team extends Group {

  constructor(
    mentees: Person[] = [],
    mentors: Mentor[] = [],
    public uniqueId:string = String(teamIds++),
  ) {
    super(mentees, mentors);
  }

  people(): Person[] {
    return this.mentees.concat(this.mentors);
  }

  styles(): string[] {
    let lists: string[][] = [];

    this.mentors.forEach((m) => {
      lists.push(m.styles());
    });
    this.mentees.forEach((m) => {
      lists.push(m.climbingStyles);
    });

    if (lists.length > 1) return findMatching(...lists);
    else if (lists.length == 1) return lists[0];
    else return [];
  }

  nonCarpoolGyms(): string[] {
    let lists: string[][] = [];
    this.people().forEach((m) => lists.push(m.commutableGyms));
    if (lists.length > 1) return findMatching(...lists);
    else if (lists.length == 1) return lists[0];
    else return [];
  }

  carpoolGyms(): string[] {
    let nonCarpoolGyms = this.nonCarpoolGyms();
    return this.commutableGyms().filter( (cg) => !nonCarpoolGyms.includes(cg));
  }

  commutableGyms(): string[] {
    let lists: string[][] = [];

    let people = this.people();

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
    else if (lists.length == 1) return lists[0];
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
    this.people().forEach((m) => {
      lists.push(m.availability);
    });

    if (lists.length > 1) return findMatching(...lists);
    else if (lists.length == 1) return lists[0];
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
    if (this.mentors.length == 0 && this.mentees.length == 0) return true;

    const carpoolCompatible = !person.isSolo() && this.people().filter(p => p.isDriver()).length > 0;
    const matchingGyms = findMatching(this.commutableGyms(), person.commutableGyms).length > 0;
    const personGroupSizeMatch = !(person instanceof Mentor) && this.openSlots() > 0 && person.groupSize > this.mentees.length
    const groupSizeMatch = personGroupSizeMatch || (person instanceof Mentor && this.mentors.length < 2);

    const menteesCompatible = this.mentees.filter(p => !p.compatible(person)).length == 0;
    const mentorsCompatible = this.mentors.filter(p => !p.compatible(person)).length == 0;

    const stylesCompatible = findMatching(this.styles(), person.climbingStyles).length > 0;
    const availabilityCompatible = findMatching(this.availability(), person.availability).length > 0;

    return groupSizeMatch && ( matchingGyms || carpoolCompatible ) && menteesCompatible && mentorsCompatible && stylesCompatible && availabilityCompatible;
  }
}
