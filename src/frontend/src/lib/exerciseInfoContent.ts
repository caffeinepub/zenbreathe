export interface ExerciseInfoSection {
  title: string;
  content: string[];
}

export interface ExerciseInfo {
  title: string;
  intro: string;
  sections: ExerciseInfoSection[];
}

export const EXERCISE_INFO_CONTENT: Record<string, ExerciseInfo> = {
  'equal-breathing': {
    title: 'Equal Breathing',
    intro: 'Equal Breathing is a simple yet powerful technique where you inhale and exhale for the same count. It helps balance your nervous system and brings a sense of calm. This practice is perfect when you just had an exhausting day. It can also help you fall asleep faster, if you do it before going to bed.',
    sections: [
      {
        title: 'Instructions',
        content: [
          'Begin by sitting or lying down in a comfortable position.',
          'All inhalations and exhalations should be made through your nose, which adds a slight, natural resistance to your breath.',
          'Step 1: Breathe in through your nose to a count of four.',
          'Step 2: Exhale through your nose to a count of four.',
          'Continue this pattern for several minutes, maintaining equal counts for both inhale and exhale.',
        ],
      },
      {
        title: 'BENEFITS',
        content: [
          'This exercise helps you to relax, focus, and be present.',
          'The regular practice of this exercise makes us aware of every moment of the breathing cycle. This awareness doesn\'t let mind fickle on other thoughts & hence a good preparatory exercise for meditation.',
          'A few minutes of Equal Breathing can help calm you right down (in some cases literally by lowering blood pressure and breathing rate).',
        ],
      },
      {
        title: 'TIPS',
        content: [
          'Start with a count that feels comfortable and gradually increase as you become more practiced.',
          'Focus on making your breath smooth and controlled.',
          'If you feel dizzy or uncomfortable, return to normal breathing.',
        ],
      },
    ],
  },
  'box-breathing': {
    title: 'Box Breathing',
    intro: 'Box Breathing, also known as square breathing, is a technique used by Navy SEALs and athletes to stay calm under pressure. By breathing in a "box" pattern with equal counts for inhale, hold, exhale, and hold, you can quickly reduce stress and improve focus. This method is excellent for managing anxiety and enhancing mental clarity.',
    sections: [
      {
        title: 'Instructions',
        content: [
          'Sit upright in a comfortable position with your feet flat on the floor.',
          'Close your eyes or maintain a soft gaze downward.',
          'Step 1: Inhale slowly through your nose for a count of four.',
          'Step 2: Hold your breath for a count of four.',
          'Step 3: Exhale slowly through your nose for a count of four.',
          'Step 4: Hold your breath again for a count of four.',
          'Repeat this cycle for several minutes, visualizing a box as you breathe.',
        ],
      },
      {
        title: 'BENEFITS',
        content: [
          'Box Breathing is a powerful stress reliever that can help you regain control during high-pressure situations.',
          'Regular practice can improve concentration, reduce anxiety, and enhance overall emotional regulation.',
          'This technique activates the parasympathetic nervous system, promoting a state of calm and relaxation.',
          'It can help lower cortisol levels and improve cardiovascular health over time.',
        ],
      },
      {
        title: 'WHEN TO USE',
        content: [
          'Before important meetings or presentations to calm nerves.',
          'During moments of high stress or anxiety.',
          'As a daily practice to build resilience and mental clarity.',
          'Before bed to help transition into a restful state.',
        ],
      },
    ],
  },
  '4-7-8': {
    title: '4-7-8 Breathing',
    intro: 'The 4-7-8 Breathing technique, developed by Dr. Andrew Weil, is a natural tranquilizer for the nervous system. By inhaling for 4 counts, holding for 7, and exhaling for 8, you activate your body\'s relaxation response. This method is particularly effective for promoting better sleep and reducing anxiety.',
    sections: [
      {
        title: 'Instructions',
        content: [
          'Sit or lie down in a comfortable position with your back straight.',
          'Place the tip of your tongue against the ridge behind your upper front teeth throughout the exercise.',
          'Step 1: Exhale completely through your mouth, making a whoosh sound.',
          'Step 2: Close your mouth and inhale quietly through your nose for a count of 4.',
          'Step 3: Hold your breath for a count of 7.',
          'Step 4: Exhale completely through your mouth for a count of 8, making a whoosh sound.',
          'This completes one cycle. Repeat for 3-4 cycles initially.',
        ],
      },
      {
        title: 'BENEFITS',
        content: [
          '4-7-8 Breathing promotes better sleep by calming the mind and body.',
          'It helps reduce anxiety and manage stress responses effectively.',
          'Regular practice can lower blood pressure and improve heart rate variability.',
          'This technique can help you fall asleep faster when practiced before bed.',
          'It serves as a natural remedy for managing anger and frustration.',
        ],
      },
      {
        title: 'IMPORTANT NOTES',
        content: [
          'The ratio of 4:7:8 is more important than the speed of counting.',
          'Start with 4 cycles and gradually increase as you become comfortable.',
          'You may feel slightly lightheaded initially - this is normal and will pass.',
          'Practice twice daily for best results.',
          'Avoid practicing while standing until you\'re experienced with the technique.',
        ],
      },
    ],
  },
  'breath-holding-test': {
    title: 'Breath Holding Test',
    intro: 'The Breath Holding Test is a simple assessment of your respiratory fitness and CO2 tolerance. By measuring how long you can comfortably hold your breath after a normal exhale, you gain insight into your breathing efficiency and overall lung capacity. Regular testing can help track improvements in your breathing practice.',
    sections: [
      {
        title: 'Instructions',
        content: [
          'Sit comfortably in an upright position.',
          'Breathe normally for a few cycles to establish a baseline.',
          'Step 1: Take a normal breath in (not a deep breath).',
          'Step 2: Exhale normally.',
          'Step 3: Hold your breath and start the timer.',
          'Step 4: Stop the timer when you feel the first urge to breathe.',
          'Record your time and note how you feel.',
        ],
      },
      {
        title: 'BENEFITS',
        content: [
          'Test your breath-holding capacity and track progress over time.',
          'Assess your CO2 tolerance and respiratory fitness.',
          'Identify areas for improvement in your breathing practice.',
          'Build mental resilience and body awareness.',
          'Monitor the effectiveness of your breathing training.',
        ],
      },
      {
        title: 'INTERPRETATION',
        content: [
          'Less than 20 seconds: Your breathing may benefit from regular practice.',
          '20-40 seconds: Average breath-holding capacity.',
          '40-60 seconds: Good respiratory fitness and CO2 tolerance.',
          'Over 60 seconds: Excellent breath control and lung capacity.',
          'Remember: This is not a competition. Stop immediately if you feel uncomfortable.',
        ],
      },
      {
        title: 'SAFETY',
        content: [
          'Never practice breath holding while swimming or in water.',
          'Stop immediately if you feel dizzy, lightheaded, or uncomfortable.',
          'Do not push yourself to extremes - the first urge to breathe is your signal.',
          'Consult a healthcare provider if you have respiratory conditions.',
          'Practice in a safe, seated position.',
        ],
      },
    ],
  },
};
