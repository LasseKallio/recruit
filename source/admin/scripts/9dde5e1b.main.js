function App(){"use strict";this.view=""===window.location.hash?"#index":window.location.hash,this.viewId="",this.backend="",this.loads=[],this.user={loggedIn:!1},this.translations={},this.lastOpenedElement="",this.loading={start:function(){App.loads.push(1),1===App.loads.length&&$("body").addClass("blur")},stop:function(){App.loads.pop(),0===App.loads.length&&$("body").removeClass("blur")}},this.dataTableLanguage={sProcessing:"Hetkinen...",sLengthMenu:"Näytä kerralla _MENU_ riviä",sZeroRecords:"Tietoja ei löytynyt",sInfo:"Näytetään rivit _START_ - _END_ (yhteensä _TOTAL_ )",sInfoEmpty:"Näytetään 0 - 0 (yhteensä 0)",sInfoFiltered:"(suodatettu _MAX_ tuloksen joukosta)",sInfoPostFix:"",sSearch:"Etsi:",sUrl:"",oPaginate:{sFirst:"Ensimmäinen",sPrevious:"Edellinen",sNext:"Seuraava",sLast:"Viimeinen"}}}var moment=window.moment;App.prototype.init=function(){"use strict";App.backend=document.location.host.indexOf("local")>-1?"//localhost/backend":document.location.host.indexOf("esmes")>-1?"//testipenkki.esmes.fi/mzr/back":"//api.mazhr.com",App.getUser(function(){App.getTranslations(function(){App.bindEvents(),App.showView(App.view)})})},App.prototype.getUser=function(a){"use strict";App.loading.start(),$.ajax(App.backend+"/admin/me",{type:"GET",xhrFields:{withCredentials:!0},dataType:"JSON"}).done(function(a){App.user.loggedIn=!0,App.user.data=a.data}).fail(function(){}).always(function(){App.loading.stop(),"function"==typeof a&&a()})},App.prototype.getTranslations=function(a){"use strict";App.loading.start(),$.ajax(App.backend+"/admin/language/fi",{type:"GET",xhrFields:{withCredentials:!0},dataType:"JSON"}).done(function(a){App.translations=a}).fail(function(){}).always(function(){App.loading.stop(),"function"==typeof a&&a()})},App.prototype.showView=function(a){"use strict";App.lastOpenedElement="";var b=a;if(App.viewId="",-1!==a.indexOf("/")&&a.indexOf("/")<a.length){var c=a.split("/");a=c[0],App.viewId=c[1]}var d=["#login"];switch(App.user.loggedIn===!1?-1===d.indexOf(a)&&(a="#login"):d.indexOf(a)>-1&&(a="#index"),App.view=a,window.location.hash=b,$(".nav-pills li").removeClass("active"),$(".nav").show(),App.view){case"#login":$(".nav").hide(),App.loginView();break;case"#index":$("#nav-home").addClass("active"),App.mainView();break;case"#users":$("#nav-users").addClass("active"),App.viewId.length?App.singleUserView():App.usersView();break;case"#profiles":$("#nav-profiles").addClass("active"),App.profileView();break;case"#tests":$("#nav-tests").addClass("active"),App.testView();break;case"#payments":$("#nav-payments").addClass("active"),App.paymentsView()}},App.prototype.hashChanged=function(){"use strict";window.location.hash!==App.view?App.showView(window.location.hash):""!==App.viewId&&App.showView(window.location.hash)},App.prototype.message=function(a,b){"use strict";"undefined"==typeof b&&(b="info"),window.alert(b+": "+a)},App.prototype.render=function(a,b){"use strict";var c=$(a).html(),d=window.Handlebars.compile(c),e=d(b);$(".content").html(e),$(".datetimepicker").datetimepicker({lang:"fi",format:"Y-m-d H:i"}),App.showLastOpened(App.lastOpenedElement)},App.prototype.loginView=function(){"use strict";var a={};App.render("#login-template",a)},App.prototype.mainView=function(){"use strict";var a={};App.render("#main-template",a)},App.prototype.usersView=function(){"use strict";var a=[],b=[];$.ajax(App.backend+"/admin/users",{type:"GET",xhrFields:{withCredentials:!0},dataType:"JSON"}).done(function(c){a=c.data,App.render("#users-template"),$.each(a,function(a,c){var d=[c.id,c.first,c.last,c.email,c.candidate_id];b.push(d)}),$("#user-table").DataTable({data:b,language:App.dataTableLanguage})}).fail(function(){}).always(function(){App.loading.stop()})},App.prototype.paymentsView=function(){"use strict";var a=[],b=[];$.ajax(App.backend+"/admin/payments",{type:"GET",xhrFields:{withCredentials:!0},dataType:"JSON"}).done(function(c){a=c.data,App.render("#payments-template"),$.each(a,function(a,c){var d=[c.id,moment(c.updated_at).format("D.M.YYYY H:mm"),c.product_id,c.product_name,c.order_number,c.sum,c.code,c.status];b.push(d)});var d=$("#payment-table").DataTable({data:b,language:App.dataTableLanguage});$("#payments-from").datepicker({defaultDate:"-1w",changeMonth:!0,numberOfMonths:2,dateFormat:"d.m.yy",onClose:function(a){$("#payments-to").datepicker("option","minDate",a)}}),$("#payments-to").datepicker({defaultDate:"+1w",changeMonth:!0,numberOfMonths:2,dateFormat:"d.m.yy",onClose:function(a){$("#payments-from").datepicker("option","maxDate",a)}}),$("#payments-to, #payments-from").bind("change",function(){$.fn.dataTableExt.afnFiltering.push(function(a,b){var c=$("#payments-to").val()?$("#payments-to").val():"1.1.3000",d=$("#payments-from").val()?$("#payments-from").val():"1.1.1970",e=b[1].split(" "),f=e[0];return moment(d,"D.M.YYYY")<=moment(f,"D.M.YYYY")&&moment(c,"D.M.YYYY")>=moment(f,"D.M.YYYY")}),d.draw()})}).fail(function(){}).always(function(){App.loading.stop()})},App.prototype.singleUserView=function(){"use strict";var a={},b=[],c={};$.ajax(App.backend+"/admin/user/"+App.viewId,{type:"GET",xhrFields:{withCredentials:!0},dataType:"JSON"}).done(function(d){function e(a,b,c){if("undefined"!=typeof a&&a.value){var d=", ";return c.length||(d=""),c+d+b}}a.user=d.data,a.user.image&&(a.user.image=App.backend+"/uploads/"+a.user.image),a.user.education_level&&(a.user.education_level=App.translations.education_levels[a.user.education_level]),c.card="",c.interest="",c.location="";var f=d.data.extras,g=App.translations.profile;if(c.card=e(f.card_duuni,g.form.cards.duuni,c.card),c.card=e(f.card_sanssi,g.form.cards.sanssi,c.card),c.location=e(f.location_abroad,g.form.locations.abroad,c.location),c.location=e(f.location_home,g.form.locations.home,c.location),c.interest=e(f.summary_evenings_weekends,g.form.interests.evenings_weekends,c.interest),c.interest=e(f.summary_fulltime,g.form.interests.fulltime,c.interest),c.interest=e(f.summary_parttime,g.form.interests.parttime,c.interest),c.interest=e(f.summary_shifts,g.form.interests.shifts,c.interest),"object"==typeof a.user.skills.languages){var h=a.user.skills.languages;$.each(h,function(a){h[a].key=g.languages[h[a].key].name,h[a].value=g.language_skill_ratings[h[a].value]})}if("object"==typeof a.user.skills.experience){var i=a.user.skills.experience;$.each(i,function(a){i[a].key=g.form.experience_fields[i[a].key],i[a].value+=i[a].value>1?" "+App.translations.date_years:" "+App.translations.date_year_single})}if("object"==typeof a.user.skills.primary_experience_type&&"object"==typeof a.user.skills.primary_experience_years){var j={},k=a.user.skills.primary_experience_type,l=a.user.skills.primary_experience_years;k.value&&l.value&&(j.key=g.primary_experience_types[k.value],j.value=l.value>1?l.value+" "+App.translations.date_years:l.value+" "+App.translations.date_year_single),a.user.skills.primary_experience=j}a.user.summary=c,a.tr=App.translations,App.render("#user-template",a),$.each(d.data.payment_history,function(a,c){var d=[c.id,moment(c.updated_at).format("D.M.YYYY H:mm"),c.product_id,c.product_name,c.order_number,c.sum,c.status];b.push(d)}),$("#user-payment-table").DataTable({data:b,language:App.dataTableLanguage})}).fail(function(){}).always(function(){App.loading.stop()})},App.prototype.profileView=function(){"use strict";var a=[];$.ajax(App.backend+"/admin/profile",{type:"GET",xhrFields:{withCredentials:!0},dataType:"JSON"}).done(function(b){a=b.data,App.render("#profiles-template",a)}).fail(function(){}).always(function(){App.loading.stop()})},App.prototype.testView=function(){"use strict";var a=[];$.ajax(App.backend+"/admin/tests",{type:"GET",xhrFields:{withCredentials:!0},dataType:"JSON"}).done(function(b){a=b.data,App.render("#tests-template",a)}).fail(function(){}).always(function(){App.loading.stop()})},App.prototype.login=function(){"use strict";var a=$('#login-form input[name="email"]').val(),b=$('#login-form  input[name="password"]').val();App.loading.start(),$.ajax(App.backend+"/admin/login",{type:"POST",xhrFields:{withCredentials:!0},dataType:"JSON",data:{email:a,password:b}}).done(function(a){App.user.loggedIn=!0,App.user.data=a.data,App.showView("#index")}).fail(function(a){App.message(a.responseText,"warning")}).always(function(){App.loading.stop()})},App.prototype.logout=function(){"use strict";App.loading.start(),$.ajax(App.backend+"/admin/logout",{type:"POST",xhrFields:{withCredentials:!0},dataType:"JSON"}).done(function(){App.user.loggedIn=!1,App.user.data={},App.showView("#start")}).fail(function(a){App.message(a.responseText)}).always(function(){App.loading.stop()})},App.prototype.removeProfessionCode=function(){"use strict";App.loading.start();var a=$(this),b=a.data("codeId");$.ajax(App.backend+"/admin/profile/"+b,{type:"DELETE",xhrFields:{withCredentials:!0}}).done(function(){a.parent().remove()}).fail(function(){}).always(function(){App.loading.stop()})},App.prototype.addProfessionCode=function(){"use strict";App.loading.start();var a=$(this).prev().val(),b=$(this).data("profileId"),c=[];$.ajax(App.backend+"/admin/profile/id/"+b+"/code/"+a,{type:"POST",xhrFields:{withCredentials:!0},dataType:"JSON"}).done(function(a){c=a.data,App.render("#profiles-template",c)}).fail(function(){}).always(function(){App.loading.stop()})},App.prototype.saveProfile=function(){"use strict";App.loading.start();var a=$(this).data("profile-id"),b=$("#profile-"+a+' input[name="competence"]').val(),c=$("#profile-"+a+' input[name="model"]').val(),d=[];$.ajax(App.backend+"/admin/profile",{type:"POST",xhrFields:{withCredentials:!0},dataType:"JSON",data:{id:a,competence:b,model:c}}).done(function(a){d=a.data,App.render("#profiles-template",d)}).fail(function(a){App.message(a.responseText)}).always(function(){App.loading.stop()})},App.prototype.updateTest=function(){"use strict";App.loading.start();var a=$(this).data("test-id"),b=$(this).parent().find('input[name="value"]').val(),c=$(this).parent().find('input[name="second_value"]').val(),d={price:b,second_price:c},e=[];$.ajax(App.backend+"/admin/test/id/"+a,{type:"POST",xhrFields:{withCredentials:!0},dataType:"JSON",data:JSON.stringify({data:d}),processData:!1}).done(function(a){e=a.data,App.render("#tests-template",e)}).fail(function(a){App.message(a.responseText)}).always(function(){App.loading.stop()})},App.prototype.saveDiscount=function(){"use strict";App.loading.start();var a=$(this).data("test-id"),b={};b.test_id=a,$(this).hasClass("remove-discount")?b.status=2:(b.status=1,b.code=$(this).closest(".row").find('input[name="code"]').val(),b.price=$(this).closest(".row").find('input[name="price"]').val(),b.start=$(this).closest(".row").find('input[name="start"]').val(),b.end=$(this).closest(".row").find('input[name="end"]').val(),b.usage_limit=$(this).closest(".row").find('input[name="usage_limit"]').val()),"undefined"!=typeof $(this).closest(".row").find('input[name="discount_id"]')&&(b.id=$(this).closest(".row").find('input[name="discount_id"]').val());var c=[];$.ajax(App.backend+"/admin/test/id/"+a+"/discount",{type:"POST",xhrFields:{withCredentials:!0},dataType:"JSON",data:JSON.stringify({data:b}),processData:!1}).done(function(a){c=a.data,App.render("#tests-template",c)}).fail(function(a){App.message(a.responseText)}).always(function(){App.loading.stop()})},App.prototype.foldToggle=function(){"use strict";var a=$(this);App.lastOpenedElement=a.attr("id"),a.hasClass("open")||($(".row-extra").hide(),$(".open").removeClass("open"),a.addClass("open"),a.find(".row-extra").fadeIn(),a.next(".row-extra").fadeIn())},App.prototype.showLastOpened=function(a){"use strict";if(""!==a){var b=$("#"+a);b.addClass("open"),b.find(".row-extra").show(),b.next(".row-extra").show(),$(window).scrollTop(b.offset().top)}},App.prototype.updateUserEmail=function(){"use strict";App.loading.start();var a={user_id:$(this).data("user-id"),email:$(this).prev("input").val()};$.ajax(App.backend+"/admin/user",{type:"POST",xhrFields:{withCredentials:!0},dataType:"JSON",data:JSON.stringify({data:a}),processData:!1}).done(function(){App.singleUserView()}).fail(function(a){App.message(a.responseText)}).always(function(){App.loading.stop()})},App.prototype.userTableClick=function(){"use strict";var a=$(this).children().first().html();window.location.href="#users/"+a},App.prototype.sendPassword=function(){"use strict";var a=$(this).data("email");App.loading.start(),$.ajax(App.backend+"/admin/password",{type:"POST",xhrFields:{withCredentials:!0},dataType:"JSON",data:{email:a}}).done(function(){App.message("Salasanaviesti lähetetty!")}).fail(function(a){App.message(a.responseText)}).always(function(){App.loading.stop()})},App.prototype.csvDownload=function(){"use strict";window.location=App.backend+"/admin/payments/csv"},App.prototype.removeUser=function(){"use strict";App.loading.start();var a={user_id:$(this).data("user-id")};$.ajax(App.backend+"/admin/user/remove",{type:"POST",xhrFields:{withCredentials:!0},dataType:"JSON",data:JSON.stringify({data:a}),processData:!1}).done(function(){App.message("Käyttäjä poistettu!")}).fail(function(a){App.message(a.responseText)}).always(function(){App.loading.stop()})},App.prototype.bindEvents=function(){"use strict";$(window).bind("hashchange",App.hashChanged),$(".container").on("click","#login-form button",App.login),$(".container").on("click",".logout",App.logout),$(".container").on("click",".remove-profession-code",App.removeProfessionCode),$(".container").on("click",".add-profession-code",App.addProfessionCode),$(".container").on("click",".update-test",App.updateTest),$(".container").on("click",".save-profile",App.saveProfile),$(".container").on("click",".save-discount, .remove-discount",App.saveDiscount),$(".container").on("click",".foldable",App.foldToggle),$(".container").on("click",".update-email",App.updateUserEmail),$(".container").on("click","#user-table tbody tr",App.userTableClick),$(".container").on("click",".send-password",App.sendPassword),$(".container").on("click",".csv-download",App.csvDownload),$(".container").on("click",".remove-user",App.removeUser)};var App=new App;$(document).ready(function(){"use strict";App.init()});