const presence = new Presence({
	clientId: "1073975411156979802",
});

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			// Pi-hole logo
			largeImageKey: "https://i.imgur.com/T0dkjxz.png",
		},
		path = document.location.pathname;
	if (path === "/admin" || path.includes("/admin/index.php")) {
		// In dashboard
		// Query statistics
		const stats = {
			total: document.querySelector("#dns_queries_today").textContent,
			blockedPercentage: document.querySelector("#percentage_blocked_today")
				.textContent,
		};
		presenceData.details = "In dashboard";
		presenceData.state = `Total queries: ${stats.total} | Blocked: ${stats.blockedPercentage}`;
	} else if (path.includes("/admin/queries.php")) {
		// In query log
		presenceData.details = "In query log";
		// For filtering function in query log
		const filter = document.querySelectorAll(
			"tbody > [role='row']:nth-child(1) > [class='highlight']"
		);
		// If there's active filtering in page
		if (filter.length > 0) {
			let smallText = "Filtering: ";
			// Concat all active filter
			for (const [index, element] of filter.entries()) {
				smallText = smallText + element.textContent;
				if (index !== filter.length - 1) smallText = `${smallText} | `;
			}
			presenceData.state = smallText;
		}
	}

	presence.setActivity(presenceData);
});
