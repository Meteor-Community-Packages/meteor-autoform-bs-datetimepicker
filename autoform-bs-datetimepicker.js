/*
Prerequisites
-------------
$ meteor add comerc:bs-datetimepicker

Usage
-----
```coffee
  autoform:
    afFieldInput:
      type: "bootstrap-datetimepicker"
      buttonClasses: null # 'glyphicon glyphicon-calendar', 'fa fa-calendar'
      outMode: null # 'utcDate', 'utcDateTime'
      timezoneId: null # http://momentjs.com/timezone/
      dateTimePickerOptions: {}
```
*/
AutoForm.addInputType('bootstrap-datetimepicker', {
  template: 'afBootstrapDateTimePicker',
  valueIn: function (val, atts) {
    // datetimepicker expects the date to represent local time,
    // so we need to adjust it if there's a timezoneId specified
    var timezoneId = atts.timezoneId;
    if (typeof timezoneId === 'string') {
      if (typeof moment.tz !== 'function') {
        throw new Error("If you specify a timezoneId, make sure that you've added a moment-timezone package to your app");
      }
      if (val instanceof Date) {
        return moment(AutoForm.Utility.dateToNormalizedLocalDateAndTimeString(val, timezoneId), "YYYY-MM-DD[T]HH:mm:ss.SSS").toDate();
      }
    }
    if (val instanceof Date) {
      var outMode = atts.outMode;
      if (outMode === 'utcDate') {
        return utcDateToLocal(val);
      } else if (outMode === 'utcDateTime') {
        return utcDateTimeToLocal(val);
      }
    }
    return val;
  },
  valueOut: function () {
    var $element = this.data('has-button') ? this.parent() : this;
    var dtp = $element.data('DateTimePicker');
    var m = dtp.date();
    if (!m) {
      return m;
    }
    var timezoneId = this.data('timezone-id');
    // default is local, but if there's a timezoneId, we use that
    if (typeof timezoneId === 'string') {
      if (typeof moment.tz !== 'function') {
        throw new Error("If you specify a timezoneId, make sure that you've added a moment-timezone package to your app");
      }
      m = moment.tz(AutoForm.Utility.dateToNormalizedLocalDateAndTimeString(m.toDate()), timezoneId);
      return m.toDate();
    }
    var outMode = this.data('out-mode');
    if (outMode === 'utcDate') {
      return moment.utc([m.year(), m.month(), m.date(), 0, 0, 0, 0]).toDate();
    } else if (outMode === 'utcDateTime') {
      return moment.utc([m.year(), m.month(), m.date(), m.hour(), m.minute(), 0, 0]).toDate();
    } else {
      return m.toDate();
    }
  },
  valueConverters: {
    'string': function (val) {
      return (val instanceof Date) ? val.toString() : val;
    },
    'stringArray': function (val) {
      if (val instanceof Date) {
        return [val.toString()];
      }
      return val;
    },
    'number': function (val) {
      return (val instanceof Date) ? val.getTime() : val;
    },
    'numberArray': function (val) {
      if (val instanceof Date) {
        return [val.getTime()];
      }
      return val;
    },
    'dateArray': function (val) {
      if (val instanceof Date) {
        return [val];
      }
      return val;
    }
  },
  contextAdjust: function (context) {
    if (context.atts.buttonClasses) {
      context.atts['data-has-button'] = true;
    }
    if (context.atts.timezoneId) {
      context.atts['data-timezone-id'] = context.atts.timezoneId;
    }
    delete context.atts.timezoneId;
    if (context.atts.outMode) {
      context.atts['data-out-mode'] = context.atts.outMode;
    }
    delete context.atts.outMode;
    return context;
  }
});

Template.afBootstrapDateTimePicker.helpers({
  atts: function addFormControlAtts() {
    var atts = _.clone(this.atts);
    // Add bootstrap class
    atts = AutoForm.Utility.addClass(atts, 'form-control');
    delete atts.dateTimePickerOptions;
    return atts;
  }
});

Template.afBootstrapDateTimePicker.rendered = function () {
  var $element = this.data.atts.buttonClasses ? this.$('input').parent() : this.$('input');
  var data = this.data;
  var opts = data.atts.dateTimePickerOptions || {};

  // set start date if there's a min in the schema
  if (this.data.min) {
    opts.minDate = this.data.min;
  }

  // set end date if there's a max in the schema
  if (this.data.max) {
    opts.maxDate = this.data.max;
  }

  // instanciate datetimepicker
  var dtp = $element.datetimepicker(opts).data('DateTimePicker');

  // set field value
  if (this.data.value) {
    dtp.date(this.data.value);
  } else {
    dtp.date(null); // clear
  }

  // TODO: https://github.com/Eonasdan/bootstrap-datetimepicker/pull/748
  // var isOpen = false;
  // $element.on('keydown', function(e) {
  //   if (e.keyCode === 40) {
  //     if (!isOpen) {
  //       dtp.show();
  //     }
  //     e.preventDefault();
  //   }
  // });
  // $element.on('show.dp', function(e) {
  //   cl('show');
  //   isOpen = true;
  // });
  // $element.on('hide.dp', function(e) {
  //   cl('hide');
  //   isOpen = false;
  // });
};

Template.afBootstrapDateTimePicker.destroyed = function () {
  var $element = this.data.atts.buttonClasses ? this.$('input').parent() : this.$('input');
  var dtp = $element.data('DateTimePicker');
  if (dtp) {
    dtp.destroy();
  }
};

function utcDateTimeToLocal(utcDateTime) {
  return new Date(
    utcDateTime.getUTCFullYear(),
    utcDateTime.getUTCMonth(),
    utcDateTime.getUTCDate(),
    utcDateTime.getUTCHours(),
    utcDateTime.getUTCMinutes(),
    0, 0);
}

function utcDateToLocal(utcDate) {
  return new Date(
    utcDate.getUTCFullYear(),
    utcDate.getUTCMonth(),
    utcDate.getUTCDate(),
    0, 0, 0, 0);
}
