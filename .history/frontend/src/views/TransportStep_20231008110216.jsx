import React from "react";
import Stepper from "react-stepper-horizontal";

export default function TransportStep() {
  return (
    <div>
      <Stepper
        steps={[
          { title: "location" },
          { title: "transport" },
          { title: "Step Three" },
          { title: "Step Four" },
        ]}
        activeStep={0}
      />
    </div>
  );
}
