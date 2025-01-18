"use client";

import { Suspense } from "react";
import DateFilter from "./DateFilter";

const DateFilterWrapper = () => {
  return (
    <Suspense fallback={<div>Loading filters...</div>}>
      <DateFilter />
    </Suspense>
  );
};

export default DateFilterWrapper;
