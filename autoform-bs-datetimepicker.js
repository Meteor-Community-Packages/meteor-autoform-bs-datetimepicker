AutoForm.addInputType("bootstrap-datetimepicker", {
  template: "afBootstrapDateTimePicker",
  valueOut: function () {
    var m = this.data("DateTimePicker").getDate();
    
    if (!m) {
      return m;
    }
    
    var timezoneId = this.attr("data-timezone-id");
    // default is local, but if there's a timezoneId, we use that
    if (typeof timezoneId === "string") {
      if (typeof moment.tz !== "function") {
        throw new Error("If you specify a timezoneId, make sure that you've added a moment-timezone package to your app");
      }
      m = moment.tz(AutoForm.Utility.dateToNormalizedLocalDateAndTimeString(m.toDate()), timezoneId);
    }
    return m.toDate();
  },
  valueConverters: {
    "string": function (val) {
      return (val instanceof Date) ? val.toString() : val;
    },
    "stringArray": function (val) {
      if (val instanceof Date) {
        return [val.toString()];
      }
      return val;
    },
    "number": function (val) {
      return (val instanceof Date) ? val.getTime() : val;
    },
    "numberArray": function (val) {
      if (val instanceof Date) {
        return [val.getTime()];
      }
      return val;
    },
    "dateArray": function (val) {
      if (val instanceof Date) {
        return [val];
      }
      return val;
    }
  },
  contextAdjust: function (context) {
    if (context.atts.timezoneId) {
      context.atts["data-timezone-id"] = context.atts.timezoneId;
    }
    delete context.atts.timezoneId;
    return context;
  }
});

Template.afBootstrapDateTimePicker.helpers({
  atts: function addFormControlAtts() {
    var atts = _.clone(this.atts);
    // Add bootstrap class
    atts = AutoForm.Utility.addClass(atts, "form-control");
    return atts;
  }
});

Template.afBootstrapDateTimePicker.rendered = function () {
  var $input = this.$('input');
  var data = this.data;
  var opts = data.atts.dateTimePickerOptions || {};
  
  // To be able to properly detect a cleared field, the defaultDate,
  // which is "" by default, must be null instead. Otherwise we get
  // the current datetime when we call getDate() on an empty field.
  if (!opts.defaultDate || opts.defaultDate === "") {
    opts.defaultDate = null;
  }

  // instanciate datetimepicker
  $input.datetimepicker(opts);

  // set and reactively update values
  this.autorun(function () {
    var data = Template.currentData();
    var dtp = $input.data("DateTimePicker");

    // set field value
    if (data.value instanceof Date) {
      dtp.setDate(data.value);
    } else {
      dtp.setDate(); // clear
    }

    // set start date if there's a min in the schema
    if (data.min instanceof Date) {
      dtp.setMinDate(data.min);
    }

    // set end date if there's a max in the schema
    if (data.max instanceof Date) {
      dtp.setMaxDate(data.max);
    }
  });

};

Template.afBootstrapDatepicker.destroyed = function () {
  this.$('input').data("DateTimePicker").destroy();
};
