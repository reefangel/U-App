# DatePicker Plugin for Cordova/PhoneGap 3.0 (iOS and Android)

This is a combined version of DatePicker iOS and Android plugin for Cordova/Phonegap 3.0.
- Original iOS version: https://github.com/sectore/phonegap3-ios-datepicker-plugin

- Original Android version: https://github.com/bikasv/cordova-android-plugins/tree/master/datepicker

## Installation

1) Make sure that you have [Node](http://nodejs.org/) and [Cordova CLI](https://github.com/apache/cordova-cli) or [PhoneGap's CLI](https://github.com/mwbrooks/phonegap-cli) installed on your machine.

2) Add a plugin to your project using Cordova CLI:

```bash
cordova plugin add https://github.com/VitaliiBlagodir/cordova-plugin-datepicker
```
Or using PhoneGap CLI:

```bash
phonegap local plugin add https://github.com/VitaliiBlagodir/cordova-plugin-datepicker
```

## Usage

```js
var options = {
  date: new Date(),
  mode: 'date'
};

datePicker.show(options, function(date){
  alert("date result " + date);  
});
```

## Options

### mode - iOS, Android
The mode of the date picker.

Type: String

Values: `date` | `time` | `datetime` (iOS only)

Default: `date`

### date - iOS, Android
Selected date.

Type: String

Default: `new Date()`

### minDate - iOS, Android
Minimum date.

Type: Date | empty String

Default: `(empty String)`

### maxDate - iOS, Android
Maximum date.

Type: Date | empty String

Default: `(empty String)` 

### allowOldDates - iOS
Shows or hide dates earlier then selected date.

Type: Boolean

Values: `true` | `false`

Default: `true`

### allowFutureDates - iOS
Shows or hide dates after selected date.

Type: Boolean

Values: `true` | `false`

Default: `true`

### doneButtonLabel - iOS
Label of done button.

Typ: String

Default: `Done`

### doneButtonColor - iOS
Hex color of done button.

Typ: String

Default: `#0000FF`

### cancelButtonLabel - iOS
Label of cancel button.

Type: String

Default: `Cancel`

### cancelButtonColor - iOS
Hex color of cancel button.

Type: String

Default: `#000000`

### x - iOS (iPad only)
X position of date picker. The position is absolute to the root view of the application.

Type: String

Default: `0`

### y - iOS (iPad only)
Y position of date picker. The position is absolute to the root view of the application.

Type: String

Default: `0`

## Requirements
- PhoneGap 3.0 or newer / Cordova 3.0 or newer
- Android 2.3.1 or newer / iOS 5 or newer

## Example

```js
var options = {
  date: new Date(),
  mode: 'date'
};

datePicker.show(options, function(date){
  alert("date result " + date);  
});
```