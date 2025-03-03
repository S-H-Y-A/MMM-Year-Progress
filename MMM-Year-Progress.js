/* Magic Mirror Module: MMM-Year-Progress
 * Version: 1.0.0
 *
 * By Ricardo Gonzalez https://github.com/ryck/MMM-Year-Progress
 * MIT Licensed.
 */
Module.register("MMM-Year-Progress", {
	defaults: {
		updateInterval: 60 * 1 * 1000, // Every minute
		debug: false
	},
	start: function() {
		Log.info(`Starting module: ${this.name}`);

		// Calculate how many ms should pass until next update depending on if seconds is displayed or not
		const delayCalculator = () => {
			const EXTRA_DELAY = 50; // Deliberate imperceptible delay to prevent off-by-one timekeeping errors
			return 1000 - moment().milliseconds() + EXTRA_DELAY;
		};

		// A recursive timeout function instead of interval to avoid drifting
		const notificationTimer = () => {
			this.updateDom();
			setTimeout(notificationTimer, delayCalculator());
		};

		// Set the initial timeout with the amount of seconds elapsed as
		// reducedSeconds, so it will trigger when the minute changes
		setTimeout(notificationTimer, delayCalculator());

		// Set locale.
		moment.locale(config.language);
	},
	getStyles: function() {
		return ["MMM-Year-Progress.css"];
	},
	// Define required scripts.
	getScripts: function() {
		return ["moment.js"];
	},
	//Define header for module.
	getHeader: function() {
		return this.data.header;
	},
	// Override dom generator.
	getDom: function () {
		let wrapper = document.createElement("div");
		wrapper.className = "small progress-bar"

		// Start building table.
		const dataTable = document.createElement("table");

		let yearRow = document.createElement("tr");
		let monthRow = document.createElement("tr");
		let weekRow = document.createElement("tr");
		let dayRow = document.createElement("tr");

		let yearNumberCell = document.createElement("td");
		yearNumberCell.className = "data numbers year";
		let yearBarCell = document.createElement("td");
		yearBarCell.className = "data bar year";
		let yearPercentCell = document.createElement("td");
		yearPercentCell.className = "data percent year";

		let monthNumberCell = document.createElement("td");
		monthNumberCell.className = "data numbers month";
		let monthBarCell = document.createElement("td");
		monthBarCell.className = "data bar month";
		let monthPercentCell = document.createElement("td");
		monthPercentCell.className = "data percent month";

		let weekNumberCell = document.createElement("td");
		weekNumberCell.className = "data numbers week";
		let weekBarCell = document.createElement("td");
		weekBarCell.className = "data bar week";
		let weekPercentCell = document.createElement("td");
		weekPercentCell.className = "data percent week";

		let dayNumberCell = document.createElement("td");
		dayNumberCell.className = "data numbers day";
		let dayBarCell = document.createElement("td");
		dayBarCell.className = "data bar day";
		let dayPercentCell = document.createElement("td");
		dayPercentCell.className = "data percent day";

		// Year
		let numWrapper = document.createElement("span");
		numWrapper.className = "numbers"
		let barWrapper = document.createElement("span");
		barWrapper.className = "bar"
		let percentWrapper = document.createElement("span");
		percentWrapper.className = "percent"

		const now = moment();


		const daysInYear = now.isLeapYear() ? 366 : 365;
		const dayYear = now.dayOfYear();

		const percentYear = ((now.unix() - moment("1/1", "MM/dd").unix()) / (86400 * daysInYear) * 100).toFixed(5);
		const yearBar = this.progressBar(percentYear)



		yearNumberCell.innerHTML = dayYear + "/" + daysInYear
		yearBarCell.innerHTML = yearBar
		yearPercentCell.innerHTML = percentYear + "%"

		yearRow.append(yearNumberCell)
		yearRow.append(yearBarCell)
		yearRow.append(yearPercentCell)

		dataTable.appendChild(yearRow);

		// Month
		const daysInMonth = moment().endOf("month").date();
		const dayMonth = now.date();
		const percentMonth = ((now.unix() - moment(1, "DD").unix()) / (86400 * daysInMonth) * 100).toFixed(4);
		percentWrapper = percentMonth + "%"
		const monthBar = this.progressBar(percentMonth)

		monthNumberCell.innerHTML = dayMonth + "/" + daysInMonth
		monthBarCell.innerHTML = monthBar
		monthPercentCell.innerHTML = percentMonth + "%"

		monthRow.append(monthNumberCell)
		monthRow.append(monthBarCell)
		monthRow.append(monthPercentCell)

		dataTable.appendChild(monthRow);

		// Week
		const weekDay = now.day();
		const percentWeek = ((now.unix() - moment(0, "HH").startOf("week").unix()) / (86400 * 7) * 100).toFixed(4);
		percentWrapper = percentWeek + "%"
		const weekBar = this.progressBar(percentWeek)

		weekNumberCell.innerHTML = weekDay + "/" + 6
		weekBarCell.innerHTML = weekBar
		weekPercentCell.innerHTML = percentWeek + "%"

		weekRow.append(weekNumberCell)
		weekRow.append(weekBarCell)
		weekRow.append(weekPercentCell)

		dataTable.appendChild(weekRow);

		// Day
		const hour = now.hour();
		const percentDay = ((now.unix() - moment(0, "HH").unix()) / (86400) * 100).toFixed(4);
		percentWrapper = percentDay + "%"
		const dayBar = this.progressBar(percentDay)

		dayNumberCell.innerHTML = hour + "/" + 24
		dayBarCell.innerHTML = dayBar
		dayPercentCell.innerHTML = percentDay + "%"

		dayRow.append(dayNumberCell)
		dayRow.append(dayBarCell)
		dayRow.append(dayPercentCell)

		dataTable.appendChild(dayRow);

		wrapper.appendChild(dataTable);

		return wrapper;
	},

	progressBar: function(percent) {
		let progressBar = ""
		for (let i = 5; i <= 100; i += 5) {
			progressBar = (i <= percent) ? progressBar + "▓" : progressBar + "░"
		}
		return progressBar
	}
});
