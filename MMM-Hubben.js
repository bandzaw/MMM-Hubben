/* Magic Mirror
 * Module: MMM-Hubben
 *
 * By Your Name, https://github.com/yourgithubusername
 * MIT Licensed.
 */

Module.register('MMM-Hubben', {
    // Default module config.
    defaults: {
    },
    
    getStyles: function() {
        return ["MMM-Hubben.css"];
    },

    // Override dom generator.
    getDom: function() {
        Log.info('getDom of Hubben');
        var wrapper = document.createElement("div");

        if (this.menu) {
            /*
            for (var day in this.menu) {
                var dayDiv = document.createElement("div");
                dayDiv.innerHTML = '<strong>' + day + '</strong>';
    
                this.menu[day].forEach(function(lunch) {
                    var lunchP = document.createElement("div");
                    lunchP.innerHTML = lunch;
                    dayDiv.appendChild(lunchP);
                });
    
                wrapper.appendChild(dayDiv);
            }*/
            var table = document.createElement("table");
            var today = new Date().toLocaleString('default', { weekday: 'long' }).toLowerCase();
            for (var day in this.menu) {
                var row = document.createElement("tr");
    
                if (day === today) {
                    row.classList.add("current-day");
                }

                var dayCell = document.createElement("td");
                dayCell.innerHTML = '<strong>' + day + '</strong>';
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
        Log.info('Starting module: ' + this.name);
        this.sendSocketNotification('GET_MENU');
    },

    getHeader: function() {
        Log.info('getHeader');
        return this.name + " - veckans lunch meny";
    },
    
    // Override socket notification handler.
    socketNotificationReceived: function(notification, payload) {
        Log.info('Received socketNotification: ' + notification);
        if (notification === 'HUBBEN_MENU') {
            this.menu = payload;
            this.updateDom();
        }
    }
});