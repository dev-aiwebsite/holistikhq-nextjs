import React, { useState } from 'react';
import { actionsList, triggersList } from '@lib/const';
import { SelectScrollable } from '../ui/select';
import UserList from '../UserList';

export type ActionDataType =  {
    type: string,
    value: string
  }
type ActionCardProps = {
    actionType?: string;
    value: string;
    onChange: (t:ActionDataType)=>void
}
const ActionCard = ({actionType,value,onChange}:ActionCardProps) => {

  // Handler for trigger selection change
  const handleOnActionChange = (v:string) => {
    if (onChange && v) {
      onChange({ type: v, value: "" });
    }
  };
  
  const handleOnValueChange = (v:string)=>{
    if (onChange && actionType) {
      onChange({ type: actionType, value:v});
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg ring-1 ring-gray-200 p-6">
      {/* Trigger selection dropdown */}
      <SelectScrollable onChange={handleOnActionChange} value={actionType} options={actionsList} />

      {/* Conditional rendering based on the selected trigger */}
      <div className="flex items-center flex-row px-3 pt-4">
        {actionType === 'assignee' && (
          <>
            <span className="w-8">Is:</span>
            <UserList className="!w-full !max-w-[100%]" value={value} onChange={handleOnValueChange} />
          </>
        )}
        {actionType === 'status' && (
          <>
            <span className="w-8">Is:</span>
            <input name="status" placeholder='status'/>
          </>
        )}
        {/* Add more conditions for other trigger types */}
      </div>
    </div>
  );
};

export default ActionCard;
