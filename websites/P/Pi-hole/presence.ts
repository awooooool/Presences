const presence = new Presence({
		clientId: "1073975411156979802",
	});

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
		largeImageKey: "https://i.imgur.com/T0dkjxz.png",
		state: `Hostname: ${document.querySelector("body > div.wrapper > header > nav > div > ul > li:nth-child(1) > p > code").textContent}`
	};

	presence.setActivity(presenceData);
});
