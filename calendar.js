
(function (exports){
  var daysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // Create empty divs to take the place of the start/end days of the week row.
  function createPaddingDivs(count){
    var html = '';
    var i;
    for(i = 0; i < count; i+=1){
      html +='<div class="day empty">&nbsp;</div>';
    }
    return html;
  }
  // Return the number of days in the month for a given date
  function getDaysInMonth (date) {
    var start = new Date(date.getFullYear(), date.getMonth(), 1);
    var end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    var days = (end - start) / 1000 / 60 / 60 / 24;
    return Math.floor(days);
  }

  function Calendar (selector) {
    var self = this;
    this.selector = selector;
    // Date defaults to now
    this.date = new Date();
    // Bind controls to the selector
    $(selector).on('click', function (e){
      var
        direction = $(e.target).data('control'),
        current = self.getDate(),
        desiredMonth,
        desiredYear;
      if (direction){
        desiredMonth = direction === 'next'
          ? current.getMonth() + 1
          : current.getMonth() - 1;
        if (desiredMonth > 11){
          // User is incrementing to a new year
          // Set month to january
          desiredMonth = 0;
          desiredYear = current.getFullYear() + 1;
        }else if (desiredMonth < 0){
          // User is incrementing to the previous year
          // Set month to december
          desiredMonth = 11;
          desiredYear = current.getFullYear() - 1;
        }else {
          desiredYear = current.getFullYear();
        }
        self.setDate(new Date(desiredYear, desiredMonth, 1));
      }
    });
  }

  Calendar.prototype.draw = function (){
    var
      date = this.date,
      currentYear = date.getFullYear(),
      currentMonthName = date.toLocaleString('en-us', {month: 'long'}),
      title = currentMonthName + ' | ' + currentYear,
      numDays = getDaysInMonth(date),
      header = $('<div class="header">' + title + '</div>'),
      dayEls = daysOfTheWeek.map(function (d){
        return $('<div class="weekday">' + d + '</div>');
      }),
      days = $('<div class="days-header">').append(dayEls),
      ary = [],
      elements,
      i;
    // Create an array of all the dates in the month
    for(i = 0; i < numDays; i += 1){
      ary.push(new Date(date.getFullYear(), date.getMonth(), i + 1));
    }
    elements = ary.reduce(function (result, d){
      var dayOfMonth = d.getDate();
      var dayOfWeek = d.toLocaleString('en-US', { weekday: 'short'});
      // No extra padding needed. Create a row wrapper;
      if (dayOfMonth === 1 || dayOfWeek === 'Sun'){
        result += '<div class="row">';
      }
      // If the month didn't start on a sunday create some empty squares
      // so that dates line up.
      if (dayOfMonth === 1 && dayOfWeek !== 'Sun'){
        result += createPaddingDivs(daysOfTheWeek.indexOf(dayOfWeek));
      }
      // Populate the calendar
      result += '<div class="day">' + dayOfMonth + '</div>';
      // Add padding on to the end of the last row.
      if (dayOfMonth === numDays){
        result += createPaddingDivs(6 - daysOfTheWeek.indexOf(dayOfWeek));
        // Close the row;
        result += '</div>';
      }
      // Close the row tag
      if ( dayOfWeek === 'Sat'){
        result += '</div>';
      }
      return result;
    }, '');
    $(this.selector)
      .html([
        $('<div class="row">').append(header),
        $('<div class="row">').append([
          $('<div class="control prev" data-control="prev">Prev</div>'),
          $('<div class="control next" data-control="next">Next</div>')
        ]),
        $('<div class="row">').append(days),
        $(elements)
      ]);
  };

  Calendar.prototype.setDate = function (date){
    this.date = date;
    this.draw();
  };

  Calendar.prototype.getDate = function (){
    return this.date;
  };

  exports.Calendar = Calendar;
})(window);
