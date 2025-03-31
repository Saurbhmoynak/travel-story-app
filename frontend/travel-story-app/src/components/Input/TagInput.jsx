import React, { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";
import { GrMapLocation } from "react-icons/gr";

const TagInput = ({ tags, setTags }) => {
  // State to manage the input value
  const [inputValue, setInputValue] = useState([]);

  // Function to add a new tag when Enter is pressed or button is clicked
  const addNewTag = () => {
    if (inputValue.trim() !== "") {
      // Ensure input is not empty or only whitespace
      setTags([...tags, inputValue.trim()]); // Add new tag to the existing list
      setInputValue(""); // Clear the input field after adding the tag
    }
  };

  // Function to update state as the user types
  const handleInputChange = (e) => {
    setInputValue(e.target.value); // Update state with user input
  };

  // Function to handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // Check if Enter key is pressed
      addNewTag(); // Call function to add tag
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  }

  return (
    <div>
      {/* {JSON.stringify(tags)} */}

      {tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-2">
          {tags.map((tag, index) => (
            <span key={index} className="flex items-center gap-2 text-sm text-cyan-600 bg-cyan-200/40 px-3 py-1 rounded ">
              <GrMapLocation className="text-sm" /> {tag}
              <button onClick={() => handleRemoveTag(tag)}>
                <MdClose />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-4 mt-3">
        <input
          type="text"
          value={inputValue}
          className="text-sm bg-transparent border px-3 py-2 rounded outline-none border-slate-300"
          placeholder="Add Location"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />

        <button
          className="w-8 h-8 flex items-center justify-center rounded border border-cyan-500 hover:bg-cyan-500"
          onClick={addNewTag}
        >
          <MdAdd className="text-2xl text-cyan-500 hover:text-white" />
        </button>
      </div>
    </div>
  );
};

export default TagInput;
