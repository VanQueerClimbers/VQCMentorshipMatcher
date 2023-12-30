import { Mentor, Person, CoMentorStyle, CarpoolStyle, OtherResponse } from "./models"
import { parse } from "csv-parse/sync"

export class MentorCSVConfig {
  constructor(
    public nameKey: string = "first and last name",
    public emailKey: string = "contact email",
    public pronounsKey: string = "pronouns",
    public climbingStylesKey: string = "styles and skills",
    public wantCoMentorKey: string = "with a partner mentor",
    public groupSizeKey: string = "how many people",
    public commutableGymsKey: string = "comfortable commuting to on your own",
    public carpoolKey: string = "interested in carpooling",

    public mondayKey: string = "monday",
    public tuesdayKey: string = "tuesday",
    public wednesdayKey: string = "wednesday",
    public thursdayKey: string = "thursday",
    public fridayKey: string = "friday",
    public saturdayKey: string = "saturday",
    public sundayKey: string = "sunday",
  ) {}
}

export class MenteeCSVConfig {
  constructor(
    public nameKey: string = "first and last name",
    public emailKey: string = "contact email",
    public pronounsKey: string = "pronouns",
    public climbingStylesKey: string = "skills you would like to work on",
    public groupSizeKey: string = "group size",
    public commutableGymsKey: string = "comfortable commuting to on your own",
    public carpoolKey: string = "interested in carpooling",

    public mondayKey: string = "monday",
    public tuesdayKey: string = "tuesday",
    public wednesdayKey: string = "wednesday",
    public thursdayKey: string = "thursday",
    public fridayKey: string = "friday",
    public saturdayKey: string = "saturday",
    public sundayKey: string = "sunday",
  ) {}
}

export class Deserializer {
  constructor(
    public mentorConfig: MentorCSVConfig = new MentorCSVConfig(),
    public menteeConfig: MenteeCSVConfig = new MenteeCSVConfig(),
    public id = Math.floor(Math.random() * 100) + 1,
  ) {}

  readMentors(data: string): Mentor[] {
    const records: any[] = parse(data, {columns: true, skip_empty_lines: true});
    let mentors: Mentor[] = [];

    records.forEach((r) => {
      mentors.push(this.buildMentor(r));
    });
    return mentors;
  }

  buildMentor(r: any): Mentor {
    let mentor = new Mentor("","","");
    mentor.uniqueId = this.id++;

    for (const key in r) {
      let k = key.toLowerCase().trim();
      if (k.includes(this.mentorConfig.nameKey)) {
        mentor.name = r[key];
      } else if (k.includes(this.mentorConfig.emailKey)) {
        mentor.email = r[key];
      } else if (k.includes(this.mentorConfig.pronounsKey)) {
        mentor.pronouns = r[key];
      } else if (k.includes(this.mentorConfig.climbingStylesKey)) {
        mentor.climbingStyles = r[key].toLowerCase().replace(/(\s|\([^)]*\))/g, "").split(',');
      } else if (k.includes(this.mentorConfig.wantCoMentorKey)) {
        switch (r[key].toLowerCase().trim()) {
          case "with a partner mentor":
            mentor.wantCoMentor = CoMentorStyle.COMENTOR;
            break;
          case "on my own":
            mentor.wantCoMentor = CoMentorStyle.SOLO;
            break;
          default:
            mentor.wantCoMentor = CoMentorStyle.EITHER;
            break;
        }
      } else if (k.includes(this.mentorConfig.groupSizeKey)) {
        mentor.groupSize = parseInt(r[key]);
      } else if (k.includes(this.mentorConfig.commutableGymsKey)) {
        mentor.commutableGyms = r[key].toLowerCase().replace(/(\s|\([^)]*\))/g, "").split(',');
      } else if (k.includes(this.mentorConfig.carpoolKey)) {
        switch (r[key].toLowerCase().trim()) {
          case "yes, i have a car":
            mentor.carpoolStyle = CarpoolStyle.DRIVER;
            break;
          case "yes, i need a ride":
            mentor.carpoolStyle = CarpoolStyle.PASSENGER;
            break;
          default:
            mentor.carpoolStyle = CarpoolStyle.SOLO;
            break;
        }
      } else if (!this.handleDate(mentor, key, r, this.mentorConfig.mondayKey) &&
        !this.handleDate(mentor, key, r, this.mentorConfig.tuesdayKey) &&
        !this.handleDate(mentor, key, r, this.mentorConfig.wednesdayKey) &&
        !this.handleDate(mentor, key, r, this.mentorConfig.thursdayKey) &&
        !this.handleDate(mentor, key, r, this.mentorConfig.fridayKey) &&
        !this.handleDate(mentor, key, r, this.mentorConfig.saturdayKey) &&
        !this.handleDate(mentor, key, r, this.mentorConfig.sundayKey)) {
        mentor.otherResponses.push(new OtherResponse(key, r[key]));
      }
    }

    return mentor;
  }

  handleDate(person: Person, key: string, row: any, targetKey: string): boolean {
    let k = key.toLowerCase().trim();
    if (k.includes(targetKey)) {
      let val: string = row[key].toLowerCase().replace(/\s/g, "");
      if (!val.includes("notavailable")) {
        val.split(",").forEach( (val) => {
          person.availability.push(targetKey+val);
        });
      }
      return true;
    }
    return false
  }

  readMentees(data: string): Person[] {
    const records: any[] = parse(data, {columns: true, skip_empty_lines: true});
    let mentees: Person[] = [];

    records.forEach((r) => {
      mentees.push(this.buildMentee(r));
    });
    return mentees;
  }

  buildMentee(r: any): Person {
    let mentee = new Person("","","");
    mentee.uniqueId = this.id++;

    for (const key in r) {
      let k = key.toLowerCase().trim();
      if (k.includes(this.menteeConfig.nameKey)) {
        mentee.name = r[key];
      } else if (k.includes(this.menteeConfig.emailKey)) {
        mentee.email = r[key];
      } else if (k.includes(this.menteeConfig.pronounsKey)) {
        mentee.pronouns = r[key];
      } else if (k.includes(this.menteeConfig.climbingStylesKey)) {
        mentee.climbingStyles = r[key].toLowerCase().replace(/(\s|\([^)]*\))/g, "").split(',');
      } else if (k.includes(this.menteeConfig.groupSizeKey)) {
        mentee.groupSize = parseInt(r[key]);
      } else if (k.includes(this.menteeConfig.commutableGymsKey)) {
        mentee.commutableGyms = r[key].toLowerCase().replace(/(\s|\([^)]*\))/g, "").split(',');
      } else if (k.includes(this.menteeConfig.carpoolKey)) {
        switch (r[key].toLowerCase().trim()) {
          case "yes, i have a car":
            mentee.carpoolStyle = CarpoolStyle.DRIVER;
            break;
          case "yes, i need a ride":
            mentee.carpoolStyle = CarpoolStyle.PASSENGER;
            break;
          default:
            mentee.carpoolStyle = CarpoolStyle.SOLO;
            break;
        }
      } else if (!this.handleDate(mentee, key, r, this.menteeConfig.mondayKey) &&
        !this.handleDate(mentee, key, r, this.menteeConfig.tuesdayKey) &&
        !this.handleDate(mentee, key, r, this.menteeConfig.wednesdayKey) &&
        !this.handleDate(mentee, key, r, this.menteeConfig.thursdayKey) &&
        !this.handleDate(mentee, key, r, this.menteeConfig.fridayKey) &&
        !this.handleDate(mentee, key, r, this.menteeConfig.saturdayKey) &&
        !this.handleDate(mentee, key, r, this.menteeConfig.sundayKey)) {
        mentee.otherResponses.push(new OtherResponse(key, r[key]));
      }
    }

    return mentee;
  }
}


