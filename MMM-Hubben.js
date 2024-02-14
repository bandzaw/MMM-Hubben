/* Magic Mirror
 * Module: MMM-Hubben
 *
 * By Tommy Bandzaw, https://github.com/bandzaw/MMM-Hubben
 * Boost Software Licensed.
 */

Module.register('MMM-Hubben', {
    // Default module config.
    defaults: {
        hubbenurl: 'https://www.hubben.rest/',
        updateIntervalInHours: 8
    },
    
    getStyles: function() {
        return ["MMM-Hubben.css"];
    },

    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");

        if (this.menu) {
            var table = document.createElement("table");
            var today = new Date().toLocaleString('sv-SE', { weekday: 'long' }).toLowerCase();
            for (var day in this.menu) {
                var row = document.createElement("tr");
    
                if (day === today) {
                    row.classList.add("current-day");
                }

                var dayCell = document.createElement("td");
                dayCell.className = "weekday";
                dayCell.innerHTML = day;
                row.appendChild(dayCell);

                var lunchCell = document.createElement("td");
                this.menu[day].forEach(function(lunch) {
                    var lunchP = document.createElement("div");
                    lunchP.innerHTML = lunch;
                    lunchCell.appendChild(lunchP);
                });
                row.appendChild(lunchCell);
    
                table.appendChild(row);
            }
            wrapper.appendChild(table);
    
        } else {
            wrapper.innerHTML = 'No data yet...';
        }
    
        return wrapper;
    },

    // Override start method.
    start: function() {
        this.menu = {};
        this.data.header = "Hubben veckans lunchmeny";
        Log.info('Starting module: ' + this.name);
        this.sendSocketNotification('HUBBEN_STARTING', this.config);
    },

    getHeader: function() {
        return this.data.header;
    },
    
    // Override socket notification handler.
    socketNotificationReceived: function(notification, payload) {
        Log.info('Received socketNotification: ' + notification);
        if (notification === 'HUBBEN_MENU') {
            this.menu = payload;
            this.data.header = "Hubben veckans lunchmeny, senast uppdaterad: " + new Date().toLocaleString('sv-SE');
            this.updateDom();
        }
    }
});