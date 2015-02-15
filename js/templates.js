Handlebars.registerPartial("nav-bar", Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "    <div class=\"back-button\"><span class=\"glyphicon glyphicon-menu-left\"></span> Back</div>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"nav-bar\">\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.back : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "  <span class=\"title\">"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</span>\n</div>\n";
},"useData":true}));

this["SlideMobileTemplates"] = this["SlideMobileTemplates"] || {};

this["SlideMobileTemplates"]["profile"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, lambda=this.lambda, escapeExpression=this.escapeExpression, functionType="function", helperMissing=helpers.helperMissing;
  return "        <li class=\"list-item\" data-target="
    + escapeExpression(lambda((data && data.key), depth0))
    + ">\n          <div class=\"title\">"
    + escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"description","hash":{},"data":data}) : helper)))
    + "</div>\n          <div class=\"annotation\"><span class=\"glyphicon glyphicon-menu-right\"></span></div>\n        </li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"content\">\n  <div class=\"master page\">\n";
  stack1 = this.invokePartial(partials['nav-bar'], '    ', 'nav-bar', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  buffer += "    <ul class=\"list-view\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.categories : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "    </ul>\n  </div>\n  <div class=\"detail page\">\n";
  stack1 = this.invokePartial(partials['nav-bar'], '    ', 'nav-bar', (depth0 != null ? depth0.detail : depth0), undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    <div class=\"body\"></div>\n  </div>\n</div>\n";
},"usePartial":true,"useData":true});



this["SlideMobileTemplates"]["relationship"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda;
  return "  <li class=\"list-item\" data-target=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n    <div class=\"title\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.conversation : depth0)) != null ? stack1.name : stack1), depth0))
    + "</div>\n    <div class=\"annotation\">"
    + escapeExpression(((helper = (helper = helpers.createdAt || (depth0 != null ? depth0.createdAt : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"createdAt","hash":{},"data":data}) : helper)))
    + "</div>\n  </li>\n";
},"3":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "  <li class=\"list-item\">\n    <div class=\"title\">"
    + escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"description","hash":{},"data":data}) : helper)))
    + "</div>\n    <div class=\"annotation\">"
    + escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"value","hash":{},"data":data}) : helper)))
    + "</div>\n  </li>\n";
},"5":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "  <li class=\"list-item\">\n    <div class=\"title\">"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</div>\n    <div class=\"annotation\">"
    + escapeExpression(((helper = (helper = helpers.updatedAt || (depth0 != null ? depth0.updatedAt : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"updatedAt","hash":{},"data":data}) : helper)))
    + "</div>\n  </li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = this.invokePartial(partials['nav-bar'], '', 'nav-bar', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n<h5 class=\"relationships-title\">Pending requests</h5>\n<ul class=\"list-view\">\n";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 != null ? depth0.relationship : depth0)) != null ? stack1.requests : stack1), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "</ul>\n\n<h5 class=\"relationships-title\">Organization profile</h5>\n<ul class=\"list-view\">\n";
  stack1 = helpers.each.call(depth0, ((stack1 = ((stack1 = (depth0 != null ? depth0.relationship : depth0)) != null ? stack1.vendor : stack1)) != null ? stack1.profile : stack1), {"name":"each","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "</ul>\n\n<h5 class=\"relationships-title\">Relationship history</h5>\n<ul class=\"list-view\">\n";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 != null ? depth0.relationship : depth0)) != null ? stack1.conversations : stack1), {"name":"each","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</ul>\n";
},"usePartial":true,"useData":true});



this["SlideMobileTemplates"]["relationships"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda;
  return "      <li class=\"list-item\" data-target=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n          <div class=\"title\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.vendor : depth0)) != null ? stack1.name : stack1), depth0))
    + "</div>\n          <div class=\"annotation\"><span class=\"glyphicon glyphicon-menu-right\"></span></div>\n        </li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"content\">\n  <div class=\"master page\">\n";
  stack1 = this.invokePartial(partials['nav-bar'], '    ', 'nav-bar', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  buffer += "    <ul class=\"list-view\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.relationships : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    </ul>\n  </div>\n\n  <div class=\"detail page\">\n  </div>\n</div>\n";
},"usePartial":true,"useData":true});



this["SlideMobileTemplates"]["requests"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, lambda=this.lambda, escapeExpression=this.escapeExpression, functionType="function", helperMissing=helpers.helperMissing;
  return "        <li class=\"list-item\" data-target="
    + escapeExpression(lambda((data && data.index), depth0))
    + ">\n          <div class=\"title\">"
    + escapeExpression(((helper = (helper = helpers.form || (depth0 != null ? depth0.form : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"form","hash":{},"data":data}) : helper)))
    + "</div>\n          <div class=\"annotation\"><span class=\"glyphicon glyphicon-menu-right\"></span></div>\n        </li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"content\">\n  <div class=\"master page\">\n";
  stack1 = this.invokePartial(partials['nav-bar'], '    ', 'nav-bar', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  buffer += "    <ul class=\"list-view\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.requests : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "    </ul>\n  </div>\n  <div class=\"detail page\">\n";
  stack1 = this.invokePartial(partials['nav-bar'], '    ', 'nav-bar', (depth0 != null ? depth0.detail : depth0), undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    <div class=\"body\"></div>\n  </div>\n</div>\n";
},"usePartial":true,"useData":true});