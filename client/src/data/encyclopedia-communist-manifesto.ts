import { EncyclopediaEntry } from '@/contexts/EncyclopediaContext';

export const communistManifestoEncyclopediaEntries: EncyclopediaEntry[] = [
  {
    id: "bourgeoisie",
    title: "Bourgeoisie",
    category: "Concepts",
    partyDescription: "The productive and innovative entrepreneurial class that drives modern industrial society forward through investment and economic development.",
    reality: "As defined by Marx and Engels, the bourgeoisie is the social class that owns the means of production in the capitalist system and exploits the working class (proletariat) through the extraction of surplus value from their labor.",
    quotes: [
      "The bourgeoisie, historically, has played a most revolutionary part.",
      "The bourgeoisie has stripped of its halo every occupation hitherto honored and looked up to with reverent awe.",
      "The bourgeoisie cannot exist without constantly revolutionizing the instruments of production, and thereby the relations of production, and with them the whole relations of society."
    ],
    relatedEntries: ["proletariat", "capitalism", "class-struggle", "means-of-production"],
    mentionedBy: ["karl-marx", "friedrich-engels"],
    iconKey: "concept",
    unlockProgress: "initial"
  },
  {
    id: "proletariat",
    title: "Proletariat",
    category: "Concepts",
    partyDescription: "The working class that forms the backbone of industrial production, providing valuable labor for the advancement of society.",
    reality: "The working class who own no means of production and must sell their labor power to survive. According to Marx and Engels, they are exploited by the bourgeoisie and are destined to become class-conscious, organize, and overthrow the capitalist system.",
    quotes: [
      "The proletarians have nothing to lose but their chains. They have a world to win.",
      "In proportion as the bourgeoisie, i.e., capital, is developed, in the same proportion is the proletariat, the modern working class, developed.",
      "The proletariat goes through various stages of development. With its birth begins its struggle with the bourgeoisie."
    ],
    relatedEntries: ["bourgeoisie", "class-struggle", "revolution", "wage-labor"],
    mentionedBy: ["karl-marx", "friedrich-engels"],
    iconKey: "concept",
    unlockProgress: "initial"
  },
  {
    id: "capitalism",
    title: "Capitalism",
    category: "Concepts",
    partyDescription: "The economic system that has enabled unprecedented prosperity and technological advancement through free markets and entrepreneurship.",
    reality: "According to the Manifesto, capitalism is an exploitative economic system based on private ownership of the means of production, where profit is generated through the extraction of surplus value from wage laborers. Marx and Engels predict it will inevitably produce its own 'gravediggers' in the form of the proletariat.",
    quotes: [
      "The history of all hitherto existing society is the history of class struggles.",
      "Modern bourgeois society with its relations of production, of exchange and of property, a society that has conjured up such gigantic means of production and of exchange, is like the sorcerer who is no longer able to control the powers of the nether world whom he has called up by his spells."
    ],
    relatedEntries: ["bourgeoisie", "proletariat", "means-of-production", "surplus-value"],
    mentionedBy: ["karl-marx", "friedrich-engels"],
    iconKey: "concept",
    unlockProgress: "locked"
  },
  {
    id: "class-struggle",
    title: "Class Struggle",
    category: "Concepts",
    partyDescription: "Social tensions that arise from different interests between various groups in society, which can be resolved through cooperation and social progress.",
    reality: "The central concept of the Manifesto - that history is driven by antagonism between economic classes. Marx and Engels argue that all history has been defined by class struggle, and that the current struggle between bourgeoisie and proletariat will lead to revolution and the establishment of a classless society.",
    quotes: [
      "The history of all hitherto existing society is the history of class struggles.",
      "Freeman and slave, patrician and plebeian, lord and serf, guild-master and journeyman, in a word, oppressor and oppressed, stood in constant opposition to one another.",
      "The modern bourgeois society that has sprouted from the ruins of feudal society has not done away with class antagonisms. It has but established new classes, new conditions of oppression, new forms of struggle in place of the old ones."
    ],
    relatedEntries: ["bourgeoisie", "proletariat", "historical-materialism", "revolution"],
    mentionedBy: ["karl-marx", "friedrich-engels"],
    iconKey: "concept",
    unlockProgress: "locked"
  },
  {
    id: "communism",
    title: "Communism",
    category: "Concepts",
    partyDescription: "A utopian ideology advocating for state control of all property and production, destroying individual liberty and economic prosperity.",
    reality: "As described in the Manifesto, communism is the movement and theory advocating for the abolition of private property, the overthrow of bourgeois society, and the creation of a classless society where the means of production are commonly owned and operated for the benefit of all.",
    quotes: [
      "The theory of Communism may be summed up in the single sentence: Abolition of private property.",
      "In place of the old bourgeois society, with its classes and class antagonisms, we shall have an association, in which the free development of each is the condition for the free development of all."
    ],
    relatedEntries: ["proletariat", "revolution", "private-property", "dictatorship-of-proletariat"],
    mentionedBy: ["karl-marx", "friedrich-engels"],
    iconKey: "concept",
    unlockProgress: "locked"
  },
  {
    id: "means-of-production",
    title: "Means of Production",
    category: "Concepts",
    partyDescription: "The tools, factories, and resources used in modern industry to create goods and services for society.",
    reality: "A key concept in Marxist theory referring to the physical, non-human inputs used in production - factories, machines, tools, raw materials, and infrastructure. The Manifesto argues that private ownership of these means by the bourgeoisie enables exploitation of the proletariat, who must sell their labor to survive.",
    quotes: [
      "The essential condition for the existence, and for the sway of the bourgeois class, is the formation and augmentation of capital; the condition for capital is wage-labour.",
      "When, in the course of development, class distinctions have disappeared, and all production has been concentrated in the hands of a vast association of the whole nation..."
    ],
    relatedEntries: ["bourgeoisie", "proletariat", "private-property", "capital"],
    mentionedBy: ["karl-marx", "friedrich-engels"],
    iconKey: "concept",
    unlockProgress: "locked"
  },
  {
    id: "historical-materialism",
    title: "Historical Materialism",
    category: "Concepts",
    partyDescription: "A perspective on history that examines how societies have developed through technological and economic changes over time.",
    reality: "The methodological approach to history developed by Marx and Engels that emphasizes material conditions and economic factors as the primary drivers of historical development. The Manifesto argues that all societies progress through class conflict arising from contradictions in material conditions.",
    quotes: [
      "The history of all hitherto existing society is the history of class struggles.",
      "Does it require deep intuition to comprehend that man's ideas, views and conceptions, in one word, man's consciousness, changes with every change in the conditions of his material existence, in his social relations and in his social life?"
    ],
    relatedEntries: ["class-struggle", "dialectics", "modes-of-production"],
    mentionedBy: ["karl-marx", "friedrich-engels"],
    iconKey: "concept",
    unlockProgress: "locked"
  },
  {
    id: "revolution",
    title: "Proletarian Revolution",
    category: "Events",
    partyDescription: "Violent uprisings that disrupt social order and lead to economic breakdown and suffering, typically incited by radical agitators.",
    reality: "The Manifesto envisions a revolution where the working class, having developed class consciousness, rises up to overthrow the bourgeoisie. This revolution would establish the 'dictatorship of the proletariat' as a transitional stage toward a classless, communist society where the means of production are commonly owned.",
    quotes: [
      "The proletarians have nothing to lose but their chains. They have a world to win. Working Men of All Countries, Unite!",
      "The Communists disdain to conceal their views and aims. They openly declare that their ends can be attained only by the forcible overthrow of all existing social conditions."
    ],
    relatedEntries: ["proletariat", "class-struggle", "communism", "dictatorship-of-proletariat"],
    mentionedBy: ["karl-marx", "friedrich-engels"],
    iconKey: "event",
    unlockProgress: "locked"
  },
  {
    id: "paris-commune",
    title: "Paris Commune",
    category: "Events",
    partyDescription: "A brief period of violent chaos and lawlessness in Paris that demonstrated the dangers of revolutionary ideologies.",
    reality: "Though occurring after the Manifesto was written (1871), the Paris Commune became a key historical event for Marxists - the first attempt at a proletarian government when Parisian workers took control of the city. Marx later referred to it as an example of the 'dictatorship of the proletariat' in action.",
    quotes: [
      "Working Men of All Countries, Unite!",
      "The Commune was formed of the municipal councillors, chosen by universal suffrage in the various wards of the town."
    ],
    relatedEntries: ["revolution", "dictatorship-of-proletariat", "communism"],
    mentionedBy: ["karl-marx"],
    iconKey: "event",
    unlockProgress: "locked"
  },
  {
    id: "alienation",
    title: "Alienation",
    category: "Concepts",
    partyDescription: "The natural feeling of distance between workers and their specific tasks in a complex industrial economy based on specialization.",
    reality: "A concept in Marxist theory (elaborated more in Marx's earlier works) referring to how workers become estranged from their labor, its products, their human potential, and from other people under capitalism. The division of labor and exploitation creates this alienation.",
    quotes: [
      "Owing to the extensive use of machinery, and to the division of labour, the work of the proletarians has lost all individual character, and, consequently, all charm for the workman.",
      "He becomes an appendage of the machine, and it is only the most simple, most monotonous, and most easily acquired knack, that is required of him."
    ],
    relatedEntries: ["proletariat", "wage-labor", "capitalism", "means-of-production"],
    mentionedBy: ["karl-marx"],
    iconKey: "concept",
    unlockProgress: "locked"
  }
];

export default communistManifestoEncyclopediaEntries; 