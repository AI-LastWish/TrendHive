"use client";

import React, { Suspense } from "react";
import SummaryFilter, { Summary } from "./SummaryFilter"; // Import Summary interface

const SummaryFilterWrapper = ({ summaries }: { summaries: Summary[] }) => {
  return (
    <Suspense fallback={<div>Loading summaries...</div>}>
      <SummaryFilter summaries={summaries} />
    </Suspense>
  );
};

export default SummaryFilterWrapper;
