/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('starter')
.factory('sessionInjector', [ function() {
      var  $token= localStorage.getItem('token'); 
    var sessionInjector = {
        request: function(config) {
                if(!config.params){
                    config.params={};
                }
               // config.params.token=$token;
              // config.headers['x-session-token'] = "token"+$token;
              config.headers.Authorization="token "+$token;
               
            return config;
        }
    };
             return sessionInjector;
   }
])


.config(['$httpProvider', function($http) { 
       
    //$httpProvider.interceptors.push('sessionInjector');
    $http.interceptors.push('sessionInjector');
}])


.service('PushNotificationsService', function ($rootScope, $cordovaPush, NodePushServer, $ionicLoading){
	/* Apple recommends you register your application for push notifications on the device every time it’s run since tokens can change. The documentation says: ‘By requesting the device token and passing it to the provider every time your application launches, you help to ensure that the provider has the current token for the device. If a user restores a backup to a device other than the one that the backup was created for (for example, the user migrates data to a new device), he or she must launch the application at least once for it to receive notifications again. If the user restores backup data to a new device or reinstalls the operating system, the device token changes. Moreover, never cache a device token and give that to your provider; always get the token from the system whenever you need it.’ */
	this.register = function() {
		var config = {};

		// ANDROID PUSH NOTIFICATIONS
		if(ionic.Platform.isAndroid())
		{
			config = {
				"senderID": '392766879503'
			};

			$cordovaPush.register(config).then(function(result) {
				// Success
				console.log("$cordovaPush.register Success");
				console.log(result);
				//$ionicLoading.show({
				//	
				//	template:'loading'
				//});
				alert(result);
			}, function(err) {
				// Error
				console.log("$cordovaPush.register Error");
				console.log(err);
				alert(err);
			});

			$rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
				console.log(JSON.stringify([notification]));
				switch(notification.event)
				{
					case 'registered':
						if (notification.regid.length > 0 ) {
							console.log('registration ID = ' + notification.regid);
							//alert('registration ID = ' + notification.regid);
							localStorage.setItem('gcmReg_id', notification.regid);
							alert( notification.regid);
							//$ionicLoading.hide();
						}
						break;

					case 'message':
						if(notification.foreground == "1")
						{
							console.log("Notification received when app was opened (foreground = true)");
						}
						else
						{
							if(notification.coldstart == "1")
							{
								console.log("Notification received when app was closed (not even in background, foreground = false, coldstart = true)");
							}
							else
							{
								console.log("Notification received when app was in background (started but not focused, foreground = false, coldstart = false)");
							}
						}

						// this is the actual push notification. its format depends on the data model from the push server
						console.log('message = ' + notification.message);
						break;

					case 'error':
						console.log('GCM error = ' + notification.msg);
						break;

					default:
						console.log('An unknown GCM event has occurred');
						break;
				}
			});

			// WARNING: dangerous to unregister (results in loss of tokenID)
			// $cordovaPush.unregister(options).then(function(result) {
			//   // Success!
			// }, function(err) {
			//   // Error
			// });
		}

		if(ionic.Platform.isIOS())
		{
			config = {
				"badge": true,
				"sound": true,
				"alert": true
			};

			$cordovaPush.register(config).then(function(result) {
				// Success -- send deviceToken to server, and store for future use
				console.log("result: " + result);
				//NodePushServer.storeDeviceToken("ios", result);
			}, function(err) {
				console.log("Registration error: " + err);
			});

			$rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
				console.log(notification.alert, "Push Notification Received");
			});
		}
	};
})



          
 .service('Authentication', function ($q,$http,$ionicHistory,$state,$http,$ionicLoading,$window,$location,ionicToast,BASE_URL) {
	 
	 var userCredential = [];
	 
    this.userLogin = function(data){
		return $q(function(resolve, reject) {
             this.request = {
                    method: "post",
                    url: BASE_URL+"/hotsys/login",
                    data: data
                     };
                    $http(this.request).then(function successCallback(response){ onSuccess(response.data);  }, function errorCallback(){
						onError();
						
					});
					 	function onSuccess(data)
								{
							if(data.status=="1")
								{
								   localStorage.setItem('loggedIn',true);
								   localStorage.setItem('UserInfo',JSON.stringify(data.userInfo));
								   //userCredential=data.userInfo;
									resolve('Login success.');
									console.log('Login success.');
									
								}
								else {
									reject('Login Failed.');
								  }
								}
								function onError()
								{
									reject('Login Failed.');
								} 
								 
		});
				
    };
	
	this.storeCredentail = function(data){
		//console.log(data);
		
		userCredential = data
		
	};
	
	this.getuserCredential = function(){
		
		return userCredential;
	}

})

.service('Getcount',function($http,BASE_URL){
    var msgcount={};
           this.msgcount = function(id){
               $http.get(BASE_URL+'/msg/count/'+id).then(function(response){
                  // return  response.data;
                  msgcount = response.data;
                   console.log(msgcount);
               });
              return msgcount
           };
           
           this.projectcount = function(){
               $http.get(BASE_URL+'/project/count').then(function(response){
                   project = response.data;
                   return project;
                   
               }); 
           };
           
           this.usercount = function(){
                $http.get(BASE_URL+'/user/count').then(function(response){
                   user = response.data;
                   return user;
                   
               });
               
           };
            
  })
 
  .service('Dataservice',function(){
      var data=[];
	  var shift=[], meal=[];
      
       this.setData = function(arr){
           
           data=arr;
           console.log(data);
       };
       
       this.getData = function(){
           
           return data;
       };
	 
      
       this.setShift = function(data){
		 
                 shift  = data;
				 console.log(shift);
				 
       };
	   this.setMeal = function(){
		   meal=data;
             console.log(meal) ;     
       };
	   this.getShift = function(){
           return shift; 
       };
	    this.getMeal = function(){
           return meal;        
       };
      var discountData = [];
      this.setDiscountData = function(data){
		 
        discountData = data;		 
		  
	  }
	  
	  this.getDiscountData = function(){
		  return discountData;
	  }
      
  })
  
    .service('Listservice',function($http,BASE_URL){
        var locations = {};
       this.getLocation = function(callback){
           
          $http.get(BASE_URL+'/hotsys/getlocation').then(function(response){
					
                  callback(response.data);
		});
       };
       
        this.getCaptain = function(callback){
           
          $http.get(BASE_URL+'/hotsys/getCaptain').then(function(response){
					  
                        callback(response.data);
		});
       };
      
      this.getSteward = function(callback){
           
          $http.get(BASE_URL+'/hotsys/getSteward').then(function(response){
					  
                        callback(response.data);
		});
       };
        this.getEmply = function(callback){
            $http.get(BASE_URL+'/hotsys/getEmply').then(function(response){
	 			
                  callback(response.data);
                   
					});
                     };
         this.getDept = function(callback){
             
             $http.get(BASE_URL+'/hotsys/getDept').then(function(response){
					// console.log(response);
                   callback(response.data);
                   
					});
             
         };
          
          this.getReason = function(callback){
                $http.get(BASE_URL+'/hotsys/getReason').then(function(response){
					 // console.log(response);
                  
                    callback(response.data);
					});
              
          };
          
            this.getGuest = function(callback){
                $http.get(BASE_URL+'/hotsys/getGuests').then(function(response){
			 callback(response.data);
                console.log(response.data);
                   
			});
              
          };
		    
			this.getTable = function(callback){
                $http.get(BASE_URL+'/hotsys/getTable/'+JSON.parse(localStorage.getItem('location')).LocationCode).then(function(response){
			 callback(response.data);
                console.log(response.data);
                   
			});
              
          };
		  
              this.getKotno = function(callback){
                $http.get(BASE_URL+'/hotsys/getKotno').then(function(response){
			 callback(response.data);
                console.log(response.data);
                   
			});
              
          };
          var data=[];
            this.getKots = function(callback){
                var table=localStorage.getItem('table');
                              
               
					$http.get(BASE_URL+'/hotsys/openKot/'+table).then(function(response){
					callback(response.data);
                  
                   
				});
              
           };
		   
		 this.getDiscounts=function(callback){
			 
			  var disclocation = (JSON.parse(localStorage.getItem('location'))).LocationCode;
			  $http.get(BASE_URL+'/hotsys/getDiscount?location='+disclocation+'&param=FHRAI').then(function(response){
				  callback(response.data);
			  });
			 
		 }
		 
		 this.getTaxes = function(callback){
			 var taxlocation = (JSON.parse(localStorage.getItem('location'))).LocationCode;
			  $http.get(BASE_URL+'/hotsys/getTaxes/'+taxlocation).then(function(response){
				  callback(response.data);
			  });
			 
		 }
       
  })

    
.service('KOTservice',function($http,BASE_URL){
        this.saveKot = function(callback){
                $http.get(BASE_URL+'/hotsys/saveKot').then(function(response){
			 callback(response.data);
                console.log(response.data);
                   
			});
      
        };
     
        this.saveNprintKot = function(callback){
                $http.get(BASE_URL+'/hotsys/savenprintKot').then(function(response){
			 callback(response.data);
                console.log(response.data);
                   
			});
      
        };
        
        this.cancelKotItem = function(callback){
                $http.get(BASE_URL+'/hotsys/cancelKotItem').then(function(response){
			 callback(response.data);
                console.log(response.data);
                   
			});
      
        };
  });