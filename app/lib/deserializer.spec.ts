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
      expect(m1.uniqueId == m2.uniqueId).toBeFalsy();
    })
  });

  describe("Mentees", () => {
    it("deserializes mentees correctly", () => {
      let deserializer = new Deserializer();
      let results = deserializer.readMentees(MENTEES_CSV);
      expect(results.length).toEqual(2);

      let m1 = results[0];
      expect(m1.name).toEqual("Adam Ondra");
      expect(m1.email).toEqual("flashesonly@climbhard.net");
      expect(m1.pronouns).toEqual("send/train");
      expect(m1.climbingStyles.length).toEqual(3);
      expect(m1.climbingStyles).toEqual(expect.arrayContaining([
        "boulderingadvanced",
        "topropingadvanced",
        "leadclimbingadvanced",
      ]));
      expect(m1.groupSize).toEqual(1);
      expect(m1.commutableGyms.length).toEqual(6);
      expect(m1.commutableGyms).toEqual(expect.arrayContaining([
        "squamishcrags",
        "coquitlambase5",
        "northvancouvercrags",
        "fraservalleycrags",
        "northvancouverbase5",
        "groundupsquamish",
      ]));
      expect(m1.carpoolStyle).toEqual(CarpoolStyle.SOLO);
      expect(m1.availability.length).toEqual(6);
      expect(m1.availability).toEqual(expect.arrayContaining([
        "monday6am-9am",
        "tuesday6am-9am",
        "wednesday6am-9am",
        "thursday6am-9am",
        "friday6am-9am",
        "saturday6am-9am",
      ]));
      expect(m1.otherResponses.length).toEqual(8);

      let m2 = results[1];
      expect(m2.name).toEqual("June (has no last name)");
      expect(m2.email).toEqual("june@gmail.com");
      expect(m2.pronouns).toEqual("it/its");
      expect(m2.climbingStyles.length).toEqual(7);
      expect(m2.climbingStyles).toEqual(expect.arrayContaining([
        "boulderingbeginner",
        "topropingbeginner",
        "leadclimbingbeginner",
        "anchorsystems",
        "tradclimbing",
        "multi-pitching",
        "generaloutdoorsafety",
      ]));
      expect(m2.groupSize).toEqual(3);
      expect(m2.commutableGyms.length).toEqual(5);
      expect(m2.commutableGyms).toEqual(expect.arrayContaining([
        "thehivevancouver",
        "thehivenorthshore",
        "thehivesurrey",
        "thehiveportcoquitlam",
        "projectclimbingcloverdale",
      ]));
      expect(m2.carpoolStyle).toEqual(CarpoolStyle.DRIVER);
      expect(m2.availability.length).toEqual(5);
      expect(m2.availability).toEqual(expect.arrayContaining([
        "monday9am-1pm",
        "wednesday1pm-5pm",
        "thursday5pm-9pm",
        "friday6am-9am",
        "saturday9am-1pm",
      ]));
      expect(m2.otherResponses.length).toEqual(8);
    })

  });
})
