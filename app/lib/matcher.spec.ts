import {describe, expect, test} from "@jest/globals";
import { Group, Team, Mentor, Person, CoMentorStyle, CarpoolStyle }from "./models";
import { buildTeams } from "./matcher";

describe("Matcher", () => {
  function createDefaultMentor(name: string): Mentor {
    return new Mentor(
      name,
      "email"+name,
      "pronouns",
      ["1","2","3"],
      ["a","b","c"],
      undefined,
      [".","..","..."],
      2,
      CoMentorStyle.SOLO,
    );
  }

  describe("Mentor Groups", () => {
    it("groups mentors into groups when they want co-mentor and are compatible", () => {
      let group = new Group([], []);
      group.mentors.push(createDefaultMentor("a"));
      group.mentors.push(createDefaultMentor("b"));
      group.mentors.push(createDefaultMentor("c"));
      group.mentors.push(createDefaultMentor("d"));

      let m = createDefaultMentor("e");
      m.wantCoMentor = CoMentorStyle.EITHER;
      m.availability = ["a"];
      m.commutableGyms = ["a", "b", "c"];
      group.mentors.push(m);

      m = createDefaultMentor("f");
      m.wantCoMentor = CoMentorStyle.EITHER;
      m.availability = ["b"];
      m.commutableGyms = ["c"];
      group.mentors.push(m);

      m = createDefaultMentor("g");
      m.wantCoMentor = CoMentorStyle.COMENTOR;
      m.availability = ["b", "a"];
      m.commutableGyms = ["b"];
      group.mentors.push(m);

      m = createDefaultMentor("h");
      m.wantCoMentor = CoMentorStyle.COMENTOR;
      m.availability = ["b", "c"];
      m.commutableGyms = ["c", "d"];
      group.mentors.push(m);

      m = createDefaultMentor("i");
      m.wantCoMentor = CoMentorStyle.COMENTOR;
      m.availability = ["e", "f", "g"];
      m.commutableGyms = ["a", "b"];
      group.mentors.push(m);

      m = createDefaultMentor("j");
      m.wantCoMentor = CoMentorStyle.COMENTOR;
      m.availability = ["e", "f", "g"];
      m.commutableGyms = ["a", "b"];
      group.mentors.push(m);

      let teams = buildTeams(group);
      expect(teams.length).toEqual(7);

      expect(teams.filter((team) => {
        if (team.mentors.length == 1) return false;
        if (team.mentors[0].name == "e") return team.mentors[1].name == "g";
        if (team.mentors[0].name == "g") return team.mentors[1].name == "e";
        if (team.mentors[0].name == "f") return team.mentors[1].name == "h";
        if (team.mentors[0].name == "h") return team.mentors[1].name == "f";
        if (team.mentors[0].name == "i") return team.mentors[1].name == "j";
        if (team.mentors[0].name == "j") return team.mentors[1].name == "i";
      }).length).toEqual(3);
    });

    it("groups comentors with no match on their own", () => {
      let group = new Group([], []);
      let m = createDefaultMentor("e");
      m.wantCoMentor = CoMentorStyle.EITHER;
      m.availability = ["a"];
      m.commutableGyms = ["a", "b", "c"];
      group.mentors.push(m);

      m = createDefaultMentor("f");
      m.wantCoMentor = CoMentorStyle.EITHER;
      m.availability = ["b"];
      m.commutableGyms = ["c"];
      group.mentors.push(m);

      m = createDefaultMentor("g");
      m.wantCoMentor = CoMentorStyle.COMENTOR;
      m.availability = ["b", "a"];
      m.commutableGyms = ["b"];
      group.mentors.push(m);

      let teams = buildTeams(group);
      expect(teams.length).toEqual(2);

      expect(teams.filter((team) => {
        if (team.mentors.length == 1) return false;
        if (team.mentors[0].name == "e") return team.mentors[1].name == "g";
        if (team.mentors[0].name == "g") return team.mentors[1].name == "e";
      }).length).toEqual(1);
    });

    it("prioritizes pickier mentors", () => {
      let group = new Group([], []);
      let m = createDefaultMentor("e");
      m.wantCoMentor = CoMentorStyle.EITHER;
      m.availability = ["a"];
      m.commutableGyms = ["a", "b"];
      group.mentors.push(m);

      m = createDefaultMentor("f");
      m.wantCoMentor = CoMentorStyle.EITHER;
      m.availability = ["a", "b"];
      m.commutableGyms = ["a", "b"];
      group.mentors.push(m);

      m = createDefaultMentor("g");
      m.wantCoMentor = CoMentorStyle.COMENTOR;
      m.availability = ["a"];
      m.commutableGyms = ["b"];
      group.mentors.push(m);

      let teams = buildTeams(group);
      expect(teams.length).toEqual(2);

      expect(teams.filter((team) => {
        if (team.mentors.length == 1) return false;
        if (team.mentors[0].name == "e") return team.mentors[1].name == "g";
        if (team.mentors[0].name == "g") return team.mentors[1].name == "e";
      }).length).toEqual(1);
    });
  });

  describe("Mentee Groups", () => {
    function createDefaultPerson(name: string): Person {
      return new Person(
        name,
        "email"+name,
        "pronouns",
        ["1","2","3"],
        ["a","b","c"],
        undefined,
        [".","..","..."],
        2,
      );
    }

    it("groups mentors into groups when they want co-mentor and are compatible", () => {
      let group = new Group([], []);
      let m = createDefaultMentor("a");
      m.wantCoMentor = CoMentorStyle.SOLO;
      m.availability = ["a"];
      m.commutableGyms = ["a", "b", "c"];
      group.mentors.push(m);

      m = createDefaultMentor("b");
      m.wantCoMentor = CoMentorStyle.EITHER;
      m.availability = ["b"];
      m.commutableGyms = [];
      m.carpoolStyle = CarpoolStyle.PASSENGER;
      group.mentors.push(m);

      m = createDefaultMentor("c");
      m.wantCoMentor = CoMentorStyle.COMENTOR;
      m.availability = ["b"];
      m.commutableGyms = ["c"];
      m.carpoolStyle = CarpoolStyle.DRIVER;
      group.mentors.push(m);

      let p = createDefaultPerson("a");
      p.availability = ["b"];
      p.commutableGyms = ["c"];
      group.mentees.push(p);

      p = createDefaultPerson("b");
      p.availability = ["a"];
      p.commutableGyms = ["c"];
      group.mentees.push(p);

      p = createDefaultPerson("c");
      p.availability = ["a"];
      p.commutableGyms = ["c"];
      group.mentees.push(p);

      let teams = buildTeams(group);
      expect(teams.length).toEqual(2);

      let t1 = teams[0];
      expect(t1.mentors.length).toEqual(1);
      expect(t1.mentors[0].name).toEqual("a");
      expect(t1.mentees.length).toEqual(2);
      expect(t1.mentees[0].name).toEqual("c");
      expect(t1.mentees[1].name).toEqual("b");

      let t2 = teams[1];
      expect(t2.mentors.length).toEqual(2);
      expect(t2.mentors[0].name).toEqual("c");
      expect(t2.mentors[1].name).toEqual("b");
      expect(t2.mentees.length).toEqual(1);
      expect(t2.mentees[0].name).toEqual("a");
    });

    it("incompatible mentees and mentors are returned as the last team in the end", () => {
      let group = new Group([], []);
      let m = createDefaultMentor("a");
      m.wantCoMentor = CoMentorStyle.SOLO;
      m.availability = ["a"];
      m.commutableGyms = ["a"];
      group.mentors.push(m);

      m = createDefaultMentor("b");
      m.wantCoMentor = CoMentorStyle.SOLO;
      m.availability = ["b"];
      m.commutableGyms = ["b"];
      group.mentors.push(m);

      m = createDefaultMentor("e");
      m.wantCoMentor = CoMentorStyle.SOLO;
      m.availability = ["e"];
      m.commutableGyms = ["e"];
      group.mentors.push(m);

      let p = createDefaultPerson("ap");
      p.availability = ["a"];
      p.commutableGyms = ["a"];
      group.mentees.push(p);

      p = createDefaultPerson("bp");
      p.availability = ["b"];
      p.commutableGyms = ["b"];
      group.mentees.push(p);

      p = createDefaultPerson("cp");
      p.availability = ["c"];
      p.commutableGyms = ["c"];
      group.mentees.push(p);

      p = createDefaultPerson("fp");
      p.availability = ["f"];
      p.commutableGyms = ["f"];
      group.mentees.push(p);

      let teams = buildTeams(group);
      expect(teams.length).toEqual(4);

      let t1 = teams[2];
      expect(t1.mentors.length).toEqual(1);
      expect(t1.mentors[0].name).toEqual("a");
      expect(t1.mentees.length).toEqual(1);
      expect(t1.mentees[0].name).toEqual("ap");

      let t2 = teams[1];
      expect(t2.mentors.length).toEqual(1);
      expect(t2.mentors[0].name).toEqual("b");
      expect(t2.mentees.length).toEqual(1);
      expect(t2.mentees[0].name).toEqual("bp");

      let t4 = teams[3];
      expect(t4.mentors.length).toEqual(0);
      expect(t4.mentees.length).toEqual(2);
      expect(t4.mentees[0].name).toEqual("fp");
      expect(t4.mentees[1].name).toEqual("cp");
    });
  });
});
