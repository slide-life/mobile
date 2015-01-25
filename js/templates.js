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



this["SlideMobileTemplates"]["relationships"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"content\">\n  <div class=\"master page\">\n";
  stack1 = this.invokePartial(partials['nav-bar'], '    ', 'nav-bar', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  buffer += "    <ul class=\"list-view\">\n      <li class=\"list-item\">\n        <div class=\"title\"><img class=\"relationship-icon\" src=\"img/mock-relationships/coop.png\">The COOP</div>\n        <div class=\"annotation\"><span class=\"glyphicon glyphicon-menu-right\"></span></div>\n      </li>\n      <li class=\"list-item\">\n        <div class=\"title\"><img class=\"relationship-icon\" src=\"img/mock-relationships/hsa.png\">Harvard Student Agencies</div>\n        <div class=\"annotation\"><span class=\"glyphicon glyphicon-menu-right\"></span></div>\n      </li>\n      <li class=\"list-item\">\n        <div class=\"title\"><img class=\"relationship-icon\" src=\"img/mock-relationships/metlife.png\">MetLife</div>\n        <div class=\"annotation\"><span class=\"glyphicon glyphicon-menu-right\"></span></div>\n      </li>\n    </ul>\n  </div>\n  <div class=\"detail page\">\n";
  stack1 = this.invokePartial(partials['nav-bar'], '    ', 'nav-bar', depth0, undefined, helpers, partials, data);
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    <h5 class=\"relationships-title\">Pending requests</h5>\n    <ul class=\"list-view\">\n      <li class=\"list-item\">\n        <div class=\"title\">Promotions</div>\n        <div class=\"annotation\">25/01/2015</div>\n      </li>\n    </ul>\n    <h5 class=\"relationships-title\">Organisation profile</h5>\n    <ul class=\"list-view\">\n      <li class=\"list-item\">\n        <div class=\"title\">Account number</div>\n        <div class=\"annotation\">1212-5123-1231</div>\n      </li>\n      <li class=\"list-item\">\n        <div class=\"title\">Personal sales assistant</div>\n        <div class=\"annotation\">Heidi: (828) 972-4261</div>\n      </li>\n    </ul>\n    <h5 class=\"relationships-title\">Relationship history</h5>\n    <ul class=\"list-view\">\n      <li class=\"list-item\">\n        <div class=\"title\">Web form</div>\n        <div class=\"annotation\">24/01/2015</div>\n      </li>\n      <li class=\"list-item\">\n        <div class=\"title\">Account renewal form</div>\n        <div class=\"annotation\">27/12/2014</div>\n      </li>\n      <li class=\"list-item\">\n        <div class=\"title\">Signup form</div>\n        <div class=\"annotation\">16/08/2014</div>\n      </li>\n    </ul>\n  </div>\n</div>\n";
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