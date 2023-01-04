var isRelease = false;
if(isRelease){
	console.log = console.warn = console.error = function(){}
}
window.Console = {
	success: "background: white; color: green; font-size: 15px;",
	error: "background: white; color: red; font-size: 15px;"
}
Array.prototype.Contains = String.prototype.Contains = function(element){
	return this.indexOf(element) > -1;
}
Array.prototype.serializeArrayToObject = function(){
	var ret = {}
	for (var i = 0; i < this.length; i++) {
		ret[this[i].name] = this[i].value;
	}
	return ret;
}
Number.prototype.Compare = function(num){
	return Math.abs(this - num);
}
Object.size = function(obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
}
String.prototype.isHTML = function() {
  var str = this, doc = new DOMParser().parseFromString(str, "text/html");
  try {
  	var ret = Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
  } catch(err){
  	var ret = false;
  }
  return ret;
}
String.prototype.isValidNik = function(birthDate, gender){
	var verify, day, date = moment(birthDate);
	if (gender == "F"){
		day = date.date() + 40;
	}else{
		day = date.date();
	}
	if (day < 10){
		day = "0" + day;
	}
	verify = day + date.format("MMYY") == this.substr(6, 6);
	return verify;
}
String.prototype.getNameFromUrl = function(){
	var name = this.split("/"), name = name[name.length -1], name = decodeURI(name);
	return name;
}
String.prototype.ucfirst = function(){
	return this.charAt(0).toUpperCase() + this.slice(1);
}
String.prototype.lcfirst = function(){
	return this.charAt(0).toLowerCase() + this.slice(1);
}
String.prototype.ucwords = function(){
	return this.toLowerCase().replace(/\b[a-z]/g, function(letter) {
		return letter.toUpperCase();
	});
}
Object.filterObj = function(Obj, Arr){
	var ret = {}
	for (var key in Obj){
		if (Arr.Contains(key)){
			ret[key] = Obj[key]
		}
	}
	return ret;
}