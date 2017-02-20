var user;

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope,$http, $ionicModal,$window, $timeout, $state,Getcount,$ionicHistory,BASE_URL,Authentication) {
   
  var loginData = localStorage.getItem('loggedIn');
  if(loginData){
       user = localStorage.getItem('UserInfo');
        Authentication.storeCredentail(JSON.parse(user));
	 //  console.log(JSON.parse(user));
	  
       $state.go('app.dashboard',{},{reload: true});
  }
  else{
      $state.go('login',{},{reload: true});
  }
  
  $scope.toggleleft=function(){
	  
	  user = Authentication.getuserCredential();
	   //console.log(user[0]);
	   $scope.UserName= user[0].UserName;
           localStorage.setItem('username',$scope.UserName);
	  
  }
 $scope.logout = function(){
     localStorage.clear();
	  $state.go('login',{},{reload: true});
      
      $ionicHistory.clearCache();//.then(function(){ $state.go('login',{},{reload: true}); });
     
 };
})



.controller('LoginCtrl', function($scope,$state, $stateParams,$http,$ionicLoading,$window,ionicToast,$ionicHistory,BASE_URL,Authentication,Dataservice) {
    
	
    $scope.submit=function(data){
        $ionicLoading.show();
     // $scope.login = Authentication.userLogin(data);
        Authentication.userLogin(data).then(function(authenticated) 
	  {
	    localStorage.setItem('shift',data.shift.ShiftNo);
	    localStorage.setItem('meal',data.meal.MealCode);
		$ionicLoading.hide();
	    ionicToast.show('You are Logged-in', 'bottom', true, 500);
        $state.go('app.dashboard', {}, {reload: true});
		 $window.location.reload(true);
      
	  }, function(err) 
	  {
		   $ionicLoading.hide();
		   $state.go('login', {}, {reload: true});
		   ionicToast.show('Invalid username or password.', 'middle', true, 2000);
      });
        
    };
	
	 $http.get(BASE_URL+'/hotsys/getshift').then(function(response){
					   //console.log(response);
                   $scope.shifts = response.data;
                   
					});
	 $http.get(BASE_URL+'/hotsys/getmeal').then(function(response){
					    // console.log(response);
                  $scope.meals =  response.data;
                  
					});
	
})

.controller('dashboardCtrl',function($scope,$state,$http, $stateParams,BASE_URL, $window ,$ionicModal ,$ionicLoading,$ionicPopup, $ionicActionSheet,Dataservice,Listservice, NodePushServer){
     
         // call for location service
         Listservice.getLocation(function(data) {   
			$scope.locations=data;
             });
        // call for Captain
	 Listservice.getCaptain(function(data) {   
			$scope.captains=data;
             });
          // Call for Steward    
           Listservice.getSteward(function(data) {   
			$scope.stewards=data;
             });
          // call for employee 
    	  Listservice.getEmply(function(data) {   
			$scope.employes = data;
             });	
	 // call for Department
            Listservice.getDept(function(data) {   
			 $scope.departments = data;
             });
              // call for Reason
           Listservice.getReason(function(data) {   
			 $scope.reasons = data;
             });
	   // call for KOT NO
         Listservice.getKotno(function(data) {   
			$scope.data.kotno = data;
             });
					
	$scope.data={};
	$scope.data.tableNo = localStorage.getItem('table');
	$scope.data.locationselected = JSON.parse(localStorage.getItem('location'));

	$scope.showactions = function() {

   // Show the action sheet
   var hideSheet = $ionicActionSheet.show({
     buttons: [
       { text: 'Open KOTS' },
       { text: 'Unsetteled Bills' },
       { text: 'Save N Print' },
       { text: 'Print Bill' },
       { text: 'Settle' },
       { text: 'Save N Exit' }
    
     ],
    
     titleText: 'Action on KOTS',
     cancelText: 'Cancel',
     cancel: function() {
          // add cancel code..
        },
     buttonClicked: function(index) {
        if(index==0){
			$scope.openModalmodalkots();
                        return true;
		}  
        if(index==5){
			$scope.submitKOT();
                        return true;
		} 
	  
     }
   });



 };
 $scope.modifier=[];
  $scope.onHold=function(menuIndex){
	  
	   $ionicActionSheet.show({
     buttons: [
      
       { text: 'ADD modifier' },
       { text: 'Cancel Menu' },
      
    
     ],
    
     titleText: 'Action on KOTS',
     cancelText: 'Cancel',
     cancel: function() {
          // add cancel code..
        },
     buttonClicked: function(index) {
         if(index==0){
             
            $scope.addmodifier(menuIndex);
          // console.log($scope.modifier);
              return true;
         }
           if(index==1){
             
            $scope.removeItem(menuIndex);
          // console.log($scope.modifier);
              return true;
         }
       return true;
     }
   });
	  
	  
  };
  
  $scope.addmodifier= function(data){
       var myPopup = $ionicPopup.show({
    template: '<input type="text" ng-model="data.modifier">',
    title: 'Enter Modifier',
    subTitle: 'Please use normal things',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.modifier) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
             $scope.modifier[data] = $scope.data.modifier;
             console.log($scope.modifier);
             return  $scope.data.modifier;
          }
        }
      }
    ]
  });
    
      
      return myPopup;
  };
  
  
  $ionicModal.fromTemplateUrl('templates/menumodal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.onLocactionChange=function(data){
	  
	  $http.get(BASE_URL+'/hotsys/getMenucat/'+data).then(function(response){
					 // console.log(response);
                   $scope.menuCategories = response.data;
                   
					});
  }  
  
  $scope.getmenus = function(data){
	   $ionicLoading.show();
	    $scope.menus={};
	  console.log(data);
	  $http.get(BASE_URL+'/hotsys/getMenus/'+data).then(function(response){
					  //console.log(response);
					  $ionicLoading.hide();
                     $scope.menus = response.data;
					 var items=response.data;
					 var chunk_size=5;
					 var chunks=[];
					 for (var i = 0; i < items.length; i += chunk_size) {
							chunks.push(items.slice(i, i + chunk_size));
						}
					 console.log(chunks);
					  $scope.menus=chunks;
					});
  
  }
  

 
  var timeoutID = null;
  $scope.timeout = function(value) {
    clearTimeout(timeoutID);
    timeoutID = setTimeout($scope.updatevalue(value), 1000);
  };

  //check for table availabilitys
  $scope.updatevalue = function(value){	
	 $http.get(BASE_URL+'/hotsys/checkTable/'+value).then(function(response){
					 // console.log(response);
                   var table = response.data;
				   console.log(table)
				   if(table=="1"){
					   alert("table already Occuppied");
					   $scope.data.tableNo="";
				   }

                   
					});
	}

	
 $ionicModal.fromTemplateUrl('templates/rooms.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalroom = modal;
  });	
   $scope.openModalroom = function() {
     // Guest List
      Listservice.getGuest(function(data) {   
		$scope.guests = data;  
                
                $scope.modalroom.show();
             });
  };
  
  $scope.closeModalroom = function() {
    $scope.modalroom.hide();
  };
  
  
  $ionicModal.fromTemplateUrl('templates/guestdetails.html', {
    scope: $scope,
    animation: 'slide-in-left'
  }).then(function(modal) {
    $scope.modaldetails = modal;
  });
$scope.showDetails = function(data){
	   $scope.guest=data[0];
	   console.log(data);
	  $scope.modaldetails.show();
	
}

$scope.closeModaldetails = function() {
    $scope.modaldetails.hide();
  };	
 
 $scope.addGuestdetails = function(details){
	  $scope.data.roomNo = details.Room_No;
	 $scope.data.roomno = details.Room_No;
 	 $scope.data.folio = details.Folio_Id;
	 $scope.data.guestname = details.Guest_Name;
	 $scope.data.cmpyname = details.Payment_Mode;
	 $scope.data.plan = details.Plan_Package;
	 $scope.data.spInst = details.Special_Instr;
	 $scope.data.roomservice=true;
	 
	 $scope.closeModaldetails();
	 $scope.closeModalroom();
 }
  
$scope.kotmenus = [];
 $scope.addTOkot = function(menu){
	 
	  $scope.kotmenus.push(menu);
	  
    console.log($scope.kotmenus);
	 
 } 
 $scope.totalSum=0;
 $scope.amount=[];
 $scope.qty=[];
 $scope.addSum = function(value,index){
	 //console.log();
	 $scope.qty[index]=value;
	 $scope.kotmenus[index].qty=value;
	 $scope.amount[index]=$scope.kotmenus[index].Rate*value;
	 $scope.kotmenus[index].amount = $scope.kotmenus[index].Rate*value;
	 console.log($scope.qty);
	// $scope.totalSum = $scope.totalSum+$scope.kotmenus[index].Rate*value
	 //$scope.totalSum = $scope.totalSum+value;
	 $scope.totalSum = $scope.amount.reduce(function(prev, cur) {
										return prev + cur;
								});
	  $scope.totalqty=$scope.qty.reduce(function(prev, cur) {
										return prev + cur;
								});
 };

  
  $scope.submitKOT = function(){
	 // console.log($scope.kotmenus);;
          $scope.kotdata={};
	 $scope.kotdata.locationcode = $scope.data.location.LocationCode;
	 $scope.kotdata.KotItem = $scope.kotmenus;
	 $scope.kotdata.TableNo = $scope.data.tableNo;
	 $scope.kotdata.KOTNo = $scope.data.kot;
	 $scope.kotdata.complementoryKot = ($scope.data.complementry===true)? 1 : 0;
	 $scope.kotdata.shiftNo = localStorage.getItem('shift');
	 $scope.kotdata.meal = localStorage.getItem('meal');
         if($scope.data.complementry===true){
	 $scope.kotdata.departmentcode = ($scope.department)? $scope.department.DepartmentCode: 'NULL';
         $scope.kotdata.EmployeCode =  ($scope.employe)? $scope.employe.EmployeeCode : 'NULL';  
         $scope.kotdata.compresoncode = ($scope.data.reason.ReasonCode)? $scope.data.reason.ReasonCode : 'NULL';
          }else{
         $scope.kotdata.departmentcode =  'NULL';
         $scope.kotdata.EmployeCode =   'NULL';  
         $scope.kotdata.compresoncode =  'NULL';
          }
	 $scope.kotdata.covers = $scope.data.covers;
	 $scope.kotdata.captaincode = ($scope.captain)? $scope.employe.EmployeeCode : 'NULL';
	 $scope.kotdata.captainname = ($scope.captain)? $scope.employe.EmployeeName : 'NULL';
         $scope.kotdata.stewardcode =	($scope.steward)? $scope.employe.EmployeeCode : 'NULL';  
         $scope.kotdata.stewardname = ($scope.steward)? $scope.employe.EmployeeName : 'NULL';
	 $scope.kotdata.menuLocationcode = $scope.data.menulocation;
	
	 $scope.kotdata.guest = $scope.data.guest;
	 $scope.kotdata.Room_No = $scope.data.roomno;
	 $scope.kotdata.Room_folio = $scope.data.folio;
         var request = {
                    method: "POST",
                    url: BASE_URL+"/saveKot",
                    headers: {'content-type': 'application/json; charset=UTF-8','Authorization': 'bearer'},
                    data: $scope.kotdata
                     };
         $http(request).then(function(data){console.log(data)});
         
         console.log($scope.kotdata);
	    
   };
   
   // open kots Modal
   $ionicModal.fromTemplateUrl('templates/openkots.html', {
    scope: $scope,
    animation: 'slide-in-right'
  }).then(function(modal) {
    $scope.modalkots = modal;
  });	
   $scope.openModalmodalkots = function() {
     // Guest List
     Listservice.getKots(function(data) { 
           console.log(data);
			$scope.kots=data;
                        $scope.modalkots.show();
             });
                
              
  };
  
  $scope.closekotModal = function() {
    $scope.modalkots.hide();
  };
   
   
   
   $scope.showKot = function(kot){
        $scope.closekotModal();
        console.log(kot);
      
   };
  $scope.removeItem = function(Index){
      
      $scope.kotmenus.splice(Index,1);
     // console.log(Index);
  };
  
  
})


 .controller('KotCtrl',function($scope,$state,$http, $stateParams,BASE_URL, $window ,$ionicModal ,$ionicLoading,$ionicPopup, $ionicActionSheet,Dataservice,Listservice){
        
       
      Listservice.getKots(function(data) { 
           console.log(data);
			$scope.kots=data;
             });
        
            
            
        });


