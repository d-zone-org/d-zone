'use strict';
addEventListener('message', function(event) {
    console.log('Message received from main script', event.data);
    close();
});