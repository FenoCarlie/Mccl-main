import React from "react";

export default function TransportStep() {
  return (
    <div>
      <Stepper
        steps={[
          { title: "Step One" },
          { title: "Step Two" },
          { title: "Step Three" },
          { title: "Step Four" },
        ]}
        activeStep={1}
      />
    </div>
  );
}
