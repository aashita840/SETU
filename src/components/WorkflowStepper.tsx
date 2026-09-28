import React from 'react';

const STEPS = ['Inspect', 'Predict', 'Assess Risk', 'Prioritize', 'Find Window', 'Plan Block', 'Check Conflicts', 'Human Approval', 'Audit'];

export const WorkflowStepper: React.FC<{ activeIndex: number }> = ({ activeIndex }) => (
  <div className="workflow-stepper scroll-thin">
    {STEPS.map((s, i) => (
      <React.Fragment key={s}>
        <div className={`wf-step ${i < activeIndex ? 'done' : ''} ${i === activeIndex ? 'active' : ''}`}>
          <div className="wf-step-dot">{i < activeIndex ? '✓' : i + 1}</div>
          <div className="wf-step-label">{s}</div>
        </div>
        {i < STEPS.length - 1 && <div className={`wf-connector ${i < activeIndex ? 'done' : ''}`} />}
      </React.Fragment>
    ))}
  </div>
);
