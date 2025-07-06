export const SelectTravelsList = [
  {
    id: 1,
    title: "Just Me",
    desc: "A solo travels in exploration",
    icon: "🛫",
    people: "1",
  },
  {
    id: 2,
    title: "A Couple",
    desc: "Two travels in tandem",
    icon: "🍷",
    people: "1",
  },
  {
    id: 3,
    title: "Family",
    desc: "A family travels together",
    icon: "🏡",
    people: "3 to 5 people",
  },
  {
    id:4,
    title:"Friends",
    desc:"A group of friends travels",
    icon:"👫",
    people:"5+ people"
  }
];


export const SelectBudgetOptions = [
    {
        id: 1,
        title: "Cheap",
        desc: "Budget friendly travels",
        icon: "💰",
    },
    {
        id: 2,
        title: "Moderate",
        desc: "A moderate budget travels",
        icon: "💸",
    },
    {
        id: 3,
        title: "Luxury",
        desc: "A luxury budget travels",
        icon: "💎",
    }
]

export const AI_PROMPTS = "Generate Travel Plan for location :{location}, for {totalDays} days for a {traveler} with a {budget} budget, Give me Hotels options List with HotelName , HotelAddress , Price , hotel image url , geo coordinates , rating , descriptions , and suggest itenerary with PlaceName , PlaceDetails , PlaceImage Url , Geo Coordinates , ticket Pricing , Time to travel each of the location for {totaldays} days with each day plan with best time to visit in JSON format"