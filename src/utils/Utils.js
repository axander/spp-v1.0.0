const Utils = {
    buttonPress:null,
    swipedetect: function (el, callback, _toLeft, _toRight){
     var touchsurface = el,
     swipedir,
     startX,
     startY,
     distX,
     distY,
     threshold = 150, //required min distance traveled to be considered swipe
     restraint = 100, // maximum distance allowed at the same time in perpendicular direction
     allowedTime = 300, // maximum time allowed to travel that distance
     elapsedTime,
     startTime,
     handleswipe = callback || function(swipedir){}
     
     touchsurface.addEventListener('touchstart', function(e){
         
         if(e.target){
              this.buttonPress=e.target.id;
         }else{
            this.buttonPress=null 
         }
      var touchobj = e.changedTouches[0]
      swipedir = 'none'
      var dist = 0
      startX = touchobj.pageX
      startY = touchobj.pageY
      startTime = new Date().getTime() // record time when finger first makes contact with surface


     }, false)
     
     touchsurface.addEventListener('touchmove', function(e){
     // prevent scrolling when inside DIV
     }, false)
     
     touchsurface.addEventListener('touchend', function(e){
      var touchobj = e.changedTouches[0]
      distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
      distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
      elapsedTime = new Date().getTime() - startTime // get time elapsed
      if (elapsedTime <= allowedTime){ // first condition for awipe met
       if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
        swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
       }
       else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
        swipedir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
       }
      }
      handleswipe(swipedir,_toLeft, _toRight)

       
     }, false)
    },
    hoursMinutesSeconds: function(time){
      var hours = Math.floor( time / 3600 );  
      var minutes = Math.floor( (time % 3600) / 60 );
      var seconds = time % 60;
      //Anteponiendo un 0 a los minutos si son menos de 10 
      minutes = minutes < 10 ? '0' + minutes : minutes;
      //Anteponiendo un 0 a los segundos si son menos de 10 
      seconds = seconds < 10 ? '0' + seconds : seconds;
      var result = hours + ":" + minutes + ":" + seconds; 
      return result
    },
    dynamicSort: function(property) {
      var sortOrder = 1;
      if(property[0] === "-") {
          sortOrder = -1;
          property = property.substr(1);
      }
      return function (a,b) {
          var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
          return result * sortOrder;
      }
    },
    offset :function (el) {
        var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
    },
    statsDate: function(_date){
      console.log(_date);
      _date = _date .replace(/ /g,"T");
      var fa = new Date();
      var fb = new Date(_date);
      console.log(fa);
      console.log(fb);
      console.log('totdias');
      console.log(totdias);
      var totdias = fa-fb;
      totdias=totdias/3600000;  
      totdias=totdias/24; 
      totdias= Math.floor(totdias);
      totdias= Math.abs(totdias);
      console.log('totdias');
      console.log(totdias);
      var ans, meses, dias, m2, m1, d3, d2, d1;
      var f2=new Date();  var f1=new Date();

      if (fa > fb){f2=fa;f1=fb;}else{var f2=fb; f1=fa;}  //Siempre f2 > f1
      ans=f2.getFullYear()-f1.getFullYear(); // dif de años inicial
      m2=f2.getMonth();
      m1=f1.getMonth();
      meses=m2-m1;  if (meses<0){meses +=12; --ans; }

      d2=f2.getDate();
      d1=f1.getDate();
      dias=d2-d1;

      var f3=new Date(f2.getFullYear(),m2,1);
      f3.setDate(f3.getDate()-1);
      d3=f3.getDate();

      if (d1>d2) {
        dias +=d3; --meses; if (meses<0){meses +=12; --ans; }
        if (fa>fb){  //corrección por febrero y meses de 30 días
          f3=new Date(f1.getFullYear(),m1+1,1);
          f3.setDate(f3.getDate()-1);
          d3=f3.getDate();
          if (d3==30) dias -=1;
          if (d3==29) dias -=2;
          if (d3==28) dias -=3;
        }
      }
      var string = '';
      if(ans){
        string= ans + ( ans === 1 ? ' año' : ' años');
      }else if(meses){
        string = meses + ( meses === 1 ? ' mes' : ' meses');
      }else if(totdias >= 7){
        var week = Math.floor(totdias/7);
        string = week + ( week === 1 ? ' semana' : ' semanas');
      }else if(totdias){
        string = totdias + (totdias ===1 ? ' día' : ' días');
      }else{
        string = 'Hoy';
      }
      return string
    },
    scrollToTop: function(scrollDuration, _end) {
      !localStorage.getItem('opinionNotLogged') && !localStorage.getItem('scrollY')
      ? window.scrollTo(0, 0)
      : (
          localStorage.removeItem('opinionNotLogged'),
          localStorage.removeItem('scrollY')
        )
      
        /*var scrollHeight = window.scrollY || window.pageYOffset || document.documentElement.scrollTop,
            scrollStep = Math.PI / (scrollDuration / 15),
            cosParameter = scrollHeight / 2;
        var scrollCount = 0,
            scrollMargin,
            scrollInterval = setInterval(function() {
                var scrollHeightInterval = window.scrollY || window.pageYOffset || document.documentElement.scrollTop
                if (typeof scrollHeightInterval !== "undefined" && scrollHeightInterval != 0) {
                    scrollCount = scrollCount + 1;
                    scrollMargin = cosParameter - cosParameter * Math.cos(scrollCount * scrollStep);
                    window.scrollTo(0, (scrollHeight - scrollMargin));
                } else {
                    clearInterval(scrollInterval);
                    if (_end) {
                        _end();
                    }
                }
            }, 15);*/
    },
    ltrim: function(str) {
        //del left white spaces
      if(str == null) return str;
      return str.replace(/^\s+/g, '');
    },
    rtrim: function(str) {
        //del right white spaces
      if(str == null) return str;
      return str.replace(/\s+$/g, '');
    },
    formatGetParameters: function(_params) {
        var getParams = _params ?
            Object.keys(_params).map(function(key) {
                return key + '=' + _params[key]
            }).join('&') :
            undefined;
        return getParams
    },
    validateEmail: function(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
    validateCode: function(_code) {
        var re = _code.length > 0 ? true : false;
        return re;
    },
    checkScene: function(_scene) {
        var checked = false;
        typeof localStorage.getItem('lastState') !== 'undefined' && localStorage.getItem('lastState') && localStorage.getItem('lastState').indexOf(_scene) >= 0 ?
            checked = true :
            checked = false;
        return checked
    },
    timeElapsed: function(_start, _daysLeft) {
        var daysLeftM = _daysLeft * 86400000;
        var startMsec = _start;
        var elapsed = ((startMsec + daysLeftM) - new Date().getTime()) / 86400000;
        return elapsed.toFixed(0);
    },
    leapYear: function(_date) {
        _date = _date .replace(/ /g,"T");
        var y = new Date(_date).getFullYear();
        var x = (y % 100 === 0) ? (y % 400 === 0) : (y % 4 === 0);
        return x
    },
    //+++++++++++++++++++++++++++
    //+++++++++scroll blocks
    //+++++++++++++++++++++++++++
    //+++++++++++++++++++++++++++
    scrollTo:function(_duration, _pos){
      var blockCount = 0;
      var position, time, start, finish, duration, increment, distance, handler, fps;
      var dir = 1;
      var easeInOutQuad = function(x, t, b, c, d) {
        var calc;
        ((t /= d / 2) < 1) ? calc = c / 2 * t * t + b : calc = -c / 2 * ((--t) * (t - 2) - 1) + b;
        return calc
      };
      var endScroll = function(handler){
        clearInterval(handler);
        window.scrollTo(0, position);
      };
      var getLimitScrollY = function(){
        return window.scrollY //Modern Way (Chrome, Firefox)
        || window.pageYOffset //(Modern IE, including IE11
        || document.documentElement.scrollTop ;//(Old IE, 6,7,8), // pixel
      };
      var getLimit = function(){
        return Math.max( 
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight 
        )
      };
      var lastScrollY;
      var prevBlock = function(_duration,_pos){
        dir === -1 ? blockCount-=1 : dir = -1;
        clearInterval(handler);
        start = getLimitScrollY();
        finish = _pos,
        distance = start -finish ,
        position = start;
        fps = 60,
        duration = .5, // seconds
        time = 0;
        increment = -distance / (duration * fps),
        handler = setInterval(moveUp, 1000 / fps);
      };

      var moveUp = function() {
        position += increment;
        time += 1 / fps;
        position -= 1/easeInOutQuad(time * 100 / duration, time, finish, start, duration);
        position <=  finish ? endScroll(handler) : null;
        window.scrollTo(0, position);
      };
            prevBlock(_duration,_pos);

    },

    checkSubscription: function(_data) {
        var typeSubscription = '';
        var subscription = {
            'premium': 1,
            'invited': 1,
            'basic': 1
        };
        var lapsed = {
            'premium': 0,
            'invited': 0,
            'basic': 0
        };
        var yearDays = this.leapYear(_data.subscription.type.premium.activationDate) ? 366 : 365;
        var codeInv = '';
        //1 check premium
        // check if it is lapsed
        _data.subscription.type.premium.status && _data.subscription.type.premium.status !== 2 && this.timeElapsed(_data.subscription.type.premium.activationDate, yearDays) > 0 ?
            (
                subscription.premium = 1,
                typeSubscription = 'premium',
                lapsed.premium = 0
            ) :
            _data.subscription.type.premium.status && _data.subscription.type.premium.status !== 2 ?
            (
                subscription.premium = 2,
                lapsed.premium = 1
            ) :
            subscription.premium = 0;
        //1 check invited
        // check if it is lapsed
        _data.subscription.type.invited.status && _data.subscription.type.invited.status !== 2 && this.timeElapsed(_data.subscription.type.invited.activationDate, 30) > 0 ?
            (
                subscription.invited = 1, !subscription.premium ? typeSubscription = 'invited' : null,
                lapsed.invited = 0
            ) :
            _data.subscription.type.invited.status && _data.subscription.type.invited.status !== 2 ?
            (
                subscription.invited = 2,
                lapsed.invited = 1
            ) :
            subscription.invited = 0;
        if (lapsed.invited) {
            for (var j in _data.codesFrom) {
                _data.codesFrom[j].code === _data.subscription.type.invited.code ?
                    (
                        _data.codesFrom[j].status = 2,
                        codeInv = _data.subscription.type.invited.code
                    ) :
                    null;
            }
        }
        //1 check basic
        // check if it is lapsed
        _data.subscription.type.basic.status && _data.subscription.type.basic.status !== 2 && this.timeElapsed(_data.subscription.type.basic.activationDate, yearDays) > 0 ?
            (
                subscription.basic = 1, !subscription.premium && !subscription.invited ? typeSubscription = 'basic' : null,
                lapsed.basic = 0
            ) :
            _data.subscription.type.basic.status && _data.subscription.type.basic.status !== 2 ?
            (
                subscription.basic = 2,
                lapsed.basic = 1
            ) :
            subscription.basic = 0;
        return {
            'type': typeSubscription,
            'status': subscription,
            'lapsed': lapsed,
            'codesData': _data.codesFrom,
            'codeInv': codeInv
        }
    }
}

export default Utils