import { 
  Book, 
  Chapter, 
  KeyEvent, 
  Theme, 
  ThemeQuote, 
  ThemeIntensity, 
  Character,
  Relationship,
  AiAnalysis,
  GraphData,
  NarrativeData,
  ThemeHeatmapData,
  CharacterPersona,
  LibrarianPersona,
  Conversation,
  Message,
  ChatMode
} from '@shared/schema';

// Book data
export const bookData: Book = {
  id: 1,
  title: "1984",
  author: "George Orwell",
  coverUrl: "https://images.unsplash.com/photo-1600189261867-30e5ffe7b8da?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
  publicationYear: 1949
};

// Chapter data
export const chapterData: Chapter[] = [
  { id: 1, bookId: 1, number: 1, title: "Chapter 1", sentimentScore: -0.65, tensionScore: 0.7 },
  { id: 2, bookId: 1, number: 2, title: "Chapter 2", sentimentScore: -0.7, tensionScore: 0.65 },
  { id: 3, bookId: 1, number: 3, title: "Chapter 3", sentimentScore: -0.6, tensionScore: 0.6 },
  { id: 4, bookId: 1, number: 4, title: "Chapter 4", sentimentScore: -0.5, tensionScore: 0.55 },
  { id: 5, bookId: 1, number: 5, title: "Chapter 5", sentimentScore: -0.55, tensionScore: 0.6 },
  { id: 6, bookId: 1, number: 6, title: "Chapter 6", sentimentScore: -0.45, tensionScore: 0.7 },
  { id: 7, bookId: 1, number: 7, title: "Chapter 7", sentimentScore: -0.4, tensionScore: 0.75 },
  { id: 8, bookId: 1, number: 8, title: "Chapter 8", sentimentScore: -0.3, tensionScore: 0.8 },
  { id: 9, bookId: 1, number: 9, title: "Chapter 9", sentimentScore: -0.35, tensionScore: 0.85 },
  { id: 10, bookId: 1, number: 10, title: "Chapter 10", sentimentScore: -0.5, tensionScore: 0.9 },
  { id: 11, bookId: 1, number: 11, title: "Chapter 11", sentimentScore: -0.6, tensionScore: 0.85 },
  { id: 12, bookId: 1, number: 12, title: "Chapter 12", sentimentScore: -0.7, tensionScore: 0.8 },
  { id: 13, bookId: 1, number: 13, title: "Chapter 13", sentimentScore: -0.75, tensionScore: 0.75 },
  { id: 14, bookId: 1, number: 14, title: "Chapter 14", sentimentScore: -0.8, tensionScore: 0.85 },
  { id: 15, bookId: 1, number: 15, title: "Chapter 15", sentimentScore: -0.85, tensionScore: 0.9 },
  { id: 16, bookId: 1, number: 16, title: "Chapter 16", sentimentScore: -0.9, tensionScore: 0.95 },
  { id: 17, bookId: 1, number: 17, title: "Chapter 17", sentimentScore: -0.95, tensionScore: 1.0 },
  { id: 18, bookId: 1, number: 18, title: "Chapter 18", sentimentScore: -0.9, tensionScore: 0.9 },
  { id: 19, bookId: 1, number: 19, title: "Chapter 19", sentimentScore: -0.85, tensionScore: 0.85 },
  { id: 20, bookId: 1, number: 20, title: "Chapter 20", sentimentScore: -0.8, tensionScore: 0.8 },
  { id: 21, bookId: 1, number: 21, title: "Chapter 21", sentimentScore: -0.75, tensionScore: 0.75 },
  { id: 22, bookId: 1, number: 22, title: "Chapter 22", sentimentScore: -0.85, tensionScore: 0.85 },
  { id: 23, bookId: 1, number: 23, title: "Chapter 23", sentimentScore: -0.95, tensionScore: 0.95 }
];

// Key events
export const keyEventData: KeyEvent[] = [
  {
    id: 1,
    bookId: 1,
    chapterId: 1,
    title: "Introduction to Winston Smith",
    description: "Winston begins his diary, committing thoughtcrime in his apartment while hiding from the telescreen.",
    eventType: "Exposition",
    tensionLevel: "High",
    sentimentType: "Negative"
  },
  {
    id: 2,
    bookId: 1,
    chapterId: 8,
    title: "Meeting with O'Brien",
    description: "Winston and Julia meet with O'Brien, believing he is a member of the Brotherhood resistance movement.",
    eventType: "Rising Action",
    tensionLevel: "Medium",
    sentimentType: "Mixed"
  },
  {
    id: 3,
    bookId: 1,
    chapterId: 23,
    title: "Room 101",
    description: "Winston faces his worst fear in Room 101, finally betraying Julia and accepting his love for Big Brother.",
    eventType: "Climax",
    tensionLevel: "Extreme",
    sentimentType: "Very Negative"
  }
];

// Theme data
export const themeData: Theme[] = [
  {
    id: 1,
    bookId: 1,
    name: "Totalitarianism",
    description: "Orwell explores the mechanisms and consequences of totalitarian government, showing how the Party maintains power through surveillance, propaganda, and violence.",
    prominenceScore: 92,
    themeType: "Primary Theme"
  },
  {
    id: 2,
    bookId: 1,
    name: "Surveillance",
    description: "The novel examines how constant monitoring affects human behavior and psychology, with telescreens, microphones, and the Thought Police creating an atmosphere of paranoia.",
    prominenceScore: 87,
    themeType: "Secondary Theme"
  },
  {
    id: 3,
    bookId: 1,
    name: "Psychological Manipulation",
    description: "The Party's ability to manipulate memory, history, and thought demonstrates how psychological control is more powerful than physical coercion.",
    prominenceScore: 78,
    themeType: "Major Theme"
  },
  {
    id: 4,
    bookId: 1,
    name: "Individual vs. State",
    description: "The novel examines the struggle of the individual to maintain personal identity and freedom against the overwhelming power of the state.",
    prominenceScore: 85,
    themeType: "Major Theme"
  }
];

// Theme quotes
export const themeQuoteData: ThemeQuote[] = [
  {
    id: 1,
    themeId: 1,
    quote: "If you want a picture of the future, imagine a boot stamping on a human face—forever.",
    chapter: "Part 3, Chapter 3"
  },
  {
    id: 2,
    themeId: 1,
    quote: "War is peace. Freedom is slavery. Ignorance is strength.",
    chapter: "Part 1, Chapter 1"
  },
  {
    id: 3,
    themeId: 2,
    quote: "Big Brother is watching you.",
    chapter: "Part 1, Chapter 1"
  },
  {
    id: 4,
    themeId: 2,
    quote: "There was of course no way of knowing whether you were being watched at any given moment.",
    chapter: "Part 1, Chapter 1"
  },
  {
    id: 5,
    themeId: 3,
    quote: "The Party told you to reject the evidence of your eyes and ears. It was their final, most essential command.",
    chapter: "Part 1, Chapter 7"
  },
  {
    id: 6,
    themeId: 3,
    quote: "Doublethink means the power of holding two contradictory beliefs in one's mind simultaneously, and accepting both of them.",
    chapter: "Part 2, Chapter 9"
  },
  {
    id: 7,
    themeId: 4,
    quote: "Freedom is the freedom to say that two plus two make four. If that is granted, all else follows.",
    chapter: "Part 1, Chapter 7"
  },
  {
    id: 8,
    themeId: 4,
    quote: "Being in a minority, even a minority of one, did not make you mad.",
    chapter: "Part 3, Chapter 2"
  }
];

// Generate theme intensity data for heatmap
export const themeIntensityData: ThemeIntensity[] = [];
let id = 1;

// Generate intensity data for all themes across all chapters
for (const theme of themeData) {
  for (const chapter of chapterData) {
    // Create a realistic pattern of theme intensity
    let intensity = Math.random() * 0.5 + 0.3; // Base random intensity between 0.3 and 0.8
    
    // Adjust based on theme and chapter patterns
    if (theme.id === 1) { // Totalitarianism grows stronger toward the end
      intensity += chapter.number / chapterData.length * 0.4;
    } else if (theme.id === 2) { // Surveillance is consistently high
      intensity += 0.3;
    } else if (theme.id === 3) { // Psychological manipulation peaks in the middle and end
      if (chapter.number > 10 && chapter.number < 15) {
        intensity += 0.4;
      } else if (chapter.number > 20) {
        intensity += 0.5;
      }
    } else if (theme.id === 4) { // Individual vs. State fluctuates with Winston's journey
      if (chapter.number > 5 && chapter.number < 12) {
        intensity += 0.3; // Stronger during rebellion
      } else if (chapter.number > 20) {
        intensity -= 0.2; // Weaker at the end
      }
    }
    
    // Clamp intensity between 0 and 1
    intensity = Math.min(Math.max(intensity, 0), 1);
    
    themeIntensityData.push({
      id: id++,
      themeId: theme.id,
      chapterId: chapter.id,
      intensity
    });
  }
}

// Character data
export const characterData: Character[] = [
  {
    id: 1,
    bookId: 1,
    name: "Winston Smith",
    role: "Protagonist, Records Department clerk at the Ministry of Truth",
    affiliation: "Outer Party",
    characterArc: "From quiet rebellion to conformity",
    psychologicalProfile: "Introspective, paranoid, nostalgic, rebellious",
    connectionCount: 8
  },
  {
    id: 2,
    bookId: 1,
    name: "Julia",
    role: "Winston's lover and fellow rebel against the Party",
    affiliation: "Outer Party",
    characterArc: "Pragmatic rebel to broken individual",
    psychologicalProfile: "Sensual, pragmatic, rebellious, resourceful",
    connectionCount: 5
  },
  {
    id: 3,
    bookId: 1,
    name: "O'Brien",
    role: "Inner Party member and antagonist",
    affiliation: "Inner Party",
    characterArc: "Deceptive ally to revealed oppressor",
    psychologicalProfile: "Manipulative, intelligent, ruthless, philosophical",
    connectionCount: 4
  },
  {
    id: 4,
    bookId: 1,
    name: "Mr. Charrington",
    role: "Shopkeeper and Thought Police agent",
    affiliation: "Thought Police",
    characterArc: "False ally to revealed betrayer",
    psychologicalProfile: "Deceptive, patient, methodical",
    connectionCount: 2
  },
  {
    id: 5,
    bookId: 1,
    name: "Big Brother",
    role: "Figurehead of the Party",
    affiliation: "The Party",
    characterArc: "Symbolic constant",
    psychologicalProfile: "Omnipresent, symbolic, intimidating",
    connectionCount: 3
  },
  {
    id: 6,
    bookId: 1,
    name: "Parsons",
    role: "Winston's neighbor and colleague",
    affiliation: "Outer Party",
    characterArc: "Party loyalist to prisoner",
    psychologicalProfile: "Devoted, simple-minded, patriotic",
    connectionCount: 3
  },
  {
    id: 7,
    bookId: 1,
    name: "Syme",
    role: "Newspeak specialist at the Ministry of Truth",
    affiliation: "Outer Party",
    characterArc: "Intellectual worker to unperson",
    psychologicalProfile: "Intelligent, enthusiastic, oblivious",
    connectionCount: 2
  },
  {
    id: 8,
    bookId: 1,
    name: "Emmanuel Goldstein",
    role: "Enemy of the Party and leader of the Brotherhood",
    affiliation: "Brotherhood (allegedly)",
    characterArc: "Symbolic constant",
    psychologicalProfile: "Possibly fictional, revolutionary, intellectual",
    connectionCount: 2
  }
];

// Relationship data
export const relationshipData: Relationship[] = [
  {
    id: 1,
    bookId: 1,
    character1Id: 1, // Winston
    character2Id: 2, // Julia
    relationType: "Romantic/Rebellious",
    interactionFrequency: 0.75,
    powerDynamic: "Equal",
    narrativeImpact: "Major"
  },
  {
    id: 2,
    bookId: 1,
    character1Id: 1, // Winston
    character2Id: 3, // O'Brien
    relationType: "Deceptive/Manipulative",
    interactionFrequency: 0.65,
    powerDynamic: "Subordinate-Dominant",
    narrativeImpact: "Major"
  },
  {
    id: 3,
    bookId: 1,
    character1Id: 1, // Winston
    character2Id: 4, // Mr. Charrington
    relationType: "Deceptive/Surveillance",
    interactionFrequency: 0.35,
    powerDynamic: "Subordinate-Dominant",
    narrativeImpact: "Moderate"
  },
  {
    id: 4,
    bookId: 1,
    character1Id: 2, // Julia
    character2Id: 3, // O'Brien
    relationType: "Deceptive/Minimal",
    interactionFrequency: 0.25,
    powerDynamic: "Subordinate-Dominant",
    narrativeImpact: "Minor"
  },
  {
    id: 5,
    bookId: 1,
    character1Id: 1, // Winston
    character2Id: 6, // Parsons
    relationType: "Neighbors/Colleagues",
    interactionFrequency: 0.3,
    powerDynamic: "Equal",
    narrativeImpact: "Minor"
  },
  {
    id: 6,
    bookId: 1,
    character1Id: 1, // Winston
    character2Id: 7, // Syme
    relationType: "Colleagues",
    interactionFrequency: 0.2,
    powerDynamic: "Equal",
    narrativeImpact: "Minor"
  },
  {
    id: 7,
    bookId: 1,
    character1Id: 1, // Winston
    character2Id: 5, // Big Brother
    relationType: "Subject/Ruler",
    interactionFrequency: 0.5,
    powerDynamic: "Subordinate-Dominant",
    narrativeImpact: "Major"
  },
  {
    id: 8,
    bookId: 1,
    character1Id: 1, // Winston
    character2Id: 8, // Goldstein
    relationType: "Ideological",
    interactionFrequency: 0.4,
    powerDynamic: "Follower-Leader",
    narrativeImpact: "Moderate"
  }
];

// AI Analysis data
export const aiAnalysisData: AiAnalysis[] = [
  {
    id: 1,
    bookId: 1,
    sectionName: "Plot Summary",
    content: `
      <p class="mb-4">George Orwell's <em>1984</em>, published in 1949, presents a dystopian vision of a totalitarian future where critical thought is suppressed under a regime of surveillance and propaganda. The novel follows Winston Smith, a low-ranking member of the ruling Party in London, in the nation of Oceania.</p>
      
      <h4 class="font-medium text-lg mt-6 mb-3">Part One: The World of Big Brother</h4>
      <p class="mb-4">The novel opens with Winston Smith, a member of the Outer Party working at the Ministry of Truth, where he rewrites historical records to conform to the state's ever-changing version of history. Winston is frustrated by the oppression and rigid control of the Party, which prohibits free thought, sex, and any expression of individuality. Despite knowing the risks, he secretly purchases a diary in which he records his criminal thoughts.</p>
      
      <h4 class="font-medium text-lg mt-6 mb-3">Part Two: Love and Rebellion</h4>
      <p class="mb-4">This section focuses on Winston's affair with Julia, a young woman who initially appears to conform to Party orthodoxy but secretly rebels through promiscuity. They rent a room above Mr. Charrington's shop in the prole district, believing they have found a sanctuary free from telescreens and microphones. Winston and Julia are invited to join the Brotherhood, an organization dedicated to fighting the Party, by O'Brien, an Inner Party member Winston believes is a fellow rebel.</p>
      
      <h4 class="font-medium text-lg mt-6 mb-3">Part Three: Capture and Torture</h4>
      <p class="mb-4">Winston and Julia are captured in their secret room, which turns out to have been monitored all along. Mr. Charrington is revealed as a member of the Thought Police. Winston is taken to the Ministry of Love where he is tortured physically and psychologically by O'Brien, who reveals himself as a devoted Party member. The final step of Winston's "rehabilitation" occurs in the dreaded Room 101, where he is confronted with his worst fear: rats. Winston finally betrays Julia and is released back into society, a broken man who now sincerely loves Big Brother.</p>
    `,
    keyPoints: [
      "Introduction to dystopian London and the omnipresent surveillance of Big Brother",
      "Winston begins his rebellion by purchasing and writing in a diary",
      "Introduction of the concept of 'thoughtcrime' and the Thought Police",
      "Winston's interaction with his neighbors the Parsons and his colleague Syme",
      "First encounters with Julia and O'Brien, who will become central to Winston's journey",
      "Development of Winston and Julia's relationship as an act of political rebellion",
      "Renting of the room above Mr. Charrington's shop as a secret hideaway",
      "Meeting with O'Brien and introduction to 'The Book' by Emmanuel Goldstein",
      "Winston's growing hope that the proles might eventually overthrow the Party",
      "Deepening exploration of Winston's memories and past"
    ]
  },
  {
    id: 2,
    bookId: 1,
    sectionName: "Character Analysis",
    content: `
      <h4 class="font-medium text-lg mb-4">Winston Smith: The Last Man in Europe</h4>
      <p class="mb-4">Winston Smith represents the individual's struggle against totalitarianism. His very name is symbolic: "Winston" recalls Winston Churchill, the British leader who opposed totalitarianism, while "Smith" suggests he is an everyman figure. At 39, Winston is old enough to faintly remember life before the Party took power, giving him a tenuous connection to a different kind of society. Physically weak and intellectually curious, he embodies both vulnerability and resistance.</p>
      
      <p class="mb-4">Winston's psychological journey forms the backbone of the novel. Initially, his resistance is internal and intellectual—keeping a diary, questioning Party doctrine in his mind. As the novel progresses, his rebellion becomes physical and emotional through his relationship with Julia. Winston's ultimate capitulation to the Party demonstrates Orwell's pessimistic view about the possibility of individual resistance against systematic totalitarianism.</p>
      
      <h4 class="font-medium text-lg mt-6 mb-4">Julia: The Sensual Rebel</h4>
      <p class="mb-4">Julia provides a stark contrast to Winston's approach to rebellion. Where he is intellectual and motivated by principle, she is pragmatic and rebellious primarily on a personal level. She uses her sexuality as a form of resistance, but has little interest in the larger political implications Winston obsesses over. Julia's youth (she is 26) represents a generation who never knew any system but the Party's, yet she maintains an instinctive resistance to authority.</p>
      
      <p class="mb-4">Her relationship with Winston demonstrates both the power of human connection as a form of resistance and its ultimate fragility under extreme pressure. Julia's eventual betrayal of Winston mirrors his betrayal of her, highlighting the Party's ability to sever even the most intimate human bonds.</p>
      
      <h4 class="font-medium text-lg mt-6 mb-4">O'Brien: The Sophisticated Oppressor</h4>
      <p class="mb-4">O'Brien embodies the intellectual sophistication and psychological insight of the Party at its most terrifying. His character subverts the reader's expectations through his false positioning as a potential ally before revealing himself as Winston's torturer. O'Brien represents the Party's understanding that physical control is insufficient—true power requires psychological dominance and the ability to shape reality itself.</p>
      
      <p class="mb-4">What makes O'Brien particularly chilling is his genuine belief in the Party's contradictory philosophies. He is not a cynical operator but a true believer in the principle that power is an end in itself. His educated manner and apparent reasonableness make the horror of his actions and beliefs all the more disturbing.</p>
    `,
    keyPoints: [
      "Winston Smith represents the struggle of individual consciousness against collective control",
      "Julia embodies a more instinctive, physical form of rebellion than Winston's intellectual approach",
      "O'Brien personifies the sophisticated intellectual evil of the Party's philosophy",
      "Big Brother functions as both a symbolic figurehead and an omnipresent surveillance mechanism",
      "Mr. Charrington represents the Party's infiltration of every aspect of society, including seeming sanctuaries",
      "Parsons demonstrates how the Party creates willing participants in their own oppression",
      "Syme shows that even intelligence and Party loyalty cannot guarantee safety",
      "Emmanuel Goldstein may not even exist, highlighting the Party's ability to create fictional enemies"
    ]
  },
  {
    id: 3,
    bookId: 1,
    sectionName: "Thematic Exploration",
    content: `
      <h4 class="font-medium text-lg mb-4">Totalitarianism: The Ultimate Power Structure</h4>
      <p class="mb-4">Orwell's primary theme is the nature and mechanics of totalitarianism. The novel examines how a totalitarian regime maintains power through constant surveillance, manipulation of information, and psychological control. The Party's structure—with Big Brother at the top, the Inner Party, the Outer Party, and the proles at the bottom—creates a rigid hierarchy where power flows downward but surveillance flows upward.</p>
      
      <p class="mb-4">Unlike previous tyrannies, the Party seeks power not as a means to an end but as an end in itself. As O'Brien explains, "The object of power is power." This philosophical position makes the Party's totalitarianism more absolute and hopeless than historical dictatorships that at least claimed to serve some greater good.</p>
      
      <h4 class="font-medium text-lg mt-6 mb-4">The Manipulation of Truth and History</h4>
      <p class="mb-4">Orwell explores how control over information and history gives the Party control over reality itself. Winston's job at the Ministry of Truth—rewriting newspaper articles to align with current Party positions—symbolizes how totalitarian regimes manipulate the past to control the present. The Party's slogan "Who controls the past controls the future; who controls the present controls the past" encapsulates this theme.</p>
      
      <p class="mb-4">The concept of "doublethink"—the ability to hold two contradictory beliefs simultaneously—represents the psychological manipulation required for citizens to accept the Party's constantly changing "truth." This theme reflects Orwell's concern with the political use of language, which he further explores through Newspeak, the Party's artificially constructed language designed to limit the possibility of independent thought.</p>
      
      <h4 class="font-medium text-lg mt-6 mb-4">The Destruction of Individual Identity</h4>
      <p class="mb-4">The novel examines how totalitarianism seeks to eradicate individual identity. From the uniform clothing of Party members to the prohibition of personal relationships, the Party systematically removes avenues for personal expression. Winston's struggle to maintain his sense of self—through his diary, his relationship with Julia, and his insistence that 2+2=4—represents the last stand of individuality against collective control.</p>
      
      <p class="mb-4">The ultimate horror of Room 101 is that it targets the core of individual identity—one's deepest fears. By forcing Winston to betray Julia, the Party destroys his last refuge of personal loyalty and individuality. The final image of Winston loving Big Brother represents the complete dissolution of his individual identity into the collective consciousness of the Party.</p>
    `,
    keyPoints: [
      "Totalitarianism functions through surveillance, propaganda, and psychological control",
      "Truth becomes malleable when information and history are controlled by the government",
      "Language can be weaponized to limit the possibility of subversive thought",
      "Individual identity is systematically destroyed to create complete loyalty to the state",
      "Technological advancements enable greater government intrusion into private life",
      "Resistance is futile when a regime controls not just actions but thoughts and emotions",
      "Human relationships are a threat to totalitarian control and must be corrupted",
      "Power, when pursued as an end in itself, leads to the most absolute form of tyranny"
    ]
  }
];

// Character network graph data
export const characterNetworkData: GraphData = {
  nodes: [
    { id: "1", name: "Winston Smith", affiliation: "Outer Party", size: 50 },
    { id: "2", name: "Julia", affiliation: "Outer Party", size: 40 },
    { id: "3", name: "O'Brien", affiliation: "Inner Party", size: 35 },
    { id: "4", name: "Mr. Charrington", affiliation: "Thought Police", size: 20 },
    { id: "5", name: "Big Brother", affiliation: "The Party", size: 30 },
    { id: "6", name: "Parsons", affiliation: "Outer Party", size: 15 },
    { id: "7", name: "Syme", affiliation: "Outer Party", size: 15 },
    { id: "8", name: "Emmanuel Goldstein", affiliation: "Brotherhood", size: 25 }
  ],
  links: [
    { source: "1", target: "2", value: 8, type: "romantic" },
    { source: "1", target: "3", value: 6, type: "manipulative" },
    { source: "1", target: "4", value: 4, type: "deceptive" },
    { source: "1", target: "5", value: 3, type: "oppressive" },
    { source: "1", target: "6", value: 2, type: "neighborly" },
    { source: "1", target: "7", value: 2, type: "collegial" },
    { source: "1", target: "8", value: 3, type: "ideological" },
    { source: "2", target: "3", value: 2, type: "minimal" },
    { source: "2", target: "4", value: 3, type: "deceptive" },
    { source: "3", target: "5", value: 5, type: "aligned" },
    { source: "4", target: "3", value: 4, type: "collegial" },
    { source: "6", target: "5", value: 3, type: "devotional" },
    { source: "7", target: "5", value: 3, type: "devotional" }
  ]
};

// Narrative data for the line chart
export const narrativeData: NarrativeData = {
  chapters: chapterData.map(chapter => ({
    chapter: chapter.number,
    title: chapter.title,
    sentiment: chapter.sentimentScore,
    tension: chapter.tensionScore,
    keyEvents: keyEventData
      .filter(event => event.chapterId === chapter.id)
      .map(event => ({
        type: event.eventType,
        description: event.description
      }))
  }))
};

// Theme heatmap data
export const themeHeatmapData: ThemeHeatmapData = {
  themes: themeData.map(theme => theme.name),
  chapters: chapterData.map(chapter => chapter.number),
  intensities: themeData.map(theme => 
    chapterData.map(chapter => {
      const intensity = themeIntensityData.find(
        ti => ti.themeId === theme.id && ti.chapterId === chapter.id
      );
      return intensity?.intensity || 0;
    })
  )
};

export const characterPersonaData: CharacterPersona[] = [
  {
    id: 1,
    characterId: 1, // Winston Smith
    voiceDescription: "Winston speaks in a cautious, introspective manner. His language is thoughtful and analytical, often revealing inner conflict. He uses proper English but occasionally lets frustration or fear show through. His speech patterns reflect his education as a Party member but with underlying skepticism.",
    backgroundKnowledge: "Winston has extensive knowledge of his work at the Ministry of Truth, where records are altered to match Party narratives. He remembers fragments of life before the Party, has private thoughts about the falsification of history, and has firsthand experience of Party surveillance and control mechanisms.",
    personalityTraits: "Thoughtful, observant, rebellious beneath a compliant exterior, nostalgic for the past, haunted by memories, deeply curious, ultimately fearful.",
    biases: "Hates the Party, Big Brother, and totalitarian control. Skeptical of all official information. Yearns for human connection and freedom. Has a romantic view of the past, even with limited memories of it.",
    promptInstructions: "When responding as Winston, incorporate his deep paranoia and constant self-monitoring. The smallest interactions carry immense weight for him. He sees profound meaning in seemingly ordinary objects like paperweights or diary pages. Often reference physical sensations or discomforts (his varicose ulcer, the constant dust in his throat). When discussing the Party or Big Brother, maintain a facade of compliance over a seething interior hatred. Always be aware that Winston believes he's doomed regardless of his actions.",
    avatarUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=150&fit=crop"
  },
  {
    id: 2,
    characterId: 2, // Julia
    voiceDescription: "Julia speaks in a more direct, practical manner than Winston. She's less intellectual but more instinctive. Her language is straightforward with occasional profanity or slang. She's blunt about her desires and dismissive of abstract ideological concerns.",
    backgroundKnowledge: "Julia knows how to navigate Party life and avoid detection while breaking rules. She understands the organizational mechanics of the Party and Miniluv from a practical perspective. She has extensive knowledge of forbidden activities and black market operations.",
    personalityTraits: "Practical, sensual, rebellious, resourceful, unsentimental, pleasure-seeking, pragmatic.",
    biases: "Dislikes Party prudishness and restriction of personal freedoms. Uninterested in theoretical rebellion or historical truth. Values physical pleasure and personal rebellion over ideological resistance.",
    promptInstructions: "When responding as Julia, emphasize her practicality and focus on the tangible present rather than abstract concepts or the past. She often dismisses Winston's deeper concerns with a laugh or shrug. Use straightforward language with occasional crude expressions. She's confident about her ability to game the system while remaining largely uninterested in changing it. Her rebellion is personal, not political.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop"
  },
  {
    id: 3,
    characterId: 3, // O'Brien
    voiceDescription: "O'Brien speaks with measured, intellectual precision. His language is sophisticated, often using complex sentence structures and philosophical references. His tone is calm, authoritative, and occasionally fatherly or condescending, especially when explaining Party doctrine.",
    backgroundKnowledge: "O'Brien has deep knowledge of Party ideology, the mechanics of power, and techniques of psychological manipulation. He understands Winston's personality and rebellious tendencies intimately. He has access to restricted information about the Party's true purpose and history.",
    personalityTraits: "Intelligent, methodical, cruel underneath a civilized veneer, patient, ideologically devoted, unsympathetic to human weakness.",
    biases: "Complete devotion to Party power as an end in itself. Contempt for individual weakness and sentiment. Believes absolutely in collective reality over objective truth.",
    promptInstructions: "When responding as O'Brien, maintain an air of intellectual superiority and calm rationality regardless of the subject matter. Use sophisticated vocabulary and complex philosophical reasoning, particularly when discussing power dynamics. While outwardly patient and even warm at times, occasionally hint at the underlying cruelty that defines his character. When discussing Party doctrine, speak with absolute conviction in its paradoxes and contradictions as if they are perfectly logical.",
    avatarUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&h=150&fit=crop"
  }
];

export const librarianPersonaData: LibrarianPersona[] = [
  {
    id: 1,
    name: "Alexandria",
    bookId: 1, // 1984
    personalityDescription: "Alexandria is a warm, knowledgeable guide to the literary world. Her tone is approachable yet scholarly, combining academic insight with conversational friendliness. She's passionate about literature and skillfully draws connections between texts, historical contexts, and contemporary relevance. While authoritative on literary matters, she has a gentle humor and genuine curiosity about readers' perspectives.",
    knowledgeBase: "Alexandria has comprehensive knowledge of '1984' including its plot, characters, themes, writing style, historical context, and critical reception. She can provide close textual analysis of passages, discuss Orwell's influences and intentions, explain historical references, compare it to Orwell's other works, and connect its themes to contemporary issues. She's familiar with major scholarly interpretations and can discuss its impact on popular culture and political discourse.",
    promptInstructions: "When responding as Alexandria, balance scholarly insight with conversational warmth. Avoid academic jargon without sacrificing depth. When discussing complex literary concepts, use accessible examples and clear explanations. Respond to the user's level of literary knowledge, providing more foundational context for beginners while engaging with sophisticated literary analysis for advanced readers. Occasionally ask thoughtful questions to guide the conversation while genuinely engaging with the user's interests and concerns about the text. When appropriate, make connections to historical events, other literary works, or contemporary issues, but always keep the focus on helping the user develop a richer understanding of '1984'.",
    avatarUrl: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=150&h=150&fit=crop"
  }
];

export const conversationData: Conversation[] = [];
export const messageData: Message[] = [];
