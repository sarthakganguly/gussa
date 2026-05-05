export interface AssessmentQuestion {
  id: string;
  text: string;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  questions: AssessmentQuestion[];
  scoring: (score: number) => string;
}

export const PHQ9: Assessment = {
  id: 'PHQ-9',
  title: 'Depression Screen (PHQ-9)',
  description: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
  questions: [
    { id: 'q1', text: 'Little interest or pleasure in doing things' },
    { id: 'q2', text: 'Feeling down, depressed, or hopeless' },
    { id: 'q3', text: 'Trouble falling or staying asleep, or sleeping too much' },
    { id: 'q4', text: 'Feeling tired or having little energy' },
    { id: 'q5', text: 'Poor appetite or overeating' },
    { id: 'q6', text: 'Feeling bad about yourself — or that you are a failure or have let yourself or your family down' },
    { id: 'q7', text: 'Trouble concentrating on things, such as reading the newspaper or watching television' },
    { id: 'q8', text: 'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual' },
    { id: 'q9', text: 'Thoughts that you would be better off dead or of hurting yourself in some way' },
  ],
  scoring: (score) => {
    if (score <= 4) return 'Minimal';
    if (score <= 9) return 'Mild';
    if (score <= 14) return 'Moderate';
    if (score <= 19) return 'Moderately Severe';
    return 'Severe';
  }
};

export const GAD7: Assessment = {
  id: 'GAD-7',
  title: 'Anxiety Screen (GAD-7)',
  description: 'Over the last 2 weeks, how often have you been bothered by the following problems?',
  questions: [
    { id: 'q1', text: 'Feeling nervous, anxious, or on edge' },
    { id: 'q2', text: 'Not being able to stop or control worrying' },
    { id: 'q3', text: 'Worrying too much about different things' },
    { id: 'q4', text: 'Trouble relaxing' },
    { id: 'q5', text: 'Being so restless that it is hard to sit still' },
    { id: 'q6', text: 'Becoming easily annoyed or irritable' },
    { id: 'q7', text: 'Feeling afraid as if something awful might happen' },
  ],
  scoring: (score) => {
    if (score <= 4) return 'Minimal';
    if (score <= 9) return 'Mild';
    if (score <= 14) return 'Moderate';
    return 'Severe';
  }
};

export const options = [
  { label: 'Not at all', value: 0 },
  { label: 'Several days', value: 1 },
  { label: 'More than half the days', value: 2 },
  { label: 'Nearly every day', value: 3 },
];
