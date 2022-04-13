// @TODO: add team names

const EVENT = '2022incol';
const TEAM = 'frc1024';
var client = new TBA(EVENT, TEAM);

const PARENT_URL = 'qdtroemner.github.io';

var comp_level_enum = {
	"qm": "qualification",
	"qf": "quarter-final",
	"sf": "semi-final",
	"f": "final"
}

function getTimeFromUNIX(unix) {
	let date = new Date(unix * 1000);
	let time = [date.getHours(), date.getMinutes(), date.getSeconds()]; // Hours, minutes, seconds
	let formatted_time = "";
	for (i in time) {
		let end_pad = i != 2 ? ":" : "";
		formatted_time += (i > 0 ? String(time[i]).padStart(2, "0") : String(time[i])) + end_pad;
	}
	let period = " AM";
	if (time[0] >= 12) {
		period = " PM";
	}
	if (time[0] > 12) {
		time[0] -= 12;
	}
	formatted_time += period;
	return formatted_time;
}

function set_stream_URL() {
	client.get_event().then(data => {
		if (data.webcasts.length > 0) {
			let webcasts = data.webcasts;
			for (webcast of webcasts) {
				if (webcast.type == "twitch") {
					let channelID = webcast.channel;
					let streamURL = `https://player.twitch.tv/?channel=${channelID}&parent=${PARENT_URL}`;
					document.getElementById('event-stream').src = streamURL;
				}
			}
		}
	});
}

function set_next_match_info() {
	client.get_event_team_statuses().then(event_team_statuses => {
		client.get_team_status().then(team_status_data => {
			let next_match_key = team_status_data.next_match_key;
			client.get_event_matches().then(event_matches_data => {
				for (match of event_matches_data) {
					if (match.key == next_match_key) {
						// Match #
						document.getElementById('next-match-label').innerHTML = `Our next match is ${comp_level_enum[match.comp_level]} ${match.match_number}`;
						// ETA
						let estimated_UNIX_start = match.predicted_time;
						let formatted_estimated_start = getTimeFromUNIX(estimated_UNIX_start);
						document.getElementById('next-match-time').innerHTML = `Estimated start is ${formatted_estimated_start}`;
						// Alliance Info
							// Blue alliance
								// Teams
								blue_team_keys = match.alliances.blue.team_keys;
								blue_team_key_cells = document.getElementById("blue-alliance").getElementsByClassName("team-key");
								for (cell_i in blue_team_keys) {
									blue_team_key_cells[cell_i].innerHTML = 
										blue_team_keys[cell_i] == TEAM ? `<span id="team-highlight">${blue_team_keys[cell_i]}</span>` : blue_team_keys[cell_i];	
									let team_rank = event_team_statuses[blue_team_keys[cell_i]].qual.ranking.rank;
									document.getElementById("blue-alliance").getElementsByClassName("team-rank")[cell_i].innerText = team_rank;
								}
							// Red alliance
								// Teams
								red_team_keys = match.alliances.red.team_keys;
								red_team_key_cells = document.getElementById("red-alliance").getElementsByClassName("team-key");
								for (cell_i in red_team_keys) {
									red_team_key_cells[cell_i].innerHTML = 
										red_team_keys[cell_i] == TEAM ? `<span id="team-highlight">${red_team_keys[cell_i]}</span>` : red_team_keys[cell_i];
									let team_rank = event_team_statuses[red_team_keys[cell_i]].qual.ranking.rank;
									document.getElementById("red-alliance").getElementsByClassName("team-rank")[cell_i].innerText = team_rank;
								}
						break;
					}
				}
			});
		});
	});
}

(function() {
	console.log("Ready");
	set_stream_URL();
	set_next_match_info();
	window.setInterval(() => {
		console.log("Updating...");
		//set_stream_URL();
		set_next_match_info();
	}, 30000);
})();