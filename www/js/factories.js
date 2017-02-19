/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module('starter')

.factory('NodePushServer', function ($http,BASE_URL){
  // Configure push notifications server address
  // 		- If you are running a local push notifications server you can test this by setting the local IP (on mac run: ipconfig getifaddr en1)
   return {
    // Stores the device token in a db using node-pushserver
    // type:  Platform type (ios, android etc)
    storeDeviceToken: function(userId,type,regId) {
      // Create a random userid to store with it
      var data = {
        user: userId,
        type: type,
        token: regId
      };
      console.log("Post token for registered device with data " + JSON.stringify(data));
      var request = {
        method: "post",
        url: BASE_URL+"/subscribe",
        data: data,
        dataType:"json"
         };
        // alert(JSON.stringify(user));
      $http(request).then(function (data, status) {
         // alert(JSON.stringify(data));
          localStorage.setItem('pushId','true');
        console.log("Token stored, device is successfully subscribed to receive push notifications.");
      });
     
    },
    // CURRENTLY NOT USED!
    // Removes the device token from the db via node-pushserver API unsubscribe (running locally in this case).
    // If you registered the same device with different userids, *ALL* will be removed. (It's recommended to register each
    // time the app opens which this currently does. However in many cases you will always receive the same device token as
    // previously so multiple userids will be created with the same token unless you add code to check).
    removeDeviceToken: function(token) {
      var tkn = {"token": token};
      $http.post(BASE_URL+'/unsubscribe', JSON.stringify(tkn))
      .success(function (data, status) {
        console.log("Token removed, device is successfully unsubscribed and will not receive push notifications.");
      })
      .error(function (data, status) {
        console.log("Error removing device token." + data + " " + status);
      });
    }
  };
})