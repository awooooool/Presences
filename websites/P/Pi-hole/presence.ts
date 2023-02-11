const presence = new Presence({
	clientId: "1073975411156979802",
});

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
		largeImageKey: "https://i.imgur.com/T0dkjxz.png"
	};

	const path = document.location.pathname;
	if (path === "/admin" || path.includes("/admin/index.php")) {
		const stats = {
			total: document.querySelector("#dns_queries_today").textContent,
			blockedPercentage: document.querySelector("#percentage_blocked_today").textContent,
		};
		presenceData.details = "In dashboard";
		presenceData.state = `Total queries: ${stats.total} | Blocked: ${stats.blockedPercentage}`;
	}

	presence.setActivity(presenceData);
});
