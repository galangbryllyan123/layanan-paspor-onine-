angular.module('starter.services', ['ngResource', 'ngCordova'])
  .filter("localdate", function () {
    return function (val) {
      return moment(val).locale("id").format("dddd, LL");
    }
  })
  .directive('callBackSrc', function () {
    return {
      scope: {
        sgSrc: '=',
        callBackSrc: "@"
      },
      link: function (scope, ele, attr) {
        scope.$watch("sgSrc", function (newVal) {
          var img = new Image();
          img.onerror = function () {
            ele[0].src = scope.callBackSrc;
          }
          img.onload = function () {
            ele[0].src = img.src;
          }
          img.src = newVal;
        });
      }
    }
  })

  /* Loading SRC Directive */
  .directive('asNumberInput', function () {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function (scope, elem, attrs, ngModel) {
        elem.on("input", function () {
          re = new RegExp("[^0-9]", "gi");
          var value = elem.val().replace(re, "");
          ngModel.$setViewValue(value);
          ngModel.$render();
        });
      }
    }
  })

  .directive('loadingSrc', function () {
    return {
      scope: {
        sgSrc: '@'
      },
      link: function (scope, elem, attr) {
        scope.$watch('sgSrc', function (newVal) {
          var img = new Image();
          img.onerror = function () {
            elem[0].src = img.src = attr.loadingSrc;
          }
          elem[0].src = img.src = newVal;
        });
      }
    }
  })
  .directive('stringToNumber', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function (value) {
          return '' + value;
        });
        ngModel.$formatters.push(function (value) {
          return parseFloat(value, 10);
        });
      }
    };
  })
  .directive('inputDatePickerIonic', function (_datePickerDefault) {
    return {
      require: 'ngModel',
      restrict: 'A',
      scope: {
        format: '@',
        inputDatePickerIonic: '='
      },
      link: function (scope, elem, attr, ngModel) {
        var format = scope.format || "YYYY-MM-DD";
        elem.attr("readonly", true);
        elem.on('click', function () {
          _datePickerDefault.show(scope.inputDatePickerIonic).then(function (date) {
            setView(date);
          });
        });
        scope.$watch("inputDatePickerIonic", function (newVal) {
          if (newVal) {
            setView(newVal);
          } else {
            scope.inputDatePickerIonic = undefined;
            /*      ngModel.$setViewValue(format); */
            ngModel.$render();
          }
        });

        function setView(dates) {
          date = moment(dates).format(format);
          scope.inputDatePickerIonic = moment(dates).format("YYYY-MM-DD");
          ngModel.$setViewValue(date);
          ngModel.$render();
        }
      }
    }
  })

  .directive('removeSpace', function () {
    return {
      require: "ngModel",
      link: function (scope, elem, attr, ngModel) {
        function eventListener(event) {}
        elem[0].addEventListener("keyup", eventListener);
        elem[0].addEventListener("keydown", eventListener);
        elem[0].addEventListener("keypress", eventListener);
        // scope.$watch(attr.ngModel, function(newVal, oldVal){
        //   var newVal = newVal || "";
        //   var removedText = newVal.replace(/[^\w\s]/gi, '');
        //   scope.$apply(function(){
        //   ngModel.$setViewValue(removedText);
        // });
        // });
      }
    }
  })

  .directive('dateCol', function (_toastCtrl) {
    return {
      restrict: 'C',
      link: function (scope, elem, attr) {
        if (attr.attributeDate == 'red') {
          elem[0].addEventListener('click', function () {
            // _toastCtrl.show("Harap Pilih Tanggal Dengan Kuota Tersedia", "long", "center");
          });
        } else if (attr.attributeDate == 'yellow') {
          elem[0].addEventListener('click', function () {
            // _toastCtrl.show("Harap Pilih Tanggal Dengan Kuota Tersedia", "long", "center");
          });
        }
      }
    }
  })
  .directive('customSearch', function () {
    return {
      scope: {
        customSearch: "@",
        value: "@",
        sensitive: "@"
      },
      link: function (scope, elem, attr) {
        scope.$watch("customSearch", function (newVal) {
          if (scope.sensitive != "true") {
            newVal = newVal.toLowerCase();
            scope.value = scope.value.toLowerCase();
          }
          var show = scope.value.Contains(newVal);
          if (show) {
            $(elem[0]).show();
          } else {
            $(elem[0]).hide();
          }
        });
      }
    }
  })
  .service('_modal', function ($ionicModal, $rootScope, $templateCache, $q) {
    $rootScope.MyModal = {}
    return {
      template: function ($scope, template) {
        var q = $q.defer();
        $ionicModal.fromTemplateUrl(template, {
          scope: $scope,
          animation: 'slide-in-up',
          backdropClickToClose: false
        }).then(function (modal) {
          q.resolve(modal);
        }, function (err) {
          q.reject(err);
        });
        return q.promise;
      },
      open: function (scope, myModal) {
        myModal = myModal || {}
        myModal.body = myModal.body || "";
        myModal.title = myModal.title || "My Modal";
        var selectedModal = "MyModal",
          template = $templateCache.get(myModal.body);
        if (!myModal.body.isHTML()) {
          if (template && myModal.body != selectedModal) {
            myModal.body = template;
          }
        }
        $rootScope.MyModal = myModal;
        this.template(scope, selectedModal).then(function (modal) {
          $rootScope.currentModal = modal;
          $rootScope.currentModal.show();
          window.myModal = myModal;
          setTimeout(function(){
            if (myModal.customCss){
              for (var i = 0; i < myModal.customCss.length; i++) {
                var comp = myModal.customCss[i]
                jQuery(comp.selector).css(comp.css);
                console.log(comp, jQuery(comp.selector), comp.css)
              }
            }
          }, 150);
        }, function (err) {});
      },
      hide: function () {
        $rootScope.currentModal.hide();
      }
    }
  })
  .service('_Esri', function ($q, _store) {
    return {
      getlocation: function () {
        var q = $q.defer();
        map_non_interactive_getLocation().then(function (result) {
          q.resolve(result);
        });
        return q.promise;
      },
      getOffice: function () {
        var q = $q.defer();
        map_getOfficeByLocation().then(function (result) {
          q.resolve(result);
        });
        return q.promise;
      },
      getAddress: function () {
        var q = $q.defer();
        map_non_interactive_getLocation().then(function (result) {
          map_getAddress(result.coords.longitude, result.coords.latitude).then(function (data) {
            q.resolve(data);
          });
        });
        return q.promise;
      },
      setRadius: function () {
        var q = $q.defer();
        this.getlocation().then(function (data) {
          _createRadiusFence(data.coords.longitude, data.coords.latitude);
          q.resolve(true);
        });
        return q.promise;
      },
      checkRadius: function (long, lat) {
        return _checkLocationByRadiusFence(long, lat);
      }
    }
  })

  .service('_grantPermission', function ($q) {
    // https://github.com/NeoLSN/cordova-plugin-android-permissions
    return {
      getPermissions: function () {
        if (window.cordova) {
          return cordova.plugins.permissions;
        } else {
          return false;
        }
      },
      allowStorage: function () {
        var self = this,
          permissions = self.getPermissions();
        return self.grant(permissions.WRITE_EXTERNAL_STORAGE, permissions);
      },
      grant: function (permission) {
        var q = $q.defer(),
          self = this,
          permissions = self.getPermissions();
        if (window.cordova && permissions) {
          permissions.requestPermission(permission, function (success) {
            q.resolve(success);
          }, function (err) {
            q.reject(err);
          });
        } else {
          q.reject("Not device");
        }
        return q.promise;
      }
    }
  })
  .service('_pdfCreate', function ($q, _Sweet, $ionicHistory) {
    return {
      toPngObj: function (arr, callback, callbackErr, index) {
        var self = this,
          total = arr.length;
        index = index || 0;
        self.toPng(arr[index]).then(function (img) {
          arr[index] = img;
          index++;
          if (index < total) {
            self.toPngObj(arr, callback, callbackErr, index);
          } else {
            _Sweet("Berhasil", "Jadwal Anda Berhasil Tersimpan Pada Memori Internal Dalam Folder /Layanan WNI/Dokumen.pdf", "success").then(function () {
              $ionicHistory.goBack();
              callback(arr);
            });
          }
        }, function (err) {
          console.error("Error Generating image for id: " + arr[index]);
          callbackErr(err);
        });
      },
      toPng: function (elementId) {
        var imgData, q = $q.defer(),
          canvas = document.createElement("canvas"),
          element = document.getElementById(elementId),
          ctxPDF = canvas.getContext("2d");
        ctxPDF.fillStyle = "#FFFFFF";
        ctxPDF.fillRect(0, 0, 1280, 2277);
        canvas.setAttribute("width", "1280");
        canvas.setAttribute("height", "2277");
        domtoimage.toPng(element).then(function (imgSrc) {
          var image = new Image();
          image.src = imgSrc;
          setTimeout(function () {
            ctxPDF.drawImage(image, 0, 0, 1280, 2277);
            imgData = canvas.toDataURL("image/jpeg", 1.0);
          }, 300);
          setTimeout(function () {
            q.resolve(canvas);
          }, 700);
        }, function (err) {
          q.reject(err);
        });
        return q.promise;
      },
      create: function (pages, dataSource = 'blob') {
        var q = $q.defer();
        var pdf = new jsPDF("p", "px", [720, 1275], true);
        for (var i = 0; i < pages.length; i++) {
          var temp = pages[i]
          pdf.addImage(temp, 'JPEG', 0, 0);
          if (pages[i + 1] != undefined) {
            pdf.addPage();
          }
        }
        if (dataSource == 'file') {
          pdf.output('save', 'perjanjian keagenan.pdf');
          q.resolve({
            as: 'file',
            data: 'Your file has been saved'
          });
        } else if (dataSource == 'blob') {
          var contentFile = pdf.output('blob');
          var reader = new FileReader();
          reader.readAsDataURL(contentFile);
          reader.onloadend = function () {
            q.resolve({
              as: 'blob',
              data: reader.result
            });
          }
        }
        return q.promise;
      }
    }
  })
  .service('_File', function ($q, $cordovaFileTransfer, $cordovaFile, _store) {
    return {
      folderName: "Layanan WNI",
      pathFolder: function () {
        return cordova.file.externalRootDirectory + this.folderName + "/";
      },
      download: function (url, target, filename, progress) {
        return $cordovaFileTransfer.download(url, target, {}, true);
      },
      savePdf: function (source, id) {
        return this.download(source, this.pathFolder() + "Dokumen-" + id + ".pdf");
      },
      checkFile: function (id) {
        return $cordovaFile.checkFile(this.pathFolder(), "Dokumen-" + id + ".pdf");
      },
      createFolder: function () {
        return $cordovaFile.createDir(cordova.file.externalRootDirectory, this.folderName, false);
      },
      cordova: $cordovaFile
    }
  })
  .service('_toastCtrl', function () {
    // https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin
    return {
      showShortTop: function (msg, callback) {
        this.show(msg, 'short', 'top', callback);
      },
      showShortBottom: function (msg, callback) {
        this.show(msg, 'short', 'bottom', callback);
      },
      show: function (msg, duration, position, callback) {
        if (typeof callback != 'function') callback = function () {};
        try {
          duration = (typeof duration != "string") ? 'long' : duration;
          position = (typeof position != "string") ? 'bottom' : position;
          plugins.toast.show(msg, duration, position, function (a) {
            console.log('toast success: %c' + a, Console.success);
            callback();
          }, function (b) {
            callback();
            alert('toast error: ' + b);
          });
        } catch (err) {
          callback();
          console.log('Try to show toast message: %c' + msg, Console.error);
        }
      }
    }
  })
  .service('_FileProcess', function ($q, $cordovaFileTransfer, $timeout, $cordovaFile) {
    return {
      Download: function (url, target, filename) {
        url = decodeURI(url);
        if (window.cordova) {
          var options = {},
            targetPath = target + filename || cordova.file.externalDataDirectoryLearning + url.getNameFromUrl();
          return $cordovaFileTransfer.download(url, targetPath, options, true);
        } else {
          return null;
        }
      },
      listDir: function (path) {
        var q = $q.defer();
        try {
          window.resolveLocalFileSystemURL(path, function (fileSystem) {
            var reader = fileSystem.createReader();
            reader.readEntries(function (entries) {
              q.resolve(entries);
            }, function (err) {
              q.reject(err);
            });
          }, function (err) {
            q.reject(err);
          });
        } catch (err) {
          q.reject(err);
        }
        return q.promise;
      },
      cordovaFile: $cordovaFile
    }
  })
  .service('_html2canvas', function ($q) {
    return {
      getCanvas: function (selector) {
        var q = $q.defer();
        html2canvas(selector, {
          scale: 2,
          dpi: 150,
          onrendered: function (canvas) {
            q.resolve(canvas.toDataURL());
            // q.resolve(canvas);
          }
        });
        return q.promise;
      }
    }
  })
  .service('_loading', function ($ionicLoading, $rootScope) {
    return {
      show: function (message, obj) {
        message = (message == undefined) ? "" : message;
        $rootScope.loadingMessage = message;
        var deft = {
          content: 'Loading',
          animation: 'fade-in',
          template: '<ion-spinner></ion-spinner><br/><div>{{loadingMessage}}</div>',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        }
        if (typeof (obj) != "object") {
          obj = {}
        }
        Object.assign(deft, obj);
        $ionicLoading.show(deft);
      },
      hide: function () {
        $ionicLoading.hide();
      }
    }
  })
  .service('_booking', function (_http, _store) {
    var booking = {
      type: {
        baru: "5CD9317A-317A-355A-1EBE-E0531400A8C0",
        ganti: "5CD9317A-317A-355E-1EBE-E0531400A8C0"
      },
      category: {
        "ANAK": "5DD36D43-6D43-4132-6406-E0531400A8C0",
        "AYAH/IBU": "5CD9317A-317A-3554-1EBE-E0531400A8C0",
        "PRIBADI": "5DD36CC6-6CC6-E5E6-63E9-E0531400A8C0",
        "SUAMI/ISTRI": "5DD36DDF-6DDF-53A1-6426-E0531400A8C0"
      },
      parameter: {
        PEMOHON: [{}],
      },
      getQueueCreate: function () {
        return _http.post(config.api + "/layanan/wni/queue/list/create", {
          TOKEN: _store.get("token")
        });
      },
      getQueueUpdate: function (type, quotaId, queueId) {
        return _http.post(config.api + "/layanan/wni/queue/list/update", {
          TOKEN: _store.get("token")
        });
      },
      getQueueCount: function () {
        return _http.post(config.api + "/layanan/wni/queue/count", {
          TOKEN: _store.get("token")
        });
      },
      deleteQueue: function (parameter) {

        var self = booking,
          que = {}
        if (parameter.SERVICE_NAME == "PASPOR BARU") {
          que.QUEUE_CREATE_ID = parameter.QUEUE_CREATE_ID;
          que.QUEUE_UPDATE_ID = null;
        } else if (parameter.SERVICE_NAME == "PASPOR PENGGANTIAN") {
          que.QUEUE_UPDATE_ID = parameter.QUEUE_UPDATE_ID;
          que.QUEUE_CREATE_ID = null;
        }
        param = {
          SERVICE_TYPE_ID: parameter.SERVICE_TYPE_ID,
          UNIT_QUOTA_ID: parameter.UNIT_QUOTA_ID,
          QUEUE_CREATE_ID: que.QUEUE_CREATE_ID,
          QUEUE_UPDATE_ID: que.QUEUE_UPDATE_ID,
          TOKEN: _store.get("token")
        }
        return _http.post(config.api + "/layanan/wni/queue/cancel", param);
      },
      serviceBooking: function (parameter) {
        parameter.IP_ADDRESS = _store.get("IP_ADDRESS");
        parameter.LATITUDE = _store.get("LATITUDE");
        parameter.LONGITUDE = _store.get("LONGITUDE");
        parameter.TOKEN = _store.get("token");
        return _http.post(config.api + "/layanan/wni/queue/booking", parameter, {
          "Content-Type": "application/json",
          "Accept": "application/json"
        });
      },
      bookBaru: function (quotaId, param) {
        var parameter = booking.parameter,
          param = param || []
        parameter.UNIT_QUOTA_ID = quotaId;
        parameter.PEMOHON = param;
        return booking.serviceBooking(parameter);
      },
      bookGanti: function (quotaId, param) {
        var parameter = booking.parameter;
        param = param || []
        parameter.UNIT_QUOTA_ID = quotaId;
        parameter.PEMOHON = param;
        return booking.serviceBooking(parameter);
      }
    }
    return {
      type: booking.type,
      category: booking.category,
      bookBaru: booking.bookBaru,
      bookGanti: booking.bookGanti,
      deleteQueue: booking.deleteQueue,
      getQueueCreate: booking.getQueueCreate,
      getQueueUpdate: booking.getQueueUpdate,
      getQueueCount: booking.getQueueCount
    }
  })

  .service('_passport', function ($q, _http) {
    return {
      verify: function (pptNo, birthDate, endDate) {
        var url = config.api + "/layanan/wni/passport/verify",
          format = "YYYYMMDD",
          q = $q.defer();
        try {
          birthDate = moment(birthDate).format(format);
          endDate = moment(endDate).format(format);
          _http.post(url, {
            PASSPORT_NUMBER: pptNo,
            BIRTH_DATE: birthDate,
            END_DATE: endDate
          }).then(function (resp) {
            q.resolve(resp);
          }, function (error) {
            q.reject(error);
          });
        } catch (err) {
          q.reject(err);
        }
        return q.promise;
      }
    }
  })

  .service('_wilayah', function ($q, $resource, _http, _store) {
    return {
      Provinsi: function () {
        return _http.get("assets/json/adminarea.json");
      },
      Kota: function () {
        return _http.get("assets/json/city.json");
      },
      Kecamatan: function () {
        return _http.get("assets/json/district.json");
      }
    }
  })

  .service('_user', function ($q, _http, _store, _Sweet) {
    return {
      /* Service NIK From Dukcapil */
      admInduk: function (params) {
        return _http.post(config.api + "/layanan/wni/ide/adminduk/search", {
          NIK: _store.get("NIK"),
          TGL_LAHIR: _store.get("TANGGAL_LAHIR"),
          TOKEN: "753091B675ED25EAE0530BDEA00AE0E3" || _store.get("token")
        });
      },
      /* Service Broadcast */
      broadcast: function (params) {
        return _http.post(config.api + "/layanan/broadcast/customer/select", {
          NATION_ID: "null",
          ADMIN_AREA_ID: "null",
          CITY_ID: "null",
          DISTRICTS_ID: "null",
          BUSINESS_UNIT_ID: "null",
          BROADCAST_TYPE: params,
        });
      },
      /* Service Notifikasi */
      notification: function (param, toSend, callback) {
        var html = '<div class="swal-bungkus text-left list">';
        for (var key in param) {
          if (toSend.Contains(key)) {
            html += sprintf(['<div class="no-padding item">',
              '<div class="row">',
              '<div class="col col-50">%s</div>',
              '<div class="col col-50">%s</div>',
              '</div>',
              '</div>'
            ].join(""), key.replace(/_/g, " ").ucwords(), param[key]);
          }
        }
        html += "</div>";
        _Sweet({
          title: "Apakah Data Anda Sudah Benar?",
          html: html,
          type: "question",
          showCancelButton: true
        }).then(function (result) {
          if (result.value) {
            callback();
          }
        });
      },
      /* Service Parse Image */
      parseImage: function (img) {
        if (typeof img == "string") {
          return img.replace(/\n/g, "");
        } else {
          return null;
        }
      },
      /* Get Service IP */
      getIP: function () {
        return _http.get(config.apiGetIP + "/ImigrasiService/service/api/get");
      },
      /* Service Upload Image */
      uploadImage: function (base64Image) {
        return _http.post(config.api + "/layanan/wni/user/upload", {
          IMAGE: base64Image,
          TOKEN: _store.get("token")
        });
      },
      /* Service Login Service */
      login: function (param) {
        return _http.post(config.api + "/layanan/wni/user/login", param);
      },
      /* Service Login Google Service */
      loginMedsos: function (param) {
        return _http.post(config.api + "/layanan/wni/user/signin", {
          EMAIL: param
        });
      },
      /* Service Resend Email */
      resendEmail: function (param) {
        return _http.post(config.api + "/layanan/wni/resend/registration", {
          TOKEN: param
        });
      },
      /* Service Forget Password */
      forgetPassword: function (param) {
        return _http.post(config.api + "/layanan/wni/password/forget", param);
      },
      /* Service Update Password */
      updatePassword: function (param) {
        return _http.post(config.api + "/layanan/wni/user/password/update", {
          PASSWORD: param,
          TOKEN: _store.get("token")
        });
      },
      /* Service Get Data User */
      getData: function (param) {
        return _http.post(config.api + "/layanan/wni/user/select", {
          TOKEN: _store.get("token") || param
        });
      },
      form: function (url, param, toSend) {
        var q = $q.defer();
        param.TOKEN = _store.get("token");
        _http.post(url, param).then(function (succ) {
          q.resolve(succ);
        }, function (err) {
          q.reject(err);
        });
        // });
        return q.promise;
      },
      /* Service Update Data */
      updateData: function (param) {
        return this.form(config.api + "/layanan/wni/user/update", param, ["CUSTOMER_USERNAME", "CUSTOMER_FULLNAME", "CUSTOMER_ADDRESS", "CUSTOMER_ID", "MOBILE_PHONE", "BORN_DATE"]);
      },
      /* Service Registration */
      registration: function (param) {
        return this.form(config.api + "/layanan/wni/user/registration", param, ["CUSTOMER_USERNAME", "CUSTOMER_PASSWORD", "CUSTOMER_FULLNAME", "CUSTOMER_ID", "EMAIL", "MOBILE_PHONE", "DEVICE_ID", "BORN_DATE", "CUSTOMER_ADDRESS", "GENDER", "ADMIN_AREA_ID", "CITY_ID", "DISTRICT_ID", "IP_ADDRESS", "LATITUDE", "LONGITUDE"]);
      },
      /* Registration With Medsos */
      registrationWithMedsos: function (param) {
        return this.form(config.api + "/layanan/wni/user/signup", param, ["CUSTOMER_USERNAME", "CUSTOMER_PASSWORD", "CUSTOMER_FULLNAME", "CUSTOMER_ID", "EMAIL", "MOBILE_PHONE", "DEVICE_ID", "BORN_DATE", "CUSTOMER_ADDRESS", "GENDER", "ADMIN_AREA_ID", "CITY_ID", "DISTRICT_ID", "API_INTEGRATION", "IP_ADDRESS", "LATITUDE", "LONGITUDE"]);
      }
    }
  })

  .service('_notification', function ($cordovaLocalNotification) {
    return {
      set: function (title, message, time) {
        $cordovaLocalNotification.add({
          id: "123",
          date: time || new Date(),
          message: message,
          title: title,
          autoCancel: true,
          sound: "file:///storage/emulated/0/Android/data/com.imigrasi.layananwni/file/notif.mp3"
        }).then(function () {
          console.info("Notification Setted");
        });
      }
    }
  })

  .service('NonInteractiveMapService', function ($q) {
    return {
      getLocation: function () {
        var q = $q.defer();
        map_non_interactive_getLocation().then(function (result) {
          q.resolve(result);
        });
        return q.promise;
      },
      getOffice: function () {
        var q = $q.defer();
        map_getOfficeByLocation().then(function (result) {
          q.resolve(result);
        });
        return q.promise;
      },
      getAddress: function () {
        var q = $q.defer();
        map_non_interactive_getLocation().then(function (result) {
          map_getAddress(result.coords.longitude, result.coords.latitude).then(function (data) {
            q.resolve(data);
          });
        });
        return q.promise;
      },
      setRadius: function () {
        var q = $q.defer();
        this.getlocation().then(function (data) {
          _createRadiusFence(data.coords.longitude, data.coords.latitude);
          q.resolve(true);
        });
        return q.promise;
      },
      checkRadius: function (long, lat) {
        return _checkLocationByRadiusFence(long, lat);
      }
    }
  })

  .service('_map', function ($http, esriLoader, service_office, $rootScope) {

    var $scope = {
      map: {
        obj: null,
        center: {
          lng: 117.924227,
          lat: -1.492326
        },
        zoom: 5,
        basemap: 'osm',
        loaded: false,
        gps: {
          longitude: 106.824347,
          latitude: -6.180448,
          zoom: 15,
          x: 0,
          y: 0,
          pt: null,
          option: {
            enableHighAccuracy: true,
            maximumAge: 0
          }
        },
        url: {
          Country: "https://geoportal.imigrasi.go.id/arcgis/rest/services/imigrasi/administrative/FeatureSer" + "ver/1",
          Region: "https://geoportal.imigrasi.go.id/arcgis/rest/services/imigrasi/administrative/FeatureSer" + "ver/0",
          OpenStreetMap: "http://${subDomain}.tile.openstreetmap.org/${level}/${col}/${row}.png"
        },
        Offices: [],
        filtered: {
          country: null,
          region: null,
          office: []
        }
      }
    }
    $scope.getOffices = function () {
      return $scope.map.Offices;
    }

    $scope.mapLoaded = function (map) {
      var loader = ["esri/symbols/PictureMarkerSymbol", "esri/graphic", "esri/Color", "esri/layers/GraphicsLayer", "esri/layers/FeatureLayer", "esri/tasks/FeatureSet", "esri/geometry/Point", "esri/InfoTemplate", "esri/geometry/webMercatorUtils", "esri/tasks/query", "esri/tasks/QueryTask", "esri/layers/WebTiledLayer", "esri/geometry/geometryEngine", "esri/geometry/Polyline", "esri/SpatialReference", "esri/symbols/SimpleLineSymbol", "esri/graphicsUtils"]
      $scope.map.loaded = true;
      esriLoader.require(loader, functionEsriLoader);

      function functionEsriLoader(PictureMarkerSymbol, Graphic, Color, GraphicsLayer, FeatureLayer, FeatureSet, Point, InfoTemplate, webMercatorUtils, Query, QueryTask, WebTiledLayer, geometryEngine, Polyline, SpatialReference, SimpleLineSymbol, graphicsUtils) {
        var openStreetMap = new WebTiledLayer($scope.map.url.OpenStreetMap, {
          "copyright": '',
          "id": "Open Street Map",
          "subDomains": ["a", "b", "c"]
        });
        map.addLayer(openStreetMap);
        removeBaseMapLayer();
        var symbolOffice = new PictureMarkerSymbol();
        symbolOffice.setHeight(37);
        symbolOffice.setWidth(30);
        symbolOffice.setUrl("assets/img/gedung.png");
        var infoContent = "<table style='border:none;padding:5px;' cellspacing='0px'><tr><td >Nama</td><td >:</td><td >${UNIT_NAME}</td></tr><tr><td colspan='3'><hr/> </td></tr><tr><td>Alamat</td><td>:</td ><td>${OFFICE_ADDRESS}</td></tr><tr><td colspan='3'><hr/> </td></tr><tr><td>Telepon</td><td>:</td><td>${OFFICE_PHONE}</td></tr><tr><td colspan='3'><hr/> </td></tr><tr><td>Jarak</td><td>:</td><td>${Jarak}Km</td></tr><tr><td colspan='3'><hr/> </td></tr><tr><td colspan='3'><input type='button' value='Daftar' onclick='queueAntrian(${ID})'/></td></tr></table>";
        var officeTemplate = new InfoTemplate("Attributes", infoContent);

        $scope.getLocation = function () {
          /*
              Fungsi untuk mendapatkan koordinat dari GPS device
              */
          if (navigator.geolocation) {
            navigator
              .geolocation
              .getCurrentPosition(showPosition, errLocation, $scope.map.gps.option);
          } else {
            console.warn("Geolocation is not supported by this browser.");
            showPosition(null);
          }

        }

        function errLocation(positionError) {
          console.log(positionError);
        }

        function showPosition(position = null) {
          /* 
              Fungsi untuk menunjukan posisi GPS, jika null akan diisi posisi monas
              param : position, adalah object posisi yang direturn dari navigator.getlocation
              return : void
              */
          if (position != null) {
            $scope.map.gps.longitude = position.coords.longitude;
            $scope.map.gps.latitude = position.coords.latitude;
          }

          var xyFromLongLat = webMercatorUtils.lngLatToXY($scope.map.gps.longitude, $scope.map.gps.latitude);
          $scope.map.gps.x = xyFromLongLat[0];
          $scope.map.gps.y = xyFromLongLat[1];

          var pt = new Point($scope.map.gps.x, $scope.map.gps.y, map.spatialReference);
          $scope.map.gps.pt = pt;
          geoFence($scope.map.gps.pt);
          drawGPSPSymbol($scope.map.gps.pt);


          map.centerAndZoom([
            $scope.map.gps.longitude, $scope.map.gps.latitude
          ], $scope.map.gps.zoom);

        }

        function drawGPSPSymbol(pt) {
          /* 
              Fungsi untuk menggambar simbol di posisi user berada berdasarkan gps
              param : esri.symbol.point
              return : void
              */
          var glGPSSymbol = map.getLayer("glGPSSymbol");
          if (!glGPSSymbol) {
            glGPSSymbol = new GraphicsLayer({
              id: "glGPSSymbol"
            });
            map.addLayer(glGPSSymbol);
          }
          glGPSSymbol.clear();

          var symbolPoint = new PictureMarkerSymbol();
          symbolPoint.setHeight(41);
          symbolPoint.setWidth(30);
          symbolPoint.setUrl("assets/img/locationicon.png");
          var attribute = {
            "Lokasi Anda ": (" " + pt.x + "," + pt.y)
          };
          var graphic = new Graphic(pt, symbolPoint, attribute);
          glGPSSymbol.add(graphic);
        }

        function getCountry(myLocation) {
          /* 
              Fungsi untuk mencari negara berdasarkan lokasi user berada, xhr ke map service esri country
              param : lokasi user berdasarkan gps
              return : deffered (oncomplete, onerror)
              */
          var queryTask = new QueryTask($scope.map.url.Country);
          var query = new Query();
          query.outFields = ["*"];
          //query.multipatchOption = "xyFootprint";
          query.geometry = myLocation;
          query.returnGeometry = true;
          queryTask.on("complete", getCountry_queryTaskExecuteCompleteHandler);
          queryTask.on("error", getCountry_queryTaskErrorHandler);
          queryTask.execute(query);
        }

        function getCountry_queryTaskExecuteCompleteHandler(queryResults) {
          /* 
              Fungsi callback ketika xhr selesai mencari negara berdasarkan lokasi user berada, xhr ke map service esri country
              param : object hasil query
              return : void
              */
          if (queryResults.featureSet.features.length > 0) {
            var countryID = queryResults.featureSet.features["0"].attributes;
            if (countryID.iso2 === "ID") {
              //Indonesia, lanjutkan dengan regionalnya/provinsi
              getRegion($scope.map.gps.pt);
            } else {
              //Get all office overseas , not Indonesia
              calcualteIntersectedOffice(queryResults);

            }
          }
        }

        function getCountry_queryTaskErrorHandler(queryError) {
          /* 
             Fungsi callback ketika xhr error, mencari negara berdasarkan lokasi user berada, xhr ke map service esri country
             param : error query
             return : deffered (oncomplete, onerror)
             */
          console.log("error", queryError.error.details);
        }

        function getRegion(myLocation) {
          /* 
             Fungsi untuk mencari region/provinsi berdasarkan lokasi user berada, xhr ke map service esri province/region
             param : lokasi user berdasarkan gps
             return : deffered (oncomplete, onerror)
             */
          var queryTask = new QueryTask($scope.map.url.Region);
          var query = new Query();
          query.outFields = ["*"];
          //query.multipatchOption = "xyFootprint";
          query.geometry = myLocation;
          query.returnGeometry = true;
          queryTask.on("complete", getRegion_queryTaskExecuteCompleteHandler);
          queryTask.on("error", getRegion_queryTaskErrorHandler);
          queryTask.execute(query);
        }

        function getRegion_queryTaskExecuteCompleteHandler(queryResults) {
          /* 
              Fungsi callback ketika xhr selesai mencari provinsi/region berdasarkan lokasi user berada, xhr ke map service esri region/province
              param : object hasil query
              return : void
              */
          calcualteIntersectedOffice(queryResults);
        }

        function calcualteIntersectedOffice(queryResults) {
          var administrativeBoundaries = queryResults.featureSet.features["0"];
          // GET COUNTRY ID
          $rootScope.info = administrativeBoundaries.attributes.iso3;
          var filteredOffice = [];
          var arrGeom = [];
          for (var b = 0; b < $scope.map.Offices.length; b++) {
            arrGeom.push($scope.map.Offices[b].geometry);
          }
          var dirtyIntersectedOffice = arrGeom; // geometryEngine.intersect(arrGeom, administrativeBoundaries.geometry);
          var intersectedOffice = [];
          for (var c = 0; c < dirtyIntersectedOffice.length; c++) {
            if (dirtyIntersectedOffice[c]) {
              intersectedOffice.push(dirtyIntersectedOffice[c]);
            }
          }
          $scope.map.filtered.office = intersectedOffice;
          var lineSymbol = new SimpleLineSymbol();
          lineSymbol.setWidth(2);
          lineSymbol.setColor(new Color([255, 0, 0, 1]));
          var intersectedOfficeGraphic = [];
          for (var i = 0; i < $scope.map.Offices.length; i++) {
            try {
              var lineGeom = new Polyline(new SpatialReference({
                wkid: 102100
              }));
              lineGeom.addPath([
                [$scope.map.gps.x, $scope.map.gps.y],
                [intersectedOffice[i].x, intersectedOffice[i].y]
              ]);
              var distance = geometryEngine.geodesicLength(lineGeom, "kilometers");
              $scope.map.Offices[i].attributes["Jarak"] = distance.toFixed(2);
              intersectedOfficeGraphic.push($scope.map.Offices[i]);
            } catch (err) {
              console.warn(err);
              console.warn($scope.map.Offices[i].attributes);
            }
          }
          drawKanimObject(intersectedOfficeGraphic);
          setMapExtentToGPSAndOffice();
        }

        function getRegion_queryTaskErrorHandler(queryError) {
          console.log("error", queryError.error.details);
        }

        function geoFence(myLocation) {
          getCountry(myLocation);
        }

        function drawKanimObject(listofOffice) {
          var glOffice = map.getLayer("glOffice");
          if (!glOffice) {
            glOffice = new GraphicsLayer({
              id: "glOffice"
            });
            map.addLayer(glOffice);
          }
          glOffice.clear();
          for (var i = 0; i < listofOffice.length; i++) {
            glOffice.add(listofOffice[i]);
          }
        }

        function removeBaseMapLayer() {
          var baseMapGray = map.getLayer("layer0");
          if (baseMapGray) {
            map.removeLayer(baseMapGray);
          }
        }

        function convertGeomToGraphic(arrData) {
          var arrRet = [];
          for (var i = 0; i < arrData.length; i++) {
            var office = arrData[i];
            var xyFromLongLat = webMercatorUtils.lngLatToXY(office.LONGITUDE, office.LATITUDE);
            var gr = new Graphic(new Point(xyFromLongLat[0], xyFromLongLat[1], map.spatialReference), symbolOffice, office, officeTemplate);
            arrRet.push(gr);
          }
          return arrRet;
        }

        function convertObjectToGeom(arrData) {
          var arrRet = [];
          console.log(arrData);
          for (var i = 0; i < arrData.length; i++) {
            var office = arrData[i];
            var xyFromLongLat = webMercatorUtils.lngLatToXY(office.LONGITUDE, office.LATITUDE);
            var pt = new Point(xyFromLongLat[0], xyFromLongLat[1], map.spatialReference);
            arrRet.push(pt);
          }
          return arrRet;
        }

        function setMapExtentToGPSAndOffice() {
          var arrGraph = [];
          var glGPSSymbol = map.getLayer("glGPSSymbol");
          if (glGPSSymbol) {
            for (var i = 0; i < glGPSSymbol.graphics.length; i++) {
              arrGraph.push(glGPSSymbol.graphics[i]);
            }
          }
          var glOffice = map.getLayer("glOffice");
          if (glOffice) {
            for (var j = 0; j < glOffice.graphics.length; j++) {
              arrGraph.push(glOffice.graphics[j]);
            }
          }
          var objExtent = graphicsUtils.graphicsExtent(arrGraph);
          map.setExtent(objExtent, true);
        }
        $scope.getOfficeByRegion = function(region){
          service_office.query({
            region: region
          }).then(function (result) {
            // service_office.exsist().query(function(ress){
            //   console.log(ress);
            // });
            $scope.map.Offices = convertGeomToGraphic(result);
            console.warn($scope.map.Offices)
            $scope.getLocation();
          });
        }

        $scope.getOfficeByRegion();

        function createRadiusFence(x, y) {
          /*
              Fungsi untuk membuat radius fence
              param : x = number , koordinat longitude
                      y = number , koordinat latitude
              return : void, akan set variable $scope.map.radiusFence dengan radius fence yang dibuat
              */
          var point = new Point(x, y, map.spatialReference);
          var radiusFence = new Circle(
            point, {
              "radius": 50 // satuan dalam meter
            }
          )
          $scope.map.radiusFence = radiusFence;

          //gambarkan ke map untuk testing
          var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
              new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25])
          );
          var attribute = {
            "Radius Fence ": "50 Meters"
          };
          var graphic = new Graphic(radiusFence, sfs, attribute);

          var glRadiusFence = map.getLayer("glRadiusFence");
          if (!glRadiusFence) {
            glRadiusFence = new GraphicsLayer({
              id: "glRadiusFence"
            });
            map.addLayer(glRadiusFence);
          }
          glRadiusFence.clear();
          glRadiusFence.add(graphic);
        }

        function checkLocationByRadiusFence(x, y) {
          /* 
              Fungsi untuk cek posisi apakah berada didalam radius fence,
              param : x = number , koordinat longitude
                      y = number , koordinat latitude
              return : true , jika  posisi berada didalam radius fence
                          false , jika posisi diluar radius fence
                          false , jika objek radius fence belum dicreate (error message di console)
                          */
          if ($scope.map.radiusFence) {
            var point = new Point([x, y]);
            var isIntersected = geometryEngine.intersects(point, $scope.map.radiusFence);
            return isIntersected;
          }
          console.error("Objek radius fence belum dibuat, panggil createRadiusFence(x,y)")
          return false;
        }
      }
    }
    return $scope;
  })

  .service('service_office', function ($q, $ionicHistory, $resource, _http, _store, _Sweet, $state) {
    return {
      exsist: function () {
        return $resource('https://antrian.imigrasi.go.id/Antrian/api/listoffices.jsp', null, {
          query: {
            method: 'GET',
            isArray: true,
            transformResponse: function (data) {
              return angular.fromJson(data).Offices;
            }
          }
        });
      },
      query: function (object) {
        object = object || {};
        var q = $q.defer();
        _http.post(config.api + "/layanan/wni/business/select", {
          BUSINESS_UNIT_ID: "",
          TEAM_ID: "",
          SEARCHKEY: object.region || _store.get("REGION"),
          IS_ACTIVE: 1,
          ROW_LENGTH: object.total || 100,
          ROW_START: 0,
          TOKEN: _store.get("token")
        }).then(function (response) {
          console.log(response)
          if (response.data.SUCCESS == true) {
            q.resolve(response.data.BUSINESS);
          } else {
            q.resolve([]);
          }
        }, function (err) {
          q.resolve([]);
        });
        return q.promise;
      }
    }
  })

  .config(function (ionicDatePickerProvider) {
    var datePickerObj = {
      inputDate: new Date(),
      titleLabel: 'Pilih Tanggal',
      setLabel: 'PILIH',
      closeLabel: 'BATAL',
      mondayFirst: false,
      weeksList: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
      monthsList: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
      templateType: 'modal',
      from: new Date(1800, 8, 1),
      to: new Date(3000, 8, 1),
      showTodayButton: false,
      closeOnSelect: false,
      disableWeekdays: []
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
  })

  .service('_datePicker', function ($q, ionicDatePicker, $rootScope, $compile, _http) {
    return {
      dateCustom: {
        aDate_AVAILABLE: [],
        aDate_EMPTY: [],
        aDate_HOLIDAY: []
      },
      limit: 30,
      fromNow: function () {
        return moment().add(this.limit, 'days');
      },
      setDateCustomAttribute: function (data) {
        var self = this;
        try {
          var now = new Date(),
            fromNow = new Date(self.fromNow().calendar()).setHours(23, 59, 59, 59);
          now.setHours(0, 0, 0, 0);
          /*           if (data.epoch <= now.getTime()) {
                      return "green";
                    } else { */
          if ($.inArray(data.epoch, self.dateCustom.aDate_AVAILABLE) >= 0) {
            return "green";
          } else if ($.inArray(data.epoch, self.dateCustom.aDate_EMPTY) >= 0) {
            return "red";
          } else if ($.inArray(data.epoch, self.dateCustom.aDate_HOLIDAY) >= 0) {
            return "gray";
          } else {
            if (data.epoch == undefined) {
              return null;
            } else {
              return "yellow";
            }
            // }
          }
        } catch (err) {
          return null;
        }
      },
      show: function (limit) {
        if (!isNaN(limit)) this.limit = limit;
        var q = $q.defer(),
          fromNow = this.fromNow(),
          ipObj1 = {
            callback: function (val) {
              q.resolve(val);
            },
            disabledDates: [],
            from: new Date(),
            to: new Date(fromNow.year(), fromNow.month(), fromNow.date()),
            inputDate: new Date(),
            mondayFirst: false,
            // disableWeekdays: [0, 6],
            disableWeekdays: [],
            closeOnSelect: false,
            templateType: 'modal'
          }
        ionicDatePicker.openDatePicker(ipObj1);
        $rootScope.dateShowisDefault = false;
        if (!this.templateOn) {
          this.templateOn = true;
          _http.get("templates/date-picker-bottom.html").then(function (response) {
            $($compile(response.data)($rootScope)).insertAfter(".ionic_datepicker_modal .scroll .calendar_grid");
            setTimeout(function () {
              $rootScope.$apply();
            }, 100);
          });
          _http.get("templates/date-picker-top.html").then(function (response) {
            $(".ionic_datepicker_modal .scroll .calendar_grid").parent().prepend($compile(response.data)($rootScope));
            setTimeout(function () {
              $rootScope.$apply();
            }, 100);
          });
        }
        return q.promise;
      }
    }
  })
  .service('_datePickerDefault', function ($q, ionicDatePicker, $rootScope, $compile) {
    return {
      show: function (inputDate) {
        var q = $q.defer(),
          date = moment().lang("id").format('LL');
        inputDate = inputDate ? new Date(inputDate) : new Date();
        ipObj1 = {
          callback: function (val) {
            q.resolve(val);
          },
          disabledDates: [],
          setLabel: 'PILIH',
          todayLabel: 'Hari Ini',
          closeLabel: 'BATAL',
          inputDate: inputDate,
          mondayFirst: false,
          closeOnSelect: false,
          from: new Date(1800, 0, 1),
          to: new Date(3000, 8, 1),
          templateType: 'popup',
          weeksList: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
          monthsList: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
          dateFormat: 'dd MMMM yyyy',
          reverseButtons: true,
        }
        ionicDatePicker.openDatePicker(ipObj1);
        return q.promise;
      }
    }
  })

  .service('_store', function () {
    return {
      put: function (key, value) {
        if (typeof value == 'object') value = JSON.stringify(value);
        localStorage.setItem(key, value);
      },
      putObj: function (obj) {
        if (typeof obj != 'object') obj = {};
        for (var key in obj) {
          this.put(key, obj[key]);
        }
      },
      get: function (key) {
        var value = localStorage.getItem(key);
        try {
          if (["{", "["].Contains(value.charAt(0))) {
            return JSON.parse(value);
          } else {
            return value;
          }
        } catch (err) {
          return undefined;
        }
      },
      getObj: function (arr) {
        var ret = {}
        if (!Array.isArray(arr)) arr = [];
        for (var i in arr) {
          var data = this.get(arr[i]);
          if (i != 'Contains' && data) ret[arr[i]] = data;
        }
        return ret;
      },
      removeObj: function (arr) {
        var self = this;
        for (var i = 0; i < arr.length; i++) {
          self.remove(arr[i]);
        }
      },
      remove: function (key) {
        localStorage.removeItem(key);
      },
      getAll: function () {
        var ret = {}
        for (var key in localStorage) {
          ret[key] = this.get(key);
        }
        return ret;
      },
      removeAll: function () {
        var stores = this.getAll();
        for (var key in stores) {
          if (key != "RememberLogin") this.remove(key);
        }
      }
    }
  })

  .service("_Sweet", function ($rootScope) {
    swal.setDefaults({
      allowOutsideClick: false,
      showCloseButton: true,
      reverseButtons: true
    });
    // return swal;
    return function(){
      var args = [];
      for (var i = 0; i < arguments.length; i++) {
        args[i] = arguments[i];
      }
      if (Array.isArray(args[0])){
        args.splice(0, 1);
      }
      return swal(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]);
    }
  })

  .service('_Permission', function (_Sweet) {
    return {
      getDiagnotic: function () {
        if (window.cordova) {
          return cordova.plugins.diagnostic;
        } else {
          return {}
        }
      },
      allowLocation: function (callback) {
        var diagnotic = this.getDiagnotic();
        if (typeof callback != 'function') callback = function () {}
        if (window.cordova) {
          diagnotic.getLocationAuthorizationStatus(function (status) {
            if (status == "GRANTED") {

            } else {}
          })
        }
      }
    }
  })

  .service("_Camera", function ($q, $cordovaCamera) {
    var conf = {
      options: {
        quality: 50,
        allowEdit: true,
        targetWidth: 300,
        targetHeight: 300,
        saveToPhotoAlbum: true,
        correctOrientation: true
      },
      cameraCore: function (options, source) {
        var opt, q = $q.defer();
        if (typeof opt == "object") {
          options = Object.assign(this.options, options);
        } else {
          options = this.options;
        }
        if (window.cordova) {
          opt = {
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions
          }
        } else {
          opt = {}
        }
        if (source == "gallery") {
          opt = Object.assign(opt, {
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
          });
        } else if (source == "camera") {
          opt = Object.assign(opt, {
            cameraDirection: 1,
            sourceType: Camera.PictureSourceType.CAMERA
          });
        }
        $cordovaCamera.getPicture(Object.assign(options, opt)).then(function (imageData) {
          q.resolve(imageData);
        }, function (err) {
          q.reject('Error Camera');
        });
        return q.promise;
      },
      getPicture: function (options) {
        return conf.cameraCore(options, "camera");
      },
      parseImage: function (img) {
        if (typeof img == "string") {
          return img.replace(/\n/g, "");
        } else {
          return null;
        }
      },
      fromGallery: function (options) {
        return conf.cameraCore(options, "gallery");
      }
    }
    return {
      data: "data:image/png;base64,",
      getPicture: conf.getPicture,
      fromGallery: conf.fromGallery,
      parseImage: conf.parseImage
    }
  })

  .service('_MRZ', function ($q, $rootScope, _Sweet, _passport, _toastCtrl, _loading, _store) {
    return {
      countryCode: {
        AFG: "Afghanistan",
        ALB: "Albania",
        DZA: "Algeria",
        ASM: "American Samoa",
        AND: "Andorra",
        AGO: "Angola",
        AIA: "Anguilla",
        ATA: "Antarctica",
        ATG: "Antigua and Barbuda",
        ARG: "Argentina",
        ARM: "Armenia",
        ABW: "Aruba",
        AUS: "Australia",
        AUT: "Austria",
        AZE: "Azerbaijan",
        BHS: "Bahamas",
        BHR: "Bahrain",
        BGD: "Bangladesh",
        BRB: "Barbados",
        BLR: "Belarus",
        BEL: "Belgium",
        BLZ: "Belize",
        BEN: "Benin",
        BMU: "Bermuda",
        BTN: "Bhutan",
        BOL: "Bolivia",
        BIH: "Bosnia and Herzegovina",
        BWA: "Botswana",
        BVT: "Bouvet Island",
        BRA: "Brazil",
        IOT: "British Indian Ocean Territory",
        BRN: "Brunei Darussalam",
        BGR: "Bulgaria",
        BFA: "Burkina Faso",
        BDI: "Burundi",
        KHM: "Cambodia",
        CMR: "Cameroon",
        CAN: "Canada",
        CPV: "Cape Verde",
        CYM: "Cayman Islands",
        CAF: "Central African Republic",
        TCD: "Chad",
        CHL: "Chile",
        CHN: "China",
        CXR: "Christmas Island",
        CCK: "Cocos (Keeling) Islands",
        COL: "Colombia",
        COM: "Comoros",
        COG: "Congo",
        COK: "Cook Islands",
        CRI: "Costa Rica",
        CIV: "C�te d'Ivoire",
        HRV: "Croatia",
        CUB: "Cuba",
        CYP: "Cyprus",
        CZE: "Czech Republic",
        PRK: "Democratic People's Republic of Korea",
        COD: "Democratic Republic of the Congo",
        DNK: "Denmark",
        DJI: "Djibouti",
        DMA: "Dominica",
        DOM: "Dominican Republic",
        TMP: "East Timor",
        ECU: "Ecuador",
        EGY: "Egypt",
        SLV: "El Salvador",
        GNQ: "Equatorial Guinea",
        ERI: "Eritrea",
        EST: "Estonia",
        ETH: "Ethiopia",
        FLK: "Falkland Islands (Malvinas)",
        FRO: "Faeroe Islands",
        FJI: "Fiji",
        FIN: "Finland",
        FRA: "France",
        FXX: "France, Metropolitan",
        GUF: "French Guiana",
        PYF: "French Polynesia",
        GAB: "Gabon",
        GMB: "Gambia",
        GEO: "Georgia",
        D: "Germany",
        GHA: "Ghana",
        GIB: "Gibraltar",
        GRC: "Greece",
        GRL: "Greenland",
        GRD: "Grenada",
        GLP: "Guadeloupe",
        GUM: "Guam",
        GTM: "Guatemala",
        GIN: "Guinea",
        GNB: "Guinea-Bissau",
        GUY: "Guyana",
        HTI: "Haiti",
        HMD: "Heard and McDonald Islands",
        VAT: "Holy See (Vatican City State)",
        HND: "Honduras",
        HKG: "Hong Kong",
        HUN: "Hungary",
        ISL: "Iceland",
        IND: "India",
        IDN: "Indonesia",
        IRN: "Iran, Islamic Republic of",
        IRQ: "Iraq",
        IRL: "Ireland",
        ISR: "Israel",
        ITA: "Italy",
        JAM: "Jamaica",
        JPN: "Japan",
        JOR: "Jordan",
        KAZ: "Kazakhstan",
        KEN: "Kenya",
        KIR: "Kiribati",
        KWT: "Kuwait",
        KGZ: "Kyrgyzstan",
        LAO: "Lao People's Democratic Republic",
        LVA: "Latvia",
        LBN: "Lebanon",
        LSO: "Lesotho",
        LBR: "Liberia",
        LBY: "Libyan Arab Jamahiriya",
        LIE: "Liechtenstein",
        LTU: "Lithuania",
        LUX: "Luxembourg",
        MDG: "Madagascar",
        MWI: "Malawi",
        MYS: "Malaysia",
        MDV: "Maldives",
        MLI: "Mali",
        MLT: "Malta",
        MHL: "Marshall Islands",
        MTQ: "Martinique",
        MRT: "Mauritania",
        MUS: "Mauritius",
        MYT: "Mayotte",
        MEX: "Mexico",
        FSM: "Micronesia, Federated States of",
        MCO: "Monaco",
        MNG: "Mongolia",
        MNE: "Montenegro",
        MSR: "Montserrat",
        MAR: "Morocco",
        MOZ: "Mozambique",
        MMR: "Myanmar",
        NAM: "Namibia",
        NRU: "Nauru",
        NPL: "Nepal",
        NLD: "Netherlands, Kingdom of the",
        ANT: "Netherlands Antilles",
        NTZ: "Neutral Zone",
        NCL: "New Caledonia",
        NZL: "New Zealand",
        NIC: "Nicaragua",
        NER: "Niger",
        NGA: "Nigeria",
        NIU: "Niue",
        NFK: "Norfolk Island",
        MNP: "Northern Mariana Islands",
        NOR: "Norway",
        OMN: "Oman",
        PAK: "Pakistan",
        PLW: "Palau",
        PSE: "Palestine",
        PAN: "Panama",
        PNG: "Papua New Guinea",
        PRY: "Paraguay",
        PER: "Peru",
        PHL: "Philippines",
        PCN: "Pitcairn",
        POL: "Poland",
        PRT: "Portugal",
        PRI: "Puerto Rico",
        QAT: "Qatar",
        KOR: "Republic of Korea",
        MDA: "Republic of Moldova",
        REU: "R�union",
        ROU: "Romania",
        RUS: "Russian Federation",
        RWA: "Rwanda",
        SHN: "Saint Helena",
        KNA: "Saint Kitts and Nevis",
        LCA: "Saint Lucia",
        SPM: "Saint Pierre and Miquelon",
        VCT: "Saint Vincent and the Grenadines",
        WSM: "Samoa",
        SMR: "San Marino",
        STP: "Sao Tome and Principe",
        SAU: "Saudi Arabia",
        SRB: "Serbia",
        SEN: "Senegal",
        SYC: "Seychelles",
        SLE: "Sierra Leone",
        SGP: "Singapore",
        SVK: "Slovakia",
        SVN: "Slovenia",
        SLB: "Solomon Islands",
        SOM: "Somalia",
        ZAF: "South Africa",
        SGS: "South Georgia and the South Sandwich Island",
        SSD: "South Sudan",
        ESP: "Spain",
        LKA: "Sri Lanka",
        SDN: "Sudan",
        SUR: "Suriname",
        SJM: "Svalbard and Jan Mayen Islands",
        SWZ: "Swaziland",
        SWE: "Sweden",
        CHE: "Switzerland",
        SYR: "Syrian Arab Republic",
        TWN: "Taiwan Province of China",
        TJK: "Tajikistan",
        TLS: "Timor Leste",
        THA: "Thailand",
        MKD: "The former Yugoslav Republic of Macedonia",
        TGO: "Togo",
        TKL: "Tokelau",
        TON: "Tonga",
        TTO: "Trinidad and Tobago",
        TUN: "Tunisia",
        TUR: "Turkey",
        TKM: "Turkmenistan",
        TCA: "Turks and Caicos Islands",
        TUV: "Tuvalu",
        UGA: "Uganda",
        UKR: "Ukraine",
        ARE: "United Arab Emirates",
        GBR: "United Kingdom of Great Britain and Northern Ireland Citizen",
        GBD: "United Kingdom of Great Britain and Northern Ireland Dependent Territories Citizen",
        GBN: "United Kingdom of Great Britain and Northern Ireland National (oversees)",
        GBO: "United Kingdom of Great Britain and Northern Ireland Oversees Citizen",
        GBP: "United Kingdom of Great Britain and Northern Ireland Protected Person",
        GBS: "United Kingdom of Great Britain and Northern Ireland Subject",
        TZA: "United Republic of Tanzania",
        USA: "United States of America",
        UMI: "United States of America Minor Outlying Islands",
        URY: "Uruguay",
        UZB: "Uzbekistan",
        VUT: "Vanuatu",
        VEN: "Venezuela",
        VNM: "Viet Nam",
        VGB: "Virgin Islands (Great Britian)",
        VIR: "Virgin Islands (United States)",
        WLF: "Wallis and Futuna Islands",
        ESH: "Western Sahara",
        YEM: "Yemen",
        ZAR: "Zaire",
        ZMB: "Zambia",
        ZWE: "Zimbabwe",
        UNO: "United Nations Organization Official",
        UNA: "United Nations Organization Specialized Agency Official",
        XAA: "Stateless (per Article 1 of 1954 convention)",
        XXB: "Refugee (per Article 1 of 1951 convention, amended by 1967 protocol)",
        XXC: "Refugee (non-convention)",
        XXX: "Unspecified / Unknown"
      },
      scan: function (message) {
        var q = $q.defer(),
          self = this;
        if ($rootScope.mrzUnderConstruction){
          console.info("MRZ Message", message);
          q.resolve({});
        }else{ 
          if (localStorage.getItem("hasStartedAnyline") === 'true') {
            q.reject("Scan has been started");
          } else {
            localStorage.setItem("hasStartedAnyline", true);
            var licenseKey = "eyAiYW5kcm9pZElkZW50aWZpZXIiOiBbICJpZC5nby5pbWlncmFzaS5sYXlhbmFud25pIiBdLCAiZGVidWdSZXBvcnRpbmciOiAib3B0LW91dCIsICJpb3NJZGVudGlmaWVyIjogWyAiaWQuZ28uaW1pZ3Jhc2kubGF5YW5hbnduaSIgXSwgImxpY2Vuc2VLZXlWZXJzaW9uIjogMiwgIm1ham9yVmVyc2lvbiI6ICIzIiwgInBpbmdSZXBvcnRpbmciOiB0cnVlLCAicGxhdGZvcm0iOiBbICJpT1MiLCAiQW5kcm9pZCIgXSwgInNjb3BlIjogWyAiTVJaIiBdLCAic2hvd1BvcFVwQWZ0ZXJFeHBpcnkiOiBmYWxzZSwgInNob3dXYXRlcm1hcmsiOiBmYWxzZSwgInRvbGVyYW5jZURheXMiOiA5MCwgInZhbGlkIjogIjIwMTktMDItMjUiIH0KeS83TWpwYXNHUFpzMXZCNkgwOVh4dXp1b2RnYUpxbGhrRzBDUzk2dVMzUTdhYWNiNFBteGFpaVNVNHRFN3hKVwo4SkFFWnhkUktNajJKMHdsSUNLeGs3TVhDa05hLy9HL1BEL2NYS1pINXRrNTdqSTM2Ty8wK2tyUm9oZHVqZm1XCmZtdVhjSkgxUlpjRWtEenMvVVFuTUVRUFRXYzR6UWdkTTZHYzdoNjNLdUZwVXdBZVVZbm1CZ09RVlBwOGl5QkYKT2NBajh0TWMzbVBDN2xhUUdnZSticWw4dkZxekhqT0loM3UwaTRrVm9mTkxRUDN1T1RBR1F5NzM1WjRhMmI5cApBV1BaZ2xJbnZuVVFRdmw2TnZHc3pTVnJFanprUTA4R2VKRlFmbjM3VHNQZGV6OHMyb2ZoV3FURzZwam01dzNBCmlsRkwxTEk0dGlmTkJrNXE5YzIwdHc9PQo=";

            function doScan() {
              if (window.cordova) {
                cordova.exec(function (result) {
                  localStorage.setItem("hasStartedAnyline", false);
                  result.sex = result.sex == "F" ? "F" : "M"
                  result.Nationality = self.countryCode[result.countryCode];
                  result.FullName = result.givenNames + " " + result.surNames;
                  _loading.show("Mohon tunggu...");
                  _passport.verify(result.documentNumber, result.dayOfBirthObject, result.expirationDateObject).then(function (res) {
                    _loading.hide();
                    if (['D', 'S'].Contains(result.documentNumber.charAt(0))) {
                      var tipe = _store.get('Tipe');
                      if (tipe == 'LaporDiri') {
                        _Sweet("", "Mohon Maaf, Fitur Ini Hanya Dapat Digunakan Untuk Paspor Keluaran Kantor Imigrasi (Bukan Paspor Dinas / Diplomat)", "error");
                        q.reject({});
                      } else {
                        _Sweet("", "Mohon Maaf, Permohonan Penggantian / Perpanjangan Paspor Hanya Dapat Dilakukan Menggunakan Paspor Keluaran Kantor Imigrasi (Bukan Paspor Dinas / Diplomat)", "error");
                        q.reject({});
                      }
                    } else {
                      if (res.data.STATUS) {
                        q.resolve(result);
                      } else {
                        _toastCtrl.show(res.data.MESSAGE, "long", "center");
                        q.resolve(result);
                      }
                    }
                  }, function (e) {
                    _loading.hide();
                    q.reject(e);
                  });
                }, function (error) {
                  localStorage.setItem("hasStartedAnyline", false);
                  q.reject(error);
                }, "AnylineSDK", "MRZ", [licenseKey, {
                  "captureResolution": "1080",
                  "cutout": {
                    "style": "rect",
                    "maxWidthPercent": "90%",
                    "maxHeightPercent": "90%",
                    "alignment": "top_half",
                    "strokeWidth": 2,
                    "cornerRadius": 4,
                    "strokeColor": "FFFFFF",
                    "outerColor": "000000",
                    "outerAlpha": 0.3,
                    "cropPadding": {
                      "x": -30,
                      "y": -90
                    },
                    "cropOffset": {
                      "x": 0,
                      "y": 90
                    }
                  },
                  "flash": {
                    "mode": "manual",
                    "alignment": "bottom_right"
                  },
                  "beepOnResult": true,
                  "vibrateOnResult": true,
                  "blinkAnimationOnResult": true,
                  "cancelOnResult": true,
                  "visualFeedback": {
                    "style": "rect",
                    "strokeColor": "0099FF",
                    "strokeWidth": 2
                  }
                }]);
              } else {
                localStorage.setItem("hasStartedAnyline", false);
                q.resolve({});
              }
            }
            if (typeof message == 'object') {
              _Sweet({
                title: message.title,
                text: message.text,
                type: "info"
              }).then(function (res) {
                if (res.value) {
                  doScan();
                } else {
                  localStorage.setItem("hasStartedAnyline", false);
                }
              });
            } else {
              doScan();
            }
          }
        }
        return q.promise;
      }
    }
  })

  .service('_lapordiri', function (_http, _store) {
    return {
      laporDiri: function (params) {
        return _http.post(config.api + "/layanan/wni/user/selfreport", params);
      }
    }
  })

  .service('_QR', function ($q) {
    // https://github.com/phonegap/phonegap-plugin-barcodescanner
    return {
      qrcode: function () {
        if (window.cordova) {
          cordova.plugins.barcodeScanner.encode(BarcodeScanner.Encode.TEXT_TYPE, "http://www.nytimes.com", function (success) {
            alert("encode success: " + success);
          }, function (fail) {
            alert("encoding failed: " + fail);
          });
        }
      }
    }
  })

  .service('_http', function ($q, $http, _Sweet, _store, $state, $ionicHistory, $ionicLoading) {
    $http.defaults.useXDomain = true;
    return {
      ajax: function (url, data, method, headers) {
        var q = $q.defer();
        $http({
          method: method,
          url: url,
          timeout: 60 * 1000,
          headers: headers || {},
          data: data || {}
        }).then(function (succ) {
          if (succ.data.MESSAGE == "Invalid Token") {
            _Sweet({
              title: "Mohon Maaf",
              text: "Sesi Anda Telah Berakhir Silahkan Login Kembali",
              type: "error"
            }).then(function (res) {
              _store.removeAll();
              $ionicHistory.clearHistory();
              $ionicHistory.clearCache();
              $state.go('login', {}, {
                reload: true
              });
              $ionicLoading.hide();
            });
          } else {
            q.resolve(succ);
          }
        }, function (err) {
          if (err.status == -1) {
            q.reject({});
          } else {
            q.reject(err);
          }
        });
        return q.promise;
      },
      post: function (url, data, headers) {
        return this.ajax(url, data, "post", headers);
      },
      get: function (url, data) {
        return this.ajax(url, data, "get");
      }

    }
  })

  .service('_UserService', function () {
    // For the purpose of this example I will store user data on ionic local storage but you should save it on a database

    var setUser = function (user_data) {
      window.localStorage.starter_google_user = JSON.stringify(user_data);
    };

    var getUser = function () {
      return JSON.parse(window.localStorage.starter_google_user || '{}');
    };

    return {
      getUser: getUser,
      setUser: setUser
    };
  });
