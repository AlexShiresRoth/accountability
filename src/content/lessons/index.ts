import type { Lesson } from "./types";

// PLACEHOLDER CONTENT: drafts for layout and interaction design, pending editorial review.
export const lessons: Lesson[] = [
  {
    slug: "understanding-consent",
    title: "Understanding consent",
    summary: "What consent looks like in practice, and why it's an ongoing conversation rather than a single yes.",
    status: "placeholder",
    sections: [
      {
        heading: "The basics",
        paragraphs: [
          "Consent is a clear, freely given agreement to a specific activity. It can be withdrawn at any point, and agreeing to one thing is not agreeing to everything.",
          "Silence, a past relationship, or not saying no are not the same as a yes. When you're unsure, asking is the normal, respectful move.",
        ],
      },
    ],
    scenarios: [
      {
        id: "checking-in",
        situation:
          "You're hooking up with someone you've been seeing for a few weeks. They were enthusiastic earlier, but now they've gone quiet and seem distracted.",
        question: "What do you do?",
        choices: [
          {
            id: "a",
            label: "Keep going. They agreed earlier.",
            assessment: "counterproductive",
            explanation: "Earlier agreement doesn't carry forward automatically. A change in someone's response is a signal to pause.",
          },
          {
            id: "b",
            label: "Pause and ask how they're feeling.",
            assessment: "constructive",
            explanation: "Checking in is simple and normal. It gives them an easy way to say what they want, whatever that is.",
          },
          {
            id: "c",
            label: "Stop without saying anything.",
            assessment: "limited",
            explanation: "Stopping is better than continuing, but saying something avoids confusion and keeps communication open.",
          },
        ],
        takeaway: "Consent is ongoing. When signals change, pause and ask.",
      },
    ],
  },
  {
    slug: "alcohol-and-consent",
    title: "Alcohol and consent",
    summary: "How intoxication affects someone's ability to agree, and how to read the situation when drinking is involved.",
    status: "placeholder",
    sections: [
      {
        heading: "Why it matters",
        paragraphs: [
          "Someone who is incapacitated cannot consent. Incapacitation can look like slurred speech, trouble standing, confusion about where they are, or drifting in and out.",
          "Campus policies define incapacitation in their own terms. If you're wondering whether someone is too drunk, treat that as your answer.",
        ],
      },
    ],
    scenarios: [
      {
        id: "leaving-together",
        situation:
          "At a party, someone you've been flirting with all night suggests going back to your room. They're stumbling and repeating themselves.",
        question: "What do you do?",
        choices: [
          {
            id: "a",
            label: "Go back together. They suggested it.",
            assessment: "counterproductive",
            explanation: "A suggestion made while this intoxicated isn't reliable agreement, and you'd be relying on it at their most vulnerable moment.",
          },
          {
            id: "b",
            label: "Suggest swapping numbers and meeting up another time, and make sure they get home safely.",
            assessment: "constructive",
            explanation: "This keeps the connection and removes the risk. If the interest is mutual, it will still be there when you're both sober.",
          },
        ],
        takeaway: "If you're questioning whether someone is too drunk, wait.",
      },
    ],
  },
  {
    slug: "bystander-intervention",
    title: "Bystander intervention",
    summary: "Practical, low-drama ways to step in when something looks wrong, including when the person involved is your friend.",
    status: "placeholder",
    sections: [
      {
        heading: "You have more options than confrontation",
        paragraphs: [
          "Intervening doesn't have to mean a scene. You can speak up directly, create a distraction, bring in someone else, or check on the person afterward.",
          "The right choice depends on the situation and your safety. Doing something small is almost always better than doing nothing.",
        ],
      },
    ],
    scenarios: [
      {
        id: "friend-at-party",
        situation:
          "Your friend keeps approaching someone at a party after she has repeatedly moved away and shown that she isn't interested.",
        question: "What do you do?",
        choices: [
          {
            id: "a",
            label: "Nothing. It's not your business, and he's not doing anything illegal.",
            assessment: "counterproductive",
            explanation: "She's already signaled she wants space. Staying out of it leaves her to handle it alone, and your friend reads silence as approval.",
          },
          {
            id: "b",
            label: "Pull your friend aside: “Hey, come help me with something.”",
            assessment: "constructive",
            explanation: "A distraction ends the moment without embarrassing anyone. Once you're away, you can tell him plainly that she wasn't interested.",
          },
          {
            id: "c",
            label: "Call him out loudly in front of everyone.",
            assessment: "limited",
            explanation: "It stops the behavior but can escalate things and put more attention on her. Choose it if a quieter approach hasn't worked.",
          },
          {
            id: "d",
            label: "Check in with her: “Everything okay?”",
            assessment: "constructive",
            explanation: "Asking her directly gives her a way out and lets her decide what she needs.",
          },
        ],
        takeaway: "Friends listen to friends. A quiet word often works better than a confrontation.",
      },
    ],
  },
  {
    slug: "recognizing-coercion",
    title: "Recognizing coercion",
    summary: "Pressure, guilt, and persistence can turn a no into a reluctant yes. Learn to spot it, in others and in yourself.",
    status: "placeholder",
    sections: [
      {
        heading: "What coercion looks like",
        paragraphs: [
          "Coercion is getting someone to agree by wearing them down: repeated asking, sulking, guilt, threats to end the relationship, or using status or power.",
          "A yes that comes after someone has said no several times is worth questioning. Agreement should be free, not the end of an argument.",
        ],
      },
    ],
    scenarios: [
      {
        id: "keep-asking",
        situation: "You've asked your partner twice tonight, and both times they said they weren't in the mood.",
        question: "What's the best next step?",
        choices: [
          {
            id: "a",
            label: "Keep bringing it up until they change their mind.",
            assessment: "counterproductive",
            explanation: "Repeated asking after a clear no is pressure. A yes you get this way isn't freely given.",
          },
          {
            id: "b",
            label: "Accept the answer and move on with the evening.",
            assessment: "constructive",
            explanation: "Taking no for an answer without sulking or guilt shows respect and builds trust.",
          },
        ],
        takeaway: "If you're negotiating for a yes, it isn't consent.",
      },
    ],
  },
  {
    slug: "healthy-relationships",
    title: "Healthy relationships and boundaries",
    summary: "What respect looks like day to day, and early signs that a relationship is becoming controlling.",
    status: "placeholder",
    sections: [
      {
        heading: "Boundaries are normal",
        paragraphs: [
          "Healthy relationships include room for separate friends, time, and opinions. Checking a partner's phone, controlling who they see, or tracking their location are warning signs.",
        ],
      },
    ],
    scenarios: [
      {
        id: "location-sharing",
        situation: "Your partner wants to go to a concert with friends. You feel uneasy and want them to share their location all night.",
        question: "What do you do?",
        choices: [
          {
            id: "a",
            label: "Insist on location sharing as a condition of going.",
            assessment: "counterproductive",
            explanation: "Making it a condition turns a worry into control. Over time this erodes trust rather than building it.",
          },
          {
            id: "b",
            label: "Tell them you feel uneasy, and trust them to go.",
            assessment: "constructive",
            explanation: "Naming your feelings is honest. Respecting their independence is what makes a relationship feel safe for both of you.",
          },
        ],
        takeaway: "Feeling insecure is human. Controlling someone because of it isn't okay.",
      },
    ],
  },
  {
    slug: "stalking-and-obsessive-behavior",
    title: "Stalking and obsessive behavior",
    summary: "When interest turns into unwanted contact, monitoring, or showing up, and what to do if you notice it.",
    status: "placeholder",
    sections: [
      {
        heading: "Persistence isn't romance",
        paragraphs: [
          "Repeated unwanted messages, following someone online or in person, or turning up where they'll be can frighten a person even if it's not intended that way.",
        ],
      },
    ],
    scenarios: [
      {
        id: "blocked",
        situation: "A friend tells you he made a new account to message someone who blocked him, because he 'just wants to talk'.",
        question: "What do you say?",
        choices: [
          {
            id: "a",
            label: "“Makes sense, she owes you a conversation.”",
            assessment: "counterproductive",
            explanation: "Being blocked is a clear message. Working around it is exactly the kind of behavior that feels threatening.",
          },
          {
            id: "b",
            label: "“Man, she blocked you. That's her answer. Let it go.”",
            assessment: "constructive",
            explanation: "A direct word from a friend can stop a pattern early, before it escalates.",
          },
        ],
        takeaway: "A block, an unanswered message, or a request for space is an answer.",
      },
    ],
  },
  {
    slug: "sharing-intimate-images",
    title: "Sharing intimate images",
    summary: "Why forwarding or posting intimate images without consent causes serious harm, and what to do if one is sent to you.",
    status: "placeholder",
    sections: [
      {
        heading: "Consent to take isn't consent to share",
        paragraphs: [
          "An image shared privately was shared with you, not with everyone. Forwarding it can cause lasting harm and may carry legal consequences.",
        ],
      },
    ],
    scenarios: [
      {
        id: "forwarded-image",
        situation: "Someone in a group chat posts an intimate photo of a classmate that was clearly meant to be private.",
        question: "What do you do?",
        choices: [
          {
            id: "a",
            label: "Ignore it and keep scrolling.",
            assessment: "limited",
            explanation: "You didn't make it worse, but the image is still circulating. Saying something may be what stops it.",
          },
          {
            id: "b",
            label: "Say it isn't okay, ask for it to be deleted, and don't forward it.",
            assessment: "constructive",
            explanation: "One person objecting often gives others permission to object too.",
          },
          {
            id: "c",
            label: "Save it in case it's needed later.",
            assessment: "counterproductive",
            explanation: "Keeping a copy extends the harm. If you're concerned, report the message to the platform or a campus resource instead.",
          },
        ],
        takeaway: "Don't forward it. Say something if you can.",
      },
    ],
  },
  {
    slug: "group-chat-behavior",
    title: "Group-chat behavior and peer pressure",
    summary: "How jokes, rankings, and 'just banter' in group chats shape what a group treats as normal.",
    status: "placeholder",
    sections: [
      {
        heading: "Groups set norms",
        paragraphs: [
          "Most people are less comfortable with degrading jokes than they let on. When one person pushes back, others often agree, even if they didn't speak first.",
        ],
      },
    ],
    scenarios: [
      {
        id: "ranking-thread",
        situation: "Your team's group chat starts a thread ranking women from a party by name.",
        question: "What do you do?",
        choices: [
          {
            id: "a",
            label: "Add a laughing emoji so you don't seem uptight.",
            assessment: "counterproductive",
            explanation: "Going along signals approval and makes the next thread more likely.",
          },
          {
            id: "b",
            label: "“Not doing this. Let's drop it.”",
            assessment: "constructive",
            explanation: "Short and low-key works. You don't need a speech to shift what the group thinks is acceptable.",
          },
          {
            id: "c",
            label: "Message a teammate privately who you think is also uncomfortable.",
            assessment: "constructive",
            explanation: "Two people pushing back is much easier than one, and it shows others they're not alone.",
          },
        ],
        takeaway: "You're probably not the only one who's uncomfortable.",
      },
    ],
  },
];

export function getLesson(slug: string) {
  return lessons.find((l) => l.slug === slug);
}
