class TBA {
	constructor(event, team=null) {
		this.auth = window.TBA_AUTH;
		this.baseURL = 'https://www.thebluealliance.com/api/v3';

		this.event = event;
		this.team = team;
	}

	get(endpoint) {
		let url = this.baseURL + endpoint;
		return fetch(url, {
			method: 'GET',
			headers: {
				'X-TBA-Auth-Key': this.auth
			}
		}).then(response => response.json());
	}

	get_api_status() {
		return this.get('/status');
	}

	get_event() {
		return this.get(`/event/${this.event}`);
	}

	get_event_matches() {
		return this.get(`/event/${this.event}/matches/simple`);
	}
	
	get_event_team_statuses() {
		return this.get(`/event/${this.event}/teams/statuses`);
	}

	get_team_matches() {
		if (this.team == null) {
			console.error("Team not set. Function can not be called.");
			return null;
		}
		return this.get(`/team/${this.team}/event/${this.event}/matches/simple`);
	}

	get_team_status() {
		if (this.team == null) {
			console.error("Team not set. Function can not be called.");
			return null;
		}
		return this.get(`/team/${this.team}/event/${this.event}/status`);
	}
}