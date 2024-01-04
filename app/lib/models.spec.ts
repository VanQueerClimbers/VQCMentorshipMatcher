import {describe, expect, test} from '@jest/globals';
import { CarpoolStyle, CoMentorStyle, Person, Mentor, Group, Team } from "./models";

describe("Models", () => {

  describe("Person", () => {
    it("calculates compatibiliity no carpool", () => {
      let p1 = new Person("name", "email1", undefined, ["a", "b"], ["1","2"], undefined, [".", "..", "..."]);
      let styles = new Person("name", "email2", undefined, ["a", "b"], [], undefined, []);
      let gyms = new Person("name", "email3", undefined, [], ["1","2"], undefined, []);
      let availability = new Person("name", "email4", undefined, [], [], undefined, [".","..","..."]);
      let compatible = new Person("name", "email5", undefined, ["b"], ["2"], undefined, ["..."]);

      expect(p1.compatible(styles)).toBeFalsy();
      expect(p1.compatible(gyms)).toBeFalsy();
      expect(p1.compatible(availability)).toBeFalsy();
      expect(p1.compatible(compatible)).toBeTruthy();
    });

    it("calculates compatibiliity with carpool", () => {
      let driver = new Person("name", "email1", undefined, ["a", "b"], ["1","2"], CarpoolStyle.DRIVER, [".", "..", "..."]);
      let passenger = new Person("name", "email2", undefined, ["a", "b"], [], CarpoolStyle.PASSENGER, [".", "..", "..."]);
      let solo_compatible = new Person("name", "email3", undefined, ["a", "b"], ["1"], CarpoolStyle.SOLO, [".", "..", "..."]);
      let solo_incompatible = new Person("name", "email4", undefined, ["a", "b"], [], CarpoolStyle.SOLO, [".", "..", "..."]);

      expect(driver.compatible(passenger)).toBeTruthy();
      expect(driver.compatible(solo_compatible)).toBeTruthy();
      expect(driver.compatible(solo_incompatible)).toBeTruthy(); // there may be another driver in the team
      expect(solo_compatible.compatible(solo_incompatible)).toBeFalsy();
    });
  });

  describe("Mentor", () => {
    it("calculates compatibility", () => {
      let comentor = new Mentor("name", "email1", undefined, ["b"], ["2"], undefined, ["..."], undefined, undefined, CoMentorStyle.COMENTOR);
      let either = new Mentor("name", "email2", undefined, ["b"], ["2"], undefined, ["..."], undefined, undefined, CoMentorStyle.EITHER);
      let solo = new Mentor("name", "email3", undefined, ["b"], ["2"], undefined, ["..."], undefined, undefined, CoMentorStyle.SOLO);

      expect(comentor.compatible(either)).toBeTruthy();
      expect(comentor.compatible(solo)).toBeFalsy();
      expect(solo.compatible(either)).toBeFalsy();
    });

    it("solo not compatibile with solo", () => {
      let solo1 = new Mentor("name", "email2", undefined, ["b"], ["2"], undefined, ["..."], undefined, undefined, CoMentorStyle.SOLO);
      let solo = new Mentor("name", "email3", undefined, ["b"], ["2"], undefined, ["..."], undefined, undefined, CoMentorStyle.SOLO);

      expect(solo.compatible(solo1)).toBeFalsy();
    });
  });


  describe("Team", () => {
    it("calculates styles correctly", () => {
      let p1 = new Person("p1", "a", undefined, ["a", "b", "c"]);
      let p2 = new Person("p2", "b", undefined, ["b", "c", "d"]);
      let p3 = new Person("p3", "c", undefined, ["b", "c", "f"]);

      let m1 = new Mentor("m1", "d", undefined, ["b", "c"]);
      let m2 = new Mentor("m2", "e", undefined, ["b", "c", "a"]);

      let team = new Team([p1,p2,p3], [m1,m2]);

      expect(team.styles()).toEqual(expect.arrayContaining(["b", "c"]));
    })

    it("calculates gyms correctly", () => {
      let p1 = new Person("p1", "e", undefined, undefined, ["a", "b", "c"]);
      let p2 = new Person("p2", "e", undefined, undefined, ["b", "c", "d"]);
      let p3 = new Person("p3", "e", undefined, undefined, ["b", "c", "f"]);

      let m1 = new Mentor("m1", "e", undefined, undefined, ["b", "c"]);
      let m2 = new Mentor("m2", "e", undefined, undefined, ["b", "c", "a"]);

      let team = new Team([p1,p2,p3], [m1,m2]);

      expect(team.commutableGyms()).toEqual(expect.arrayContaining(["b", "c"]));
    })


    it("creates carpool group", () => {
      let p1 = new Person("p1", "e", undefined, undefined, undefined, CarpoolStyle.SOLO);
      let p2 = new Person("p2", "e", undefined, undefined, undefined, CarpoolStyle.PASSENGER);
      let p3 = new Person("p3", "e", undefined, undefined, undefined, CarpoolStyle.DRIVER);

      let m1 = new Mentor("m1", "e", undefined, undefined, undefined, CarpoolStyle.DRIVER);
      let m2 = new Mentor("m2", "e", undefined, undefined, undefined, CarpoolStyle.PASSENGER);

      let team = new Team([p1,p2,p3], [m1,m2]);

      expect(team.carpoolGroup()).toEqual(expect.arrayContaining([p2, p3, m1, m2]));
    })

    it("calculates availability correctly", () => {
      let p1 = new Person("p1", "e", undefined, undefined, undefined, undefined, ["a", "b", "c"]);
      let p2 = new Person("p2", "e", undefined, undefined, undefined, undefined, ["a", "b", "d"]);
      let p3 = new Person("p3", "e", undefined, undefined, undefined, undefined, ["a", "b", "e"]);

      let m1 = new Mentor("m1", "e", undefined, undefined, undefined, undefined, ["a", "b", "f"]);
      let m2 = new Mentor("m2", "e", undefined, undefined, undefined, undefined, ["b", "g"]);

      let team = new Team([p1,p2,p3], [m1,m2]);

      expect(team.availability()).toEqual(expect.arrayContaining(["b"]));
    })


    it("carpool drivers don't have to drive to gyms they don't commute to", () => {
      let p1 = new Person("p1", "e", undefined, undefined, ["a", "c"], CarpoolStyle.SOLO);
      let p2 = new Person("p2", "e", undefined, undefined, ["a"], CarpoolStyle.DRIVER);
      let p3 = new Person("p3", "e", undefined, undefined, ["b", "c"], CarpoolStyle.PASSENGER);

      let m1 = new Mentor("m1", "e", undefined, undefined, ["a", "c"]);
      let m2 = new Mentor("m2", "e", undefined, undefined, ["a", "c"]);

      let team = new Team([p1,p2,p3], [m1,m2]);

      expect(team.commutableGyms()).toEqual(expect.arrayContaining(["a"]));
    })

    it("supports gyms based on multiple drivers", () => {
      let p1 = new Person("p1", "a", undefined, undefined, ["a", "c"], CarpoolStyle.SOLO);
      let p2 = new Person("p2", "b", undefined, undefined, ["a"], CarpoolStyle.DRIVER);
      let p3 = new Person("p3", "c", undefined, undefined, ["b", "c"], CarpoolStyle.PASSENGER);

      let m1 = new Mentor("m1", "e", undefined, undefined, ["a", "c"], CarpoolStyle.DRIVER);
      let m2 = new Mentor("m2", "e", undefined, undefined, ["a", "c"]);

      let team = new Team([p1,p2,p3], [m1,m2]);

      expect(team.nonCarpoolGyms().length).toEqual(0);
      expect(team.carpoolGyms()).toEqual(expect.arrayContaining(["a", "c"]));
      expect(team.commutableGyms()).toEqual(expect.arrayContaining(["a", "c"]));
    })

    it("returns all gyms as non carpool if one person in team", () => {
      let m1 = new Mentor("m1", "e", undefined, undefined, ["a", "c"], CarpoolStyle.DRIVER);
      let team = new Team([], [m1]);
      expect(team.carpoolGyms().length).toEqual(0);
      expect(team.nonCarpoolGyms()).toEqual(expect.arrayContaining(["a", "c"]));
      expect(team.commutableGyms()).toEqual(expect.arrayContaining(["a", "c"]));

    });

    it("correctly calculates spaces in the team", () => {
      let m1 = new Mentor("m1", "a", undefined, ["a"], ["a", "b"], CarpoolStyle.DRIVER, ["a", "b"], 3);
      let m2 = new Mentor("m2", "b", undefined, ["a"], ["a", "b"], CarpoolStyle.DRIVER, ["a", "b"], 4);

      let team = new Team([], [m1,m2]);
      expect(team.openSlots()).toEqual(3);

      team.mentees.push(new Person("p1", "e", undefined, ["a"], ["a", "c"], CarpoolStyle.SOLO, [], 2));
      expect(team.openSlots()).toEqual(1);
    })

    it("correctly calculates compatibility", () => {
      let m1 = new Mentor("m1", "a", undefined, ["a"], ["a", "b"], CarpoolStyle.DRIVER, ["a", "b"], 2);

      let p1 = new Person("p1", "b", undefined, [], ["a", "b"], CarpoolStyle.SOLO, ["a", "b"]);
      let p2 = new Person("p1", "c", undefined, ["a"], ["c"], CarpoolStyle.SOLO, ["a", "b"]);
      let p3 = new Person("p1", "d", undefined, ["a"], ["a", "b"], CarpoolStyle.SOLO, ["c"]);
      let p4 = new Person("p1", "e", undefined, ["a"], ["b"], CarpoolStyle.SOLO, ["a"]);

      let team = new Team([], [m1]);

      expect(team.compatible(p1)).toBeFalsy();
      expect(team.compatible(p2)).toBeFalsy();
      expect(team.compatible(p3)).toBeFalsy();
      expect(team.compatible(p4)).toBeTruthy();
    })

    it("empty team always compatible", () => {
      let p1 = new Person("p1", "e", undefined, undefined, undefined, undefined, ["a", "b", "c"]);

      let team = new Team();

      expect(team.compatible(p1)).toBeTruthy();
    })

    it("compatibility considers the new persons group size", () => {
      let m1 = new Mentor("m1", "e", undefined, ["a"], ["a", "b"], CarpoolStyle.DRIVER, ["a", "b"], 2);
      let p1 = new Person("p1", "f", undefined, ["a"], ["a", "b"], CarpoolStyle.SOLO, ["a", "b"]);
      let team = new Team([p1], [m1]);

      let p2 = new Person("p1", "g", undefined, ["a"], ["b"], CarpoolStyle.SOLO, ["a"], 1);

      expect(team.compatible(p2)).toBeFalsy();
    })

    it("compatibility ignores group size for mentors", () => {
      let m1 = new Mentor("m1", "e", undefined, ["a"], ["a", "b"], CarpoolStyle.DRIVER, ["a", "b"], 1, undefined, CoMentorStyle.EITHER);
      let p1 = new Person("p1", "f", undefined, ["a"], ["a", "b"], CarpoolStyle.SOLO, ["a", "b"]);
      let team = new Team([p1], [m1]);

      let m2 = new Mentor("m2", "g", undefined, ["a"], ["a", "b"], CarpoolStyle.DRIVER, ["a", "b"], 1, undefined, CoMentorStyle.EITHER);

      expect(team.compatible(m2)).toBeTruthy();
    })

    // some people sign up to be both mentors and mentees. We don't want to
    // match them with themselves
    it("compatibility does not allow members with same email address", () => {
      let m1 = new Mentor("m1", "e", undefined, ["a"], ["b"], CarpoolStyle.DRIVER, ["a"]);
      let team = new Team([], [m1]);

      let p2 = new Person("p1", "e", undefined, ["a"], ["b"], CarpoolStyle.SOLO, ["a"]);
      expect(team.compatible(p2)).toBeFalsy();
    })

    it("compatibility doesn't allow 2 solo mentors", () => {
      let solo1 = new Mentor("name", "email2", undefined, ["b"], ["2"], undefined, ["..."], undefined, undefined, CoMentorStyle.SOLO);
      let solo = new Mentor("name", "email3", undefined, ["b"], ["2"], undefined, ["..."], undefined, undefined, CoMentorStyle.SOLO);

      let team = new Team([], [solo1]);

      expect(team.compatible(solo)).toBeFalsy();
    })

    it("compatibility doesn't allow more than 2 mentors", () => {
      let m1 = new Mentor("name", "email2", undefined, ["b"], ["2"], undefined, ["..."], 3, undefined, CoMentorStyle.EITHER);
      let m2 = new Mentor("name", "email3", undefined, ["b"], ["2"], undefined, ["..."], 3, undefined, CoMentorStyle.EITHER);
      let m3 = new Mentor("name", "email4", undefined, ["b"], ["2"], undefined, ["..."], 3, undefined, CoMentorStyle.EITHER);

      let team = new Team([], [m1,m2]);

      expect(team.compatible(m3)).toBeFalsy();
    })
  })

})
