import {describe, expect, test} from '@jest/globals';
import { CarpoolStyle, Person, Mentor, Group, Team } from "./models";

describe("Models", () => {

  describe("Team", () => {
    it("calculates styles correctly", () => {
      let p1 = new Person("p1", "e", undefined, ["a", "b", "c"]);
      let p2 = new Person("p2", "e", undefined, ["b", "c", "d"]);
      let p3 = new Person("p3", "e", undefined, ["b", "c", "f"]);

      let m1 = new Mentor("m1", "e", undefined, ["b", "c"]);
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
      let p1 = new Person("p1", "e", undefined, undefined, ["a", "c"], CarpoolStyle.SOLO);
      let p2 = new Person("p2", "e", undefined, undefined, ["a"], CarpoolStyle.DRIVER);
      let p3 = new Person("p3", "e", undefined, undefined, ["b", "c"], CarpoolStyle.PASSENGER);

      let m1 = new Mentor("m1", "e", undefined, undefined, ["a", "c"], CarpoolStyle.DRIVER);
      let m2 = new Mentor("m2", "e", undefined, undefined, ["a", "c"]);

      let team = new Team([p1,p2,p3], [m1,m2]);

      expect(team.commutableGyms()).toEqual(expect.arrayContaining(["a", "c"]));
    })

  })

})
