'use client';
import { React, useState } from 'react';

interface ChildProps {
  submitCallback: (mentorData:string, menteeData:string) => void;
}

const MenuBar: React.FC<ChildProps> = ( { submitCallback } ) => {
  const [mentorData, setMentorData] = useState("");
  const [menteeData, setMenteeData] = useState("");

  const handleMenteeCSVChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMenteeData(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleMentorCSVChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMentorData(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const submitPressed = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!menteeData || !mentorData) {
      alert("You need to upload mentor and mentee CSVs.");
    } else {
      submitCallback(menteeData, mentorData);
    }
  };

  return (
      <form className="flex bg-slate-400">
        <div className="flex-auto flex py-1 px-2">
          <div className="flex-none">Mentee CSV:</div>
          <input
            className="flex-auto ms-5"
            type="file"
            id="menteeInput"
            name="menteeInput"
            accept=".csv"
            onChange={handleMenteeCSVChange}
            />
        </div>
        <div className="flex-auto flex py-1 px-2">
          <div className="flex-none">Mentor CSV:</div>
          <input
            className="flex-auto ms-5"
            type="file"
            id="mentorInput"
            name="mentorInput"
            accept=".csv"
            onChange={handleMentorCSVChange}
            />
        </div>
        <input
          type="submit"
          value="Match"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2"
          onClick={submitPressed}
          />
      </form>
  )
};

export default MenuBar;
