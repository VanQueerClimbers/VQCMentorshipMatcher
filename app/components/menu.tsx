'use client';
import { React, useState, useRef } from 'react';

const MenuBar = ( { submitCallback, loadCallback, saveCallback } ) => {
  const loadInputRef = useRef(null);
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

  const stateFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        loadCallback(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const loadItem = () => {
    loadInputRef.current.click();
  };

  return (
    <div className="flex bg-slate-400">
      <button
        className="flex-none bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2"
        onClick={saveCallback}>
        Save
      </button>
      <input
        type="file"
        ref={loadInputRef}
        style={{ display: 'none' }}
        accept=".vqc"
        onChange={stateFileChange}/>
      <button
        className="flex-none bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2"
        onClick={loadItem}>
        Load
      </button>
      <form className="flex flex-auto">
        <div className="flex-auto flex py-1 px-2">
          <div className="flex-none">Mentee CSV:</div>
          <input
            className="flex-auto ms-5 w-48"
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
            className="flex-auto ms-5 w-48"
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
          className="flex-none bg-blue-500 hover:bg-blue-600 text-white py-1 px-2"
          onClick={submitPressed}
          />
      </form>
    </div>
  )
};

export default MenuBar;
