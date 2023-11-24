import {describe, expect, test} from "@jest/globals";
import { CarpoolStyle, CoMentorStyle } from "./models";
import { Deserializer, MentorCSVConfig } from "./deserializer";
import { MENTORS_CSV, MENTEES_CSV } from "./deserializer.spec.data";


describe("Deserializer", () => {
  describe("Mentors", () => {
    it("deserializes mentors correctly", () => {
      let deserializer = new Deserializer();
      let results = deserializer.readMentors(MENTORS_CSV);
      expect(results.length).toEqual(2);

      let m1 = results[0];
      expect(m1.name).toEqual("Mentor Michal");
      expect(m1.email).toEqual("mentor@michal.com");
      expect(m1.pronouns).toEqual("they/them");
      expect(m1.climbingStyles.length).toEqual(9);
      expect(m1.climbingStyles).toEqual(expect.arrayContaining([
        "boulderingbeginner",
        "boulderingnovice",
        "boulderingintermediate",
        "topropingbeginner",
        "topropebelaying",
        "topropingintermediate",
        "leadclimbingintermediate",
        "multi-pitching",
        "generaloutdoorsafety",
      ]));
      expect(m1.wantCoMentor).toEqual(CoMentorStyle.COMENTOR);
      expect(m1.groupSize).toEqual(2);
      expect(m1.commutableGyms.length).toEqual(5);
      expect(m1.commutableGyms).toEqual(expect.arrayContaining([
        "squamishcrags",
        "coquitlambase5",
        "thehivevancouver",
        "thehivenorthshore",
        "thehiveportcoquitlam",
      ]));
      expect(m1.carpoolStyle).toEqual(CarpoolStyle.DRIVER);
      expect(m1.availability.length).toEqual(6);
      expect(m1.availability).toEqual(expect.arrayContaining([
        "wednesday6am-9am",
        "wednesday1pm-5pm",
        "thursday1pm-5pm",
        "friday5pm-9pm",
        "saturday6am-9am",
        "saturday5pm-9pm",
      ]));
      expect(m1.otherResponses.length).toEqual(12);

      let m2 = results[1];
      expect(m2.name).toEqual("Mentor Dacko");
      expect(m2.email).toEqual("mentor@dacko.com");
      expect(m2.pronouns).toEqual("ze/zim");
      expect(m2.climbingStyles.length).toEqual(7);
      expect(m2.climbingStyles).toEqual(expect.arrayContaining([
        "boulderingnovice",
        "boulderingadvanced",
        "topropingbeginner",
        "topropebelaying",
        "topropingnovice",
        "leadclimbingbeginner",
        "anchorsystems",
      ]));
      expect(m2.wantCoMentor).toEqual(CoMentorStyle.EITHER);
      expect(m2.groupSize).toEqual(3);
      expect(m2.commutableGyms.length).toEqual(5);
      expect(m2.commutableGyms).toEqual(expect.arrayContaining([
        "northvancouverbase5",
        "thehivevancouver",
        "thehivenorthshore",
        "thehivesurrey",
        "thehiveportcoquitlam",
      ]));
      expect(m2.carpoolStyle).toEqual(CarpoolStyle.SOLO);
      expect(m2.availability.length).toEqual(10);
      expect(m2.availability).toEqual(expect.arrayContaining([
        "tuesday9am-1pm",
        "tuesday5pm-9pm",
        "wednesday6am-9am",
        "wednesday5pm-9pm",
        "thursday9am-1pm",
        "thursday5pm-9pm",
        "friday6am-9am",
        "friday9am-1pm",
        "friday1pm-5pm",
        "sunday6am-9am"
      ]));
    })
  });

  describe("Mentees", () => {
    it("deserializes mentees correctly", () => {
      let deserializer = new Deserializer();
      let results = deserializer.readMentors(MENTEES_CSV);
      expect(results.length).toEqual(2);
    })

  });
})
