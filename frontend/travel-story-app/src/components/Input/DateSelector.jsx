import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import { MdOutlineDateRange, MdClose } from "react-icons/md";

const DateSelector = ({ date, setDate }) => {

  const [openDatePicker, setOpenDatePicker] = useState(false);

  return (
    <div>
      <button
        className="inline-flex items-center gap-2 text-[13px] font-medium text-sky-600 bg-sky-200/40 cursor-pointer"
        onClick={() => setOpenDatePicker((prev) => !prev)}
      >
        <MdOutlineDateRange className="text-lg" />
        {date
          ? moment(date).format("D MMMM YYYY")
          : moment().format("D MMMM YYYY")}
      </button>

      {openDatePicker && (<div className="overflow-y-scroll p-5 bg-sky-50/80 rounded-lg relative pt-1">
        <DayPicker
          captionLayout="dropdown-buttons"
          mode="single"
          selected={date}
          onSelect={setDate}
          pageNavigation
        />
      </div>)}
    </div>
  );
};

export default DateSelector;
