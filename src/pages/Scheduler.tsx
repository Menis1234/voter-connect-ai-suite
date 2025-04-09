import React from "react";

const Scheduler = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Campaign Scheduler</h1>
      <p className="text-muted-foreground">
        Schedule campaign events and tasks.
      </p>
      <div className="border rounded-md p-4">
        <p>No scheduled events. Add an event to get started.</p>
      </div>
    </div>
  );
};

export default Scheduler;