let presence: Presence;

function setPresence(): void {
	if (location.pathname.includes("/r/netflix"))
		presence = new Presence({ clientId: "869992823854870588" });
	else presence = new Presence({ clientId: "609183409440555018" });
}

setPresence();

let subReddit: string,
	postTitle: string,
	username: string,
	nickname: string,
	rpanTitle: string,
	strings: Awaited<ReturnType<typeof getStrings>>,
	oldLang: string = null;

async function getStrings() {
	return presence.getStrings(
		{
			browsing: "general.browsing",
			live: "general.live",
			profile: "general.viewProfile",
			searchSomething: "general.searchSomething",
			searching: "general.search",
			reading: "general.readingPost",
			watching: "general.watching",
			readButton: "general.buttonReadArticle",
			viewProfileButton: "general.buttonViewProfile",
			streamButton: "general.buttonWatchStream"
		},
		await presence.getSetting<string>("lang").catch(() => "en")
	);
}

const startTimestamp = Math.floor(Date.now() / 1000),
	oldReddit = document.querySelector("._1tvdSTbdxaK-BnUbzUIqIY") === null;

presence.on("UpdateData", async () => {
	setPresence();
	const newLang = await presence.getSetting<string>("lang").catch(() => "en"),
		buttons = await presence.getSetting<boolean>("buttons"),
		privacy = await presence.getSetting<boolean>("privacy");

	if (oldLang !== newLang || !strings) {
		oldLang = newLang;
		strings = await getStrings();
	}

	const presenceData: PresenceData = {
			largeImageKey: "reddit_lg",
			startTimestamp
		},
		{ pathname } = window.location;
	if (oldReddit) {
		subReddit = document.querySelector(".redditname")
			? `${
					!privacy
						? `r/${document.querySelector(".redditname").textContent}` // if privacy mode is disabled
						: "In a subreddit" // if privacy mode is enabled
			  }`
			: "Home";
		if (pathname.includes("/comments/")) {
			if (!privacy) {
				// if privacy mode is disabled
				postTitle = document.querySelector("p.title > a").textContent;
				presenceData.details = `${(await strings).reading} '${postTitle}'`;
				presenceData.state = subReddit;
				presenceData.buttons = [
					{
						url: `https://www.reddit.com${pathname}`,
						label: (await strings).readButton
					}
				];
			} else {
				// if privacy mode is enabled
				presenceData.details = `${(await strings).reading.slice(0, -1)}`;
				presenceData.state = subReddit;
			}
		} else if (pathname.startsWith("/user/")) {
			if (!privacy) {
				// if privacy mode is disabled
				username = document.querySelector(".titlebox > h1").textContent;
				presenceData.details = (await strings).profile;
				presenceData.state = username;
				presenceData.buttons = [
					{
						url: `https://www.reddit.com${pathname}`,
						label: (await strings).viewProfileButton
					}
				];
			} else presenceData.details = (await strings).profile.slice(0, -4); // if privacy mode is enabled
		} else if (pathname.startsWith("/search")) {
			presenceData.details = (await strings).searchSomething;
			presenceData.smallImageKey = "search";
			presenceData.smallImageText = (await strings).searching;
		} else {
			presenceData.details = (await strings).browsing;
			presenceData.state = subReddit;
		}
	} else if (pathname.includes("/comments/")) {
		postTitle =
			document.querySelector(
				"div._2SdHzo12ISmrC8H86TgSCp._29WrubtjAcKqzJSPdQqQ4h"
			)?.textContent || "";
		subReddit = document.querySelector(
			"span._19bCWnxeTjqzBElWZfIlJb"
		).textContent;
		subReddit =
			subReddit === "Home" &&
			document.querySelectorAll("._19bCWnxeTjqzBElWZfIlJb")[1] !== null
				? document.querySelectorAll("._19bCWnxeTjqzBElWZfIlJb")[1].textContent
				: subReddit;
		presenceData.details = `${(await strings).reading} '${postTitle}'`;
		presenceData.state = subReddit;
		presenceData.buttons = [
			{
				url: `https://www.reddit.com${pathname}`,
				label: (await strings).readButton
			}
		];
	} else if (pathname.startsWith("/user/")) {
		if (!privacy) {
			// if privacy mode is disabled
			username = document.querySelector("span._1LCAhi_8JjayVo7pJ0KIh0")
				? document.querySelector("span._1LCAhi_8JjayVo7pJ0KIh0").textContent
				: document
						.querySelector("span._28nEhn86_R1ENZ59eAru8S")
						.textContent.match(/u\/[A-Za-z0-9_-]+/i)[0]
						.slice(2);
			nickname = document.querySelector("h4._3W1eUu5jHdcamkzFiJDITJ")
				? document.querySelector("h4._3W1eUu5jHdcamkzFiJDITJ").textContent
				: "";
			presenceData.details = (await strings).profile;
			presenceData.state = nickname !== "" ? nickname : username;
			presenceData.buttons = [
				{
					url: `https://www.reddit.com${pathname}`,
					label: (await strings).viewProfileButton
				}
			];
		} else presenceData.details = (await strings).profile.slice(0, -4); // if privacy mode is enabled
	} else if (pathname.startsWith("/search")) {
		presenceData.details = (await strings).searchSomething;
		presenceData.smallImageKey = "search";
		presenceData.smallImageText = (await strings).searching;
	} else if (pathname.startsWith("/rpan")) {
		presenceData.details = `${(await strings).watching} (RPAN)`;
		if (!privacy) {
			// if privacy mode is disabled
			rpanTitle = document.querySelector("h1")
				? document.querySelector("h1").textContent
				: "Loading title...";
			presenceData.state = rpanTitle;
			presenceData.buttons = [
				{
					url: `https://www.reddit.com${pathname}`,
					label: (await strings).streamButton
				}
			];
		}
		presenceData.smallImageKey = "live";
		presenceData.smallImageText = (await strings).live;
	} else {
		const sub = document.querySelector("span._1GieMuLljOrqnVpRAwz7VP");
		if (sub === null) {
			const sub2 = document.querySelector(
				"#SHORTCUT_FOCUSABLE_DIV > div:nth-child(4) > div > div > div > div._3ozFtOe6WpJEMUtxDOIvtU > div.MSTY2ZpsdupobywLEfx9u > div._3JDs8KEQIXSMn1bTF2ZqJ_ > div.QscnL9OySMkHhGudEvEya > div._3I4Wpl_rl6oTm02aWPZayD > div._3TG57N4WQtubLLo8SbAXVF > h2"
			);
			presenceData.details = (await strings).browsing;
			presenceData.state = !sub2 ? "Home" : sub2.textContent;
		} else {
			presenceData.details = (await strings).browsing;
			presenceData.state = sub.textContent;
		}
	}
	if (pathname.includes("/r/netflix")) {
		if (!presenceData.buttons?.length) {
			presenceData.buttons = [
				{
					url: "https://www.reddit.com/r/netflix",
					label: "View r/Netflix Subreddit"
				},
				{
					url: "https://discord.gg/bDumw325vX",
					label: "Join r/Netflix Discord"
				}
			];
		}
		if (presenceData.buttons.length === 1) {
			presenceData.buttons.push({
				url: "https://discord.gg/bDumw325vX",
				label: "Join r/Netflix Discord"
			});
		}
	}
	if (!buttons) delete presenceData.buttons;
	presence.setActivity(presenceData, true);
});
