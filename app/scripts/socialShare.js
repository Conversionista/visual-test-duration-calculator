var likes = [];
(function(){
  var tw = 0;
  var fb = 0;
  var gp = 0;
  var li = 0;

  var z = {};
  var started = false;
  var URL = $('link[rel=canonical]').attr('href');

  function getContentByMetaTagName(c) {
      for (var b = document.getElementsByTagName('meta'), a = 0; a < b.length; a++) {
          if (c === b[a].name || c === b[a].getAttribute('property')) {
              return b[a].content;
          }
      }
      return '';
  }

  function addLinks() {



      var title = encodeURIComponent(getContentByMetaTagName('og:title'));
      var urlSubStr = URL.substring(0, 8);
      URL = (urlSubStr=="https://") ? URL : "https:" + URL;
      $.each($('div.share-btn'), function() {

          var service = $(this).attr('data-service');

          if (service === 'facebook') {
              $('a', this).attr('href', 'https://www.facebook.com/sharer/sharer.php?u=' + URL);
          }

          if (service === 'google') {
              $('a', this).attr('href', 'https://plus.google.com/share?url=' + URL);
          }

          if (service === 'linkedin') {
              $('a', this).attr('href', 'https://www.linkedin.com/shareArticle?mini=true&url=' + URL + '&title=' + title);
          }

          if (service === 'twitter') {
              $('a', this).attr('href', 'https://twitter.com/intent/tweet?text=' + title + '&url=' + URL + '&via=conversionista');
          }

      });
  }

  function countShares(arr) {
       var shareLen = arr.length;
      for (var i = 0; i < shareLen; i++) {
          var shares = arr[i].shares;
           //console.log(shares);
    if ( shares.twitter !==undefined) {
       tw = tw + shares.twitter;
    }
          if (shares.google !==undefined) {
       gp = gp + shares.google;
    }

    if (shares.linkedin !==undefined) {
      if (shares.linkedin > li) {
          li = shares.linkedin;
      }
    }
          var x = arr[i].url;
      // console.log(x);
          if (shares.facebook !== undefined) {
      if (x.match(/www/g)) {} else {
        fb = fb + shares.facebook;
      }
    }

    //alert(fb);
      if (isNaN(tw)) {
        tw = 0;
      }
      if (isNaN(gp)) {
        gp = 0;
      }
      if (isNaN(li)) {
        li = 0;
      }
      if (isNaN(fb)) {
        fb = 0;
      }
      }

      z = {
          'total': fb + li + gp + tw,
          'facebook': fb,
          'twitter': tw,
          'google': gp,
          'linkedin': li
      };

      $('.count').each(function(index, el) {
          //alert(el);
          //alert(count);
          var service = $(el).parents('.share-btn').attr('data-service');
          var count = z[service];

          // Divide large numbers eg. 5500 becomes 5.5k
          if (count > 1000) {
              count = (count / 1000).toFixed(1);
              if (count > 1000) {
                  count = (count / 1000).toFixed(1) + 'M';

              } else {
                  count = count + 'k';
              }
          }

          if (count < 10) {
            count = '';
          }

          $(el).html(count);

      });

  }

function getData(arr) {
      started = true;
      var j = 0;
      var shareLen = arr.length;

      for (var i = 0; i < shareLen; i++) {

          var rand = Math.floor((Math.random() * 100000) + 1);
          var value = arr[i];
          // Ajax request to read share counts. Notice "&callback=?" is appended to the URL to define it as JSONP.
          var jqxhr = $.getJSON('https://count.conversionista.se/?url=' + encodeURIComponent(value) + '&callback=?', function(data) {
              likes.push(data);
          });


          jqxhr.complete(function() {

              if (j < shareLen-1) {
                  j++;

              } else {

                j = -1000;
                  countShares(likes);
                  addLinks();
              }

          });
      }

  }

  $(document).ready(function() {
    var path = window.location.pathname;
    var pathwithoutslash = path.substring(0, path.length - 1);

    getData(['http://apps.conversionista.se/']);


  });

  $('.share-btn').click(function(event) {
    $(this).children('a.button').children('i').removeClass().addClass('fa fa-thumbs-up');
    $(this).children('a.button').addClass('animated pulse');
  });

})();
