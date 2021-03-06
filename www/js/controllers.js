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
					  // alert(response);
                   $scope.shifts = response.data;
                   
					});
	 $http.get(BASE_URL+'/hotsys/getmeal').then(function(response){
					    // console.log(response);
                  $scope.meals =  response.data;
                  
					});
	
})

.controller('dashboardCtrl',function($scope,$state,$http, $stateParams,BASE_URL, $window ,$ionicModal ,$ionicLoading,$ionicPopup, $ionicActionSheet,Dataservice,Listservice, Authentication, NodePushServer){
     
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
	$scope.totalSum=0;
	$scope.amount=[];
	$scope.totalqty = 0;
	$scope.qty=[];
	$scope.totalItem=0;
	$scope.data.tableNo = localStorage.getItem('table');
	$scope.OccupancyFlag =  (localStorage.getItem('OccupancyFlag')==1)? true : false;
	$scope.data.locationselected = JSON.parse(localStorage.getItem('location'));
	if($scope.OccupancyFlag){
		Listservice.getKots(function(data) {   
			$scope.openKots = data;
			console.log(data);
			$scope.data.menulocation = $scope.openKots[0].LocationCode;
				$scope.data.captain = $scope.openKots[0].CaptianName;
				$scope.data.steward = $scope.openKots[0].StewardName;
				$scope.data.covers = parseInt($scope.openKots[0].Covers);
				$scope.onLocactionChange($scope.data.menulocation)
				$scope.openKots.forEach(function(item,value){
				//console.log(item.Quantity); 
				$scope.totalSum = parseFloat($scope.totalSum + Math.ceil(item.NettAmount));
				$scope.totalqty = parseInt($scope.totalqty + item.Quantity);
				$scope.totalItem = $scope.totalItem+1; 
				//console.log(value);
				$scope.openKots[value].KOTModifyFlag='N';
				$scope.openKots[value].NettAmount= Math.ceil(item.NettAmount);
				$scope.openKots[value].Quantity= Math.ceil(item.Quantity);
				
			});
			
			
             });	
		 	 
     	
	}
	

	$scope.showactions = function() {

   // Show the action sheet
   var hideSheet = $ionicActionSheet.show({
     buttons: [
      // { text: 'Open KOTS' },
     //  { text: 'Unsetteled Bills' },
       { text: 'Save N Print' },
    //   { text: 'Print Bill' },
    //   { text: 'Settle' },
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
        if(index==1){
		
			$ionicLoading.show();
				$scope.submitKOT()
				$ionicLoading.hide();
				return true;	
		
            
		} 
	  
     }
   });



 };
 $scope.modifier={};
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
  
  $scope.onHoldopen=function(menuIndex){
	  
	   $ionicActionSheet.show({
     buttons: [
      
       { text: 'Modify Kot' },
       { text: 'Cancel Menu' },
      
    
     ],
    
     titleText: 'Action on KOTS',
     cancelText: 'Cancel',
     cancel: function() {
          // add cancel code..
        },
     buttonClicked: function(index) {
         if(index==0){
             
            $scope.modifyKotpopup(menuIndex);
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
  	$scope.modifiedKOTS=[];
    $scope.modifyKotpopup= function(index){
       var myPopup = $ionicPopup.show({
    template: '<input type="text" ng-model="data.Quantity" placeholder="Quantity"><br/><input type="text" ng-model="data.RejQuantity" placeholder="Rejected Quantity"><br/><input type="text" ng-model="data.RejReason" Placeholder= "Rejection Reason">',
              
    title: 'Enter Modifier',
    subTitle: 'Please use normal things',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.Quantity) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
			  console.log(index);
			  key=index;
			    // var modifier = { key : $scope.data.modifier};
            // $scope.modifier[key]  = $scope.data.modifier;
			//$scope.modifier.push(modifier);
			$scope.openKots[key].Quantity = $scope.data.Quantity;
			$scope.openKots[key].RejectionQuantity = $scope.data.RejQuantity;
			$scope.openKots[key].RejectionReason = $scope.data.RejReason;
			$scope.openKots[key].NettAmount =  $scope.openKots[key].Rate * $scope.data.Quantity;
			$scope.openKots[key].KOTModifyFlag = 'Y';
			$scope.Rejamount =  $scope.openKots[key].Rate * $scope.data.RejQuantity;
			
            $scope.totalqty = parseInt($scope.totalqty - $scope.data.RejQuantity);
			$scope.totalSum =  parseFloat($scope.totalSum - $scope.Rejamount);
			$scope.modifiedKOTS.push($scope.openKots[key]);
			
			console.log($scope.modifiedKOTS);
             return true;
          }
        }
      }
    ]
  });
    
      
      return myPopup;
  };
  
  
   $scope.modifier={};
  $scope.addmodifier= function(index){
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
			  console.log(index);
			  key=index;
			    // var modifier = { key : $scope.data.modifier};
            // $scope.modifier[key]  = $scope.data.modifier;
			//$scope.modifier.push(modifier);
			$scope.kotmenus[key].modifier = $scope.data.modifier;
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
	   if(data.menulocation==""){
		   alert("please select menu location");
		   return true;
	   }
	    
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
	  $scope.totalItem = $scope.totalItem + 1;
    console.log($scope.kotmenus);
	 
 } 
 
 $scope.addSum = function(value,index){
	 //console.log();
	 $scope.qty[index]=value;
	 $scope.kotmenus[index].qty=value;
	 $scope.kotmenus[index].Kotno= $scope.data.kotno;
	 $scope.kotmenus[index].Kotmodified_flag= 0;
	 $scope.kotmenus[index].RejQuatity= 0;
	 $scope.kotmenus[index].modifier= '';
	 $scope.kotmenus[index].RejReason= '';
	 $scope.amount[index]=$scope.kotmenus[index].Rate*value;
	 $scope.kotmenus[index].amount = $scope.kotmenus[index].Rate*value;
	// console.log($scope.qty);
	// $scope.totalSum = $scope.totalSum+$scope.kotmenus[index].Rate*value
	 //$scope.totalSum = $scope.totalSum+value;
	 $scope.total =  parseFloat($scope.amount.reduce(function(prev, cur) {
										return prev + cur;
								}));
	 // $scope.totalSum =  parseInt($scope.totalSum) + parseInt($scope.total);
	  
	  $scope.tqty =  parseInt($scope.qty.reduce(function(prev, cur) {
										return prev + cur;
								}));
	// $scope.totalqty = parseInt($scope.totalqty) + parseInt($scope.tqty);
 };

  
  $scope.submitKOT = function(){
	 // console.log($scope.kotmenus);;
          $scope.kotdata={};
    /* if(($scope.kotmenus==null || $scope.kotmenus.length<=0) || ($scope.modifiedKOTS==null || $scope.modifiedKOTS.length<=0)){
		 alert("You have not added items");
		 return true;
	 }*/
     $scope.kotdata.openKots = $scope.modifiedKOTS;
	  
	 $scope.kotdata.locationcode = $scope.data.locationselected.LocationCode;
	 $scope.kotdata.KotItem = $scope.kotmenus;
	 $scope.kotdata.TableNo = $scope.data.tableNo;
	 $scope.kotdata.KOTNo = $scope.data.kotno;
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
	 $scope.kotdata.captain = $scope.data.captain
	 $scope.kotdata.stewardcode = $scope.data.steward
     //$scope.kotdata.stewardname = ($scope.steward)? $scope.employe.EmployeeName : 'NULL';
	 $scope.kotdata.menuLocationcode = $scope.data.menulocation;
	
	 $scope.kotdata.guest = $scope.data.guest;
	 $scope.kotdata.roomguest = $scope.data.guestname;
	 $scope.kotdata.Room_No = $scope.data.roomno;
	 $scope.kotdata.Room_folio = $scope.data.folio;
	 user = Authentication.getuserCredential();
	   //console.log(user[0]);
	  $scope.kotdata.username = user[0].UserName;
	
	 
	 
         var request = {
                    method: "POST",
                    url: BASE_URL+"/hotsys/saveKot",
                  //  headers: {'content-type': 'application/json; charset=UTF-8','Authorization': 'bearer'},
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
          // console.log(data);
			$scope.kots=data;
                        $scope.modalkots.show();
             });
                
              
  };
  
  $scope.closekotModal = function() {
    $scope.modalkots.hide();
  };
   
   
   
   $scope.showKot = function(kot){
        $scope.closekotModal();
        //console.log(kot);
      
   };
  $scope.removeItem = function(Index){
      
      $scope.kotmenus.splice(Index,1);
     // console.log(Index);
  };
  
  
})

 .controller('discountsCtrl',function($scope,$state,$http, $stateParams,BASE_URL, $window ,$ionicModal ,$ionicLoading,$ionicPopup, $ionicActionSheet,Dataservice,Listservice){
       $scope.data={}; 
	   $scope.data.consulate=false;
      $scope.bill_location= JSON.parse(localStorage.getItem('location'));
      $scope.tableNo= localStorage.getItem('table');
	  $scope.taxesarr = [];
      Listservice.getTaxes(function(response){
		  $scope.taxes = response;
		  console.log(response);
		  $scope.data.taxes=$scope.taxes;
		  
	 response.forEach(function(item,value){
		 if(item.ApplicableDefault=='Y'){
			 $scope.taxesarr[value]=item.FieldName;
			 console.log($scope.taxesarr);
			 $scope.data.appliedTaxes = $scope.taxesarr;
		 }
		 
	 });
	  });  
	  
		
	$scope.getDiscout = function(){
		
		var FHRI=$scope.data.FHRAI;
		if(FHRI){
			Listservice.getDiscounts(function(response){
				$scope.discounts = response;
				
				$scope.discounts.FHFD.forEach(function (item,key){
					$scope.data.foodDisc = parseFloat(item.ParameterValue);
					//console.log(item.ParameterValue);
					
					
				});
					$scope.discounts.FHBD.forEach(function (item,key){
					$scope.data.bevDisc = parseFloat(item.ParameterValue);
					//console.log(item.ParameterValue);
					
					
				});
					$scope.discounts.FHLD.forEach(function (item,key){
					$scope.data.liqDisc = parseFloat(item.ParameterValue);
					//console.log(item.ParameterValue);
					
					
				});
					$scope.discounts.FHTD.forEach(function (item,key){
					$scope.data.tobacDisc = parseFloat(item.ParameterValue);
					//console.log(item.ParameterValue);
					
					
				});
				console.log($scope.data)
			});
			
		}else{
			$scope.data={};
		}
		
	}
	  	
		$scope.saveDiscount = function(){
			
			Dataservice.setDiscountData($scope.data)
				
			
		}
            
			/*$('input[type="checkbox"]').on('click',function(){
					if($(this). prop("checked") == true){
					alert("Checkbox is checked." );
					}
					else if($(this). prop("checked") == false){
					alert("Checkbox is unchecked." );
					}
					});*/

			
			
			$scope.addTax = function(fieldname,percent,index){
				if(fieldname=='Notax'){
					$scope.taxesarr=[];
					//$scope.taxesarr[index] = percent;
			   console.log($scope.taxesarr)
				}				
				else{
					$scope.taxesarr[index] = fieldname;
					console.log($scope.taxesarr)
					$scope.data.appliedTaxes = $scope.taxesarr;
				}
			   
			}
			
            
        })
 .controller('billCtrl',function($scope,$state,$http, $stateParams,BASE_URL, $window ,$ionicModal ,$ionicLoading,$ionicPopup, $ionicActionSheet,Dataservice,Listservice){
       $scope.checkboxModel={}; 
	   $scope.data={};
      $scope.bill_location= JSON.parse(localStorage.getItem('location'));
      $scope.tableNo= localStorage.getItem('table');
      $scope.roomservice= true;
      $scope.Banquet= false;
	  $scope.kot='Rate';
	  $scope.totalSum=0;
	  $scope.totalItem =0;
	  $scope.totalqty =0;
	  $scope.discount = 0.0;
	  $scope.taxamount =0.0;
	  $scope.finalAmount  = 0.0;
	  //$scope.checkboxModel.value1=true;
	  $scope.sortBy = function(data){
		  // alert(data);
		 
		 if( $scope.checkboxModel.value1){
			 $scope.kot="KOTNo";
		 }else{
			 
			$scope.kot='Rate'; 
		 }
		   
	  }
	  
	 $scope.discounts = Dataservice.getDiscountData();
	 console.log($scope.discounts);
        Listservice.getKots(function(data) {   
			$scope.openKots = data;
			//console.log(data);
			//$scope.data.menulocation = $scope.openKots[0].LocationCode;
				$scope.data.customerName = $scope.openKots[0].ROOMGuest;
				$scope.data.folioNo = $scope.openKots[0].RoomFolio;
				$scope.data.roomno = $scope.openKots[0].RoomNo;
				
				//$scope.onLocactionChange($scope.data.menulocation)
				$scope.openKots.forEach(function(item,value){
				//console.log(item.Quantity); 
				$scope.totalSum = parseFloat($scope.totalSum + Math.ceil(item.NettAmount));
				$scope.totalqty = parseInt(parseInt($scope.totalqty) + parseInt(item.Quantity));
				$scope.totalItem = $scope.totalItem+1; 
				//console.log(value);
				$scope.openKots[value].KOTModifyFlag='N';
				$scope.openKots[value].NettAmount = Math.ceil(item.NettAmount);
				$scope.openKots[value].Quantity= Math.ceil(item.Quantity);
				
				if($scope.openKots[value].MenuTypeCode=='FD'){
				$scope.discount = $scope.calculateFDDiscount(item); 
				}
				if($scope.openKots[value].MenuTypeCode=='B'){
				$scope.discount = $scope.calculateBVDiscount(item); 
				}
				if($scope.openKots[value].MenuTypeCode=='LQ'){
				$scope.discount = $scope.calculateLQDiscount(item); 
				}
				if($scope.openKots[value].MenuTypeCode=='TB'){
				$scope.discount = $scope.calculateTBDiscount(item); 
				}
				if(!$scope.discounts.consulate){
				$scope.taxamount = $scope.taxamount + $scope.calculateTax(item);
				}else{
				$scope.taxamount = $scope.taxamount + 0;
				}
			});
			
			    if($scope.discounts){
						if($scope.discounts.flatDisc){
							$scope.discount = parseFloat($scope.discount) + parseFloat($scope.discounts.flatDisc);
						}
					   
				}
				
				$scope.NettAmount = parseFloat($scope.totalSum)- parseFloat($scope.discount);
				$scope.finalAmount = parseFloat($scope.finalAmount) + parseFloat(parseFloat($scope.NettAmount)+parseFloat($scope.taxamount));
             });
            
	  $scope.calculateFDDiscount = function(item){
				if($scope.discounts.foodDisc){
					
					$scope.discount = parseFloat($scope.discount) + parseFloat((item.NettAmount*($scope.discounts.foodDisc)/100));
					//$scope.calculateTax(item);
				}
				
				return parseFloat($scope.discount);
			}
		
	  $scope.calculateLQDiscount = function(item){
				if($scope.discounts.liqDisc){
					
					$scope.discount = parseFloat($scope.discount) + parseFloat((item.NettAmount*($scope.discounts.liqDisc)/100));
					//$scope.calculateTax(item);
				}
				
				return parseFloat($scope.discount);
			}
	  
	  $scope.calculateBVDiscount = function(item){
				if($scope.discounts.bevDisc){
					
					$scope.discount = parseFloat($scope.discount) + parseFloat((item.NettAmount*($scope.discounts.bevDisc)/100));
					//$scope.calculateTax(item);
				}
				
				return parseFloat($scope.discount);
			}
		
	   $scope.calculateTBDiscount = function(item){
				if($scope.discounts.tobacDisc){
					
					$scope.discount = parseFloat($scope.discount) + parseFloat((item.NettAmount*($scope.discounts.tobacDisc)/100));
					//$scope.calculateTax(item);
				}
				
				return parseFloat($scope.discount);
			}
			
			
			$scope.calculateTax = function(item){
		     //console.log($scope.discounts.appliedTaxes.indexOf('TAX1'));
			 console.log(item.MenuTypeCode);
			 if($scope.discounts.appliedTaxes.indexOf('TAX1')==-1){
				 $scope.tax1=0;
			 }else{
				 if($scope.discounts.foodDisc){
					 if(item.MenuTypeCode=='FD'){
						//$scope.tax1 = parseFloat(((item.NettAmount*($scope.discounts.foodDisc)/100)*item.Tax1)/100).toFixed(2); 
						$scope.tax1 = parseFloat(((parseFloat(item.NettAmount)-(item.NettAmount*($scope.discounts.foodDisc)/100))*item.Tax1)/100).toFixed(2); 
					 }
					 else{
						 $scope.tax1 = parseFloat(((item.NettAmount)*item.Tax1)/100).toFixed(2);  
					 }
				 }else if($scope.discounts.bevDisc){
					 if(item.MenuTypeCode=='B'){
						//$scope.tax1 = parseFloat(((item.NettAmount*($scope.discounts.bevDisc)/100)*item.Tax1)/100).toFixed(2); 
						$scope.tax1 = parseFloat(((parseFloat(item.NettAmount)-(item.NettAmount*($scope.discounts.bevDisc)/100))*item.Tax1)/100).toFixed(2); 
					 }
					 else{
						 $scope.tax1 = parseFloat(((item.NettAmount)*item.Tax1)/100).toFixed(2);  
					 }
				 }else if($scope.discounts.liqDisc){
					 if(item.MenuTypeCode=='LQ'){
						//$scope.tax1 = parseFloat(((item.NettAmount*($scope.discounts.liqDisc)/100)*item.Tax1)/100).toFixed(2); 
						$scope.tax1 = parseFloat(((parseFloat(item.NettAmount)-(item.NettAmount*($scope.discounts.liqDisc)/100))*item.Tax1)/100).toFixed(2); 
					 }
					 else{
						$scope.tax1 = parseFloat(((item.NettAmount)*item.Tax1)/100).toFixed(2);  
					 }
				 }else if($scope.discounts.tobacDisc){
					 if($scope.item.MenuTypeCode=='TB'){
						//$scope.tax1 = parseFloat(((item.NettAmount*($scope.discounts.tobacDisc)/100)*item.Tax1)/100).toFixed(2); 
						$scope.tax1 = parseFloat(((parseFloat(item.NettAmount)-(item.NettAmount*($scope.discounts.tobacDisc)/100))*item.Tax1)/100).toFixed(2); 
					 }
					 else{
						 $scope.tax1 = parseFloat(((item.NettAmount)*item.Tax1)/100).toFixed(2);  
					 }
				 }else{
					$scope.tax1 = parseFloat(((item.NettAmount)*item.Tax1)/100).toFixed(2);  
				 }
				 
			 }
			 
			 if($scope.discounts.appliedTaxes.indexOf('TAX2')==-1){
				 $scope.tax2=0;
			 }else{
				 if($scope.discounts.foodDisc){
					 if(item.MenuTypeCode=='FD'){
						 
						$scope.tax2 = parseFloat(((parseFloat(item.NettAmount)-(item.NettAmount*($scope.discounts.foodDisc)/100))*item.Tax2)/100).toFixed(2); 
					 }
					 else{
						 $scope.tax2 = parseFloat(((item.NettAmount)*item.Tax2)/100).toFixed(2);  
					 }
				 }else if($scope.discounts.bevDisc){
					 if(item.MenuTypeCode=='B'){
						//$scope.tax2 = parseFloat(((item.NettAmount*($scope.discounts.bevDisc)/100))*item.Tax2)/100).toFixed(2); 
						$scope.tax2 = parseFloat(((parseFloat(item.NettAmount)-(item.NettAmount*($scope.discounts.bevDisc)/100))*item.Tax2)/100).toFixed(2); 
					 }
					 else{
						 $scope.tax2 = parseFloat(((item.NettAmount)*item.Tax2)/100).toFixed(2);  
					 }
				 }else if($scope.discounts.liqDisc){
					 if(item.MenuTypeCode=='LQ'){
						//$scope.tax2 = parseFloat(((item.NettAmount*($scope.discounts.liqDisc)/100)*item.Tax2)/100).toFixed(2); 
						$scope.tax2 = parseFloat(((parseFloat(item.NettAmount)-(item.NettAmount*($scope.discounts.liqDisc)/100))*item.Tax2)/100).toFixed(2); 
					 }
					 else{
						$scope.tax2 = parseFloat(((item.NettAmount)*item.Tax2)/100).toFixed(2);  
					 }
				 }else if($scope.discounts.tobacDisc){
					 if(item.MenuTypeCode=='TB'){
						//$scope.tax2 = parseFloat(((item.NettAmount*($scope.discounts.tobacDisc)/100)*item.Tax2)/100).toFixed(2); 
						$scope.tax2 = parseFloat(((parseFloat(item.NettAmount)-(item.NettAmount*($scope.discounts.tobacDisc)/100))*item.Tax2)/100).toFixed(2); 
					 }
					 else{
						 $scope.tax2 = parseFloat(((item.NettAmount)*item.Tax2)/100).toFixed(2);  
					 }
				 }else{
					$scope.tax2 = parseFloat(((item.NettAmount)*item.Tax2)/100).toFixed(2);  
				 }

				 
				 
			 }
			 
			 
			// console.log($scope.tax1+"tax2"+$scope.tax2);
             return parseFloat(parseFloat($scope.tax1)+ parseFloat($scope.tax2));		
			} 
			
			
            
        })
 .controller('KotCtrl',function($scope,$state,$http, $stateParams,BASE_URL, $window ,$ionicModal ,$ionicLoading,$ionicPopup, $ionicActionSheet,Dataservice,Listservice){
        
       
      Listservice.getKots(function(data) { 
           console.log(data);
			$scope.kots=data;
             });
        
            
            
        });


