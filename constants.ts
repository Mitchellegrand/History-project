import { Category, HistoryEvent } from './types';

// Exported helper to generate positions along a path
// This can be used by the 3D camera rig to follow the path
export const calculatePathPosition = (index: number): [number, number, number] => {
  const spacing = 18; // Increased spacing for better travel feel
  const curveX = 10;
  const curveY = 4;
  
  return [
    Math.sin(index * 0.35) * curveX,        // X: Wide S-curve
    Math.cos(index * 0.5) * curveY + (index * 2), // Y: Undulating height with upward trend
    index * -spacing                        // Z: Moving forward into depth
  ];
};

export const HISTORY_EVENTS: HistoryEvent[] = [
  {
    id: 'tov-1919',
    year: 1919,
    dateDisplay: 'June 28, 1919',
    title: 'Treaty of Versailles',
    category: Category.WW2,
    description: 'Signed in the Hall of Mirrors at the Palace of Versailles, officially ending WWI.',
    details: [
      'Signed by the "Big Three": Clemenceau (France), Lloyd George (Britain), Orlando (Italy).',
      'Territorial Losses: Germany lost land and colonies.',
      'Military Restrictions: Army limited to 100,000 men, no air force/subs.',
      'Article 231 (War Guilt Clause): Germany forced to accept sole responsibility.',
      'Reparations: Huge sums to be paid to Allies.'
    ],
    position: calculatePathPosition(0)
  },
  {
    id: 'depression-1929',
    year: 1929,
    title: 'The Great Depression',
    category: Category.WW2,
    description: 'Severe global economic downturn starting in 1929.',
    details: [
      'Germany hit hardest in Europe; unemployment rose to 6 million by 1932.',
      'Hitler used the chaos to present Nazis as the only solution (Point 7: provide a livelihood).',
      'Blamed internal enemies (Jews, Communists, Weimar politicians).',
      'Capitalized on social frustration.'
    ],
    position: calculatePathPosition(1)
  },
  {
    id: 'hitler-rise-1933',
    year: 1933,
    title: 'Rise of Hitler & Consolidation',
    category: Category.WW2,
    description: 'Hitler dismantles democracy through crisis and legislation.',
    details: [
      'Reichstag Fire (1933): Used to crush Communists; Decree for Protection of People and State suspended civil liberties.',
      'Enabling Act (1933): Allowed Hitler to pass laws without Reichstag consent.',
      'Führerprinzip: Absolute power centered in Hitler.',
      'Propaganda, Scapegoating, and Terror (SA/SS) used to control populace.'
    ],
    position: calculatePathPosition(2)
  },
  {
    id: 'mourning-1938',
    year: 1938,
    dateDisplay: 'January 26, 1938',
    title: 'Day of Mourning',
    category: Category.RIGHTS,
    description: 'First national gathering of Indigenous people to protest treatment.',
    details: [
      'Held at Australian Hall, Sydney on 150th anniversary of British colonization.',
      'Organized by Jack Patten, William Ferguson, William Cooper.',
      'Protested violence, dispossession, and discrimination.',
      'Demanded full citizenship and education.'
    ],
    position: calculatePathPosition(3)
  },
  {
    id: 'appeasement-1930s',
    year: 1938,
    title: 'Policy of Appeasement',
    category: Category.WW2,
    description: 'Britain and France giving in to Hitler\'s demands to avoid war.',
    details: [
      'Notably associated with Neville Chamberlain.',
      'Allowed Hitler to remilitarize Rhineland and annex Sudetenland.',
      'Emboldened Hitler, convincing him Allies were weak, leading to invasion of Poland.'
    ],
    position: calculatePathPosition(4)
  },
  {
    id: 'ww2-start-1939',
    year: 1939,
    dateDisplay: 'September 1939',
    title: 'Invasion of Poland',
    category: Category.WW2,
    description: 'Germany invades Poland, triggering World War II.',
    details: [
      'Direct result of the failure of Appeasement.',
      'Marks the beginning of global conflict.'
    ],
    position: calculatePathPosition(5)
  },
  {
    id: 'holocaust-1941',
    year: 1941,
    title: 'The Holocaust',
    category: Category.WW2,
    description: 'Systematic state-sponsored murder of 6 million Jews.',
    details: [
      'Driven by biological racism (Aryan vs Subhuman).',
      'Targeted Jews, Roma, disabled people, Soviet POWs, homosexuals.',
      'Camps provided forced labor for war effort ("extermination through labor").',
      'Involved dehumanization, starvation, and arbitrary violence.'
    ],
    position: calculatePathPosition(6)
  },
  {
    id: 'singapore-1942',
    year: 1942,
    dateDisplay: 'February 15, 1942',
    title: 'Fall of Singapore',
    category: Category.WW2,
    description: 'British surrender to Japan; a pivotal moment for Australia.',
    details: [
      '15,000 Australian soldiers captured.',
      'Highlighted vulnerability of Britain as an ally.',
      'Forced Australia to pivot foreign policy towards the United States.'
    ],
    position: calculatePathPosition(7)
  },
  {
    id: 'darwin-1942',
    year: 1942,
    dateDisplay: 'February 19, 1942',
    title: 'Bombing of Darwin',
    category: Category.WW2,
    description: 'Largest single attack on Australia by a foreign power.',
    details: [
      'Air attacks and midget submarine attacks (Sydney Harbour).',
      'Created fear and panic; war brought to the mainland.',
      'Forced total reorganization of Australian defenses.'
    ],
    position: calculatePathPosition(8)
  },
  {
    id: 'kokoda-1942',
    year: 1942,
    title: 'Kokoda Track Campaign',
    category: Category.WW2,
    description: 'Brutal jungle warfare in Papua New Guinea.',
    details: [
      'Australian "Diggers" vs Japanese forces.',
      'Harsh terrain, tropical disease, close-quarters fighting.',
      'Significance: Prevented Japanese from reaching Port Moresby (saving Australia from potential invasion).'
    ],
    position: calculatePathPosition(9)
  },
  {
    id: 'atomic-1945',
    year: 1945,
    dateDisplay: 'August 1945',
    title: 'Atomic Bombs & End of War',
    category: Category.WW2,
    description: 'US drops bombs on Hiroshima and Nagasaki.',
    details: [
      'Forced Japan\'s unconditional surrender.',
      'Formal surrender: Sept 2, 1945 (V-J Day) in Tokyo Bay.',
      'Debate: Saved lives by avoiding invasion vs. unnecessary targeting of civilians.'
    ],
    position: calculatePathPosition(10)
  },
  {
    id: 'freedom-ride-1965',
    year: 1965,
    title: 'Freedom Ride',
    category: Category.RIGHTS,
    description: 'Bus tour led by Charles Perkins to expose rural segregation.',
    details: [
      'Student Action for Aborigines (SAFA).',
      'Targeted pools, RSL clubs, hotels.',
      'Media coverage created national outrage.',
      'Forced urban Australians to confront rural racism.'
    ],
    position: calculatePathPosition(11)
  },
  {
    id: 'gurindji-1966',
    year: 1966,
    title: 'Gurindji Strike (Wave Hill)',
    category: Category.RIGHTS,
    description: 'Walk-off by Vincent Lingiari and stockmen demanding land rights.',
    details: [
      'Lasted 9 years (until 1975).',
      'Demanded equal pay and return of traditional lands from Vestey\'s.',
      '1975: PM Gough Whitlam pours sand into Lingiari\'s hand, symbolizing return of land.',
      'Foundational moment for Land Rights movement.'
    ],
    position: calculatePathPosition(12)
  },
  {
    id: 'referendum-1967',
    year: 1967,
    title: '1967 Referendum',
    category: Category.RIGHTS,
    description: 'Vote to change the Constitution regarding Indigenous people.',
    details: [
      '90.77% YES vote (highest ever).',
      'Allowed Indigenous people to be counted in census.',
      'Allowed Federal Govt to make special laws for Indigenous people.',
      'Massive symbolic victory.'
    ],
    position: calculatePathPosition(13)
  },
  {
    id: 'tent-embassy-1972',
    year: 1972,
    dateDisplay: 'January 26, 1972',
    title: 'Aboriginal Tent Embassy',
    category: Category.RIGHTS,
    description: 'Protest camp on lawns of Old Parliament House.',
    details: [
      'Response to refusal of land rights.',
      'Symbolized that Indigenous sovereignty was never ceded.',
      'Longest-running Indigenous political protest in the world.'
    ],
    position: calculatePathPosition(14)
  },
  {
    id: 'mabo-1992',
    year: 1992,
    dateDisplay: 'June 3, 1992',
    title: 'Mabo Decision',
    category: Category.RIGHTS,
    description: 'High Court overturns "Terra Nullius".',
    details: [
      'Established legal concept of Native Title.',
      'Recognized land rights survived British occupation where connection to land was continuous.',
      'Led to Native Title Act 1993.'
    ],
    position: calculatePathPosition(15)
  }
];