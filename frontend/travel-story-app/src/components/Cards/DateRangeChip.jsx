import moment from 'moment'
import React from 'react'
import { MdOutlineClose } from 'react-icons/md'

const DateRangeChip = ({ date,onClear }) => {
  const startDate = date?.from
    ? moment(date?.from).format("Do MMM YYYY")
    : "Select Starting Date";

  const endDate = date?.to
    ? moment(date?.to).format("Do MMM YYYY")
    : "Select Ending Date";

  return (
    <div className=' flex items-center gap-2 bg-slate-100 px-3 py-2'>
      <p className='text-xs font-medium'>
        {startDate } - { endDate}
      </p>

      <button onClick={onClear}>
        <MdOutlineClose/>
      </button>
    </div>
  )
}

export default DateRangeChip