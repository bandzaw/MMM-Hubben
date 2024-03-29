/* Magic Mirror
 * Module: MMM-Hubben
 *
 * By Tommy Bandzaw, https://github.com/bandzaw/MMM-Hubben
 * Boost Software Licensed.
 */

const NodeHelper = require('node_helper');
const https = require('node:https');
const cheerio = require('cheerio');

module.exports = NodeHelper.create({

    start: function() {
        console.log('Starting node_helper for: ' + this.name);
        this.config = null;
    },

    fetchMenu: function(hubbenurl) {
        https.get(hubbenurl, (res) => {
            let data = '';

            // A chunk of data has been received.
            res.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received.
            res.on('end', () => {
                // Ok, all data received successfully from the server.
                // Now extract the data within the <div class="entry-content"> </div>.
                const $ = cheerio.load(data);
                const weekdays = ['måndag', 'mandag', 'tisdag', 'onsdag', 'torsdag', 'fredag'];
                let currentDay = null;
                let menu = {};
    
                $('.entry-content').children().each(function(i, elem) {
                    if (elem.name === 'h2') {
                        const id = $(this).attr('id');
                        const text = $(this).text().toLowerCase();
    
                        if (weekdays.includes(id) || weekdays.includes(text)) {
                            currentDay = id || text;
                            menu[currentDay] = [];
                        }
                        else if (text.includes('veckans')) {
                            currentDay = text;
                            menu[currentDay] = [];
                        }
                    } else if (elem.name === 'p' && currentDay) {
                        menu[currentDay].push($(this).text());
                    }
                });
                this.sendSocketNotification('HUBBEN_MENU', menu);
            });
        }).on('error', (err) => {
            console.log("Error: " + err.message);
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'HUBBEN_STARTING') {
            this.fetchMenu(payload.hubbenurl);
            setInterval(() => {
                this.fetchMenu(payload.hubbenurl);
            }, payload.updateIntervalInHours * 60 * 60 * 1000); // X hours in milliseconds
        }
    }
});