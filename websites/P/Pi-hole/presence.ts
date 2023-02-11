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
		presenceData.state = `Total queries: ${stats.total} | Blocked: ${stats.blockedPercentage}`; // TODO: add privacy mode
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
				// TODO: add privacy mode
				smallText = smallText + element.textContent;
				if (index !== filter.length - 1) smallText = `${smallText} | `;
			}
			presenceData.state = smallText;
		}
	} else if (path.includes("/admin/db_graph.php")) {
		// In Long-term Data > Graphics
		presenceData.details = "In Long-term data graphics";
	} else if (path.includes("/admin/db_queries.php")) {
		// In Long-term Data > Query Log
		presenceData.details = "In Long-term query log";
	} else if (path.includes("/admin/groups.php")) {
		// In groups
		presenceData.details = "Managing groups";
	} else if (path.includes("/admin/groups-clients.php")) {
		// In client-group management
		presenceData.details = "Managing clients";
	} else if (path.includes("/admin/groups-domains.php")) {
		// In Domain management
		presenceData.details = "Managing domains";
	} else if (path.includes("/admin/groups-adlists.php")) {
		// In ad lists
		presenceData.details = "Managing adlists";
	} else if (path.includes("/admin/dns_records.php")) {
		// In local DNS records
		presenceData.details = "Managing local DNS records";
	} else if (path.includes("/admin/cname_records.php")) {
		// In local CNAME records
		presenceData.details = "Managing local CNAME records";
	} else if (path.includes("/admin/messages.php")) {
		// In Tools > Pi-hole diagnostics
		presenceData.details = "In diagnostics";
	} else if (path.includes("/admin/gravity.php")) {
		// In Tools > Update Gravity
		presenceData.details = "Updating Gravity";
	}

	presence.setActivity(presenceData);
});
