/**
 * Per-screen help for the staff dashboard.
 *
 * Written for someone who runs a restaurant, not a website: plain language, no
 * jargon, and an explicit "what this screen can't do" so nobody hunts for a
 * button that was never built.
 *
 * Keep this honest. If a capability changes, change the copy in the same
 * commit -- wrong help is worse than no help.
 */

export interface ScreenHelp {
  /** One line: what this screen is for. */
  purpose: string;
  /** Where the changes show up for customers. */
  showsUpOn: string;
  /** Ordered steps for the everyday job. */
  how: { do: string; detail: string }[];
  /** Things this screen deliberately cannot do, and where to go instead. */
  cannot: string[];
}

/**
 * `satisfies` rather than a `Record<string, ScreenHelp>` annotation on purpose:
 * it keeps the literal keys, so `ADMIN_HELP.setttings` is a compile error
 * instead of `undefined` reaching the component and blanking a staff screen.
 */
export const ADMIN_HELP = {
  today: {
    purpose:
      "Your starting point each shift. It shows what is set up right now and links to the jobs you do most often.",
    showsUpOn: "Nothing here changes the website on its own — it is a summary.",
    how: [
      {
        do: "Check the top strip",
        detail:
          "Green means the website is talking to the database and your changes will save. If it is red, changes will not stick — send a screenshot to whoever built the site.",
      },
      {
        do: "Read the two boxes",
        detail:
          "'Special' shows which special customers see today. 'Sold out' counts how many menu items are currently switched off.",
      },
      {
        do: "Use 'Daily jobs'",
        detail:
          "Shortcuts to the three things you will do most: mark something sold out, set the special, change today's hours.",
      },
      {
        do: "Run the menu import once",
        detail:
          "If the site is brand new, an import button appears. It copies the printed menu into the system so you can edit it. Running it again only fixes the ordering — it never overwrites prices you have changed.",
      },
    ],
    cannot: [
      "It cannot edit anything directly — every box links to the screen that does.",
      "It does not show sales, orders or payments. The website does not take orders.",
      "It is not live — reload the page to refresh the numbers.",
    ],
  },

  menu: {
    purpose:
      "The full food and drinks menu. This is the screen you will use most.",
    showsUpOn: "The Menu page, and the food cards on the homepage.",
    how: [
      {
        do: "Mark something sold out",
        detail:
          "Tap the toggle next to the item. It immediately shows as sold out on the website. Tap again tomorrow to bring it back — the item is never deleted.",
      },
      {
        do: "Change a price",
        detail:
          "Tap the price and type the new one. Enter it in rands; the website adds the 'R' for you.",
      },
      {
        do: "Add an item",
        detail:
          "Use 'Add a menu item', pick which section it belongs to, then give it a name and price. A description and photo are optional.",
      },
      {
        do: "Reorder",
        detail:
          "Use the up/down arrows. The order here is the order customers see.",
      },
      {
        do: "Hide vs delete",
        detail:
          "Hiding takes an item off the website but keeps it here for later — use this for seasonal dishes. Delete removes it permanently.",
      },
    ],
    cannot: [
      "It cannot take orders or payments. Customers order in person or on WhatsApp.",
      "It cannot track stock levels — 'sold out' is a switch you flip, not a counter.",
      "It will not warn you before something is sold out; nothing counts down.",
      "Deleting an item is permanent. Hide it instead if you might bring it back.",
    ],
  },

  specials: {
    purpose:
      "Deals and promotions, like a Wednesday wings price or a weekend combo.",
    showsUpOn:
      "A banner on the homepage, and the specials section customers see first.",
    how: [
      {
        do: "Set today's special",
        detail:
          "Tap 'Set as today's special'. Only one can be the headline special at a time, so choosing one automatically switches the others off. You do not have to turn the old one off yourself.",
      },
      {
        do: "Build a library",
        detail:
          "Add your regular specials once — Wings Wednesday, weekend platter — and then just switch between them each day instead of retyping.",
      },
      {
        do: "Add a photo",
        detail:
          "Optional, but a special with a photo gets noticed far more than one without.",
      },
      {
        do: "Turn everything off",
        detail:
          "Switch the active special off and no special banner shows at all. That is normal for a quiet day.",
      },
    ],
    cannot: [
      "It cannot schedule a special for a future date — you switch it on the day.",
      "It cannot run two headline specials at once, by design.",
      "It cannot apply a discount to an order. It is a sign, not a till.",
      "It will not switch itself off at the end of the day — you do that.",
    ],
  },

  hours: {
    purpose:
      "Your opening times, plus the announcement bar for anything customers must know today.",
    showsUpOn:
      "The 'Open now' / 'Closed' badge across the whole site, the contact page, and the announcement strip at the top.",
    how: [
      {
        do: "Set each day",
        detail:
          "Enter an opening and closing time for every day of the week. These repeat every week — you only set them once.",
      },
      {
        do: "Close for a day",
        detail:
          "Flip 'Closed' for that day and the times are ignored. The site will show you as closed all day.",
      },
      {
        do: "Use the announcement",
        detail:
          "One short line at the top of every page. Use it for 'Closed today, private function' or 'Load shedding 6-8pm, kitchen still open'. Leave it empty and the strip disappears.",
      },
    ],
    cannot: [
      "It cannot handle public holidays automatically — change the day, then change it back.",
      "It cannot set different times for kitchen and bar; there is one set of hours.",
      "It cannot close you for a single hour mid-day. Use the announcement to explain instead.",
      "The 'Open now' badge follows South African time and the hours you set here. If it looks wrong, the hours are wrong.",
    ],
  },

  gallery: {
    purpose: "The photo gallery customers browse.",
    showsUpOn: "The Gallery page and the photo strip on the homepage.",
    how: [
      {
        do: "Upload straight from your phone",
        detail:
          "Take the photo and upload it as-is. Photos are shrunk automatically before they are sent, so it works on mobile data and will not use your whole bundle.",
      },
      {
        do: "Write a short caption",
        detail:
          "One or two words, like 'Wings & pap'. It appears over the photo.",
      },
      {
        do: "Describe the photo",
        detail:
          "The description field is read aloud to blind customers and is read by Google. Say plainly what is in the picture.",
      },
      {
        do: "Hide instead of delete",
        detail:
          "Hiding takes a photo off the website but keeps it here. Deleting removes it for good.",
      },
    ],
    cannot: [
      "It cannot crop, rotate or filter photos. Edit on your phone first, then upload.",
      "It cannot upload videos.",
      "It cannot pull photos from Instagram or Facebook automatically.",
      "Very dark or blurry photos will look worse on a big screen than on your phone — check before uploading.",
    ],
  },

  events: {
    purpose: "Live music, screenings, parties and anything else that is on.",
    showsUpOn: "The Events page and the 'What's on' block on the homepage.",
    how: [
      {
        do: "Add the event",
        detail:
          "Give it a name, a date and a short description of what is happening.",
      },
      {
        do: "Add the poster",
        detail:
          "If you already have a poster for WhatsApp or Instagram, upload the same image here.",
      },
      {
        do: "Hide it when it is over",
        detail:
          "Past events do not disappear on their own. Switch them off, or delete them once you are sure you will not run it again.",
      },
    ],
    cannot: [
      "It cannot sell tickets or reserve places for an event.",
      "It cannot hide an event automatically once the date has passed — you switch it off.",
      "It cannot post to Instagram or Facebook for you.",
      "It cannot repeat a weekly event automatically; add each one.",
    ],
  },

  settings: {
    purpose:
      "Your phone number, WhatsApp number, address and social links, in one place.",
    showsUpOn:
      "Everywhere — the footer, the contact page, and every 'WhatsApp Us' button on the site.",
    how: [
      {
        do: "WhatsApp number",
        detail:
          "This is the single most important field. Every WhatsApp button on the site opens a chat to this number. Enter it with the country code and no spaces, like 27821234567. Get this wrong and customers reach nobody.",
      },
      {
        do: "Phone and address",
        detail:
          "Shown on the contact page and used by Google when it lists you.",
      },
      {
        do: "Social links",
        detail:
          "Paste the full web address of your Instagram, Facebook and TikTok pages. Leave one blank and that icon disappears.",
      },
      {
        do: "Check it after saving",
        detail:
          "Open the site and press a 'WhatsApp Us' button. It should open WhatsApp to the right number.",
      },
    ],
    cannot: [
      "It cannot change the restaurant name, logo or colours.",
      "It cannot change the website address — see your domain notes for that.",
      "It cannot add new social networks beyond Instagram, Facebook and TikTok.",
      "It does not set up email. There is no email inbox on this site.",
    ],
  },
} satisfies Record<string, ScreenHelp>;
