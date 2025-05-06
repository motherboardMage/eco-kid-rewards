
// Define the waste categories for our application
export const wasteCategories = [
  { 
    id: "paper", 
    name: "Paper", 
    emoji: "📄",
    examples: ["Newspaper", "Cardboard", "Books", "Magazines"],
    recyclable: true,
    description: "Paper waste can be recycled to make new paper products."
  },
  { 
    id: "plastic", 
    name: "Plastic", 
    emoji: "🥤",
    examples: ["Bottles", "Food containers", "Bags", "Packaging"],
    recyclable: true,
    description: "Plastic waste should be cleaned and segregated by type for recycling."
  },
  { 
    id: "glass", 
    name: "Glass", 
    emoji: "🍶",
    examples: ["Bottles", "Jars", "Broken glass"],
    recyclable: true,
    description: "Glass can be recycled indefinitely without loss in quality or purity."
  },
  { 
    id: "metal", 
    name: "Metal", 
    emoji: "🥫",
    examples: ["Cans", "Foil", "Bottle caps", "Metal containers"],
    recyclable: true,
    description: "Metal waste like aluminum and steel can be recycled many times."
  },
  { 
    id: "organic", 
    name: "Organic", 
    emoji: "🍎",
    examples: ["Food scraps", "Fruit peels", "Coffee grounds", "Leaves"],
    recyclable: true,
    description: "Organic waste can be composted to create nutrient-rich soil."
  },
  { 
    id: "electronic", 
    name: "E-Waste", 
    emoji: "📱",
    examples: ["Old phones", "Batteries", "Cables", "Broken electronics"],
    recyclable: true,
    description: "Electronic waste contains valuable materials that can be recovered."
  },
  { 
    id: "nonrecyclable", 
    name: "Non-recyclable", 
    emoji: "🗑️",
    examples: ["Diapers", "Styrofoam", "Chip bags", "Plastic toys"],
    recyclable: false,
    description: "Non-recyclable waste should go to landfill or special disposal facilities."
  }
];

// Educational content about waste segregation
export const educationalContent = [
  {
    title: "Why Segregate Waste?",
    content: "Segregating waste helps in proper disposal and recycling of different materials, reducing the burden on landfills, conserving natural resources, and reducing pollution."
  },
  {
    title: "Recycling Process",
    content: "Recycling involves collecting, sorting, processing, and manufacturing waste materials into new products, reducing the need for virgin material extraction."
  },
  {
    title: "Composting Benefits",
    content: "Composting organic waste helps create nutrient-rich soil, reduces methane emissions from landfills, and completes the natural cycle of nutrients."
  }
];

// Achievements that kids can unlock
export const achievements = [
  {
    id: "first_scan",
    name: "First Scan",
    description: "Scan your first waste item",
    requirement: 1,
    type: "scan_count"
  },
  {
    id: "paper_expert",
    name: "Paper Expert",
    description: "Correctly identify 10 paper items",
    requirement: 10,
    type: "category_scan",
    category: "paper"
  },
  {
    id: "plastic_warrior",
    name: "Plastic Warrior",
    description: "Correctly identify 10 plastic items",
    requirement: 10,
    type: "category_scan",
    category: "plastic"
  },
  {
    id: "eco_apprentice",
    name: "Eco Apprentice",
    description: "Reach level 5",
    requirement: 5,
    type: "level"
  }
];
